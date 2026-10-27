import { useState, useMemo, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Vertex, CanvasTool, PredefinedGraph } from './types/graph';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import type { AppMode } from './components/TabNavigation';
import { MatrixToGraphSection } from './components/MatrixToGraphSection';
import { GraphToMatrixSection } from './components/GraphToMatrixSection';
import { DegreesCoordsTab } from './components/DegreesCoordsTab';
import { ColoringTab } from './components/ColoringTab';
import { SavedGraphsTab } from './components/SavedGraphsTab';
import { SaveGraphModal } from './components/SaveGraphModal';
import { PREDEFINED_GRAPHS } from './utils/examples';
import { getSavedGraphs } from './utils/storage';
import {
  runWelshPowell,
  generateCircularCoords,
  generateGridCoords,
  generateRandomCoords,
} from './utils/graphAlgorithms';
import { getColor } from './utils/colors';
import { Check } from 'lucide-react';

export function App() {
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
  const [activeMode, setActiveMode] = useState<AppMode>('matrixToGraph');
  const [activeTool, setActiveTool] = useState<CanvasTool>('move');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved count on mount
  useEffect(() => {
    setSavedCount(getSavedGraphs().length);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute Welsh-Powell coloring reactively
  const coloringResult = useMemo(() => {
    return runWelshPowell(vertices, matrix);
  }, [vertices.length, matrix]);

  // Enrich vertices with their assigned Welsh-Powell color and degrees
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

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'],
      });
    } catch {}
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

  // Set new matrix
  const handleSetMatrix = useCallback((newMatrix: number[][]) => {
    const newN = newMatrix.length;
    setMatrix(newMatrix);

    setVertices((prev) => {
      if (prev.length === newN) {
        return prev;
      }
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
    showToast(`Ejemplo cargado: ${graph.name}`);
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
    setActiveMode('graphToMatrix');
    showToast('¡Grafo de Havel-Hakimi generado en el estudio!');
  }, [triggerConfetti]);

  // Load saved graph from storage
  const handleLoadSavedGraph = useCallback((newVertices: Vertex[], newMatrix: number[][], name: string) => {
    setVertices(newVertices);
    setMatrix(newMatrix);
    triggerConfetti();
    setActiveMode('graphToMatrix');
    showToast(`Grafo cargado: "${name}"`);
  }, [triggerConfetti]);

  // Reset to empty
  const handleReset = useCallback(() => {
    if (vertices.length === 0) return;
    if (window.confirm('¿Deseas reiniciar y crear un grafo en blanco?')) {
      setVertices([]);
      setMatrix([]);
      showToast('Lienzo en blanco listo para comenzar');
    }
  }, [vertices.length]);

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Top Mobile Header with Safe Area Inset */}
      <Header
        chromaticNumber={coloringResult.chromaticNumber}
        onSelectExample={handleSelectExample}
        onReset={handleReset}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Toast Notification Pill */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/95 border border-blue-500/50 text-blue-200 text-xs font-semibold rounded-full shadow-2xl backdrop-blur-xl">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* 5-Mode Navigation Bar (Fable Studio Nav) */}
        <section aria-label="Navegación de Modos de la Aplicación">
          <TabNavigation
            activeMode={activeMode}
            onChangeMode={setActiveMode}
            chromaticNumber={coloringResult.chromaticNumber}
            savedCount={savedCount}
          />
        </section>

        {/* Dynamic Mode Views */}
        <section className="flex-1 pb-16">
          {/* Section 1: DE MATRIZ A GRAFO */}
          {activeMode === 'matrixToGraph' && (
            <MatrixToGraphSection
              vertices={enrichedVertices}
              matrix={matrix}
              chromaticNumber={coloringResult.chromaticNumber}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onUpdateVertexPos={handleUpdateVertexPos}
              onAddVertex={handleAddVertexAt}
              onToggleEdge={handleToggleEdge}
              onDeleteVertex={handleDeleteVertex}
              onApplyLayout={handleApplyLayout}
              onToggleCell={handleToggleEdge}
              onSetMatrix={handleSetMatrix}
              onAddVertexSimple={handleAddVertexSimple}
              onRemoveLastVertex={handleRemoveLastVertex}
            />
          )}

          {/* Section 2: DE GRAFO A MATRIZ */}
          {activeMode === 'graphToMatrix' && (
            <GraphToMatrixSection
              vertices={enrichedVertices}
              matrix={matrix}
              chromaticNumber={coloringResult.chromaticNumber}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onUpdateVertexPos={handleUpdateVertexPos}
              onAddVertex={handleAddVertexAt}
              onToggleEdge={handleToggleEdge}
              onDeleteVertex={handleDeleteVertex}
              onApplyLayout={handleApplyLayout}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
            />
          )}

          {/* Section 3: COLORACIÓN & WELSH-POWELL */}
          {activeMode === 'coloring' && (
            <ColoringTab
              vertices={enrichedVertices}
              matrix={matrix}
              coloringResult={coloringResult}
            />
          )}

          {/* Section 4: HAVEL-HAKIMI & GRADOS */}
          {activeMode === 'degrees' && (
            <DegreesCoordsTab
              vertices={enrichedVertices}
              matrix={matrix}
              onUpdateVertexPos={handleUpdateVertexPos}
              onToggleEdge={handleToggleEdge}
              onApplyLayout={handleApplyLayout}
              onLoadGeneratedGraph={handleLoadGeneratedGraph}
            />
          )}

          {/* Section 5: MIS GRAFOS GUARDADOS */}
          {activeMode === 'saved' && (
            <SavedGraphsTab
              onLoadGraph={handleLoadSavedGraph}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
            />
          )}
        </section>
      </main>

      {/* Save Graph Modal */}
      <SaveGraphModal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false);
          setSavedCount(getSavedGraphs().length);
        }}
        vertices={enrichedVertices}
        matrix={matrix}
        chromaticNumber={coloringResult.chromaticNumber}
        onSavedSuccess={(name) => {
          setSavedCount(getSavedGraphs().length);
          showToast(`¡Grafo "${name}" guardado en tu dispositivo!`);
        }}
      />
    </div>
  );
}

export default App;
