import React, { useState } from 'react';
import type { Vertex } from '../types/graph';
import { saveGraph } from '../utils/storage';
import { BookmarkPlus, Check, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SaveGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  vertices: Vertex[];
  matrix: number[][];
  chromaticNumber: number;
  onSavedSuccess?: (name: string) => void;
}

export const SaveGraphModal: React.FC<SaveGraphModalProps> = ({
  isOpen,
  onClose,
  vertices,
  matrix,
  chromaticNumber,
  onSavedSuccess,
}) => {
  const [graphName, setGraphName] = useState('');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = graphName.trim() || `Mi Grafo (${vertices.length} vértices)`;
    saveGraph(finalName, description, vertices, matrix, chromaticNumber);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#3B82F6', '#10B981'],
      });
    } catch {}

    setSaved(true);
    if (onSavedSuccess) onSavedSuccess(finalName);

    setTimeout(() => {
      setSaved(false);
      setGraphName('');
      setDescription('');
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border-t sm:border border-zinc-700 rounded-t-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Guardar Grafo Actual</h3>
              <p className="text-[11px] text-zinc-400">
                Almacena el grafo en tu dispositivo con un nombre personalizado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg bg-zinc-800 active:scale-95 border border-zinc-700 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Vértices:</span>
              <span className="font-bold text-zinc-100 font-mono">{vertices.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Aristas:</span>
              <span className="font-bold text-zinc-100 font-mono">
                {matrix.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0) / 2}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">χ(G):</span>
              <span className="font-bold text-zinc-100 font-mono">{chromaticNumber}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-200">
              Nombre del Grafo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              placeholder="Ej. Taller 1 - Ejercicio 4, Red Bipartita..."
              className="w-full bg-zinc-950 text-zinc-100 text-xs px-3.5 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-500 transition placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Descripción o Notas (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Grafo 3-regular no planar para verificar conjetura..."
              className="w-full bg-zinc-950 text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-500 transition placeholder:text-zinc-600 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saved}
              className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-white active:scale-95 text-zinc-950 text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-800" />
                  <span>Guardar Grafo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
