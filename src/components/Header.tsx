import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  HelpCircle,
  BookmarkPlus,
  X,
} from 'lucide-react';

interface HeaderProps {
  chromaticNumber: number;
  onReset: () => void;
  onOpenSaveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chromaticNumber,
  onReset,
  onOpenSaveModal,
}) => {
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-3.5 pb-2.5 transition-all shadow-md relative"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Title (Minimalist) */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
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
        <div className="flex items-center gap-2 shrink-0">
          {/* Chromatic Number Badge */}
          <div
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm min-h-[40px]"
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
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition min-h-[40px]"
            title="Guardar grafo con nombre personalizado"
          >
            <BookmarkPlus className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="text-xs font-medium">Guardar</span>
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

          {/* Help Info Button ([?]) - Toggles downward info box */}
          <button
            onClick={() => setShowInfoDropdown(!showInfoDropdown)}
            className={`w-10 h-10 flex items-center justify-center active:scale-95 rounded-xl border transition ${
              showInfoDropdown
                ? 'bg-zinc-100 text-zinc-950 border-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
            }`}
            title="Información y ayuda"
            aria-label="Ayuda"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cuadro de texto hacia abajo (Dropdown Info Box directly below the header) */}
      {showInfoDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowInfoDropdown(false)}
          />

          {/* Downward Information Box */}
          <div
            className="absolute right-3 left-3 sm:left-auto sm:w-[420px] top-full mt-2 z-50 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-3 duration-200"
            style={{
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
            {/* Box Header */}
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    Guía de Ayuda & Teoría
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Información y funcionamiento de la aplicación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoDropdown(false)}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg bg-zinc-800 active:scale-95 border border-zinc-700 transition"
                aria-label="Cerrar ayuda"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content (Visible Scrollbar) */}
            <div className="p-4 custom-scroll-bar space-y-3 text-xs text-zinc-300 leading-relaxed overflow-y-auto max-h-[60vh]">
              {/* Card 1 */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Coloración Propia de Vértices</h4>
                <p className="text-zinc-400 text-[11px]">
                  Es una asignación de colores a cada vértice del grafo de modo que dos vértices conectados por una arista nunca tengan el mismo color.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Número Cromático χ(G)</h4>
                <p className="text-zinc-400 text-[11px]">
                  Representa el número mínimo de colores necesarios para lograr una coloración propia.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Algoritmo de Welsh-Powell</h4>
                <ol className="list-decimal list-inside text-zinc-400 text-[11px] space-y-1 mt-1">
                  <li>Calcula el grado de cada vértice.</li>
                  <li>Ordena los vértices de mayor a menor grado.</li>
                  <li>Asigna un color a los vértices compatibles que no tengan aristas entre sí.</li>
                  <li>Repite con el siguiente color hasta colorear todo el grafo.</li>
                </ol>
              </div>

              {/* Card 4 */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Teorema de Havel-Hakimi</h4>
                <p className="text-zinc-400 text-[11px]">
                  Permite determinar si una lista de grados enteros es realizable como un grafo simple y genera la construcción paso a paso.
                </p>
              </div>

              {/* Card 5 */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <h4 className="font-bold text-zinc-100 text-xs">Cómo usar los 2 modos:</h4>
                <p className="text-zinc-400 text-[11px]">
                  • <strong>Matriz ➔ Grafo:</strong> Edita la cuadrícula de ceros y unos o pega la matriz en texto; el grafo se proyecta al instante.<br/>
                  • <strong>Grafo ➔ Matriz:</strong> Usa las herramientas táctiles del lienzo para mover, añadir nodos o conectar aristas; la matriz se genera en tiempo real debajo.
                </p>
              </div>
            </div>

            {/* Box Footer */}
            <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-zinc-500">
                Desliza para leer toda la información
              </span>
              <button
                onClick={() => setShowInfoDropdown(false)}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
