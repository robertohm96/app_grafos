import React, { useState } from 'react';
import type { Vertex, ColoringResult } from '../types/graph';
import { getColor } from '../utils/colors';
import {
  Palette,
  Layers,
  ListOrdered,
  Sparkles,
} from 'lucide-react';

interface ColoringTabProps {
  vertices: Vertex[];
  matrix: number[][];
  coloringResult: ColoringResult;
}

export const ColoringTab: React.FC<ColoringTabProps> = ({
  vertices,
  matrix,
  coloringResult,
}) => {
  const [filterColor, setFilterColor] = useState<number | null>(null);

  const { chromaticNumber, colorClasses, steps, sortedByDegree } = coloringResult;

  // Maximum degree Δ(G)
  const maxDegree = sortedByDegree.length > 0 ? sortedByDegree[0].degree : 0;

  // Get neighbors of each vertex
  const getNeighbors = (vIdx: number): string[] => {
    const list: string[] = [];
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[vIdx]?.[j] === 1 && vertices[j]) {
        list.push(vertices[j].label);
      }
    }
    return list;
  };

  return (
    <div className="space-y-4">
      {/* Chromatic Number Summary Card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                <Palette className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Coloración Propia de Vértices
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Número Cromático: <span className="text-blue-400 font-mono text-2xl">χ(G) = {chromaticNumber}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Algoritmo de Welsh-Powell aplicado con éxito. Ningún par de vértices adyacentes comparte color.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="flex-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Grado Máx. Δ(G)</div>
              <div className="text-sm font-bold text-slate-100 font-mono">{maxDegree}</div>
            </div>
            <div className="flex-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Cota de Brooks</div>
              <div className="text-sm font-bold text-slate-100 font-mono">χ ≤ {maxDegree + 1}</div>
            </div>
          </div>
        </div>

        {/* Chromatic Classes Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Clases Cromáticas (Conjuntos Independientes):</span>
            {filterColor !== null && (
              <button
                onClick={() => setFilterColor(null)}
                className="text-xs text-blue-400 hover:underline"
              >
                Ver todos
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colorClasses.map((cls) => {
              const item = getColor(cls.colorIndex);
              const isSelected = filterColor === cls.colorIndex;

              return (
                <button
                  key={cls.colorIndex}
                  onClick={() => setFilterColor(isSelected ? null : cls.colorIndex)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'ring-2 ring-white scale-105'
                      : 'hover:scale-102 opacity-90'
                  }`}
                  style={{
                    backgroundColor: `${item.hex}25`,
                    color: item.hex,
                    border: `1px solid ${item.hex}60`,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span>Clase {cls.colorIndex}:</span>
                  <span className="font-mono text-white text-[11px]">
                    {'{'}
                    {cls.vertices.map((v) => v.label).join(', ')}
                    {'}'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coloring & Degree Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Tabla de Coloración, Grados y Vecindades
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {vertices.length} vértices
          </span>
        </div>

        {vertices.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            Sin datos que mostrar.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Vértice</th>
                  <th className="py-2.5 px-2 text-center">Grado g(v)</th>
                  <th className="py-2.5 px-3">Color Asignado</th>
                  <th className="py-2.5 px-2 text-center">Coord (X, Y)</th>
                  <th className="py-2.5 px-3">Vecinos Adyacentes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {vertices
                  .filter((v) => filterColor === null || v.colorIndex === filterColor)
                  .map((vertex, idx) => {
                    const colorItem = getColor(vertex.colorIndex || 1);
                    const neighbors = getNeighbors(idx);

                    return (
                      <tr
                        key={vertex.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Vertex Name with Glow */}
                        <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: colorItem.hex }}
                          />
                          <span>{vertex.label}</span>
                        </td>

                        {/* Degree */}
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-blue-400">
                          {vertex.degree}
                        </td>

                        {/* Color Class & Badge */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: colorItem.hex }}
                            >
                              Color #{vertex.colorIndex}
                            </span>
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                              {colorItem.name}
                            </span>
                          </div>
                        </td>

                        {/* Coords */}
                        <td className="py-2.5 px-2 text-center font-mono text-slate-400 text-[11px]">
                          ({vertex.x}, {vertex.y})
                        </td>

                        {/* Neighbors */}
                        <td className="py-2.5 px-3">
                          {neighbors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {neighbors.map((nb) => (
                                <span
                                  key={nb}
                                  className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded text-[10px] font-mono"
                                >
                                  {nb}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-[10px] italic">
                              Aislado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Step-by-Step Welsh-Powell Explanation */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Explicación Paso a Paso (Algoritmo de Welsh-Powell)
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Orden Voraz (Greedy)
          </span>
        </div>

        {/* Phase 1: Descending Degree Order */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
          <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paso Inicial: Ordenamiento decreciente de grados</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Se calcula el grado de cada vértice y se ordenan de mayor a menor para priorizar los vértices más restrictivos:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sortedByDegree.map((item, idx) => (
              <span
                key={item.id}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono flex items-center gap-1"
              >
                <span className="text-purple-400 font-bold">{idx + 1}.</span>
                <span className="font-bold">{item.label}</span>
                <span className="text-[10px] text-slate-400">(g={item.degree})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Phase 2: Rounds & Step Execution Cards */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {steps.map((st, idx) => {
            if (st.action === 'round_start') {
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 pt-2 pb-1 text-xs font-bold text-slate-200 border-b border-slate-800/80"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: st.colorHex }}
                  />
                  <span>{st.vertexLabel}</span>
                </div>
              );
            }

            const isAssign = st.action === 'assign';

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  isAssign
                    ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                    : 'bg-slate-950/30 border-slate-800/50 text-slate-400 opacity-75'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isAssign ? (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: st.colorHex }}
                    >
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      ✗
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      Vértice {st.vertexLabel} (Grado {st.degree})
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${st.colorHex}20`,
                        color: st.colorHex,
                      }}
                    >
                      {isAssign ? `Asignado Color #${st.colorIndex}` : 'Conflicto'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {st.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
