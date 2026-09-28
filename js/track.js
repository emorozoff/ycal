/* Табло ИИ-релизов — дорожка автопрогона (время → управляющее состояние) и последовательный источник кадров.
   Нужны пульту (финальный отъезд камеры) и tools/render.mjs (рендер видео через ffmpeg). */
(function (global) {
  'use strict';
  const T = global.Tablo;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const FINALE_ZOOM = 3.2;   // сек: отъезд камеры на весь период
  const FINALE_HOLD = 4.0;   // сек: финальный общий план
  const END_HOLD = 2.0;      // сек: пауза в конце без отъезда

  function fullView(tl) {
    const span = (tl.end - tl.start) * 1.04 + 20;
    return { span, left: tl.start - (tl.end - tl.start) * 0.015 };
  }

  /** Дорожка автопрогона: время → управляющее состояние. */
  function autoTrack(tl, st) {
    const isOn = (r) => st.enabled[r.company] !== false && !(st.hidden && st.hidden[r.id]);
    const pacing = new T.Pacing(tl, isOn);
    const speed = st.speed || 1;
    const runT = pacing.total / speed;
    const fin = fullView(tl);
    const duration = runT + (st.finale ? FINALE_ZOOM + FINALE_HOLD : END_HOLD);
    const baseCtl = () => ({
      span: st.span, cam: 'follow', camLeft: null, enabled: st.enabled, hidden: st.hidden || {},
      focus: null, hover: null, labels: st.labels, scale: st.scale, frontier: st.frontier,
      heights: st.heights, others: st.others, labelCount: st.labelCount, playheadFrac: 0.8,
      style: st.style, grid: st.grid,
    });
    function ctlAt(t) {
      const c = baseCtl();
      if (t <= runT) { c.now = pacing.dayAt(t * speed); return c; }
      c.now = tl.end;
      if (st.finale) {
        const p = ease(clamp((t - runT) / FINALE_ZOOM, 0, 1));
        const followLeft = tl.end - st.span * 0.8;
        c.span = Math.exp(Math.log(st.span) + (Math.log(fin.span) - Math.log(st.span)) * p);
        c.cam = 'free';
        c.hard = true;
        c.camLeft = followLeft + (fin.left - followLeft) * p;
      }
      return c;
    }
    return { ctlAt, duration, pacing, runT };
  }

  /** Последовательный источник кадров. Кадры надо запрашивать по порядку: next(i) для i = 0, 1, 2… */
  class FrameSource {
    constructor(tl, track, { fps = 25, scale = 1, makeCanvas } = {}) {
      this.tl = tl; this.track = track; this.fps = fps;
      this.W = Math.round(3840 * scale); this.H = Math.round(2160 * scale);
      this.frames = Math.max(1, Math.round(track.duration * fps));
      const mk = makeCanvas || ((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
      this.canvas = mk(this.W, this.H);
      this.ctx = this.canvas.getContext('2d');
      this.sim = new T.Sim(tl);
      this.renderer = new T.Renderer(tl, mk);
      this.i = -1;
      this.warm();
    }
    warm() {
      // «прогреваем» симуляцию до первого кадра, чтобы уже вышедшие модели стояли на месте
      const c0 = this.track.ctlAt(0);
      const sim = this.sim, tl = this.tl;
      const c = Object.assign({}, c0, { snap: true });
      for (let d = tl.start; d < c0.now; d += 3) { c.now = d; sim.step(0.25, c); }
      c.now = c0.now;
      for (let k = 0; k < 30; k++) { sim.step(0.1, c); this.renderer.draw(null, sim, c, this.W, this.H); }
    }
    next(paint = true) {
      this.i++;
      const t = this.i / this.fps;
      const c = this.track.ctlAt(t);
      this.sim.step(1 / this.fps, c);
      this.renderer.draw(paint ? this.ctx : null, this.sim, c, this.W, this.H);
      return this.canvas;
    }
  }

  global.TabloTrack = { autoTrack, FrameSource, fullView, FINALE_ZOOM, FINALE_HOLD, END_HOLD };
})(typeof window !== 'undefined' ? window : globalThis);
