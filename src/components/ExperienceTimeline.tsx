import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bot, Landmark, GraduationCap, Grid3x3 } from 'lucide-react';
import { useExperience } from '../hooks/useExperience';
import { useTranslation } from '../hooks/useTranslation';
import SectionHeader from './SectionHeader';
import TracingBeam from './TracingBeam';
import TimelineNode from './TimelineNode';
import type { Experience } from '../lib/types';

type Filter = 'All' | 'AI_Tech' | 'Architecture' | 'Education';

const FILTERS: { key: Filter; labelKey: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { key: 'All', labelKey: 'experience.filterAll', Icon: Grid3x3 },
  { key: 'AI_Tech', labelKey: 'experience.filterAI', Icon: Bot },
  { key: 'Architecture', labelKey: 'experience.filterArch', Icon: Landmark },
  { key: 'Education', labelKey: 'experience.filterEdu', Icon: GraduationCap },
];

const FILTER_COLORS: Record<Filter, string> = {
  All: '#F5F0E8',
  AI_Tech: '#00D4AA',
  Architecture: '#FF6B35',
  Education: '#FFD60A',
};

export default function ExperienceTimeline() {
  const { experience, loading } = useExperience();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filtered = useMemo<Experience[]>(() => {
    if (activeFilter === 'All') return experience;
    return experience.filter((e) => e.category === activeFilter);
  }, [experience, activeFilter]);

  const pivotId = useMemo(
    () => experience.find((e) => e.is_milestone && e.category === 'Education')?.id,
    [experience]
  );

  return (
    <section id="experience" className="bg-[#1A1A1A] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge={t('experience.sectionBadge')}
          title={t('experience.sectionTitle')}
          dark
        />

        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ key, labelKey, Icon }) => {
              const active = activeFilter === key;
              const color = FILTER_COLORS[key];
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 border-2 font-mono text-xs font-bold tracking-wider transition-all duration-150 ${
                    active
                      ? 'translate-x-0.5 translate-y-0.5'
                      : 'hover:translate-x-0.5 hover:translate-y-0.5'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                          color: '#1A1A1A',
                          boxShadow: 'none',
                        }
                      : {
                          backgroundColor: 'transparent',
                          borderColor: color,
                          color: color,
                          boxShadow: `3px 3px 0px ${color}40`,
                        }
                  }
                >
                  <Icon size={12} strokeWidth={2.5} />
                  {t(labelKey)}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-[#00D4AA]" style={{ backgroundColor: '#00D4AA30' }} />
              <span className="font-mono text-[10px] text-[#00D4AA]/70 tracking-wider">{t('experience.trackSystem')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-[#FF6B35]" style={{ backgroundColor: '#FF6B3530' }} />
              <span className="font-mono text-[10px] text-[#FF6B35]/70 tracking-wider">{t('experience.trackSpatial')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-[#FFD60A]" style={{ backgroundColor: '#FFD60A30' }} />
              <span className="font-mono text-[10px] text-[#FFD60A]/70 tracking-wider">EDUCATION</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={32} className="text-[#FF6B35] animate-spin" strokeWidth={2} />
          </div>
        ) : (
          <TracingBeam>
            <div className="space-y-5">
              {filtered.map((exp, index) => (
                <TimelineNode
                  key={exp.id}
                  exp={exp}
                  index={index}
                  isPivot={activeFilter === 'All' && exp.id === pivotId}
                />
              ))}
            </div>
          </TracingBeam>
        )}
      </div>
    </section>
  );
}
