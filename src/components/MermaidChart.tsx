import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

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

interface Transform {
  scale: number;
  x: number;
  y: number;
}

export default function MermaidChart({ definition }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          svgEl.style.maxWidth = 'none';
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
        }
        setError(false);
        setTransform({ scale: 1, x: 0, y: 0 });
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.3), 5),
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTransform((prev) => ({
      ...prev,
      x: dragStart.current!.tx + dx,
      y: dragStart.current!.ty + dy,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const zoomIn = () => setTransform((p) => ({ ...p, scale: Math.min(p.scale * 1.25, 5) }));
  const zoomOut = () => setTransform((p) => ({ ...p, scale: Math.max(p.scale * 0.8, 0.3) }));
  const reset = () => setTransform({ scale: 1, x: 0, y: 0 });

  if (error) {
    return (
      <div className="w-full border-2 border-[#1A1A1A] bg-[#F5F0E8] p-6 font-mono text-xs text-[#1A1A1A]/50 text-center">
        DIAGRAM UNAVAILABLE
      </div>
    );
  }

  const content = (
    <div
      className="relative select-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={svgWrapRef}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <div ref={containerRef} className="min-h-[120px]" />
      </div>

      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={13} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={13} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors"
          title="Reset"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
          className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#1A1A1A]/30 pointer-events-none">
        {Math.round(transform.scale * 100)}% · scroll to zoom · drag to pan
      </div>
    </div>
  );

  return (
    <>
      <div className="mermaid-container w-full overflow-hidden bg-[#F5F0E8] border-2 border-[#1A1A1A] p-4 min-h-[160px]">
        {content}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[200] bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative bg-[#F5F0E8] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#FF6B35] w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#1A1A1A] bg-[#1A1A1A]">
              <span className="font-mono text-xs font-bold text-[#FF6B35]">LOGIC MAP</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="font-mono text-xs text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors px-2 py-1 border border-[#F5F0E8]/20 hover:border-[#FF6B35]"
              >
                ESC / CLOSE
              </button>
            </div>
            <div className="p-6 overflow-hidden">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
