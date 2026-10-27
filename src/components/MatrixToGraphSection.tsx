import React from 'react';
import type { Vertex, CanvasTool, PredefinedGraph } from '../types/graph';
import { PREDEFINED_GRAPHS } from '../utils/examples';
import { MatrixTab } from './MatrixTab';
import { GraphCanvas } from './GraphCanvas';
import { ArrowDown, Sparkles } from 'lucide-react';

interface MatrixToGraphSectionProps {
  vertices: Vertex[];
  matrix: number[][];
  chromaticNumber: number;
  activeTool: CanvasTool;
  setActiveTool: (tool: CanvasTool) => void;
  onUpdateVertexPos: (id: number, x: number, y: number) => void;
  onAddVertex: (x: number, y: number) => void;
  onToggleEdge: (uIdx: number, vIdx: number) => void;
  onDeleteVertex: (id: number) => void;
  onApplyLayout: (type: 'circular' | 'grid' | 'random') => void;
  onToggleCell: (row: number, col: number) => void;
  onSetMatrix: (newMatrix: number[][]) => void;
  onAddVertexSimple: () => void;
  onRemoveLastVertex: () => void;
  onSelectExample: (graph: PredefinedGraph) => void;
}

export const MatrixToGraphSection: React.FC<MatrixToGraphSectionProps> = ({
  vertices,
  matrix,
  chromaticNumber,
  activeTool,
  setActiveTool,
  onUpdateVertexPos,
  onAddVertex,
  onToggleEdge,
  onDeleteVertex,
  onApplyLayout,
  onToggleCell,
  onSetMatrix,
  onAddVertexSimple,
  onRemoveLastVertex,
  onSelectExample,
}) => {
  return (
    <div className="space-y-4">
      {/* Step 1: Matrix Input Header (Minimalist) */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700">
              Paso 1: Define tu Matriz
            </span>
            <h2 className="text-sm font-bold text-zinc-100 mt-1.5">
              Constructor: De Matriz de Adyacencia a Grafo
            </h2>
            <p className="text-[11px] text-zinc-400">
              Modifica los valores 0 y 1 o escribe tu matriz en texto. El grafo se proyecta al instante.
            </p>
          </div>
        </div>

        {/* Quick Pre-created Graphs Bar (Direct 1-touch selector) */}
        <div className="pt-2 border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-semibold text-zinc-400 shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>Grafos Pre-creados:</span>
          </span>
          {PREDEFINED_GRAPHS.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelectExample(ex)}
              className="text-[10px] font-medium px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 rounded-lg border border-zinc-700 shrink-0 transition"
            >
              {ex.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* The Matrix Editor */}
      <MatrixTab
        vertices={vertices}
        matrix={matrix}
        onToggleCell={onToggleCell}
        onSetMatrix={onSetMatrix}
        onAddVertexSimple={onAddVertexSimple}
        onRemoveLastVertex={onRemoveLastVertex}
      />

      {/* Transition indicator */}
      <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-zinc-400">
        <div className="h-[1px] flex-1 bg-zinc-800" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-700 shadow-sm text-zinc-300">
          <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          <span>Grafo Resultante Proyectado</span>
        </div>
        <div className="h-[1px] flex-1 bg-zinc-800" />
      </div>

      {/* Step 2: Canvas Projected Graph */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-zinc-200">
              Visualización y Coloración de Welsh-Powell
            </h3>
          </div>
          <span className="text-[11px] font-bold text-zinc-100 font-mono">
            χ(G) = {chromaticNumber}
          </span>
        </div>

        <GraphCanvas
          vertices={vertices}
          matrix={matrix}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onUpdateVertexPos={onUpdateVertexPos}
          onAddVertex={onAddVertex}
          onToggleEdge={onToggleEdge}
          onDeleteVertex={onDeleteVertex}
          onApplyLayout={onApplyLayout}
        />
      </div>
    </div>
  );
};
