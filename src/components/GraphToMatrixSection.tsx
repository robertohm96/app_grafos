import React, { useState } from 'react';
import type { Vertex, CanvasTool, PredefinedGraph } from '../types/graph';
import { PREDEFINED_GRAPHS } from '../utils/examples';
import { GraphCanvas } from './GraphCanvas';
import { matrixToString } from '../utils/graphAlgorithms';
import {
  Copy,
  Check,
  Grid3X3,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface GraphToMatrixSectionProps {
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
  onOpenSaveModal: () => void;
  onSelectExample: (graph: PredefinedGraph) => void;
}

export const GraphToMatrixSection: React.FC<GraphToMatrixSectionProps> = ({
  vertices,
  matrix,
  chromaticNumber: _chromaticNumber,
  activeTool,
  setActiveTool,
  onUpdateVertexPos,
  onAddVertex,
  onToggleEdge,
  onDeleteVertex,
  onApplyLayout,
  onSelectExample,
}) => {
  const [copied, setCopied] = useState(false);

  const edgeCount =
    matrix.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0) / 2;
  const n = vertices.length;
  const maxPossibleEdges = n > 1 ? (n * (n - 1)) / 2 : 1;
  const density = n > 1 ? ((edgeCount / maxPossibleEdges) * 100).toFixed(1) : '0';

  const handleCopyMatrix = () => {
    navigator.clipboard.writeText(matrixToString(matrix));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Visual Canvas Header (Minimalist) */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700">
              Paso 1: Dibuja tu Grafo
            </span>
            <h2 className="text-sm font-bold text-zinc-100 mt-1.5">
              Estudio Visual: De Grafo a Matriz de Adyacencia
            </h2>
            <p className="text-[11px] text-zinc-400">
              Toca para añadir nodos, conecta aristas o arrastra. La matriz se construye en tiempo real debajo.
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

      {/* The Interactive Graphical Canvas */}
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

      {/* Transition indicator */}
      <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-zinc-400">
        <div className="h-[1px] flex-1 bg-zinc-800" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-700 shadow-sm text-zinc-300">
          <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          <span>Matriz de Adyacencia Viva (Generada)</span>
        </div>
        <div className="h-[1px] flex-1 bg-zinc-800" />
      </div>

      {/* Step 2: The Generated Live Mirror Matrix */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-zinc-400" />
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Matriz de Adyacencia Calculada
              </h3>
              <p className="text-[10px] text-zinc-400">
                Sincronizada automáticamente con cada nodo y arista del lienzo
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyMatrix}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 rounded-lg border border-zinc-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-bold">Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px]">Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Real-time Graph Metrics (Minimalist) */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
          <div>
            <div className="text-[10px] text-zinc-400">Vértices |V|</div>
            <div className="text-sm font-bold text-zinc-100 font-mono">{n}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">Aristas |E|</div>
            <div className="text-sm font-bold text-zinc-100 font-mono">{edgeCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">Densidad</div>
            <div className="text-sm font-bold text-zinc-100 font-mono">{density}%</div>
          </div>
        </div>

        {/* Matrix Grid Table */}
        {n === 0 ? (
          <div className="py-6 text-center text-zinc-500 text-xs">
            Dibuja al menos un vértice arriba para generar la matriz.
          </div>
        ) : (
          <div className="overflow-x-auto pb-1">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[11px] text-zinc-500 font-mono"></th>
                  {vertices.map((v) => (
                    <th
                      key={`th-live-${v.id}`}
                      className="p-1 text-[11px] font-bold text-center min-w-[34px] text-zinc-300"
                    >
                      {v.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vertices.map((rowV, r) => (
                  <tr key={`tr-live-${rowV.id}`}>
                    <td
                      className="p-1 text-[11px] font-bold text-right pr-2 min-w-[34px] text-zinc-400"
                    >
                      {rowV.label}
                    </td>
                    {vertices.map((_, c) => {
                      const isDiagonal = r === c;
                      const isConnected = matrix[r]?.[c] === 1;

                      return (
                        <td key={`cell-live-${r}-${c}`} className="p-0.5 text-center">
                          <button
                            disabled={isDiagonal}
                            onClick={() => onToggleEdge(r, c)}
                            className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                              isDiagonal
                                ? 'bg-zinc-950 text-zinc-700 cursor-not-allowed opacity-20'
                                : isConnected
                                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {matrix[r]?.[c] ?? 0}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
