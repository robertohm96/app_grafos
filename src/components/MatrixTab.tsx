import React, { useState, useEffect } from 'react';
import type { Vertex } from '../types/graph';
import { matrixToString, parseMatrixText } from '../utils/graphAlgorithms';
import { Copy, Check, Sparkles, Plus, Minus, AlertCircle } from 'lucide-react';

interface MatrixTabProps {
  vertices: Vertex[];
  matrix: number[][];
  onToggleCell: (row: number, col: number) => void;
  onSetMatrix: (newMatrix: number[][]) => void;
  onAddVertexSimple: () => void;
  onRemoveLastVertex: () => void;
}

export const MatrixTab: React.FC<MatrixTabProps> = ({
  vertices,
  matrix,
  onToggleCell,
  onSetMatrix,
  onAddVertexSimple,
  onRemoveLastVertex,
}) => {
  const [textInput, setTextInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Sync text input whenever matrix changes
  useEffect(() => {
    setTextInput(matrixToString(matrix));
    setParseError(null);
  }, [matrix]);

  const handleApplyText = () => {
    const { matrix: parsed, error } = parseMatrixText(textInput);
    if (error) {
      setParseError(error);
    } else {
      setParseError(null);
      onSetMatrix(parsed);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearEdges = () => {
    const n = vertices.length;
    const cleared = Array.from({ length: n }, () => Array(n).fill(0));
    onSetMatrix(cleared);
  };

  const handleInvertGraph = () => {
    const n = vertices.length;
    const inverted: number[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        if (r === c) return 0;
        return matrix[r][c] === 1 ? 0 : 1;
      })
    );
    onSetMatrix(inverted);
  };

  const n = vertices.length;

  return (
    <div className="space-y-4">
      {/* Dimension & Quick Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dimensión:
          </span>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md font-mono text-xs font-bold">
            {n} × {n}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onAddVertexSimple}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fila/Columna</span>
          </button>
          <button
            onClick={onRemoveLastVertex}
            disabled={n <= 1}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <Minus className="w-3.5 h-3.5 text-rose-400" />
            <span>Quitar</span>
          </button>
        </div>
      </div>

      {/* Interactive 0/1 Matrix Grid */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Cuadrícula de Adyacencia Interactiva</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Toca cualquier celda para alternar entre 0 (sin arista) y 1 (conectados).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearEdges}
              className="text-[11px] px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
              title="Quitar todas las conexiones"
            >
              Vaciar
            </button>
            <button
              onClick={handleInvertGraph}
              className="text-[11px] px-2 py-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
              title="Complemento del grafo"
            >
              Complemento
            </button>
          </div>
        </div>

        {n === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No hay vértices. Agrega uno para ver la matriz.
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[11px] text-slate-500 font-mono"></th>
                  {vertices.map((v) => (
                    <th
                      key={`th-${v.id}`}
                      className="p-1 text-[11px] font-semibold text-center min-w-[32px]"
                      style={{ color: v.colorHex || '#94A3B8' }}
                    >
                      {v.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vertices.map((rowVertex, r) => (
                  <tr key={`tr-${rowVertex.id}`}>
                    <td
                      className="p-1 text-[11px] font-semibold text-right pr-2 min-w-[32px]"
                      style={{ color: rowVertex.colorHex || '#94A3B8' }}
                    >
                      {rowVertex.label}
                    </td>
                    {vertices.map((_, c) => {
                      const isDiagonal = r === c;
                      const isConnected = matrix[r]?.[c] === 1;

                      return (
                        <td key={`cell-${r}-${c}`} className="p-0.5 text-center">
                          <button
                            disabled={isDiagonal}
                            onClick={() => onToggleCell(r, c)}
                            className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                              isDiagonal
                                ? 'bg-slate-950/60 text-slate-600 border border-slate-900 cursor-not-allowed opacity-40'
                                : isConnected
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 active:scale-95'
                                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700/80 hover:text-slate-200 active:scale-95'
                            }`}
                            title={
                              isDiagonal
                                ? 'Diagonal principal (sin bucles simples)'
                                : `Arista ${rowVertex.label} - ${vertices[c].label}`
                            }
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

      {/* Text Area (MiniWebTool-like Quick Paste) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Entrada de Texto Rápida (MiniWebTool)
            </h3>
            <p className="text-[11px] text-slate-400">
              Pega o escribe tu matriz fila por fila separada por espacios o comas.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={Math.max(4, Math.min(8, n))}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ejemplo:&#10;0 1 1 0&#10;1 0 1 1&#10;1 1 0 0&#10;0 1 0 0"
          className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-y transition"
        />

        {parseError && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}

        <button
          onClick={handleApplyText}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Actualizar Grafo desde Texto</span>
        </button>
      </div>
    </div>
  );
};
