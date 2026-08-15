import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTelegram } from '../context/TelegramContext';
import {
  Globe,
  Phone,
  Send,
  MessageCircle,
  Code,
  Sparkles,
  Laptop,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Zap,
  Layers,
  Clock
} from 'lucide-react';

interface WebsiteServicesSectionProps {
  onBack?: () => void;
}

export const WebsiteServicesSection: React.FC<WebsiteServicesSectionProps> = ({ onBack }) => {
  const { haptic } = useTelegram();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);

  const phoneNumber = '0989678770';
  const telegramUsername = '@Raf_babi';
  const telegramUrl = 'https://t.me/Raf_babi';

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(phoneNumber);
    haptic('medium');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyTg = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(telegramUsername);
    haptic('medium');
    setCopiedTg(true);
    setTimeout(() => setCopiedTg(false), 2000);
  };

  const serviceHighlights = [
    {
      icon: Laptop,
      title: 'Business & Brand Websites',
      description: 'Modern, high-performance websites built to establish authority and attract customers.'
    },
    {
      icon: Layers,
      title: 'E-Commerce & Online Stores',
      description: 'Product catalogs, order management, and seamless Ethiopian payment checkout flows.'
    },
    {
      icon: Code,
      title: 'Telegram Mini Apps & WebApps',
      description: 'Interactive inside-Telegram apps and bots tailored for high-conversion sales in Ethiopia.'
    },
    {
      icon: Zap,
      title: 'Fast Delivery & Modern Tech',
      description: 'Clean responsive layouts, lightning fast loading speeds, and mobile-first experience.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Hero Service Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-[#27272A] bg-gradient-to-b from-[#161213] via-[#111111] to-[#0d0d0e] p-5 shadow-xl shadow-black/60"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E5092F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E5092F]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30">
            <Globe className="w-3.5 h-3.5" />
            <span>🌐 Website Services</span>
          </div>

          {/* Main Title & Pitch */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Need a website for your business?
            </h2>
            <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
              Contact <span className="text-[#E5092F] font-bold">BABI STORE</span> to discuss your project.
            </p>
          </div>

          {/* Quick Value Points */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Custom Web Design</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Telegram Mini Apps</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Mobile-First & Fast</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>24/7 Tech Support</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 📞 Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="rounded-2xl border border-[#27272A] bg-[#111111] p-4 space-y-3 shadow-lg shadow-black/40"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#E5092F] rounded-full" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <span>📞 Contact BABI STORE</span>
          </h3>
        </div>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Phone Contact Item */}
          <a
            href={`tel:${phoneNumber}`}
            id="link-website-service-phone"
            onClick={() => haptic('medium')}
            className="group flex items-center justify-between p-3.5 rounded-xl bg-[#151515] hover:bg-[#1a1213] border border-[#27272A] hover:border-[#E5092F]/60 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/30 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                  Phone Number
                </span>
                <span className="text-sm font-black text-white group-hover:text-[#E5092F] font-mono tracking-tight transition-colors">
                  {phoneNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyPhone}
                title="Copy phone number"
                className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#27272A] transition-colors"
              >
                {copiedPhone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <div className="w-7 h-7 rounded-lg bg-[#111111] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>

          {/* Telegram Contact Item */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="link-website-service-telegram"
            onClick={() => haptic('medium')}
            className="group flex items-center justify-between p-3.5 rounded-xl bg-[#151515] hover:bg-[#1a1213] border border-[#27272A] hover:border-[#E5092F]/60 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/30 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                  Telegram Direct
                </span>
                <span className="text-sm font-black text-[#E5092F] group-hover:text-white font-mono tracking-tight transition-colors">
                  {telegramUsername}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyTg}
                title="Copy Telegram username"
                className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#27272A] transition-colors"
              >
                {copiedTg ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <div className="w-7 h-7 rounded-lg bg-[#111111] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>
        </div>

        {/* 🌟 TWO PROMINENT ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Button 1: Call Now */}
          <a
            href={`tel:${phoneNumber}`}
            id="btn-website-call-now"
            onClick={() => haptic('heavy')}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#151515] hover:bg-[#1f1f1f] text-white font-extrabold text-sm border border-[#27272A] hover:border-[#E5092F] shadow-md transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 text-[#E5092F]" />
            <span>📞 Call Now</span>
          </a>

          {/* Button 2: Contact on Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-website-contact-telegram"
            onClick={() => haptic('heavy')}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-sm shadow-lg shadow-[#E5092F]/30 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>💬 Contact on Telegram</span>
          </a>
        </div>
      </motion.section>

      {/* Services Capabilities Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-300">
            What We Build
          </span>
          <span className="text-[11px] text-[#A1A1AA]">Custom Quote & Fast Delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {serviceHighlights.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="p-3.5 rounded-xl bg-[#151515] border border-[#27272A] space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#27272A] text-[#E5092F] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-tight">{srv.title}</h4>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{srv.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Project Workflow Card */}
      <section className="p-4 rounded-2xl bg-[#111111] border border-[#27272A] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E5092F]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
            How It Works
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#151515] border border-[#27272A]">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 1</span>
            <span className="font-bold text-white text-[11px]">Contact Us</span>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Call or message @Raf_babi</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#151515] border border-[#27272A]">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 2</span>
            <span className="font-bold text-white text-[11px]">Share Project</span>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Discuss requirements & goals</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#151515] border border-[#27272A]">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 3</span>
            <span className="font-bold text-white text-[11px]">Quote & Design</span>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Get clear timeline & pricing</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#151515] border border-[#27272A]">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 4</span>
            <span className="font-bold text-white text-[11px]">Launch & Support</span>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Live deployment & 24/7 help</p>
          </div>
        </div>
      </section>
    </div>
  );
};
