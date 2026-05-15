
import React from 'react';
import { Home, Search, Info, LogOut } from 'lucide-react';

export type TabId = 'home' | 'search' | 'about' | 'exit';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'search', icon: Search, label: 'بحث' },
    { id: 'about', icon: Info, label: 'حول' },
    { id: 'exit', icon: LogOut, label: 'خروج' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center no-print pointer-events-none">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl p-1 flex items-center gap-1 pointer-events-auto transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as TabId)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={item.label}
            >
              <Icon 
                size={isActive ? 18 : 18} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
