import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, Briefcase, Zap, Globe, Lock, Terminal } from 'lucide-react';
import { useDevMode } from '../../hooks/useDevMode';

const DevProjectEditor = lazy(() => import('./DevProjectEditor'));
const DevExperienceEditor = lazy(() => import('./DevExperienceEditor'));
const DevSkillsEditor = lazy(() => import('./DevSkillsEditor'));
const DevTranslationsEditor = lazy(() => import('./DevTranslationsEditor'));

type Tab = 'projects' | 'experience' | 'skills' | 'translations';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={13} /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={13} /> },
  { id: 'skills', label: 'Skills', icon: <Zap size={13} /> },
  { id: 'translations', label: 'Translations', icon: <Globe size={13} /> },
];

function TabLoader() {
  return (
    <div className="flex items-center justify-center h-32 font-mono text-xs text-[#1A1A1A]/30">
      Loading editor...
    </div>
  );
}

export default function DevPanel() {
  const { isPanelOpen, closePanel, lock } = useDevMode();
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm z-[90]"
            onClick={closePanel}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl z-[91] bg-[#F5F0E8] border-l-2 border-[#1A1A1A] shadow-[-8px_0px_0px_#1A1A1A] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 bg-[#1A1A1A] border-b-2 border-[#1A1A1A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <Terminal size={15} strokeWidth={2.5} className="text-[#FF6B35]" />
                <span className="font-mono font-black text-sm text-[#F5F0E8]">DEV MODE</span>
                <span className="font-mono text-[10px] text-[#FFD60A] border border-[#FFD60A]/40 px-1.5 py-0.5">UNLOCKED</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={lock}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold text-[#F5F0E8]/60 border border-[#F5F0E8]/20 hover:border-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors"
                >
                  <Lock size={11} />
                  LOCK
                </button>
                <button
                  onClick={closePanel}
                  className="p-2 border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#F5F0E8]/10 transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex border-b-2 border-[#1A1A1A] flex-shrink-0 bg-white">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 font-mono text-xs font-bold border-r border-[#1A1A1A]/10 last:border-r-0 transition-colors ${
                    tab === t.id
                      ? 'bg-[#FFD60A] text-[#1A1A1A]'
                      : 'text-[#1A1A1A]/50 hover:bg-[#F5F0E8] hover:text-[#1A1A1A]'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <Suspense fallback={<TabLoader />}>
                {tab === 'projects' && <DevProjectEditor />}
                {tab === 'experience' && <DevExperienceEditor />}
                {tab === 'skills' && <DevSkillsEditor />}
                {tab === 'translations' && <DevTranslationsEditor />}
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
