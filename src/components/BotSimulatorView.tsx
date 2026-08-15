import React, { useState, useEffect, useRef } from 'react';
import { useTelegram } from '../context/TelegramContext';
import { STORE_CONFIG } from '../data/catalog';
import {
  Send,
  ShoppingBag,
  Package,
  Headphones,
  Sparkles,
  Bot,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface BotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  buttons?: { text: string; action: string }[];
}

interface BotSimulatorViewProps {
  onOpenStore: () => void;
  onOpenOrders: () => void;
  onOpenSupport: () => void;
  onCloseBotMode: () => void;
}

export const BotSimulatorView: React.FC<BotSimulatorViewProps> = ({
  onOpenStore,
  onOpenOrders,
  onOpenSupport,
  onCloseBotMode
}) => {
  const { user, haptic } = useTelegram();
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputCommand, setInputCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const executeCommand = async (cmd: string) => {
    const userMsg: BotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cmd,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputCommand('');
    setIsTyping(true);
    haptic('light');

    try {
      const response = await fetch('/api/bot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          user: {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
          }
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.success) {
        const botMsg: BotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          time: getCurrentTime(),
          buttons: data.buttons
        };
        setMessages((prev) => [...prev, botMsg]);
        haptic('medium');
      }
    } catch (err) {
      setIsTyping(false);
      const errorMsg: BotMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Error communicating with BABI STORE Bot service. Please check connection.`,
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  useEffect(() => {
    // Trigger initial /start command on mount
    executeCommand('/start');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleButtonClick = (action: string) => {
    haptic('medium');
    switch (action) {
      case 'open_app':
        onOpenStore();
        break;
      case 'my_orders':
      case 'open_orders':
        executeCommand('/orders');
        break;
      case 'support':
        executeCommand('/support');
        break;
      case 'open_support_chat':
        onOpenSupport();
        break;
      default:
        onOpenStore();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto bg-[#080808] text-white animate-fadeIn pb-safe">
      {/* Bot Chat Header */}
      <div className="p-3 bg-[#111111] border-b border-[#27272A] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-bot-back-to-store"
            onClick={() => {
              haptic('light');
              onCloseBotMode();
            }}
            className="w-8 h-8 rounded-lg bg-[#151515] border border-[#27272A] hover:bg-[#1b1b1b] flex items-center justify-center text-neutral-300"
            title="Back to Mini App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E5092F]/50 p-[1px] bg-[#151515] flex-shrink-0">
            <img
              src="/babistorelogo.jpg"
              alt="BABI STORE Bot"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080808]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white">BABI STORE Bot</h2>
              <span className="text-[10px] text-[#E5092F] font-mono">bot</span>
            </div>
            <p className="text-[10px] text-emerald-400">online • 24/7 automated</p>
          </div>
        </div>

        <button
          id="btn-bot-reset"
          onClick={() => {
            setMessages([]);
            executeCommand('/start');
          }}
          className="p-1.5 rounded-lg bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] text-[#A1A1AA] hover:text-white"
          title="Restart bot (/start)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-1.5 animate-fadeIn`}
          >
            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#E5092F] text-white font-semibold rounded-tr-none'
                  : 'bg-[#151515] text-neutral-100 border border-[#27272A] rounded-tl-none'
              }`}
            >
              {/* Render HTML formatted string safely */}
              <div
                dangerouslySetInnerHTML={{ __html: msg.text }}
                className="space-y-1"
              />
              <span
                className={`text-[9px] block text-right mt-1 font-mono ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-[#A1A1AA]'
                }`}
              >
                {msg.time}
              </span>
            </div>

            {/* Inline Telegram Keyboard Buttons */}
            {msg.buttons && msg.buttons.length > 0 && (
              <div className="w-[85%] space-y-1.5 mt-1">
                {msg.buttons.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    id={`btn-bot-inline-${bIdx}`}
                    onClick={() => handleButtonClick(btn.action)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border ${
                      btn.action === 'open_app'
                        ? 'bg-[#E5092F] hover:bg-[#c70828] text-white border-[#E5092F] shadow-md shadow-[#E5092F]/20'
                        : 'bg-[#111111] hover:bg-[#1b1b1b] text-neutral-200 border-[#27272A]'
                    }`}
                  >
                    <span>{btn.text}</span>
                    {btn.action === 'open_app' && <ExternalLink className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#151515] border border-[#27272A] text-[#A1A1AA] text-[11px] w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Persistent Quick Bot Keyboard */}
      <div className="p-2.5 bg-[#111111] border-t border-[#27272A] space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            id="btn-quick-open-store"
            onClick={() => handleButtonClick('open_app')}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#E5092F]/15 hover:bg-[#E5092F]/25 text-[#E5092F] border border-[#E5092F]/30 text-[11px] font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛍️ Open Store</span>
          </button>

          <button
            id="btn-quick-my-orders"
            onClick={() => handleButtonClick('my_orders')}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] text-[#A1A1AA] hover:text-white border border-[#27272A] text-[11px] font-bold"
          >
            <Package className="w-3.5 h-3.5" />
            <span>📦 My Orders</span>
          </button>

          <button
            id="btn-quick-support"
            onClick={() => handleButtonClick('support')}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] text-[#A1A1AA] hover:text-white border border-[#27272A] text-[11px] font-bold"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>💬 Support</span>
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputCommand.trim()) {
              executeCommand(inputCommand.trim());
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-bot-command"
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type /start, /orders, /support..."
            className="flex-1 bg-[#151515] border border-[#27272A] focus:border-[#E5092F] text-white text-xs rounded-xl px-3 py-2 outline-none font-mono placeholder:text-[#A1A1AA]"
          />
          <button
            id="btn-bot-send"
            type="submit"
            disabled={!inputCommand.trim()}
            className="w-9 h-9 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
