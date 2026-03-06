import { lazy, Suspense, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { DevModeProvider } from './contexts/DevModeContext';
import { useTranslation } from './hooks/useTranslation';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import ProjectMatrix from './components/ProjectMatrix';
import ProjectModal from './components/ProjectModal';
import ExperienceTimeline from './components/ExperienceTimeline';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';
import type { Project } from './lib/types';

const SkillsSection = lazy(() => import('./components/SkillsSection'));
const DevPanel = lazy(() => import('./components/dev/DevPanel'));

function AppInner() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navigation />
      <main>
        <Hero />
        <BentoGrid />
        <ProjectMatrix onSelectProject={setSelectedProject} />
        <ExperienceTimeline />
        <Suspense fallback={
          <div className="bg-[#1A1A1A] h-64 flex items-center justify-center font-mono text-[#FF6B35] text-sm">
            {t('hero.loadingStack')}
          </div>
        }>
          <SkillsSection />
        </Suspense>
        <ContactForm />
      </main>
      <Footer />
      <FloatingChat />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <Suspense fallback={null}>
        <DevPanel />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <DevModeProvider>
        <AppInner />
      </DevModeProvider>
    </LanguageProvider>
  );
}

export default App;
