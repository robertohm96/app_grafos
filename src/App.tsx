import { useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Vertex, CanvasTool, PredefinedGraph } from './types/graph';
import { Header } from './components/Header';
import { GraphCanvas } from './components/GraphCanvas';
import { TabNavigation } from './components/TabNavigation';
import type { TabType } from './components/TabNavigation';
import { MatrixTab } from './components/MatrixTab';
import { DegreesCoordsTab } from './components/DegreesCoordsTab';
import { ColoringTab } from './components/ColoringTab';
import { PREDEFINED_GRAPHS } from './utils/examples';
import {
  runWelshPowell,
  generateCircularCoords,
  generateGridCoords,
  generateRandomCoords,
} from './utils/graphAlgorithms';
import { getColor } from './utils/colors';

export function App() {
  // Initialize with MiniWebTool classic example (4 vertices)
  const defaultGraph = PREDEFINED_GRAPHS[0];

  const [vertices, setVertices] = useState<Vertex[]>(() => {
    return defaultGraph.matrix.map((_, i) => ({
      id: i + 1,
      label: `V${i + 1}`,
      x: defaultGraph.customCoords?.[i]?.x ?? 100 + (i % 2) * 160,
      y: defaultGraph.customCoords?.[i]?.y ?? 80 + Math.floor(i / 2) * 140,
      degree: defaultGraph.matrix[i].reduce((a, b) => a + b, 0),
    }));
  });

  const [matrix, setMatrix] = useState<number[][]>(defaultGraph.matrix);
  const [activeTab, setActiveTab] = useState<TabType>('matrix');
  const [activeTool, setActiveTool] = useState<CanvasTool>('move');

  // Compute Welsh-Powell coloring reactively
  const coloringResult = useMemo(() => {
    return runWelshPowell(vertices, matrix);
  }, [vertices.length, matrix]);

  // Enrich vertices with their assigned Welsh-Powell color and up-to-date degrees
  const enrichedVertices = useMemo(() => {
    return vertices.map((v, idx) => {
      const deg = matrix[idx] ? matrix[idx].reduce((a, b) => a + b, 0) : 0;
      const colorIndex = coloringResult.vertexColors.get(v.id) || 1;
      const palette = getColor(colorIndex);

      return {
        ...v,
        degree: deg,
        colorIndex,
        colorHex: palette.hex,
      };
    });
  }, [vertices, matrix, coloringResult.vertexColors]);

  // Trigger celebration on interesting coloring
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'],
      });
    } catch (e) {
      // Ignored if confetti not supported
    }
  }, []);

  // Update position of a vertex
  const handleUpdateVertexPos = useCallback((id: number, x: number, y: number) => {
    setVertices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, x, y } : v))
    );
  }, []);

  // Add vertex at coordinates (X, Y)
  const handleAddVertexAt = useCallback((x: number, y: number) => {
    setVertices((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((v) => v.id)) + 1 : 1;
      const newVertex: Vertex = {
        id: nextId,
        label: `V${nextId}`,
        x,
        y,
        degree: 0,
      };
      return [...prev, newVertex];
    });

    setMatrix((prev) => {
      const n = prev.length;
      const newMatrix = prev.map((row) => [...row, 0]);
      newMatrix.push(Array(n + 1).fill(0));
      return newMatrix;
    });
  }, []);

  // Toggle edge between two vertices
  const handleToggleEdge = useCallback((uIdx: number, vIdx: number) => {
    if (uIdx === vIdx) return;
    setMatrix((prev) => {
      const copy = prev.map((row) => [...row]);
      const current = copy[uIdx][vIdx];
      const toggled = current === 1 ? 0 : 1;
      copy[uIdx][vIdx] = toggled;
      copy[vIdx][uIdx] = toggled;
      return copy;
    });
  }, []);

  // Delete a vertex by its ID
  const handleDeleteVertex = useCallback((id: number) => {
    const idx = vertices.findIndex((v) => v.id === id);
    if (idx === -1) return;

    setVertices((prev) => prev.filter((v) => v.id !== id));
    setMatrix((prev) => {
      const copy = prev
        .filter((_, r) => r !== idx)
        .map((row) => row.filter((_, c) => c !== idx));
      return copy;
    });
  }, [vertices]);

  // Set new matrix (from text parse or invert)
  const handleSetMatrix = useCallback((newMatrix: number[][]) => {
    const newN = newMatrix.length;
    setMatrix(newMatrix);

    setVertices((prev) => {
      if (prev.length === newN) {
        return prev;
      }
      // Re-generate vertices if dimension changed
      const coords = generateCircularCoords(newN, 380, 300);
      return Array.from({ length: newN }, (_, i) => ({
        id: i + 1,
        label: `V${i + 1}`,
        x: coords[i].x,
        y: coords[i].y,
        degree: newMatrix[i].reduce((a, b) => a + b, 0),
      }));
    });
  }, []);

  // Add vertex from Matrix Tab (+ Fila/Columna)
  const handleAddVertexSimple = useCallback(() => {
    const nextId = vertices.length > 0 ? Math.max(...vertices.map((v) => v.id)) + 1 : 1;
    const defaultCoords = generateCircularCoords(vertices.length + 1, 380, 300);
    const newPos = defaultCoords[defaultCoords.length - 1] || { x: 190, y: 150 };

    setVertices((prev) => [
      ...prev,
      {
        id: nextId,
        label: `V${nextId}`,
        x: newPos.x,
        y: newPos.y,
        degree: 0,
      },
    ]);

    setMatrix((prev) => {
      const n = prev.length;
      const newMatrix = prev.map((row) => [...row, 0]);
      newMatrix.push(Array(n + 1).fill(0));
      return newMatrix;
    });
  }, [vertices]);

  // Remove last vertex
  const handleRemoveLastVertex = useCallback(() => {
    if (vertices.length <= 1) return;
    const lastId = vertices[vertices.length - 1].id;
    handleDeleteVertex(lastId);
  }, [vertices, handleDeleteVertex]);

  // Apply auto-layout
  const handleApplyLayout = useCallback((type: 'circular' | 'grid' | 'random') => {
    const count = vertices.length;
    if (count === 0) return;

    let coords: { x: number; y: number }[] = [];
    if (type === 'circular') {
      coords = generateCircularCoords(count, 380, 300);
    } else if (type === 'grid') {
      coords = generateGridCoords(count, 380, 300);
    } else {
      coords = generateRandomCoords(count, 380, 300);
    }

    setVertices((prev) =>
      prev.map((v, i) => ({
        ...v,
        x: coords[i].x,
        y: coords[i].y,
      }))
    );
  }, [vertices.length]);

  // Load predefined example
  const handleSelectExample = useCallback((graph: PredefinedGraph) => {
    const n = graph.matrix.length;
    setMatrix(graph.matrix);

    const coords =
      graph.customCoords && graph.customCoords.length === n
        ? graph.customCoords
        : generateCircularCoords(n, 380, 300);

    const newVertices: Vertex[] = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      label: `V${i + 1}`,
      x: coords[i].x,
      y: coords[i].y,
      degree: graph.matrix[i].reduce((a, b) => a + b, 0),
    }));

    setVertices(newVertices);
    triggerConfetti();
  }, [triggerConfetti]);

  // Load generated graph from Havel-Hakimi
  const handleLoadGeneratedGraph = useCallback((newMatrix: number[][], count: number) => {
    setMatrix(newMatrix);
    const coords = generateCircularCoords(count, 380, 300);
    const newVertices: Vertex[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      label: `V${i + 1}`,
      x: coords[i].x,
      y: coords[i].y,
      degree: newMatrix[i].reduce((a, b) => a + b, 0),
    }));
    setVertices(newVertices);
    triggerConfetti();
  }, [triggerConfetti]);

  // Reset to empty
  const handleReset = useCallback(() => {
    setVertices([]);
    setMatrix([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Mobile Top Header */}
      <Header
        chromaticNumber={coloringResult.chromaticNumber}
        onSelectExample={handleSelectExample}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Interactive Colored Canvas View (Sticky/Top prominent) */}
        <section aria-label="Lienzo del Grafo Coloreado">
          <GraphCanvas
            vertices={enrichedVertices}
            matrix={matrix}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            onUpdateVertexPos={handleUpdateVertexPos}
            onAddVertex={handleAddVertexAt}
            onToggleEdge={handleToggleEdge}
            onDeleteVertex={handleDeleteVertex}
            onApplyLayout={handleApplyLayout}
          />
        </section>

        {/* Tab Navigation Segmented Bar */}
        <section aria-label="Navegación de Secciones">
          <TabNavigation
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            chromaticNumber={coloringResult.chromaticNumber}
          />
        </section>

        {/* Tab Content Panes */}
        <section className="flex-1 pb-12">
          {activeTab === 'matrix' && (
            <MatrixTab
              vertices={enrichedVertices}
              matrix={matrix}
              onToggleCell={handleToggleEdge}
              onSetMatrix={handleSetMatrix}
              onAddVertexSimple={handleAddVertexSimple}
              onRemoveLastVertex={handleRemoveLastVertex}
            />
          )}

          {activeTab === 'degrees' && (
            <DegreesCoordsTab
              vertices={enrichedVertices}
              matrix={matrix}
              onUpdateVertexPos={handleUpdateVertexPos}
              onToggleEdge={handleToggleEdge}
              onApplyLayout={handleApplyLayout}
              onLoadGeneratedGraph={handleLoadGeneratedGraph}
            />
          )}

          {activeTab === 'coloring' && (
            <ColoringTab
              vertices={enrichedVertices}
              matrix={matrix}
              coloringResult={coloringResult}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
