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
      {/* Top Banner (Minimalist) */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-800 text-zinc-200 rounded-xl border border-zinc-700">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>Biblioteca de Grafos Guardados</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono font-bold border border-zinc-700">
                {graphs.length}
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Guarda tus ejercicios para abrirlos o editarlos en cualquier momento
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSaveModal}
          className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-white active:scale-95 text-zinc-950 text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 shrink-0"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Guardar Grafo Actual</span>
        </button>
      </div>

      {/* Backup / Export / Import Bar */}
      <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
        <span className="text-zinc-400 text-[11px]">Respaldo y Compartir:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 rounded-lg border border-zinc-700 transition"
            title="Copiar todos los grafos en formato JSON"
          >
            {copiedExport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-[11px]">Copiado</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px]">Exportar JSON</span>
              </>
            )}
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 rounded-lg border border-zinc-700 transition"
            title="Importar grafos desde texto JSON"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px]">Importar JSON</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 text-center animate-in fade-in">
          {importStatus}
        </div>
      )}

      {/* Saved Graphs List */}
      {graphs.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-300">No tienes grafos guardados todavía</h3>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
              Crea tu grafo en el diseñador y presiona "Guardar Grafo" para tenerlo siempre disponible aquí.
            </p>
          </div>
          <button
            onClick={onOpenSaveModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition"
          >
            <BookmarkPlus className="w-4 h-4 text-zinc-300" />
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
                className="p-4 bg-zinc-900 hover:bg-zinc-850 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all shadow-sm space-y-3 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 leading-snug">
                        {g.name}
                      </h4>
                      {g.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                          {g.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(g.id, g.name)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                      title="Eliminar grafo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[10px]">
                    <span className="px-2 py-0.5 bg-zinc-950 text-zinc-300 font-mono rounded border border-zinc-800">
                      {g.vertices.length} vértices
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-950 text-zinc-300 font-mono rounded border border-zinc-800">
                      {edgeCount} aristas
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 font-mono font-bold rounded border border-zinc-700">
                      χ = {g.chromaticNumber}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </div>

                  <button
                    onClick={() => onLoadGraph(g.vertices, g.matrix, g.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg transition active:scale-95 shadow-sm"
                  >
                    <span>Cargar</span>
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
