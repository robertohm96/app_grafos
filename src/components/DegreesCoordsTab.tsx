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
  // Havel-Hakimi Generator state
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
      {/* Auto-layout Preset Bar */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Auto-acomodo de Coordenadas:
          </span>
          <span className="text-[10px] text-slate-500">Distribución automática</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onApplyLayout('circular')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            <CircleDot className="w-3.5 h-3.5 text-blue-400" />
            <span>Circular</span>
          </button>
          <button
            onClick={() => onApplyLayout('grid')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cuadrícula</span>
          </button>
          <button
            onClick={() => onApplyLayout('random')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Aleatorio</span>
          </button>
        </div>
      </div>

      {/* Per-Vertex Coordinates & Degree Connections Editor */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Vértices, Grados y Conexiones Directas
          </h3>
          <p className="text-[11px] text-slate-400">
            Edita $(X, Y)$ manualmente o toca los chips de vecinos para conectar/desconectar.
          </p>
        </div>

        {vertices.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            No hay vértices en el grafo.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {vertices.map((vertex, uIdx) => {
              return (
                <div
                  key={vertex.id}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/90 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Node identification & Degree */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: vertex.colorHex || '#3B82F6' }}
                      />
                      <span className="text-xs font-bold text-slate-100">{vertex.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 font-mono font-semibold border border-slate-700">
                        Grado {vertex.degree}
                      </span>
                    </div>

                    {/* Coordinates (X, Y) Inputs */}
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 px-1.5 py-0.5">
                        <span className="text-[10px] text-slate-500 font-mono mr-1">X:</span>
                        <input
                          type="number"
                          value={vertex.x}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) onUpdateVertexPos(vertex.id, val, vertex.y);
                          }}
                          className="w-12 bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 px-1.5 py-0.5">
                        <span className="text-[10px] text-slate-500 font-mono mr-1">Y:</span>
                        <input
                          type="number"
                          value={vertex.y}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) onUpdateVertexPos(vertex.id, vertex.x, val);
                          }}
                          className="w-12 bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Neighbor Toggle Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 mr-1">Vecinos:</span>
                    {vertices.map((other, vIdx) => {
                      if (uIdx === vIdx) return null;
                      const isConnected = matrix[uIdx]?.[vIdx] === 1;

                      return (
                        <button
                          key={`chip-${vertex.id}-${other.id}`}
                          onClick={() => onToggleEdge(uIdx, vIdx)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                            isConnected
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-500/10'
                              : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
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
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Generador por Secuencia de Grados
              </h3>
              <p className="text-[10px] text-slate-400">
                Algoritmo y Teorema de Havel-Hakimi
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ingresa los grados deseados separados por comas. El sistema valida matemáticamente si existe
          un grafo simple con esa secuencia y lo construye de inmediato.
        </p>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <span className="text-slate-500 self-center">Ejemplos:</span>
          {['3, 3, 2, 2, 2', '4, 4, 3, 3, 2, 2', '3, 3, 3, 3', '3, 2, 1, 0'].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setDegreeSeqInput(preset);
                const degrees = preset.split(',').map((t) => parseInt(t.trim(), 10));
                setHhResult(solveHavelHakimi(degrees));
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition font-mono"
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
            className="flex-1 bg-slate-950 font-mono text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={handleTestHavelHakimi}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-500/20"
          >
            Validar
          </button>
        </div>

        {/* Validation Result Box */}
        {hhResult && (
          <div
            className={`p-3 rounded-xl border space-y-2 transition-all ${
              hhResult.isGraphic
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
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
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition"
                >
                  <span>{showHhSteps ? 'Ocultar pasos' : 'Ver pasos'}</span>
                  {showHhSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Step-by-step reduction */}
            {showHhSteps && hhResult.steps.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[10px] text-slate-300">
                {hhResult.steps.map((st, idx) => (
                  <div key={idx} className="leading-tight">
                    {st}
                  </div>
                ))}
              </div>
            )}

            {/* Build button if graphic */}
            {hhResult.isGraphic && (
              <button
                onClick={handleBuildFromHavelHakimi}
                className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
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
