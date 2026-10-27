import React from 'react';
import type { Vertex, CanvasTool } from '../types/graph';
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
}) => {
  return (
    <div className="space-y-4">
      {/* Step 1: Matrix Input Header */}
      <div className="p-4 bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 rounded-3xl border border-blue-500/30 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-mono font-bold text-base shrink-0">
            [M]
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                Paso 1: Define tu Matriz
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-1">
              Constructor: De Matriz de Adyacencia a Grafo
            </h2>
            <p className="text-[11px] text-slate-400">
              Modifica los valores 0 y 1 o escribe tu matriz en texto. El grafo y los colores se generarán en tiempo real.
            </p>
          </div>
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
      <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-blue-400">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-950/80 rounded-full border border-blue-500/40 shadow-md">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Grafo Resultante Proyectado</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* Step 2: Canvas Projected Graph */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200">
              Visualización y Coloración de Welsh-Powell
            </h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-400 font-mono">
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
