import type { GraphNodeGroup } from '../../lib/types';

export const GROUP_COLORS: Record<GraphNodeGroup, { fill: string; stroke: string; text: string }> = {
  core:       { fill: '#FF6B35', stroke: '#FF6B35', text: '#1A1A1A' },
  skill_arch: { fill: '#00D4AA', stroke: '#00D4AA', text: '#1A1A1A' },
  skill_ai:   { fill: '#FFD60A', stroke: '#FFD60A', text: '#1A1A1A' },
  skill_hard: { fill: '#4FC3F7', stroke: '#4FC3F7', text: '#1A1A1A' },
  skill_pm:   { fill: '#CE93D8', stroke: '#CE93D8', text: '#1A1A1A' },
  project:    { fill: '#F5F0E8', stroke: '#F5F0E8', text: '#1A1A1A' },
};

export const GROUP_LABELS: Record<GraphNodeGroup, { en: string; zh: string }> = {
  core:       { en: 'Core Mindset', zh: '核心思维' },
  skill_arch: { en: 'Architecture', zh: '建筑设计' },
  skill_ai:   { en: 'AI & Automation', zh: 'AI与自动化' },
  skill_hard: { en: 'Hardware', zh: '硬件' },
  skill_pm:   { en: 'Product', zh: '产品设计' },
  project:    { en: 'Projects', zh: '项目成果' },
};

export const NODE_RADIUS: Record<number, number> = {
  1: 28,
  2: 22,
  3: 18,
  4: 24,
};

export const LINK_COLOR: Record<string, string> = {
  dependency: 'rgba(245,240,232,0.25)',
  usage:      'rgba(255,107,53,0.5)',
  applies:    'rgba(0,212,170,0.4)',
};
