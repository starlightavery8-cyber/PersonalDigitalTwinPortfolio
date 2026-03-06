/*
  # Update LifeOS Project — Enriched Content

  ## Summary
  Updates the LifeOS project with:
  - Fixed sort_order to 2 (BOK stays at 1)
  - Enriched English long_description with interview-ready detail
  - Enriched Chinese long_description with full technical depth
  - Updated tech_tags sorted by importance
  - Updated Mermaid logic_map with cleaner architecture showing all 4 stages + AI engines
*/

UPDATE projects
SET
  sort_order = 2,
  tech_tags = ARRAY[
    'React 18', 'TypeScript 5', 'Vite', 'shadcn/ui', 'TailwindCSS',
    'TanStack Query', 'Supabase', 'PostgreSQL', 'Edge Functions (Deno)',
    'OpenAI GPT-4o-mini', 'Gemini API', 'OpenClaw Gateway',
    'Zod', 'React Hook Form', 'React Router v6',
    'GitHub Actions', 'Playwright', 'Docker', 'Kubernetes',
    'OpenTelemetry', 'SSE', 'Framer Motion'
  ],
  long_description = E'## Problem\nDaily information arrives fragmented across WeChat, Telegram, email, and web-clipping tools. Manually sorting, categorising, and routing this data consumes enormous "non-creative" cognitive energy — making sustained knowledge accumulation and task closure nearly impossible.\n\n## Solution: 4-Stage AI Pipeline\n**One input. Closed-loop management.**\n\n**Stage 1 — Capture**\nMulti-platform API listeners (Cubox, webhooks, email) ingest all messages and sync external bookmarks into a unified `Message_Inbox` table via Supabase Edge Functions.\n\n**Stage 2 — Synthesize**\nGPT-4o-mini detects contextual relationships between fragments and aggregates scattered messages into semantically coherent `Lb_Items` entries.\n\n**Stage 3 — Classify**\nTwo-step intent recognition: first interprets the message intent, then routes to one of 8 categories — Task, Calendar, Journal, Knowledge, Innovation, Routine, Note, Archive — with 85%+ accuracy.\n\n**Stage 4 — Execute**\nConditional routing delivers entries to the right system: Tasks → Notion GTD, Events → Google Calendar, Insights → Knowledge Vault. Zero manual intervention.\n\n## Engineering Depth\n\n**Dual-Engine Failover:** OpenAI and Gemini APIs run in active-passive configuration with automatic failover on quota, auth, or timeout errors — delivering 99.9% uptime.\n\n**OpenClaw Local Gateway:** Privacy-first local AI component supporting multi-agent orchestration, vector memory, and a skill system — sensitive data never leaves the device.\n\n**Enterprise CI/CD:** 14 GitHub Actions workflows covering lint, type-check, Vitest unit tests, Playwright E2E, bundle-size analysis, Docker image builds, and K8s rolling deployments — every commit is production-safe.\n\n**Observability:** OpenTelemetry distributed tracing, Tunnel health monitoring, and Codecov coverage tracking across 479 test files.\n\n## Scale\n694 React components · 479 test files · 14 CI/CD workflows · ~15 MB codebase',
  logic_map = '{"type":"mermaid","definition":"flowchart LR\n    A([\"Input\\\\nCubox / WeChat / Email\"]) --> B[\"Stage 1\\\\nCapture\"]\n    B --> C[\"Stage 2\\\\nSynthesize\"]\n    C --> D[\"Stage 3\\\\nClassify\\\\n8 Intent Types\"]\n    D --> E[\"Stage 4\\\\nRoute & Execute\"]\n    E --> F1[\"Task\\\\nNotion GTD\"]\n    E --> F2[\"Calendar\\\\nGoogle Calendar\"]\n    E --> F3[\"Knowledge\\\\nVault\"]\n    E --> F4[\"Other\\\\nArchive / Journal\"]\n\n    AI1[\"GPT-4o-mini\"] -.->|Cloud| C\n    AI2[\"Gemini API\"] -.->|Failover| C\n    AI3[\"OpenClaw\"] -.->|Local| D\n\n    style A fill:#FF6B35,stroke:#1A1A1A,stroke-width:2px,color:#fff\n    style B fill:#00D4AA,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style C fill:#00D4AA,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style D fill:#00D4AA,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style E fill:#FFD60A,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style F1 fill:#F5F0E8,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style F2 fill:#F5F0E8,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style F3 fill:#F5F0E8,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style F4 fill:#F5F0E8,stroke:#1A1A1A,stroke-width:2px,color:#1A1A1A\n    style AI1 fill:#1A1A1A,stroke:#00D4AA,stroke-width:1px,color:#F5F0E8\n    style AI2 fill:#1A1A1A,stroke:#00D4AA,stroke-width:1px,color:#F5F0E8\n    style AI3 fill:#1A1A1A,stroke:#FFD60A,stroke-width:1px,color:#F5F0E8"}',
  translations = jsonb_build_object(
    'zh', jsonb_build_object(
      'title', 'LifeOS — 智能工作流系统',
      'description', '基于 OpenAI/Gemini 双引擎驱动的个人神经中枢。四阶段 AI 流水线（获取→聚合→识别→路由）将碎片化消息转化为「一次输入，闭环管理」的知识与行动矩阵，意图识别准确率 85%+。',
      'impact_stats', '[{"label":"意图识别准确率","value":"85%+"},{"label":"平均处理时间","value":"<5秒"},{"label":"每周节省时间","value":"10h+"},{"label":"系统可用性","value":"99.9%"},{"label":"React 组件数","value":"694"},{"label":"CI/CD 工作流","value":"14"}]'::jsonb,
      'long_description', E'## 核心痛点\n日常信息通过微信、Telegram、邮件、Cubox 等渠道极度碎片化。认知上下文的断裂导致用户在搬运和分类信息上耗费大量「非创造性」时间，难以维持长期的知识积累与任务闭环。\n\n## 解决方案：四阶段 AI 流水线\n**一次输入，闭环管理。**\n\n**Stage 1 — 获取 (Capture)**\n多平台 API 监听（Cubox、Webhook、邮件），实现全量消息捕获，同步至统一的 `Message_Inbox` 表，由 Supabase Edge Functions 驱动。\n\n**Stage 2 — 聚合 (Synthesize)**\nGPT-4o-mini 自动识别上下文关联，将零散消息聚合为结构化、语义连贯的 `Lb_Items` 条目。\n\n**Stage 3 — 识别 (Classify)**\n两步意图识别：先解读意图，再分类为 8 种类型——任务、日程、日记、知识、创新、例程、笔记、归档，准确率 85%+。\n\n**Stage 4 — 路由 (Execute)**\n按类型自动分发：任务进入 Notion GTD，日程写入 Google Calendar，知识归档至知识库——全程无需人工干预。\n\n## 工程深度\n\n**双引擎冗余：** OpenAI 与 Gemini API 主备配置，基于错误类型（quota / auth / timeout）自动故障转移，确保 99.9% 系统可用性。\n\n**OpenClaw 本地网关：** 隐私优先的本地 AI 组件，支持多 Agent 协作、向量内存与技能系统，敏感数据在设备端处理，无需上云。\n\n**企业级工程标准：** 14 个 GitHub Actions 工作流，涵盖 Lint、类型检查、Vitest 单元测试、Playwright E2E、Bundle 体积分析、Docker 构建与 K8s 滚动发布——每次提交均生产就绪。\n\n**可观测性：** OpenTelemetry 分布式链路追踪、Tunnel 健康监控与 Codecov 覆盖率统计，覆盖 479 个测试文件。\n\n## 项目规模\n694 个 React 组件 · 479 个测试文件 · 14 个 CI/CD 工作流 · 约 15 MB 代码库'
    )
  )
WHERE title LIKE '%LifeOS%';

-- Fix BOK sort_order to ensure correct ordering
UPDATE projects SET sort_order = 1 WHERE title LIKE '%BOK%';
