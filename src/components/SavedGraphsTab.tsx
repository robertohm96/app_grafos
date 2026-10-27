import React, { useState, useEffect } from 'react';
import type { Vertex } from '../types/graph';
import type { SavedGraph } from '../utils/storage';
import {
  getSavedGraphs,
  deleteSavedGraph,
  exportGraphsJSON,
  importGraphsJSON,
} from '../utils/storage';
import {
  FolderHeart,
  Upload,
  Download,
  Trash2,
  FolderOpen,
  BookmarkPlus,
  Calendar,
  ArrowRight,
  Check,
} from 'lucide-react';

interface SavedGraphsTabProps {
  onLoadGraph: (vertices: Vertex[], matrix: number[][], name: string) => void;
  onOpenSaveModal: () => void;
}

export const SavedGraphsTab: React.FC<SavedGraphsTabProps> = ({
  onLoadGraph,
  onOpenSaveModal,
}) => {
  const [graphs, setGraphs] = useState<SavedGraph[]>([]);
  const [copiedExport, setCopiedExport] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const refreshGraphs = () => {
    setGraphs(getSavedGraphs());
  };

  useEffect(() => {
    refreshGraphs();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el grafo "${name}"?`)) {
      deleteSavedGraph(id);
      refreshGraphs();
    }
  };

  const handleExport = () => {
    const json = exportGraphsJSON();
    navigator.clipboard.writeText(json);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleImport = () => {
    const json = prompt('Pega aquí el contenido JSON exportado de tus grafos:');
    if (json) {
      const added = importGraphsJSON(json);
      if (added > 0) {
        setImportStatus(`¡Se importaron ${added} grafo(s) correctamente!`);
        refreshGraphs();
      } else {
        setImportStatus('No se encontraron grafos válidos para importar.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Save Trigger */}
      <div className="p-4 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 rounded-3xl border border-blue-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Biblioteca de Grafos Guardados</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                {graphs.length}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Guarda tus ejercicios, talleres o configuraciones para abrirlos en cualquier momento
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSaveModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 shrink-0"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Guardar Grafo Actual</span>
        </button>
      </div>

      {/* Backup / Export / Import Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
        <span className="text-slate-400 text-[11px]">Respaldo y Compartir:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 active:scale-95 rounded-xl border border-slate-700 transition"
            title="Copiar todos los grafos en formato JSON"
          >
            {copiedExport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-[11px]">Copiado</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">Exportar JSON</span>
              </>
            )}
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 active:scale-95 rounded-xl border border-slate-700 transition"
            title="Importar grafos desde texto JSON"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px]">Importar JSON</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-2xl text-xs text-indigo-200 text-center animate-in fade-in">
          {importStatus}
        </div>
      )}

      {/* Saved Graphs List */}
      {graphs.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-300">No tienes grafos guardados todavía</h3>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Crea tu grafo en el diseñador y presiona "Guardar Grafo" para tenerlo siempre disponible aquí.
            </p>
          </div>
          <button
            onClick={onOpenSaveModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Guardar mi primer grafo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {graphs.map((g) => {
            const edgeCount =
              g.matrix.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0) / 2;
            const dateStr = new Date(g.updatedAt || g.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={g.id}
                className="p-4 bg-slate-900/90 hover:bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-md hover:shadow-xl space-y-3 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition leading-snug">
                        {g.name}
                      </h4>
                      {g.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {g.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(g.id, g.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Eliminar grafo guardado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[10px]">
                    <span className="px-2 py-0.5 bg-slate-950 text-slate-300 font-mono rounded-lg border border-slate-800">
                      {g.vertices.length} vértices
                    </span>
                    <span className="px-2 py-0.5 bg-slate-950 text-slate-300 font-mono rounded-lg border border-slate-800">
                      {edgeCount} aristas
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono font-bold rounded-lg border border-indigo-500/30">
                      χ = {g.chromaticNumber}
                    </span>
                  </div>
                </div>

                {/* Footer with Date & Load Button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </div>

                  <button
                    onClick={() => onLoadGraph(g.vertices, g.matrix, g.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold rounded-xl border border-blue-500/40 transition active:scale-95 shadow-sm"
                  >
                    <span>Cargar en Estudio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
