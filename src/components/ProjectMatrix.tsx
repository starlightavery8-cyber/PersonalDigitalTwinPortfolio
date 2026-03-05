import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, Building2, Loader2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useTranslation } from '../hooks/useTranslation';
import type { Project } from '../lib/types';
import ProjectCard from './ProjectCard';
import SectionHeader from './SectionHeader';

type Filter = 'All' | 'AI Agents' | 'Hardware' | 'Spatial Design';

interface Props {
  onSelectProject: (project: Project) => void;
}

export default function ProjectMatrix({ onSelectProject }: Props) {
  const { projects, loading } = useProjects();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filters: { value: Filter; label: string; icon?: React.ElementType }[] = [
    { value: 'All', label: t('projects.filterAll') },
    { value: 'AI Agents', label: t('projects.filterAI'), icon: Bot },
    { value: 'Hardware', label: t('projects.filterHardware'), icon: Cpu },
    { value: 'Spatial Design', label: t('projects.filterSpatial'), icon: Building2 },
  ];

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="bg-[#1A1A1A] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge={t('projects.sectionBadge')} title={t('projects.sectionTitle')} dark className="mb-10" />

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex items-center gap-2 px-4 py-2 border-2 font-mono text-sm font-bold transition-all duration-150 ${
                activeFilter === value
                  ? 'bg-[#FF6B35] border-[#FF6B35] text-[#1A1A1A] shadow-[3px_3px_0px_#F5F0E8]'
                  : 'bg-transparent border-[#F5F0E8]/30 text-[#F5F0E8]/70 hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8]'
              }`}
            >
              {Icon && <Icon size={14} strokeWidth={2.5} />}
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="text-[#FF6B35] animate-spin" strokeWidth={2} />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onSelectProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
