import { motion } from 'framer-motion';
import { ArrowDown, Download, Cpu, GitBranch, Box, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Hero() {
  const { t } = useTranslation();

  const floatingItems = [
    { icon: Cpu, label: t('hero.floatingHardware'), x: '10%', y: '20%', delay: 0 },
    { icon: GitBranch, label: t('hero.floatingAI'), x: '80%', y: '15%', delay: 0.2 },
    { icon: Box, label: t('hero.floatingSpatial'), x: '75%', y: '70%', delay: 0.4 },
    { icon: Zap, label: t('hero.floatingAuto'), x: '15%', y: '75%', delay: 0.6 },
  ];

  const stats = [
    { value: t('hero.stats.s1value'), label: t('hero.stats.s1label') },
    { value: t('hero.stats.s2value'), label: t('hero.stats.s2label') },
    { value: t('hero.stats.s3value'), label: t('hero.stats.s3label') },
  ];

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#F5F0E8] flex items-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #1A1A1A 39px, #1A1A1A 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #1A1A1A 39px, #1A1A1A 40px)`,
        }}
      />

      {floatingItems.map(({ icon: Icon, label, x, y, delay }) => (
        <motion.div
          key={label}
          className="absolute hidden lg:flex items-center gap-2 px-3 py-2 bg-[#F5F0E8] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] font-mono text-xs font-bold text-[#1A1A1A]"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay, duration: 0.5 },
            scale: { delay, duration: 0.5 },
            y: { delay, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Icon size={14} strokeWidth={2.5} />
          {label}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 border-2 border-[#1A1A1A] bg-[#FFD60A] font-mono text-xs font-bold mb-6"
          >
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono font-black text-5xl md:text-7xl text-[#1A1A1A] leading-[1.05] mb-6"
          >
            {t('hero.line1')}
            <span className="block text-[#FF6B35]">{t('hero.line2')}</span>
            <span className="block">{t('hero.line3')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#1A1A1A]/70 text-lg leading-relaxed mb-8 max-w-md font-sans"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={scrollToProjects}
              className="px-6 py-3 bg-[#1A1A1A] text-[#F5F0E8] font-mono font-bold text-sm border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#FF6B35] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
            >
              {t('hero.viewProjects')}
            </button>
            <a
              href="#"
              className="px-6 py-3 bg-[#F5F0E8] text-[#1A1A1A] font-mono font-bold text-sm border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <Download size={14} strokeWidth={2.5} />
              {t('hero.downloadCV')}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 mt-12"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="border-l-2 border-[#1A1A1A] pl-4">
                <div className="font-mono font-black text-2xl text-[#FF6B35]">{value}</div>
                <div className="font-mono text-xs text-[#1A1A1A]/60">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 border-2 border-[#1A1A1A] bg-[#1A1A1A] translate-x-3 translate-y-3" />
            <div className="relative border-2 border-[#1A1A1A] bg-[#F5F0E8] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#1A1A1A] bg-[#1A1A1A]">
                {['#FF6B35', '#FFD60A', '#00D4AA'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <span className="font-mono text-xs text-[#F5F0E8] ml-2">{t('hero.terminalFile')}</span>
              </div>
              <div className="relative bg-[#0D0D0D] aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                  alt="BOK AI Health System"
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-xs text-[#00D4AA] mb-1">{t('hero.terminalBadge')}</div>
                  <div className="font-mono text-sm text-white font-bold">{t('hero.terminalName')}</div>
                  <div className="font-mono text-xs text-white/60">{t('hero.terminalSub')}</div>
                </div>
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              </div>
              <div className="p-4 font-mono text-xs text-[#1A1A1A]/60 space-y-1">
                <div><span className="text-[#FF6B35]">$</span> {t('hero.terminalStatus')}</div>
                <div><span className="text-[#FF6B35]">$</span> {t('hero.terminalUptime')}</div>
                <div><span className="text-[#FF6B35]">$</span> <span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={24} strokeWidth={2.5} className="text-[#1A1A1A]/40" />
      </motion.div>
    </section>
  );
}
