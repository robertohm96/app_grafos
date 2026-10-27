import React, { useState } from 'react';
import type { Vertex, CanvasTool } from '../types/graph';
import { GraphCanvas } from './GraphCanvas';
import { matrixToString } from '../utils/graphAlgorithms';
import {
  Paintbrush,
  Copy,
  Check,
  Grid3X3,
  ArrowDown,
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
      {/* Step 1: Visual Canvas Header */}
      <div className="p-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 rounded-3xl border border-purple-500/30 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
            <Paintbrush className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 bg-purple-500/10 rounded-md border border-purple-500/20">
                Paso 1: Dibuja tu Grafo
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-1">
              Estudio Visual: De Grafo a Matriz de Adyacencia
            </h2>
            <p className="text-[11px] text-slate-400">
              Toca para añadir nodos, conecta aristas o arrastra. La matriz y los grados se calculan al instante.
            </p>
          </div>
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
      <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-purple-400">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-950/80 rounded-full border border-purple-500/40 shadow-md">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Matriz de Adyacencia Viva (Generada)</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* Step 2: The Generated Live Mirror Matrix */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Matriz de Adyacencia Calculada
              </h3>
              <p className="text-[10px] text-slate-400">
                Sincronizada automáticamente con cada nodo y arista del lienzo
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyMatrix}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 active:scale-95 rounded-xl border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-bold">Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Copiar Matriz</span>
              </>
            )}
          </button>
        </div>

        {/* Real-time Graph Metrics */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
          <div>
            <div className="text-[10px] text-slate-400">Vértices |V|</div>
            <div className="text-sm font-bold text-slate-100 font-mono">{n}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Aristas |E|</div>
            <div className="text-sm font-bold text-slate-100 font-mono">{edgeCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Densidad</div>
            <div className="text-sm font-bold text-indigo-400 font-mono">{density}%</div>
          </div>
        </div>

        {/* Matrix Grid Table */}
        {n === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            Dibuja al menos un vértice arriba para generar la matriz.
          </div>
        ) : (
          <div className="overflow-x-auto pb-1">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[11px] text-slate-500 font-mono"></th>
                  {vertices.map((v) => (
                    <th
                      key={`th-live-${v.id}`}
                      className="p-1 text-[11px] font-bold text-center min-w-[34px]"
                      style={{ color: v.colorHex || '#94A3B8' }}
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
                      className="p-1 text-[11px] font-bold text-right pr-2 min-w-[34px]"
                      style={{ color: rowV.colorHex || '#94A3B8' }}
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
                                ? 'bg-slate-950/60 text-slate-700 cursor-not-allowed opacity-30'
                                : isConnected
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
