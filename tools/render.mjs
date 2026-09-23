#!/usr/bin/env node
/* Рендер автопрогона табло в MP4 (H.264, 25 к/с) без браузерного кодека:
   Chromium рисует кадры → PNG → ffmpeg (libx264). Работает в несколько потоков.

   node tools/render.mjs --out tablo-4k.mp4 [--scale 1|0.5] [--grid 12] [--jobs 3] [--crf 16] [--only-main] [--ffmpeg /path/ffmpeg]

   Нужны: Node 18+, пакет playwright (с Chromium) и ffmpeg с libx264. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(p); } catch (e) { /* дальше */ }
  }
  throw new Error('Не найден пакет playwright: npm i -D playwright');
}
const { chromium } = loadPlaywright();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes('--' + name);
const OUT = path.resolve(opt('out', 'tablo.mp4'));
const SCALE = +opt('scale', '1');
const GRID = +opt('grid', '12');
const JOBS = Math.max(1, +opt('jobs', String(Math.min(3, os.cpus().length))));
const CRF = opt('crf', '16');
const FFMPEG = opt('ffmpeg', process.env.FFMPEG || 'ffmpeg');
const ONLY_MAIN = flag('only-main');
const LIMIT = opt('seconds', null);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/tools/render.html`;

const browser = await chromium.launch();
async function openPage() {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('[page]', e.message));
  await page.goto(base);
  const info = await page.evaluate((o) => window.renderSetup(o), { grid: GRID, scale: SCALE, fps: 25, onlyMain: ONLY_MAIN });
  return { page, info };
}

const first = await openPage();
let total = first.info.frames;
if (LIMIT) total = Math.min(total, Math.round(+LIMIT * 25));
console.log(`Кадров: ${total} (${(total / 25).toFixed(1)} с), ${first.info.width}×${first.info.height}, потоков: ${JOBS}`);

function ffmpegFor(file) {
  const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'image2pipe', '-framerate', '25', '-c:v', 'png', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', CRF,
    '-profile:v', 'high', '-level:v', SCALE >= 1 ? '5.1' : '4.2', '-g', '50', '-keyint_min', '25',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-r', '25', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  return p;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tablo-'));
const per = Math.ceil(total / JOBS);
const t0 = Date.now();
let done = 0;
const segs = [];
await Promise.all(Array.from({ length: JOBS }, async (_, k) => {
  const from = k * per, to = Math.min(total, from + per);
  if (from >= to) return;
  const { page } = k === 0 ? first : await openPage();
  const file = path.join(tmp, `seg${k}.mp4`);
  segs[k] = file;
  const ff = ffmpegFor(file);
  const closed = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg: код ' + c)))));
  if (from > 0) await page.evaluate((n) => window.renderSkip(n), from);
  for (let i = from; i < to; i++) {
    const b64 = await page.evaluate(() => window.renderNext());
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    done++;
    if (done % 50 === 0) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r${done}/${total} кадров · ${(done / el).toFixed(1)} к/с · осталось ~${Math.round(((total - done) * el) / done)} с   `);
    }
  }
  ff.stdin.end();
  await closed;
}));
process.stdout.write('\n');
await browser.close();
server.close();

const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, segs.filter(Boolean).map((f) => `file '${f}'`).join('\n'));
await new Promise((res, rej) => {
  const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  p.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg concat: код ' + c))));
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Готово: ${OUT} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} МБ) за ${Math.round((Date.now() - t0) / 1000)} с`);
