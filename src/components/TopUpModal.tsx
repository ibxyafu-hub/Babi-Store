import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gamepad2, Smartphone, Check, MessageSquare } from 'lucide-react';
import { TOPUP_GAMES_LIST, TOPUP_SOCIAL_LIST, BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface TopUpModalProps {
  isOpen: boolean;
  initialType: 'gaming' | 'social';
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, initialType, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gaming' | 'social'>(initialType);
  const [selectedGame, setSelectedGame] = useState(TOPUP_GAMES_LIST[0].name);
  const [selectedPlatform, setSelectedPlatform] = useState(TOPUP_SOCIAL_LIST[0].platform);
  const [userIdOrHandle, setUserIdOrHandle] = useState('');
  const [customPackage, setCustomPackage] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const { isDark } = useTheme();

  if (!isOpen) return null;

  const currentSelectionName = activeTab === 'gaming' ? selectedGame : selectedPlatform;

  const handleOpenTelegram = () => {
    const text = encodeURIComponent(
      `Hello Babi / Apex Creatives!\nI would like to order a ${
        activeTab === 'gaming' ? 'Gaming Top-Up' : 'Social Media Service'
      }:\n• Item/Game: ${currentSelectionName}\n• Account/User ID: ${userIdOrHandle || 'Pending'}\n• Package: ${
        customPackage || 'Standard Option'
      }`
    );
    window.open(`${BRAND_INFO.socials.telegram}?text=${text}`, '_blank');
  };

  const handleCopySummary = () => {
    const summaryText = `[Apex Creatives Order]\nType: ${
      activeTab === 'gaming' ? 'Gaming Top-Up' : 'Social Media Top-Up'
    }\nTarget: ${currentSelectionName}\nUser ID/Handle: ${userIdOrHandle || 'N/A'}\nPackage: ${
      customPackage || 'Standard Option'
    }`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 my-auto transition-colors duration-300 ${
            isDark ? 'bg-[#111111] border-white/15 text-white' : 'bg-white border-[#E5E5E5] text-[#111111]'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-neutral-50 border-[#E5E5E5]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-xs uppercase tracking-widest font-bold ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                DIGITAL SERVICES DESK
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close digital services modal"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#181818] border-white/10 text-[#A8A8A8] hover:text-white hover:border-[#FF2B2B]'
                  : 'bg-neutral-100 border-[#E5E5E5] text-[#666666] hover:text-[#111111] hover:border-[#E50914]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tab Switcher */}
            <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border ${
              isDark ? 'bg-[#0A0A0A] border-white/10' : 'bg-neutral-100 border-[#E5E5E5]'
            }`}>
              <button
                onClick={() => setActiveTab('gaming')}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'gaming'
                    ? 'bg-[#FF2B2B] text-white shadow-md'
                    : isDark ? 'text-[#A8A8A8] hover:text-white' : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>GAMING TOP-UP</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'social'
                    ? 'bg-[#FF2B2B] text-white shadow-md'
                    : isDark ? 'text-[#A8A8A8] hover:text-white' : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>SOCIAL TOP-UP</span>
              </button>
            </div>

            {/* Selection Form */}
            <div className="space-y-4">
              <div>
                <label className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  Select {activeTab === 'gaming' ? 'Game Title' : 'Social Platform'}
                </label>
                <select
                  value={activeTab === 'gaming' ? selectedGame : selectedPlatform}
                  onChange={(e) =>
                    activeTab === 'gaming'
                      ? setSelectedGame(e.target.value)
                      : setSelectedPlatform(e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#0A0A0A] border border-white/10 text-white focus:border-[#FF2B2B]'
                      : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] focus:bg-white focus:border-[#E50914]'
                  }`}
                >
                  {activeTab === 'gaming'
                    ? TOPUP_GAMES_LIST.map((g) => (
                        <option key={g.id} value={g.name} className={isDark ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}>
                          {g.name} ({g.popularItem})
                        </option>
                      ))
                    : TOPUP_SOCIAL_LIST.map((s) => (
                        <option key={s.id} value={s.platform} className={isDark ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}>
                          {s.platform} - {s.type}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  {activeTab === 'gaming' ? 'Player ID / Zone ID / UID' : 'Account Username / Link'}
                </label>
                <input
                  type="text"
                  placeholder={
                    activeTab === 'gaming' ? 'e.g. 12345678 (1234)' : 'e.g. @yourhandle or post link'
                  }
                  value={userIdOrHandle}
                  onChange={(e) => setUserIdOrHandle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${
                    isDark
                      ? 'bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B]'
                      : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  Package or Specific Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 Diamonds, 660 UC, 1K Followers, Custom pack"
                  value={customPackage}
                  onChange={(e) => setCustomPackage(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${
                    isDark
                      ? 'bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B]'
                      : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914]'
                  }`}
                />
              </div>
            </div>

            {/* Fast Order Execution Options */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleOpenTelegram}
                className="w-full py-4 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center gap-2 transition-all apex-glow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CONTINUE ORDER ON TELEGRAM</span>
              </button>

              <button
                onClick={handleCopySummary}
                className={`w-full py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1A1A1A] hover:bg-[#222222] text-white border-white/10'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-[#111111] border-[#E5E5E5]'
                }`}
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>COPIED ORDER SUMMARY TO CLIPBOARD</span>
                  </>
                ) : (
                  <span>COPY ORDER SUMMARY</span>
                )}
              </button>
            </div>

            <div className="text-center">
              <span className={`text-[11px] font-mono-tech ${
                isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
              }`}>
                Fast processing directly through Babi • Secure and direct communication.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
