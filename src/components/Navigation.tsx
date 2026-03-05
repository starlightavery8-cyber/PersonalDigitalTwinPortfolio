import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import type { Locale } from '../lib/i18n';

export default function Navigation() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.stack'), href: '#stack' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLocale = () => {
    setLocale((locale === 'en' ? 'zh' : 'en') as Locale);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F0E8] border-b-2 border-[#1A1A1A]'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 font-mono font-bold text-lg text-[#1A1A1A] hover:text-[#FF6B35] transition-colors"
          >
            <Terminal size={20} strokeWidth={2.5} />
            {locale === 'en' ? 'AVERY' : '王洁'}
          </button>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="px-4 py-2 font-mono text-sm font-semibold text-[#1A1A1A] border-2 border-transparent hover:border-[#1A1A1A] hover:bg-[#FFD60A] transition-all duration-150"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="ml-2">
              <motion.button
                onClick={toggleLocale}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 font-mono text-sm font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] bg-[#FFD60A] hover:bg-[#FF6B35] hover:text-[#F5F0E8] hover:border-[#FF6B35] transition-all duration-150 min-w-[52px]"
              >
                {t('nav.langToggle')}
              </motion.button>
            </li>
          </ul>

          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={toggleLocale}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 font-mono text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] bg-[#FFD60A] hover:bg-[#FF6B35] hover:text-[#F5F0E8] transition-all duration-150"
            >
              {t('nav.langToggle')}
            </motion.button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 border-2 border-[#1A1A1A] bg-[#F5F0E8] hover:bg-[#FFD60A] transition-colors"
            >
              {menuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[69px] left-0 right-0 z-40 bg-[#F5F0E8] border-b-2 border-[#1A1A1A] md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="w-full text-left px-6 py-4 font-mono font-semibold text-[#1A1A1A] border-b-2 border-[#1A1A1A] last:border-b-0 hover:bg-[#FFD60A] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
