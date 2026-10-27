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
    <div className="w-full bg-slate-950/95 p-1.5 rounded-2xl border border-slate-800/90 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeMode(tab.id)}
              className={`flex-1 min-w-[76px] sm:min-w-[110px] flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all active:scale-[0.97] min-h-[48px] relative shrink-0 ${
                isActive
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold leading-none whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </div>
              {tab.badge && (
                <span
                  className={`text-[9px] mt-1 px-1.5 py-0.2 rounded-full font-mono font-semibold leading-none ${
                    isActive
                      ? 'bg-white/20 text-blue-100'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
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
