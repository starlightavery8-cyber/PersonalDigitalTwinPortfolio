import type { GraphNodeGroup } from '../../lib/types';
import { GROUP_COLORS, GROUP_LABELS } from './graphConfig';

interface Props {
  activeGroup: GraphNodeGroup | null;
  onGroupClick: (group: GraphNodeGroup | null) => void;
  locale: string;
}

const GROUPS: GraphNodeGroup[] = ['core', 'skill_arch', 'skill_ai', 'skill_hard', 'skill_pm', 'project'];

export default function GraphLegend({ activeGroup, onGroupClick, locale }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onGroupClick(null)}
        className={`flex items-center gap-2 px-3 py-1.5 border-2 font-mono text-xs font-bold transition-all duration-150 ${
          activeGroup === null
            ? 'bg-[#F5F0E8] border-[#F5F0E8] text-[#1A1A1A]'
            : 'bg-transparent border-[#F5F0E8]/30 text-[#F5F0E8]/60 hover:border-[#F5F0E8]/60'
        }`}
      >
        {locale === 'zh' ? '全部' : 'All'}
      </button>
      {GROUPS.map((group) => {
        const colors = GROUP_COLORS[group];
        const label = GROUP_LABELS[group][locale === 'zh' ? 'zh' : 'en'];
        const isActive = activeGroup === group;
        return (
          <button
            key={group}
            onClick={() => onGroupClick(isActive ? null : group)}
            className={`flex items-center gap-2 px-3 py-1.5 border-2 font-mono text-xs font-bold transition-all duration-150 ${
              isActive
                ? 'shadow-[3px_3px_0px_rgba(245,240,232,0.2)]'
                : 'bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]/60 hover:border-[#F5F0E8]/40 hover:text-[#F5F0E8]'
            }`}
            style={isActive ? { backgroundColor: colors.fill, borderColor: colors.fill, color: colors.text } : {}}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.fill }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
