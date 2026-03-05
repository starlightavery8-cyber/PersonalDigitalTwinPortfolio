import { Github, Linkedin, Twitter, Terminal } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const links = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="bg-[#1A1A1A] border-t-2 border-[#F5F0E8]/10 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-mono font-bold text-[#F5F0E8]">
          <Terminal size={18} strokeWidth={2.5} className="text-[#FF6B35]" />
          {locale === 'en' ? 'AVERY WONG' : '王洁'}
          <span className="text-[#F5F0E8]/30 font-normal text-xs ml-2">
            {t('footer.subtitle')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {links.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="p-2 border-2 border-[#F5F0E8]/20 text-[#F5F0E8]/60 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all duration-150"
            >
              <Icon size={16} strokeWidth={2} />
            </a>
          ))}
        </div>

        <div className="font-mono text-xs text-[#F5F0E8]/30">
          © {new Date().getFullYear()} · {t('footer.built')}
        </div>
      </div>
    </footer>
  );
}
