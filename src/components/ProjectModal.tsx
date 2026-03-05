import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import type { Project } from '../lib/types';
import { CATEGORY_ACCENT } from '../lib/constants';
import { parseMarkdown } from '../lib/textUtils';
import { useTranslation } from '../hooks/useTranslation';

const MermaidChart = lazy(() => import('./MermaidChart'));

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const { t, locale } = useTranslation();

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-[#F5F0E8] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b-2 border-[#1A1A1A] bg-[#1A1A1A] z-10">
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 font-mono text-xs font-bold text-[#1A1A1A]"
                  style={{ backgroundColor: CATEGORY_ACCENT[project.category] ?? '#FFD60A' }}
                >
                  {project.category.toUpperCase()}
                </span>
                <span className="font-mono font-black text-[#F5F0E8] text-sm truncate">
                  {(locale === 'zh' && project.translations?.zh?.title) || project.title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 border-2 border-[#F5F0E8]/30 text-[#F5F0E8] hover:bg-[#F5F0E8]/10 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 md:p-10 max-w-4xl mx-auto">
              {project.media_urls?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {project.media_urls.slice(0, 2).map((url, i) => (
                    <div key={i} className="border-2 border-[#1A1A1A] overflow-hidden">
                      <img
                        src={url}
                        alt={`${project.title} ${i + 1}`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {(() => {
                const stats = (locale === 'zh' && project.translations?.zh?.impact_stats) || project.impact_stats;
                return stats?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 border-2 border-[#1A1A1A] bg-[#1A1A1A] shadow-[3px_3px_0px_#FF6B35]"
                      >
                        <div className="font-mono font-black text-2xl text-[#FFD60A]">{stat.value}</div>
                        <div className="font-mono text-xs text-[#F5F0E8]/70 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}

              {(() => {
                const longDesc = (locale === 'zh' && project.translations?.zh?.long_description) || project.long_description;
                return longDesc ? (
                  <div className="mb-10">
                    {parseMarkdown(longDesc).map((node, i) => {
                      if (node.type === 'heading') {
                        return (
                          <h3 key={i} className="font-mono font-black text-xl text-[#1A1A1A] mt-6 mb-2 border-b-2 border-[#1A1A1A] pb-1">
                            {node.text}
                          </h3>
                        );
                      }
                      if (node.type === 'bullet') {
                        return (
                          <p key={i} className="font-sans text-[#1A1A1A]/80 text-sm leading-relaxed pl-4 before:content-['→'] before:mr-2 before:text-[#FF6B35]">
                            {node.text}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className="font-sans text-[#1A1A1A]/80 text-sm leading-relaxed">
                          {node.text}
                        </p>
                      );
                    })}
                  </div>
                ) : null;
              })()}

              {project.logic_map && (
                <div className="mb-10">
                  <div className="font-mono text-xs font-bold text-[#1A1A1A]/60 mb-3 flex items-center gap-2">
                    <span className="text-[#FF6B35]">{t('projects.logicMap')}</span>
                  </div>
                  <Suspense fallback={
                    <div className="h-40 border-2 border-[#1A1A1A] bg-[#F5F0E8] flex items-center justify-center font-mono text-sm text-[#1A1A1A]/40">
                      {t('projects.loadingDiagram')}
                    </div>
                  }>
                    <MermaidChart definition={project.logic_map.definition} />
                  </Suspense>
                </div>
              )}

              {project.tech_tags?.length > 0 && (
                <div>
                  <div className="font-mono text-xs font-bold text-[#1A1A1A]/60 mb-3">{t('projects.techStack')}</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border-2 border-[#1A1A1A] font-mono text-xs font-bold text-[#1A1A1A] bg-[#F5F0E8] shadow-[2px_2px_0px_#1A1A1A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
