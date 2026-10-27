import type { Vertex } from '../types/graph';

export interface SavedGraph {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  vertices: Vertex[];
  matrix: number[][];
  chromaticNumber: number;
}

const STORAGE_KEY = 'graphcolor_saved_graphs_v2';

export function getSavedGraphs(): SavedGraph[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading saved graphs:', e);
    return [];
  }
}

export function saveGraph(
  name: string,
  description: string,
  vertices: Vertex[],
  matrix: number[][],
  chromaticNumber: number,
  existingId?: string
): SavedGraph {
  const graphs = getSavedGraphs();
  const now = Date.now();

  if (existingId) {
    const idx = graphs.findIndex((g) => g.id === existingId);
    if (idx !== -1) {
      graphs[idx] = {
        ...graphs[idx],
        name: name.trim() || 'Grafo Sin Nombre',
        description: description.trim(),
        updatedAt: now,
        vertices,
        matrix,
        chromaticNumber,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
      return graphs[idx];
    }
  }

  const newGraph: SavedGraph = {
    id: `graph_${now}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || `Grafo ${graphs.length + 1}`,
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
    vertices,
    matrix,
    chromaticNumber,
  };

  graphs.unshift(newGraph);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
  return newGraph;
}

export function deleteSavedGraph(id: string): boolean {
  try {
    const graphs = getSavedGraphs().filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
    return true;
  } catch (e) {
    console.error('Error deleting graph:', e);
    return false;
  }
}

export function exportGraphsJSON(): string {
  const graphs = getSavedGraphs();
  return JSON.stringify(graphs, null, 2);
}

export function importGraphsJSON(jsonString: string): number {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) return 0;

    const existing = getSavedGraphs();
    const existingIds = new Set(existing.map((g) => g.id));
    let added = 0;

    for (const item of parsed) {
      if (item && item.name && Array.isArray(item.matrix)) {
        if (!existingIds.has(item.id)) {
          existing.push(item);
          added++;
        }
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return added;
  } catch (e) {
    console.error('Error importing graphs:', e);
    return 0;
  }
}
