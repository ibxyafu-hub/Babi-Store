import React from 'react';
import { useTelegram } from '../context/TelegramContext';
import { Bot, ArrowLeft, Home, LayoutGrid, Package, Headphones, User } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  isBotMode: boolean;
  onToggleBotMode: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  onSelectTab?: (tab: any) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  isBotMode,
  onToggleBotMode,
  onBack,
  canGoBack = false,
  onSelectTab
}) => {
  const { user, haptic } = useTelegram();
  const showBack = canGoBack || activeTab !== 'home' || isBotMode;

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-md border-b border-[#27272A] px-4 py-3">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name / Back Button */}
        <div className="flex items-center gap-2.5">
          {showBack && onBack && (
            <button
              id="topbar-btn-back"
              onClick={() => {
                haptic('light');
                onBack();
              }}
              className="p-2 -ml-1 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white hover:border-[#E5092F]/50 hover:bg-[#1f1f1f] transition-all flex items-center justify-center shadow-sm"
              aria-label="Back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          )}

          <div
            onClick={() => {
              if (onSelectTab) {
                haptic('light');
                onSelectTab('home');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#151515] border border-[#27272A] p-0.5 shadow-md shadow-[#E5092F]/20 flex-shrink-0">
              <img
                src="/babistorelogo.jpg"
                alt="BABI STORE Logo"
                className="w-full h-full object-cover rounded-[9px]"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                    <div class="w-full h-full bg-[#111111] rounded-[9px] flex items-center justify-center font-extrabold text-xs">
                      <span class="text-[#E5092F]">B</span><span class="text-white">S</span>
                    </div>`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  BABI <span className="text-[#E5092F]">STORE</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E5092F]/10 text-[#E5092F] border border-[#E5092F]/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-[#A1A1AA] font-medium tracking-wide">
                Gaming • Telegram • Social
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile phones) */}
        {!isBotMode && onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 bg-[#120F14] border border-[#2B1B25] rounded-2xl p-1 shadow-inner">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`desktop-nav-${tab.id}`}
                  onClick={() => {
                    haptic('light');
                    onSelectTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E5092F] text-white shadow-md shadow-[#E5092F]/30'
                      : 'text-neutral-400 hover:text-white hover:bg-[#1A131C]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Telegram Bot Simulation Mode Switcher */}
          <button
            id="btn-toggle-bot-mode"
            onClick={() => {
              haptic('light');
              onToggleBotMode();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              isBotMode
                ? 'bg-[#E5092F] text-white border-[#E5092F] shadow-sm shadow-[#E5092F]/30'
                : 'bg-[#151515] text-[#A1A1AA] border-[#27272A] hover:bg-[#1b1b1b] hover:text-white'
            }`}
            title="Toggle BABI AI Chat"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBotMode ? 'Store App' : 'BABI AI Chat'}</span>
          </button>

          {/* User Badge - Username only */}
          <div className="flex items-center px-2.5 py-1.5 rounded-xl bg-[#151515] border border-[#27272A] shadow-sm">
            <span className="text-[11px] font-semibold text-neutral-200 truncate">
              {user.username ? `@${user.username}` : user.first_name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
