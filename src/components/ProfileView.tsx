import React, { useState } from 'react';
import { OrderItem } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { STORE_CONFIG } from '../data/catalog';
import { formatPrice } from '../utils/formatters';
import {
  User,
  Package,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Headphones,
  Copy,
  Check,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  Info,
  ArrowLeft
} from 'lucide-react';

interface ProfileViewProps {
  orders: OrderItem[];
  onViewOrders: (statusFilter?: string) => void;
  onOpenSupport: () => void;
  onToggleBotMode: () => void;
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  onViewOrders,
  onOpenSupport,
  onToggleBotMode,
  onBack
}) => {
  const { user, isInsideTelegram, haptic, switchDemoUser } = useTelegram();
  const [copiedId, setCopiedId] = useState(false);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Completed').length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing'
  ).length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id.toString());
    setCopiedId(true);
    haptic('success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button
            id="btn-profile-back"
            onClick={() => {
              haptic('light');
              onBack();
            }}
            className="p-2 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white hover:border-[#E5092F]/40 hover:bg-[#1f1f1f] transition-all flex items-center justify-center flex-shrink-0"
            title="Back to Store"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Telegram Profile
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Connected via Telegram WebApp authentication
          </p>
        </div>
      </div>

      {/* User Identity Card */}
      <div className="p-4 rounded-3xl bg-[#151515] border border-[#27272A] space-y-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#E5092F]/50 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] font-extrabold text-xl flex items-center justify-center">
                {user.first_name.charAt(0)}
              </div>
            )}
            {user.is_premium && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E5092F] text-white flex items-center justify-center text-[10px] shadow-sm font-bold">
                ⭐
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-white truncate">
                {user.first_name} {user.last_name || ''}
              </h2>
              {user.is_premium && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E5092F]/15 text-[#E5092F] border border-[#E5092F]/30">
                  Premium
                </span>
              )}
            </div>

            <p className="text-xs text-[#E5092F] font-medium">
              {user.username ? `@${user.username}` : 'No username set'}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#A1A1AA] font-mono">
                ID: {user.id}
              </span>
              <button
                id="btn-copy-user-id"
                onClick={handleCopyUserId}
                className="text-[#A1A1AA] hover:text-white p-0.5"
                title="Copy Telegram User ID"
              >
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Auth status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#27272A] text-[11px]">
          <span className="text-[#A1A1AA] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Telegram Identity Verified
          </span>
          <span className="text-neutral-300 font-mono text-[10px]">
            {isInsideTelegram ? 'Telegram Native' : 'Simulator Mode'}
          </span>
        </div>
      </div>

      {/* Order Stats Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Order Activity
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Orders */}
          <div
            onClick={() => {
              haptic('light');
              onViewOrders('all');
            }}
            className="cursor-pointer p-3.5 rounded-2xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] transition-all"
          >
            <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
              <span className="text-xs font-medium">Total Orders</span>
              <Package className="w-4 h-4 text-[#E5092F]" />
            </div>
            <div className="text-xl font-extrabold text-white font-mono">
              {totalOrders}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Tap to view history</span>
          </div>

          {/* Completed Orders */}
          <div
            onClick={() => {
              haptic('light');
              onViewOrders('Completed');
            }}
            className="cursor-pointer p-3.5 rounded-2xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] transition-all"
          >
            <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
              <span className="text-xs font-medium">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {completedOrders}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Delivered successfully</span>
          </div>

          {/* Pending Orders */}
          <div
            onClick={() => {
              haptic('light');
              onViewOrders('Pending');
            }}
            className="cursor-pointer p-3.5 rounded-2xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] transition-all"
          >
            <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
              <span className="text-xs font-medium">Pending / Active</span>
              <Clock className="w-4 h-4 text-[#E5092F]" />
            </div>
            <div className="text-xl font-extrabold text-[#E5092F] font-mono">
              {pendingOrders}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">In dispatch queue</span>
          </div>

          {/* Total Spent */}
          <div className="p-3.5 rounded-2xl bg-[#151515] border border-[#27272A]">
            <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
              <span className="text-xs font-medium">Total Volume</span>
              <Coins className="w-4 h-4 text-[#E5092F]" />
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              {formatPrice(totalSpent, 'BIRR')}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Total store spend</span>
          </div>
        </div>
      </div>

      {/* Switch Demo Telegram User (Dev / Testing helper) */}
      <div className="p-3.5 rounded-2xl bg-[#151515] border border-[#27272A] space-y-2.5">
        <span className="text-xs font-bold text-neutral-300 block">
          Telegram User Switcher (Preview Mode)
        </span>
        <p className="text-[11px] text-[#A1A1AA]">
          Switch test identities to verify real Telegram user authentication isolation:
        </p>
        <div className="flex items-center gap-2">
          {['Raf (@Raf_babi)', 'Sarah (@sarah_stars)', 'David (@david_crypto)'].map(
            (label, idx) => (
              <button
                key={idx}
                id={`btn-switch-user-${idx}`}
                onClick={() => switchDemoUser(idx)}
                className="flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold bg-[#111111] hover:bg-[#E5092F] hover:text-white text-[#A1A1AA] border border-[#27272A] transition-colors"
              >
                {label.split(' ')[0]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Store & Bot Links */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Quick Links
        </h3>

        <div className="space-y-1.5">
          <button
            id="btn-profile-bot-sim"
            onClick={() => {
              haptic('medium');
              onToggleBotMode();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] text-xs font-semibold text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-[#E5092F]" />
              <span>Launch Telegram Bot Interface (/start)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
          </button>

          <button
            id="btn-profile-support"
            onClick={() => {
              haptic('light');
              onOpenSupport();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] text-xs font-semibold text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-[#E5092F]" />
              <span>Contact Live Support (@{STORE_CONFIG.supportUsername})</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
          </button>
        </div>
      </div>
    </div>
  );
};
