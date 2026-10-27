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
  Info,
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
      // Deselect if clicking on empty space
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
        // Select first node
        setConnectSourceIdx(index);
      } else if (connectSourceIdx === index) {
        // Deselect itself
        setConnectSourceIdx(null);
      } else {
        // Connect/disconnect
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
    <div className="relative flex flex-col w-full bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 gap-2">
        {/* Tool selector */}
        <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => {
              setActiveTool('move');
              setConnectSourceIdx(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'move'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mover o arrastrar nodos"
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mover</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('add');
              setConnectSourceIdx(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'add'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tocar lienzo para agregar nodo"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Nodo</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('connect');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'connect'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tocar dos nodos para conectar o desconectar"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Conectar</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('delete');
              setConnectSourceIdx(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'delete'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tocar nodo para eliminarlo"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Borrar</span>
          </button>
        </div>

        {/* Layout quick action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onApplyLayout('circular')}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Acomodo Circular"
          >
            <CircleDot className="w-4 h-4" />
          </button>
          <button
            onClick={() => onApplyLayout('grid')}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Acomodo en Cuadrícula"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onApplyLayout('random')}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Acomodo Aleatorio"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helpful Mode Notification Pill */}
      {activeTool === 'connect' && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-purple-950/90 border border-purple-500/50 text-purple-200 text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm animate-pulse">
            <Info className="w-3 h-3 text-purple-400" />
            {connectSourceIdx === null
              ? 'Toca el primer vértice'
              : `Toca otro vértice para unirlo con ${vertices[connectSourceIdx]?.label}`}
          </div>
        </div>
      )}

      {activeTool === 'add' && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <Info className="w-3 h-3 text-emerald-400" />
            Toca cualquier punto del lienzo para ubicar un vértice
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-[280px] sm:h-[320px] select-none touch-none overflow-hidden cursor-crosshair">
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
            {/* Glow Filter for Active Elements */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
                    strokeWidth="24"
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
                    strokeDasharray={isHighlighted ? 'none' : 'none'}
                    className="transition-colors duration-150"
                  />
                </g>
              );
            })}
          </g>

          {/* Connecting preview line when source node is selected */}
          {activeTool === 'connect' && connectSourceIdx !== null && vertices[connectSourceIdx] && (
            <circle
              cx={vertices[connectSourceIdx].x}
              cy={vertices[connectSourceIdx].y}
              r="26"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeDasharray="4 4"
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
                  {/* Outer selection / glow ring */}
                  {(isSelectedForConnect || isDragging || isHovered) && (
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="22"
                      fill="none"
                      stroke={isSelectedForConnect ? '#C084FC' : colorHex}
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  {/* Main Node Circle with Welsh-Powell Color */}
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="16"
                    fill={colorHex}
                    stroke="#0B0F19"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"
                  />

                  {/* Vertex Label */}
                  <text
                    x={vertex.x}
                    y={vertex.y + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    className="pointer-events-none select-none"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {vertex.label}
                  </text>

                  {/* Floating Badge: Degree & Coords */}
                  <g
                    transform={`translate(${vertex.x}, ${vertex.y - 22})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="-26"
                      y="-12"
                      width="52"
                      height="13"
                      rx="6"
                      fill="#0F172A"
                      stroke="#334155"
                      strokeWidth="0.8"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8"
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

        {/* Empty state hint */}
        {vertices.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
            <PlusCircle className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
            <p className="text-sm font-medium">Lienzo vacío</p>
            <p className="text-xs text-slate-600">
              Selecciona <span className="text-emerald-400 font-semibold">+ Nodo</span> y toca para dibujar
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sub-bar: Vertex / Edge stats */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Vértices: <strong className="text-slate-200">{vertices.length}</strong>
          </span>
          <span>
            Aristas: <strong className="text-slate-200">{edges.length}</strong>
          </span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Arrastra para mover • Coordenadas ({viewBoxWidth}x{viewBoxHeight})
        </div>
      </div>
    </div>
  );
};
