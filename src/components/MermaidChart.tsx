import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, X } from 'lucide-react';

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

interface PanZoomProps {
  svgHtml: string;
}

function PanZoomView({ svgHtml }: PanZoomProps) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * factor, 0.3), 5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  }, [pos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    });
  }, []);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  const zoomIn = (e: React.MouseEvent) => { e.stopPropagation(); setScale((s) => Math.min(s * 1.25, 5)); };
  const zoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setScale((s) => Math.max(s * 0.8, 0.3)); };
  const reset = (e: React.MouseEvent) => { e.stopPropagation(); setScale(1); setPos({ x: 0, y: 0 }); };

  return (
    <div
      className="relative select-none overflow-hidden min-h-[140px]"
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      <div
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
        }}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />

      <div className="absolute top-2 right-2 flex gap-1 z-10 pointer-events-auto">
        <button onClick={zoomIn} className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors" title="Zoom in">
          <ZoomIn size={13} strokeWidth={2.5} />
        </button>
        <button onClick={zoomOut} className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors" title="Zoom out">
          <ZoomOut size={13} strokeWidth={2.5} />
        </button>
        <button onClick={reset} className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors" title="Reset view">
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#1A1A1A]/30 pointer-events-none">
        {Math.round(scale * 100)}% · scroll to zoom · drag to pan
      </div>
    </div>
  );
}

export default function MermaidChart({ definition }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState('');
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!definition?.trim()) return;
    let cancelled = false;

    const render = async () => {
      const id = `mermaid-chart-${++chartCounter}`;
      try {
        const { svg } = await mermaid.render(id, definition.trim());
        if (cancelled) return;
        const patched = svg
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="auto"')
          .replace(/style="max-width:[^"]*"/, '');
        setSvgHtml(patched);
        setError(false);
      } catch (err) {
        if (!cancelled) {
          console.warn('Mermaid render error:', err);
          setError(true);
        }
      }
    };

    const timer = setTimeout(render, 50);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [definition]);

  if (error) {
    return (
      <div className="w-full border-2 border-[#1A1A1A] bg-[#F5F0E8] p-6 font-mono text-xs text-[#1A1A1A]/50 text-center">
        DIAGRAM UNAVAILABLE
      </div>
    );
  }

  if (!svgHtml) {
    return (
      <div ref={containerRef} className="w-full border-2 border-[#1A1A1A] bg-[#F5F0E8] p-6 font-mono text-xs text-[#1A1A1A]/40 text-center min-h-[120px] flex items-center justify-center">
        Loading diagram...
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-[#F5F0E8] border-2 border-[#1A1A1A] p-4 relative">
        <PanZoomView svgHtml={svgHtml} />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-[116px] p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors z-10"
          title="Fullscreen"
        >
          <Maximize2 size={13} strokeWidth={2.5} />
        </button>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[200] bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative bg-[#F5F0E8] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#FF6B35] w-full max-w-5xl"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#1A1A1A] bg-[#1A1A1A]">
              <span className="font-mono text-xs font-bold text-[#FF6B35]">LOGIC MAP</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-4" style={{ height: 'calc(90vh - 48px)' }}>
              <PanZoomView svgHtml={svgHtml} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
