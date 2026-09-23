/* Табло ИИ-релизов — дорожки управления (автопрогон и записанные дубли) и экспорт видео.
   Кадры считаются заново в нужном разрешении и сжимаются WebCodecs → MP4 (mp4-muxer). */
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

  /** Дорожка записанного дубля: значения между сэмплами интерполируются. */
  function takeTrack(take) {
    const S = take.samples;
    const duration = take.duration;
    function ctlAt(t) {
      let lo = 0, hi = S.length - 1;
      if (t <= S[0].t) hi = 0;
      else if (t >= S[hi].t) lo = hi;
      else {
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].t <= t) lo = m; else hi = m; }
      }
      const a = S[lo], b = S[Math.min(hi, S.length - 1)];
      const f = b.t > a.t ? clamp((t - a.t) / (b.t - a.t), 0, 1) : 0;
      const lerp = (x, y) => (Number.isFinite(x) && Number.isFinite(y) ? x + (y - x) * f : x);
      const bigJump = Math.abs(b.now - a.now) > 3;   // прыжки не размазываем
      return {
        now: bigJump ? a.now : lerp(a.now, b.now),
        span: lerp(a.span, b.span),
        cam: a.cam,
        camLeft: a.cam === 'free' && b.cam === 'free' ? lerp(a.camLeft, b.camLeft) : a.camLeft,
        hard: !!a.hard,
        enabled: take.sets[a.en],
        hidden: take.hsets[a.hv],
        focus: a.focus, hover: a.hover,
        labels: a.o.labels, scale: a.o.scale, frontier: a.o.frontier, heights: a.o.heights,
        others: a.o.others, labelCount: a.o.labelCount, playheadFrac: 0.8,
      };
    }
    return { ctlAt, duration };
  }

  /** Последовательный источник кадров. Кадры надо запрашивать по порядку: next(i) для i = 0, 1, 2… */
  class FrameSource {
    constructor(tl, track, { fps = 25, grid = 12, scale = 1, makeCanvas } = {}) {
      this.tl = tl; this.track = track; this.fps = fps;
      this.cols = 3840 / grid; this.rows = 2160 / grid;
      this.pitch = Math.max(1, Math.round(grid * scale));
      this.frames = Math.max(1, Math.round(track.duration * fps));
      const mk = makeCanvas || ((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
      this.canvas = mk(this.cols * this.pitch, this.rows * this.pitch);
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
      for (let k = 0; k < 30; k++) { sim.step(0.1, c); this.renderer.draw(null, sim, c, this.cols, this.rows, this.pitch); }
    }
    next(paint = true) {
      this.i++;
      const t = this.i / this.fps;
      const c = this.track.ctlAt(t);
      this.sim.step(1 / this.fps, c);
      this.renderer.draw(paint ? this.ctx : null, this.sim, c, this.cols, this.rows, this.pitch);
      return this.canvas;
    }
  }

  // ---------- выбор кодека ----------
  const CODECS = [
    { codec: 'avc1.640034', mux: 'avc', name: 'H.264 High' },
    { codec: 'avc1.640033', mux: 'avc', name: 'H.264 High' },
    { codec: 'avc1.4d0034', mux: 'avc', name: 'H.264 Main' },
    { codec: 'avc1.42e034', mux: 'avc', name: 'H.264 Baseline' },
    { codec: 'vp09.00.51.08', mux: 'vp9', name: 'VP9' },
    { codec: 'vp09.00.50.08', mux: 'vp9', name: 'VP9' },
  ];

  async function pickCodec(width, height, fps, bitrate) {
    if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') return null;
    for (const c of CODECS) {
      for (const hw of ['prefer-hardware', 'no-preference']) {
        const cfg = { codec: c.codec, width, height, bitrate, framerate: fps, hardwareAcceleration: hw, latencyMode: 'quality', bitrateMode: 'variable' };
        if (c.mux === 'avc') cfg.avc = { format: 'avc' };
        try {
          const r = await VideoEncoder.isConfigSupported(cfg);
          if (r && r.supported) return { ...c, cfg: r.config || cfg, hw };
        } catch (e) { /* пробуем следующий */ }
      }
    }
    return null;
  }

  // Приёмник байтов для mp4-muxer: куски по порядку + умеет переписать уже записанный заголовок
  class ByteSink {
    constructor() { this.parts = []; this.size = 0; }
    write(data, pos) {
      const d = data.slice();
      if (pos === this.size) { this.parts.push({ pos, bytes: d }); this.size += d.length; return; }
      if (pos > this.size) {
        this.parts.push({ pos: this.size, bytes: new Uint8Array(pos - this.size) });
        this.size = pos;
        this.parts.push({ pos, bytes: d }); this.size += d.length;
        return;
      }
      const end = pos + d.length;
      for (const p of this.parts) {
        const pEnd = p.pos + p.bytes.length;
        if (pEnd <= pos) continue;
        if (p.pos >= end) break;
        const s = Math.max(p.pos, pos), e = Math.min(pEnd, end);
        p.bytes.set(d.subarray(s - pos, e - pos), s - p.pos);
      }
      if (end > this.size) {
        const tail = d.subarray(this.size - pos);
        this.parts.push({ pos: this.size, bytes: tail.slice() });
        this.size += tail.length;
      }
    }
    blob(type) { return new Blob(this.parts.map((p) => p.bytes), { type }); }
  }

  /**
   * Кодирует дорожку в MP4.
   * opts: { fps, grid, scale (1 = 4K, 0.5 = Full HD), bitrate, onProgress(done, total, info), signal }
   */
  async function encodeMP4(tl, track, opts) {
    const fps = opts.fps || 25;
    const src = new FrameSource(tl, track, { fps, grid: opts.grid, scale: opts.scale });
    const width = src.canvas.width, height = src.canvas.height;
    const bitrate = Math.round((opts.bitrate || 32) * 1e6 * (opts.scale === 1 ? 1 : 0.35));
    const pick = await pickCodec(width, height, fps, bitrate);
    if (!pick) throw new Error('Этот браузер не умеет кодировать видео (нет WebCodecs). Откройте табло в Chrome или Edge на компьютере.');
    const sink = new ByteSink();
    const muxer = new global.Mp4Muxer.Muxer({
      target: new global.Mp4Muxer.StreamTarget({ onData: (d, p) => sink.write(d, p), chunked: true, chunkSize: 1 << 24 }),
      video: { codec: pick.mux, width, height, frameRate: fps },
      fastStart: false,
      firstTimestampBehavior: 'offset',
    });
    let failure = null;
    const encoder = new VideoEncoder({
      output: (chunk, meta) => { try { muxer.addVideoChunk(chunk, meta); } catch (e) { failure = e; } },
      error: (e) => { failure = e; },
    });
    encoder.configure(pick.cfg);
    const total = src.frames;
    const t0 = performance.now();
    const info = { codec: pick.name, hw: pick.hw, width, height };
    for (let i = 0; i < total; i++) {
      if (opts.signal && opts.signal.aborted) { try { encoder.close(); } catch (e) { /* уже закрыт */ } throw new DOMException('Экспорт отменён', 'AbortError'); }
      if (failure) throw failure;
      const canvas = src.next(true);
      const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps) });
      encoder.encode(frame, { keyFrame: i % (fps * 2) === 0 });
      frame.close();
      while (encoder.encodeQueueSize > 3) await new Promise((r) => setTimeout(r, 2));
      if (i % 3 === 0 || i === total - 1) {
        const el = (performance.now() - t0) / 1000;
        info.eta = ((total - i - 1) * el) / (i + 1);
        opts.onProgress && opts.onProgress(i + 1, total, info);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    await encoder.flush();
    encoder.close();
    if (failure) throw failure;
    muxer.finalize();
    return { blob: sink.blob('video/mp4'), info, frames: total };
  }

  /** Один кадр в PNG в полном 4K (для обложки или проверки). */
  async function framePNG(tl, sim, ctl, grid) {
    const cols = 3840 / grid, rows = 2160 / grid;
    const r = new T.Renderer(tl);
    const c = document.createElement('canvas');
    c.width = cols * grid; c.height = rows * grid;
    // раскладка подписей зависит от предыдущих кадров — прогоняем пару раз на копии состояния
    const shadow = Object.assign(Object.create(Object.getPrototypeOf(sim)), sim, {
      rel: sim.rel.map((s) => Object.assign({}, s, { lab: 1 })),
    });
    for (let k = 0; k < 3; k++) r.draw(null, shadow, ctl, cols, rows, grid);
    for (const s of shadow.rel) s.lab = s.labShown ? 1 : 0;
    r.draw(c.getContext('2d'), shadow, ctl, cols, rows, grid);
    return new Promise((res) => c.toBlob(res, 'image/png'));
  }

  global.TabloExport = { autoTrack, takeTrack, FrameSource, encodeMP4, framePNG, pickCodec, fullView, FINALE_ZOOM, FINALE_HOLD, END_HOLD };
})(typeof window !== 'undefined' ? window : globalThis);
