import type { Vertex, ColoringResult, ColoringStep } from '../types/graph';
import { getColor } from './colors';

/**
 * Executes the Welsh-Powell graph vertex coloring algorithm.
 * 1. Find the degree of each vertex.
 * 2. List the vertices in order of descending degrees.
 * 3. Color the first vertex with color 1.
 * 4. Go down the sorted list and color every uncolored vertex not connected to any vertex colored with color 1 with color 1.
 * 5. Repeat with color 2, 3, etc., until all vertices are colored.
 */
export function runWelshPowell(vertices: Vertex[], matrix: number[][]): ColoringResult {
  const n = vertices.length;
  if (n === 0) {
    return {
      chromaticNumber: 0,
      vertexColors: new Map(),
      colorClasses: [],
      steps: [],
      sortedByDegree: [],
      isOptimal: true,
    };
  }

  // Calculate degrees from matrix
  const degrees = matrix.map((row) => row.reduce((acc, val) => acc + val, 0));

  // Build sorted list of vertices (descending by degree)
  // Tie-breaker: original index to keep determinism
  const sortedIndices = Array.from({ length: n }, (_, i) => i).sort((a, b) => {
    if (degrees[b] !== degrees[a]) {
      return degrees[b] - degrees[a];
    }
    return a - b;
  });

  const sortedByDegree = sortedIndices.map((i) => ({
    id: vertices[i].id,
    label: vertices[i].label,
    degree: degrees[i],
  }));

  const vertexColors = new Map<number, number>(); // vertexId -> colorIndex (1-based)
  const steps: ColoringStep[] = [];
  let currentColor = 1;
  let coloredCount = 0;
  let stepNumber = 1;

  // Set of colored vertex indices in current round
  while (coloredCount < n) {
    const paletteItem = getColor(currentColor);
    const verticesInThisColor: number[] = [];

    steps.push({
      stepNumber: stepNumber++,
      vertexId: -1,
      vertexLabel: `Ronda Color #${currentColor} (${paletteItem.name})`,
      degree: -1,
      colorIndex: currentColor,
      colorHex: paletteItem.hex,
      action: 'round_start',
      reason: `Iniciando asignación del Color #${currentColor} (${paletteItem.name}).`,
    });

    for (const vIdx of sortedIndices) {
      const vId = vertices[vIdx].id;
      const vLabel = vertices[vIdx].label;
      const vDegree = degrees[vIdx];

      // If already colored, skip
      if (vertexColors.has(vId)) {
        continue;
      }

      // Check if vIdx is adjacent to any vertex already colored with currentColor
      const conflicts: string[] = [];
      for (const coloredIdx of verticesInThisColor) {
        if (matrix[vIdx][coloredIdx] === 1) {
          conflicts.push(vertices[coloredIdx].label);
        }
      }

      if (conflicts.length === 0) {
        // Can safely color this vertex
        vertexColors.set(vId, currentColor);
        verticesInThisColor.push(vIdx);
        coloredCount++;

        steps.push({
          stepNumber: stepNumber++,
          vertexId: vId,
          vertexLabel: vLabel,
          degree: vDegree,
          colorIndex: currentColor,
          colorHex: paletteItem.hex,
          action: 'assign',
          reason:
            verticesInThisColor.length === 1
              ? `Vértice con mayor grado disponible (grado ${vDegree}). Se le asigna el Color #${currentColor}.`
              : `No es adyacente a ningún vértice del grupo de Color #${currentColor}. Se le asigna el Color #${currentColor}.`,
        });
      } else {
        // Conflicts with an already assigned vertex in this color round
        steps.push({
          stepNumber: stepNumber++,
          vertexId: vId,
          vertexLabel: vLabel,
          degree: vDegree,
          colorIndex: currentColor,
          colorHex: paletteItem.hex,
          action: 'skip',
          reason: `No se puede pintar con Color #${currentColor} porque es adyacente a ${conflicts.join(', ')}.`,
          conflictsWith: conflicts,
        });
      }
    }

    currentColor++;
  }

  const chromaticNumber = currentColor - 1;

  // Build color classes
  const colorClassesMap = new Map<number, Vertex[]>();
  vertices.forEach((v) => {
    const col = vertexColors.get(v.id) || 1;
    if (!colorClassesMap.has(col)) {
      colorClassesMap.set(col, []);
    }
    colorClassesMap.get(col)!.push({
      ...v,
      colorIndex: col,
      colorHex: getColor(col).hex,
      degree: degrees[vertices.findIndex((x) => x.id === v.id)],
    });
  });

  const colorClasses = Array.from(colorClassesMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([colIndex, vList]) => ({
      colorIndex: colIndex,
      colorHex: getColor(colIndex).hex,
      vertices: vList,
    }));

  return {
    chromaticNumber,
    vertexColors,
    colorClasses,
    steps,
    sortedByDegree,
    isOptimal: true,
  };
}

/**
 * Validates a degree sequence using the Havel-Hakimi theorem and,
 * if valid, constructs a simple undirected graph adjacency matrix.
 */
export interface HavelHakimiResult {
  isGraphic: boolean;
  message: string;
  steps: string[];
  matrix?: number[][];
  degrees?: number[];
}

export function solveHavelHakimi(inputDegrees: number[]): HavelHakimiResult {
  const steps: string[] = [];

  if (inputDegrees.length === 0) {
    return {
      isGraphic: false,
      message: 'La secuencia está vacía.',
      steps: ['Ingresa al menos 1 grado positivo.'],
    };
  }

  // Check for negative degrees
  if (inputDegrees.some((d) => d < 0 || !Number.isInteger(d))) {
    return {
      isGraphic: false,
      message: 'Los grados deben ser números enteros no negativos.',
      steps: ['Se encontraron valores negativos o no enteros.'],
    };
  }

  // Sum of degrees must be even (Handshaking Lemma)
  const sum = inputDegrees.reduce((a, b) => a + b, 0);
  steps.push(`Suma de grados: ${sum}. ${sum % 2 === 0 ? '✓ Es par (Cumple Lema del Apretón de Manos)' : '✗ Es impar (No puede existir un grafo simple con suma impar de grados)'}`);

  if (sum % 2 !== 0) {
    return {
      isGraphic: false,
      message: 'La suma de los grados es impar. Por el Lema del Apretón de Manos, no es realizable.',
      steps,
    };
  }

  const n = inputDegrees.length;
  // Maximum degree cannot exceed n - 1
  if (inputDegrees.some((d) => d >= n)) {
    steps.push(`✗ Ningún vértice en un grafo de ${n} nodos puede tener grado mayor o igual a ${n}.`);
    return {
      isGraphic: false,
      message: `El grado máximo permitido para ${n} nodos es ${n - 1}.`,
      steps,
    };
  }

  // To build the matrix alongside the theorem, we track vertex indices
  interface NodeItem {
    originalIndex: number;
    deg: number;
  }

  let nodes: NodeItem[] = inputDegrees.map((deg, i) => ({ originalIndex: i, deg }));
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  let stepIdx = 1;
  while (true) {
    // Sort descending
    nodes.sort((a, b) => b.deg - a.deg);
    steps.push(`Paso ${stepIdx}: [${nodes.map((n) => n.deg).join(', ')}]`);

    // If all degrees are 0, we are done
    if (nodes.every((n) => n.deg === 0)) {
      steps.push('✓ Todos los grados llegaron a 0. ¡La secuencia es realizable / gráfica!');
      break;
    }

    // Take the largest degree d
    const top = nodes.shift()!;
    const d = top.deg;

    if (d > nodes.length) {
      steps.push(`✗ El grado ${d} es mayor que los ${nodes.length} vértices restantes. Imposible conectar.`);
      return {
        isGraphic: false,
        message: 'La secuencia no es realizable (Havel-Hakimi falló).',
        steps,
      };
    }

    // Subtract 1 from the next d vertices and add edge in matrix
    for (let i = 0; i < d; i++) {
      nodes[i].deg -= 1;
      if (nodes[i].deg < 0) {
        steps.push(`✗ Un grado se convirtió en negativo (${nodes[i].deg}). No es gráfica.`);
        return {
          isGraphic: false,
          message: 'La secuencia produce grados negativos.',
          steps,
        };
      }
      // Add undirected edge between top.originalIndex and nodes[i].originalIndex
      const u = top.originalIndex;
      const v = nodes[i].originalIndex;
      matrix[u][v] = 1;
      matrix[v][u] = 1;
    }

    stepIdx++;
  }

  return {
    isGraphic: true,
    message: '¡Secuencia gráfica válida! Grafo construido exitosamente.',
    steps,
    matrix,
    degrees: inputDegrees,
  };
}

/**
 * Layout Generators
 */
export function generateCircularCoords(count: number, width: number, height: number): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  for (let i = 0; i < count; i++) {
    // Start at top (-PI/2)
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    coords.push({
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
    });
  }
  return coords;
}

export function generateGridCoords(count: number, width: number, height: number): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  const paddingX = width * 0.15;
  const paddingY = height * 0.15;
  const stepX = cols > 1 ? (width - 2 * paddingX) / (cols - 1) : 0;
  const stepY = rows > 1 ? (height - 2 * paddingY) / (rows - 1) : 0;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    coords.push({
      x: Math.round(cols === 1 ? width / 2 : paddingX + col * stepX),
      y: Math.round(rows === 1 ? height / 2 : paddingY + row * stepY),
    });
  }
  return coords;
}

export function generateRandomCoords(count: number, width: number, height: number): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];
  const margin = 45;
  const minDist = 60;

  for (let i = 0; i < count; i++) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      attempts++;
      const candidateX = Math.round(margin + Math.random() * (width - 2 * margin));
      const candidateY = Math.round(margin + Math.random() * (height - 2 * margin));

      const tooClose = coords.some((c) => {
        const dx = c.x - candidateX;
        const dy = c.y - candidateY;
        return Math.hypot(dx, dy) < minDist;
      });

      if (!tooClose || attempts > 80) {
        coords.push({ x: candidateX, y: candidateY });
        placed = true;
      }
    }
  }
  return coords;
}

/**
 * Text Matrix parser
 * Supports spaces, commas, tabs, semicolons
 */
export function parseMatrixText(text: string): { matrix: number[][]; error?: string } {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { matrix: [], error: 'El texto de la matriz está vacío.' };
  }

  const matrix: number[][] = [];
  const expectedCols = lines.length;

  for (let r = 0; r < lines.length; r++) {
    // Split row by spaces or commas
    const tokens = lines[r]
      .split(/[\s,;]+/)
      .filter((t) => t.length > 0)
      .map((t) => parseInt(t, 10));

    if (tokens.some((val) => isNaN(val) || (val !== 0 && val !== 1))) {
      return {
        matrix: [],
        error: `Fila ${r + 1} contiene valores inválidos. Solo se admiten 0 y 1.`,
      };
    }

    if (tokens.length !== expectedCols) {
      return {
        matrix: [],
        error: `La matriz debe ser cuadrada ($N \\times N$). La fila ${r + 1} tiene ${tokens.length} columnas, pero hay ${lines.length} filas.`,
      };
    }

    // Force diagonal to 0 (no self-loops in simple graphs)
    tokens[r] = 0;
    matrix.push(tokens);
  }

  // Ensure symmetric
  for (let i = 0; i < expectedCols; i++) {
    for (let j = 0; j < expectedCols; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        // Automatically symmetrize by taking logical OR
        const val = matrix[i][j] || matrix[j][i];
        matrix[i][j] = val;
        matrix[j][i] = val;
      }
    }
  }

  return { matrix };
}

/**
 * Converts matrix to formatted string
 */
export function matrixToString(matrix: number[][]): string {
  return matrix.map((row) => row.join(' ')).join('\n');
}
