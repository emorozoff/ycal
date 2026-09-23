#!/usr/bin/env python3
"""Собирает js/data.js из проверенных списков релизов (data/releases/*.json)
и индекса возможностей Epoch AI (data/scores/eci_epoch_*.json).

Высота столбика = ECI модели. Если замера ECI нет, берётся оценка:
  • для моделей 2025–2026 — пересчёт из Artificial Analysis Intelligence Index v4.3
    по формуле ECI = 101.45 + 15.02·ln(AA)   (r² = 0.94 на 78 моделях с обоими замерами, ошибка ≈ ±2.2);
  • для моделей до 2025 — оценки по LMArena/AA из gap_estimates (ошибка ≈ ±2.5–3.5);
  • иногда — близкий родственник (указан в note).
Такие значения помечаются scoreEst = true и показываются со знаком «≈».

Запуск:  python3 tools/build_data.py
"""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TODAY = '2026-09-23'

COMPANIES = [
    {'id': 'openai', 'name': 'OpenAI', 'products': 'ChatGPT, GPT, o-серия', 'legend': 'OpenAI · ChatGPT', 'color': '#19aa8e', 'main': True},
    {'id': 'anthropic', 'name': 'Anthropic', 'products': 'Claude', 'legend': 'Anthropic · Claude', 'color': '#e0703c', 'main': True},
    {'id': 'google', 'name': 'Google', 'products': 'Bard, PaLM, Gemini, Gemma', 'legend': 'Google · Gemini', 'color': '#4f8ef7'},
    {'id': 'xai', 'name': 'xAI', 'products': 'Grok', 'legend': 'xAI · Grok', 'color': '#dfe3e8'},
    {'id': 'meta', 'name': 'Meta', 'products': 'Llama, Muse', 'legend': 'Meta · Llama', 'color': '#2fb7e0'},
    {'id': 'deepseek', 'name': 'DeepSeek', 'products': 'V- и R-серии', 'legend': 'DeepSeek', 'color': '#7c6cf5'},
    {'id': 'alibaba', 'name': 'Alibaba', 'products': 'Qwen, Tongyi', 'legend': 'Alibaba · Qwen', 'color': '#c07af2'},
    {'id': 'moonshot', 'name': 'Moonshot AI', 'products': 'Kimi', 'legend': 'Moonshot · Kimi', 'color': '#f0659a'},
    {'id': 'mistral', 'name': 'Mistral AI', 'products': 'Mistral, Mixtral, Magistral', 'legend': 'Mistral', 'color': '#f3b43c'},
]


def aa_to_eci(aa, window='2025+'):
    """Пересчёт индекса Artificial Analysis v4.3 в шкалу ECI (подгонка по моделям, где есть оба замера)."""
    if window == '2025+':
        return 101.448 + 15.0225 * math.log(aa)
    return 77.084 + 25.0923 * math.log(aa)


# Ручное сопоставление: название релиза → откуда брать индекс.
#   eci:  точное имя модели в данных Epoch
#   aa:   значение Artificial Analysis v4.3 (на 18.09.2026) → пересчёт в ECI
#   val:  готовая оценка (из gap_estimates, по LMArena/AA)
#   none: данных нет
#   est:  значение не является прямым замером этой модели
#   show: False — не показывать по умолчанию (модель остаётся в списке пульта)
#   drop: вообще не включать
#   name: короткое имя для табло
MAP = {
    # ---------- OpenAI ----------
    'ChatGPT (GPT-3.5)': {'eci': 'GPT-3.5 Turbo (Jun 2023)', 'est': True, 'note': 'замер GPT-3.5 Turbo (июнь 2023) — ближайшая измеренная версия'},
    'GPT-4': {'eci': 'GPT-4 (Mar 2023)'},
    'GPT-4 Turbo': {'eci': 'GPT-4 Turbo (Nov 2023)'},
    'GPT-4o': {'eci': 'GPT-4o (May 2024)'},
    'o1 pro mode': {'eci': 'o1', 'est': True, 'show': False, 'name': 'o1 pro', 'note': 'как o1: та же модель с бо́льшим бюджетом рассуждений'},
    'codex-1': {'eci': 'o3', 'est': True, 'show': False, 'note': 'как o3: codex-1 — версия o3 для программирования'},
    'GPT-5-Codex': {'val': 149.7, 'note': 'оценка по Artificial Analysis'},
    'GPT-5.1-Codex-Max': {'aa': 23.7, 'note': 'оценка по Artificial Analysis (GPT-5.1 Codex)'},
    'GPT-5.2-Codex': {'aa': 28.5, 'note': 'оценка по Artificial Analysis'},
    'GPT-5.3-Codex-Spark': {'none': True},
    'GPT-5.3 Instant': {'none': True},
    'GPT-6 Sol': {'none': True, 'note': 'вышла 22.09.2026 — замеров ещё нет'},
    'GPT-6 Luna': {'none': True, 'note': 'вышла 22.09.2026 — замеров ещё нет'},
    'GPT-5 pro': {'name': 'GPT-5 Pro'},
    # ---------- Anthropic ----------
    'Claude 1': {'val': 121.0, 'note': 'оценка по LMArena'},
    'Claude Instant': {'aa': 5.03, 'window': '<=2024', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Claude Instant 1.2': {'eci': 'Claude Instant'},
    'Claude 3.5 Sonnet (new)': {'eci': 'Claude 3.5 Sonnet (October 2024)'},
    'Claude Mythos Preview': {'none': True, 'note': 'закрытый доступ для партнёров, публичных замеров нет'},
    'Claude Mythos 5': {'drop': True},
    'Claude Mythos 5.1': {'drop': True},
    'Claude Opus 5.5': {'val': 165.0, 'note': 'вышла 22.09.2026 — замера ECI ещё нет; по заявлению Anthropic — уровень Claude Fable 5.1'},
    # ---------- Google ----------
    'Bard': {'none': True, 'note': 'Bard на LaMDA — замеров нет'},
    'PaLM 2': {'eci': 'PaLM 2-L'},
    'Gemini 1.0 (Pro & Nano)': {'eci': 'Gemini 1.0 Pro', 'name': 'Gemini 1.0'},
    'Gemini 1.0 Ultra (Gemini Advanced)': {'val': 121.4, 'name': 'Gemini 1.0 Ultra', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Gemma': {'eci': 'Gemma 7B'},
    'Grok-1 (open weights)': {'drop': True},
    'CodeGemma': {'none': True},
    'Gemma 2': {'eci': 'Gemma 2 27B'},
    'Gemini 2.0 Flash Thinking': {'eci': 'Gemini 2.0 Flash Thinking (Jan 2025)', 'est': True, 'note': 'замер январской версии'},
    'Gemini 2.0 Flash-Lite': {'aa': 7.41, 'note': 'оценка по Artificial Analysis'},
    'Gemma 3': {'eci': 'Gemma 3 27B'},
    'Gemini 2.5 Pro': {'eci': 'Gemini 2.5 Pro (Mar 2025)'},
    'Gemma 3n': {'none': True},
    'Gemini 2.5 Deep Think': {'none': True},
    'Grok 2.5 (open weights)': {'drop': True},
    'Grok Code Fast 1': {'aa': 14.06, 'note': 'оценка по Artificial Analysis'},
    'Gemini 2.5 Computer Use': {'drop': True},
    'Grok 4.1': {'val': 148.0, 'note': 'оценка по Artificial Analysis'},
    'Grok 4.1 Fast': {'aa': 20.37, 'note': 'оценка по Artificial Analysis'},
    'Gemini 3 Deep Think': {'none': True},
    'Gemini 3 Deep Think (Feb 2026 upgrade)': {'none': True, 'name': 'Gemini 3 Deep Think (фев)'},
    'Gemma 4': {'eci': 'Gemma 4 31B IT'},
    'Gemma 4 12B (Unified)': {'none': True},
    'DiffusionGemma': {'none': True},
    'Grok 4.7': {'none': True, 'note': 'вышла 21.09.2026 — замеров ещё нет'},
    'Grok-1': {'val': 123.0, 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Grok-1.5': {'none': True},
    'Grok-2': {'eci': 'Grok-2 (Dec 2024)', 'est': True, 'note': 'замер декабрьской версии'},
    # ---------- Meta ----------
    'LLaMA': {'eci': 'LLaMA-65B', 'name': 'LLaMA 65B'},
    'Llama 2': {'eci': 'Llama 2-70B', 'name': 'Llama 2 70B'},
    'Code Llama': {'none': True},
    'Code Llama 70B': {'none': True},
    'Llama 3': {'eci': 'Llama 3-70B', 'name': 'Llama 3 70B'},
    'Llama 3.1 (8B/70B/405B)': {'eci': 'Llama 3.1-405B', 'name': 'Llama 3.1 405B'},
    'Llama 3.2': {'eci': 'Llama 3.2 90B', 'name': 'Llama 3.2 90B'},
    'Llama 4 Scout & Maverick': {'eci': 'Llama 4 Maverick', 'name': 'Llama 4'},
    'Code World Model (CWM) 32B': {'drop': True},
    'Muse Glimmer 30B': {'aa': 18.07, 'note': 'оценка по Artificial Analysis'},
    # ---------- DeepSeek ----------
    'DeepSeek Coder': {'eci': 'DeepSeek Coder 33B'},
    'DeepSeekMath 7B': {'drop': True},
    'DeepSeek-V2': {'eci': 'DeepSeek-V2 (MoE-236B, May 2024)'},
    'DeepSeek-Coder-V2': {'aa': 5.98, 'window': '<=2024', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'DeepSeek-V2.5': {'val': 127.0, 'note': 'оценка по LMArena'},
    'DeepSeek-R1-Lite-Preview': {'none': True},
    'DeepSeek-V3-0324': {'eci': 'DeepSeek-V3 (Mar 2025)'},
    'DeepSeek-Prover-V2': {'drop': True},
    'DeepSeek-R1-0528': {'eci': 'DeepSeek-R1 (May 2025)'},
    'DeepSeek-V3.1-Terminus': {'aa': 15.4, 'note': 'оценка по Artificial Analysis'},
    'DeepSeekMath-V2': {'drop': True},
    'DeepSeek-V3.2-Speciale': {'aa': 14.46, 'note': 'оценка по Artificial Analysis'},
    'DeepSeek-V4 Preview (V4-Pro & V4-Flash)': {'eci': 'DeepSeek v4 Pro', 'name': 'DeepSeek-V4'},
    'DeepSeek-V4-Flash-Vision-Exp': {'drop': True},
    # ---------- Mistral ----------
    'Mistral 7B': {'eci': 'Mistral 7B v0.1'},
    'Mistral Medium': {'aa': 5.49, 'window': '<=2024', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Codestral': {'none': True},
    'Codestral Mamba & Mathstral': {'drop': True},
    'Ministral 3B & 8B': {'eci': 'Ministral 3B', 'name': 'Ministral'},
    'Mistral Saba': {'drop': True},
    'Devstral': {'aa': 8.74, 'note': 'оценка по Artificial Analysis'},
    'Magistral (Small & Medium)': {'eci': 'Magistral Small 1.0', 'name': 'Magistral', 'note': 'замер Magistral Small'},
    'Devstral Medium': {'aa': 9.01, 'note': 'оценка по Artificial Analysis'},
    'Mistral Medium 3.1': {'aa': 9.53, 'note': 'оценка по Artificial Analysis'},
    'Mistral Large 3 (Mistral 3 family)': {'val': 139.0, 'name': 'Mistral Large 3', 'note': 'оценка по Artificial Analysis/LMArena'},
    'Devstral 2': {'aa': 9.41, 'note': 'оценка по Artificial Analysis'},
    'Mistral Small 4': {'aa': 11.45, 'note': 'оценка по Artificial Analysis'},
    'Leanstral': {'drop': True},
    # ---------- Alibaba ----------
    'Tongyi Qianwen (通义千问)': {'none': True, 'name': 'Tongyi Qianwen'},
    'Qwen-7B / Qwen-7B-Chat': {'eci': 'Qwen-7B', 'name': 'Qwen-7B'},
    'Qwen-14B / Qwen-14B-Chat': {'eci': 'Qwen-14B', 'name': 'Qwen-14B'},
    'Tongyi Qianwen 2.0': {'none': True},
    'Qwen-72B': {'val': 120.0, 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Qwen1.5': {'val': 120.0, 'note': 'оценка по LMArena (Qwen1.5-72B)'},
    'Qwen1.5-MoE-A2.7B': {'drop': True},
    'Qwen1.5-110B': {'aa': 5.65, 'window': '<=2024', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'Tongyi Qianwen 2.5 (Qwen-Max-0428)': {'none': True, 'name': 'Tongyi Qianwen 2.5'},
    'Qwen2': {'eci': 'Qwen2-72B'},
    'Qwen2-Math': {'drop': True},
    'Qwen2.5': {'eci': 'Qwen2.5-72B'},
    'Qwen2.5-Coder-32B-Instruct': {'eci': 'Qwen2.5-Coder-32B', 'name': 'Qwen2.5-Coder 32B'},
    'QwQ-32B-Preview': {'aa': 7.59, 'window': '<=2024', 'note': 'оценка по Artificial Analysis (низкая точность)'},
    'QwQ-Max-Preview': {'none': True},
    'Qwen3 (Qwen3-235B-A22B)': {'eci': 'Qwen3-235B-A22B', 'name': 'Qwen3'},
    'Qwen3-235B-A22B-Instruct-2507': {'eci': 'Qwen3-235B-A22B-Instruct (Jul 2025)', 'name': 'Qwen3-2507'},
    'Qwen3-235B-A22B-Thinking-2507': {'name': 'Qwen3-2507 Thinking'},
    'Qwen3-Coder (480B-A35B-Instruct)': {'aa': 11.9, 'name': 'Qwen3-Coder', 'note': 'оценка по Artificial Analysis'},
    'Qwen3-Next-80B-A3B': {'aa': 11.2, 'name': 'Qwen3-Next', 'note': 'оценка по Artificial Analysis'},
    'Qwen3-Max-Thinking (preview)': {'aa': 16.29, 'note': 'оценка по Artificial Analysis'},
    'Qwen3-Max-Thinking': {'aa': 21.26, 'note': 'оценка по Artificial Analysis'},
    'Qwen3-Coder-Next': {'aa': 10.05, 'note': 'оценка по Artificial Analysis'},
    'Qwen3.5 (Qwen3.5-397B-A17B / Qwen3.5-Plus)': {'eci': 'Qwen3.5 397B-A17B', 'name': 'Qwen3.5'},
    'Qwen3.5 medium models (122B-A10B, 35B-A3B, 27B)': {'eci': 'Qwen3.5-35B-A3B', 'name': 'Qwen3.5 Medium', 'note': 'замер Qwen3.5-35B-A3B'},
    'Qwen3.5 small models (0.8B-9B)': {'eci': 'Qwen3.5 9B', 'name': 'Qwen3.5 Small', 'note': 'замер Qwen3.5-9B'},
    'Qwen3.5-Max-Preview': {'drop': True},
    'Qwen3.6-Plus': {'eci': 'Qwen 3.6 Plus'},
    'Qwen3.6-Max-Preview': {'eci': 'Qwen 3.6 Max (Preview)'},
    'Qwen3.8-2.4T-A95B (open weights of Qwen3.8-Max)': {'drop': True},
    'Qwen3.8-Flash-Next': {'aa': 39.91, 'note': 'оценка по Artificial Analysis'},
    # ---------- Moonshot ----------
    'Kimi Chat': {'none': True},
    'Kimi 2M-character long context': {'drop': True},
    'Kimi k0-math': {'drop': True},
    'Kimi k1 (visual thinking)': {'drop': True},
    'Kimi k1.5': {'none': True},
    'Moonlight-16B-A3B': {'drop': True},
    'Kimi-Dev-72B': {'none': True},
    'Kimi K2-Instruct-0905': {'aa': 15.29, 'name': 'Kimi K2 0905', 'note': 'оценка по Artificial Analysis'},
    'Kimi Linear (48B-A3B)': {'aa': 7.3, 'name': 'Kimi Linear', 'note': 'оценка по Artificial Analysis'},
    'Kimi K2.8 Preview': {'none': True, 'note': 'вышла 11.09.2026 — замеров ещё нет'},
}


def norm(s):
    return re.sub(r'[^a-z0-9.]+', ' ', s.lower()).strip()


def main():
    eci_file = sorted((ROOT / 'data' / 'scores').glob('eci_epoch_*.json'))[-1]
    eci_data = json.load(open(eci_file))
    eci_exact = {m['model']: m for m in eci_data['models']}
    eci_norm = {}
    for m in eci_data['models']:
        eci_norm.setdefault(norm(m['model']), m)

    releases = []
    for f in sorted((ROOT / 'data' / 'releases').glob('*.json')):
        releases += json.load(open(f))

    out, problems = [], []
    for r in releases:
        m = MAP.get(r['name'], {})
        if m.get('drop'):
            continue
        name = m.get('name', r['name'])
        score, est, note = None, bool(m.get('est')), m.get('note')
        if 'eci' in m:
            hit = eci_exact.get(m['eci']) or eci_norm.get(norm(m['eci']))
            if not hit:
                problems.append(f"нет в ECI: {m['eci']} (для {r['name']})")
            else:
                score = hit['eci']
        elif 'aa' in m:
            score, est = round(aa_to_eci(m['aa'], m.get('window', '2025+')), 1), True
        elif 'val' in m:
            score, est = m['val'], True
        elif m.get('none'):
            score = None
        else:
            hit = eci_norm.get(norm(r['name']))
            if hit:
                score = hit['eci']
            else:
                problems.append(f"не сопоставлено: {r['name']} ({r['company']}, {r['date']})")
        show = m.get('show', True)
        default_hidden = (not show) or r.get('tier') == 'minor' or score is None or bool(r.get('limited'))
        item = {
            'company': r['company'],
            'name': name,
            'date': r['date'],
            'tier': r.get('tier', 'major'),
        }
        if score is not None:
            item['score'] = round(float(score), 1)
        if est:
            item['scoreEst'] = True
        if note:
            item['scoreNote'] = note
        if default_hidden:
            item['defaultHidden'] = True
        if r.get('limited'):
            item['limited'] = True
        if r.get('open_weights'):
            item['openWeights'] = True
        if r.get('note'):
            item['about'] = r['note']
        if r.get('sources'):
            item['source'] = r['sources'][0]
        out.append(item)

    out.sort(key=lambda x: (x['date'], x['company'], x['name']))
    meta = {
        'start': '2022-11-20',
        'today': TODAY,
        'metric': {
            'short': 'ECI',
            'name': 'Epoch Capabilities Index',
            'caption': 'Высота столбика — индекс возможностей ECI (Epoch AI)',
            'axisMin': 100, 'axisMax': 170, 'axisStep': 10,
        },
        'sourcesNote': 'Даты — официальные анонсы компаний. Высота — Epoch Capabilities Index (Epoch AI, CC BY 4.0) на 23.09.2026.',
    }
    data = {'meta': meta, 'companies': COMPANIES, 'releases': out}
    js = ('/* Сгенерировано tools/build_data.py — не править руками, правьте data/releases/*.json и запустите скрипт. */\n'
          'window.TABLO_DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    (ROOT / 'js' / 'data.js').write_text(js)

    shown = [x for x in out if not x.get('defaultHidden')]
    print(f'релизов: {len(out)}, видно по умолчанию: {len(shown)}, с оценкой ≈: {sum(1 for x in shown if x.get("scoreEst"))}, без индекса: {sum(1 for x in out if "score" not in x)}')
    from collections import Counter
    print('по компаниям (видно):', dict(Counter(x['company'] for x in shown)))
    if problems:
        print('\nПРОБЛЕМЫ:')
        for p in problems:
            print('  ', p)


if __name__ == '__main__':
    main()
