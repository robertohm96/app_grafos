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

  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activeTool === 'add') {
      const { x, y } = getSvgCoordinates(e);
      onAddVertex(x, y);
    } else if (activeTool === 'connect') {
      setConnectSourceIdx(null);
    }
  };

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

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingVertexId !== null && activeTool === 'move') {
      const { x, y } = getSvgCoordinates(e);
      const newX = Math.max(25, Math.min(viewBoxWidth - 25, x + dragOffset.x));
      const newY = Math.max(25, Math.min(viewBoxHeight - 25, y + dragOffset.y));
      onUpdateVertexPos(draggingVertexId, newX, newY);
    }
  };

  const handlePointerUp = () => {
    if (draggingVertexId !== null) {
      setDraggingVertexId(null);
    }
  };

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
    <div className="relative flex flex-col w-full bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md overflow-hidden">
      {/* Primary Tool Selector: Minimalist High-Contrast Bar */}
      <div className="p-2 bg-zinc-900 border-b border-zinc-800">
        <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          {/* Mover */}
          <button
            onClick={() => {
              setActiveTool('move');
              setConnectSourceIdx(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'move'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'add'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'connect'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs transition-all active:scale-95 min-h-[46px] ${
              activeTool === 'delete'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight font-semibold">Borrar</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Status hint & Layout buttons */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium min-w-0">
          {activeTool === 'move' && (
            <span className="text-zinc-300 truncate">
              Arrastra cualquier nodo para reubicarlo
            </span>
          )}
          {activeTool === 'add' && (
            <span className="text-zinc-200 truncate font-semibold">
              Toca el lienzo para agregar un vértice
            </span>
          )}
          {activeTool === 'connect' && (
            <span className="text-zinc-200 truncate font-semibold">
              {connectSourceIdx === null
                ? 'Toca el 1er vértice a conectar'
                : `Toca otro vértice para unir con ${vertices[connectSourceIdx]?.label}`}
            </span>
          )}
          {activeTool === 'delete' && (
            <span className="text-zinc-300 truncate font-semibold">
              Toca un vértice o arista para eliminar
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onApplyLayout('circular')}
            className="px-2.5 py-1 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-lg border border-zinc-700 transition min-h-[32px] text-[10px] font-medium flex items-center gap-1"
            title="Acomodo Circular"
          >
            <CircleDot className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden xs:inline">Circular</span>
          </button>
          <button
            onClick={() => onApplyLayout('grid')}
            className="px-2.5 py-1 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-lg border border-zinc-700 transition min-h-[32px] text-[10px] font-medium flex items-center gap-1"
            title="Acomodo en Cuadrícula"
          >
            <Grid className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden xs:inline">Cuadrícula</span>
          </button>
          <button
            onClick={() => onApplyLayout('random')}
            className="px-2.5 py-1 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-lg border border-zinc-700 transition min-h-[32px] text-[10px] font-medium flex items-center gap-1"
            title="Acomodo Aleatorio"
          >
            <Shuffle className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden xs:inline">Azar</span>
          </button>
        </div>
      </div>

      {/* Interactive Minimalist SVG Canvas */}
      <div className="relative w-full h-[290px] sm:h-[330px] select-none touch-none overflow-hidden cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full bg-[#0a0a0c]"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16161a" strokeWidth="0.8" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#222228" strokeWidth="1" />
            </pattern>
          </defs>

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
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={isHighlighted ? '#FFFFFF' : '#4B5563'}
                    strokeWidth={isHighlighted ? '2' : '1.5'}
                    className="transition-colors duration-150"
                  />
                </g>
              );
            })}
          </g>

          {/* Connecting preview animated ring */}
          {activeTool === 'connect' && connectSourceIdx !== null && vertices[connectSourceIdx] && (
            <circle
              cx={vertices[connectSourceIdx].x}
              cy={vertices[connectSourceIdx].y}
              r="28"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Vertices */}
          <g className="vertices-layer">
            {vertices.map((vertex, index) => {
              const isSelectedForConnect = connectSourceIdx === index;
              const isDragging = draggingVertexId === vertex.id;
              const isHovered = hoveredVertexId === vertex.id;
              const colorHex = vertex.colorHex || '#2563EB';

              return (
                <g
                  key={vertex.id}
                  className="cursor-pointer transition-transform select-none"
                  onPointerDown={(e) => handleVertexPointerDown(e, vertex, index)}
                  onPointerEnter={() => setHoveredVertexId(vertex.id)}
                  onPointerLeave={() => setHoveredVertexId(null)}
                >
                  {/* Invisible hit target for fingers */}
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="28"
                    fill="transparent"
                  />

                  {/* Outer selection ring */}
                  {(isSelectedForConnect || isDragging || isHovered) && (
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="23"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  {/* Main Node Circle with Minimalist Color */}
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="17"
                    fill={colorHex}
                    stroke="#09090B"
                    strokeWidth="2.5"
                  />

                  {/* Vertex Label */}
                  <text
                    x={vertex.x}
                    y={vertex.y + 4.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11.5"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    className="pointer-events-none select-none"
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
                      rx="6"
                      fill="#18181B"
                      stroke="#27272A"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y="-2.5"
                      textAnchor="middle"
                      fill="#A1A1AA"
                      fontSize="8.5"
                      fontWeight="600"
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

        {vertices.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-zinc-500">
            <PlusCircle className="w-8 h-8 mb-2 opacity-30 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-300">Lienzo vacío</p>
            <p className="text-xs text-zinc-500">
              Selecciona <span className="text-zinc-200 font-bold">+ Nodo</span> arriba y toca para dibujar
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sub-bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-t border-zinc-800 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span>
            Vértices: <strong className="text-zinc-100 font-mono text-xs">{vertices.length}</strong>
          </span>
          <span>
            Aristas: <strong className="text-zinc-100 font-mono text-xs">{edges.length}</strong>
          </span>
        </div>
        <div className="text-zinc-500 text-[10px]">
          Arrastra para mover • Coordenadas ({viewBoxWidth}x{viewBoxHeight})
        </div>
      </div>
    </div>
  );
};
