/*
  # Add Civic Mind Project

  ## Summary
  Inserts the Civic Mind project into the projects table.

  ## New Data
  - 1 new project: Civic Mind — Emergent AI City Simulation Platform
    - Category: AI Agents
    - Featured: true
    - sort_order: 3 (inserted between LifeOS and Market Intelligence Engine; existing entries 3+ shifted up)
    - Full bilingual content (EN + ZH)
    - 4 impact stats, 8 tech tags

  ## Notes
  - Shifts sort_order of existing projects 3+ up by 1 to make room
*/

UPDATE projects SET sort_order = sort_order + 1 WHERE sort_order >= 3;

INSERT INTO projects (
  title,
  category,
  description,
  long_description,
  logic_map,
  media_urls,
  impact_stats,
  tech_tags,
  is_featured,
  sort_order,
  translations
)
SELECT
  'Civic Mind — Emergent AI City Simulation',
  'AI Agents',
  'An experimental multi-agent city simulation platform built on the SecondMe framework. Hundreds of AI agents with independent identities, memories, and decision-making capabilities coexist in a shared digital environment — producing unpredictable emergent social behaviors.',
  '## Project Background
When AI Agents started becoming widespread, I kept thinking about one question: what would happen if a city were entirely populated by AI residents?

Each AI has its own identity, memory, goals, and decision-making ability. When they move, work, and interact in the same digital space — what kinds of collective behaviors emerge? Are those behaviors predictable? Could something analogous to human social "emergence" appear?

Civic Mind is my exploration of that question.

## Four Core Modules
**City / Overview** — Real-time global city state monitoring center. Interactive map with dynamic heatmap layers showing population density and flow trends, plus a live data dashboard for key simulation metrics.

**Citizens / Management** — AI Agent individual management and analysis. An extensible citizen attributes system using `JSONB` fields, individual behavior trajectory tracking, and complex relationship queries powered by PostgreSQL.

**Chronicle / Timeline** — City event timeline recording and analysis. Time-series data storage, event correlation analysis for discovering causal chains, and historical playback to reconstruct any past city state.

**Governance / Rules** — City rules and decision management. Visual rule editing interface, policy impact simulation, A/B testing support to compare different governance approaches, and quantified policy effectiveness tracking.

## Technical Highlights
**Real-time state sync** — Supabase Realtime subscriptions on database WAL changes, batched incremental updates push only changed fields. State update latency < 100ms for 300+ concurrent agents.

**Performance optimization** — Virtualized list rendering only paints viewport-visible agents. `React.memo` + `useMemo` eliminate redundant re-renders. Map interactions throttled via `requestAnimationFrame`. Result: 60fps sustained with 300+ agents.

**Scalable data model** — `JSONB` fields for dynamic citizen attributes and real-time state. GIN indexes on JSONB columns for sub-100ms queries. Supabase Migrations for zero-downtime schema evolution.

**Data visualization** — D3.js custom city heatmap with SVG + Canvas hybrid rendering, Recharts for statistical dashboards, Framer Motion for layout transitions and guided attention.',
  NULL,
  ARRAY[]::text[],
  '[{"label":"AI Agents","value":"300+"},{"label":"Core Modules","value":"4"},{"label":"State Latency","value":"<100ms"},{"label":"Render FPS","value":"60"}]'::jsonb,
  ARRAY['Next.js 14','TypeScript','Supabase','PostgreSQL','D3.js','Framer Motion','Recharts','Tailwind CSS'],
  true,
  3,
  jsonb_build_object(
    'zh', jsonb_build_object(
      'title', 'Civic Mind — AI 城市涌现模拟平台',
      'description', '基于 SecondMe 框架的实验性多智能体城市模拟系统。数百个拥有独立身份、记忆和决策能力的 AI Agent 在同一数字环境中共存，产生不可预测的社会行为涌现。',
      'long_description', E'## 项目背景\n当 AI Agent 开始普及时，我一直在思考一个问题：如果一座城市完全由 AI 居民组成，会发生什么？\n\n每个 AI 都有自己的身份、记忆、目标和决策能力。当它们在同一个数字空间中移动、工作、互动时，会产生什么样的群体行为？这些行为是可预测的吗？会不会出现类似人类社会的"涌现"现象？\n\nCivic Mind 就是我对这个问题的探索。\n\n## 四大核心模块\n**City / 城市概览** — 城市全局状态监控中心。带动态热力图层的交互式地图，实时显示人口密度和流动趋势，以及关键模拟指标的实时数据面板。\n\n**Citizens / 公民管理** — AI Agent 个体管理与分析。使用 JSONB 字段的可扩展公民属性系统、个体行为轨迹追踪，以及 PostgreSQL 驱动的复杂关系查询。\n\n**Chronicle / 编年史** — 城市事件时间线记录与分析。时序数据存储、发现因果链的事件关联分析，以及重现任意历史城市状态的历史回溯功能。\n\n**Governance / 治理系统** — 城市规则与决策管理。可视化规则编辑界面、政策影响模拟、支持对比不同治理方式的 A/B 测试，以及量化政策成效追踪。\n\n## 技术亮点\n**实时状态同步** — 基于 PostgreSQL WAL 变更的 Supabase Realtime 订阅，批量增量更新只推送变更字段。300+ 并发 Agent 状态更新延迟 < 100ms。\n\n**性能优化** — 虚拟列表渲染只绘制视口内可见 Agent。React.memo 与 useMemo 消除冗余重渲染。地图交互通过 requestAnimationFrame 节流。成果：300+ Agent 稳定维持 60fps。\n\n**可扩展数据模型** — JSONB 字段存储动态公民属性和实时状态。JSONB 列的 GIN 索引实现 100ms 以内查询。Supabase Migrations 实现零停机架构演进。\n\n**数据可视化** — D3.js 自定义城市热力图（SVG + Canvas 混合渲染），Recharts 统计仪表盘，Framer Motion 布局过渡与视觉引导。',
      'impact_stats', '[{"label":"AI Agent 数量","value":"300+"},{"label":"核心模块","value":"4 个"},{"label":"状态延迟","value":"<100ms"},{"label":"渲染帧率","value":"60fps"}]'::jsonb
    )
  );
