/* Табло ИИ-релизов — пульт: воспроизведение, перемотка, фильтры, вид. */
(function () {
  'use strict';
  const T = window.Tablo, K = window.TabloTrack;
  const $ = (s) => document.querySelector(s);
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const tl = new T.Timeline(window.TABLO_DATA);
  const sim = new T.Sim(tl);
  const renderer = new T.Renderer(tl);
  const FULL = K.fullView(tl);
  const SPAN_MIN = 45;
  const SPEEDS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];

  // ---------- настройки (запоминаются в этом браузере) ----------
  const STORE = 'tablo.settings.v3';
  const DEF = {
    enabled: Object.fromEntries(tl.companies.map((c) => [c.id, true])),
    hid: {},                   // ручные включения/выключения отдельных моделей
    labels: true, labelCount: 12, scale: true, frontier: true, heights: 'score', others: 'muted',
    style: 'segments', grid: 12, wheel: 'time', finale: true, span: 420, speed: 1,
  };
  const S = (() => {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { s = {}; }
    const out = Object.assign({}, DEF, s);
    out.enabled = Object.assign({}, DEF.enabled, s.enabled || {});
    out.hid = Object.assign({}, s.hid || {});
    return out;
  })();
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* приватный режим — не страшно */ } };
  const hiddenMap = () => {
    const h = {};
    for (const r of tl.releases) { const o = S.hid[r.id]; if (o === undefined ? r.defaultHidden : o) h[r.id] = true; }
    return h;
  };

  // ---------- управляющее состояние ----------
  const ctl = {
    now: tl.end, span: S.span, cam: 'follow', camLeft: null,
    enabled: S.enabled, hidden: hiddenMap(), focus: null, hover: null,
    labels: S.labels, labelCount: S.labelCount, scale: S.scale, frontier: S.frontier,
    heights: S.heights, others: S.others, style: S.style, grid: S.grid, playheadFrac: 0.8, snap: true,
  };
  const isOn = (r) => ctl.enabled[r.company] !== false && !ctl.hidden[r.id];
  let pacing = new T.Pacing(tl, isOn);
  const play = { on: false, s: pacing.timeAt(ctl.now), speed: S.speed, finale: -1 };

  function rebuildPacing() { pacing = new T.Pacing(tl, isOn); play.s = pacing.timeAt(ctl.now); }

  // ---------- холст ----------
  const stage = $('#stage');
  const canvas = $('#screen');
  const ctx = canvas.getContext('2d');
  function fit() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(320, rect.width * dpr);
    let W, H;
    if (S.style === 'pixel') {
      // в пиксельном стиле холст кратен клеткам, чтобы они были чёткими
      const cols = 3840 / S.grid, rows = 2160 / S.grid;
      const pitch = clamp(Math.round(w / cols), 2, S.grid);
      W = cols * pitch; H = rows * pitch;
    } else {
      W = clamp(Math.round(w), 640, 3840); H = Math.round(W * 9 / 16);
    }
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  }
  new ResizeObserver(() => fit()).observe(stage);

  // ---------- воспроизведение ----------
  function setPlaying(on) {
    if (on && !play.on) {
      if (ctl.now >= tl.end - 0.01 || play.finale >= 0) { play.s = 0; ctl.now = tl.start; ctl.snap = true; }
      play.finale = -1;
      ctl.cam = 'follow'; ctl.camLeft = null; ctl.span = S.span; ctl.hard = false;
      play.s = pacing.timeAt(ctl.now);
      if (ctl.now <= tl.start) play.s = 0;
    }
    play.on = on;
    syncTransport();
  }
  const pause = () => { if (play.on) setPlaying(false); };

  function jumpTo(day, opts = {}) {
    ctl.hard = false;
    ctl.now = clamp(day, tl.start, tl.end);
    if (opts.snap) ctl.snap = true;
    play.s = pacing.timeAt(ctl.now);
    play.finale = -1;
    ctl.cam = 'follow'; ctl.camLeft = null; ctl.span = S.span;
  }

  function advance(dt) {
    if (play.finale >= 0) {
      play.finale += dt;
      const p = ease(clamp(play.finale / K.FINALE_ZOOM, 0, 1));
      const followLeft = tl.end - S.span * 0.8;
      ctl.span = Math.exp(Math.log(S.span) + (Math.log(FULL.span) - Math.log(S.span)) * p);
      ctl.cam = 'free';
      ctl.hard = true;
      ctl.camLeft = followLeft + (FULL.left - followLeft) * p;
      if (play.finale >= K.FINALE_ZOOM) { play.on = false; syncTransport(); }
      return;
    }
    play.s += dt * play.speed;
    ctl.now = pacing.dayAt(play.s);
    if (play.s >= pacing.total) {
      ctl.now = tl.end;
      if (S.finale) play.finale = 0;
      else { play.on = false; syncTransport(); }
    }
  }

  function stepRelease(dir, mainOnly) {
    const list = tl.releases.filter((r) => isOn(r) && (!mainOnly || r.main));
    let target = null;
    if (dir > 0) target = list.find((r) => r.day > ctl.now + 0.01);
    else for (let i = list.length - 1; i >= 0; i--) if (list[i].day < ctl.now - 0.01) { target = list[i]; break; }
    if (!target) return;
    pause();
    jumpTo(target.day);
  }

  function showSpeed() { $('#speedVal').textContent = String(play.speed).replace('.', ',') + '×'; }
  function speedStep(d) {
    let i = SPEEDS.findIndex((s) => s >= play.speed - 1e-9);
    if (i < 0) i = SPEEDS.length - 1;
    play.speed = SPEEDS[clamp(i + d, 0, SPEEDS.length - 1)];
    S.speed = play.speed; save();
    showSpeed();
  }

  // ---------- масштаб ----------
  const zoomEl = $('#zoom');
  const spanToZoom = (s) => Math.round(1000 * (Math.log(s) - Math.log(SPAN_MIN)) / (Math.log(FULL.span) - Math.log(SPAN_MIN)));
  const zoomToSpan = (v) => Math.exp(Math.log(SPAN_MIN) + (v / 1000) * (Math.log(FULL.span) - Math.log(SPAN_MIN)));
  function setSpan(span) {
    ctl.hard = false;
    S.span = clamp(span, SPAN_MIN, FULL.span); save();
    ctl.span = S.span;
    if (play.finale >= 0) { play.finale = -1; ctl.cam = 'follow'; }
    zoomEl.value = spanToZoom(S.span);
  }
  zoomEl.addEventListener('input', () => setSpan(zoomToSpan(+zoomEl.value)));
  $('#bFit').addEventListener('click', () => { setSpan(FULL.span); ctl.cam = 'follow'; });

  // ---------- главный цикл ----------
  let lastT = performance.now();
  function loop(t) {
    const dt = Math.min(0.1, Math.max(0, (t - lastT) / 1000));
    lastT = t;
    if (play.on) advance(dt);
    sim.step(dt, ctl);
    ctl.snap = false;
    renderer.draw(ctx, sim, ctl, canvas.width, canvas.height);
    drawScrub();
    if (document.activeElement !== zoomEl) zoomEl.value = spanToZoom(ctl.span);
    requestAnimationFrame(loop);
  }

  // ---------- мышь и сенсор на табло ----------
  let drag = null;
  const daysPerPx = () => sim.spanD / (canvas.getBoundingClientRect().width * 0.91);
  function canvasPoint(e) {   // точка в единицах кадра 4K
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * T.UW, ((e.clientY - r.top) / r.height) * T.UH];
  }
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, moved: false, now0: ctl.now, left0: sim.viewL };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (drag) {
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; pause(); stage.classList.add('grabbing'); }
      if (drag.moved) {
        const days = dx * daysPerPx();
        if (S.wheel === 'time') { jumpTo(drag.now0 - days, { snap: true }); }
        else { ctl.cam = 'free'; ctl.camLeft = drag.left0 - days; }
      }
      return;
    }
    const [px, py] = canvasPoint(e);
    const id = renderer.hitTest(px, py);
    ctl.hover = id;
    stage.classList.toggle('pointer', !!id);
  });
  stage.addEventListener('pointerleave', () => { if (!drag) ctl.hover = null; });
  const endDrag = (e) => {
    if (!drag) return;
    if (!drag.moved) {
      const [px, py] = canvasPoint(e);
      const id = renderer.hitTest(px, py);
      setFocus(id && id !== ctl.focus ? id : null);
    }
    drag = null;
    stage.classList.remove('grabbing');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', () => { drag = null; stage.classList.remove('grabbing'); });
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { setSpan(S.span * Math.exp(e.deltaY * 0.004)); return; }
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const days = d * daysPerPx() * 0.6;
    if (S.wheel === 'time') { pause(); jumpTo(ctl.now + days, { snap: true }); }
    else { ctl.cam = 'free'; ctl.camLeft = (ctl.cam === 'free' && Number.isFinite(ctl.camLeft) ? ctl.camLeft : sim.viewL) + days; }
  }, { passive: false });

  function setFocus(id) {
    ctl.focus = id;
    renderReleaseStates();
  }

  // ---------- шкала перемотки ----------
  const scrub = $('#scrub');
  const scv = $('#scrubCanvas');
  const sctx = scv.getContext('2d');
  function drawScrub() {
    const rect = scv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const W = Math.round(rect.width * dpr), H = Math.round(rect.height * dpr);
    if (scv.width !== W || scv.height !== H) { scv.width = W; scv.height = H; }
    sctx.clearRect(0, 0, W, H);
    const x = (day) => 8 * dpr + ((day - tl.start) / (tl.end - tl.start)) * (W - 16 * dpr);
    const nowX = x(sim.nowD);
    sctx.font = `${10 * dpr}px ${T.MONO}`;
    sctx.fillStyle = 'rgba(169,175,185,0.55)';
    for (let y = 2023; y <= 2026; y++) {
      const xx = x(T.dayOf(y + '-01-01'));
      sctx.fillRect(xx, H - 14 * dpr, 1 * dpr, 14 * dpr);
      sctx.fillText(String(y), xx + 4 * dpr, H - 4 * dpr);
    }
    for (const r of tl.releases) {
      if (!isOn(r)) continue;
      const xx = x(r.day);
      const past = r.day <= sim.nowD;
      const h = (r.main ? 0.62 : 0.36) * (H - 16 * dpr);
      const c = r.main ? r.comp.rgb : [120, 126, 138];
      sctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${past ? (r.main ? 1 : 0.8) : 0.3})`;
      sctx.fillRect(Math.round(xx), H - 16 * dpr - h, Math.max(1, dpr * (r.main ? 2 : 1)), h);
    }
    sctx.fillStyle = 'rgba(255,255,255,0.08)';
    sctx.fillRect(0, 0, nowX, H);
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(Math.round(nowX) - dpr, 0, 2 * dpr, H);
  }
  let scrubbing = false;
  const scrubTo = (e) => {
    const rect = scv.getBoundingClientRect();
    const f = clamp((e.clientX - rect.left - 8) / (rect.width - 16), 0, 1);
    jumpTo(tl.start + f * (tl.end - tl.start), { snap: true });
  };
  scrub.addEventListener('pointerdown', (e) => { scrubbing = true; pause(); scrub.setPointerCapture(e.pointerId); scrubTo(e); });
  scrub.addEventListener('pointermove', (e) => { if (scrubbing) scrubTo(e); });
  scrub.addEventListener('pointerup', () => { scrubbing = false; });
  scrub.addEventListener('pointercancel', () => { scrubbing = false; });

  // ---------- кнопки транспорта ----------
  const bPlay = $('#bPlay');
  function syncTransport() {
    bPlay.innerHTML = `<svg><use href="#i-${play.on ? 'pause' : 'play'}"/></svg>`;
    bPlay.setAttribute('aria-label', play.on ? 'Пауза' : 'Пуск');
  }
  bPlay.addEventListener('click', () => setPlaying(!play.on));
  $('#bStart').addEventListener('click', () => { pause(); jumpTo(tl.start, { snap: true }); play.s = 0; });
  $('#bEnd').addEventListener('click', () => { pause(); jumpTo(tl.end); });
  $('#bPrev').addEventListener('click', () => stepRelease(-1, false));
  $('#bNext').addEventListener('click', () => stepRelease(1, false));
  $('#bSlower').addEventListener('click', () => speedStep(-1));
  $('#bFaster').addEventListener('click', () => speedStep(1));

  // ---------- H: спрятать пульт, на экране только табло ----------
  function togglePresent(force) {
    const on = force ?? !document.body.classList.contains('present');
    document.body.classList.toggle('present', on);
    requestAnimationFrame(fit);
  }
  let idleTimer = 0;
  document.addEventListener('mousemove', () => {
    document.body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add('idle'), 1600);
  });

  // ---------- клавиатура (по физическим клавишам — работает и в русской раскладке) ----------
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) && e.target.type !== 'range' && e.target.type !== 'checkbox') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    let handled = true;
    switch (e.code) {
      case 'Space': setPlaying(!play.on); break;
      case 'ArrowRight': stepRelease(1, e.shiftKey); break;
      case 'ArrowLeft': stepRelease(-1, e.shiftKey); break;
      case 'BracketRight': pause(); jumpTo(ctl.now + 30.44); break;
      case 'BracketLeft': pause(); jumpTo(ctl.now - 30.44); break;
      case 'ArrowUp': speedStep(1); break;
      case 'ArrowDown': speedStep(-1); break;
      case 'Equal': case 'NumpadAdd': setSpan(S.span / 1.3); break;
      case 'Minus': case 'NumpadSubtract': setSpan(S.span * 1.3); break;
      case 'Digit0': case 'Numpad0': setSpan(FULL.span); break;
      case 'KeyO': setOnlyMain(!mainOnlyNow()); break;
      case 'KeyL': setOpt('labels', !S.labels); break;
      case 'KeyH': togglePresent(); break;
      case 'Home': pause(); jumpTo(tl.start, { snap: true }); play.s = 0; break;
      case 'End': pause(); jumpTo(tl.end); break;
      case 'Escape': if (ctl.focus) setFocus(null); else if (document.body.classList.contains('present')) togglePresent(false); else handled = false; break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  });

  // ---------- компании ----------
  function renderCompanies() {
    const box = $('#companyList');
    box.innerHTML = '';
    for (const c of tl.companies) {
      const row = document.createElement('label');
      row.className = 'company' + (c.main ? ' is-main' : '');
      row.innerHTML = `<span class="sw" style="background:${c.color}"></span>
        <span class="name">${c.legend || c.name}</span>
        <span class="switch"><input type="checkbox" id="co-${c.id}" ${ctl.enabled[c.id] !== false ? 'checked' : ''}><span></span></span>`;
      row.querySelector('input').addEventListener('change', (e) => setCompany(c.id, e.target.checked));
      box.appendChild(row);
    }
  }
  function setCompany(id, on) {
    ctl.enabled[id] = on; S.enabled = ctl.enabled; save();
    rebuildPacing(); renderCompanies(); renderReleaseStates();
  }
  function setOnlyMain(onlyMain) {
    for (const c of tl.companies) ctl.enabled[c.id] = c.main || !onlyMain;
    S.enabled = ctl.enabled; save();
    rebuildPacing(); renderCompanies(); renderReleaseStates();
  }
  const mainOnlyNow = () => tl.companies.every((c) => c.main || ctl.enabled[c.id] === false);
  $('#bAll').addEventListener('click', () => setOnlyMain(false));
  $('#bMainOnly').addEventListener('click', () => setOnlyMain(true));

  // ---------- список релизов ----------
  function renderReleases() {
    const box = $('#relList');
    box.innerHTML = '';
    let year = null;
    for (const r of tl.releases) {
      const y = T.dateOf(r.day).getUTCFullYear();
      if (y !== year) {
        year = y;
        const h = document.createElement('div');
        h.className = 'year'; h.textContent = String(y);
        box.appendChild(h);
      }
      const row = document.createElement('div');
      row.className = 'rel';
      row.dataset.id = r.id;
      row.dataset.q = (r.name + ' ' + r.comp.name + ' ' + (r.comp.legend || '')).toLowerCase();
      const score = Number.isFinite(r.score) ? `${r.scoreEst ? '≈' : ''}${Math.round(r.score)}` : '—';
      row.title = [r.about, r.scoreNote, r.family && r.family.length ? 'В семействе: ' + r.family.join(', ') : ''].filter(Boolean).join('\n');
      row.innerHTML = `<input type="checkbox" aria-label="Показывать ${r.name}">
        <span class="sw" style="background:${r.comp.color}"></span>
        <button class="rel-name" type="button">${r.name}</button>
        <span class="rel-meta">${T.fmt.short(r.day)} · ${score}</span>`;
      row.querySelector('input').addEventListener('change', (e) => {
        S.hid[r.id] = !e.target.checked; save();
        ctl.hidden = hiddenMap();
        rebuildPacing(); renderReleaseStates();
      });
      row.querySelector('.rel-name').addEventListener('click', () => {
        pause();
        jumpTo(r.day);
        setFocus(r.id);
      });
      box.appendChild(row);
    }
    renderReleaseStates();
  }
  function renderReleaseStates() {
    for (const row of document.querySelectorAll('.rel')) {
      const r = tl.byId[row.dataset.id];
      row.querySelector('input').checked = !ctl.hidden[r.id];
      row.classList.toggle('off', !isOn(r));
      row.classList.toggle('focus', ctl.focus === r.id);
    }
  }
  $('#relSearch').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    for (const row of document.querySelectorAll('.rel')) row.hidden = q && !row.dataset.q.includes(q);
    for (const h of document.querySelectorAll('.releases .year')) {
      let el = h.nextElementSibling, any = false;
      while (el && !el.classList.contains('year')) { if (!el.hidden) any = true; el = el.nextElementSibling; }
      h.hidden = !any;
    }
  });

  // ---------- вид ----------
  function setOpt(key, val) {
    S[key] = val; save();
    if (key in ctl) ctl[key] = val;
    if (key === 'grid' || key === 'style') fit();
    syncView();
  }
  function syncView() {
    $('#oLabels').checked = S.labels;
    $('#oScale').checked = S.scale;
    $('#oFrontier').checked = S.frontier;
    $('#oFinale').checked = S.finale;
    $('#oLabelCount').value = S.labelCount;
    $('#oLabelCountVal').textContent = S.labelCount;
    for (const seg of document.querySelectorAll('.seg')) {
      const key = seg.dataset.opt;
      for (const b of seg.querySelectorAll('button')) b.setAttribute('aria-pressed', String(String(S[key]) === b.dataset.v));
    }
    $('#gridOpt').hidden = S.style !== 'pixel';
  }
  $('#oLabels').addEventListener('change', (e) => setOpt('labels', e.target.checked));
  $('#oScale').addEventListener('change', (e) => setOpt('scale', e.target.checked));
  $('#oFrontier').addEventListener('change', (e) => setOpt('frontier', e.target.checked));
  $('#oFinale').addEventListener('change', (e) => setOpt('finale', e.target.checked));
  $('#oLabelCount').addEventListener('input', (e) => setOpt('labelCount', +e.target.value));
  for (const seg of document.querySelectorAll('.seg')) {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const key = seg.dataset.opt;
      setOpt(key, key === 'grid' ? +b.dataset.v : b.dataset.v);
    });
  }
  $('#bReset').addEventListener('click', () => {
    Object.assign(S, JSON.parse(JSON.stringify(DEF)));
    Object.assign(ctl, { enabled: S.enabled, hidden: hiddenMap(), labels: S.labels, labelCount: S.labelCount, scale: S.scale,
      frontier: S.frontier, heights: S.heights, others: S.others, style: S.style, grid: S.grid, span: S.span });
    play.speed = S.speed;
    save(); fit(); rebuildPacing(); syncView(); renderCompanies(); renderReleaseStates(); showSpeed();
    zoomEl.value = spanToZoom(S.span);
  });

  // ---------- вкладки ----------
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => {
      for (const t of document.querySelectorAll('.tab')) {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      }
    });
  }

  // ---------- старт ----------
  async function start() {
    try {
      await Promise.race([
        Promise.all(['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 40px Onest`))
          .concat(['400', '500', '600'].map((w) => document.fonts.load(`${w} 30px "JetBrains Mono"`)))),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch (e) { /* шрифты подтянутся позже */ }
    fit();
    syncView(); syncTransport(); showSpeed();
    zoomEl.value = spanToZoom(S.span);
    renderCompanies(); renderReleases();
    requestAnimationFrame((t) => { lastT = t; loop(t); });
  }
  window.TabloApp = { tl, sim, ctl, play, S };
  start();
})();
