import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Bot, Landmark, MapPin, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { parseAchievements } from '../lib/textUtils';
import type { Experience } from '../lib/types';

interface TimelineNodeProps {
  exp: Experience;
  index: number;
  isPivot?: boolean;
}

const CATEGORY_CONFIG = {
  AI_Tech: {
    color: '#00D4AA',
    bg: '#00D4AA',
    darkBg: '#1A1A1A',
    Icon: Bot,
    trackLabel: 'SYSTEM LOGIC',
  },
  Architecture: {
    color: '#FF6B35',
    bg: '#FF6B35',
    darkBg: '#1A1A1A',
    Icon: Landmark,
    trackLabel: 'SPATIAL LOGIC',
  },
  Education: {
    color: '#FFD60A',
    bg: '#FFD60A',
    darkBg: '#1A1A1A',
    Icon: GraduationCap,
    trackLabel: 'FOUNDATION',
  },
};

export default function TimelineNode({ exp, index, isPivot = false }: TimelineNodeProps) {
  const { t, locale } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const role = (locale === 'zh' && exp.translations?.zh?.role) || exp.role;
  const company = (locale === 'zh' && exp.translations?.zh?.company) || exp.company;
  const achievements = (locale === 'zh' && exp.translations?.zh?.achievements) || exp.achievements;

  const cfg = CATEGORY_CONFIG[exp.category] ?? CATEGORY_CONFIG.AI_Tech;
  const { Icon } = cfg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="relative"
    >
      {isPivot && (
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00D4AA] to-transparent" />
          <div className="flex items-center gap-2 px-3 py-1 border-2 border-[#00D4AA] bg-[#00D4AA]/10">
            <Zap size={11} strokeWidth={2.5} className="text-[#00D4AA]" />
            <span className="font-mono text-[10px] font-black tracking-widest text-[#00D4AA]">
              {t('experience.pivotLabel')}
            </span>
            <Zap size={11} strokeWidth={2.5} className="text-[#00D4AA]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#00D4AA] via-transparent to-transparent" />
        </div>
      )}

      <div
        className={`border-2 border-[#1A1A1A] bg-[#F5F0E8] transition-all duration-200 cursor-pointer ${
          expanded
            ? 'shadow-none translate-x-1 translate-y-1'
            : 'shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1'
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        <div
          className="px-5 py-4 flex flex-wrap items-start justify-between gap-3"
          style={{ backgroundColor: cfg.bg }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 border-2 border-[#1A1A1A] flex items-center justify-center bg-[#1A1A1A] flex-shrink-0 mt-0.5">
              {exp.is_milestone ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon size={14} strokeWidth={2.5} className="text-[#FFD60A]" />
                </motion.div>
              ) : (
                <Icon size={14} strokeWidth={2.5} className="text-[#F5F0E8]" />
              )}
            </div>
            <div>
              <div className="font-mono font-black text-base text-[#1A1A1A] leading-snug">{role}</div>
              <div className="font-mono text-xs text-[#1A1A1A]/70 mt-0.5">{company}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-2">
              {exp.is_milestone && (
                <span className="px-1.5 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] font-mono text-[8px] font-black tracking-widest text-[#FFD60A]">
                  {t('experience.milestoneTag')}
                </span>
              )}
              <span className="font-mono text-xs font-bold text-[#1A1A1A]/80">
                {exp.year_start} – {exp.year_end ?? t('experience.present')}
              </span>
            </div>
            {exp.location && (
              <div className="flex items-center gap-1 font-mono text-[10px] text-[#1A1A1A]/60">
                <MapPin size={9} strokeWidth={2} />
                {exp.location}
              </div>
            )}
            <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#1A1A1A]/50 tracking-wider">
              {cfg.trackLabel}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t-2 border-[#1A1A1A] flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {parseAchievements(achievements).slice(0, 1).map((text, i) => (
              <p key={i} className="font-sans text-xs text-[#1A1A1A]/60 leading-relaxed line-clamp-1">
                → {text}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-3 flex-shrink-0 font-mono text-[10px] text-[#1A1A1A]/50">
            {expanded ? (
              <><ChevronUp size={12} strokeWidth={2.5} />{t('experience.collapseDetails')}</>
            ) : (
              <><ChevronDown size={12} strokeWidth={2.5} />{t('experience.expandDetails')}</>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-2 border-t-0 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-4 space-y-2">
              {parseAchievements(achievements).map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: cfg.color }}>→</span>
                  <p className="font-sans text-sm text-[#F5F0E8]/80 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
