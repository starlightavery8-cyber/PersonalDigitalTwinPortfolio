import { useEffect, useRef } from 'react';
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

let chartId = 0;

export default function MermaidChart({ definition }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${++chartId}`);

  useEffect(() => {
    if (!ref.current) return;
    const render = async () => {
      try {
        const { svg } = await mermaid.render(id.current, definition);
        if (ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
          }
        }
      } catch (err) {
        console.warn('Mermaid render error:', err);
      }
    };
    render();
  }, [definition]);

  return (
    <div
      ref={ref}
      className="mermaid-container w-full overflow-x-auto bg-[#F5F0E8] border-2 border-[#1A1A1A] p-4"
    />
  );
}
