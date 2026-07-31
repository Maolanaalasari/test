import React from 'react';
import {
  LayoutDashboard,
  Baby,
  Scale,
  PersonStanding,
  CalendarCheck2,
  FileSpreadsheet,
  Code2
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stuntingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  stuntingCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'balita', label: 'Data Balita', icon: Baby },
    { id: 'penimbangan', label: 'Penimbangan', icon: Scale },
    { id: 'ibu_hamil', label: 'Ibu Hamil', icon: PersonStanding },
    { id: 'jadwal', label: 'Jadwal & Imunisasi', icon: CalendarCheck2 },
    { id: 'laporan', label: 'Laporan SKDN', icon: FileSpreadsheet },
    { id: 'php', label: 'Code PHP Native', icon: Code2, badge: 'PHP' },
  ];

  return (
    <nav className="bg-sky-900 border-b border-sky-800 shadow-md sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md border border-sky-400/40 ring-1 ring-white/20'
                  : 'text-sky-200 hover:text-white hover:bg-sky-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-sky-300'}`} />
              <span>{item.label}</span>

              {item.badge && (
                <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 font-extrabold rounded-md ml-1">
                  {item.badge}
                </span>
              )}

              {item.id === 'penimbangan' && stuntingCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse ml-1">
                  {stuntingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
