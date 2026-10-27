import type { PredefinedGraph } from '../types/graph';

export const PREDEFINED_GRAPHS: PredefinedGraph[] = [
  {
    id: 'miniwebtool',
    name: 'MiniWebTool Clásico (4 Vértices)',
    description: 'Ejemplo representativo de MiniWebTool: Ciclo C4 con una diagonal interna. Demuestra coloración con χ(G) = 3.',
    category: 'Clásicos',
    matrix: [
      [0, 1, 1, 1],
      [1, 0, 1, 0],
      [1, 1, 0, 1],
      [1, 0, 1, 0],
    ],
    customCoords: [
      { x: 90, y: 70 },
      { x: 290, y: 70 },
      { x: 290, y: 250 },
      { x: 90, y: 250 },
    ],
  },
  {
    id: 'c5',
    name: 'Ciclo Impar C₅ (Pentágono)',
    description: 'Ciclo impar de 5 vértices. Por teorema fundamental, cualquier ciclo impar requiere exactamente 3 colores (χ = 3).',
    category: 'Ciclos',
    matrix: [
      [0, 1, 0, 0, 1],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0],
    ],
    customCoords: [
      { x: 190, y: 55 },
      { x: 310, y: 140 },
      { x: 265, y: 275 },
      { x: 115, y: 275 },
      { x: 70, y: 140 },
    ],
  },
  {
    id: 'k4',
    name: 'Grafo Completo K₄ (Tetraedro)',
    description: '4 vértices todos mutuamente conectados. Requiere exactamente 4 colores (χ = 4), cada vértice con color único.',
    category: 'Completos',
    matrix: [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ],
    customCoords: [
      { x: 190, y: 60 },
      { x: 310, y: 250 },
      { x: 70, y: 250 },
      { x: 190, y: 175 },
    ],
  },
  {
    id: 'bipartite_k33',
    name: 'Bipartito Completo K₃,₃ (Kuratowski)',
    description: 'Grafo de las tres casas y los tres servicios. Es 2-coloreable (χ = 2) y no planar.',
    category: 'Bipartitos',
    matrix: [
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0],
    ],
    customCoords: [
      { x: 90, y: 70 },
      { x: 190, y: 70 },
      { x: 290, y: 70 },
      { x: 90, y: 250 },
      { x: 190, y: 250 },
      { x: 290, y: 250 },
    ],
  },
  {
    id: 'petersen',
    name: 'Grafo de Petersen (10 Vértices)',
    description: 'El contraejemplo más célebre de la teoría de grafos: 3-regular, no planar, no hamiltoniano, con χ(G) = 3.',
    category: 'Especiales',
    matrix: [
      // 0..4: Pentágono exterior
      [0, 1, 0, 0, 1, 1, 0, 0, 0, 0], // 0
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0], // 1
      [0, 1, 0, 1, 0, 0, 0, 1, 0, 0], // 2
      [0, 0, 1, 0, 1, 0, 0, 0, 1, 0], // 3
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1], // 4
      // 5..9: Estrella interior
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 1], // 6
      [0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // 7
      [0, 0, 0, 1, 0, 1, 1, 0, 0, 0], // 8
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 0], // 9
    ],
    customCoords: [
      // Pentágono exterior (radio 120, centro 190, 160)
      { x: 190, y: 40 },
      { x: 304, y: 123 },
      { x: 261, y: 257 },
      { x: 119, y: 257 },
      { x: 76, y: 123 },
      // Estrella interior (radio 60, centro 190, 160)
      { x: 190, y: 100 },
      { x: 247, y: 141 },
      { x: 226, y: 208 },
      { x: 154, y: 208 },
      { x: 133, y: 141 },
    ],
  },
];
