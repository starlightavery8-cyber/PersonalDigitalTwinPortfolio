import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#FFD60A',
    primaryTextColor: '#1A1A1A',
    primaryBorderColor: '#1A1A1A',
    lineColor: '#F5F0E8',
    secondaryColor: '#2A2A2A',
    tertiaryColor: '#FF6B35',
    background: '#1A1A1A',
    mainBkg: '#2A2A2A',
    nodeBorder: '#FFD60A',
    clusterBkg: '#1E1E1E',
    clusterBorder: '#FF6B35',
    titleColor: '#F5F0E8',
    edgeLabelBackground: '#1A1A1A',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    labelBoxBkgColor: '#2A2A2A',
    labelBoxBorderColor: '#FFD60A',
    labelTextColor: '#F5F0E8',
    loopTextColor: '#F5F0E8',
    noteBkgColor: '#FF6B35',
    noteTextColor: '#1A1A1A',
    activationBorderColor: '#FFD60A',
    activationBkgColor: '#2A2A2A',
  },
});

interface Props {
  definition: string;
  title?: string;
}

let chartCounter = 0;

export default function MermaidChart({ definition, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !definition?.trim()) return;

    let cancelled = false;

    const render = async () => {
      const id = `mermaid-chart-${++chartCounter}`;
      try {
        const { svg } = await mermaid.render(id, definition.trim());
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.display = 'block';
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
        }
        setRendered(true);
        setError(false);
      } catch (err) {
        if (!cancelled) {
          console.warn('Mermaid render error:', err);
          setError(true);
        }
      }
    };

    const timer = setTimeout(render, 80);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [definition]);

  return (
    <div className="w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[4px_4px_0px_#1A1A1A]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] border-b border-[#FFD60A]/20">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]" />
        </div>
        <span className="font-mono text-[10px] text-[#F5F0E8]/40 ml-2 tracking-widest uppercase">
          {title ?? 'LOGIC MAP'}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="font-mono text-[9px] text-[#00D4AA]/70 tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-5 overflow-x-auto">
        {!rendered && !error && (
          <div className="flex items-center justify-center h-40 gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-[#FFD60A] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-[#F5F0E8]/30 tracking-widest">RENDERING</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-40 gap-2 font-mono text-xs text-[#FF6B35]/60">
            <span className="text-[#FF6B35]">!</span>
            DIAGRAM UNAVAILABLE
          </div>
        )}
        <div
          ref={containerRef}
          className={`w-full transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0 absolute'}`}
          style={{ minHeight: rendered ? undefined : 0 }}
        />
      </div>

      <div className="px-4 py-2 bg-[#1A1A1A] border-t border-[#FFD60A]/10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-[#F5F0E8]/20 tracking-widest">SYSTEM ARCHITECTURE</span>
        <span className="font-mono text-[9px] text-[#F5F0E8]/20 tracking-widest">MERMAID.JS</span>
      </div>
    </div>
  );
}
