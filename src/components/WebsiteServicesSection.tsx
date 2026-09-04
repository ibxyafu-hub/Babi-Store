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
    <div className="space-y-5 sm:space-y-6">
      {/* Hero Service Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#27272A] bg-gradient-to-b from-[#161213] via-[#111111] to-[#0d0d0e] p-5 sm:p-6 lg:p-8 shadow-xl shadow-black/60"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E5092F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#E5092F]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Title & Pitch */}
          <div className="space-y-2.5 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30">
              <Globe className="w-3.5 h-3.5" />
              <span>Website Studio Services</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Need a website for your business?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Partner with <span className="text-[#E5092F] font-bold">BABI STORE</span> to design, build, and deploy your custom website, e-commerce storefront, or Telegram Mini App.
            </p>
          </div>

          {/* Quick Value Points */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 bg-[#140F13]/80 border border-[#2B1B25] p-3.5 sm:p-4 rounded-2xl flex-shrink-0 md:min-w-[280px]">
            <div className="flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Custom Web Design</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Telegram Mini Apps</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>Mobile-First & Fast</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
              <span>24/7 Tech Support</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="rounded-2xl sm:rounded-3xl border border-[#27272A] bg-[#111111] p-4 sm:p-6 lg:p-7 space-y-4 shadow-lg shadow-black/40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#E5092F] rounded-full" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E5092F]" />
              <span>Contact BABI STORE For Quotes & Inquiries</span>
            </h3>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            ● Available Daily
          </span>
        </div>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Phone Contact Item */}
          <a
            href={`tel:${phoneNumber}`}
            id="link-website-service-phone"
            onClick={() => haptic('medium')}
            className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#151515] hover:bg-[#1a1213] border border-[#27272A] hover:border-[#E5092F]/60 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/30 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                  Phone Number
                </span>
                <span className="text-base sm:text-lg font-black text-white group-hover:text-[#ff4d6d] font-mono tracking-tight transition-colors">
                  {phoneNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPhone}
                title="Copy phone number"
                className="p-2 rounded-xl bg-[#111111] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#27272A] transition-colors"
              >
                {copiedPhone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <div className="w-8 h-8 rounded-xl bg-[#111111] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
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
            className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#151515] hover:bg-[#1a1213] border border-[#27272A] hover:border-[#E5092F]/60 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/30 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                  Telegram Direct
                </span>
                <span className="text-base sm:text-lg font-black text-[#ff8093] group-hover:text-white font-mono tracking-tight transition-colors">
                  {telegramUsername}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyTg}
                title="Copy Telegram username"
                className="p-2 rounded-xl bg-[#111111] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#27272A] transition-colors"
              >
                {copiedTg ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <div className="w-8 h-8 rounded-xl bg-[#111111] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* TWO PROMINENT ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {/* Button 1: Call Now */}
          <a
            href={`tel:${phoneNumber}`}
            id="btn-website-call-now"
            onClick={() => haptic('heavy')}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl bg-[#151515] hover:bg-[#1f1f1f] text-white font-extrabold text-sm sm:text-base border border-[#27272A] hover:border-[#E5092F] shadow-md transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 text-[#E5092F]" />
            <span>Call Now</span>
          </a>

          {/* Button 2: Contact on Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-website-contact-telegram"
            onClick={() => haptic('heavy')}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#E5092F]/30 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Contact on Telegram</span>
          </a>
        </div>
      </motion.section>

      {/* Services Capabilities Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-200">
            What We Build
          </span>
          <span className="text-xs text-[#A1A1AA]">Custom Quote & Fast Delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {serviceHighlights.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#27272A] space-y-2.5 hover:border-[#E5092F]/40 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#111111] border border-[#27272A] text-[#E5092F] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{srv.title}</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{srv.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Project Workflow Card */}
      <section className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#111111] border border-[#27272A] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E5092F]" />
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
            How It Works
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#151515] border border-[#27272A] space-y-1">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 1</span>
            <span className="font-bold text-white text-xs">Contact Us</span>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Call or message @Raf_babi</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#151515] border border-[#27272A] space-y-1">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 2</span>
            <span className="font-bold text-white text-xs">Share Project</span>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Discuss requirements & goals</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#151515] border border-[#27272A] space-y-1">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 3</span>
            <span className="font-bold text-white text-xs">Quote & Design</span>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Get clear timeline & pricing</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#151515] border border-[#27272A] space-y-1">
            <span className="text-[10px] font-extrabold text-[#E5092F] block">STEP 4</span>
            <span className="font-bold text-white text-xs">Launch & Support</span>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Live deployment & 24/7 help</p>
          </div>
        </div>
      </section>
    </div>
  );
};
