import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';
import { useSkills } from '../hooks/useSkills';
import { useTranslation } from '../hooks/useTranslation';
import type { Skill } from '../lib/types';
import SectionHeader from './SectionHeader';

const categoryAccent: Record<string, { accent: string; bg: string }> = {
  Build: { accent: '#FF6B35', bg: '#FF6B35' },
  Think: { accent: '#00D4AA', bg: '#00D4AA' },
  Connect: { accent: '#FFD60A', bg: '#FFD60A' },
};

function SkillBar({ skill, locale }: { skill: Skill; locale: string }) {
  const meta = categoryAccent[skill.category];
  const name = (locale === 'zh' && skill.translations?.zh?.name) || skill.name;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs font-bold text-[#F5F0E8]">{name}</span>
          <span className="font-mono text-xs text-[#F5F0E8]/40">{skill.level}/5</span>
        </div>
        <div className="h-2 bg-[#F5F0E8]/10 border border-[#F5F0E8]/20 overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: meta?.accent ?? '#FF6B35' }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(skill.level / 5) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { skills, loading } = useSkills();
  const { t, locale } = useTranslation();

  const categoryLabels: Record<string, string> = {
    Build: t('skills.build'),
    Think: t('skills.think'),
    Connect: t('skills.connect'),
  };

  const grouped = {
    Build: skills.filter((s) => s.category === 'Build'),
    Think: skills.filter((s) => s.category === 'Think'),
    Connect: skills.filter((s) => s.category === 'Connect'),
  };

  return (
    <section id="stack" className="bg-[#1A1A1A] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge={t('skills.sectionBadge')} title={t('skills.sectionTitle')} dark />

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={32} className="text-[#FF6B35] animate-spin" strokeWidth={2} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {(Object.entries(grouped) as [keyof typeof grouped, Skill[]][]).map(([cat, catSkills]) => {
              const meta = categoryAccent[cat];
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="border-2 border-[#F5F0E8]/20 hover:border-[#F5F0E8]/40 transition-colors"
                >
                  <div
                    className="px-5 py-3 border-b-2 border-[#1A1A1A] font-mono font-black text-[#1A1A1A]"
                    style={{ backgroundColor: meta.bg }}
                  >
                    {categoryLabels[cat]}
                  </div>
                  <div className="p-5 space-y-4">
                    {catSkills.map((skill) => (
                      <SkillBar key={skill.id} skill={skill} locale={locale} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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
