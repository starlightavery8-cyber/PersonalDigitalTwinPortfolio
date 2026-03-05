import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#FFD60A',
    primaryTextColor: '#1A1A1A',
    primaryBorderColor: '#1A1A1A',
    lineColor: '#1A1A1A',
    secondaryColor: '#F5F0E8',
    tertiaryColor: '#FF6B35',
    background: '#F5F0E8',
    mainBkg: '#F5F0E8',
    nodeBorder: '#1A1A1A',
    clusterBkg: '#F5F0E8',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
  },
});

interface Props {
  definition: string;
}

let chartCounter = 0;

export default function MermaidChart({ definition }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-chart-${++chartCounter}`);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !definition?.trim()) return;

    let cancelled = false;

    const render = async () => {
      const id = `mermaid-chart-${++chartCounter}`;
      idRef.current = id;
      try {
        const { svg } = await mermaid.render(id, definition.trim());
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
        }
        setError(false);
      } catch (err) {
        if (!cancelled) {
          console.warn('Mermaid render error:', err);
          setError(true);
        }
      }
    };

    const timer = setTimeout(render, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [definition]);

  if (error) {
    return (
      <div className="w-full border-2 border-[#1A1A1A] bg-[#F5F0E8] p-6 font-mono text-xs text-[#1A1A1A]/50 text-center">
        DIAGRAM UNAVAILABLE
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container w-full overflow-x-auto bg-[#F5F0E8] border-2 border-[#1A1A1A] p-4 min-h-[120px]"
    />
  );
}
