import React from 'react';
import { Home, LayoutGrid, Package, Headphones, User } from 'lucide-react';
import { useTelegram } from '../context/TelegramContext';

export type NavTab = 'home' | 'categories' | 'orders' | 'support' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0
}) => {
  const { haptic } = useTelegram();

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-xl border-t border-[#27272A] pb-safe">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                haptic('selectionChanged');
                onSelectTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#E5092F] font-semibold'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#E5092F] shadow-sm shadow-[#E5092F]/60" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.id === 'orders' && pendingOrdersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E5092F] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
