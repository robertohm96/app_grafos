import React, { useState } from 'react';
import type { PredefinedGraph } from '../types/graph';
import { PREDEFINED_GRAPHS } from '../utils/examples';
import {
  RotateCcw,
  BookOpen,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  chromaticNumber: number;
  onSelectExample: (graph: PredefinedGraph) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chromaticNumber,
  onSelectExample,
  onReset,
}) => {
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-mono text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                χ
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight">
                GraphColor <span className="text-blue-400 font-mono">Pro</span>
              </h1>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-medium border border-blue-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xs:block">
              Calculadora de Coloración & Diseñador Bidireccional
            </p>
          </div>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-2">
          {/* Chromatic Number Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-950/80 to-purple-950/80 border border-indigo-500/40 rounded-xl shadow-md cursor-pointer hover:border-indigo-400 transition"
            title="Número Cromático estimado por Welsh-Powell"
          >
            <span className="text-[11px] font-semibold text-indigo-300">χ(G) =</span>
            <span className="text-base font-black text-white font-mono leading-none">
              {chromaticNumber}
            </span>
          </div>

          {/* Examples Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowExamplesModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition shadow-sm"
              title="Cargar grafos clásicos predefinidos"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ejemplos</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl border border-transparent hover:border-slate-700 transition"
            title="Reiniciar a grafo vacío"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Help Info */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl border border-transparent hover:border-slate-700 transition"
            title="Información y ayuda"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Predefined Examples Modal */}
      {showExamplesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Ejemplos Predefinidos de Teoría de Grafos
                </h3>
              </div>
              <button
                onClick={() => setShowExamplesModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5">
              {PREDEFINED_GRAPHS.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    onSelectExample(ex);
                    setShowExamplesModal(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">
                      {ex.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {ex.matrix.length} vértices
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {ex.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info / Graph Theory Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Guía Teórica: Coloración de Grafos
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white">¿Qué es una Coloración Propia?</h4>
                <p className="text-slate-400 text-[11px]">
                  Es una asignación de colores a los vértices de un grafo tal que ningún par de vértices adyacentes (conectados por una arista) comparta el mismo color.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white">Número Cromático $\chi(G)$</h4>
                <p className="text-slate-400 text-[11px]">
                  Es el número mínimo de colores necesarios para colorear adecuadamente el grafo $G$.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white">Algoritmo de Welsh-Powell</h4>
                <ol className="list-decimal list-inside text-slate-400 text-[11px] space-y-1">
                  <li>Calcula el grado $g(v)$ de cada vértice.</li>
                  <li>Ordena los vértices en orden decreciente de grados.</li>
                  <li>Asigna el primer color al primer vértice no coloreado.</li>
                  <li>Recorre la lista y asigna ese mismo color a cada vértice no adyacente al grupo.</li>
                  <li>Repite con el siguiente color hasta colorear todos los vértices.</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white">Teorema de Havel-Hakimi</h4>
                <p className="text-slate-400 text-[11px]">
                  Permite determinar si una secuencia finita de números enteros no negativos es la secuencia de grados de un grafo simple finito, y genera la construcción paso a paso.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
