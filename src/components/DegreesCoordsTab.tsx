import React, { useState } from 'react';
import type { Vertex } from '../types/graph';
import { solveHavelHakimi } from '../utils/graphAlgorithms';
import type { HavelHakimiResult } from '../utils/graphAlgorithms';
import {
  CircleDot,
  Grid,
  Shuffle,
  Wand2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DegreesCoordsTabProps {
  vertices: Vertex[];
  matrix: number[][];
  onUpdateVertexPos: (id: number, x: number, y: number) => void;
  onToggleEdge: (uIdx: number, vIdx: number) => void;
  onApplyLayout: (type: 'circular' | 'grid' | 'random') => void;
  onLoadGeneratedGraph: (newMatrix: number[][], count: number) => void;
}

export const DegreesCoordsTab: React.FC<DegreesCoordsTabProps> = ({
  vertices,
  matrix,
  onUpdateVertexPos,
  onToggleEdge,
  onApplyLayout,
  onLoadGeneratedGraph,
}) => {
  const [degreeSeqInput, setDegreeSeqInput] = useState('3, 3, 2, 2, 2');
  const [hhResult, setHhResult] = useState<HavelHakimiResult | null>(null);
  const [showHhSteps, setShowHhSteps] = useState(false);

  const handleTestHavelHakimi = () => {
    const rawTokens = degreeSeqInput
      .split(/[\s,;]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const degrees = rawTokens.map((t) => parseInt(t, 10));
    if (degrees.some((d) => isNaN(d))) {
      setHhResult({
        isGraphic: false,
        message: 'Por favor ingresa números válidos separados por comas o espacios.',
        steps: ['Formato inválido.'],
      });
      return;
    }

    const res = solveHavelHakimi(degrees);
    setHhResult(res);
  };

  const handleBuildFromHavelHakimi = () => {
    if (hhResult && hhResult.isGraphic && hhResult.matrix) {
      onLoadGeneratedGraph(hhResult.matrix, hhResult.matrix.length);
    }
  };

  return (
    <div className="space-y-4">
      {/* Auto-layout Preset Bar (Minimalist) */}
      <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300">
            Auto-acomodo de Coordenadas:
          </span>
          <span className="text-[10px] text-zinc-500">Distribución automática</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onApplyLayout('circular')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition"
          >
            <CircleDot className="w-3.5 h-3.5 text-zinc-400" />
            <span>Circular</span>
          </button>
          <button
            onClick={() => onApplyLayout('grid')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition"
          >
            <Grid className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cuadrícula</span>
          </button>
          <button
            onClick={() => onApplyLayout('random')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Aleatorio</span>
          </button>
        </div>
      </div>

      {/* Per-Vertex Coordinates & Degree Connections Editor */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Vértices, Grados y Conexiones Directas
          </h3>
          <p className="text-[11px] text-zinc-400">
            Edita (X, Y) manualmente o toca los chips de vecinos para conectar/desconectar.
          </p>
        </div>

        {vertices.length === 0 ? (
          <div className="py-6 text-center text-zinc-500 text-xs">
            No hay vértices en el grafo.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] custom-scroll-bar pr-1">
            {vertices.map((vertex, uIdx) => {
              return (
                <div
                  key={vertex.id}
                  className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: vertex.colorHex || '#2563EB' }}
                      />
                      <span className="text-xs font-bold text-zinc-100">{vertex.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono font-semibold border border-zinc-700">
                        Grado {vertex.degree}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 px-1.5 py-0.5">
                        <span className="text-[10px] text-zinc-500 font-mono mr-1">X:</span>
                        <input
                          type="number"
                          value={vertex.x}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) onUpdateVertexPos(vertex.id, val, vertex.y);
                          }}
                          className="w-12 bg-transparent text-zinc-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 px-1.5 py-0.5">
                        <span className="text-[10px] text-zinc-500 font-mono mr-1">Y:</span>
                        <input
                          type="number"
                          value={vertex.y}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) onUpdateVertexPos(vertex.id, vertex.x, val);
                          }}
                          className="w-12 bg-transparent text-zinc-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Neighbor Toggle Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 mr-1">Vecinos:</span>
                    {vertices.map((other, vIdx) => {
                      if (uIdx === vIdx) return null;
                      const isConnected = matrix[uIdx]?.[vIdx] === 1;

                      return (
                        <button
                          key={`chip-${vertex.id}-${other.id}`}
                          onClick={() => onToggleEdge(uIdx, vIdx)}
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                            isConnected
                              ? 'bg-zinc-200 text-zinc-950 font-bold'
                              : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                          }`}
                          title={`Alternar conexión con ${other.label}`}
                        >
                          {other.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Degree Sequence Generator (Havel-Hakimi) */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Generador por Secuencia de Grados
              </h3>
              <p className="text-[10px] text-zinc-400">
                Algoritmo y Teorema de Havel-Hakimi
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Ingresa los grados deseados separados por comas. El sistema valida si el grafo es realizable y lo construye.
        </p>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <span className="text-zinc-500 self-center">Ejemplos:</span>
          {['3, 3, 2, 2, 2', '4, 4, 3, 3, 2, 2', '3, 3, 3, 3', '3, 2, 1, 0'].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setDegreeSeqInput(preset);
                const degrees = preset.split(',').map((t) => parseInt(t.trim(), 10));
                setHhResult(solveHavelHakimi(degrees));
              }}
              className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition font-mono border border-zinc-700"
            >
              [{preset}]
            </button>
          ))}
        </div>

        {/* Sequence Input and Action */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={degreeSeqInput}
            onChange={(e) => setDegreeSeqInput(e.target.value)}
            placeholder="3, 3, 2, 2, 2"
            className="flex-1 bg-zinc-950 font-mono text-xs text-zinc-200 px-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-500 transition"
          />
          <button
            onClick={handleTestHavelHakimi}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-white active:scale-95 text-zinc-950 text-xs font-bold rounded-xl transition"
          >
            Validar
          </button>
        </div>

        {/* Validation Result Box */}
        {hhResult && (
          <div
            className={`p-3 rounded-xl border space-y-2 transition-all ${
              hhResult.isGraphic
                ? 'bg-zinc-950 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hhResult.isGraphic ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="text-xs font-semibold">{hhResult.message}</span>
              </div>
              {hhResult.steps.length > 0 && (
                <button
                  onClick={() => setShowHhSteps(!showHhSteps)}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 transition"
                >
                  <span>{showHhSteps ? 'Ocultar' : 'Ver pasos'}</span>
                  {showHhSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {showHhSteps && hhResult.steps.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 space-y-1 font-mono text-[10px] text-zinc-400">
                {hhResult.steps.map((st, idx) => (
                  <div key={idx} className="leading-tight">
                    {st}
                  </div>
                ))}
              </div>
            )}

            {hhResult.isGraphic && (
              <button
                onClick={handleBuildFromHavelHakimi}
                className="w-full mt-2 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generar y Dibujar este Grafo</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
