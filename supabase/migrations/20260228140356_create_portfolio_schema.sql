/*
  # Portfolio Schema - Avery Digital Twin

  ## Overview
  Creates the full database schema for the personal portfolio site.
  All public data is readable by anonymous users; writes require authentication.

  ## Tables

  ### projects
  - id: primary key
  - title: project name
  - category: one of 'AI Agents' | 'Hardware' | 'Spatial Design'
  - description: short summary text
  - long_description: detailed markdown content
  - logic_map: JSON object for Mermaid diagram definition
  - media_urls: array of image URLs
  - impact_stats: JSON array of { label, value } metric cards
  - tech_tags: array of technology names
  - is_featured: boolean flag for hero spotlight
  - sort_order: integer for manual ordering

  ### experience
  - id: primary key
  - company: org/institution name
  - role: job title
  - achievements: markdown text of accomplishments
  - is_academic: bool distinguishing work vs education
  - year_start / year_end: timeline range
  - location: city/remote

  ### skills
  - id: primary key
  - name: skill label
  - level: 1-5 proficiency
  - category: 'Build' | 'Think' | 'Connect'
  - icon_slug: lucide icon name or tech slug

  ### contacts
  - id: primary key
  - name / email / message: form fields
  - created_at: timestamp

  ## Security
  - RLS enabled on all tables
  - anon role: SELECT on projects, experience, skills; INSERT on contacts
  - authenticated role: full access on projects, experience, skills
*/

-- =====================
-- PROJECTS
-- =====================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('AI Agents', 'Hardware', 'Spatial Design')),
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  logic_map jsonb DEFAULT NULL,
  media_urls text[] DEFAULT ARRAY[]::text[],
  impact_stats jsonb DEFAULT '[]'::jsonb,
  tech_tags text[] DEFAULT ARRAY[]::text[],
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- =====================
-- EXPERIENCE
-- =====================
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  achievements text NOT NULL DEFAULT '',
  is_academic boolean DEFAULT false,
  year_start integer NOT NULL,
  year_end integer DEFAULT NULL,
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experience"
  ON experience FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read experience"
  ON experience FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experience"
  ON experience FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update experience"
  ON experience FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete experience"
  ON experience FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- =====================
-- SKILLS
-- =====================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 3 CHECK (level BETWEEN 1 AND 5),
  category text NOT NULL CHECK (category IN ('Build', 'Think', 'Connect')),
  icon_slug text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- =====================
-- CONTACTS
-- =====================
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- =====================
-- SEED DATA
-- =====================

INSERT INTO projects (title, category, description, long_description, logic_map, media_urls, impact_stats, tech_tags, is_featured, sort_order) VALUES
(
  'Autonomous Research Agent Network',
  'AI Agents',
  'Multi-agent system that orchestrates GPT-4 and Claude instances to perform deep research tasks, synthesize findings, and produce structured reports with zero human intervention.',
  '## The Challenge\n\nEnterprise research teams spend 70% of analyst time on rote information gathering rather than strategic synthesis. The bottleneck is not intelligence—it is bandwidth.\n\n## The Solution\n\nA hierarchical agent network with a Supervisor agent delegating to specialized sub-agents (Search, Synthesize, Validate, Format). Each agent communicates via a shared message bus backed by Supabase Realtime.\n\n## Key Architecture Decisions\n\n- **n8n** as the orchestration backbone for visual workflow editing\n- **Supabase** as the persistent memory store between agent runs\n- **Vercel Edge Functions** for low-latency agent dispatch',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[User Query] --> B[Supervisor Agent]\n    B --> C[Search Agent]\n    B --> D[Validation Agent]\n    C --> E[Web Scraper]\n    C --> F[Academic DB]\n    E --> G[Raw Data Pool]\n    F --> G\n    G --> D\n    D --> H{Quality Gate}\n    H -->|Pass| I[Synthesis Agent]\n    H -->|Fail| C\n    I --> J[Format Agent]\n    J --> K[Structured Report]"}',
  ARRAY['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg'],
  '[{"label": "Research time reduced", "value": "68%"}, {"label": "Reports generated", "value": "2,400+"}, {"label": "Accuracy vs manual", "value": "94%"}, {"label": "Cost per report", "value": "$0.12"}]',
  ARRAY['n8n', 'OpenAI', 'Supabase', 'TypeScript', 'Vercel', 'Python'],
  true,
  1
),
(
  'Cyberdeck Mark II',
  'Hardware',
  'Custom portable computing platform built on Raspberry Pi 5, featuring a mechanical keyboard, e-ink secondary display, and a bespoke aluminium CNC-milled enclosure. The ultimate field-deployable hacking terminal.',
  '## Origin\n\nAfter years of carrying a fragile laptop to fieldwork sites, the need for a rugged, modular, and aesthetically purposeful portable computing platform became non-negotiable.\n\n## Design Process\n\nStarted with parametric modeling in **Rhino + Grasshopper** to iterate the enclosure geometry. Generated 14 physical prototypes via FDM printing before committing to CNC-milled 6061 aluminium. PCB design in KiCad.\n\n## Technical Specs\n\n- Raspberry Pi 5 (8GB), NVMe SSD via PCIe\n- 7.9" IPS primary display (1024×768)\n- 3.7" E-ink secondary display for status/notifications\n- Custom 60% mechanical keyboard (Gateron Yellows)\n- 10,000mAh Li-Po battery pack (8h runtime)',
  NULL,
  ARRAY['https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg', 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg'],
  '[{"label": "Prototype iterations", "value": "14"}, {"label": "Battery life", "value": "8hrs"}, {"label": "Weight", "value": "1.2kg"}, {"label": "Build cost", "value": "$420"}]',
  ARRAY['Rhino', 'Grasshopper', 'KiCad', 'Raspberry Pi', 'FreeCAD', 'CNC'],
  true,
  2
),
(
  'Parametric Community Space',
  'Spatial Design',
  'Adaptive community hub in Shenzhen utilising rule-based computational design. The facade adapts its perforations dynamically based on sun angle data and occupancy sensors, controlling light and thermal gain.',
  '## Brief\n\nDesign a community centre for 300 daily visitors in a high-density urban context that minimises energy consumption while maintaining strong connection to the street.\n\n## Computational Approach\n\nUsed Grasshopper with the Ladybug Tools plugin to run sun path analysis across 8,760 hours of climate data. The output directly parameterised the 2,400 individual facade panels, each with a unique perforation ratio.\n\n## Outcome\n\nConstruction documents prepared in Archicad. Physical 1:100 model fabricated via laser cutting from the Rhino file.',
  '{"type": "flowchart", "definition": "flowchart LR\n    A[Climate Data\nEPW File] --> B[Ladybug Analysis]\n    B --> C[Solar Radiation Map]\n    C --> D[Grasshopper Script]\n    E[Occupancy Sensors] --> D\n    D --> F[Panel Perforation %]\n    F --> G[Facade Geometry]\n    G --> H[BIM Model\nArchicad]\n    H --> I[Construction Docs]"}',
  ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg'],
  '[{"label": "Energy savings vs baseline", "value": "41%"}, {"label": "Facade panels", "value": "2,400"}, {"label": "Analysis hours", "value": "8,760"}, {"label": "Build area", "value": "1,800m²"}]',
  ARRAY['Rhino', 'Grasshopper', 'Archicad', 'Ladybug', 'Python', 'Revit'],
  false,
  3
),
(
  'GTD Automation Pipeline',
  'AI Agents',
  'n8n workflow that ingests emails, Slack messages, and calendar invites, classifies them using a fine-tuned classifier, and routes tasks into the correct PARA buckets in Notion—fully hands-free.',
  '## The Friction\n\nGTD breaks down when capture is manual. Spending 20 minutes each morning triaging inboxes destroys deep work blocks.\n\n## The System\n\nAn n8n workflow polls Gmail, Slack, and Google Calendar every 15 minutes. Each item is passed to a fine-tuned text classifier (OpenAI fine-tune on 6 months of personal task history) that assigns a PARA category and energy level tag. Items are written to Notion via API.\n\n## Impact\n\nMorning triage eliminated entirely. All actionable items are pre-sorted and prioritised before the first coffee.',
  '{"type": "flowchart", "definition": "flowchart TD\n    A[Gmail] --> D[n8n Poller]\n    B[Slack] --> D\n    C[Calendar] --> D\n    D --> E[Text Classifier\nFine-tuned GPT]\n    E --> F{PARA Category}\n    F -->|Project| G[Notion Projects DB]\n    F -->|Area| H[Notion Areas DB]\n    F -->|Resource| I[Notion Resources]\n    F -->|Archive| J[Auto-Archive]"}',
  ARRAY['https://images.pexels.com/photos/6804604/pexels-photo-6804604.jpeg'],
  '[{"label": "Daily triage time saved", "value": "25min"}, {"label": "Classification accuracy", "value": "91%"}, {"label": "Items processed/month", "value": "3,200"}, {"label": "Manual interventions", "value": "< 5%"}]',
  ARRAY['n8n', 'OpenAI', 'Notion API', 'Python', 'Gmail API', 'Slack API'],
  false,
  4
);

INSERT INTO experience (company, role, achievements, is_academic, year_start, year_end, location) VALUES
(
  'Frontier Systems Lab',
  'Lead Product Engineer',
  '- Architected and shipped 3 AI agent products now used by 40+ enterprise clients\n- Reduced CI/CD pipeline duration by 62% via parallel test execution strategy\n- Led a cross-functional team of 8 across engineering, design, and data science\n- Introduced the PARA methodology org-wide, improving sprint velocity by 28%',
  false,
  2023,
  NULL,
  'Shenzhen / Remote'
),
(
  'Tangram Design Studio',
  'Computational Design Architect',
  '- Developed parametric facade systems for 4 commercial projects totalling 12,000m²\n- Built a Grasshopper-to-BIM automation pipeline that cut documentation time by 45%\n- Prototyped and fabricated 1:50 physical models using in-house CNC and laser cutters\n- Won the 2022 Asia Pacific Facade Innovation Award for the Luohu Community Hub',
  false,
  2020,
  2023,
  'Shenzhen, China'
),
(
  'Independent',
  'Hardware & AI Researcher',
  '- Designed and built Cyberdeck Mark I and II — custom portable computers with bespoke aluminium enclosures\n- Published 3 open-source Grasshopper scripts downloaded 2,400+ times on Food4Rhino\n- Maintained a technical blog averaging 8,000 monthly readers on topics of AI tooling and maker hardware',
  false,
  2018,
  2020,
  'Remote'
),
(
  'The University of Hong Kong',
  'MArch Architecture (Computational Design)',
  '- Graduated with Distinction — Dean''s List 2018\n- Thesis: "Adaptive Skins: Machine Learning for Climate-Responsive Facade Optimisation"\n- Teaching Assistant for Digital Fabrication Studio (2017–2018)\n- Recipient of the HKU Innovation Scholarship',
  true,
  2016,
  2018,
  'Hong Kong'
),
(
  'Tongji University',
  'BEng Architecture',
  '- First Class Honours\n- Exchange semester at TU Delft (Structural Design track)\n- Co-founded the university''s first computational design club (80+ members)',
  true,
  2011,
  2016,
  'Shanghai, China'
);

INSERT INTO skills (name, level, category, icon_slug) VALUES
-- Build
('TypeScript', 5, 'Build', 'code'),
('React', 5, 'Build', 'layout'),
('Python', 4, 'Build', 'terminal'),
('n8n / Workflow Automation', 5, 'Build', 'git-branch'),
('Supabase / PostgreSQL', 4, 'Build', 'database'),
('Rhino + Grasshopper', 5, 'Build', 'box'),
('KiCad / PCB Design', 3, 'Build', 'cpu'),
('Docker / DevOps', 3, 'Build', 'server'),
-- Think
('Systems Architecture', 5, 'Think', 'network'),
('GTD / PARA Methodology', 5, 'Think', 'layers'),
('LLM Prompt Engineering', 5, 'Think', 'brain'),
('Computational Design', 4, 'Think', 'grid'),
('Product Strategy', 4, 'Think', 'target'),
('Data Analysis', 4, 'Think', 'bar-chart'),
-- Connect
('Technical Writing', 4, 'Connect', 'pen-tool'),
('Cross-functional Leadership', 4, 'Connect', 'users'),
('Client Presentations', 4, 'Connect', 'presentation'),
('Open Source Community', 3, 'Connect', 'globe');
