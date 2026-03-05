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

interface SvgDims {
  w: number;
  h: number;
}

function getContentBBox(svgEl: SVGSVGElement): SvgDims {
  try {
    const bbox = svgEl.getBBox();
    if (bbox.width > 0 && bbox.height > 0) return { w: bbox.width, h: bbox.height };
  } catch (_) {}
  const vb = svgEl.viewBox?.baseVal;
  if (vb && vb.width > 0 && vb.height > 0) return { w: vb.width, h: vb.height };
  return { w: svgEl.clientWidth || 800, h: svgEl.clientHeight || 400 };
}

interface PanZoomProps {
  svgHtml: string;
  containerHeight?: number;
}

function PanZoomView({ svgHtml, containerHeight = 260 }: PanZoomProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [ctrlZooming, setCtrlZooming] = useState(false);
  const ctrlZoomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  useEffect(() => {
    if (!wrapperRef.current || !svgHtml) return;
    const cw = wrapperRef.current.clientWidth || 600;
    const ch = containerHeight;

    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px';
    probe.innerHTML = svgHtml;
    document.body.appendChild(probe);
    const svgEl = probe.querySelector('svg');
    let dims: SvgDims = { w: 800, h: 400 };
    if (svgEl) dims = getContentBBox(svgEl as SVGSVGElement);
    document.body.removeChild(probe);

    const padding = 24;
    const scaleX = (cw - padding) / dims.w;
    const scaleY = (ch - padding) / dims.h;
    const fit = Math.min(scaleX, scaleY);
    setFitScale(fit);
    setScale(fit);
    setPos({ x: 0, y: 0 });
  }, [svgHtml, containerHeight]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * factor, 0.1), 5));
    setCtrlZooming(true);
    if (ctrlZoomTimer.current) clearTimeout(ctrlZoomTimer.current);
    ctrlZoomTimer.current = setTimeout(() => setCtrlZooming(false), 1000);
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
  const zoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setScale((s) => Math.max(s * 0.8, 0.1)); };
  const reset = (e: React.MouseEvent) => { e.stopPropagation(); setScale(fitScale); setPos({ x: 0, y: 0 }); };

  return (
    <div
      ref={wrapperRef}
      className="relative select-none overflow-hidden w-full"
      style={{ height: containerHeight, cursor: isDragging.current ? 'grabbing' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={() => { stopDrag(); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
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
        <button onClick={reset} className="p-1.5 bg-[#1A1A1A] border border-[#F5F0E8]/20 text-[#F5F0E8] hover:bg-[#FF6B35] transition-colors" title="Fit to view">
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
        style={{ opacity: isHovered && !ctrlZooming ? 1 : 0 }}
      >
        <span className="font-mono text-[10px] text-[#1A1A1A]/50 bg-[#F5F0E8]/80 px-2 py-1 border border-[#1A1A1A]/20">
          Ctrl + scroll to zoom
        </span>
      </div>

      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#1A1A1A]/30 pointer-events-none">
        {Math.round(scale * 100)}% · drag to pan
      </div>
    </div>
  );
}

export default function MermaidChart({ definition }: Props) {
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
        setSvgHtml(svg);
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
      <div className="w-full border-2 border-[#1A1A1A] bg-[#F5F0E8] p-6 font-mono text-xs text-[#1A1A1A]/40 text-center min-h-[120px] flex items-center justify-center">
        Loading diagram...
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-[#F5F0E8] border-2 border-[#1A1A1A] relative">
        <PanZoomView svgHtml={svgHtml} containerHeight={260} />
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
            <div style={{ height: 'calc(90vh - 48px)' }}>
              <PanZoomView svgHtml={svgHtml} containerHeight={window.innerHeight * 0.9 - 48} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
