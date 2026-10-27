# 🎨 GraphColor Pro — Calculadora de Coloración & Diseñador Bidireccional

Aplicación móvil interactiva de alto rendimiento para **Teoría de Grafos** y **Coloración de Vértices** con sincronización bidireccional en tiempo real (Matriz $\leftrightarrow$ Grafo $\leftrightarrow$ Grados $\leftrightarrow$ Coordenadas). Diseñada con estética nativa Mobile-First, modo oscuro moderno y controles táctiles avanzados.

Inspirada y superando ampliamente a la calculadora de coloración de grafos de *MiniWebTool*.

---

## ⚡ Características Principales

### 1. Sincronización Bidireccional en Tiempo Real (El Núcleo)
- **De Matriz a Grafo:**
  - Cuadrícula interactiva $N \times N$ con botones táctiles para alternar entre `0` (sin arista) y `1` (conectados). Al tocar cualquier celda $(i, j)$, se sincroniza simétricamente $(j, i)$ al instante.
  - Campo de texto tipo MiniWebTool para escribir o pegar matrices fila por fila separadas por espacios o comas.
  - Al cambiar cualquier celda o texto, el grafo, los grados y la coloración se recalculan en tiempo real.
- **De Grafo a Matriz:**
  - Lienzo interactivo SVG de precisión milimétrica.
  - Mueve nodos arrastrándolos con el dedo o mouse; las coordenadas $(X, Y)$ se actualizan dinámicamente.
  - Toca nodos para crear aristas o eliminarlos.
  - Cualquier cambio visual en el lienzo actualiza de inmediato la matriz de adyacencia y la tabla de resultados.

### 2. Algoritmo de Coloración de Welsh-Powell
- **Coloración Propia de Vértices:** Garantiza que ningún par de vértices adyacentes comparta color.
- **Número Cromático $\chi(G)$:** Cálculo instantáneo con badge destacado.
- **Paleta Neón / Alto Contraste:** 16 colores seleccionados para máxima legibilidad en modo oscuro.
- **Clases Cromáticas:** Identificación visual de cada conjunto independiente de vértices.
- **Explicación Paso a Paso:**
  - Fase 1: Ordenamiento decreciente por grados $\Delta(G) = d(v_1) \ge d(v_2) \ge \dots \ge d(v_n)$.
  - Fase 2: Recorrido y asignación voraz explicando los motivos de aceptación o descarte por conflicto de arista en cada ronda.

### 3. Editor de Grados, Coordenadas y Teorema de Havel-Hakimi
- **Editor Directo de Vértices:**
  - Coordenadas $(X, Y)$ editables numéricamente con auto-acomodo: *Circular*, *Cuadrícula* y *Aleatorio*.
  - Grado $g(v)$ y chips táctiles para conectar/desconectar vecinos directamente.
- **Generador por Secuencia de Grados (Havel-Hakimi):**
  - Escribe una lista de grados (ej. `3, 3, 2, 2, 2`).
  - Validación del Lema del Apretón de Manos (suma par de grados).
  - Algoritmo reductivo paso a paso.
  - Botón de 1-clic para construir y dibujar el grafo resultante en el lienzo.

### 4. Ejemplos Predefinidos de Clase
- **MiniWebTool Clásico (4 Vértices)** ($\chi = 3$)
- **Grafo de Petersen (10 Vértices)**: 3-regular, no planar, con diseño de estrella interior y pentágono exterior ($\chi = 3$)
- **Ciclo Impar $C_5$ (Pentágono)** ($\chi = 3$)
- **Grafo Bipartito Completo $K_{3,3}$ (Kuratowski)** ($\chi = 2$)
- **Grafo Completo $K_4$ (Tetraedro)** ($\chi = 4$)

---

## 🛠️ Tecnologías Utilizadas
- **React 19** & **TypeScript**
- **Tailwind CSS** (Tema oscuro moderno, variables personalizadas)
- **Lienzo SVG Interactivo** con control de eventos táctiles unificados (`PointerEvents`)
- **Lucide Icons** & **Canvas-Confetti**
- **Capacitor 7** (Preparado para empaquetado nativo Android)
- **GitHub Actions** (Compilación automática de APK en la nube)

---

## 📱 ¿Cómo Compilar el APK Gratis en 3 Minutos en GitHub?

No necesitas instalar Android Studio ni configurar SDKs en tu máquina. El proyecto ya incluye el flujo automatizado en `.github/workflows/build-apk.yml`.

1. Sube este proyecto a tu repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: GraphColor Pro mobile app"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```
2. Entra a tu repositorio en GitHub y haz clic en la pestaña **"Actions"**.
3. Verás la acción **"Compilar APK Android (GraphColor Pro)"** ejecutándose automáticamente.
4. En ~3 minutos el proceso terminará en verde.
5. Haz clic en la ejecución y en la sección inferior **"Artifacts"** encontrarás el archivo:
   **`GraphColor-Pro-v2-Android-APK.zip`**
6. Descárgalo, descomprime el archivo `app-debug.apk` y pásalo a tu celular Android para instalarlo.

---

## 💻 Ejecución Local en Navegador

Para probar la aplicación en tu computadora localmente:

```bash
cd graph-coloring-app
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173`.
Presiona `F12` y activa la vista de emulación móvil en las DevTools para disfrutar de la experiencia táctil idéntica a la del teléfono móvil.
