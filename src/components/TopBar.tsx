import React from 'react';
import { useTelegram } from '../context/TelegramContext';
import { Bot, ArrowLeft } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  isBotMode: boolean;
  onToggleBotMode: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  isBotMode,
  onToggleBotMode,
  onBack,
  canGoBack = false
}) => {
  const { user, haptic } = useTelegram();
  const showBack = canGoBack || activeTab !== 'home' || isBotMode;

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-md border-b border-[#27272A] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Name / Back Button */}
        <div className="flex items-center gap-2">
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

          <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#151515] border border-[#27272A] p-0.5 shadow-md shadow-[#E5092F]/20 flex-shrink-0">
            <img
              src="/babistorelogo.jpg"
              alt="BABI STORE Logo"
              className="w-full h-full object-cover rounded-[9px]"
              onError={(e) => {
                // Fallback if image fails to load
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
            title="Toggle Telegram Bot Simulator"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBotMode ? 'Mini App' : 'Bot View'}</span>
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
