import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { graphData } from '../../data/graphData';
import type { GraphNode, GraphNodeGroup } from '../../lib/types';
import { useTranslation } from '../../hooks/useTranslation';
import SectionHeader from '../SectionHeader';
import ForceGraph from './ForceGraph';
import GraphLegend from './GraphLegend';
import GraphTooltip from './GraphTooltip';

export default function SkillGraphSection() {
  const { t, locale } = useTranslation();
  const [activeGroup, setActiveGroup] = useState<GraphNodeGroup | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{ node: GraphNode | null; x: number; y: number }>({
    node: null,
    x: 0,
    y: 0,
  });
  const [graphKey, setGraphKey] = useState(0);

  const handleNodeHover = useCallback((node: GraphNode | null, x: number, y: number) => {
    setTooltip({ node, x, y });
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleReset = () => {
    setActiveGroup(null);
    setSelectedNode(null);
    setGraphKey((k) => k + 1);
  };

  const nodeCount = graphData.nodes.length;
  const linkCount = graphData.links.length;

  return (
    <section id="stack" className="bg-[#1A1A1A] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={t('skills.sectionBadge')}
          title={t('skills.sectionTitle')}
          dark
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-2 border-[#F5F0E8]/20 mb-6"
        >
          <div className="px-5 py-3 border-b border-[#F5F0E8]/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-[#FF6B35]">
                {t('skills.graphLabel')}
              </span>
              <div className="flex items-center gap-3 font-mono text-xs text-[#F5F0E8]/40">
                <span>{nodeCount} {locale === 'zh' ? '节点' : 'nodes'}</span>
                <span>·</span>
                <span>{linkCount} {locale === 'zh' ? '连线' : 'links'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedNode && (
                <div className="font-mono text-xs text-[#FF6B35] border border-[#FF6B35]/40 px-2 py-1">
                  {locale === 'zh' ? selectedNode.labelZh : selectedNode.label}
                </div>
              )}
              <button
                onClick={handleReset}
                className="p-1.5 border border-[#F5F0E8]/20 text-[#F5F0E8]/50 hover:text-[#F5F0E8] hover:border-[#F5F0E8]/50 transition-colors"
                title={locale === 'zh' ? '重置视图' : 'Reset view'}
              >
                <RotateCcw size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-5 py-3 border-b border-[#F5F0E8]/10">
            <GraphLegend
              activeGroup={activeGroup}
              onGroupClick={setActiveGroup}
              locale={locale}
            />
          </div>

          <div className="relative" style={{ height: '520px' }}>
            <ForceGraph
              key={graphKey}
              data={graphData}
              activeGroup={activeGroup}
              selectedNode={selectedNode}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              locale={locale}
            />
            <GraphTooltip
              node={tooltip.node}
              x={tooltip.x}
              y={tooltip.y}
              locale={locale}
            />
            <div className="absolute bottom-4 left-5 font-mono text-[10px] text-[#F5F0E8]/25 select-none">
              {locale === 'zh'
                ? '拖拽节点 · 滚轮缩放 · 点击高亮路径'
                : 'Drag nodes · Scroll to zoom · Click to highlight path'}
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#F5F0E8]/10 flex flex-wrap gap-4 font-mono text-xs text-[#F5F0E8]/40">
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-[#F5F0E8]/25 inline-block" />
              {locale === 'zh' ? '依赖关系' : 'Dependency'}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-px inline-block"
                style={{ background: 'rgba(255,107,53,0.7)', height: '2px' }}
              />
              {locale === 'zh' ? '项目应用' : 'Usage'}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 inline-block"
                style={{
                  borderTop: '1px dashed rgba(0,212,170,0.6)',
                  height: '1px',
                  display: 'inline-block',
                }}
              />
              {locale === 'zh' ? '技能迁移' : 'Applies'}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-2 border-[#F5F0E8]/20 p-6"
        >
          <div className="font-mono text-xs font-bold text-[#FF6B35] mb-1">{t('skills.commitHistory')}</div>
          <div className="font-mono font-black text-xl text-[#F5F0E8] mb-6">{t('skills.githubActivity')}</div>
          <div className="overflow-x-auto">
            <GitHubCalendar
              username="avery-wong"
              colorScheme="dark"
              theme={{
                dark: ['#1A1A1A', '#FF6B35', '#FF8552', '#FFA07A', '#FFD60A'],
              }}
              labels={{
                totalCount: t('skills.githubContributions'),
              }}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
            />
          </div>
          <div className="mt-4 font-mono text-xs text-[#F5F0E8]/40">
            {t('skills.githubNote')}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
