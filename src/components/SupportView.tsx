import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTelegram } from '../context/TelegramContext';
import {
  MessageCircle,
  Send,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface SupportViewProps {
  initialOrderId?: string;
  onBack?: () => void;
}

const STORE_RULES = [
  {
    number: 1,
    rule: 'እኛ የታዘዝነውን እቃ ማቅረብ እስካልቻልን ድረስ refund የለም'
  },
  {
    number: 2,
    rule: 'ብር ከላካቹ በኋላ የላካቹበት ማስረጃ(screenshot) ለኛ ሳትልኩ 20 ደቂቃ ካለፈው ተቀባይነት አይኖረውም!'
  },
  {
    number: 3,
    rule: 'ደረሰኝ ሳይልኩ ልኬአለው ብሎ መከራከር ጥቅም የለውም እንደዛ አያላችሁ 20 min ካለፈው ምንም አይነት ተቀባይነት አይኖረዉም'
  },
  {
    number: 4,
    rule: 'ክፍያ ከፈፀማችሁ በኋላ በቀኑ እቃቹን ካልተረከባቹ ከዛ በኋላ ላለው ሀላፊነት አኖስድም::'
  },
  {
    number: 5,
    rule: 'ከኛ የደርሶታል መልክት ከተቀበሉ በኋላ ምናልባት እቃው ካልደረሶት በ30 ደቂቃ ውስ አረጋግጦ ቅሬታ ማቅረብ 30ደቂቃ ካለፈ ሀላፊነት አኖስድም!'
  }
];

export const SupportView: React.FC<SupportViewProps> = ({ initialOrderId = '', onBack }) => {
  const { haptic, openTelegramLink } = useTelegram();
  const [copiedUsername, setCopiedUsername] = useState(false);

  const supportUsername = 'Raf_babi';
  const supportTelegramUrl = 'https://t.me/Raf_babi';

  const handleCopySupport = () => {
    navigator.clipboard.writeText(`@${supportUsername}`);
    setCopiedUsername(true);
    haptic('success');
    setTimeout(() => setCopiedUsername(false), 2000);
  };

  const handleOpenTelegramSupport = () => {
    haptic('heavy');
    const msg = initialOrderId.trim()
      ? `Hello BABI STORE Support, I need help with Order #${initialOrderId.trim()}`
      : `Hello BABI STORE Support, I need help with an order/product.`;
    const url = `${supportTelegramUrl}?text=${encodeURIComponent(msg)}`;
    openTelegramLink(url);
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-2xl mx-auto">
      {/* Header with optional Back Button */}
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button
            id="btn-support-back"
            onClick={() => {
              haptic('light');
              onBack();
            }}
            className="p-2.5 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white hover:border-[#E5092F]/50 hover:bg-[#1f1f1f] transition-all flex items-center justify-center flex-shrink-0"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              BABI STORE SUPPORT
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30 uppercase">
              Official
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            If you have an issue with an order, payment, or product, contact our support team.
          </p>
        </div>
      </div>

      {/* 💬 SUPPORT SECTION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1c1415] via-[#141416] to-[#111111] border border-[#E5092F]/30 space-y-4 shadow-xl shadow-black/60 relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base">👨‍💻</span>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Support Team
              </h2>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={supportTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptic('medium')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1213] hover:bg-[#261517] border border-[#E5092F]/40 hover:border-[#E5092F] text-white font-mono font-bold text-sm tracking-wide transition-all group"
              >
                <Send className="w-3.5 h-3.5 text-[#E5092F] group-hover:scale-110 transition-transform" />
                <span className="text-white">@{supportUsername}</span>
                <ExternalLink className="w-3 h-3 text-[#A1A1AA] group-hover:text-white transition-colors" />
              </a>

              <button
                type="button"
                onClick={handleCopySupport}
                className="p-2 rounded-xl bg-[#111111] hover:bg-[#1f1f1f] text-[#A1A1AA] hover:text-white border border-[#27272A] hover:border-white/20 transition-all text-xs"
                title="Copy Telegram Username"
                aria-label="Copy Username"
              >
                {copiedUsername ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 tracking-tight">
              Online
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Need quick assistance with your transaction, coin top-up, or custom service inquiry? Reach out directly via Telegram.
        </p>

        {/* Prominent Contact Support Button */}
        <button
          id="btn-contact-support-main"
          type="button"
          onClick={handleOpenTelegramSupport}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-sm shadow-lg shadow-[#E5092F]/30 transition-all transform active:scale-[0.98] border border-[#ff3355]/40"
        >
          <MessageCircle className="w-4 h-4 text-white fill-current" />
          <span>💬 Contact Support</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/80" />
        </button>
      </motion.div>

      {/* 📜 STORE RULES SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="p-4 sm:p-5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-4 shadow-xl shadow-black/50"
      >
        {/* Rules Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E5092F]/10 border border-[#E5092F]/30 flex items-center justify-center text-[#E5092F]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E5092F] block">
                📜 STORE RULES
              </span>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                እነዚን አንብቡ ከመግዛታቹ በፊት
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-amber-400 font-bold px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Important Terms</span>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-2.5">
          {STORE_RULES.map((item) => (
            <div
              key={item.number}
              className="group flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#151515] hover:bg-[#18181a] border border-[#27272A] hover:border-[#E5092F]/40 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#1a1213] border border-[#E5092F]/40 text-[#E5092F] flex items-center justify-center text-xs font-black font-mono shadow-sm group-hover:bg-[#E5092F] group-hover:text-white transition-colors">
                {item.number}
              </div>
              <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-normal flex-1 pt-0.5">
                {item.rule}
              </p>
            </div>
          ))}
        </div>

        {/* Warning / Reminder Footer */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#E5092F]/10 via-[#18181b] to-[#151515] border border-[#E5092F]/30 text-[11px] text-neutral-300">
          <ShieldAlert className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
          <span className="leading-tight">
            Please make sure you have reviewed these terms carefully before placing your order.
          </span>
        </div>
      </motion.div>
    </div>
  );
};

