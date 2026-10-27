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
        colors: ['#3B82F6', '#10B981', '#8B5CF6'],
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-[32px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-6 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guardar Grafo Actual</h3>
              <p className="text-[11px] text-slate-400">
                Almacena tu grafo en tu dispositivo con un nombre personalizado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white rounded-xl bg-slate-800 active:scale-95 border border-slate-700 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 pb-8 sm:pb-5">
          {/* Quick Stats Pill */}
          <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Vértices:</span>
              <span className="font-bold text-white font-mono">{vertices.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Aristas:</span>
              <span className="font-bold text-white font-mono">
                {matrix.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0) / 2}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-semibold">χ(G):</span>
              <span className="font-bold text-white font-mono">{chromaticNumber}</span>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              Nombre del Grafo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              placeholder="Ej. Taller 1 - Ejercicio 4, Red Bipartita..."
              className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
            />
          </div>

          {/* Description / Notes Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Descripción o Notas (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Grafo 3-regular no planar para verificar conjetura..."
              className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-750 active:scale-95 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saved}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Guardado con Éxito!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
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
