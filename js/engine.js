/* Табло ИИ-релизов — движок: данные, темп прогона, симуляция и отрисовка пиксельной сетки.
   Всё рисуется в «клетках»: сцена считается в маленьком буфере (одна точка = одна клетка),
   затем растягивается без сглаживания, поверх кладётся маска зазоров между клетками и мягкое свечение.
   Текст рисуется поверх уже в полном разрешении. */
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
  //  Темп автопрогона: время замедляется возле релизов (сильнее — у OpenAI и Anthropic)
  // ======================================================================
  class Pacing {
    constructor(tl, isVisible, p = {}) {
      const step = 0.25;
      const n = Math.ceil((tl.end - tl.start) / step) + 1;
      const dens = new Float64Array(n);
      const sigma = p.sigma ?? 4.5;
      const v0 = p.v0 ?? 48;
      for (const r of tl.releases) {
        if (!isVisible(r)) continue;
        const w = r.main ? (r.tier === 'flagship' ? 4.2 : r.tier === 'major' ? 3.0 : 1.8) : (r.tier === 'flagship' ? 1.3 : r.tier === 'major' ? 0.8 : 0.5);
        const k0 = Math.max(0, Math.floor((r.day - tl.start - 4 * sigma) / step));
        const k1 = Math.min(n - 1, Math.ceil((r.day - tl.start + 4 * sigma) / step));
        for (let k = k0; k <= k1; k++) {
          const x = (tl.start + k * step - r.day) / sigma;
          dens[k] += w * Math.exp(-0.5 * x * x);
        }
      }
      const T = new Float64Array(n);
      for (let k = 1; k < n; k++) {
        const v = v0 / (1 + 0.5 * (dens[k] + dens[k - 1]));
        T[k] = T[k - 1] + step / v;
      }
      this.T = T; this.n = n; this.step = step; this.start = tl.start; this.end = tl.end;
      this.intro = p.intro ?? 1.2;
      this.total = this.intro + T[n - 1];
    }
    dayAt(s) {
      if (s <= this.intro) return this.start;
      s -= this.intro;
      const T = this.T;
      if (s >= T[this.n - 1]) return this.end;
      let lo = 0, hi = this.n - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (T[mid] <= s) lo = mid; else hi = mid; }
      const f = (s - T[lo]) / (T[hi] - T[lo] || 1);
      return this.start + (lo + f) * this.step;
    }
    timeAt(day) {
      if (day <= this.start) return this.intro;
      const x = (day - this.start) / this.step;
      const k = Math.min(this.n - 2, Math.floor(x));
      const f = clamp(x - k, 0, 1);
      return this.intro + this.T[k] + (this.T[k + 1] - this.T[k]) * f;
    }
    speedAt(day) { // дней в секунду при скорости 1×
      const k = clamp(Math.floor((day - this.start) / this.step), 0, this.n - 2);
      return this.step / (this.T[k + 1] - this.T[k] || 1e-6);
    }
  }

  // ======================================================================
  //  Симуляция: всё, что анимируется, живёт здесь и шагает от управляющего состояния (ctl)
  // ======================================================================
  class Sim {
    constructor(tl) {
      this.tl = tl;
      this.rel = tl.releases.map((r) => ({ r, age: -1, vis: 1, off: 0, lab: 0, labShown: false, lastRect: null }));
      this.byId = Object.fromEntries(this.rel.map((s) => [s.r.id, s]));
      this.nowD = tl.start;
      this.viewL = null;
      this.spanD = null;
      this.heightMode = 1;      // 1 — по индексу, 0 — одинаковые
      this.focusA = 0;
      this.focusId = null;
      this.frontY = null;
      this.leaderId = null;
      this.leaderFlash = 0;
      this.counters = {};        // companyId -> {lastId, flash}
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

      for (const s of this.rel) {
        const on = this.isOn(ctl, s.r);
        s.vis = approach(s.vis, on ? 1 : 0, 9, dt);
        if (s.vis < 0.002) s.vis = 0;
        if (s.r.day <= this.nowD + 1e-6) s.age = s.age < 0 ? 0 : s.age + dt;
        else s.age = -1;
        s.lab = approach(s.lab, s.labShown ? 1 : 0, 14, dt);
      }

      // счётчики «дней без релиза» — вспышка при новом релизе
      for (const c of tl.companies) {
        if (!c.main) continue;
        const last = this.lastRelease(c.id, ctl);
        const st = this.counters[c.id] || (this.counters[c.id] = { lastId: null, flash: 0 });
        const id = last ? last.id : null;
        if (id !== st.lastId) { if (id && st.lastId !== undefined && this.nowD - last.day < 2) st.flash = 1; st.lastId = id; }
        st.flash = Math.max(0, st.flash - dt / 1.4);
      }

      // лидер по индексу
      const lead = this.leader(ctl);
      const lid = lead ? lead.id : null;
      if (lid !== this.leaderId) { if (this.leaderId && lid) this.leaderFlash = 1; this.leaderId = lid; }
      this.leaderFlash = Math.max(0, this.leaderFlash - dt / 1.6);
    }

    lastRelease(companyId, ctl) {
      let best = null;
      for (const s of this.rel) {
        const r = s.r;
        if (r.company !== companyId || r.day > this.nowD + 1e-6) continue;
        if (ctl.hidden && ctl.hidden[r.id]) continue;
        best = r;
      }
      return best;
    }

    leader(ctl) {
      let best = null;
      for (const s of this.rel) {
        const r = s.r;
        if (r.day > this.nowD + 1e-6 || !Number.isFinite(r.score) || !this.isOn(ctl, r)) continue;
        if (!best || r.score > best.score + 1e-9) best = r;
      }
      return best;
    }

    countVisible(ctl) {
      let n = 0;
      for (const s of this.rel) if (s.r.day <= this.nowD + 1e-6 && this.isOn(ctl, s.r)) n++;
      return n;
    }
  }

  // ======================================================================
  //  Отрисовка
  // ======================================================================
  const FONT = '"Onest", "Segoe UI", system-ui, -apple-system, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

  class Renderer {
    constructor(tl, makeCanvas) {
      this.tl = tl;
      this.makeCanvas = makeCanvas || ((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
      this.key = '';
      this.textW = new Map();
      this.mctx = this.makeCanvas(8, 8).getContext('2d');
      this.bars = [];          // прямоугольники столбиков в пикселях — для наведения мышью
    }

    ensure(cols, rows, pitch) {
      const key = cols + 'x' + rows + '@' + pitch;
      if (key === this.key) return;
      this.key = key;
      this.cols = cols; this.rows = rows; this.pitch = pitch;
      const n = cols * rows;
      this.emit = new Float32Array(n * 4);
      this.bg = new Float32Array(n * 3);
      // фон: лёгкий шум и виньетка (одинаковые в каждом кадре)
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
      const mk = this.makeCanvas;
      this.low = mk(cols, rows); this.lowCtx = this.low.getContext('2d');
      this.lowImg = this.lowCtx.createImageData(cols, rows);
      this.glow = mk(cols, rows); this.glowCtx = this.glow.getContext('2d');
      this.glowImg = this.glowCtx.createImageData(cols, rows);
      this.glowMid = mk(cols * 2, rows * 2); this.glowMidCtx = this.glowMid.getContext('2d');
      // маска зазоров: плитка размером в клетку, зазор справа и снизу, скруглённые углы
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

    // --- рисование в клетки (цвет с «кроющей» альфой) ---
    put(x, y, c, a) {
      if (a <= 0 || x < 0 || y < 0 || x >= this.cols || y >= this.rows) return;
      if (a > 1) a = 1;
      const i = (y * this.cols + x) * 4, e = this.emit, k = 1 - a;
      e[i] = c[0] * a + e[i] * k;
      e[i + 1] = c[1] * a + e[i + 1] * k;
      e[i + 2] = c[2] * a + e[i + 2] * k;
      e[i + 3] = a + e[i + 3] * k;
    }
    hline(x0, x1, y, c, a) { for (let x = x0; x <= x1; x++) this.put(x, y, c, a); }

    glyphs(text, x, y, s, c, a) { // пиксельный текст, левый верхний угол в клетках
      let cx = x;
      for (const ch of text) {
        const g = GLYPHS[ch];
        if (g) {
          for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 5; gx++) {
            if (g[gy][gx] !== '1') continue;
            for (let sy = 0; sy < s; sy++) for (let sx = 0; sx < s; sx++) this.put(cx + gx * s + sx, y + gy * s + sy, c, a);
          }
        }
        cx += 6 * s;
      }
    }
    glyphsWidth(text, s) { return text.length * 6 * s - s; }

    measure(font, text) {
      const k = font + '|' + text;
      let w = this.textW.get(k);
      if (w === undefined) { this.mctx.font = font; w = this.mctx.measureText(text).width; this.textW.set(k, w); }
      return w;
    }

    /** Кадр: раскладка считается всегда (от неё зависят следующие кадры), покраска — если передан ctx. */
    draw(ctx, sim, ctl, cols, rows, pitch) {
      const L = this.layout(sim, ctl, cols, rows, pitch);
      if (ctx) { this.ensure(cols, rows, pitch); this.paint(ctx, sim, ctl, L); }
      return L;
    }

    // ==================================================================
    //  Раскладка
    // ==================================================================
    layout(sim, ctl, cols, rows, pitch) {
      const tl = this.tl;
      const P = pitch, H = rows * pitch, W = cols * pitch;
      const u = H / 2160;
      const f = (w, px, fam = FONT) => `${w} ${Math.round(px * u)}px ${fam}`;
      const L = { cols, rows, P, u, W, H, f };
      const dt = sim._lastDt || 0.04;

      const pl = Math.round(cols * 0.045), pr = cols - Math.round(cols * 0.045) - 1;
      const base = Math.round(rows * 0.828);
      const top = Math.round(rows * 0.345);
      const maxH = base - top;
      const span = sim.spanD, viewL = sim.viewL, nowD = sim.nowD;
      const cpd = (pr - pl) / span;
      const absX = (day) => (day - tl.start) * cpd;
      const scroll = Math.round(absX(viewL));
      const colOfAbs = (ax) => pl + Math.round(ax) - scroll;
      const playCol = colOfAbs(absX(nowD));
      Object.assign(L, { pl, pr, base, top, maxH, span, viewL, nowD, cpd, playCol });

      const heightFrac = (r) => {
        const byScore = Number.isFinite(r.score) ? clamp((r.score - tl.axisMin) / (tl.axisMax - tl.axisMin), 0.02, 1) : 0.35;
        return byScore * sim.heightMode + 0.5 * (1 - sim.heightMode);
      };

      // ---------- столбики: какие видны и где стоят ----------
      const barW = cpd >= 0.5 ? 2 : 1, gap = 1;
      const items = [];
      const margin = span * 0.08;
      for (const s of sim.rel) {
        if (s.age < 0 || s.vis <= 0) { s.placed = false; continue; }
        const r = s.r;
        if (r.day < viewL - margin || r.day > viewL + span + margin) { s.placed = false; continue; }
        items.push({ s, d: absX(r.day), w: barW });
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
      for (const c of clusters) {
        c.st = Math.max(Math.round(c.start), prevEnd);
        prevEnd = c.st + c.width;
      }
      // смещение от «честной» даты ограничено (~6 дней): в плотных местах столбики лучше наложатся, чем уедут
      const maxDisp = Math.max(2, Math.round(cpd * 6));
      // столбики по возможности не заходят правее курсора «сейчас» — но не дальше допустимого смещения
      let limit = Math.round(absX(nowD)) + 1;
      for (let k = clusters.length - 1; k >= 0; k--) {
        const c = clusters[k];
        if (c.st + c.width - gap > limit) {
          let minSt = -Infinity;
          for (const it of c.items) minSt = Math.max(minSt, Math.ceil(it.d - maxDisp - it.off));
          c.st = Math.max(limit - (c.width - gap), minSt);
        }
        limit = c.st - gap;
      }
      for (const c of clusters) {
        for (const it of c.items) {
          const target = clamp(c.st + it.off - it.d, -maxDisp, maxDisp);
          const s = it.s;
          if (!s.placed) { s.off = target; s.placed = true; } else s.off = approach(s.off, target, 10, dt);
          it.x = colOfAbs(it.d + s.off);
        }
      }

      const focusOn = sim.focusA > 0.01 && !!sim.focusId;
      const others = ctl.others || 'muted';
      const bars = [];
      for (const it of items) {
        const s = it.s, r = s.r;
        const grow = easeOutCubic(s.age / 0.65);
        const h = heightFrac(r) * maxH * grow * (0.35 + 0.65 * s.vis);
        if (h <= 0.05) continue;
        let alpha = s.vis;
        const isFocus = focusOn && r.id === sim.focusId;
        if (focusOn && !isFocus) alpha *= 1 - 0.7 * sim.focusA;
        const comp = r.comp;
        let body, cap, capCells;
        if (r.main) { body = comp.rgb; cap = mix(comp.rgb, WHITE, 0.35); capCells = 1; }
        else if (others === 'brand') { body = mix(comp.rgb, PAL.ground, 0.28); cap = comp.rgb; capCells = 2; }
        else { body = PAL.neutral; cap = comp.rgb; capCells = 2; }
        bars.push({
          s, r, x: it.x, w: it.w, h, alpha, body, cap, capCells, unknown: !Number.isFinite(r.score) && sim.heightMode > 0.5,
          flash: s.age < 1.8 ? Math.pow(1 - s.age / 1.8, 2) : 0,
          hot: ctl.hover === r.id || isFocus,
          topRow: base - Math.ceil(h),
          z: (r.main ? 1 : 0) + (isFocus ? 2 : 0),
        });
      }
      // при наложении высокие рисуются первыми — их верхушки остаются видны над низкими
      bars.sort((a, b) => (a.z >= 2) - (b.z >= 2) || b.h - a.h || a.z - b.z);
      L.bars = bars;
      this.bars = bars.map((d) => ({ id: d.r.id, x0: d.x * P, x1: (d.x + d.w) * P, y0: d.topRow * P, y1: base * P }));

      // ---------- шкала и ось ----------
      L.gridRows = [];
      if (ctl.scale !== false && sim.heightMode > 0.02) {
        for (let v = tl.axisMin + tl.axisStep; v <= tl.axisMax + 1e-6; v += tl.axisStep) {
          L.gridRows.push({ v, y: base - Math.round(((v - tl.axisMin) / (tl.axisMax - tl.axisMin)) * maxH) });
        }
      }
      L.months = [];
      const d0 = dateOf(viewL), d1 = dateOf(viewL + span);
      for (let y = d0.getUTCFullYear(), m = d0.getUTCMonth(); y < d1.getUTCFullYear() || (y === d1.getUTCFullYear() && m <= d1.getUTCMonth()); m++) {
        if (m > 11) { m = 0; y++; }
        const day = Math.round(Date.UTC(y, m, 1) / DAY_MS);
        const x = colOfAbs(absX(day));
        if (x >= pl && x <= pr) L.months.push({ x, y, m, day });
      }

      // ---------- лидер по индексу ----------
      L.leader = null;
      if (ctl.frontier !== false && sim.heightMode > 0.5) {
        const leader = sim.leader(ctl);
        if (leader) {
          const targetRow = base - Math.ceil(heightFrac(leader) * maxH) - 1;
          sim.frontY = sim.frontY == null ? targetRow : approach(sim.frontY, targetRow, 9, dt);
          const lb = bars.find((d) => d.r.id === leader.id);
          const leaderCol = colOfAbs(absX(leader.day));
          if (lb || leaderCol < pl) {
            L.leader = { r: leader, y: Math.round(sim.frontY), x0: Math.max(lb ? lb.x + lb.w + 1 : pl, pl), x1: Math.min(playCol - 1, pr) };
          }
        }
      }

      // ---------- счётчики «дней без релиза» ----------
      const gs = Math.max(1, Math.round(rows / 60));
      const digitTop = Math.round(rows * 0.062);
      const blockW = Math.max(this.glyphsWidth('000', gs) + 4, Math.round(cols * 0.15));
      L.counters = [];
      L.reserved = [];
      let bx = pr;
      const mains = tl.companies.filter((c) => c.main && ctl.enabled[c.id] !== false);
      for (let i = mains.length - 1; i >= 0; i--) {
        const c = mains[i];
        const last = sim.lastRelease(c.id, ctl);
        const days = last ? Math.floor(nowD - last.day + 1e-6) : null;
        const txt = days == null ? '-' : String(days);
        const st = sim.counters[c.id] || { flash: 0 };
        const right = bx, left = bx - blockW + 1;
        const subY = (digitTop + 7 * gs) * P + 44 * u;
        L.counters.push({ c, days, txt, right, left, gs, digitTop, flash: st.flash, subY,
          x: right - this.glyphsWidth(txt, gs) + 1 });
        L.reserved.push([left * P - 60 * u, 0, (right + 1) * P + 10 * u, subY + 20 * u]);
        bx -= blockW + Math.round(cols * 0.025);
      }

      // ---------- шапка слева ----------
      const hx = pl * P, hy = Math.round(rows * 0.118) * P;
      L.hud = { x: hx, y: hy, title: fmt.monthYear(nowD), count: 'Релизов: ' + sim.countVisible(ctl) };
      let hudRight = hx + Math.max(this.measure(f(700, 124), L.hud.title), 400 * u);
      if (L.leader) {
        const pre = 'Лидер по индексу: ';
        const pw = this.measure(f(500, 34), pre), lw = this.measure(f(600, 34), L.leader.r.name);
        L.hud.leader = { pre, pw, lw };
        hudRight = Math.max(hudRight, hx + pw + lw + 60 * u);
      }
      L.reserved.push([0, 0, hudRight + 40 * u, hy + 150 * u]);

      // ---------- легенда ----------
      L.legendRow = Math.round(rows * 0.925);
      L.legend = [];
      {
        let x = pl;
        for (const c of tl.companies) {
          if (ctl.enabled[c.id] === false) continue;
          const label = c.legend || c.name;
          L.legend.push({ c, x, label });
          x += 3 + Math.ceil((this.measure(f(500, 30), label) + 44 * u) / P);
        }
      }

      // ---------- метка даты над курсором ----------
      L.pill = null;
      if (playCol >= pl && playCol <= pr) {
        const label = fmt.short(nowD);
        const w = this.measure(f(500, 26, MONO), label) + 28 * u;
        const x = clamp(playCol * P + P / 2 - w / 2, pl * P, (pr + 1) * P - w);
        const y = (top - 9) * P - 44 * u;
        L.pill = { label, x, y, w, h: 40 * u };
        L.reserved.push([x - 6 * u, y - 6 * u, x + w + 6 * u, y + 46 * u]);
      }

      // ---------- подписи столбиков ----------
      L.labels = ctl.labels !== false ? this.placeLabels(sim, ctl, L) : [];
      if (ctl.labels === false) for (const s of sim.rel) s.labShown = false;
      return L;
    }

    placeLabels(sim, ctl, L) {
      const { P, u, base, f } = L;
      const tierW = { flagship: 460, major: 200, minor: 0 };
      const cands = [];
      for (const d of L.bars) {
        if (d.alpha < 0.25 || d.h < 1 || d.x + d.w - 1 < L.pl || d.x > L.pr) continue;
        const r = d.r, s = d.s;
        const ageDays = L.nowD - r.day;
        let p = (r.main ? 650 : 0) + (tierW[r.tier] ?? 0) + (Number.isFinite(r.score) ? (r.score - this.tl.axisMin) * 4 : 0)
          - (ageDays / L.span) * 1100 + (s.labShown ? 220 : 0) + (s.age < 2 ? 700 : 0);
        const focus = sim.focusA > 0.01 && r.id === sim.focusId;
        if (focus) p += 1e6;
        if (ctl.hover === r.id) p += 1e5;
        cands.push({ d, p, focus });
      }
      cands.sort((a, b) => b.p - a.p);
      const maxLabels = ctl.labelCount ?? 16;
      const placed = L.reserved.map((r) => r.slice());
      const barRects = L.bars.map((d) => [d.x * P - 4 * u, d.topRow * P, (d.x + d.w) * P + 4 * u, base * P]);
      const minY = L.rows * 0.2 * P;
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
        const chip = (big ? 20 : 16) * u;
        const w = Math.max(nw + chip + 12 * u, sw) + 8 * u;
        const h = (big ? 82 : 62) * u;
        const cx = (d.x + d.w / 2) * P;
        const x0 = clamp(cx - w / 2, L.pl * P - 60 * u, (L.pr + 1) * P - w);
        const barTop = d.topRow * P;
        let y1 = barTop - 14 * u, ok = false;
        for (let iter = 0; iter < 14; iter++) {
          const rc = [x0, y1 - h, x0 + w, y1];
          if (rc[1] < minY) break;
          let blocker = null;
          for (const q of placed) if (rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1]) { blocker = q; break; }
          if (!blocker) for (const q of barRects) if (rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1]) { blocker = q; break; }
          if (!blocker) { ok = true; break; }
          y1 = blocker[1] - 10 * u;
        }
        if (!ok) continue;
        placed.push([x0 - 10 * u, y1 - h - 6 * u, x0 + w + 10 * u, y1 + 4 * u]);
        d.s.labShown = true;
        count++;
        const a = Math.max(d.s.lab, 0.001) * (sim.focusA > 0.01 && !big ? 1 - 0.6 * sim.focusA : 1);
        out.push({ r, big, x0, y1, h, w, cx, barTop, chip, nameFont, dateFont, sub, a });
      }
      return out;
    }

    // ==================================================================
    //  Покраска
    // ==================================================================
    paint(ctx, sim, ctl, L) {
      const tl = this.tl;
      const { cols, rows, P, u, W, H, f, pl, pr, base, top, playCol } = L;
      this.emit.fill(0);

      // сетка шкалы
      for (const g of L.gridRows) this.hline(pl, pr, g.y, PAL.axis, 0.05 * sim.heightMode);

      // ось времени
      for (let x = pl; x <= pr; x++) this.put(x, base, PAL.axis, x <= playCol ? 0.26 : 0.1);
      for (const m of L.months) {
        const past = m.x <= playCol;
        if (m.m === 0) {
          this.put(m.x, base + 1, PAL.axis, past ? 0.7 : 0.35);
          this.put(m.x, base + 2, PAL.axis, past ? 0.7 : 0.35);
          this.put(m.x, base + 3, PAL.axis, past ? 0.45 : 0.22);
          this.put(m.x, base, WHITE, past ? 0.55 : 0.25);
        } else this.put(m.x, base + 1, PAL.axis, past ? 0.32 : 0.14);
      }

      // столбики
      for (const b of L.bars) {
        const hi = Math.ceil(b.h);
        for (let k = 0; k < hi; k++) {
          const y = base - 1 - k;
          const frac = Math.min(1, b.h - k);
          let c = k >= hi - b.capCells ? b.cap : b.body;
          if (b.flash > 0) c = mix(c, WHITE, 0.65 * b.flash * (k >= hi - 2 ? 1 : 0.55));
          if (b.hot) c = mix(c, WHITE, 0.18);
          const ka = b.unknown && k < hi - 1 ? (k % 2 ? 0.16 : 0.5) : 1;   // нет оценки — «пунктирный» столбик
          for (let dx = 0; dx < b.w; dx++) {
            const x = b.x + dx;
            if (x >= pl && x <= pr) this.put(x, y, c, b.alpha * frac * ka);
          }
        }
        if (b.flash > 0.05) {
          for (let dx = -2; dx < b.w + 2; dx++) {
            const x = b.x + dx;
            if (x >= pl && x <= pr) this.put(x, base, WHITE, 0.5 * b.flash * (dx < 0 || dx >= b.w ? 0.5 : 1));
          }
        }
      }

      // линия лидера
      if (L.leader) {
        const { r, y, x0, x1 } = L.leader;
        const c0 = r.main ? r.comp.rgb : mix(r.comp.rgb, PAL.neutral, 0.35);
        const c = sim.leaderFlash > 0 ? mix(c0, WHITE, 0.5 * sim.leaderFlash) : c0;
        const a = (0.34 + 0.5 * sim.leaderFlash) * sim.heightMode;
        for (let x = x0; x <= x1; x++) this.put(x, y, c, a);
      }

      // курсор «сейчас»
      if (playCol >= pl - 1 && playCol <= pr + 1) {
        for (let y = top - 7; y < base; y++) this.put(playCol, y, WHITE, 0.13);
        this.put(playCol, base, WHITE, 0.85);
        this.put(playCol, top - 8, WHITE, 0.5);
      }

      // пиксельные счётчики
      for (const b of L.counters) {
        const col = b.flash > 0 ? mix(b.c.rgb, WHITE, 0.75 * b.flash) : b.c.rgb;
        this.glyphs(b.txt, b.x, b.digitTop, b.gs, col, b.days == null ? 0.35 : 1);
      }

      // диоды легенды
      for (const g of L.legend) for (let yy = 0; yy < 2; yy++) for (let xx = 0; xx < 2; xx++) this.put(g.x + xx, L.legendRow - 1 + yy, g.c.rgb, 1);

      // ---------- сборка маленького буфера ----------
      const e = this.emit, bg = this.bg, img = this.lowImg.data, gimg = this.glowImg.data;
      const futTop = top - 10, futBot = base + 6;
      for (let y = 0; y < rows; y++) {
        const inPlot = y >= futTop && y <= futBot;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x, j = i * 4, b = i * 3;
          const a = e[j + 3];
          const k = (1 - a) * (inPlot && x > playCol && x >= pl && x <= pr ? 0.62 : 1);
          img[j] = e[j] + bg[b] * k;
          img[j + 1] = e[j + 1] + bg[b + 1] * k;
          img[j + 2] = e[j + 2] + bg[b + 2] * k;
          img[j + 3] = 255;
          gimg[j] = e[j]; gimg[j + 1] = e[j + 1]; gimg[j + 2] = e[j + 2]; gimg[j + 3] = 255;
        }
      }
      this.lowCtx.putImageData(this.lowImg, 0, 0);
      this.glowCtx.putImageData(this.glowImg, 0, 0);

      // ---------- вывод: клетки, зазоры, свечение ----------
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.low, 0, 0, W, H);
      if (!this.maskPattern || this.maskCtx !== ctx) { this.maskPattern = ctx.createPattern(this.tile, 'repeat'); this.maskCtx = ctx; }
      ctx.fillStyle = this.maskPattern;
      ctx.fillRect(0, 0, W, H);
      const gm = this.glowMidCtx;
      gm.globalCompositeOperation = 'copy';
      gm.imageSmoothingEnabled = true;
      if ('filter' in gm) gm.filter = 'blur(1.6px)';
      gm.drawImage(this.glow, 0, 0, cols * 2, rows * 2);
      if ('filter' in gm) gm.filter = 'none';
      ctx.globalCompositeOperation = 'lighter';
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.glowMid, 0, 0, W, H);
      ctx.globalAlpha = 0.22;
      ctx.drawImage(this.glow, 0, 0, W, H);
      ctx.restore();

      // ---------- текст ----------
      ctx.save();
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      const T1 = PAL.text, T2 = PAL.text2, T3 = PAL.text3;

      // шапка
      const hud = L.hud;
      ctx.font = f(700, 124); ctx.fillStyle = T1;
      ctx.fillText(hud.title, hud.x, hud.y);
      ctx.font = f(500, 40); ctx.fillStyle = T2;
      ctx.fillText(hud.count, hud.x, hud.y + 72 * u);
      if (L.leader && hud.leader) {
        const ly = hud.y + 128 * u;
        ctx.font = f(500, 34); ctx.fillStyle = T3;
        ctx.fillText(hud.leader.pre, hud.x, ly);
        ctx.font = f(600, 34); ctx.fillStyle = sim.leaderFlash > 0 ? '#ffffff' : T1;
        ctx.fillText(L.leader.r.name, hud.x + hud.leader.pw, ly);
        ctx.fillStyle = rgbCss(L.leader.r.comp.rgb);
        ctx.fillRect(hud.x + hud.leader.pw + hud.leader.lw + 18 * u, ly - 24 * u, 22 * u, 22 * u);
      }

      // подписи счётчиков
      ctx.textAlign = 'right';
      for (const b of L.counters) {
        const rx = (b.right + 1) * P;
        const ly = b.digitTop * P - 22 * u;
        ctx.font = f(600, 38); ctx.fillStyle = T1;
        ctx.fillText(b.c.name, rx, ly);
        ctx.fillStyle = rgbCss(b.c.rgb);
        const nw = this.measure(f(600, 38), b.c.name);
        ctx.fillRect(rx - nw - 34 * u, ly - 26 * u, 20 * u, 20 * u);
        ctx.font = f(400, 28); ctx.fillStyle = T3;
        let sub;
        if (b.days == null) sub = 'ещё не было релизов';
        else if (b.days === 0) sub = 'релиз сегодня';
        else sub = plural(b.days, ['день', 'дня', 'дней']) + ' без релиза';
        ctx.fillText(sub, rx, b.subY);
      }

      // шкала индекса
      if (L.gridRows.length && sim.heightMode > 0.3) {
        ctx.font = f(500, 24, MONO); ctx.fillStyle = T3;
        ctx.globalAlpha = sim.heightMode;
        for (const g of L.gridRows) ctx.fillText(String(g.v), (pl - 1) * P, g.y * P + 9 * u);
        const mname = (tl.meta.metric && tl.meta.metric.short) || 'индекс';
        ctx.fillText(mname, (pl - 1) * P, (L.gridRows[L.gridRows.length - 1].y - 3) * P);
        ctx.globalAlpha = 1;
      }

      // подписи оси
      ctx.textAlign = 'center';
      const pxPerMonth = L.cpd * 30.4 * P;
      for (const m of L.months) {
        const cx = m.x * P + P / 2;
        if (m.m === 0) {
          ctx.font = f(600, 32, MONO);
          ctx.fillStyle = m.x <= playCol ? T1 : T3;
          ctx.fillText(String(m.y), cx, (base + 4) * P + 34 * u);
        } else if (pxPerMonth > 120 * u) {
          ctx.font = f(400, 24, MONO);
          ctx.fillStyle = m.x <= playCol ? T2 : T3;
          ctx.fillText(fmt.monthShort(m.m), cx, (base + 2) * P + 30 * u);
        }
      }

      // дата над курсором
      if (L.pill) {
        const p = L.pill;
        ctx.fillStyle = 'rgba(12,13,16,0.92)';
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = Math.max(1, 2 * u);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, p.h / 2); else ctx.rect(p.x, p.y, p.w, p.h);
        ctx.fill(); ctx.stroke();
        ctx.font = f(500, 26, MONO); ctx.fillStyle = T1;
        ctx.fillText(p.label, p.x + p.w / 2, p.y + 29 * u);
      }
      ctx.textAlign = 'left';

      // подписи моделей
      for (const lb of L.labels) {
        ctx.globalAlpha = lb.a;
        if (lb.barTop - lb.y1 > 22 * u) {
          ctx.strokeStyle = 'rgba(200,205,214,0.35)';
          ctx.lineWidth = Math.max(1, 2 * u);
          ctx.beginPath();
          ctx.moveTo(lb.cx, lb.barTop - 6 * u);
          ctx.lineTo(lb.cx, lb.y1 + 2 * u);
          ctx.stroke();
        }
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 12 * u;
        const nameBase = lb.y1 - lb.h + (lb.big ? 44 : 30) * u;
        ctx.fillStyle = rgbCss(lb.r.comp.rgb);
        ctx.fillRect(lb.x0, nameBase - (lb.big ? 30 : 22) * u, lb.chip, lb.chip);
        ctx.font = lb.nameFont;
        ctx.fillStyle = lb.r.main || lb.big ? T1 : '#d3d7de';
        ctx.fillText(lb.r.name, lb.x0 + lb.chip + 12 * u, nameBase);
        ctx.font = lb.dateFont;
        ctx.fillStyle = lb.big ? T2 : T3;
        ctx.fillText(lb.sub, lb.x0, lb.y1 - 6 * u);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // легенда и источник
      ctx.font = f(500, 30);
      for (const g of L.legend) {
        ctx.fillStyle = g.c.main ? T1 : T2;
        ctx.fillText(g.label, (g.x + 3) * P, (L.legendRow + 1) * P - 2 * u);
      }
      if (sim.heightMode > 0.5 && tl.meta.metric && tl.meta.metric.caption) {
        ctx.font = f(400, 26); ctx.fillStyle = T3; ctx.textAlign = 'right';
        ctx.fillText(tl.meta.metric.caption, (pr + 1) * P, (L.legendRow + 1) * P - 2 * u);
      }
      ctx.restore();
    }

    hitTest(px, py) {
      for (let i = this.bars.length - 1; i >= 0; i--) {
        const b = this.bars[i];
        if (px >= b.x0 - 6 && px <= b.x1 + 6 && py >= b.y0 - 40 && py <= b.y1 + 4) return b.id;
      }
      return null;
    }
  }

  global.Tablo = { Timeline, Pacing, Sim, Renderer, fmt, dayOf, dateOf, plural, PAL, hexToRgb, FONT, MONO };
})(typeof window !== 'undefined' ? window : globalThis);
