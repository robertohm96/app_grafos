import React from 'react';
import {
  Grid3X3,
  Paintbrush,
  Palette,
  Sliders,
  FolderHeart,
} from 'lucide-react';

export type AppMode =
  | 'matrixToGraph'
  | 'graphToMatrix'
  | 'coloring'
  | 'degrees'
  | 'saved';

interface TabNavigationProps {
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  chromaticNumber: number;
  savedCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeMode,
  onChangeMode,
  chromaticNumber,
  savedCount,
}) => {
  const tabs = [
    {
      id: 'matrixToGraph' as AppMode,
      label: 'Matriz ➔ Grafo',
      shortLabel: 'Matriz a Grafo',
      icon: Grid3X3,
      badge: 'Constructor',
    },
    {
      id: 'graphToMatrix' as AppMode,
      label: 'Grafo ➔ Matriz',
      shortLabel: 'Grafo a Matriz',
      icon: Paintbrush,
      badge: 'Lienzo',
    },
    {
      id: 'coloring' as AppMode,
      label: 'Coloración',
      shortLabel: 'Coloración',
      icon: Palette,
      badge: `χ=${chromaticNumber}`,
    },
    {
      id: 'degrees' as AppMode,
      label: 'Havel-Hakimi',
      shortLabel: 'Grados',
      icon: Sliders,
      badge: 'Teoría',
    },
    {
      id: 'saved' as AppMode,
      label: 'Mis Grafos',
      shortLabel: 'Guardados',
      icon: FolderHeart,
      badge: savedCount > 0 ? `${savedCount}` : undefined,
    },
  ];

  return (
    <div className="w-full bg-zinc-950 p-1 rounded-2xl border border-zinc-800 shadow-sm">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeMode(tab.id)}
              className={`flex-1 min-w-[76px] sm:min-w-[110px] flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all active:scale-[0.98] min-h-[46px] relative shrink-0 ${
                isActive
                  ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className="text-[11px] font-semibold leading-none whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </div>
              {tab.badge && (
                <span
                  className={`text-[9px] mt-1 px-1.5 py-0.2 rounded font-mono font-medium leading-none ${
                    isActive
                      ? 'bg-zinc-700 text-zinc-200'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
