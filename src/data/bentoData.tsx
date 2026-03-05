import { Bot, Cpu, Building2, Award, Github, Coffee, Globe, Layers } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';

export interface BentoItem {
  id: string;
  colSpan: string;
  rowSpan: string;
  bg: string;
  textColor: string;
  content?: ReactNode;
  icon?: ElementType;
  label?: string;
  stat?: string;
  subLabel?: string;
}

type TFunc = (key: string) => string;

export function getBentoItems(t: TFunc): BentoItem[] {
  return [
    {
      id: 'identity',
      colSpan: 'md:col-span-2',
      rowSpan: '',
      bg: '#1A1A1A',
      textColor: '#F5F0E8',
      content: (
        <div className="h-full flex flex-col justify-between">
          <div className="font-mono text-xs text-[#FF6B35] mb-2">{t('bento.identityComment')}</div>
          <div>
            <div className="font-mono font-black text-3xl text-[#F5F0E8] leading-tight mb-2">
              {t('bento.identityHeadline')}
            </div>
            <p className="font-sans text-sm text-[#F5F0E8]/60">
              {t('bento.identitySubline')}
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            {[t('bento.tag1'), t('bento.tag2'), t('bento.tag3')].map((tag) => (
              <span key={tag} className="px-2 py-1 border border-[#F5F0E8]/30 font-mono text-xs text-[#F5F0E8]/70">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'ai-agents',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#FF6B35',
      textColor: '#F5F0E8',
      icon: Bot,
      label: t('bento.aiAgentsLabel'),
      stat: '3',
      subLabel: t('bento.aiAgentsSub'),
    },
    {
      id: 'hardware',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#F5F0E8',
      textColor: '#1A1A1A',
      icon: Cpu,
      label: t('bento.hardwareLabel'),
      stat: '1',
      subLabel: t('bento.hardwareSub'),
    },
    {
      id: 'spatial',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#00D4AA',
      textColor: '#1A1A1A',
      icon: Building2,
      label: t('bento.spatialLabel'),
      stat: '6+',
      subLabel: t('bento.spatialSub'),
    },
    {
      id: 'award',
      colSpan: 'md:col-span-2',
      rowSpan: '',
      bg: '#FFD60A',
      textColor: '#1A1A1A',
      content: (
        <div className="h-full flex items-center gap-4">
          <div className="p-3 border-2 border-[#1A1A1A]">
            <Award size={28} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-mono text-xs font-bold mb-1">{t('bento.awardLine1')}</div>
            <div className="font-mono font-black text-xl text-[#1A1A1A]">
              {t('bento.awardLine2')}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'methodology',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#F5F0E8',
      textColor: '#1A1A1A',
      content: (
        <div>
          <div className="font-mono text-xs text-[#1A1A1A]/50 mb-2">{t('bento.methodComment')}</div>
          <Layers size={28} strokeWidth={2} className="mb-3 text-[#1A1A1A]" />
          <div className="font-mono font-black text-lg">{t('bento.methodTitle')}</div>
          <p className="font-sans text-xs text-[#1A1A1A]/60 mt-1">{t('bento.methodSub')}</p>
        </div>
      ),
    },
    {
      id: 'remote',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#1A1A1A',
      textColor: '#F5F0E8',
      content: (
        <div>
          <div className="font-mono text-xs text-[#FF6B35] mb-2">{t('bento.locationComment')}</div>
          <Globe size={28} strokeWidth={2} className="mb-3 text-[#F5F0E8]" />
          <div className="font-mono font-black text-lg text-[#F5F0E8]">{t('bento.locationTitle')}</div>
          <p className="font-sans text-xs text-[#F5F0E8]/50 mt-1">{t('bento.locationSub')}</p>
        </div>
      ),
    },
    {
      id: 'github',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#F5F0E8',
      textColor: '#1A1A1A',
      content: (
        <div>
          <div className="font-mono text-xs text-[#1A1A1A]/50 mb-2">{t('bento.openSourceComment')}</div>
          <Github size={28} strokeWidth={2} className="mb-3" />
          <div className="font-mono font-black text-lg">{t('bento.openSourceTitle')}</div>
          <p className="font-sans text-xs text-[#1A1A1A]/60 mt-1">{t('bento.openSourceSub')}</p>
        </div>
      ),
    },
    {
      id: 'coffee',
      colSpan: 'md:col-span-1',
      rowSpan: '',
      bg: '#FF6B35',
      textColor: '#F5F0E8',
      content: (
        <div>
          <div className="font-mono text-xs text-[#F5F0E8]/70 mb-2">{t('bento.fuelComment')}</div>
          <Coffee size={28} strokeWidth={2} className="mb-3 text-[#F5F0E8]" />
          <div className="font-mono font-black text-lg text-[#F5F0E8]">{t('bento.fuelTitle')}</div>
          <p className="font-sans text-xs text-[#F5F0E8]/70 mt-1">{t('bento.fuelSub')}</p>
        </div>
      ),
    },
  ];
}
