import React, { useState } from 'react';
import type { PredefinedGraph } from '../types/graph';
import { PREDEFINED_GRAPHS } from '../utils/examples';
import {
  RotateCcw,
  BookOpen,
  ChevronDown,
  Sparkles,
  HelpCircle,
  BookmarkPlus,
  X,
  ArrowDownCircle,
} from 'lucide-react';

interface HeaderProps {
  chromaticNumber: number;
  onSelectExample: (graph: PredefinedGraph) => void;
  onReset: () => void;
  onOpenSaveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chromaticNumber,
  onSelectExample,
  onReset,
  onOpenSaveModal,
}) => {
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-3.5 pb-2.5 transition-all shadow-md"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Title (Minimalist) */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            χ
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-zinc-100 tracking-tight leading-none truncate">
                GraphColor <span className="text-zinc-400 font-mono text-xs">Pro</span>
              </h1>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-semibold border border-zinc-700">
                v2.1
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate mt-0.5 hidden xs:block">
              Calculadora de Coloración & Diseñador Bidireccional
            </p>
          </div>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Chromatic Number Badge (Minimalist) */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm min-h-[40px]"
            title="Número Cromático estimado por Welsh-Powell"
          >
            <span className="text-[11px] font-medium text-zinc-400">χ(G)=</span>
            <span className="text-base font-bold text-zinc-100 font-mono leading-none">
              {chromaticNumber}
            </span>
          </div>

          {/* Quick Save Graph Button */}
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1 px-2.5 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition min-h-[40px]"
            title="Guardar grafo con nombre personalizado"
          >
            <BookmarkPlus className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="text-xs hidden xs:inline">Guardar</span>
          </button>

          {/* Predefined Examples Button (Highlighted / Accessible) */}
          <button
            onClick={() => setShowExamplesModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-100 text-xs font-semibold rounded-xl border border-zinc-600 shadow-sm transition min-h-[40px]"
            title="Cargar grafos clásicos predefinidos"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span className="text-xs font-bold">Ejemplos</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 active:scale-95 rounded-xl border border-zinc-800 transition"
            title="Reiniciar a grafo vacío"
            aria-label="Reiniciar grafo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Help Info Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 active:scale-95 rounded-xl border border-zinc-800 transition"
            title="Información y ayuda"
            aria-label="Ayuda"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Predefined Examples Drawer: Never cut off at the top, guaranteed visible header and custom scrollbar */}
      {showExamplesModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowExamplesModal(false)}
        >
          <div
            className="bg-zinc-900 border-t sm:border border-zinc-700 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            }}
          >
            {/* Visual handle indicator for mobile */}
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Header (ALWAYS 100% visible below notch) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0 bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    Grafos Pre-creados ({PREDEFINED_GRAPHS.length} disponibles)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Selecciona cualquier grafo para cargarlo en el estudio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExamplesModal(false)}
                className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg bg-zinc-800 active:scale-95 border border-zinc-700 transition"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable list with VISIBLE PHYSICAL SCROLLBAR */}
            <div className="p-4 custom-scroll-bar space-y-2.5 flex-1 pr-3 overflow-y-auto">
              {PREDEFINED_GRAPHS.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    onSelectExample(ex);
                    setShowExamplesModal(false);
                  }}
                  className="w-full text-left p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 active:scale-[0.99] border border-zinc-800 hover:border-zinc-600 transition flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-100">
                      {idx + 1}. {ex.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono font-semibold border border-zinc-700">
                      {ex.matrix.length} vértices
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {ex.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Scroll indicator banner at bottom */}
            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <ArrowDownCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Desliza la barrita lateral para ver todas las opciones</span>
              </span>
              <button
                onClick={() => setShowExamplesModal(false)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg font-medium transition"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info / Graph Theory Guide Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-zinc-900 border-t sm:border border-zinc-700 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            }}
          >
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0 bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    Guía Teórica de Coloración
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Fundamentos y Algoritmos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg bg-zinc-800 active:scale-95 border border-zinc-700 transition"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 custom-scroll-bar space-y-3 text-xs text-zinc-300 leading-relaxed flex-1 pr-3 overflow-y-auto">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Coloración Propia de Vértices</h4>
                <p className="text-zinc-400 text-[11px]">
                  Asignación de colores tal que ningún par de vértices conectados comparta el mismo color.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Número Cromático $\chi(G)$</h4>
                <p className="text-zinc-400 text-[11px]">
                  Cantidad mínima de colores necesarios para una coloración propia del grafo.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Algoritmo de Welsh-Powell</h4>
                <ol className="list-decimal list-inside text-zinc-400 text-[11px] space-y-1">
                  <li>Calcula el grado $g(v)$ de cada vértice.</li>
                  <li>Ordena los vértices en orden decreciente de grados.</li>
                  <li>Asigna un color a los vértices compatibles sin aristas comunes.</li>
                  <li>Repite con el siguiente color hasta colorear todos.</li>
                </ol>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Teorema de Havel-Hakimi</h4>
                <p className="text-zinc-400 text-[11px]">
                  Permite validar y construir un grafo simple a partir de una secuencia de grados enteros.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-end shrink-0">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
