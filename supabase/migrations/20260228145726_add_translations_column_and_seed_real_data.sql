/*
  # Add Translations JSONB Column + Seed Real Avery Wong (王洁) Data

  ## Summary
  This migration adds bilingual support (EN/ZH) to the portfolio database and
  replaces all fictional seed data with Avery Wong's real resume content.

  ## Schema Changes
  1. `projects` — add `translations` JSONB column for ZH title/description/long_description/impact_stats
  2. `experience` — add `translations` JSONB column for ZH role/company/achievements
  3. `skills` — add `translations` JSONB column for ZH name

  ## New Data
  - 5 experience entries (real career history)
  - 5 projects across AI Agents, Hardware, Spatial Design
  - 14 skills across Build / Think / Connect categories

  ## Security
  - RLS already enabled on all tables from previous migration
  - No policy changes needed
*/

-- Add translations column to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'translations'
  ) THEN
    ALTER TABLE projects ADD COLUMN translations jsonb DEFAULT NULL;
  END IF;
END $$;

-- Add translations column to experience
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experience' AND column_name = 'translations'
  ) THEN
    ALTER TABLE experience ADD COLUMN translations jsonb DEFAULT NULL;
  END IF;
END $$;

-- Add translations column to skills
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'skills' AND column_name = 'translations'
  ) THEN
    ALTER TABLE skills ADD COLUMN translations jsonb DEFAULT NULL;
  END IF;
END $$;

-- Clear existing seed data
DELETE FROM projects;
DELETE FROM experience;
DELETE FROM skills;

-- ==================== EXPERIENCE ====================

INSERT INTO experience (company, role, achievements, is_academic, year_start, year_end, location, translations) VALUES
(
  'Yunie (Shanghai) Technology',
  'AI Product Manager (Intern)',
  '- Designed and shipped 3 AI product features including smart onboarding and in-app guided flows, improving D7 user retention by 12%
- Built n8n automation pipelines to scrape Reddit and internal databases for competitive analysis, cutting research time by 60%
- Wrote detailed PRDs and prompt engineering specifications; collaborated across design, engineering, and operations
- Instrumented Google Analytics funnels to identify and resolve a 40% drop-off in the onboarding flow',
  false,
  2025,
  NULL,
  'Shanghai, China',
  '{"zh": {"role": "AI产品经理（实习）", "company": "上海与你信息科技", "achievements": "- 设计并交付3项AI产品功能，包括智能引导和应用内流程，D7用户留存率提升12%\n- 构建n8n自动化流程抓取Reddit及内部数据库进行竞品分析，研究时间缩短60%\n- 撰写详细PRD和提示词工程规范，跨设计、技术和运营团队协作\n- 通过Google Analytics漏斗分析，定位并解决引导流程中40%的流失问题"}}'
),
(
  'Su Architect',
  'Architecture Designer',
  '- Managed NYC DOB permit submission workflows for commercial and residential projects across Manhattan and Brooklyn
- Developed AI-assisted prompt workflows to generate objection resolution responses, reducing back-and-forth cycles by 35%
- Produced full construction document sets in Revit and AutoCAD; coordinated with structural and MEP consultants
- Introduced the AI permit workflow to the studio; it was adopted across all active permit cases within 6 weeks',
  false,
  2024,
  2024,
  'New York, USA',
  '{"zh": {"role": "建筑设计师", "company": "Su Architect", "achievements": "- 管理曼哈顿和布鲁克林商业及住宅项目的纽约市DOB报建流程\n- 开发AI辅助提示词工作流，生成异议回复方案，往返沟通周期缩短35%\n- 使用Revit和AutoCAD完成完整施工图文件集，协调结构和MEP顾问\n- 将AI报建工作流推广至整个工作室，6周内被所有在审项目采用"}}'
),
(
  'Aikun (Shanghai) Architecture Design',
  'Architect',
  '- Led design development for commercial complex projects ranging 20,000–80,000 sqm across Shanghai and Jiangsu
- Integrated Midjourney and Stable Diffusion into the concept design phase, reducing concept iteration cycles from 2 weeks to 3 days
- Developed Rhino + Grasshopper parametric scripts for facade optimisation; published scripts on Food4Rhino with 2,400+ downloads
- Mentored 2 junior architects; coordinated deliverables across 5-person design teams',
  false,
  2020,
  2024,
  'Shanghai, China',
  '{"zh": {"role": "建筑师", "company": "爱坤（上海）建筑设计", "achievements": "- 主导上海及江苏2万至8万平方米商业综合体项目的设计开发\n- 将Midjourney和Stable Diffusion融入方案设计阶段，概念迭代周期从2周压缩至3天\n- 开发Rhino + Grasshopper参数化立面优化脚本，发布于Food4Rhino，下载量超2,400次\n- 指导2名初级建筑师，协调5人设计团队交付物"}}'
),
(
  'University of Edinburgh',
  'MSc Architecture & Urban Design',
  '- Graduated from QS World Top 50 programme with distinction in Urban Design thesis
- Research focused on data-driven urban analysis using GIS and computational methods
- Collaborated on international studio projects with peers from 15+ countries',
  true,
  2019,
  2020,
  'Edinburgh, UK',
  '{"zh": {"role": "建筑与城市设计 硕士", "company": "爱丁堡大学", "achievements": "- 毕业于QS全球前50项目，城市设计论文以优异成绩通过\n- 研究方向：基于GIS和计算方法的数据驱动城市分析\n- 与来自15个以上国家的同学合作完成国际工作坊项目"}}'
),
(
  'National Taiwan University of Science and Technology',
  'BSc Architecture (CS Minor)',
  '- GPA 4.0 in Computer Science minor; awarded scholarship three consecutive years
- Thesis on parametric structural optimisation using Grasshopper and Karamba3D
- Founded campus maker club; organised hardware workshops for 60+ students',
  true,
  2014,
  2019,
  'Taipei, Taiwan',
  '{"zh": {"role": "建筑学 学士（资讯工程辅修）", "company": "台湾科技大学", "achievements": "- 资讯工程辅修GPA 4.0，连续三年获得奖学金\n- 毕业设计：使用Grasshopper和Karamba3D进行参数化结构优化\n- 创立校园创客社团，为60余名学生组织硬件工作坊"}}'
);

-- ==================== PROJECTS ====================

INSERT INTO projects (title, category, description, long_description, logic_map, media_urls, impact_stats, tech_tags, is_featured, sort_order, translations) VALUES
(
  'BOK — AI Kitchen & Health System',
  'AI Agents',
  'A personal AI system that tracks nutrition, recipes, and health metrics — reducing daily health logging from 20 minutes to under 3 minutes using n8n pipelines and a PostgreSQL knowledge base.',
  '## Problem
Tracking nutrition, exercise, and health consistently is high-friction. Manual logging is abandoned within days.

## Solution
BOK is a modular AI system built on n8n that automates daily health data collection, recipe parsing, and weekly summaries.

## Architecture
- n8n orchestrates data flows between Telegram bot, PostgreSQL, and OpenAI
- Custom SQL schema stores recipes, ingredients, nutrition targets, and daily logs
- Weekly digest generated automatically and sent via Telegram
- Figma prototype used to design conversation UX before building

## Impact
Running continuously for 5 months with zero manual maintenance. Health logging reduced from 20 min/day to under 3 min.',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[Telegram Message] --> B[n8n Webhook Trigger]\n    B --> C{Intent Classification}\n    C -->|Log meal| D[Parse Food + Portion]\n    C -->|Log exercise| E[Record Activity]\n    C -->|Weekly review| F[Generate SQL Report]\n    D --> G[(PostgreSQL DB)]\n    E --> G\n    F --> G\n    G --> H[OpenAI Summary]\n    H --> I[Telegram Response]"}',
  ARRAY['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg'],
  '[{"label": "Daily Logging Time", "value": "< 3 min"}, {"label": "Months Running", "value": "5"}, {"label": "Manual Maintenance", "value": "0"}, {"label": "Data Points / Week", "value": "140+"}]',
  ARRAY['n8n', 'Python', 'PostgreSQL', 'OpenAI API', 'Telegram Bot', 'Figma'],
  true,
  1,
  '{"zh": {"title": "BOK — AI厨房与健康系统", "description": "一套个人AI健康系统，追踪营养、食谱和健康指标——通过n8n流程和PostgreSQL知识库，将每日健康记录时间从20分钟压缩至3分钟以内。", "long_description": "## 问题\n持续追踪营养、运动和健康数据摩擦力极高。手动记录通常几天后就被放弃。\n\n## 解决方案\nBOK是基于n8n构建的模块化AI系统，自动化完成每日健康数据收集、食谱解析和每周汇总。\n\n## 架构\n- n8n协调Telegram机器人、PostgreSQL和OpenAI之间的数据流\n- 自定义SQL模式存储食谱、食材、营养目标和每日记录\n- 每周摘要自动生成并通过Telegram发送\n- 使用Figma原型设计对话UX，再进行技术实现\n\n## 影响\n已连续稳定运行5个月，零人工维护。健康记录时间从每天20分钟缩短至3分钟以内。", "impact_stats": [{"label": "每日记录时间", "value": "< 3分钟"}, {"label": "持续运行月数", "value": "5"}, {"label": "人工维护", "value": "0"}, {"label": "每周数据点", "value": "140+"}]}}'
),
(
  'Market Intelligence Engine',
  'AI Agents',
  'An automated competitive research pipeline built at Yunie that scrapes Reddit, App Store reviews, and internal databases nightly, synthesising insights into a weekly product brief.',
  '## Problem
The product team spent 3–4 hours per week manually reading competitor reviews and Reddit threads. Insights were inconsistent and delayed.

## Solution
An n8n pipeline that runs nightly, collecting data from multiple sources and generating a structured weekly intelligence brief via GPT-4.

## Architecture
- Scheduled n8n flows scrape Reddit (PRAW API), App Store reviews, and internal NPS data
- Raw data normalised and stored in PostgreSQL
- GPT-4 prompt chain generates categorised insights: sentiment shifts, feature requests, competitor moves
- Output delivered as formatted Slack digest every Monday morning

## Impact
Reduced weekly research time from 3–4 hours to 20 minutes. Insight quality improved as coverage expanded to 5 sources.',
  '{"type": "flowchart", "definition": "flowchart LR\n    A[Scheduled Trigger] --> B[Reddit Scraper]\n    A --> C[App Store Scraper]\n    A --> D[Internal NPS DB]\n    B --> E[(PostgreSQL)]\n    C --> E\n    D --> E\n    E --> F[GPT-4 Analysis]\n    F --> G[Insight Categories]\n    G --> H[Slack Digest]"}',
  ARRAY['https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg'],
  '[{"label": "Weekly Research Time", "value": "−80%"}, {"label": "Data Sources", "value": "5"}, {"label": "Delivery", "value": "Every Mon"}, {"label": "Team Adoption", "value": "100%"}]',
  ARRAY['n8n', 'Python', 'PRAW API', 'PostgreSQL', 'GPT-4', 'Slack API'],
  false,
  2,
  '{"zh": {"title": "市场情报引擎", "description": "在与你科技构建的自动化竞品研究流程，每夜抓取Reddit、App Store评论和内部数据库，将洞察汇总为每周产品简报。", "long_description": "## 问题\n产品团队每周花费3–4小时手动阅读竞品评论和Reddit帖子。洞察不一致且滞后。\n\n## 解决方案\nn8n流程每夜运行，从多个来源收集数据，通过GPT-4生成结构化每周情报简报。\n\n## 架构\n- 定时n8n流程抓取Reddit（PRAW API）、App Store评论和内部NPS数据\n- 原始数据标准化后存入PostgreSQL\n- GPT-4提示链生成分类洞察：情绪变化、功能需求、竞品动态\n- 每周一早上以格式化Slack摘要输出\n\n## 影响\n每周研究时间从3–4小时缩短至20分钟。覆盖5个数据源后，洞察质量显著提升。", "impact_stats": [{"label": "每周研究时间", "value": "−80%"}, {"label": "数据来源", "value": "5"}, {"label": "交付频率", "value": "每周一"}, {"label": "团队采用率", "value": "100%"}]}}'
),
(
  'AI Permit Navigator',
  'AI Agents',
  'A prompt-engineered workflow at Su Architect that generates NYC DOB objection resolution responses, reducing permit back-and-forth cycles by 35% and adopted studio-wide within 6 weeks.',
  '## Problem
NYC DOB permit objections require highly specific, code-referenced responses. Junior architects spent 2–3 days per objection researching and drafting replies.

## Solution
A structured prompt workflow that takes objection text + project type + code reference and generates a compliant, cite-ready response draft in under 5 minutes.

## Process
- Objection text is categorised by type (zoning, construction, accessibility)
- Relevant NYC Building Code sections are retrieved from a reference index
- GPT-4 generates a structured response with code citations and recommended drawing revisions
- Output reviewed and submitted directly by architect of record

## Impact
35% reduction in permit cycle time. Adopted for all active cases within 6 weeks of introduction.',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[DOB Objection PDF] --> B[Extract Objection Text]\n    B --> C[Classify Objection Type]\n    C --> D[Retrieve Code Sections]\n    D --> E[GPT-4 Response Draft]\n    E --> F[Architect Review]\n    F --> G[DOB Submission]"}',
  ARRAY['https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg', 'https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg'],
  '[{"label": "Permit Cycle Time", "value": "−35%"}, {"label": "Draft Time / Objection", "value": "< 5 min"}, {"label": "Adoption", "value": "6 weeks"}, {"label": "Cases Handled", "value": "30+"}]',
  ARRAY['Prompt Engineering', 'GPT-4', 'Python', 'NYC DOB Code', 'Revit', 'PDF Parsing'],
  false,
  3,
  '{"zh": {"title": "AI报建导航系统", "description": "在Su Architect开发的提示词工程工作流，用于生成纽约市DOB异议回复方案，报建往返周期缩短35%，6周内被工作室全面采用。", "long_description": "## 问题\n纽约市DOB报建异议需要高度精准、引用法规的回复。初级建筑师每条异议需花费2–3天研究和起草回复。\n\n## 解决方案\n结构化提示词工作流，输入异议文本+项目类型+法规参考，5分钟内生成合规、可引用的回复草稿。\n\n## 流程\n- 异议文本按类型分类（分区、施工、无障碍）\n- 从参考索引中检索相关纽约市建筑法规条款\n- GPT-4生成包含法规引用和图纸修改建议的结构化回复\n- 注册建筑师审核后直接提交\n\n## 影响\n报建周期缩短35%。引入后6周内被所有在审案例采用。", "impact_stats": [{"label": "报建周期", "value": "−35%"}, {"label": "每条异议起草时间", "value": "< 5分钟"}, {"label": "推广周期", "value": "6周"}, {"label": "处理案例", "value": "30+"}]}}'
),
(
  'Generative Design Workflow',
  'Spatial Design',
  'An integrated Midjourney + Stable Diffusion + Rhino/Grasshopper pipeline at Aikun that compressed concept design iteration cycles from 2 weeks to 3 days for large-scale commercial projects.',
  '## Problem
Traditional concept design for large commercial complexes required weeks of hand sketching and manual 3D modelling before a design direction could be validated.

## Solution
A multi-stage generative pipeline that uses AI image generation for rapid visual exploration, then translates approved directions into parametric Grasshopper models.

## Workflow Stages
- Stage 1: Brief-to-prompt translation — project requirements converted to structured Midjourney prompts
- Stage 2: Visual exploration — 20–30 concept variations generated in 2–3 hours
- Stage 3: Parametric translation — selected concepts translated to Grasshopper definition for geometric exploration
- Stage 4: Facade optimisation — performance analysis (solar, wind) fed back into Grasshopper iterations

## Impact
Concept iteration cycle reduced from 2 weeks to 3 days. Client approval rates improved as visual output quality increased.',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[Project Brief] --> B[Prompt Engineering]\n    B --> C[Midjourney Exploration]\n    C --> D{Client Review}\n    D -->|Revise| B\n    D -->|Approve| E[SD Detailing]\n    E --> F[Rhino 3D Model]\n    F --> G[Grasshopper Parametric]\n    G --> H[Performance Analysis]\n    H --> I[Final Documentation]"}',
  ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg'],
  '[{"label": "Concept Cycle Time", "value": "−78%"}, {"label": "Concepts per Session", "value": "25+"}, {"label": "Script Downloads", "value": "2,400+"}, {"label": "Projects Applied", "value": "8"}]',
  ARRAY['Midjourney', 'Stable Diffusion', 'Rhino 3D', 'Grasshopper', 'Python', 'Karamba3D'],
  true,
  4,
  '{"zh": {"title": "生成式设计工作流", "description": "在爱坤建筑设计构建的Midjourney + Stable Diffusion + Rhino/Grasshopper集成流程，将大型商业项目概念设计迭代周期从2周压缩至3天。", "long_description": "## 问题\n大型商业综合体的传统概念设计需要数周手绘和手动3D建模，才能验证设计方向。\n\n## 解决方案\n多阶段生成式流程：先用AI图像生成快速视觉探索，再将认可的方向转化为参数化Grasshopper模型。\n\n## 工作流阶段\n- 第1阶段：简报转提示词——项目需求转化为结构化Midjourney提示词\n- 第2阶段：视觉探索——2–3小时内生成20–30个概念变体\n- 第3阶段：参数化转译——选定概念转化为Grasshopper定义进行几何探索\n- 第4阶段：立面优化——性能分析（日照、风环境）反馈至Grasshopper迭代\n\n## 影响\n概念迭代周期从2周缩短至3天。视觉输出质量提升，客户认可率显著改善。", "impact_stats": [{"label": "概念周期时间", "value": "−78%"}, {"label": "每次会议概念数", "value": "25+"}, {"label": "脚本下载量", "value": "2,400+"}, {"label": "应用项目数", "value": "8"}]}}'
),
(
  'ESP32 IoT Home Lab',
  'Hardware',
  'A personal hardware lab running ESP32 and Raspberry Pi 5 experiments — including a whole-home sensor network, smart switching, and MCP server architecture research for local AI tool integration.',
  '## Background
Hardware tinkering grounds abstract software knowledge. Understanding MCUs, GPIO, and local networking changes how I think about AI system boundaries and latency trade-offs.

## Experiments

### Sensor Network
- 6× ESP32 nodes measuring temperature, humidity, CO₂, and light across rooms
- MQTT broker on Raspberry Pi 5 aggregating data to InfluxDB
- Grafana dashboard for real-time monitoring and weekly trend analysis

### Smart Switching
- Custom ESP32 firmware for mains switching via relay modules
- Integration with Home Assistant for schedule-based and sensor-triggered automation
- Designed 3D-printed enclosures in Rhino for clean installation

### MCP Architecture Research
- Deployed Claude Desktop with local MCP servers on Raspberry Pi 5
- Researched tool-call patterns for local AI agent workflows
- Documented latency benchmarks for on-device vs cloud inference

## Takeaway
Physical computing fluency directly informs how I scope AI system requirements and hardware feasibility in product work.',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[ESP32 Sensor Nodes] -->|MQTT| B[Raspberry Pi 5 Broker]\n    B --> C[(InfluxDB)]\n    C --> D[Grafana Dashboard]\n    B --> E[Home Assistant]\n    E --> F[Smart Switches]\n    B --> G[MCP Server]\n    G --> H[Claude Desktop]"}',
  ARRAY['https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg', 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'],
  '[{"label": "Sensor Nodes", "value": "6×"}, {"label": "Uptime", "value": "99.2%"}, {"label": "Data Points / Day", "value": "8,640"}, {"label": "Power Draw", "value": "< 5W"}]',
  ARRAY['ESP32', 'Raspberry Pi 5', 'MQTT', 'Python', 'InfluxDB', 'Home Assistant', 'MCP', 'Rhino 3D'],
  false,
  5,
  '{"zh": {"title": "ESP32 物联网家庭实验室", "description": "个人硬件实验室，运行ESP32和树莓派5实验——包括全屋传感器网络、智能开关控制，以及面向本地AI工具集成的MCP服务器架构研究。", "long_description": "## 背景\n硬件实践使抽象的软件知识落地。理解MCU、GPIO和本地网络，改变了我对AI系统边界和延迟权衡的思考方式。\n\n## 实验项目\n\n### 传感器网络\n- 6个ESP32节点，监测各房间温度、湿度、CO₂和光照\n- 树莓派5上部署MQTT代理，将数据汇聚至InfluxDB\n- Grafana仪表盘实现实时监控和每周趋势分析\n\n### 智能开关控制\n- 基于继电器模块的自定义ESP32固件，控制市电开关\n- 接入Home Assistant，实现基于计划和传感器触发的自动化\n- 在Rhino中设计3D打印外壳，实现整洁安装\n\n### MCP架构研究\n- 在树莓派5上部署Claude Desktop和本地MCP服务器\n- 研究本地AI智能体工作流的工具调用模式\n- 记录设备端推理与云端推理的延迟基准测试\n\n## 收获\n物理计算能力直接影响我在产品工作中如何界定AI系统需求和硬件可行性。", "impact_stats": [{"label": "传感器节点", "value": "6个"}, {"label": "运行稳定性", "value": "99.2%"}, {"label": "每日数据点", "value": "8,640"}, {"label": "功耗", "value": "< 5W"}]}}'
);

-- ==================== SKILLS ====================

INSERT INTO skills (name, level, category, icon_slug, translations) VALUES
-- BUILD
('Python', 4, 'Build', 'python', '{"zh": {"name": "Python"}}'),
('SQL / PostgreSQL', 4, 'Build', 'database', '{"zh": {"name": "SQL / PostgreSQL"}}'),
('n8n Automation', 5, 'Build', 'zap', '{"zh": {"name": "n8n自动化"}}'),
('Figma', 4, 'Build', 'figma', '{"zh": {"name": "Figma"}}'),
('Rhino + Grasshopper', 5, 'Build', 'box', '{"zh": {"name": "Rhino + Grasshopper"}}'),
('Revit / BIM', 4, 'Build', 'layers', '{"zh": {"name": "Revit / BIM"}}'),
-- THINK
('Product Strategy', 5, 'Think', 'target', '{"zh": {"name": "产品策略"}}'),
('PRD Writing', 4, 'Think', 'file-text', '{"zh": {"name": "PRD撰写"}}'),
('Prompt Engineering', 5, 'Think', 'terminal', '{"zh": {"name": "提示词工程"}}'),
('User Research', 4, 'Think', 'users', '{"zh": {"name": "用户研究"}}'),
('Computational Design', 4, 'Think', 'cpu', '{"zh": {"name": "计算设计"}}'),
-- CONNECT
('Stakeholder Management', 4, 'Connect', 'briefcase', '{"zh": {"name": "利益相关方管理"}}'),
('Technical Documentation', 4, 'Connect', 'book-open', '{"zh": {"name": "技术文档"}}'),
('Bilingual EN / ZH', 5, 'Connect', 'globe', '{"zh": {"name": "中英双语"}}');
