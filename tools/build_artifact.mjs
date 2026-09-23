#!/usr/bin/env node
/* Делает из index.html страницу для публикации как Artifact на claude.ai:
   без <!doctype>/<html>/<head>/<body> (их добавляет площадка), остальные файлы подключаются как есть.
   node tools/build_artifact.mjs <куда-сохранить.html> */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || path.join(ROOT, 'artifact.html');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
const keep = head.split('\n').filter((l) => /<title>|<link rel="stylesheet"/.test(l)).join('\n');
fs.writeFileSync(out, keep + '\n' + body.trim() + '\n');
console.log('Готово:', out);
