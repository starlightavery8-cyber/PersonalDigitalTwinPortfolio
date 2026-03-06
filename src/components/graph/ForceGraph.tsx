import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode, GraphLink, GraphNodeGroup } from '../../lib/types';
import { GROUP_COLORS, NODE_RADIUS, LINK_COLOR } from './graphConfig';

interface SimNode extends GraphNode, d3.SimulationNodeDatum {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: GraphLink['type'];
}

interface Props {
  data: GraphData;
  activeGroup: GraphNodeGroup | null;
  selectedNode: GraphNode | null;
  onNodeHover: (node: GraphNode | null, x: number, y: number) => void;
  onNodeClick: (node: GraphNode) => void;
  locale: string;
}

export default function ForceGraph({
  data,
  activeGroup,
  selectedNode,
  onNodeHover,
  onNodeClick,
  locale,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getNodeOpacity = useCallback(
    (node: SimNode): number => {
      if (activeGroup && node.group !== activeGroup) return 0.15;
      if (selectedNode) {
        const connected = data.links.some(
          (l) => l.source === node.id || l.target === node.id ||
                 (l.source as GraphNode)?.id === node.id ||
                 (l.target as GraphNode)?.id === node.id
        );
        if (selectedNode.id === node.id) return 1;
        const isNeighbor = data.links.some((l) => {
          const src = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
          const tgt = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
          return (src === selectedNode.id && tgt === node.id) ||
                 (tgt === selectedNode.id && src === node.id);
        });
        return isNeighbor ? 1 : 0.12;
      }
      return 1;
    },
    [activeGroup, selectedNode, data.links]
  );

  const getLinkOpacity = useCallback(
    (link: SimLink): number => {
      const src = typeof link.source === 'object' ? (link.source as SimNode).id : link.source;
      const tgt = typeof link.target === 'object' ? (link.target as SimNode).id : link.target;
      if (activeGroup) {
        const srcNode = data.nodes.find((n) => n.id === src);
        const tgtNode = data.nodes.find((n) => n.id === tgt);
        if (srcNode?.group !== activeGroup && tgtNode?.group !== activeGroup) return 0.03;
      }
      if (selectedNode) {
        if (src === selectedNode.id || tgt === selectedNode.id) return 1;
        return 0.04;
      }
      return 0.6;
    },
    [activeGroup, selectedNode, data.nodes]
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .style('background', 'transparent');

    const defs = svg.append('defs');

    defs
      .append('marker')
      .attr('id', 'arrow-usage')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', LINK_COLOR.usage);

    defs
      .append('marker')
      .attr('id', 'arrow-dependency')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', LINK_COLOR.dependency);

    defs
      .append('marker')
      .attr('id', 'arrow-applies')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', LINK_COLOR.applies);

    const g = svg.append('g');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    const simNodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = data.links.map((l) => ({
      source: l.source,
      target: l.target,
      type: l.type,
    }));

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) => {
            const src = l.source as SimNode;
            const tgt = l.target as SimNode;
            if (tgt.group === 'project') return 130;
            if (src.group === 'core') return 100;
            return 90;
          })
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => (NODE_RADIUS[d.level] ?? 18) + 14))
      .force('x', d3.forceX(width / 2).strength(0.04))
      .force('y', d3.forceY(height / 2).strength(0.04));

    simulationRef.current = simulation;

    const linkGroup = g.append('g').attr('class', 'links');

    const linkEl = linkGroup
      .selectAll<SVGPathElement, SimLink>('path')
      .data(simLinks)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => LINK_COLOR[d.type] ?? LINK_COLOR.dependency)
      .attr('stroke-width', (d) => (d.type === 'usage' ? 1.5 : 1))
      .attr('stroke-dasharray', (d) => (d.type === 'applies' ? '4,3' : 'none'))
      .attr('marker-end', (d) => `url(#arrow-${d.type})`)
      .attr('opacity', 0.6);

    const nodeGroup = g.append('g').attr('class', 'nodes');

    const nodeEl = nodeGroup
      .selectAll<SVGGElement, SimNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeEl.each(function (d) {
      const el = d3.select(this);
      const r = NODE_RADIUS[d.level] ?? 18;
      const colors = GROUP_COLORS[d.group];

      if (d.group === 'project') {
        el.append('rect')
          .attr('x', -r)
          .attr('y', -r * 0.7)
          .attr('width', r * 2)
          .attr('height', r * 1.4)
          .attr('rx', 2)
          .attr('fill', colors.fill)
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 2);
      } else if (d.level === 1) {
        const size = r * 1.3;
        el.append('polygon')
          .attr(
            'points',
            `0,${-size} ${size * 0.87},${size * 0.5} ${-size * 0.87},${size * 0.5}`
          )
          .attr('fill', colors.fill)
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 2);
      } else {
        el.append('circle')
          .attr('r', r)
          .attr('fill', colors.fill)
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 2);
      }
    });

    nodeEl
      .append('text')
      .text((d) => {
        const label = locale === 'zh' ? d.labelZh : d.label;
        const maxLen = d.group === 'project' ? 12 : 10;
        return label.length > maxLen ? label.slice(0, maxLen) + '…' : label;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', (d) => (d.level === 1 ? '9px' : d.group === 'project' ? '8px' : '8px'))
      .attr('font-weight', 'bold')
      .attr('fill', (d) => GROUP_COLORS[d.group].text)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    nodeEl
      .on('mouseenter', function (event, d) {
        const svgRect = svgRef.current!.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        onNodeHover(
          d,
          event.clientX - containerRect.left,
          event.clientY - containerRect.top
        );
        d3.select(this)
          .select('circle, rect, polygon')
          .transition()
          .duration(150)
          .attr('stroke-width', 3.5)
          .attr('stroke', '#F5F0E8');
      })
      .on('mouseleave', function () {
        onNodeHover(null, 0, 0);
        d3.select(this)
          .select('circle, rect, polygon')
          .transition()
          .duration(150)
          .attr('stroke-width', 2)
          .attr('stroke', '#1A1A1A');
      })
      .on('click', (_, d) => {
        onNodeClick(d);
      });

    simulation.on('tick', () => {
      linkEl.attr('d', (d) => {
        const src = d.source as SimNode;
        const tgt = d.target as SimNode;
        const dx = tgt.x! - src.x!;
        const dy = tgt.y! - src.y!;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const srcR = (NODE_RADIUS[src.level] ?? 18) + 2;
        const tgtR = (NODE_RADIUS[tgt.level] ?? 18) + 8;
        const x1 = src.x! + (dx / dist) * srcR;
        const y1 = src.y! + (dy / dist) * srcR;
        const x2 = tgt.x! - (dx / dist) * tgtR;
        const y2 = tgt.y! - (dy / dist) * tgtR;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - dist * 0.05;
        return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
      });

      nodeEl.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, locale]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGGElement, SimNode>('.node').each(function (d) {
      d3.select(this).attr('opacity', getNodeOpacity(d));
    });

    svg.selectAll<SVGPathElement, SimLink>('path').attr('opacity', (d) => getLinkOpacity(d));
  }, [activeGroup, selectedNode, getNodeOpacity, getLinkOpacity]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
