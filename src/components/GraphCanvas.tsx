import React, { useRef, useState, useEffect } from 'react';
import type { Vertex, CanvasTool } from '../types/graph';
import {
  Move,
  PlusCircle,
  Link2,
  Trash2,
  CircleDot,
  Grid,
  Shuffle,
} from 'lucide-react';

interface GraphCanvasProps {
  vertices: Vertex[];
  matrix: number[][];
  activeTool: CanvasTool;
  setActiveTool: (tool: CanvasTool) => void;
  onUpdateVertexPos: (id: number, x: number, y: number) => void;
  onAddVertex: (x: number, y: number) => void;
  onToggleEdge: (uIdx: number, vIdx: number) => void;
  onDeleteVertex: (id: number) => void;
  onApplyLayout: (type: 'circular' | 'grid' | 'random') => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  vertices,
  matrix,
  activeTool,
  setActiveTool,
  onUpdateVertexPos,
  onAddVertex,
  onToggleEdge,
  onDeleteVertex,
  onApplyLayout,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingVertexId, setDraggingVertexId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [connectSourceIdx, setConnectSourceIdx] = useState<number | null>(null);
  const [hoveredVertexId, setHoveredVertexId] = useState<number | null>(null);
  const [viewBoxWidth, setViewBoxWidth] = useState<number>(380);
  const [viewBoxHeight, setViewBoxHeight] = useState<number>(320);

  // Resize listener to adjust coordinate bounds
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setViewBoxWidth(Math.round(rect.width));
          setViewBoxHeight(Math.round(rect.height));
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert client pointer coordinates to SVG coordinate system
  const getSvgCoordinates = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    return {
      x: Math.max(25, Math.min(viewBoxWidth - 25, x)),
      y: Math.max(25, Math.min(viewBoxHeight - 25, y)),
    };
  };

  // Pointer Down on Canvas background
  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activeTool === 'add') {
      const { x, y } = getSvgCoordinates(e);
      onAddVertex(x, y);
    } else if (activeTool === 'connect') {
      setConnectSourceIdx(null);
    }
  };

  // Pointer Down on a Vertex
  const handleVertexPointerDown = (e: React.PointerEvent, vertex: Vertex, index: number) => {
    e.stopPropagation();

    if (activeTool === 'move') {
      const { x, y } = getSvgCoordinates(e as any);
      setDraggingVertexId(vertex.id);
      setDragOffset({ x: vertex.x - x, y: vertex.y - y });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } else if (activeTool === 'connect') {
      if (connectSourceIdx === null) {
        setConnectSourceIdx(index);
      } else if (connectSourceIdx === index) {
        setConnectSourceIdx(null);
      } else {
        onToggleEdge(connectSourceIdx, index);
        setConnectSourceIdx(null);
      }
    } else if (activeTool === 'delete') {
      onDeleteVertex(vertex.id);
      if (connectSourceIdx === index) {
        setConnectSourceIdx(null);
      }
    }
  };

  // Pointer Move (dragging)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingVertexId !== null && activeTool === 'move') {
      const { x, y } = getSvgCoordinates(e);
      const newX = Math.max(25, Math.min(viewBoxWidth - 25, x + dragOffset.x));
      const newY = Math.max(25, Math.min(viewBoxHeight - 25, y + dragOffset.y));
      onUpdateVertexPos(draggingVertexId, newX, newY);
    }
  };

  // Pointer Up
  const handlePointerUp = () => {
    if (draggingVertexId !== null) {
      setDraggingVertexId(null);
    }
  };

  // Extract edges from adjacency matrix
  const edges: { u: number; v: number; uIdx: number; vIdx: number }[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < (matrix[i]?.length || 0); j++) {
      if (matrix[i][j] === 1 && vertices[i] && vertices[j]) {
        edges.push({
          u: vertices[i].id,
          v: vertices[j].id,
          uIdx: i,
          vIdx: j,
        });
      }
    }
  }

  return (
    <div className="relative flex flex-col w-full bg-slate-950/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Primary Tool Selector: Generous 4-segment full width bar for mobile fingers */}
      <div className="p-2 bg-slate-900 border-b border-slate-800">
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
          {/* Mover */}
          <button
            onClick={() => {
              setActiveTool('move');
              setConnectSourceIdx(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg font-bold text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'move'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Move className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight font-semibold">Mover</span>
          </button>

          {/* + Nodo */}
          <button
            onClick={() => {
              setActiveTool('add');
              setConnectSourceIdx(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg font-bold text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'add'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight font-semibold">+ Nodo</span>
          </button>

          {/* Conectar */}
          <button
            onClick={() => {
              setActiveTool('connect');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg font-bold text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'connect'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Link2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight font-semibold">Conectar</span>
          </button>

          {/* Borrar */}
          <button
            onClick={() => {
              setActiveTool('delete');
              setConnectSourceIdx(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg font-bold text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'delete'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 ring-1 ring-rose-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight font-semibold">Borrar</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Instructions & Layout quick buttons with comfortable touch size */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-slate-800 text-xs gap-2">
        {/* Helper Hint */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium min-w-0">
          {activeTool === 'move' && (
            <span className="text-blue-300 truncate">
              💡 Arrastra cualquier nodo para reubicarlo
            </span>
          )}
          {activeTool === 'add' && (
            <span className="text-emerald-300 truncate font-semibold">
              👉 Toca cualquier punto del lienzo para ubicar un vértice
            </span>
          )}
          {activeTool === 'connect' && (
            <span className="text-purple-300 truncate font-semibold animate-pulse">
              {connectSourceIdx === null
                ? '🔗 Toca el 1er vértice a conectar'
                : `🔗 Toca otro vértice para unirlo con ${vertices[connectSourceIdx]?.label}`}
            </span>
          )}
          {activeTool === 'delete' && (
            <span className="text-rose-300 truncate font-semibold">
              🗑️ Toca un vértice o arista para eliminarlo
            </span>
          )}
        </div>

        {/* Layout quick action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onApplyLayout('circular')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-800 active:scale-95 rounded-lg border border-slate-700/80 transition min-h-[34px]"
            title="Acomodo Circular"
          >
            <CircleDot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-semibold hidden xs:inline">Circular</span>
          </button>
          <button
            onClick={() => onApplyLayout('grid')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-800 active:scale-95 rounded-lg border border-slate-700/80 transition min-h-[34px]"
            title="Acomodo en Cuadrícula"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-semibold hidden xs:inline">Cuadrícula</span>
          </button>
          <button
            onClick={() => onApplyLayout('random')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-800 active:scale-95 rounded-lg border border-slate-700/80 transition min-h-[34px]"
            title="Acomodo Aleatorio"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-semibold hidden xs:inline">Azar</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-[290px] sm:h-[330px] select-none touch-none overflow-hidden cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full bg-[#070b13]"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            {/* Fine Grid Pattern */}
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#17223b" strokeWidth="0.8" />
            </pattern>
            {/* Major Grid Pattern */}
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#233559" strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const u = vertices[edge.uIdx];
              const v = vertices[edge.vIdx];
              if (!u || !v) return null;

              const isHighlighted =
                connectSourceIdx === edge.uIdx ||
                connectSourceIdx === edge.vIdx ||
                hoveredVertexId === u.id ||
                hoveredVertexId === v.id;

              return (
                <g key={`edge-${edge.u}-${edge.v}`}>
                  {/* Invisible thicker stroke for easier touch interaction in delete mode */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="transparent"
                    strokeWidth="28"
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (activeTool === 'delete') {
                        e.stopPropagation();
                        onToggleEdge(edge.uIdx, edge.vIdx);
                      }
                    }}
                  />
                  {/* Rendered Edge Line */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={isHighlighted ? '#60A5FA' : '#475569'}
                    strokeWidth={isHighlighted ? '2.5' : '1.8'}
                    className="transition-colors duration-150"
                  />
                </g>
              );
            })}
          </g>

          {/* Connecting preview animated ring when source node is selected */}
          {activeTool === 'connect' && connectSourceIdx !== null && vertices[connectSourceIdx] && (
            <circle
              cx={vertices[connectSourceIdx].x}
              cy={vertices[connectSourceIdx].y}
              r="28"
              fill="none"
              stroke="#C084FC"
              strokeWidth="3"
              strokeDasharray="5 5"
              className="animate-spin"
              style={{ transformOrigin: `${vertices[connectSourceIdx].x}px ${vertices[connectSourceIdx].y}px` }}
            />
          )}

          {/* Vertices */}
          <g className="vertices-layer">
            {vertices.map((vertex, index) => {
              const isSelectedForConnect = connectSourceIdx === index;
              const isDragging = draggingVertexId === vertex.id;
              const isHovered = hoveredVertexId === vertex.id;
              const colorHex = vertex.colorHex || '#3B82F6';

              return (
                <g
                  key={vertex.id}
                  className="cursor-pointer transition-transform select-none"
                  onPointerDown={(e) => handleVertexPointerDown(e, vertex, index)}
                  onPointerEnter={() => setHoveredVertexId(vertex.id)}
                  onPointerLeave={() => setHoveredVertexId(null)}
                >
                  {/* Invisible generous hit target for thick mobile fingers */}
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="28"
                    fill="transparent"
                  />

                  {/* Outer selection / glow ring */}
                  {(isSelectedForConnect || isDragging || isHovered) && (
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="23"
                      fill="none"
                      stroke={isSelectedForConnect ? '#C084FC' : colorHex}
                      strokeWidth="2.5"
                      opacity="0.85"
                    />
                  )}

                  {/* Main Node Circle with Welsh-Powell Color */}
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="17"
                    fill={colorHex}
                    stroke="#0B0F19"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))"
                  />

                  {/* Vertex Label */}
                  <text
                    x={vertex.x}
                    y={vertex.y + 4.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    className="pointer-events-none select-none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {vertex.label}
                  </text>

                  {/* Floating Badge: Degree & Coords */}
                  <g
                    transform={`translate(${vertex.x}, ${vertex.y - 23})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="-27"
                      y="-12"
                      width="54"
                      height="14"
                      rx="7"
                      fill="#0F172A"
                      stroke="#334155"
                      strokeWidth="0.8"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="-2.5"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8.5"
                      fontWeight="700"
                      className="font-mono"
                    >
                      g={vertex.degree} ({vertex.x},{vertex.y})
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Empty state hint */}
        {vertices.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
            <PlusCircle className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
            <p className="text-sm font-semibold text-slate-300">Lienzo vacío</p>
            <p className="text-xs text-slate-500">
              Selecciona <span className="text-emerald-400 font-bold">+ Nodo</span> arriba y toca para dibujar
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sub-bar: Vertex / Edge stats */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Vértices: <strong className="text-slate-100 font-mono text-xs">{vertices.length}</strong>
          </span>
          <span>
            Aristas: <strong className="text-slate-100 font-mono text-xs">{edges.length}</strong>
          </span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Arrastra para mover • Plano ({viewBoxWidth}x{viewBoxHeight})
        </div>
      </div>
    </div>
  );
};
