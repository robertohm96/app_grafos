export interface Vertex {
  id: number;
  label: string;
  x: number;
  y: number;
  degree: number;
  colorIndex?: number;
  colorHex?: string;
}

export interface Edge {
  u: number;
  v: number;
}

export interface ColoringStep {
  stepNumber: number;
  vertexId: number;
  vertexLabel: string;
  degree: number;
  colorIndex: number;
  colorHex: string;
  action: 'assign' | 'skip' | 'round_start';
  reason: string;
  conflictsWith?: string[];
}

export interface ColoringResult {
  chromaticNumber: number;
  vertexColors: Map<number, number>; // vertexId -> colorIndex
  colorClasses: { colorIndex: number; colorHex: string; vertices: Vertex[] }[];
  steps: ColoringStep[];
  sortedByDegree: { id: number; label: string; degree: number }[];
  isOptimal: boolean;
}

export type CanvasTool = 'move' | 'add' | 'connect' | 'delete';

export interface PredefinedGraph {
  id: string;
  name: string;
  description: string;
  category: string;
  matrix: number[][];
  customCoords?: { x: number; y: number }[];
}
