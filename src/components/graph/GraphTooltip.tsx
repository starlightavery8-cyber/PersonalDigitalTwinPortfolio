import type { GraphNode } from '../../lib/types';
import { GROUP_COLORS, GROUP_LABELS } from './graphConfig';

interface Props {
  node: GraphNode | null;
  x: number;
  y: number;
  locale: string;
}

export default function GraphTooltip({ node, x, y, locale }: Props) {
  if (!node) return null;

  const colors = GROUP_COLORS[node.group];
  const groupLabel = GROUP_LABELS[node.group][locale === 'zh' ? 'zh' : 'en'];
  const label = locale === 'zh' ? node.labelZh : node.label;
  const desc = locale === 'zh' ? node.descriptionZh : node.description;

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 16, top: y - 8 }}
    >
      <div className="border-2 border-[#F5F0E8]/30 bg-[#1A1A1A] p-3 max-w-[220px] shadow-[4px_4px_0px_rgba(245,240,232,0.1)]">
        <div
          className="font-mono text-[10px] font-bold mb-1 px-1.5 py-0.5 inline-block"
          style={{ backgroundColor: colors.fill, color: colors.text }}
        >
          {groupLabel}
        </div>
        <div className="font-mono text-sm font-bold text-[#F5F0E8] mt-1 leading-tight">
          {label}
        </div>
        {desc && (
          <div className="font-mono text-[11px] text-[#F5F0E8]/60 mt-1.5 leading-relaxed">
            {desc}
          </div>
        )}
      </div>
    </div>
  );
}
