import React from 'react';
import { Grid3X3, Sliders, Palette } from 'lucide-react';

export type TabType = 'matrix' | 'degrees' | 'coloring';

interface TabNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  chromaticNumber: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab,
  chromaticNumber,
}) => {
  const tabs = [
    {
      id: 'matrix' as TabType,
      label: 'Matriz',
      sublabel: '0 / 1 & Texto',
      icon: Grid3X3,
    },
    {
      id: 'degrees' as TabType,
      label: 'Grados & Coords',
      sublabel: 'Havel-Hakimi',
      icon: Sliders,
    },
    {
      id: 'coloring' as TabType,
      label: 'Coloración',
      sublabel: `χ = ${chromaticNumber}`,
      icon: Palette,
      badge: chromaticNumber,
    },
  ];

  return (
    <div className="w-full bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="grid grid-cols-3 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all active:scale-[0.98] min-h-[50px] relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-xs font-bold leading-none">{tab.label}</span>
              </div>
              <span
                className={`text-[10px] mt-1 leading-none font-mono font-medium ${
                  isActive ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
