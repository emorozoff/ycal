/* Сгенерировано tools/build_data.py — не править руками, правьте data/releases/*.json и запустите скрипт. */
window.TABLO_DATA = {
 "meta": {
  "start": "2022-11-20",
  "today": "2026-09-23",
  "metric": {
   "short": "ECI",
   "name": "Epoch Capabilities Index",
   "caption": "Высота столбика — индекс возможностей ECI (Epoch AI)",
   "axisMin": 100,
   "axisMax": 170,
   "axisStep": 10
  },
  "sourcesNote": "Даты — официальные анонсы компаний. Высота — Epoch Capabilities Index (Epoch AI, CC BY 4.0) на 23.09.2026."
 },
 "companies": [
  {
   "id": "openai",
   "name": "OpenAI",
   "products": "ChatGPT, GPT, o-серия",
   "legend": "OpenAI · ChatGPT",
   "color": "#19aa8e",
   "main": true
  },
  {
   "id": "anthropic",
   "name": "Anthropic",
   "products": "Claude",
   "legend": "Anthropic · Claude",
   "color": "#e0703c",
   "main": true
  },
  {
   "id": "google",
   "name": "Google",
   "products": "Bard, PaLM, Gemini, Gemma",
   "legend": "Google · Gemini",
   "color": "#4f8ef7"
  },
  {
   "id": "xai",
   "name": "xAI",
   "products": "Grok",
   "legend": "xAI · Grok",
   "color": "#dfe3e8"
  },
  {
   "id": "meta",
   "name": "Meta",
   "products": "Llama, Muse",
   "legend": "Meta · Llama",
   "color": "#2fb7e0"
  },
  {
   "id": "deepseek",
   "name": "DeepSeek",
   "products": "V- и R-серии",
   "legend": "DeepSeek",
   "color": "#7c6cf5"
  },
  {
   "id": "alibaba",
   "name": "Alibaba",
   "products": "Qwen, Tongyi",
   "legend": "Alibaba · Qwen",
   "color": "#c07af2"
  },
  {
   "id": "moonshot",
   "name": "Moonshot AI",
   "products": "Kimi",
   "legend": "Moonshot · Kimi",
   "color": "#f0659a"
  },
  {
   "id": "mistral",
   "name": "Mistral AI",
   "products": "Mistral, Mixtral, Magistral",
   "legend": "Mistral",
   "color": "#f3b43c"
  }
 ],
 "releases": [
  {
   "company": "openai",
   "name": "ChatGPT (GPT-3.5)",
   "date": "2022-11-30",
   "tier": "flagship",
   "score": 113.2,
   "scoreEst": true,
   "scoreNote": "замер GPT-3.5 Turbo (июнь 2023) — ближайшая измеренная версия",
   "about": "Запуск ChatGPT на базе GPT-3.5 (research preview) — старт бума генеративного ИИ",
   "source": "https://openai.com/index/chatgpt/"
  },
  {
   "company": "meta",
   "name": "LLaMA 65B",
   "date": "2023-02-24",
   "tier": "flagship",
   "score": 109.9,
   "openWeights": true,
   "about": "7B-65B foundation models for researchers (gated, non-commercial); weights leaked on 2023-03-03 and kicked off the open-source LLM wave (Alpaca, Vicuna, llama.cpp)",
   "source": "https://ai.meta.com/blog/large-language-model-llama-meta-ai/"
  },
  {
   "company": "anthropic",
   "name": "Claude 1",
   "date": "2023-03-14",
   "tier": "flagship",
   "score": 121.0,
   "scoreEst": true,
   "scoreNote": "оценка по LMArena",
   "about": "Anthropic's first public model (API plus partners like Notion, Quora Poe, DuckDuckGo); Constitutional-AI-trained ChatGPT rival launched the same day as GPT-4.",
   "source": "https://www.anthropic.com/news/introducing-claude"
  },
  {
   "company": "anthropic",
   "name": "Claude Instant",
   "date": "2023-03-14",
   "tier": "major",
   "score": 117.6,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "about": "Faster, cheaper sibling released alongside Claude 1, the start of Anthropic's multi-tier lineup (ancestor of the Haiku line).",
   "source": "https://www.anthropic.com/news/introducing-claude"
  },
  {
   "company": "openai",
   "name": "GPT-4",
   "date": "2023-03-14",
   "tier": "flagship",
   "score": 125.9,
   "about": "Новое поколение: мультимодальный вход (текст+изображения), резкий рост качества; ChatGPT Plus и API (waitlist)",
   "source": "https://openai.com/index/gpt-4-research/"
  },
  {
   "company": "google",
   "name": "Bard",
   "date": "2023-03-21",
   "tier": "flagship",
   "scoreNote": "Bard на LaMDA — замеров нет",
   "defaultHidden": true,
   "about": "Google's first public chatbot (lightweight LaMDA), early access via US/UK waitlist; announced Feb 6, 2023 for trusted testers only",
   "source": "https://blog.google/technology/ai/try-bard/"
  },
  {
   "company": "alibaba",
   "name": "Tongyi Qianwen",
   "date": "2023-04-07",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "Alibaba Cloud's first LLM chatbot: invite-only enterprise beta and test site opened Apr 7, formally unveiled Apr 11 at the Alibaba Cloud Summit; opened to the general public Sep 13, 2023 after regulatory filing.",
   "source": "https://en.wikipedia.org/wiki/Qwen"
  },
  {
   "company": "google",
   "name": "PaLM 2",
   "date": "2023-05-10",
   "tier": "flagship",
   "score": 114.9,
   "about": "Next-gen LLM unveiled at I/O 2023; immediately powered Bard (waitlist dropped, 180 countries) and the PaLM API",
   "source": "https://blog.google/technology/ai/google-palm-2-ai-large-language-model/"
  },
  {
   "company": "anthropic",
   "name": "Claude 2",
   "date": "2023-07-11",
   "tier": "flagship",
   "score": 120.1,
   "about": "Launched claude.ai as a public beta (US/UK), Claude's consumer debut; 100K context and big gains in coding and math.",
   "source": "https://www.anthropic.com/news/claude-2"
  },
  {
   "company": "meta",
   "name": "Llama 2 70B",
   "date": "2023-07-18",
   "tier": "flagship",
   "score": 113.6,
   "openWeights": true,
   "about": "7B/13B/70B incl. Llama-2-Chat; first Llama licensed for commercial use (with Microsoft) - became the default open base model",
   "source": "https://ai.meta.com/blog/llama-2/"
  },
  {
   "company": "alibaba",
   "name": "Qwen-7B",
   "date": "2023-08-03",
   "tier": "major",
   "score": 106.5,
   "openWeights": true,
   "about": "First open-weight Qwen release (7B base + chat, free for commercial use) - start of what became the most widely used open model family.",
   "source": "https://github.com/QwenLM/Qwen"
  },
  {
   "company": "anthropic",
   "name": "Claude Instant 1.2",
   "date": "2023-08-09",
   "tier": "minor",
   "score": 120.2,
   "defaultHidden": true,
   "about": "API-only refresh of the fast/cheap model with Claude 2-era gains in math, coding and fewer hallucinations.",
   "source": "https://www.anthropic.com/news/releasing-claude-instant-1-2"
  },
  {
   "company": "meta",
   "name": "Code Llama",
   "date": "2023-08-24",
   "tier": "major",
   "defaultHidden": true,
   "openWeights": true,
   "about": "7B/13B/34B code models (base, Python, Instruct) built on Llama 2; Meta's first dedicated coding LLM",
   "source": "https://ai.meta.com/blog/code-llama-large-language-model-coding/"
  },
  {
   "company": "alibaba",
   "name": "Qwen-14B",
   "date": "2023-09-25",
   "tier": "minor",
   "score": 112.8,
   "defaultHidden": true,
   "openWeights": true,
   "about": "Second open-weight size (14B), released with qwen.cpp and the Qwen-Agent framework.",
   "source": "https://github.com/QwenLM/Qwen"
  },
  {
   "company": "mistral",
   "name": "Mistral 7B",
   "date": "2023-09-27",
   "tier": "flagship",
   "score": 112.0,
   "openWeights": true,
   "about": "Debut model released via magnet link, Apache 2.0; beat Llama 2 13B - put the Paris startup on the map",
   "source": "https://mistral.ai/news/announcing-mistral-7b/"
  },
  {
   "company": "moonshot",
   "name": "Kimi Chat",
   "date": "2023-10-09",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "Moonshot AI's first product: assistant handling 200K Chinese characters of lossless context (far beyond GPT-4 at the time); beta from Oct 9, opened to everyone Nov 16, 2023.",
   "source": "https://en.wikipedia.org/wiki/Kimi_(chatbot)"
  },
  {
   "company": "alibaba",
   "name": "Tongyi Qianwen 2.0",
   "date": "2023-10-31",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "Hundreds-of-billions-parameter upgrade of the closed flagship unveiled at the Apsara Conference 2023, alongside 8 industry models and the Bailian platform.",
   "source": "https://www.zhihu.com/question/628223929"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek Coder",
   "date": "2023-11-02",
   "tier": "flagship",
   "score": 95.7,
   "openWeights": true,
   "about": "DeepSeek's first release: 1.3B-33B code models trained on 2T tokens, free for commercial use; top open code model at launch",
   "source": "https://github.com/deepseek-ai/DeepSeek-Coder"
  },
  {
   "company": "xai",
   "name": "Grok-1",
   "date": "2023-11-04",
   "tier": "flagship",
   "score": 123.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "about": "xAI's first chatbot/model (314B MoE) with real-time X data and a 'rebellious' tone; early access for limited US users, all US Premium+ from Dec 7, 2023",
   "source": "https://x.ai/news/grok"
  },
  {
   "company": "openai",
   "name": "GPT-4 Turbo",
   "date": "2023-11-06",
   "tier": "major",
   "score": 126.5,
   "about": "DevDay: контекст 128K, знания до апреля 2023, в 2–3 раза дешевле GPT-4 (preview в API)",
   "source": "https://openai.com/index/new-models-and-developer-products-announced-at-devday/"
  },
  {
   "company": "anthropic",
   "name": "Claude 2.1",
   "date": "2023-11-21",
   "tier": "major",
   "score": 119.2,
   "about": "200K-token context (largest on the market then), about 2x fewer hallucinations, system prompts and beta tool use.",
   "source": "https://www.anthropic.com/news/claude-2-1"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek LLM 67B",
   "date": "2023-11-29",
   "tier": "flagship",
   "score": 110.5,
   "openWeights": true,
   "about": "First general DeepSeek LLM (7B/67B base+chat, 2T tokens); 67B Chat outperformed Llama 2 70B",
   "source": "https://github.com/deepseek-ai/DeepSeek-LLM"
  },
  {
   "company": "alibaba",
   "name": "Qwen-72B",
   "date": "2023-11-30",
   "tier": "major",
   "score": 120.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "openWeights": true,
   "about": "72B model (3T tokens, 32K context) released with Qwen-1.8B; beat Llama 2-70B on 10 benchmarks. Weights went up Nov 30, press event Dec 1.",
   "source": "https://github.com/QwenLM/Qwen"
  },
  {
   "company": "google",
   "name": "Gemini 1.0",
   "date": "2023-12-06",
   "tier": "flagship",
   "score": 117.0,
   "about": "First Gemini generation: tuned Gemini Pro went live in Bard, Gemini Nano on Pixel 8 Pro the same day (Pro API followed Dec 13); Ultra only announced",
   "source": "https://blog.google/technology/ai/google-gemini-ai/"
  },
  {
   "company": "mistral",
   "name": "Mixtral 8x7B",
   "date": "2023-12-08",
   "tier": "flagship",
   "score": 118.4,
   "openWeights": true,
   "about": "Sparse MoE (46.7B total / ~13B active) matching GPT-3.5; torrent dropped 12-08, official blog 12-11 - popularized open MoE",
   "source": "https://mistral.ai/news/mixtral-of-experts/"
  },
  {
   "company": "mistral",
   "name": "Mistral Medium",
   "date": "2023-12-11",
   "tier": "flagship",
   "score": 119.8,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "about": "First API-only (closed) prototype model, launched with the La Plateforme beta; Mistral's strongest model until Mistral Large",
   "source": "https://mistral.ai/news/la-plateforme/"
  },
  {
   "company": "meta",
   "name": "Code Llama 70B",
   "date": "2024-01-29",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Largest Code Llama (70B base/Python/Instruct, 67.8% HumanEval), announced by Zuckerberg",
   "source": "https://ai.meta.com/blog/code-llama-large-language-model-coding/"
  },
  {
   "company": "alibaba",
   "name": "Qwen1.5",
   "date": "2024-02-05",
   "tier": "flagship",
   "score": 120.0,
   "scoreEst": true,
   "scoreNote": "оценка по LMArena (Qwen1.5-72B)",
   "openWeights": true,
   "about": "New open generation 0.5B-72B (32K context, native HF transformers support, official AWQ/GPTQ quants). Released ~16:00 UTC Feb 5 = around midnight Beijing time Feb 6; blog front-matter says Feb 4.",
   "source": "https://qwenlm.github.io/blog/qwen1.5/"
  },
  {
   "company": "google",
   "name": "Gemini 1.0 Ultra",
   "date": "2024-02-08",
   "tier": "flagship",
   "score": 121.4,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "about": "Bard renamed Gemini; Ultra 1.0 shipped in the paid Gemini Advanced tier (Google One AI Premium, $19.99/mo)",
   "source": "https://blog.google/products/gemini/bard-gemini-advanced-app/"
  },
  {
   "company": "google",
   "name": "Gemini 1.5 Pro",
   "date": "2024-02-15",
   "tier": "flagship",
   "score": 126.9,
   "about": "MoE model with an experimental 1M-token context (record at the time), ~1.0 Ultra quality; private preview for developers/enterprise (public API preview Apr 9, 2024)",
   "source": "https://developers.googleblog.com/gemini-15-our-next-generation-model-now-available-for-private-preview-in-google-ai-studio/"
  },
  {
   "company": "google",
   "name": "Gemma",
   "date": "2024-02-21",
   "tier": "major",
   "score": 111.7,
   "openWeights": true,
   "about": "Google's first open-weight LLM family (2B and 7B), built from Gemini research",
   "source": "https://blog.google/technology/developers/gemma-open-models/"
  },
  {
   "company": "mistral",
   "name": "Mistral Large",
   "date": "2024-02-26",
   "tier": "flagship",
   "score": 122.0,
   "about": "First GPT-4-class contender from Europe, launched with Le Chat and the Microsoft Azure partnership",
   "source": "https://mistral.ai/news/mistral-large/"
  },
  {
   "company": "anthropic",
   "name": "Claude 3 Opus",
   "date": "2024-03-04",
   "tier": "flagship",
   "score": 126.9,
   "about": "First Claude to beat GPT-4 on most standard benchmarks; the Claude 3 family added image input and a 200K context.",
   "source": "https://www.anthropic.com/news/claude-3-family"
  },
  {
   "company": "anthropic",
   "name": "Claude 3 Sonnet",
   "date": "2024-03-04",
   "tier": "major",
   "score": 120.7,
   "about": "Balanced mid-tier Claude 3 model that powered the free claude.ai experience.",
   "source": "https://www.anthropic.com/news/claude-3-family"
  },
  {
   "company": "anthropic",
   "name": "Claude 3 Haiku",
   "date": "2024-03-13",
   "tier": "major",
   "score": 118.3,
   "about": "Fastest and cheapest Claude 3 model ($0.25/$1.25 per M tokens); shipped nine days after Opus and Sonnet.",
   "source": "https://www.anthropic.com/news/claude-3-haiku"
  },
  {
   "company": "google",
   "name": "CodeGemma",
   "date": "2024-04-09",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Code-specialized Gemma variants (2B/7B) released at Cloud Next alongside RecurrentGemma",
   "source": "https://huggingface.co/blog/codegemma"
  },
  {
   "company": "mistral",
   "name": "Mixtral 8x22B",
   "date": "2024-04-10",
   "tier": "major",
   "score": 122.0,
   "openWeights": true,
   "about": "141B MoE (39B active) Apache 2.0; torrent dropped 04-10, official blog/instruct model 04-17",
   "source": "https://mistral.ai/news/mixtral-8x22b/"
  },
  {
   "company": "alibaba",
   "name": "CodeQwen1.5-7B",
   "date": "2024-04-16",
   "tier": "minor",
   "score": 94.4,
   "defaultHidden": true,
   "openWeights": true,
   "about": "First dedicated Qwen code model (7B, 64K context, 92 programming languages) - ancestor of Qwen2.5-Coder and Qwen3-Coder.",
   "source": "https://qwenlm.github.io/blog/codeqwen1.5/"
  },
  {
   "company": "meta",
   "name": "Llama 3 70B",
   "date": "2024-04-18",
   "tier": "flagship",
   "score": 122.9,
   "openWeights": true,
   "about": "8B and 70B trained on 15T tokens; big quality jump for open models and new engine of the Meta AI assistant",
   "source": "https://ai.meta.com/blog/meta-llama-3/"
  },
  {
   "company": "alibaba",
   "name": "Qwen1.5-110B",
   "date": "2024-04-25",
   "tier": "major",
   "score": 120.5,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "openWeights": true,
   "about": "First 100B+ open Qwen model (dense 110B), competitive with Llama-3-70B.",
   "source": "https://qwenlm.github.io/blog/qwen1.5-110b/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V2",
   "date": "2024-05-06",
   "tier": "flagship",
   "score": 124.8,
   "openWeights": true,
   "about": "236B MoE (21B active) introducing MLA attention; ultra-low API price that triggered China's LLM price war",
   "source": "https://github.com/deepseek-ai/DeepSeek-V2"
  },
  {
   "company": "alibaba",
   "name": "Tongyi Qianwen 2.5",
   "date": "2024-05-09",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "Closed flagship upgrade announced May 9 claiming parity with GPT-4 Turbo on OpenCompass; API snapshot qwen-max-0428 ranked near the top of LMSYS Chatbot Arena.",
   "source": "https://qwenlm.github.io/blog/qwen-max-0428/"
  },
  {
   "company": "openai",
   "name": "GPT-4o",
   "date": "2024-05-13",
   "tier": "flagship",
   "score": 129.0,
   "about": "«Omni»: нативно мультимодальная (текст, аудио, изображения), уровень GPT-4 бесплатно в ChatGPT",
   "source": "https://openai.com/index/hello-gpt-4o/"
  },
  {
   "company": "google",
   "name": "Gemini 1.5 Flash",
   "date": "2024-05-14",
   "tier": "major",
   "score": 129.4,
   "about": "Fast, cheap 1M-context model introduced at I/O 2024 (public preview in API); started the Flash tier",
   "source": "https://www.cnbc.com/2024/05/14/google-announces-lightweight-ai-model-gemini-flash-1point5-at-google-i/o.html"
  },
  {
   "company": "xai",
   "name": "Grok-1.5",
   "date": "2024-05-15",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "128K context and much better math/coding; announced Mar 28, 2024, broad rollout to X Premium users around mid-May (exact day unverified)",
   "source": "https://x.ai/news/grok-1.5"
  },
  {
   "company": "mistral",
   "name": "Codestral",
   "date": "2024-05-29",
   "tier": "major",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Mistral's first code model (22B, 80+ languages, non-production license)",
   "source": "https://mistral.ai/news/codestral/"
  },
  {
   "company": "alibaba",
   "name": "Qwen2",
   "date": "2024-06-06",
   "tier": "flagship",
   "score": 125.3,
   "openWeights": true,
   "about": "New generation 0.5B-72B incl. 57B-A14B MoE, up to 128K context, 29+ languages; Qwen2-72B topped open-model leaderboards. Went live 16:00 UTC Jun 6 = 00:00 Beijing Jun 7 (blog dated Jun 7).",
   "source": "https://qwenlm.github.io/blog/qwen2/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-Coder-V2",
   "date": "2024-06-17",
   "tier": "major",
   "score": 122.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "openWeights": true,
   "about": "236B MoE code model (plus 16B Lite); first open model claimed to match GPT-4 Turbo on coding/math benchmarks",
   "source": "https://github.com/deepseek-ai/DeepSeek-Coder-V2"
  },
  {
   "company": "anthropic",
   "name": "Claude 3.5 Sonnet",
   "date": "2024-06-20",
   "tier": "flagship",
   "score": 130.0,
   "about": "Mid-tier model that beat Claude 3 Opus at twice the speed and a fifth of the price; debuted Artifacts and became developers' favorite coding model.",
   "source": "https://www.anthropic.com/news/claude-3-5-sonnet"
  },
  {
   "company": "google",
   "name": "Gemma 2",
   "date": "2024-06-27",
   "tier": "major",
   "score": 122.1,
   "openWeights": true,
   "about": "9B and 27B open models; 27B rivaled models twice its size (2B added Jul 31, 2024)",
   "source": "https://blog.google/technology/developers/google-gemma-2/"
  },
  {
   "company": "mistral",
   "name": "Mistral NeMo",
   "date": "2024-07-18",
   "tier": "major",
   "score": 118.6,
   "openWeights": true,
   "about": "12B model with 128K context built with NVIDIA, Apache 2.0; popular small open model",
   "source": "https://mistral.ai/news/mistral-nemo/"
  },
  {
   "company": "openai",
   "name": "GPT-4o mini",
   "date": "2024-07-18",
   "tier": "major",
   "score": 126.6,
   "about": "Дешёвая малая модель, заменила GPT-3.5 Turbo в ChatGPT",
   "source": "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/"
  },
  {
   "company": "meta",
   "name": "Llama 3.1 405B",
   "date": "2024-07-23",
   "tier": "flagship",
   "score": 128.8,
   "openWeights": true,
   "about": "405B flagship with 128K context - first open-weight model competitive with GPT-4o-class frontier models",
   "source": "https://ai.meta.com/blog/meta-llama-3-1/"
  },
  {
   "company": "mistral",
   "name": "Mistral Large 2",
   "date": "2024-07-24",
   "tier": "flagship",
   "score": 128.5,
   "openWeights": true,
   "about": "123B model competitive with GPT-4o/Llama 3.1 405B; open weights under research license",
   "source": "https://mistral.ai/news/mistral-large-2407/"
  },
  {
   "company": "xai",
   "name": "Grok-2",
   "date": "2024-08-13",
   "tier": "flagship",
   "score": 130.5,
   "scoreEst": true,
   "scoreNote": "замер декабрьской версии",
   "about": "Grok-2 and Grok-2 mini beta on X; ranked near the top of LMSYS (tested as 'sus-column-r'), brought xAI into the frontier race",
   "source": "https://x.ai/news/grok-2"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V2.5",
   "date": "2024-09-05",
   "tier": "flagship",
   "score": 127.0,
   "scoreEst": true,
   "scoreNote": "оценка по LMArena",
   "openWeights": true,
   "about": "Merged DeepSeek-V2-Chat and Coder-V2-Instruct into one general+coding model",
   "source": "https://api-docs.deepseek.com/news/news0905"
  },
  {
   "company": "openai",
   "name": "o1-mini",
   "date": "2024-09-12",
   "tier": "major",
   "score": 135.8,
   "about": "Быстрая и дешёвая reasoning-модель, сильна в математике и коде",
   "source": "https://openai.com/index/openai-o1-mini-advancing-cost-efficient-reasoning/"
  },
  {
   "company": "openai",
   "name": "o1-preview",
   "date": "2024-09-12",
   "tier": "flagship",
   "score": 134.8,
   "about": "Первая «рассуждающая» модель OpenAI (думает цепочкой мыслей перед ответом), проект Strawberry",
   "source": "https://openai.com/index/introducing-openai-o1-preview/"
  },
  {
   "company": "alibaba",
   "name": "Qwen2.5",
   "date": "2024-09-19",
   "tier": "flagship",
   "score": 129.0,
   "openWeights": true,
   "about": "18T-token open family 0.5B-72B launched at Apsara 2024 together with Qwen2.5-Coder and Qwen2.5-Math; became the default base for fine-tunes (e.g. DeepSeek-R1 distills).",
   "source": "https://qwenlm.github.io/blog/qwen2.5/"
  },
  {
   "company": "meta",
   "name": "Llama 3.2 90B",
   "date": "2024-09-25",
   "tier": "major",
   "score": 125.5,
   "openWeights": true,
   "about": "Released at Meta Connect: first multimodal Llamas (11B/90B vision) plus 1B/3B on-device text models",
   "source": "https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/"
  },
  {
   "company": "mistral",
   "name": "Ministral",
   "date": "2024-10-16",
   "tier": "minor",
   "score": 118.1,
   "defaultHidden": true,
   "openWeights": true,
   "about": "'Les Ministraux' edge/on-device models (8B weights under research license, 3B API-only)",
   "source": "https://mistral.ai/news/ministraux/"
  },
  {
   "company": "anthropic",
   "name": "Claude 3.5 Sonnet (new)",
   "date": "2024-10-22",
   "tier": "major",
   "score": 133.6,
   "about": "Upgraded 3.5 Sonnet (nicknamed '3.6'): big coding gains and the first frontier model offering computer use (public beta).",
   "source": "https://www.anthropic.com/news/3-5-models-and-computer-use"
  },
  {
   "company": "anthropic",
   "name": "Claude 3.5 Haiku",
   "date": "2024-11-04",
   "tier": "major",
   "score": 127.2,
   "about": "Fast model rivaling Claude 3 Opus that beat GPT-4o on SWE-bench Verified; announced Oct 22, released to API/Bedrock/Vertex on Nov 4 (text-only).",
   "source": "https://www.anthropic.com/news/3-5-models-and-computer-use"
  },
  {
   "company": "alibaba",
   "name": "Qwen2.5-Coder 32B",
   "date": "2024-11-12",
   "tier": "major",
   "score": 119.4,
   "openWeights": true,
   "about": "Open 32B code model competitive with GPT-4o on coding benchmarks - the go-to local coding model of late 2024.",
   "source": "https://qwenlm.github.io/blog/qwen2.5-coder-family/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-R1-Lite-Preview",
   "date": "2024-11-20",
   "tier": "major",
   "defaultHidden": true,
   "about": "First DeepSeek o1-style reasoning model with visible chain of thought (web chat only, weights never released)",
   "source": "https://api-docs.deepseek.com/news/news1120"
  },
  {
   "company": "alibaba",
   "name": "QwQ-32B-Preview",
   "date": "2024-11-28",
   "tier": "major",
   "score": 127.9,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (низкая точность)",
   "openWeights": true,
   "about": "Alibaba's first open reasoning model (o1-style long chain of thought), one of the first open answers to OpenAI o1.",
   "source": "https://qwenlm.github.io/blog/qwq-32b-preview/"
  },
  {
   "company": "openai",
   "name": "o1",
   "date": "2024-12-05",
   "tier": "flagship",
   "score": 141.9,
   "about": "Полная версия o1 вместо preview (понимает изображения); день 1 «12 дней OpenAI»; в API с 17 дек.",
   "source": "https://openai.com/index/introducing-chatgpt-pro/"
  },
  {
   "company": "openai",
   "name": "o1 pro",
   "date": "2024-12-05",
   "tier": "major",
   "score": 141.9,
   "scoreEst": true,
   "scoreNote": "как o1: та же модель с бо́льшим бюджетом рассуждений",
   "defaultHidden": true,
   "about": "o1 с увеличенными вычислениями — только в новом тарифе ChatGPT Pro за $200/мес (API o1-pro с 19.03.2025)",
   "source": "https://openai.com/index/introducing-chatgpt-pro/"
  },
  {
   "company": "meta",
   "name": "Llama 3.3 70B",
   "date": "2024-12-06",
   "tier": "major",
   "score": 127.3,
   "openWeights": true,
   "about": "Text-only 70B delivering roughly Llama 3.1 405B-level quality at a fraction of the cost",
   "source": "https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md"
  },
  {
   "company": "google",
   "name": "Gemini 2.0 Flash",
   "date": "2024-12-11",
   "tier": "flagship",
   "score": 134.7,
   "about": "Opened the Gemini 2.0 'agentic era': beat 1.5 Pro at 2x speed, native image/audio output (experimental; GA Jan 30 app / Feb 5, 2025 API)",
   "source": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-ai-update-december-2024/"
  },
  {
   "company": "google",
   "name": "Gemini 2.0 Flash Thinking",
   "date": "2024-12-19",
   "tier": "major",
   "score": 135.4,
   "scoreEst": true,
   "scoreNote": "замер январской версии",
   "about": "Google's first reasoning model with visible thoughts (experimental in AI Studio); Google's answer to OpenAI o1",
   "source": "https://techcrunch.com/2024/12/19/google-releases-its-own-reasoning-ai-model"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3",
   "date": "2024-12-26",
   "tier": "flagship",
   "score": 132.4,
   "openWeights": true,
   "about": "671B MoE (37B active) matching GPT-4o-class models, reportedly trained for ~$5.6M of GPU time",
   "source": "https://api-docs.deepseek.com/news/news1226"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-R1",
   "date": "2025-01-20",
   "tier": "flagship",
   "score": 139.0,
   "openWeights": true,
   "about": "MIT-licensed reasoning model on par with OpenAI o1 (+ distilled small models); the 'DeepSeek moment' - #1 on the US App Store and a ~17% one-day Nvidia drop on 2025-01-27",
   "source": "https://api-docs.deepseek.com/news/news250120"
  },
  {
   "company": "moonshot",
   "name": "Kimi k1.5",
   "date": "2025-01-20",
   "tier": "flagship",
   "defaultHidden": true,
   "about": "Multimodal reasoning model claimed to match OpenAI o1 in long-CoT mode; tech report published the same day as DeepSeek-R1; gradual rollout from Jan 20, fully launched in apps Jan 31.",
   "source": "https://github.com/MoonshotAI/Kimi-k1.5"
  },
  {
   "company": "alibaba",
   "name": "Qwen2.5-Max",
   "date": "2025-01-28",
   "tier": "flagship",
   "score": 132.5,
   "about": "Large MoE pretrained on 20T+ tokens, released on Lunar New Year's Eve amid the DeepSeek-R1 shock; claimed wins over DeepSeek-V3 and GPT-4o.",
   "source": "https://qwenlm.github.io/blog/qwen2.5-max/"
  },
  {
   "company": "mistral",
   "name": "Mistral Small 3",
   "date": "2025-01-30",
   "tier": "major",
   "score": 127.1,
   "openWeights": true,
   "about": "24B latency-optimized model under Apache 2.0 rivaling Llama 3.3 70B - Mistral's recommitment to open licenses",
   "source": "https://mistral.ai/news/mistral-small-3/"
  },
  {
   "company": "openai",
   "name": "o3-mini",
   "date": "2025-01-31",
   "tier": "major",
   "score": 140.3,
   "about": "Малая reasoning-модель нового поколения; впервые рассуждения доступны бесплатным пользователям ChatGPT",
   "source": "https://openai.com/index/openai-o3-mini/"
  },
  {
   "company": "google",
   "name": "Gemini 2.0 Flash-Lite",
   "date": "2025-02-05",
   "tier": "minor",
   "score": 131.5,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "defaultHidden": true,
   "about": "New cheapest tier (public preview), better than 1.5 Flash at the same price",
   "source": "https://developers.googleblog.com/en/gemini-2-family-expands/"
  },
  {
   "company": "google",
   "name": "Gemini 2.0 Pro",
   "date": "2025-02-05",
   "tier": "flagship",
   "score": 135.1,
   "about": "Experimental top model for coding/complex prompts with 2M context; follow-up to gemini-exp-1206 (Dec 6, 2024), its early version",
   "source": "https://blog.google/technology/google-deepmind/gemini-model-updates-february-2025/"
  },
  {
   "company": "xai",
   "name": "Grok 3",
   "date": "2025-02-17",
   "tier": "flagship",
   "score": 138.3,
   "about": "Trained on the Colossus supercluster; Think (reasoning) and DeepSearch modes plus Grok 3 mini; topped LMArena at launch (API Apr 9, 2025)",
   "source": "https://x.ai/news/grok-3"
  },
  {
   "company": "anthropic",
   "name": "Claude 3.7 Sonnet",
   "date": "2025-02-24",
   "tier": "flagship",
   "score": 141.2,
   "about": "First hybrid reasoning model: instant answers or visible step-by-step extended thinking in one model; shipped with the Claude Code research preview.",
   "source": "https://www.anthropic.com/news/claude-3-7-sonnet"
  },
  {
   "company": "alibaba",
   "name": "QwQ-Max-Preview",
   "date": "2025-02-25",
   "tier": "major",
   "defaultHidden": true,
   "about": "'Thinking (QwQ)' mode in Qwen Chat backed by a reasoning model built on Qwen2.5-Max (announced 21:00 UTC Feb 24 = Feb 25 Beijing).",
   "source": "https://qwenlm.github.io/blog/qwq-max-preview/"
  },
  {
   "company": "openai",
   "name": "GPT-4.5",
   "date": "2025-02-27",
   "tier": "flagship",
   "score": 136.8,
   "about": "Крупнейшая модель без цепочки рассуждений (кодовое имя Orion), research preview для Pro и API",
   "source": "https://openai.com/index/introducing-gpt-4-5/"
  },
  {
   "company": "alibaba",
   "name": "QwQ-32B",
   "date": "2025-03-06",
   "tier": "major",
   "score": 137.6,
   "openWeights": true,
   "about": "RL-trained 32B reasoning model claiming parity with the 671B DeepSeek-R1, Apache 2.0 (announced 19:00 UTC Mar 5 = Mar 6 Beijing).",
   "source": "https://qwenlm.github.io/blog/qwq-32b/"
  },
  {
   "company": "google",
   "name": "Gemma 3",
   "date": "2025-03-12",
   "tier": "major",
   "score": 130.0,
   "openWeights": true,
   "about": "1B-27B multimodal open models, 128K context, 140+ languages; 'most capable model on a single GPU' (27B ranked top-10 on LMArena)",
   "source": "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-3/"
  },
  {
   "company": "mistral",
   "name": "Mistral Small 3.1",
   "date": "2025-03-17",
   "tier": "major",
   "score": 127.5,
   "openWeights": true,
   "about": "24B Apache 2.0 update adding image understanding and 128K context",
   "source": "https://mistral.ai/news/mistral-small-3-1/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3-0324",
   "date": "2025-03-24",
   "tier": "flagship",
   "score": 135.9,
   "openWeights": true,
   "about": "Major V3 refresh (much better reasoning/coding, MIT license); weights on HF 03-24, official notice 03-25",
   "source": "https://api-docs.deepseek.com/news/news250325"
  },
  {
   "company": "google",
   "name": "Gemini 2.5 Pro",
   "date": "2025-03-25",
   "tier": "flagship",
   "score": 144.2,
   "about": "First Gemini built as a thinking model; debuted #1 on LMArena by a wide margin (experimental in AI Studio and Gemini Advanced)",
   "source": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/"
  },
  {
   "company": "meta",
   "name": "Llama 4",
   "date": "2025-04-05",
   "tier": "flagship",
   "score": 132.2,
   "openWeights": true,
   "about": "First MoE, natively multimodal Llamas (17B active; Scout 109B total w/ 10M context, Maverick 400B total); Behemoth previewed but never released; launch marred by LMArena benchmark controversy - last Llama generation to date",
   "source": "https://ai.meta.com/blog/llama-4-multimodal-intelligence/"
  },
  {
   "company": "openai",
   "name": "GPT-4.1",
   "date": "2025-04-14",
   "tier": "major",
   "score": 136.8,
   "about": "Модель для разработчиков только в API: контекст 1M токенов, сильнее в коде и следовании инструкциям",
   "source": "https://openai.com/index/gpt-4-1/"
  },
  {
   "company": "openai",
   "name": "GPT-4.1 mini",
   "date": "2025-04-14",
   "tier": "major",
   "score": 135.0,
   "about": "Уменьшенная GPT-4.1 (1M контекст); позже заменила GPT-4o mini в ChatGPT",
   "source": "https://openai.com/index/gpt-4-1/"
  },
  {
   "company": "openai",
   "name": "GPT-4.1 nano",
   "date": "2025-04-14",
   "tier": "minor",
   "score": 129.6,
   "defaultHidden": true,
   "about": "Самая быстрая и дешёвая модель OpenAI на тот момент (1M контекст, только API)",
   "source": "https://openai.com/index/gpt-4-1/"
  },
  {
   "company": "openai",
   "name": "o3",
   "date": "2025-04-16",
   "tier": "flagship",
   "score": 146.9,
   "about": "Флагманская reasoning-модель: впервые сама использует инструменты (поиск, Python, анализ картинок) в рассуждениях",
   "source": "https://openai.com/index/introducing-o3-and-o4-mini/"
  },
  {
   "company": "openai",
   "name": "o4-mini",
   "date": "2025-04-16",
   "tier": "major",
   "score": 145.6,
   "about": "Быстрая и дешёвая reasoning-модель с инструментами, заменила o3-mini",
   "source": "https://openai.com/index/introducing-o3-and-o4-mini/"
  },
  {
   "company": "google",
   "name": "Gemini 2.5 Flash",
   "date": "2025-04-17",
   "tier": "major",
   "score": 140.8,
   "about": "First fully hybrid reasoning model: thinking on/off with adjustable thinking budget (preview in API and Gemini app)",
   "source": "https://developers.googleblog.com/en/start-building-with-gemini-25-flash/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3",
   "date": "2025-04-29",
   "tier": "flagship",
   "score": 139.4,
   "openWeights": true,
   "about": "Hybrid thinking/non-thinking family from 0.6B to 235B-A22B MoE, 36T tokens, 119 languages, Apache 2.0 - top open-weight family of spring 2025.",
   "source": "https://qwenlm.github.io/blog/qwen3/"
  },
  {
   "company": "mistral",
   "name": "Mistral Medium 3",
   "date": "2025-05-07",
   "tier": "flagship",
   "score": 134.1,
   "about": "Closed model claiming ~90% of Claude 3.7 Sonnet quality at ~8x lower cost - 'Medium is the new Large'",
   "source": "https://mistral.ai/news/mistral-medium-3/"
  },
  {
   "company": "openai",
   "name": "codex-1",
   "date": "2025-05-16",
   "tier": "major",
   "score": 146.9,
   "scoreEst": true,
   "scoreNote": "как o3: codex-1 — версия o3 для программирования",
   "defaultHidden": true,
   "about": "Версия o3 для программирования — движок облачного агента Codex (research preview в ChatGPT)",
   "source": "https://openai.com/index/introducing-codex/"
  },
  {
   "company": "google",
   "name": "Gemma 3n",
   "date": "2025-05-20",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Mobile-first open model (E2B/E4B) with audio/video input, runs in ~2GB RAM; preview at I/O, full release Jun 26, 2025",
   "source": "https://developers.googleblog.com/en/introducing-gemma-3n/"
  },
  {
   "company": "mistral",
   "name": "Devstral",
   "date": "2025-05-21",
   "tier": "major",
   "score": 134.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "24B Apache 2.0 agentic coding model (with All Hands AI), top open model on SWE-bench Verified at launch",
   "source": "https://mistral.ai/news/devstral/"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4",
   "date": "2025-05-22",
   "tier": "flagship",
   "score": 142.7,
   "about": "Claude 4 generation: billed as the world's best coding model, able to work for hours on agentic tasks; first model shipped under ASL-3 safeguards.",
   "source": "https://www.anthropic.com/news/claude-4"
  },
  {
   "company": "anthropic",
   "name": "Claude Sonnet 4",
   "date": "2025-05-22",
   "tier": "major",
   "score": 141.7,
   "about": "Claude 4 mid-tier successor to 3.7 Sonnet, available to free users; chosen to power GitHub Copilot's new coding agent.",
   "source": "https://www.anthropic.com/news/claude-4"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-R1-0528",
   "date": "2025-05-28",
   "tier": "flagship",
   "score": 141.3,
   "openWeights": true,
   "about": "R1 upgrade approaching o3 / Gemini 2.5 Pro, fewer hallucinations, function calling; weights on HF 05-28, official notice 05-29",
   "source": "https://api-docs.deepseek.com/news/news250528"
  },
  {
   "company": "mistral",
   "name": "Magistral",
   "date": "2025-06-10",
   "tier": "flagship",
   "score": 133.2,
   "scoreNote": "замер Magistral Small",
   "openWeights": true,
   "about": "Mistral's first reasoning models: open Magistral Small 24B (Apache 2.0) and closed Magistral Medium",
   "source": "https://mistral.ai/news/magistral/"
  },
  {
   "company": "openai",
   "name": "o3-pro",
   "date": "2025-06-10",
   "tier": "major",
   "score": 147.4,
   "about": "o3 с увеличенными вычислениями для Pro/Team в ChatGPT и в API; заменила o1-pro",
   "source": "https://help.openai.com/en/articles/9624314-model-release-notes"
  },
  {
   "company": "google",
   "name": "Gemini 2.5 Flash-Lite",
   "date": "2025-06-17",
   "tier": "minor",
   "score": 133.9,
   "defaultHidden": true,
   "about": "Lowest-cost/lowest-latency 2.5 model (preview, thinking off by default) released with 2.5 Pro/Flash GA; GA Jul 22, 2025",
   "source": "https://www.infoworld.com/article/4009323/google-previews-gemini-2-5-flash-lite.html"
  },
  {
   "company": "moonshot",
   "name": "Kimi-Dev-72B",
   "date": "2025-06-17",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Open 72B software-engineering model (from Qwen2.5-72B) scoring 60.4% on SWE-bench Verified, best among open models at release.",
   "source": "https://github.com/MoonshotAI/Kimi-Dev"
  },
  {
   "company": "xai",
   "name": "Grok 4",
   "date": "2025-07-09",
   "tier": "flagship",
   "score": 146.5,
   "about": "Launched with multi-agent Grok 4 Heavy and a $300/mo SuperGrok Heavy tier; state-of-the-art on HLE and ARC-AGI-2 at launch",
   "source": "https://x.ai/news/grok-4"
  },
  {
   "company": "mistral",
   "name": "Devstral Medium",
   "date": "2025-07-10",
   "tier": "minor",
   "score": 134.5,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "defaultHidden": true,
   "about": "API-only larger Devstral (released alongside open Devstral Small 1.1)",
   "source": "https://mistral.ai/news/devstral-2507/"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2",
   "date": "2025-07-11",
   "tier": "flagship",
   "score": 140.1,
   "openWeights": true,
   "about": "1T-parameter MoE (32B active) trained with the MuonClip optimizer; top open agentic/coding model of mid-2025 and a 'DeepSeek moment' for Moonshot (Modified MIT).",
   "source": "https://www.kimi.com/blog/kimi-k2"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-2507",
   "date": "2025-07-21",
   "tier": "major",
   "score": 138.9,
   "openWeights": true,
   "about": "Update that dropped hybrid thinking for separate Instruct/Thinking models; large quality jump and 256K context (announced 17:14 UTC Jul 21 = Jul 22 Beijing).",
   "source": "https://github.com/QwenLM/Qwen3"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Coder",
   "date": "2025-07-22",
   "tier": "major",
   "score": 138.7,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "Agentic coding MoE (480B total / 35B active, 256K context extendable to 1M) launched with the open-source Qwen Code CLI; strongest open coding model at release (announced 21:12 UTC Jul 22 = Jul 23 Beijing).",
   "source": "https://qwenlm.github.io/blog/qwen3-coder/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-2507 Thinking",
   "date": "2025-07-25",
   "tier": "major",
   "score": 143.9,
   "openWeights": true,
   "about": "Thinking-only update of the 235B model; state-of-the-art among open-weight reasoning models at release.",
   "source": "https://github.com/QwenLM/Qwen3"
  },
  {
   "company": "google",
   "name": "Gemini 2.5 Deep Think",
   "date": "2025-08-01",
   "tier": "major",
   "defaultHidden": true,
   "about": "Parallel-thinking mode for AI Ultra subscribers; a variant of the model won IMO 2025 gold",
   "source": "https://blog.google/products-and-platforms/products/gemini/gemini-2-5-deep-think/"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4.1",
   "date": "2025-08-05",
   "tier": "major",
   "score": 144.1,
   "about": "Drop-in upgrade to Opus 4 for agentic tasks and real-world coding (74.5% SWE-bench Verified).",
   "source": "https://www.anthropic.com/news/claude-opus-4-1"
  },
  {
   "company": "openai",
   "name": "gpt-oss-120b",
   "date": "2025-08-05",
   "tier": "major",
   "score": 139.9,
   "openWeights": true,
   "about": "Первая open-weight LLM OpenAI со времён GPT-2 (Apache 2.0): MoE 117B (5.1B активных), уровень ~o4-mini",
   "source": "https://openai.com/index/introducing-gpt-oss/"
  },
  {
   "company": "openai",
   "name": "gpt-oss-20b",
   "date": "2025-08-05",
   "tier": "major",
   "score": 137.8,
   "openWeights": true,
   "about": "Малая открытая MoE-модель (21B, 3.6B активных), запускается локально в 16 ГБ памяти",
   "source": "https://openai.com/index/introducing-gpt-oss/"
  },
  {
   "company": "openai",
   "name": "GPT-5",
   "date": "2025-08-07",
   "tier": "flagship",
   "score": 150.0,
   "about": "Единая система с роутером между быстрым и «думающим» режимом; доступна всем, включая бесплатных пользователей",
   "source": "https://openai.com/index/introducing-gpt-5/"
  },
  {
   "company": "openai",
   "name": "GPT-5 Pro",
   "date": "2025-08-07",
   "tier": "major",
   "score": 150.3,
   "about": "GPT-5 с расширенным параллельным рассуждением для подписчиков Pro (в API с 6 окт. 2025)",
   "source": "https://openai.com/index/introducing-gpt-5/"
  },
  {
   "company": "openai",
   "name": "GPT-5 mini",
   "date": "2025-08-07",
   "tier": "major",
   "score": 145.5,
   "about": "Уменьшенная GPT-5: в API и как запасная модель ChatGPT при исчерпании лимитов",
   "source": "https://openai.com/index/introducing-gpt-5-for-developers/"
  },
  {
   "company": "openai",
   "name": "GPT-5 nano",
   "date": "2025-08-07",
   "tier": "minor",
   "score": 139.4,
   "defaultHidden": true,
   "about": "Самая маленькая и дешёвая модель семейства GPT-5, только API",
   "source": "https://openai.com/index/introducing-gpt-5-for-developers/"
  },
  {
   "company": "mistral",
   "name": "Mistral Medium 3.1",
   "date": "2025-08-12",
   "tier": "flagship",
   "score": 135.3,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Point update of Mistral's top closed model (better tone, performance and web search)",
   "source": "https://docs.mistral.ai/resources/changelogs"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3.1",
   "date": "2025-08-19",
   "tier": "flagship",
   "score": 139.9,
   "openWeights": true,
   "about": "Hybrid thinking/non-thinking in one model with much stronger agent/tool use; app+web upgraded and base weights out 08-19, official launch 08-21",
   "source": "https://api-docs.deepseek.com/news/news250821"
  },
  {
   "company": "xai",
   "name": "Grok Code Fast 1",
   "date": "2025-08-28",
   "tier": "major",
   "score": 141.2,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Fast, cheap agentic coding model, free at launch in Copilot/Cursor etc.; quickly became the most-used model on OpenRouter",
   "source": "https://x.ai/news/grok-code-fast-1"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Max",
   "date": "2025-09-05",
   "tier": "flagship",
   "score": 142.4,
   "about": "First 1T+-parameter Qwen and Alibaba's largest model at the time: Qwen3-Max-Preview live in Qwen Chat/API on Sep 5, official Qwen3-Max release at the Apsara Conference on Sep 24.",
   "source": "https://x.com/Alibaba_Qwen/status/1963991502440562976"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2 0905",
   "date": "2025-09-05",
   "tier": "major",
   "score": 142.4,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "K2 update with stronger agentic and front-end coding and context doubled to 256K.",
   "source": "https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Next",
   "date": "2025-09-11",
   "tier": "major",
   "score": 137.7,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "Hybrid Gated DeltaNet + gated attention with ultra-sparse MoE (80B total / 3B active): ~10x cheaper training than Qwen3-32B; this architecture became the base of Qwen3.5 and later (announced 17:50 UTC Sep 11 = Sep 12 Beijing).",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "openai",
   "name": "GPT-5-Codex",
   "date": "2025-09-15",
   "tier": "major",
   "score": 149.7,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "GPT-5, дообученная для агентного программирования в Codex; способна работать над задачей 7+ часов",
   "source": "https://openai.com/index/introducing-upgrades-to-codex/"
  },
  {
   "company": "xai",
   "name": "Grok 4 Fast",
   "date": "2025-09-19",
   "tier": "major",
   "score": 144.2,
   "about": "Unified reasoning/non-reasoning model with 2M context, near Grok 4 quality at a fraction of the cost; free for all users",
   "source": "https://x.ai/news/grok-4-fast"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3.1-Terminus",
   "date": "2025-09-22",
   "tier": "flagship",
   "score": 142.5,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "Polished V3.1 (fixed language mixing, better code/search agents); final V3.1 iteration",
   "source": "https://api-docs.deepseek.com/news/news250922"
  },
  {
   "company": "anthropic",
   "name": "Claude Sonnet 4.5",
   "date": "2025-09-29",
   "tier": "flagship",
   "score": 146.8,
   "about": "Anthropic's frontier model at launch ('best coding model in the world'), outperforming Opus 4.1 at Sonnet prices and working autonomously for 30+ hours.",
   "source": "https://www.anthropic.com/news/claude-sonnet-4-5"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3.2-Exp",
   "date": "2025-09-29",
   "tier": "major",
   "score": 145.0,
   "openWeights": true,
   "about": "Experimental model introducing DeepSeek Sparse Attention (DSA) for cheap long context; API prices cut 50%+",
   "source": "https://api-docs.deepseek.com/news/news250929"
  },
  {
   "company": "anthropic",
   "name": "Claude Haiku 4.5",
   "date": "2025-10-15",
   "tier": "major",
   "score": 142.4,
   "about": "Small model with Sonnet 4-level coding at a third of the cost ($1/$5) and over twice the speed; first Haiku with extended thinking.",
   "source": "https://www.anthropic.com/news/claude-haiku-4-5"
  },
  {
   "company": "moonshot",
   "name": "Kimi Linear",
   "date": "2025-10-30",
   "tier": "minor",
   "score": 131.3,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Hybrid linear-attention model (Kimi Delta Attention) that beats full attention with up to ~6x faster decoding at 1M context; KDA later became the backbone of Kimi K3.",
   "source": "https://github.com/MoonshotAI/Kimi-Linear"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Max-Thinking (preview)",
   "date": "2025-11-03",
   "tier": "major",
   "score": 143.4,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Early intermediate checkpoint of the Max reasoning model in Qwen Chat and Alibaba Cloud API; with tools and test-time scaling it scored 100% on AIME 2025 and HMMT.",
   "source": "https://x.com/Alibaba_Qwen/status/1985347830110970027"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2 Thinking",
   "date": "2025-11-06",
   "tier": "flagship",
   "score": 146.0,
   "openWeights": true,
   "about": "Open 'thinking agent' (1T MoE, native INT4, 256K context) running 200-300 sequential tool calls; claimed SOTA on HLE (with tools) and BrowseComp, beating closed frontier models.",
   "source": "https://www.kimi.com/blog/kimi-k2-thinking"
  },
  {
   "company": "openai",
   "name": "GPT-5.1",
   "date": "2025-11-12",
   "tier": "flagship",
   "score": 149.7,
   "about": "GPT-5.1 Instant и Thinking: адаптивное рассуждение, более «тёплый» тон и пресеты личности; API с 13 нояб.",
   "source": "https://openai.com/index/gpt-5-1/"
  },
  {
   "company": "xai",
   "name": "Grok 4.1",
   "date": "2025-11-17",
   "tier": "flagship",
   "score": 148.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Took #1 on LMArena text (4.1 Thinking), fewer hallucinations, stronger emotional intelligence and writing; silently A/B-tested Nov 1-14",
   "source": "https://x.ai/news/grok-4-1"
  },
  {
   "company": "google",
   "name": "Gemini 3 Pro",
   "date": "2025-11-18",
   "tier": "flagship",
   "score": 153.0,
   "about": "New generation: first model over 1500 Elo on LMArena, launched same day in Gemini app, Search, AI Studio and the new Antigravity IDE",
   "source": "https://blog.google/products/gemini/gemini-3/"
  },
  {
   "company": "openai",
   "name": "GPT-5.1-Codex-Max",
   "date": "2025-11-19",
   "tier": "major",
   "score": 149.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis (GPT-5.1 Codex)",
   "about": "Агентная модель для кода с «компакцией» контекста — может работать над задачей более 24 часов",
   "source": "https://openai.com/index/gpt-5-1-codex-max/"
  },
  {
   "company": "xai",
   "name": "Grok 4.1 Fast",
   "date": "2025-11-19",
   "tier": "major",
   "score": 146.7,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Tool-calling model with 2M context, launched with the Agent Tools API ($0.20/$0.50 per M tokens)",
   "source": "https://x.ai/news/grok-4-1-fast"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4.5",
   "date": "2025-11-24",
   "tier": "flagship",
   "score": 150.1,
   "about": "Opus price cut by two-thirds ($5/$25) with state-of-the-art coding; first model above 80% on SWE-bench Verified.",
   "source": "https://www.anthropic.com/news/claude-opus-4-5"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3.2",
   "date": "2025-12-01",
   "tier": "flagship",
   "score": 146.3,
   "openWeights": true,
   "about": "Official V3.2 with DSA: reasoning-first model built for agents (thinking with tool use), claimed GPT-5-level; MIT",
   "source": "https://api-docs.deepseek.com/news/news251201"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V3.2-Speciale",
   "date": "2025-12-01",
   "tier": "major",
   "score": 141.6,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "Max-reasoning V3.2 variant (gold-level IMO 2025 / IOI 2025); temporary API endpoint plus open weights",
   "source": "https://api-docs.deepseek.com/news/news251201"
  },
  {
   "company": "mistral",
   "name": "Mistral Large 3",
   "date": "2025-12-02",
   "tier": "flagship",
   "score": 139.0,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis/LMArena",
   "openWeights": true,
   "about": "675B MoE (41B active) Apache 2.0 flagship plus Ministral 3 (3B/8B/14B); first Mistral MoE since Mixtral",
   "source": "https://mistral.ai/news/mistral-3"
  },
  {
   "company": "google",
   "name": "Gemini 3 Deep Think",
   "date": "2025-12-04",
   "tier": "major",
   "defaultHidden": true,
   "about": "Deep Think on Gemini 3 Pro for AI Ultra subscribers: 41% Humanity's Last Exam, 45.1% ARC-AGI-2",
   "source": "https://9to5google.com/2025/12/04/gemini-3-deep-think/"
  },
  {
   "company": "mistral",
   "name": "Devstral 2",
   "date": "2025-12-09",
   "tier": "major",
   "score": 135.1,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "123B coding model (72.2% SWE-bench Verified) + Devstral Small 2 24B, launched with Mistral Vibe CLI",
   "source": "https://mistral.ai/news/devstral-2-vibe-cli/"
  },
  {
   "company": "openai",
   "name": "GPT-5.2",
   "date": "2025-12-11",
   "tier": "flagship",
   "score": 153.4,
   "about": "GPT-5.2 Instant, Thinking и Pro — выпущена после «code red» в ответ на Gemini 3; упор на профессиональные задачи",
   "source": "https://openai.com/index/introducing-gpt-5-2/"
  },
  {
   "company": "google",
   "name": "Gemini 3 Flash",
   "date": "2025-12-17",
   "tier": "major",
   "score": 151.8,
   "about": "Pro-level reasoning at Flash speed; beat 2.5 Pro and became the default model in the Gemini app and AI Mode in Search",
   "source": "https://blog.google/products/gemini/gemini-3-flash/"
  },
  {
   "company": "openai",
   "name": "GPT-5.2-Codex",
   "date": "2025-12-18",
   "tier": "major",
   "score": 151.8,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Модель для агентного кодинга на базе GPT-5.2 с усиленными навыками кибербезопасности",
   "source": "https://openai.com/index/introducing-gpt-5-2-codex/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Max-Thinking",
   "date": "2026-01-26",
   "tier": "flagship",
   "score": 147.4,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "about": "Final >1T-parameter reasoning flagship (evening of Jan 26 Beijing) with adaptive tool use and test-time scaling; Alibaba claimed parity with GPT-5.2-Thinking, Claude Opus 4.5 and Gemini 3 Pro on 19 benchmarks (API snapshot qwen3-max-2026-01-23).",
   "source": "https://www.guancha.cn/economy/2026_01_27_805145.shtml"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2.5",
   "date": "2026-01-27",
   "tier": "flagship",
   "score": 148.1,
   "openWeights": true,
   "about": "Natively multimodal (text/image/video) 1T MoE with 'Agent Swarm' (up to 100 parallel sub-agents), launched together with the Kimi Code CLI.",
   "source": "https://www.kimi.com/blog/kimi-k2-5"
  },
  {
   "company": "alibaba",
   "name": "Qwen3-Coder-Next",
   "date": "2026-02-03",
   "tier": "major",
   "score": 136.1,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "80B-total / 3B-active coding-agent model on the Qwen3-Next architecture, trained on 800K verifiable tasks; runs locally in ~46GB (released ~16:00 UTC Feb 3 = midnight Feb 4 Beijing).",
   "source": "https://qwen.ai/blog?id=qwen3-coder-next"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4.6",
   "date": "2026-02-05",
   "tier": "major",
   "score": 155.4,
   "about": "Upgrade to the top model: first Opus with a 1M-token context (beta), adaptive thinking with effort levels, and agent teams in Claude Code.",
   "source": "https://www.anthropic.com/news/claude-opus-4-6"
  },
  {
   "company": "openai",
   "name": "GPT-5.3-Codex",
   "date": "2026-02-05",
   "tier": "major",
   "score": 156.8,
   "about": "Объединила кодинг GPT-5.2-Codex и рассуждения/знания GPT-5.2 в одной модели, на ~25% быстрее",
   "source": "https://openai.com/index/introducing-gpt-5-3-codex/"
  },
  {
   "company": "google",
   "name": "Gemini 3 Deep Think (фев)",
   "date": "2026-02-12",
   "tier": "major",
   "defaultHidden": true,
   "about": "Major Deep Think upgrade aimed at science: 84.6% ARC-AGI-2, 48.4% HLE, solved 18 open research problems; Ultra app + early API access",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/"
  },
  {
   "company": "openai",
   "name": "GPT-5.3-Codex-Spark",
   "date": "2026-02-12",
   "tier": "minor",
   "defaultHidden": true,
   "about": "Малая сверхбыстрая (1000+ ток/с) модель для кодинга в реальном времени — первая модель OpenAI на чипах Cerebras",
   "source": "https://openai.com/index/introducing-gpt-5-3-codex-spark/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.5",
   "date": "2026-02-16",
   "tier": "flagship",
   "score": 146.6,
   "openWeights": true,
   "about": "New natively multimodal agent generation on Lunar New Year's Eve: 397B total / 17B active hybrid linear-attention MoE, 201 languages, open weights plus hosted Qwen3.5-Plus; beat the 1T Qwen3-Max at a fraction of the cost.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "anthropic",
   "name": "Claude Sonnet 4.6",
   "date": "2026-02-17",
   "tier": "major",
   "score": 152.2,
   "about": "Near-Opus coding and computer use at Sonnet price ($3/$15); became the default for Free and Pro users; 1M context (beta).",
   "source": "https://www.anthropic.com/news/claude-sonnet-4-6"
  },
  {
   "company": "xai",
   "name": "Grok 4.20",
   "date": "2026-02-17",
   "tier": "flagship",
   "score": 152.0,
   "about": "Public beta ('Grok 4.2 release candidate') built around 4 collaborating agents and weekly improvements; API (grok-4.20-0309) in March",
   "source": "https://x.com/elonmusk/status/2023829664318583105"
  },
  {
   "company": "google",
   "name": "Gemini 3.1 Pro",
   "date": "2026-02-19",
   "tier": "flagship",
   "score": 155.0,
   "about": "Preview across Gemini app, API and Vertex; 77.1% ARC-AGI-2 (over double Gemini 3 Pro)",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.5 Medium",
   "date": "2026-02-24",
   "tier": "major",
   "score": 142.5,
   "scoreNote": "замер Qwen3.5-35B-A3B",
   "openWeights": true,
   "about": "Mid-size open Qwen3.5 models; the 35B-A3B and 27B became popular local agent/coding models.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.5 Small",
   "date": "2026-03-02",
   "tier": "minor",
   "score": 139.4,
   "scoreNote": "замер Qwen3.5-9B",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Small multimodal Qwen3.5 checkpoints (0.8B, 2B, 4B, 9B) for on-device use.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "google",
   "name": "Gemini 3.1 Flash-Lite",
   "date": "2026-03-03",
   "tier": "minor",
   "score": 144.4,
   "defaultHidden": true,
   "about": "Fastest, cheapest Gemini 3-series model ($0.25/$1.50 per M tokens), preview; GA May 7, 2026",
   "source": "https://siliconangle.com/2026/03/03/google-launches-speedy-gemini-3-1-flash-lite-model-preview/"
  },
  {
   "company": "openai",
   "name": "GPT-5.3 Instant",
   "date": "2026-03-03",
   "tier": "major",
   "defaultHidden": true,
   "about": "Новая модель ChatGPT по умолчанию: меньше лишних отказов и морализаторства, меньше галлюцинаций",
   "source": "https://openai.com/index/gpt-5-3-instant/"
  },
  {
   "company": "openai",
   "name": "GPT-5.4",
   "date": "2026-03-05",
   "tier": "flagship",
   "score": 156.9,
   "about": "GPT-5.4 Thinking и Pro: контекст ~1M, первая универсальная модель OpenAI с нативным управлением компьютером",
   "source": "https://openai.com/index/introducing-gpt-5-4/"
  },
  {
   "company": "mistral",
   "name": "Mistral Small 4",
   "date": "2026-03-16",
   "tier": "major",
   "score": 138.1,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "119B MoE Apache 2.0 model unifying instruct, reasoning (Magistral), vision (Pixtral) and agentic coding (Devstral) in one set of weights, 256K context",
   "source": "https://mistral.ai/news/mistral-small-4/"
  },
  {
   "company": "openai",
   "name": "GPT-5.4 mini",
   "date": "2026-03-17",
   "tier": "major",
   "score": 149.0,
   "about": "Малая модель уровня GPT-5.4, в 2+ раза быстрее GPT-5 mini; доступна бесплатным пользователям ChatGPT",
   "source": "https://openai.com/index/introducing-gpt-5-4-mini-and-nano/"
  },
  {
   "company": "openai",
   "name": "GPT-5.4 nano",
   "date": "2026-03-17",
   "tier": "minor",
   "score": 145.8,
   "defaultHidden": true,
   "about": "Самая дешёвая модель линейки GPT-5.4 ($0.20/1M вход), только API — классификация, извлечение, субагенты",
   "source": "https://openai.com/index/introducing-gpt-5-4-mini-and-nano/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.6-Plus",
   "date": "2026-03-30",
   "tier": "flagship",
   "score": 147.7,
   "about": "Proprietary flagship focused on agentic coding with 1M context: free 'Qwen3.6 Plus Preview' on OpenRouter from Mar 30 (19:35 UTC, i.e. Mar 31 Beijing), official launch Apr 2.",
   "source": "https://x.com/OpenRouter/status/2038701599175196715"
  },
  {
   "company": "google",
   "name": "Gemma 4",
   "date": "2026-04-02",
   "tier": "major",
   "score": 142.7,
   "openWeights": true,
   "about": "First Gemma under plain Apache 2.0: E2B, E4B, 26B-A4B MoE and 31B dense, multimodal, up to 256K context, configurable thinking",
   "source": "https://deepmind.google/models/gemma/gemma-4/"
  },
  {
   "company": "anthropic",
   "name": "Claude Mythos Preview",
   "date": "2026-04-07",
   "tier": "flagship",
   "scoreNote": "закрытый доступ для партнёров, публичных замеров нет",
   "defaultHidden": true,
   "limited": true,
   "about": "LIMITED ACCESS: new tier above Opus, withheld from general release because it finds and exploits software vulnerabilities better than nearly all humans; available only to Project Glasswing partners (AWS, Apple, Google, Microsoft, NVIDIA and others); system card published.",
   "source": "https://www.anthropic.com/glasswing"
  },
  {
   "company": "meta",
   "name": "Muse Spark",
   "date": "2026-04-08",
   "tier": "flagship",
   "score": 152.1,
   "about": "First model from Meta Superintelligence Labs (codename Avocado), successor to Llama 4 and Meta's first frontier model without open weights; launched in meta.ai / Meta AI app, API only as private preview",
   "source": "https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2.6",
   "date": "2026-04-13",
   "tier": "flagship",
   "score": 151.0,
   "openWeights": true,
   "about": "Long-horizon agentic coding model (4,000+ tool calls, 12h+ runs, 300-agent swarms), open weights; public preview as 'K2.6 Code Preview' in Kimi Code from Apr 13, full release with weights Apr 20.",
   "source": "https://www.kimi.com/blog/kimi-k2-6"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.6-35B-A3B",
   "date": "2026-04-16",
   "tier": "major",
   "score": 143.9,
   "openWeights": true,
   "about": "Open Apache-2.0 agentic-coding MoE (35B / 3B active) bringing Qwen3.6 improvements to local hardware.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4.7",
   "date": "2026-04-16",
   "tier": "major",
   "score": 156.4,
   "about": "Opus upgrade: SWE-bench Verified up from 80.8% to 87.6%, higher-resolution vision, and a new 'xhigh' effort level; Claude Design launched alongside it.",
   "source": "https://www.anthropic.com/news/claude-opus-4-7"
  },
  {
   "company": "xai",
   "name": "Grok 4.3",
   "date": "2026-04-17",
   "tier": "flagship",
   "score": 149.1,
   "about": "Beta for SuperGrok/Premium+ (API ~Apr 30): 1M context, native video input, low $1.25/$2.50 pricing",
   "source": "https://docs.x.ai/developers/models/grok-4.3"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.6-Max-Preview",
   "date": "2026-04-20",
   "tier": "flagship",
   "score": 149.3,
   "about": "Early preview of the next flagship (~1T MoE, 256K context); Alibaba reported top scores on six coding/agent benchmarks incl. SWE-bench Pro and Terminal-Bench 2.0.",
   "source": "https://qwen.ai/blog?id=qwen3.6-max-preview"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.6-27B",
   "date": "2026-04-22",
   "tier": "major",
   "score": 146.5,
   "openWeights": true,
   "about": "Dense 27B open model that surpasses Qwen3.5-397B-A17B on major coding benchmarks.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "openai",
   "name": "GPT-5.5",
   "date": "2026-04-23",
   "tier": "flagship",
   "score": 159.2,
   "about": "Кодовое имя Spud: агентная модель для кода, исследований и работы с ПО, через 6 недель после GPT-5.4; вместе с GPT-5.5 Pro (API — 24 апр.)",
   "source": "https://openai.com/index/introducing-gpt-5-5/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V4",
   "date": "2026-04-24",
   "tier": "flagship",
   "score": 149.1,
   "openWeights": true,
   "about": "Long-awaited V4 (reportedly planned for mid-Feb): V4-Pro 1.6T MoE (49B active) + V4-Flash 284B (13B active), 1M-token context, MIT weights same day",
   "source": "https://api-docs.deepseek.com/news/news260424/"
  },
  {
   "company": "mistral",
   "name": "Mistral Medium 3.5",
   "date": "2026-04-29",
   "tier": "flagship",
   "score": 141.4,
   "openWeights": true,
   "about": "128B dense open-weight (modified MIT) unified model with reasoning toggle, 77.6% SWE-bench Verified; replaced Magistral, Devstral 2 and Medium 3.1",
   "source": "https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04"
  },
  {
   "company": "openai",
   "name": "GPT-5.5 Instant",
   "date": "2026-05-05",
   "tier": "major",
   "score": 142.5,
   "about": "Новая модель ChatGPT по умолчанию вместо GPT-5.3 Instant; меньше выдуманных ответов в медицине, праве, финансах",
   "source": "https://openai.com/index/gpt-5-5-instant/"
  },
  {
   "company": "google",
   "name": "Gemini 3.5 Flash",
   "date": "2026-05-19",
   "tier": "flagship",
   "score": 154.6,
   "about": "Opened the Gemini 3.5 series at I/O 2026, beat 3.1 Pro on agentic benchmarks and became the default everywhere; 3.5 Pro promised for June but still unreleased",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.7-Max",
   "date": "2026-05-20",
   "tier": "flagship",
   "score": 153.7,
   "about": "Agent-era proprietary flagship (1M context) launched at the Alibaba Cloud Summit; ran a 35-hour autonomous kernel-optimization task; #1 Chinese model on Arena. Previews had surfaced on LMArena May 18; the open-weight line skipped 3.7.",
   "source": "https://qwen.ai/blog?id=qwen3.7"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 4.8",
   "date": "2026-05-28",
   "tier": "major",
   "score": 158.3,
   "about": "Incremental Opus upgrade six weeks after 4.7: more honest about its own progress, lowest hallucination rate, longer independent work; fast mode made 3x cheaper.",
   "source": "https://www.anthropic.com/news/claude-opus-4-8"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.7-Plus",
   "date": "2026-06-02",
   "tier": "major",
   "score": 147.4,
   "about": "Multimodal agent model unifying vision and language (GUI and CLI operation, coding agent) on Alibaba Cloud Bailian/Model Studio (announced 17:54 UTC Jun 1 = Jun 2 Beijing).",
   "source": "https://x.com/Alibaba_Qwen/status/2061506641120641494"
  },
  {
   "company": "google",
   "name": "Gemma 4 12B (Unified)",
   "date": "2026-06-03",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Encoder-free 12B Gemma 4 with native image+audio input; exact day uncertain (Transformers support landed Jun 3, models.dev lists Jun 9)",
   "source": "https://huggingface.co/google/gemma-4-12B"
  },
  {
   "company": "anthropic",
   "name": "Claude Fable 5",
   "date": "2026-06-09",
   "tier": "flagship",
   "score": 163.6,
   "about": "First Mythos-class model made safe for general use (Claude 5 generation, SOTA on nearly all benchmarks, $10/$50); a US export-control directive forced a worldwide suspension from Jun 12 to Jul 1, 2026.",
   "source": "https://www.anthropic.com/news/claude-fable-5-mythos-5"
  },
  {
   "company": "google",
   "name": "DiffusionGemma",
   "date": "2026-06-10",
   "tier": "minor",
   "defaultHidden": true,
   "openWeights": true,
   "about": "Google's first open-weight text-diffusion LLM (26B-A4B, block diffusion for faster generation); date from Transformers/gemma-library releases",
   "source": "https://huggingface.co/google/diffusiongemma-26B-A4B-it"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2.7 Code",
   "date": "2026-06-12",
   "tier": "major",
   "score": 150.0,
   "openWeights": true,
   "about": "Coding-specialized successor of K2.6 (1T/32B active, 256K context) using ~30% fewer thinking tokens; open weights under Modified MIT.",
   "source": "https://huggingface.co/moonshotai/Kimi-K2.7-Code"
  },
  {
   "company": "anthropic",
   "name": "Claude Sonnet 5",
   "date": "2026-06-30",
   "tier": "major",
   "score": 156.3,
   "about": "Most agentic Sonnet yet, close to Opus 4.8 performance at a lower price ($2/$10, later made permanent); new default model for Free and Pro.",
   "source": "https://www.anthropic.com/news/claude-sonnet-5"
  },
  {
   "company": "xai",
   "name": "Grok 4.5",
   "date": "2026-07-08",
   "tier": "flagship",
   "score": 154.0,
   "about": "Bigger model aimed at coding and cost (Musk: 'roughly comparable to Opus 4.7, but much faster'); EU access Jul 17",
   "source": "https://x.ai/news/grok-4-5"
  },
  {
   "company": "meta",
   "name": "Muse Spark 1.1",
   "date": "2026-07-09",
   "tier": "flagship",
   "score": 154.3,
   "about": "Agentic update (tool/computer use, coding, 1M context) launched with the self-serve Meta Model API public preview - first time outside developers could use and pay for a Muse model",
   "source": "https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/"
  },
  {
   "company": "openai",
   "name": "GPT-5.6 Luna",
   "date": "2026-07-09",
   "tier": "major",
   "score": 156.3,
   "about": "Быстрый и самый дешёвый уровень GPT-5.6; позже доступ расширен на бесплатных пользователей ChatGPT",
   "source": "https://openai.com/index/gpt-5-6/"
  },
  {
   "company": "openai",
   "name": "GPT-5.6 Sol",
   "date": "2026-07-09",
   "tier": "flagship",
   "score": 162.0,
   "about": "Флагман нового семейства Sol/Terra/Luna; 26 июня — закрытое превью для ~20 партнёров по просьбе правительства США",
   "source": "https://openai.com/index/gpt-5-6/"
  },
  {
   "company": "openai",
   "name": "GPT-5.6 Terra",
   "date": "2026-07-09",
   "tier": "major",
   "score": 159.3,
   "about": "Сбалансированный уровень GPT-5.6: качество около GPT-5.5 примерно вдвое дешевле",
   "source": "https://openai.com/index/gpt-5-6/"
  },
  {
   "company": "moonshot",
   "name": "Kimi K3",
   "date": "2026-07-16",
   "tier": "flagship",
   "score": 157.7,
   "openWeights": true,
   "about": "2.8T-parameter MoE (104B active) with Kimi Delta Attention + Attention Residuals, native vision, 1M context - largest open-weight model at release, claimed near Claude Fable 5; weights published Jul 27 under a custom Kimi K3 License (announcement 18:58 UTC Jul 16 = Jul 17 Beijing).",
   "source": "https://www.kimi.com/blog/kimi-k3"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.8-Max",
   "date": "2026-07-19",
   "tier": "flagship",
   "score": 156.7,
   "about": "2.4T-parameter MoE (95B active), Alibaba's largest model: preview shown at WAIC and live via Token Plan/Qoder on Jul 19, general availability Aug 3 (#2 on Arena behind Claude); its text-only weights were opened Aug 12 (separate entry).",
   "source": "https://github.com/QwenLM/qwen-code/pull/7199"
  },
  {
   "company": "google",
   "name": "Gemini 3.5 Flash-Lite",
   "date": "2026-07-21",
   "tier": "minor",
   "score": 145.1,
   "defaultHidden": true,
   "about": "Fastest 3.5-series model (~350 tokens/s) for high-volume workloads",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/"
  },
  {
   "company": "google",
   "name": "Gemini 3.6 Flash",
   "date": "2026-07-21",
   "tier": "major",
   "score": 154.4,
   "about": "Workhorse update: 17% fewer output tokens than 3.5 Flash with cheaper output pricing; shipped without the delayed 3.5 Pro",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 5",
   "date": "2026-07-24",
   "tier": "major",
   "score": 162.7,
   "about": "Near-Fable 5 intelligence at Opus speed and price ($5/$25), about half the cost per task; 1M context with adaptive thinking by default.",
   "source": "https://www.anthropic.com/news/claude-opus-5"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V4-Flash-0731",
   "date": "2026-07-31",
   "tier": "major",
   "score": 154.5,
   "openWeights": true,
   "about": "Official (non-preview) V4-Flash, re-post-trained for coding/agents; DeepSeek says it beats the V4-Pro preview; MIT weights",
   "source": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731"
  },
  {
   "company": "meta",
   "name": "Muse Spark 1.2",
   "date": "2026-08-05",
   "tier": "flagship",
   "score": 155.2,
   "about": "Coding-centric update shipped with Muse Code, MSL's first terminal coding agent; on 2026-08-10 Meta promised to open its weights 'soon' (not published as of early/mid Sep 2026)",
   "source": "https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2"
  },
  {
   "company": "meta",
   "name": "Muse Glimmer 30B",
   "date": "2026-08-10",
   "tier": "major",
   "score": 144.9,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "30B Apache-2.0 model distilled from Muse Spark for local agentic use on a single GPU/laptop - Meta's return to open weights after Llama 4",
   "source": "https://www.cnbc.com/2026/08/10/meta-muse-glimmer-open-weight-ai.html"
  },
  {
   "company": "xai",
   "name": "Grok 4.6",
   "date": "2026-08-12",
   "tier": "flagship",
   "score": 156.5,
   "about": "Frontier model for long-running agents; 61 on the Artificial Analysis Intelligence Index, tied for 3rd in the world",
   "source": "https://venturebeat.com/technology/spacexai-debuts-grok-4-6-overtaking-kimi-k3s-performance-and-matching-gpt-5-6-sol-for-worlds-third-best-on-artificial-analysis"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V4-Pro-0813",
   "date": "2026-08-13",
   "tier": "flagship",
   "score": 155.4,
   "openWeights": true,
   "about": "V4-Pro leaves preview (GA build focused on agents, thinking/non-thinking modes); weights on HF; listed on OpenRouter 08-12 US time",
   "source": "https://api-docs.deepseek.com/news/news260813/"
  },
  {
   "company": "google",
   "name": "Gemini 3.7 Flash",
   "date": "2026-08-13",
   "tier": "major",
   "score": 157.7,
   "about": "'Most intelligent workhorse' for coding and agents (65.3% DeepSWE), 23 days after 3.6 Flash, still ahead of 3.5 Pro",
   "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.8-27B",
   "date": "2026-08-14",
   "tier": "major",
   "score": 149.4,
   "openWeights": true,
   "about": "Dense 27B multimodal (image/video input) open model under Apache 2.0 - the practical single-GPU Qwen3.8; pre-announced with Qwen3.8-Max.",
   "source": "https://github.com/QwenLM/Qwen3.8"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.8-Flash-Next",
   "date": "2026-08-26",
   "tier": "major",
   "score": 156.8,
   "scoreEst": true,
   "scoreNote": "оценка по Artificial Analysis",
   "openWeights": true,
   "about": "Open 125B (+51B n-gram embeddings, 6B active) multimodal MoE released as an early preview of the Qwen4 architecture (Gated DeltaNet + Qwen Sparse Attention, Gated Residual, Muon).",
   "source": "https://github.com/QwenLM/Qwen3.8-Flash-Next"
  },
  {
   "company": "anthropic",
   "name": "Claude Fable 5.1",
   "date": "2026-09-01",
   "tier": "major",
   "score": 165.0,
   "about": "Upgrade of the top generally available model, billed as the world's most advanced for coding and knowledge work, with big gains in scientific research and long agentic runs; cache reads 75% cheaper.",
   "source": "https://www.anthropic.com/claude-fable-and-mythos-5-1"
  },
  {
   "company": "alibaba",
   "name": "Qwen3.8-Max-0902",
   "date": "2026-09-02",
   "tier": "minor",
   "score": 155.3,
   "defaultHidden": true,
   "about": "Post-training update snapshot of Qwen3.8-Max (stronger coding, collaborative agents, multimodal document understanding).",
   "source": "https://weibo.com/ttarticle/p/show?id=2309405338660580229122"
  },
  {
   "company": "google",
   "name": "Gemini 3.8 Flash",
   "date": "2026-09-02",
   "tier": "major",
   "score": 157.1,
   "about": "Google's most intelligent Flash model for long-horizon software engineering and autonomous agents; newest Gemini as of Sep 2026",
   "source": "https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash"
  },
  {
   "company": "meta",
   "name": "Muse Spark 1.3",
   "date": "2026-09-02",
   "tier": "flagship",
   "score": 156.9,
   "about": "Meta's most capable model to date per Meta (multimodal, 1M context), released to developers via Meta Model API and Muse Code; Meta claims near-frontier coding",
   "source": "https://www.bloomberg.com/news/articles/2026-09-02/meta-releases-more-powerful-ai-model-edging-closer-to-rivals"
  },
  {
   "company": "openai",
   "name": "GPT-6 Astra",
   "date": "2026-09-04",
   "tier": "flagship",
   "score": 166.6,
   "about": "Новое поколение GPT-6: первая модель OpenAI с «критическим» уровнем кибервозможностей; основа GPT-6 Pro в ChatGPT",
   "source": "https://openai.com/index/gpt-6-astra/"
  },
  {
   "company": "deepseek",
   "name": "DeepSeek-V4.1-Flash",
   "date": "2026-09-08",
   "tier": "flagship",
   "score": 155.0,
   "openWeights": true,
   "about": "New-architecture, natively multimodal 552B MoE that DeepSeek says beats V4-Pro; 2-day API beta from 09-08, official GA + MIT weights 09-10",
   "source": "https://www.deepseek.com/en/news/deepseek-v4-1-flash/"
  },
  {
   "company": "moonshot",
   "name": "Kimi K2.8 Preview",
   "date": "2026-09-11",
   "tier": "major",
   "scoreNote": "вышла 11.09.2026 — замеров ещё нет",
   "about": "Closed mid-tier model in Kimi Code / Kimi Work with 1M context and low/high/max thinking effort - the first K2-series model shipped without open weights.",
   "source": "https://www.kimi.com/code/docs/en/kimi-code/whats-new.html#k2-8-preview-september-11-2026"
  },
  {
   "company": "xai",
   "name": "Grok 4.7",
   "date": "2026-09-21",
   "tier": "flagship",
   "scoreNote": "вышла 21.09.2026 — замеров ещё нет",
   "about": "New flagship (~2.1T params per reports) for coding and knowledge work, same $2/$6 pricing, live in app, API, Cursor and Grok Build; Grok 4.8 is only teased",
   "source": "https://decrypt.co/378824/xai-launches-grok-4-7"
  },
  {
   "company": "anthropic",
   "name": "Claude Opus 5.5",
   "date": "2026-09-22",
   "tier": "flagship",
   "scoreNote": "вышла 22.09.2026 — замеров ещё нет",
   "about": "First model of the Claude 5.5 family: Fable 5.1-level performance on most work at about 40% lower running cost than Opus 5 ($4/$20) and 30%+ faster output.",
   "source": "https://www.anthropic.com/claude-opus-5-5"
  },
  {
   "company": "openai",
   "name": "GPT-6 Luna",
   "date": "2026-09-22",
   "tier": "major",
   "scoreNote": "вышла 22.09.2026 — замеров ещё нет",
   "about": "Быстрая и дешёвая модель поколения GPT-6 ($0.10/$0.50 за 1M токенов)",
   "source": "https://openai.com/index/introducing-gpt-6-sol-and-luna/"
  },
  {
   "company": "openai",
   "name": "GPT-6 Sol",
   "date": "2026-09-22",
   "tier": "major",
   "scoreNote": "вышла 22.09.2026 — замеров ещё нет",
   "about": "Рабочая модель GPT-6 для кода и повседневных задач: вдвое меньше ошибок, чем у GPT-5.6 Sol, и вдвое дешевле",
   "source": "https://openai.com/index/introducing-gpt-6-sol-and-luna/"
  }
 ]
};
