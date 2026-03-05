import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_ACCENT } from '../lib/constants';
import { useTranslation } from '../hooks/useTranslation';
import type { Project } from '../lib/types';

interface Props {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const { t, locale } = useTranslation();
  const accent = CATEGORY_ACCENT[project.category] ?? '#FFD60A';

  const title = (locale === 'zh' && project.translations?.zh?.title) || project.title;
  const description = (locale === 'zh' && project.translations?.zh?.description) || project.description;
  const impactStats = (locale === 'zh' && project.translations?.zh?.impact_stats) || project.impact_stats;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative border-2 border-[#1A1A1A] bg-[#F5F0E8] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 overflow-hidden">
        {project.media_urls?.[0] && (
          <div className="relative overflow-hidden border-b-2 border-[#1A1A1A] h-48">
            <img
              src={project.media_urls[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent" />
            <div
              className="absolute top-3 left-3 px-2 py-0.5 border-2 border-[#1A1A1A] font-mono text-xs font-bold text-[#1A1A1A]"
              style={{ backgroundColor: accent }}
            >
              {project.category.toUpperCase()}
            </div>
            {project.is_featured && (
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#1A1A1A] border-2 border-[#F5F0E8] font-mono text-xs font-bold text-[#F5F0E8]">
                {t('projects.featured')}
              </div>
            )}
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-mono font-black text-lg text-[#1A1A1A] leading-tight">
              {title}
            </h3>
            <ArrowUpRight
              size={18}
              strokeWidth={2.5}
              className="flex-shrink-0 text-[#1A1A1A]/40 group-hover:text-[#FF6B35] transition-colors mt-0.5"
            />
          </div>

          <p className="font-sans text-sm text-[#1A1A1A]/70 leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          {impactStats?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {impactStats.slice(0, 2).map((stat) => (
                <div key={stat.label} className="px-3 py-2 bg-[#1A1A1A] border border-[#1A1A1A]">
                  <div className="font-mono font-black text-sm text-[#FFD60A]">{stat.value}</div>
                  <div className="font-mono text-[10px] text-[#F5F0E8]/60 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.tech_tags?.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 border border-[#1A1A1A]/30 font-mono text-[10px] text-[#1A1A1A]/60"
              >
                {tag}
              </span>
            ))}
            {(project.tech_tags?.length ?? 0) > 4 && (
              <span className="px-2 py-0.5 border border-[#1A1A1A]/30 font-mono text-[10px] text-[#1A1A1A]/40">
                +{project.tech_tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
