export interface ColorPaletteItem {
  index: number;
  hex: string;
  name: string;
  textColor: string;
  glow: string;
}

export const COLOR_PALETTE: ColorPaletteItem[] = [
  { index: 1, hex: '#3B82F6', name: 'Azul Eléctrico', textColor: '#FFFFFF', glow: 'rgba(59, 130, 246, 0.5)' },
  { index: 2, hex: '#EC4899', name: 'Rosa Neón', textColor: '#FFFFFF', glow: 'rgba(236, 72, 153, 0.5)' },
  { index: 3, hex: '#10B981', name: 'Verde Esmeralda', textColor: '#FFFFFF', glow: 'rgba(16, 185, 129, 0.5)' },
  { index: 4, hex: '#F59E0B', name: 'Ámbar Cálido', textColor: '#000000', glow: 'rgba(245, 158, 11, 0.5)' },
  { index: 5, hex: '#8B5CF6', name: 'Púrpura Místico', textColor: '#FFFFFF', glow: 'rgba(139, 92, 246, 0.5)' },
  { index: 6, hex: '#06B6D4', name: 'Cian Brillante', textColor: '#000000', glow: 'rgba(6, 182, 212, 0.5)' },
  { index: 7, hex: '#EF4444', name: 'Rojo Carmesí', textColor: '#FFFFFF', glow: 'rgba(239, 68, 68, 0.5)' },
  { index: 8, hex: '#84CC16', name: 'Lima Vibrante', textColor: '#000000', glow: 'rgba(132, 204, 22, 0.5)' },
  { index: 9, hex: '#F97316', name: 'Naranja Fuego', textColor: '#FFFFFF', glow: 'rgba(249, 115, 22, 0.5)' },
  { index: 10, hex: '#14B8A6', name: 'Turquesa', textColor: '#FFFFFF', glow: 'rgba(20, 184, 166, 0.5)' },
  { index: 11, hex: '#D946EF', name: 'Fucsia Magenta', textColor: '#FFFFFF', glow: 'rgba(217, 70, 239, 0.5)' },
  { index: 12, hex: '#EAB308', name: 'Amarillo Solar', textColor: '#000000', glow: 'rgba(234, 179, 8, 0.5)' },
  { index: 13, hex: '#6366F1', name: 'Índigo Real', textColor: '#FFFFFF', glow: 'rgba(99, 102, 241, 0.5)' },
  { index: 14, hex: '#0EA5E9', name: 'Azul Cielo', textColor: '#FFFFFF', glow: 'rgba(14, 165, 233, 0.5)' },
  { index: 15, hex: '#A855F7', name: 'Lavanda Intenso', textColor: '#FFFFFF', glow: 'rgba(168, 85, 247, 0.5)' },
  { index: 16, hex: '#64748B', name: 'Gris Grafito', textColor: '#FFFFFF', glow: 'rgba(100, 116, 139, 0.5)' },
];

export function getColor(colorIndex: number): ColorPaletteItem {
  if (colorIndex <= 0) {
    return {
      index: 0,
      hex: '#475569',
      name: 'Sin Color',
      textColor: '#FFFFFF',
      glow: 'rgba(71, 85, 105, 0.4)',
    };
  }
  const zeroBased = (colorIndex - 1) % COLOR_PALETTE.length;
  return COLOR_PALETTE[zeroBased];
}
