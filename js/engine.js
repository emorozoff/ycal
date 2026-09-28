/* Табло ИИ-релизов — движок: данные, темп прогона, симуляция и отрисовка.
   Раскладка кадра считается в единицах 4K (3840×2160), холст может быть любого размера 16:9.
   Стили: «сегменты» (гладкие столбики с тонкой нарезкой), «гладкий» и «пиксели» (светодиодное табло). */
(function (global) {
  'use strict';

  // ---------- даты ----------
  const DAY_MS = 86400000;
  const dayOf = (iso) => Math.round(Date.parse(iso + 'T00:00:00Z') / DAY_MS);
  const dateOf = (day) => new Date(Math.floor(day + 1e-6) * DAY_MS);

  const MONTH_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const MONTH_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const MONTH_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  function plural(n, forms) {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }

  const fmt = {
    monthYear(day) { const d = dateOf(day); return MONTH_NOM[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); },
    long(day) { const d = dateOf(day); return d.getUTCDate() + ' ' + MONTH_GEN[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); },
    short(day) { const d = dateOf(day); return d.getUTCDate() + ' ' + MONTH_SHORT[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); },
    monthShort(m) { return MONTH_SHORT[m]; },
  };

  // ---------- цвет ----------
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const WHITE = [255, 255, 255];
  const rgbCss = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  // палитра сцены (тёмное «табло»)
  const PAL = {
    ground: [7, 8, 10],          // фон и зазоры между клетками
    cell: [19, 21, 25],          // незажжённая клетка
    neutral: [82, 88, 98],       // тело столбика «остальных» компаний
    axis: [150, 156, 166],
    text: '#eef0f3',
    text2: '#a9afb9',
    text3: '#6f7682',
  };

  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const approach = (x, target, rate, dt) => x + (target - x) * (1 - Math.exp(-rate * dt));

  // ---------- пиксельные цифры 5×7 для больших счётчиков ----------
  const GLYPHS = {
    '0': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
    '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
    '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
    '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
    '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
    '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
    '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
    '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
    '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  };

  // ======================================================================
  //  Данные
  // ======================================================================
  class Timeline {
    constructor(data) {
      this.meta = data.meta || {};
      this.companies = data.companies.map((c, i) => ({ ...c, order: i, rgb: hexToRgb(c.color) }));
      this.byCompany = Object.fromEntries(this.companies.map((c) => [c.id, c]));
      const tierRank = { flagship: 0, major: 1, minor: 2 };
      this.releases = data.releases
        .filter((r) => this.byCompany[r.company])
        .map((r) => {
          const comp = this.byCompany[r.company];
          return { ...r, id: r.id || (r.company + ':' + r.name), day: dayOf(r.date), comp, main: !!comp.main };
        })
        .sort((a, b) => a.day - b.day || b.main - a.main || (tierRank[a.tier] ?? 3) - (tierRank[b.tier] ?? 3));
      this.releases.forEach((r, i) => (r.idx = i));
      this.byId = Object.fromEntries(this.releases.map((r) => [r.id, r]));
      this.start = dayOf(this.meta.start || '2022-11-20');
      this.end = dayOf(this.meta.today || '2026-09-23');
      const scores = this.releases.map((r) => r.score).filter(Number.isFinite);
      this.scoreMin = scores.length ? Math.min(...scores) : 0;
      this.scoreMax = scores.length ? Math.max(...scores) : 1;
      const m = this.meta.metric || {};
      this.axisMin = m.axisMin ?? Math.floor((this.scoreMin - 6) / 10) * 10;
      this.axisMax = m.axisMax ?? Math.ceil((this.scoreMax + 2) / 10) * 10;
      this.axisStep = m.axisStep ?? 10;
    }
  }

  // ======================================================================
  //  Темп автопрогона: время идёт равномерно
  // ======================================================================
  class Pacing {
    constructor(tl, isVisible, p = {}) {
      this.v = p.v0 ?? 10;              // дней в секунду при скорости 1×
      this.start = tl.start; this.end = tl.end;
      this.intro = p.intro ?? 1.2;
      this.total = this.intro + (this.end - this.start) / this.v;
    }
    dayAt(s) {
      if (s <= this.intro) return this.start;
      return Math.min(this.end, this.start + (s - this.intro) * this.v);
    }
    timeAt(day) {
      if (day <= this.start) return this.intro;
      return this.intro + (Math.min(day, this.end) - this.start) / this.v;
    }
    speedAt() { return this.v; }
  }

  // ======================================================================
  //  Симуляция: всё, что анимируется, живёт здесь и шагает от управляющего состояния (ctl)
  // ======================================================================
  const REVEAL_GAP = 0.32;   // сек между появлениями анонсов — по одному за раз
  const REVEAL_QUEUE = 3;    // больше в очереди (перемотка) — появляются сразу, без анимации
  const OLD = 99;            // «возраст» столбика, который появился без анимации

  class Sim {
    constructor(tl) {
      this.tl = tl;
      // st: 0 — ещё не наступил, 1 — ждёт своей очереди, 2 — на табло
      this.rel = tl.releases.map((r) => ({ r, st: 0, age: -1, vis: 1, off: 0, lab: 0, labShown: false }));
      this.byId = Object.fromEntries(this.rel.map((s) => [s.r.id, s]));
      this.queue = [];
      this.revealT = 1e9;
      this.nowD = tl.start;
      this.viewL = null;
      this.spanD = null;
      this.heightMode = 1;      // 1 — по индексу, 0 — одинаковые
      this.focusA = 0;
      this.focusId = null;
      this.frontY = null;
      this.leaderId = null;
      this.leaderFlash = 0;
      this.counters = {};        // companyId -> {flash}
      this.t = 0;
    }

    isOn(ctl, r) {
      return ctl.enabled[r.company] !== false && !(ctl.hidden && ctl.hidden[r.id]);
    }

    step(dt, ctl) {
      this.t += dt;
      this._lastDt = dt;
      const tl = this.tl;
      // «сейчас»: мелкие шаги — сразу, большие прыжки — плавным подлётом
      const diff = ctl.now - this.nowD;
      if (Math.abs(diff) <= 3 || ctl.snap) this.nowD = ctl.now;
      else this.nowD = approach(this.nowD, ctl.now, 5.5, dt);

      // масштаб — плавно в логарифме
      const spanT = clamp(ctl.span, 30, 4000);
      if (this.spanD == null || ctl.hard) this.spanD = spanT;
      else this.spanD = Math.exp(approach(Math.log(this.spanD), Math.log(spanT), 7, dt));

      // камера
      let leftT;
      if (ctl.cam === 'free' && Number.isFinite(ctl.camLeft)) leftT = ctl.camLeft;
      else {
        const frac = ctl.playheadFrac ?? 0.8;
        leftT = this.nowD + this.spanD * (1 - frac) - this.spanD;
        const minLeft = tl.start - this.spanD * 0.03;
        if (leftT < minLeft) leftT = minLeft;
      }
      if (this.viewL == null || ctl.snap || ctl.hard) this.viewL = leftT;
      else this.viewL = approach(this.viewL, leftT, 12, dt);

      this.heightMode = approach(this.heightMode, ctl.heights === 'equal' ? 0 : 1, 6, dt);
      if (ctl.focus) this.focusId = ctl.focus;
      this.focusA = approach(this.focusA, ctl.focus ? 1 : 0, 8, dt);
      if (!ctl.focus && this.focusA < 0.01) this.focusId = null;

      // анонсы: наступившие встают в очередь и появляются по одному
      for (const s of this.rel) {
        const on = this.isOn(ctl, s.r);
        s.vis = approach(s.vis, on ? 1 : 0, 9, dt);
        if (s.vis < 0.002) s.vis = 0;
        if (s.st === 2 && s.age >= 0 && s.age < OLD) s.age += dt;
        if (s.r.day <= this.nowD + 1e-6) {
          if (s.st === 0) {
            if (on && !ctl.snap) { s.st = 1; this.queue.push(s); }
            else { s.st = 2; s.age = OLD; }
          }
        } else if (s.st !== 0) { s.st = 0; s.age = -1; s.placed = false; }
        s.lab = approach(s.lab, s.labShown ? 1 : 0, 14, dt);
      }
      if (this.queue.some((s) => s.st !== 1)) this.queue = this.queue.filter((s) => s.st === 1);
      while (this.queue.length > REVEAL_QUEUE) { const s = this.queue.shift(); s.st = 2; s.age = OLD; }
      this.revealT += dt;
      if (this.queue.length && this.revealT >= REVEAL_GAP) {
        const s = this.queue.shift();
        s.st = 2; s.age = 0; this.revealT = 0;
        if (s.r.main) (this.counters[s.r.company] || (this.counters[s.r.company] = { flash: 0 })).flash = 1;
      }
      for (const id in this.counters) this.counters[id].flash = Math.max(0, this.counters[id].flash - dt / 1.4);

      // лидер по индексу
      const lead = this.leader(ctl);
      const lid = lead ? lead.id : null;
      if (lid !== this.leaderId) {
        const fresh = lead && this.byId[lid].age >= 0 && this.byId[lid].age < 1.5;
        if (this.leaderId && lid && fresh) this.leaderFlash = 1;
        this.leaderId = lid;
      }
      this.leaderFlash = Math.max(0, this.leaderFlash - dt / 1.6);
    }

    shown(s) { return s.st === 2; }

    lastRelease(companyId, ctl) {
      let best = null;
      for (const s of this.rel) {
        const r = s.r;
        if (r.company !== companyId || s.st !== 2) continue;
        if (ctl.hidden && ctl.hidden[r.id]) continue;
        if (!best || r.day >= best.day) best = r;
      }
      return best;
    }

    leader(ctl) {
      let best = null;
      for (const s of this.rel) {
        const r = s.r;
        if (s.st !== 2 || !Number.isFinite(r.score) || !this.isOn(ctl, r)) continue;
        if (!best || r.score > best.score + 1e-9) best = r;
      }
      return best;
    }

    countVisible(ctl) {
      let n = 0;
      for (const s of this.rel) if (s.st === 2 && this.isOn(ctl, s.r)) n++;
      return n;
    }
  }

  // ======================================================================
  //  Отрисовка
  // ======================================================================
  const FONT = '"Onest", "Segoe UI", system-ui, -apple-system, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  const UW = 3840, UH = 2160;                                  // единицы раскладки: кадр 4K
  const LAY = { pl: 173, pr: 3667, base: 1788, top: 745, hudY: 255, digitTop: 134, legendY: 1998 };
  const COUNTER_W = 560, COUNTER_GAP = 90;
  const STYLES = ['segments', 'smooth', 'pixel'];

  function roundTop(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h));
    c.beginPath();
    c.moveTo(x, y + h);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h);
    c.closePath();
  }

  class Renderer {
    constructor(tl, makeCanvas) {
      this.tl = tl;
      this.mk = makeCanvas || ((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
      this.textW = new Map();
      this.mctx = this.mk(8, 8).getContext('2d');
      this.bars = [];          // прямоугольники столбиков (единицы 4K) — для наведения мышью
      this.cache = {};
    }

    measure(font, text) {
      const k = font + '|' + text;
      let w = this.textW.get(k);
      if (w === undefined) { this.mctx.font = font; w = this.mctx.measureText(text).width; this.textW.set(k, w); }
      return w;
    }

    /** Кадр: раскладка считается всегда (от неё зависят следующие кадры), покраска — если передан ctx. W×H — размер холста. */
    draw(ctx, sim, ctl, W, H) {
      const L = this.layout(sim, ctl);
      if (ctx) this.paint(ctx, sim, ctl, L, W, H);
      return L;
    }

    // ==================================================================
    //  Раскладка (в единицах 4K)
    // ==================================================================
    layout(sim, ctl) {
      const tl = this.tl;
      const style = STYLES.includes(ctl.style) ? ctl.style : 'segments';
      const cell = style === 'pixel' ? (ctl.grid || 12) : 0;
      const f = (w, px, fam = FONT) => `${w} ${px}px ${fam}`;
      const L = { style, cell, f };
      const dt = sim._lastDt || 0.04;
      const { pl, pr, base, top } = LAY;
      const maxH = base - top;
      const span = sim.spanD, viewL = sim.viewL, nowD = sim.nowD;
      const ppd = (pr - pl) / span;                       // единиц на день
      const xOf = (day) => pl + (day - viewL) * ppd;
      const playX = xOf(nowD);
      Object.assign(L, { pl, pr, base, top, maxH, span, viewL, nowD, ppd, playX });

      const heightFrac = (r) => {
        const byScore = Number.isFinite(r.score) ? clamp((r.score - tl.axisMin) / (tl.axisMax - tl.axisMin), 0.02, 1) : 0.35;
        return byScore * sim.heightMode + 0.5 * (1 - sim.heightMode);
      };

      // ---------- столбики: какие видны и где стоят ----------
      let bw, gap;
      if (cell) { bw = cell * (ppd / cell >= 0.5 ? 2 : 1); gap = cell; }
      else { bw = clamp(ppd * 3, 7, 24); gap = Math.max(5, bw * 0.42); }
      const absX = (day) => (day - tl.start) * ppd;
      const items = [];
      const margin = span * 0.08;
      for (const s of sim.rel) {
        if (s.st !== 2 || s.vis <= 0) { s.placed = false; continue; }
        const r = s.r;
        if (r.day < viewL - margin || r.day > viewL + span + margin) { s.placed = false; continue; }
        items.push({ s, d: absX(r.day) - bw / 2, w: bw });
      }
      items.sort((a, b) => a.d - b.d || b.s.r.main - a.s.r.main);
      // без наложений: соседние по дате столбики собираются в кластер, кластер центрируется на своих датах
      const clusters = [];
      for (const it of items) {
        it.off = 0;
        clusters.push({ items: [it], width: it.w + gap, acc: it.d, n: 1, start: it.d });
        while (clusters.length > 1) {
          const b = clusters[clusters.length - 1], a = clusters[clusters.length - 2];
          if (a.start + a.width <= b.start + 1e-6) break;
          for (const x of b.items) { x.off += a.width; a.items.push(x); }
          a.acc += b.acc - b.n * a.width;
          a.n += b.n; a.width += b.width; a.start = a.acc / a.n;
          clusters.pop();
        }
      }
      let prevEnd = -Infinity;
      for (const c of clusters) { c.st = Math.max(c.start, prevEnd); prevEnd = c.st + c.width; }
      // смещение от «честной» даты ограничено (~6 дней): в плотных местах столбики лучше наложатся, чем уедут
      const maxDisp = Math.max(bw + gap, ppd * 6);
      // по возможности не заходим правее курсора «сейчас»
      let limit = absX(nowD) + bw / 2;
      for (let k = clusters.length - 1; k >= 0; k--) {
        const c = clusters[k];
        if (c.st + c.width - gap > limit) {
          let minSt = -Infinity;
          for (const it of c.items) minSt = Math.max(minSt, it.d - maxDisp - it.off);
          c.st = Math.max(limit - (c.width - gap), minSt);
        }
        limit = c.st - gap;
      }
      const shift = pl - absX(viewL);
      for (const c of clusters) {
        for (const it of c.items) {
          const target = clamp(c.st + it.off - it.d, -maxDisp, maxDisp);
          const s = it.s;
          if (!s.placed) { s.off = target; s.placed = true; } else s.off = approach(s.off, target, 10, dt);
          it.x = it.d + s.off + shift;
        }
      }

      const focusOn = sim.focusA > 0.01 && !!sim.focusId;
      const others = ctl.others || 'muted';
      const bars = [];
      for (const it of items) {
        const s = it.s, r = s.r;
        const grow = easeOutCubic(s.age / 0.65);
        const h = heightFrac(r) * maxH * grow * (0.35 + 0.65 * s.vis);
        if (h <= 0.5) continue;
        let alpha = s.vis;
        const isFocus = focusOn && r.id === sim.focusId;
        if (focusOn && !isFocus) alpha *= 1 - 0.7 * sim.focusA;
        const comp = r.comp;
        let body, cap;
        if (r.main) { body = comp.rgb; cap = null; }
        else if (others === 'brand') { body = mix(comp.rgb, PAL.ground, 0.3); cap = comp.rgb; }
        else { body = PAL.neutral; cap = comp.rgb; }
        bars.push({
          s, r, x: it.x, w: it.w, h, alpha, body, cap,
          unknown: !Number.isFinite(r.score) && sim.heightMode > 0.5,
          flash: s.age < 1.8 ? Math.pow(1 - s.age / 1.8, 2) : 0,
          hot: ctl.hover === r.id || isFocus,
          top: base - h,
          z: (r.main ? 1 : 0) + (isFocus ? 2 : 0),
        });
      }
      // при наложении высокие рисуются первыми — их верхушки остаются видны над низкими
      bars.sort((a, b) => (a.z >= 2) - (b.z >= 2) || b.h - a.h || a.z - b.z);
      L.bars = bars; L.bw = bw;
      this.bars = bars.map((d) => ({ id: d.r.id, x0: d.x, x1: d.x + d.w, y0: d.top, y1: base }));

      // ---------- шкала и ось ----------
      L.gridRows = [];
      if (ctl.scale !== false && sim.heightMode > 0.02) {
        for (let v = tl.axisMin + tl.axisStep; v <= tl.axisMax + 1e-6; v += tl.axisStep) {
          L.gridRows.push({ v, y: base - ((v - tl.axisMin) / (tl.axisMax - tl.axisMin)) * maxH });
        }
      }
      L.months = [];
      const d0 = dateOf(viewL), d1 = dateOf(viewL + span);
      for (let y = d0.getUTCFullYear(), m = d0.getUTCMonth(); y < d1.getUTCFullYear() || (y === d1.getUTCFullYear() && m <= d1.getUTCMonth()); m++) {
        if (m > 11) { m = 0; y++; }
        const day = Math.round(Date.UTC(y, m, 1) / DAY_MS);
        const x = xOf(day);
        if (x >= pl && x <= pr) L.months.push({ x, y, m, day });
      }

      // ---------- лидер по индексу ----------
      L.leader = null;
      if (ctl.frontier !== false && sim.heightMode > 0.5) {
        const leader = sim.leader(ctl);
        if (leader) {
          const targetY = base - heightFrac(leader) * maxH;
          sim.frontY = sim.frontY == null ? targetY : approach(sim.frontY, targetY, 9, dt);
          const lb = bars.find((d) => d.r.id === leader.id);
          if (lb || xOf(leader.day) < pl) {
            L.leader = { r: leader, y: sim.frontY, x0: Math.max(lb ? lb.x + lb.w + 6 : pl, pl), x1: Math.min(playX - 4, pr) };
          }
        }
      }

      // ---------- счётчики «дней без релиза» ----------
      L.counters = [];
      L.reserved = [];
      let right = pr;
      const mains = tl.companies.filter((c) => c.main && ctl.enabled[c.id] !== false);
      for (let i = mains.length - 1; i >= 0; i--) {
        const c = mains[i];
        const last = sim.lastRelease(c.id, ctl);
        const days = last ? Math.max(0, Math.floor(nowD - last.day + 1e-6)) : null;
        const st = sim.counters[c.id] || { flash: 0 };
        let sub;
        if (days == null) sub = 'ещё не было релизов';
        else if (days === 0) sub = 'релиз сегодня';
        else sub = plural(days, ['день', 'дня', 'дней']) + ' без релиза';
        L.counters.push({ c, days, txt: days == null ? '—' : String(days), right, flash: st.flash, sub });
        L.reserved.push([right - COUNTER_W - 60, 0, right + 10, 460]);
        right -= COUNTER_W + COUNTER_GAP;
      }

      // ---------- шапка слева ----------
      const hx = pl, hy = LAY.hudY;
      L.hud = { x: hx, y: hy, title: fmt.monthYear(nowD), count: 'Релизов: ' + sim.countVisible(ctl) };
      let hudRight = hx + Math.max(this.measure(f(700, 124), L.hud.title), 400);
      if (L.leader) {
        const pre = 'Лидер по индексу: ';
        const pw = this.measure(f(500, 34), pre), lw = this.measure(f(600, 34), L.leader.r.name);
        L.hud.leader = { pre, pw, lw };
        hudRight = Math.max(hudRight, hx + pw + lw + 60);
      }
      L.reserved.push([0, 0, hudRight + 40, hy + 150]);

      // ---------- легенда ----------
      L.legend = [];
      {
        let x = pl;
        for (const c of tl.companies) {
          if (ctl.enabled[c.id] === false) continue;
          const label = c.legend || c.name;
          L.legend.push({ c, x, label });
          x += 36 + this.measure(f(500, 30), label) + 44;
        }
      }

      // ---------- метка даты над курсором ----------
      L.pill = null;
      if (playX >= pl && playX <= pr) {
        const label = fmt.short(nowD);
        const w = this.measure(f(500, 26, MONO), label) + 28;
        const x = clamp(playX - w / 2, pl, pr - w);
        const y = top - 152;
        L.pill = { label, x, y, w, h: 40 };
        L.reserved.push([x - 6, y - 6, x + w + 6, y + 46]);
      }

      // ---------- подписи столбиков ----------
      L.labels = ctl.labels !== false ? this.placeLabels(sim, ctl, L) : [];
      if (ctl.labels === false) for (const s of sim.rel) s.labShown = false;
      return L;
    }

    placeLabels(sim, ctl, L) {
      const { base, f } = L;
      const tierW = { flagship: 460, major: 200, minor: 0 };
      const cands = [];
      for (const d of L.bars) {
        if (d.alpha < 0.25 || d.h < 10 || d.x + d.w < L.pl || d.x > L.pr) continue;
        const r = d.r, s = d.s;
        const ageDays = L.nowD - r.day;
        let p = (r.main ? 650 : 0) + (tierW[r.tier] ?? 0) + (Number.isFinite(r.score) ? (r.score - this.tl.axisMin) * 4 : 0)
          - (ageDays / L.span) * 1100 + (s.labShown ? 220 : 0) + (s.age < 2 ? 900 : 0);
        const focus = sim.focusA > 0.01 && r.id === sim.focusId;
        if (focus) p += 1e6;
        if (ctl.hover === r.id) p += 1e5;
        cands.push({ d, p, focus });
      }
      cands.sort((a, b) => b.p - a.p);
      const maxLabels = ctl.labelCount ?? 12;
      const placed = L.reserved.map((r) => r.slice());
      const barRects = L.bars.map((d) => [d.x - 4, d.top, d.x + d.w + 4, base]);
      const minY = UH * 0.2;
      const metricShort = (this.tl.meta.metric && this.tl.meta.metric.short) || 'индекс';
      const out = [];
      let count = 0;
      for (const s of sim.rel) s.labShown = false;
      for (const c of cands) {
        if (count >= maxLabels && !c.focus) break;
        const { d } = c;
        const r = d.r, big = c.focus;
        const nameFont = f(big ? 700 : 600, big ? 46 : 32);
        const dateFont = f(400, big ? 28 : 23, MONO);
        let sub = fmt.short(r.day);
        if (big) {
          sub = fmt.long(r.day);
          if (sim.heightMode > 0.5) sub += Number.isFinite(r.score) ? `  ·  ${metricShort} ${r.scoreEst ? '≈' : ''}${Math.round(r.score)}` : '  ·  нет оценки';
        } else if (sim.heightMode > 0.5) sub += Number.isFinite(r.score) ? ` · ${r.scoreEst ? '≈' : ''}${Math.round(r.score)}` : ' · ?';
        const nw = this.measure(nameFont, r.name), sw = this.measure(dateFont, sub);
        const chip = big ? 20 : 16;
        const w = Math.max(nw + chip + 12, sw) + 8;
        const h = big ? 82 : 62;
        const cx = d.x + d.w / 2;
        const x0 = clamp(cx - w / 2, L.pl - 60, L.pr - w);
        let y1 = d.top - 14, ok = false;
        for (let iter = 0; iter < 14; iter++) {
          const rc = [x0, y1 - h, x0 + w, y1];
          if (rc[1] < minY) break;
          let blocker = null;
          for (const q of placed) if (rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1]) { blocker = q; break; }
          if (!blocker) for (const q of barRects) if (rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1]) { blocker = q; break; }
          if (!blocker) { ok = true; break; }
          y1 = blocker[1] - 10;
        }
        if (!ok) continue;
        placed.push([x0 - 10, y1 - h - 6, x0 + w + 10, y1 + 4]);
        d.s.labShown = true;
        count++;
        const a = Math.max(d.s.lab, 0.001) * (sim.focusA > 0.01 && !big ? 1 - 0.6 * sim.focusA : 1);
        out.push({ r, big, x0, y1, h, w, cx, barTop: d.top, chip, nameFont, dateFont, sub, a });
      }
      return out;
    }

    // ==================================================================
    //  Покраска
    // ==================================================================
    canvas(key, w, h) {
      let c = this.cache[key];
      if (!c || c.width !== w || c.height !== h) { c = this.cache[key] = this.mk(w, h); }
      return c;
    }

    background(W, H, style) {
      const key = 'bg:' + W + 'x' + H + ':' + style;
      if (this.cache[key]) return this.cache[key];
      const c = this.mk(W, H), g = c.getContext('2d');
      const s = W / UW;
      g.fillStyle = rgbCss(PAL.ground);
      g.fillRect(0, 0, W, H);
      // едва заметная сетка точек — «табло» без пикселей
      const step = Math.max(4, Math.round(24 * s));
      const tile = this.mk(step, step), t = tile.getContext('2d');
      t.fillStyle = style === 'segments' ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)';
      const r = Math.max(0.6, 1.5 * s);
      t.beginPath(); t.arc(step / 2, step / 2, r, 0, Math.PI * 2); t.fill();
      g.fillStyle = g.createPattern(tile, 'repeat');
      g.fillRect(0, 0, W, H);
      const vg = g.createRadialGradient(W * 0.5, H * 0.45, H * 0.2, W * 0.5, H * 0.5, W * 0.62);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      g.fillStyle = vg;
      g.fillRect(0, 0, W, H);
      this.cache[key] = c;
      return c;
    }

    stripes(W, s) {
      const period = Math.max(3, Math.round(9 * s)), gapPx = Math.max(1, Math.round(2 * s));
      const key = 'stripe:' + period + ':' + gapPx;
      if (!this.cache[key]) {
        const t = this.mk(4, period), g = t.getContext('2d');
        g.fillStyle = '#000';
        g.fillRect(0, period - gapPx, 4, gapPx);
        this.cache[key] = t;
      }
      return this.cache[key];
    }

    paint(ctx, sim, ctl, L, W, H) {
      if (L.style === 'pixel') return this.paintPixel(ctx, sim, ctl, L, W, H);
      const s = W / UW;
      const { pl, pr, base, top, playX } = L;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.drawImage(this.background(W, H, L.style), 0, 0);
      ctx.setTransform(s, 0, 0, s, 0, 0);

      // будущее правее курсора чуть темнее
      if (playX < pr) {
        const x0 = Math.max(playX, pl);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x0, top - 110, pr - x0, base + 60 - (top - 110));
      }
      // сетка шкалы
      ctx.fillStyle = `rgba(150,156,166,${0.1 * sim.heightMode})`;
      for (const g of L.gridRows) ctx.fillRect(pl, g.y - 1, pr - pl, 2);
      // ось времени
      const px = clamp(playX, pl, pr);
      ctx.fillStyle = 'rgba(150,156,166,0.45)';
      ctx.fillRect(pl, base, px - pl, 3);
      ctx.fillStyle = 'rgba(150,156,166,0.16)';
      ctx.fillRect(px, base, pr - px, 3);
      for (const m of L.months) {
        const past = m.x <= playX;
        if (m.m === 0) { ctx.fillStyle = past ? 'rgba(220,224,230,0.8)' : 'rgba(150,156,166,0.35)'; ctx.fillRect(m.x - 1.5, base, 3, 34); }
        else { ctx.fillStyle = past ? 'rgba(150,156,166,0.45)' : 'rgba(150,156,166,0.18)'; ctx.fillRect(m.x - 1, base, 2, 14); }
      }

      // ---------- слой столбиков и цифр счётчиков ----------
      const layer = this.canvas('layer', W, H), lc = layer.getContext('2d');
      lc.setTransform(1, 0, 0, 1, 0, 0);
      lc.globalCompositeOperation = 'source-over';
      lc.globalAlpha = 1;
      lc.clearRect(0, 0, W, H);
      lc.setTransform(s, 0, 0, s, 0, 0);
      lc.save();
      lc.beginPath(); lc.rect(pl, 0, pr - pl, UH); lc.clip();
      for (const b of L.bars) this.paintBar(lc, b, base);
      lc.restore();
      // большие цифры счётчиков
      lc.textBaseline = 'alphabetic';
      lc.textAlign = 'right';
      lc.font = L.f(700, 250);
      for (const k of L.counters) {
        lc.globalAlpha = k.days == null ? 0.35 : 1;
        lc.fillStyle = rgbCss(k.flash > 0 ? mix(k.c.rgb, WHITE, 0.75 * k.flash) : k.c.rgb);
        lc.fillText(k.txt, k.right, LAY.digitTop + 252);
      }
      lc.globalAlpha = 1;
      lc.textAlign = 'left';
      if (L.style === 'segments') {
        lc.setTransform(1, 0, 0, 1, 0, 0);
        lc.globalCompositeOperation = 'destination-out';
        lc.fillStyle = lc.createPattern(this.stripes(W, s), 'repeat');
        lc.fillRect(0, 0, W, H);
        lc.globalCompositeOperation = 'source-over';
      }
      // свечение слоя
      const gw = Math.max(8, Math.round(W / 4)), gh = Math.max(8, Math.round(H / 4));
      const glow = this.canvas('glow', gw, gh), gc = glow.getContext('2d');
      gc.setTransform(1, 0, 0, 1, 0, 0);
      gc.globalCompositeOperation = 'copy';
      if ('filter' in gc) gc.filter = `blur(${Math.max(1, Math.round(10 * s))}px)`;
      gc.drawImage(layer, 0, 0, gw, gh);
      if ('filter' in gc) gc.filter = 'none';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.55;
      ctx.drawImage(glow, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(layer, 0, 0);
      ctx.setTransform(s, 0, 0, s, 0, 0);

      // линия лидера
      if (L.leader && L.leader.x1 > L.leader.x0) {
        const { r, y, x0, x1 } = L.leader;
        const c0 = r.main ? r.comp.rgb : mix(r.comp.rgb, PAL.neutral, 0.35);
        const c = sim.leaderFlash > 0 ? mix(c0, WHITE, 0.5 * sim.leaderFlash) : c0;
        ctx.fillStyle = rgbCss(c, (0.55 + 0.4 * sim.leaderFlash) * sim.heightMode);
        ctx.fillRect(x0, y - 2, x1 - x0, 4);
      }
      // курсор «сейчас»
      if (playX >= pl - 2 && playX <= pr + 2) {
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(playX - 1.5, top - 100, 3, base - top + 100);
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath(); ctx.arc(playX, base + 1.5, 8, 0, Math.PI * 2); ctx.fill();
      }
      // диоды легенды
      for (const g of L.legend) {
        ctx.fillStyle = rgbCss(g.c.rgb);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(g.x, LAY.legendY - 12, 22, 22, 5); else ctx.rect(g.x, LAY.legendY - 12, 22, 22);
        ctx.fill();
      }
      ctx.restore();
      this.paintText(ctx, sim, ctl, L, s);
    }

    paintBar(c, b, base) {
      const x = b.x, w = b.w, h = b.h, y = base - h;
      const r = Math.min(6, w / 3);
      c.globalAlpha = b.alpha;
      if (b.unknown) {
        // нет оценки: полупрозрачный контур
        const col = b.r.main ? b.body : (b.cap || b.body);
        c.fillStyle = rgbCss(col, 0.13);
        roundTop(c, x, y, w, h, r); c.fill();
        c.strokeStyle = rgbCss(col, 0.75);
        c.lineWidth = 3;
        roundTop(c, x + 1.5, y + 1.5, w - 3, h - 1.5, r); c.stroke();
        c.globalAlpha = 1;
        return;
      }
      let col = b.body;
      if (b.hot) col = mix(col, WHITE, 0.18);
      const g = c.createLinearGradient(0, y, 0, base);
      g.addColorStop(0, rgbCss(mix(col, WHITE, 0.22)));
      g.addColorStop(Math.min(0.9, 26 / Math.max(h, 1)), rgbCss(col));
      g.addColorStop(1, rgbCss(mix(col, [0, 0, 0], 0.28)));
      c.fillStyle = g;
      roundTop(c, x, y, w, h, r); c.fill();
      if (b.cap) {
        c.fillStyle = rgbCss(b.hot ? mix(b.cap, WHITE, 0.18) : b.cap);
        roundTop(c, x, y, w, Math.min(h, 16), r); c.fill();
      }
      if (b.flash > 0.01) {
        const fg = c.createLinearGradient(0, y, 0, base);
        fg.addColorStop(0, `rgba(255,255,255,${0.75 * b.flash})`);
        fg.addColorStop(1, `rgba(255,255,255,${0.25 * b.flash})`);
        c.fillStyle = fg;
        roundTop(c, x, y, w, h, r); c.fill();
      }
      c.globalAlpha = 1;
    }

    paintText(ctx, sim, ctl, L, s) {
      const tl = this.tl;
      const { pl, pr, base, top, playX, f } = L;
      const T1 = PAL.text, T2 = PAL.text2, T3 = PAL.text3;
      ctx.save();
      ctx.setTransform(s, 0, 0, s, 0, 0);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';

      // шапка
      const hud = L.hud;
      ctx.font = f(700, 124); ctx.fillStyle = T1;
      ctx.fillText(hud.title, hud.x, hud.y);
      ctx.font = f(500, 40); ctx.fillStyle = T2;
      ctx.fillText(hud.count, hud.x, hud.y + 72);
      if (L.leader && hud.leader) {
        const ly = hud.y + 128;
        ctx.font = f(500, 34); ctx.fillStyle = T3;
        ctx.fillText(hud.leader.pre, hud.x, ly);
        ctx.font = f(600, 34); ctx.fillStyle = sim.leaderFlash > 0 ? '#ffffff' : T1;
        ctx.fillText(L.leader.r.name, hud.x + hud.leader.pw, ly);
        ctx.fillStyle = rgbCss(L.leader.r.comp.rgb);
        ctx.fillRect(hud.x + hud.leader.pw + hud.leader.lw + 18, ly - 24, 22, 22);
      }

      // подписи счётчиков
      ctx.textAlign = 'right';
      for (const k of L.counters) {
        const ly = LAY.digitTop - 22;
        ctx.font = f(600, 38); ctx.fillStyle = T1;
        ctx.fillText(k.c.name, k.right, ly);
        ctx.fillStyle = rgbCss(k.c.rgb);
        const nw = this.measure(f(600, 38), k.c.name);
        ctx.fillRect(k.right - nw - 34, ly - 26, 20, 20);
        ctx.font = f(400, 28); ctx.fillStyle = T3;
        ctx.fillText(k.sub, k.right, LAY.digitTop + 7 * 36 + 44);
      }

      // шкала индекса
      if (L.gridRows.length && sim.heightMode > 0.3) {
        ctx.font = f(500, 24, MONO); ctx.fillStyle = T3;
        ctx.globalAlpha = sim.heightMode;
        for (const g of L.gridRows) ctx.fillText(String(g.v), pl - 12, g.y + 9);
        const mname = (tl.meta.metric && tl.meta.metric.short) || 'индекс';
        ctx.fillText(mname, pl - 12, L.gridRows[L.gridRows.length - 1].y - 36);
        ctx.globalAlpha = 1;
      }

      // подписи оси
      ctx.textAlign = 'center';
      const pxPerMonth = L.ppd * 30.4;
      for (const m of L.months) {
        if (m.m === 0) {
          ctx.font = f(600, 32, MONO);
          ctx.fillStyle = m.x <= playX ? T1 : T3;
          ctx.fillText(String(m.y), m.x, base + 82);
        } else if (pxPerMonth > 120) {
          ctx.font = f(400, 24, MONO);
          ctx.fillStyle = m.x <= playX ? T2 : T3;
          ctx.fillText(fmt.monthShort(m.m), m.x, base + 54);
        }
      }

      // дата над курсором
      if (L.pill) {
        const p = L.pill;
        ctx.fillStyle = 'rgba(12,13,16,0.92)';
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, p.h / 2); else ctx.rect(p.x, p.y, p.w, p.h);
        ctx.fill(); ctx.stroke();
        ctx.font = f(500, 26, MONO); ctx.fillStyle = T1;
        ctx.fillText(p.label, p.x + p.w / 2, p.y + 29);
      }
      ctx.textAlign = 'left';

      // подписи моделей
      for (const lb of L.labels) {
        ctx.globalAlpha = lb.a;
        if (lb.barTop - lb.y1 > 22) {
          ctx.strokeStyle = 'rgba(200,205,214,0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lb.cx, lb.barTop - 6);
          ctx.lineTo(lb.cx, lb.y1 + 2);
          ctx.stroke();
        }
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 12 * s;
        const nameBase = lb.y1 - lb.h + (lb.big ? 44 : 30);
        ctx.fillStyle = rgbCss(lb.r.comp.rgb);
        ctx.fillRect(lb.x0, nameBase - (lb.big ? 30 : 22), lb.chip, lb.chip);
        ctx.font = lb.nameFont;
        ctx.fillStyle = lb.r.main || lb.big ? T1 : '#d3d7de';
        ctx.fillText(lb.r.name, lb.x0 + lb.chip + 12, nameBase);
        ctx.font = lb.dateFont;
        ctx.fillStyle = lb.big ? T2 : T3;
        ctx.fillText(lb.sub, lb.x0, lb.y1 - 6);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // легенда и источник
      ctx.font = f(500, 30);
      for (const g of L.legend) {
        ctx.fillStyle = g.c.main ? T1 : T2;
        ctx.fillText(g.label, g.x + 36, LAY.legendY + 9);
      }
      if (sim.heightMode > 0.5 && tl.meta.metric && tl.meta.metric.caption) {
        ctx.font = f(400, 26); ctx.fillStyle = T3; ctx.textAlign = 'right';
        ctx.fillText(tl.meta.metric.caption, pr, LAY.legendY + 9);
      }
      ctx.restore();
    }

    // ---------- стиль «пиксели»: светодиодное табло из клеток ----------
    ensurePixel(cols, rows, pitch) {
      const key = cols + 'x' + rows + '@' + pitch;
      if (key === this.pkey) return;
      this.pkey = key;
      this.cols = cols; this.rows = rows; this.pitch = pitch;
      const n = cols * rows;
      this.emit = new Float32Array(n * 4);
      this.bg = new Float32Array(n * 3);
      let seed = 1337;
      const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const dx = (x + 0.5) / cols - 0.5, dy = (y + 0.5) / rows - 0.5;
          const vig = 1 - 0.55 * Math.min(1, (dx * dx * 1.2 + dy * dy * 1.6) * 1.6);
          const k = (0.86 + rnd() * 0.24) * vig;
          this.bg[i * 3] = PAL.cell[0] * k; this.bg[i * 3 + 1] = PAL.cell[1] * k; this.bg[i * 3 + 2] = PAL.cell[2] * k;
        }
      }
      const mk = this.mk;
      this.low = mk(cols, rows); this.lowCtx = this.low.getContext('2d');
      this.lowImg = this.lowCtx.createImageData(cols, rows);
      this.pglow = mk(cols, rows); this.pglowCtx = this.pglow.getContext('2d');
      this.glowImg = this.pglowCtx.createImageData(cols, rows);
      this.glowMid = mk(cols * 2, rows * 2); this.glowMidCtx = this.glowMid.getContext('2d');
      const tile = mk(pitch, pitch), t = tile.getContext('2d');
      const gap = pitch >= 6 ? Math.max(1, Math.round(pitch * 0.17)) : 1;
      const r = pitch >= 9 ? Math.max(1, pitch * 0.2) : 0;
      t.fillStyle = rgbCss(PAL.ground);
      t.fillRect(0, 0, pitch, pitch);
      t.globalCompositeOperation = 'destination-out';
      t.beginPath();
      if (r > 0 && t.roundRect) t.roundRect(0, 0, pitch - gap, pitch - gap, r);
      else t.rect(0, 0, pitch - gap, pitch - gap);
      t.fill();
      this.tile = tile;
      this.maskPattern = null;
    }

    put(x, y, c, a) {
      if (a <= 0 || x < 0 || y < 0 || x >= this.cols || y >= this.rows) return;
      if (a > 1) a = 1;
      const i = (y * this.cols + x) * 4, e = this.emit, k = 1 - a;
      e[i] = c[0] * a + e[i] * k;
      e[i + 1] = c[1] * a + e[i + 1] * k;
      e[i + 2] = c[2] * a + e[i + 2] * k;
      e[i + 3] = a + e[i + 3] * k;
    }

    glyphs(text, x, y, s, c, a) {
      let cx = x;
      for (const ch of text) {
        const g = GLYPHS[ch === '—' ? '-' : ch];
        if (g) {
          for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 5; gx++) {
            if (g[gy][gx] !== '1') continue;
            for (let sy = 0; sy < s; sy++) for (let sx = 0; sx < s; sx++) this.put(cx + gx * s + sx, y + gy * s + sy, c, a);
          }
        }
        cx += 6 * s;
      }
    }

    paintPixel(ctx, sim, ctl, L, W, H) {
      const cell = L.cell;
      const cols = Math.round(UW / cell), rows = Math.round(UH / cell);
      const pitch = Math.max(1, Math.round(W / cols));
      this.ensurePixel(cols, rows, pitch);
      const C = (u) => Math.round(u / cell);
      const pl = C(L.pl), pr = C(L.pr) - 1, base = C(L.base), top = C(L.top);
      const playCol = C(L.playX);
      this.emit.fill(0);
      const axis = PAL.axis;

      for (const g of L.gridRows) for (let x = pl; x <= pr; x++) this.put(x, C(g.y), axis, 0.05 * sim.heightMode);
      for (let x = pl; x <= pr; x++) this.put(x, base, axis, x <= playCol ? 0.26 : 0.1);
      for (const m of L.months) {
        const x = C(m.x), past = x <= playCol;
        if (m.m === 0) {
          this.put(x, base + 1, axis, past ? 0.7 : 0.35);
          this.put(x, base + 2, axis, past ? 0.7 : 0.35);
          this.put(x, base + 3, axis, past ? 0.45 : 0.22);
          this.put(x, base, WHITE, past ? 0.55 : 0.25);
        } else this.put(x, base + 1, axis, past ? 0.32 : 0.14);
      }
      for (const b of L.bars) {
        const bx = C(b.x), bwc = Math.max(1, Math.round(b.w / cell));
        const h = b.h / cell;
        const hi = Math.ceil(h);
        const capCells = b.r.main ? 1 : 2;
        const capCol = b.cap || mix(b.body, WHITE, 0.35);
        for (let k = 0; k < hi; k++) {
          const y = base - 1 - k;
          const frac = Math.min(1, h - k);
          let c = k >= hi - capCells ? capCol : b.body;
          if (b.flash > 0) c = mix(c, WHITE, 0.65 * b.flash * (k >= hi - 2 ? 1 : 0.55));
          if (b.hot) c = mix(c, WHITE, 0.18);
          const ka = b.unknown && k < hi - 1 ? (k % 2 ? 0.16 : 0.5) : 1;
          for (let dx = 0; dx < bwc; dx++) {
            const x = bx + dx;
            if (x >= pl && x <= pr) this.put(x, y, c, b.alpha * frac * ka);
          }
        }
      }
      if (L.leader) {
        const { r } = L.leader;
        const y = C(L.leader.y), x0 = Math.max(C(L.leader.x0), pl), x1 = Math.min(playCol - 1, pr);
        const c0 = r.main ? r.comp.rgb : mix(r.comp.rgb, PAL.neutral, 0.35);
        const c = sim.leaderFlash > 0 ? mix(c0, WHITE, 0.5 * sim.leaderFlash) : c0;
        for (let x = x0; x <= x1; x++) this.put(x, y, c, (0.34 + 0.5 * sim.leaderFlash) * sim.heightMode);
      }
      if (playCol >= pl - 1 && playCol <= pr + 1) {
        for (let y = top - 7; y < base; y++) this.put(playCol, y, WHITE, 0.13);
        this.put(playCol, base, WHITE, 0.85);
      }
      const gs = Math.max(1, Math.round(rows / 60));
      for (const k of L.counters) {
        const wcells = k.txt.length * 6 * gs - gs;
        const col = k.flash > 0 ? mix(k.c.rgb, WHITE, 0.75 * k.flash) : k.c.rgb;
        this.glyphs(k.txt, C(k.right) - wcells, C(LAY.digitTop), gs, col, k.days == null ? 0.35 : 1);
      }
      for (const g of L.legend) for (let yy = 0; yy < 2; yy++) for (let xx = 0; xx < 2; xx++) this.put(C(g.x) + xx, C(LAY.legendY) - 1 + yy, g.c.rgb, 1);

      const e = this.emit, bg = this.bg, img = this.lowImg.data, gimg = this.glowImg.data;
      const futTop = top - 10, futBot = base + 6;
      for (let y = 0; y < rows; y++) {
        const inPlot = y >= futTop && y <= futBot;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x, j = i * 4, b3 = i * 3;
          const a = e[j + 3];
          const k = (1 - a) * (inPlot && x > playCol && x >= pl && x <= pr ? 0.62 : 1);
          img[j] = e[j] + bg[b3] * k;
          img[j + 1] = e[j + 1] + bg[b3 + 1] * k;
          img[j + 2] = e[j + 2] + bg[b3 + 2] * k;
          img[j + 3] = 255;
          gimg[j] = e[j]; gimg[j + 1] = e[j + 1]; gimg[j + 2] = e[j + 2]; gimg[j + 3] = 255;
        }
      }
      this.lowCtx.putImageData(this.lowImg, 0, 0);
      this.pglowCtx.putImageData(this.glowImg, 0, 0);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = rgbCss(PAL.ground);
      ctx.fillRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.low, 0, 0, cols * pitch, rows * pitch);
      if (!this.maskPattern || this.maskCtx !== ctx) { this.maskPattern = ctx.createPattern(this.tile, 'repeat'); this.maskCtx = ctx; }
      ctx.fillStyle = this.maskPattern;
      ctx.fillRect(0, 0, cols * pitch, rows * pitch);
      const gm = this.glowMidCtx;
      gm.globalCompositeOperation = 'copy';
      gm.imageSmoothingEnabled = true;
      if ('filter' in gm) gm.filter = 'blur(1.6px)';
      gm.drawImage(this.pglow, 0, 0, cols * 2, rows * 2);
      if ('filter' in gm) gm.filter = 'none';
      ctx.globalCompositeOperation = 'lighter';
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.glowMid, 0, 0, cols * pitch, rows * pitch);
      ctx.globalAlpha = 0.22;
      ctx.drawImage(this.pglow, 0, 0, cols * pitch, rows * pitch);
      ctx.restore();
      this.paintText(ctx, sim, ctl, L, (cols * pitch) / UW);
    }

    hitTest(ux, uy) {
      for (let i = this.bars.length - 1; i >= 0; i--) {
        const b = this.bars[i];
        if (ux >= b.x0 - 8 && ux <= b.x1 + 8 && uy >= b.y0 - 60 && uy <= b.y1 + 6) return b.id;
      }
      return null;
    }
  }

  global.Tablo = { Timeline, Pacing, Sim, Renderer, fmt, dayOf, dateOf, plural, PAL, hexToRgb, FONT, MONO, UW, UH, STYLES };
})(typeof window !== 'undefined' ? window : globalThis);
