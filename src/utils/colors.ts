export interface ColorPaletteItem {
  index: number;
  hex: string;
  name: string;
  textColor: string;
  glow: string;
}

export const COLOR_PALETTE: ColorPaletteItem[] = [
  { index: 1, hex: '#2563EB', name: 'Azul Zafiro', textColor: '#FFFFFF', glow: 'rgba(37, 99, 235, 0.3)' },
  { index: 2, hex: '#059669', name: 'Verde Bosque', textColor: '#FFFFFF', glow: 'rgba(5, 150, 105, 0.3)' },
  { index: 3, hex: '#D97706', name: 'Ámbar Cálido', textColor: '#FFFFFF', glow: 'rgba(217, 119, 6, 0.3)' },
  { index: 4, hex: '#7C3AED', name: 'Púrpura Mate', textColor: '#FFFFFF', glow: 'rgba(124, 58, 237, 0.3)' },
  { index: 5, hex: '#DC2626', name: 'Rojo Carmín', textColor: '#FFFFFF', glow: 'rgba(220, 38, 38, 0.3)' },
  { index: 6, hex: '#0891B2', name: 'Cian Nórdico', textColor: '#FFFFFF', glow: 'rgba(8, 145, 178, 0.3)' },
  { index: 7, hex: '#EA580C', name: 'Naranja Óxido', textColor: '#FFFFFF', glow: 'rgba(234, 88, 12, 0.3)' },
  { index: 8, hex: '#4B5563', name: 'Gris Grafito', textColor: '#FFFFFF', glow: 'rgba(75, 85, 99, 0.3)' },
  { index: 9, hex: '#4F46E5', name: 'Índigo Sobrio', textColor: '#FFFFFF', glow: 'rgba(79, 70, 229, 0.3)' },
  { index: 10, hex: '#0D9488', name: 'Verde Jade', textColor: '#FFFFFF', glow: 'rgba(13, 148, 136, 0.3)' },
  { index: 11, hex: '#C026D3', name: 'Magenta Mate', textColor: '#FFFFFF', glow: 'rgba(192, 38, 211, 0.3)' },
  { index: 12, hex: '#65A30D', name: 'Oliva Sobrio', textColor: '#FFFFFF', glow: 'rgba(101, 163, 13, 0.3)' },
];

export function getColor(colorIndex: number): ColorPaletteItem {
  if (colorIndex <= 0) {
    return {
      index: 0,
      hex: '#374151',
      name: 'Sin Color',
      textColor: '#FFFFFF',
      glow: 'rgba(55, 65, 81, 0.2)',
    };
  }
  const zeroBased = (colorIndex - 1) % COLOR_PALETTE.length;
  return COLOR_PALETTE[zeroBased];
}
