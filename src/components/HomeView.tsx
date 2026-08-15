import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, StoreCategory, OrderItem, ProductCategory, MainCategory, SubCategory } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import {
  Search,
  Zap,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Clock,
  ChevronRight,
  Sparkles,
  Gamepad2,
  TrendingUp,
  CreditCard,
  UserCheck,
  Smartphone,
  Globe,
  Phone,
  Send,
  MessageCircle,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface HomeViewProps {
  categories: StoreCategory[];
  products: Product[];
  recentOrders: OrderItem[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: ProductCategory, subCategory?: string) => void;
  onViewAllOrders: () => void;
  onViewOrderDetails: (order: OrderItem) => void;
}

const PROMO_BANNERS = [
  {
    id: 'promo-1',
    title: 'eFootball 2026 Coins & Accounts',
    tagline: 'Instant Automated Top-Up',
    description: 'Android & iOS coin packages and verified Konami ID Epic squads.',
    badge: '⚡ Instant 24/7',
    gradient: 'from-[#E5092F]/20 via-[#151515] to-[#080808]',
    borderColor: 'border-[#27272A]',
    accentColor: 'text-[#E5092F]',
    categoryTarget: 'gaming' as ProductCategory,
    subCategoryTarget: 'gaming-topup',
    productId: 'efootball-android-user'
  },
  {
    id: 'promo-2',
    title: 'Telegram Stars & Premium',
    tagline: 'Official Telegram Digital Store',
    description: 'Get Telegram Stars with 0% fee and instant transfer to @username.',
    badge: '⭐ 0% Fee',
    gradient: 'from-[#E5092F]/15 via-[#151515] to-[#080808]',
    borderColor: 'border-[#27272A]',
    accentColor: 'text-[#E5092F]',
    categoryTarget: 'social' as ProductCategory,
    subCategoryTarget: 'social-services',
    productId: 'telegram-stars'
  },
  {
    id: 'promo-3',
    title: 'PUBG UC & Free Fire Diamonds',
    tagline: 'Cheapest UID Top-Ups',
    description: 'Royale Pass & Elite Pass bundles directly delivered to your UID.',
    badge: '🔥 Best Rates',
    gradient: 'from-[#E5092F]/20 via-[#151515] to-[#080808]',
    borderColor: 'border-[#27272A]',
    accentColor: 'text-[#E5092F]',
    categoryTarget: 'gaming' as ProductCategory,
    subCategoryTarget: 'gaming-topup',
    productId: 'pubg-uc'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  products,
  recentOrders,
  onSelectProduct,
  onSelectCategory,
  onViewAllOrders,
  onViewOrderDetails
}) => {
  const { user, haptic } = useTelegram();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Active expanded main category for interactive subcategory browsing on home: 'gaming' or 'social'
  const [expandedMainCat, setExpandedMainCat] = useState<MainCategory>('gaming');

  // Filter popular products or search results
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products.filter((p) => p.isPopular);

  // Gaming subcategories
  const gamingSubcategories = [
    {
      id: 'gaming-topup',
      name: 'Gaming Top Up',
      emoji: '💳',
      icon: CreditCard,
      items: 'PUBG UC, Free Fire, COD CP, eFootball Coins, FC Mobile',
      count: products.filter((p) => p.subCategory === 'gaming-topup').length
    }
  ];

  // Social media subcategories
  const socialSubcategories = [
    {
      id: 'social-services',
      name: 'Social Media Services',
      emoji: '📈',
      icon: TrendingUp,
      items: 'Telegram Stars, Telegram Premium, TikTok Coins, Boost, Snapchat+',
      count: products.filter((p) => p.subCategory === 'social-services').length
    }
  ];

  const currentSubcategories =
    expandedMainCat === 'gaming' ? gamingSubcategories : socialSubcategories;

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Welcome & Search Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#A1A1AA] font-medium">Welcome back,</span>
              <span className="text-xs font-bold text-[#E5092F]">
                {user.first_name || 'Gamer'} 👋
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              What are we topping up today?
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            id="input-store-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PUBG UC, Stars, eFootball, Premium..."
            className="w-full bg-[#151515] border border-[#27272A] focus:border-[#E5092F] focus:bg-[#1b1b1b] text-white text-sm rounded-xl pl-10 pr-9 py-2.5 outline-none transition-all placeholder:text-[#A1A1AA]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white text-xs font-semibold px-1 py-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Promotional Banner Carousel */}
      {!searchQuery && (
        <section className="space-y-2">
          <div className="relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#151515]">
            {PROMO_BANNERS.map((banner, index) => {
              if (index !== activeBannerIndex) return null;
              return (
                <div
                  key={banner.id}
                  className={`p-4 bg-gradient-to-br ${banner.gradient} transition-all duration-300`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30">
                      {banner.badge}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] font-mono">
                      {index + 1} / {PROMO_BANNERS.length}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                    {banner.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      id={`btn-banner-action-${banner.id}`}
                      onClick={() => {
                        haptic('medium');
                        const prod = products.find((p) => p.id === banner.productId);
                        if (prod) onSelectProduct(prod);
                        else onSelectCategory(banner.categoryTarget, banner.subCategoryTarget);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-bold text-xs shadow-md shadow-[#E5092F]/25 transition-transform active:scale-95"
                    >
                      <span>Explore Deal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-1.5">
                      {PROMO_BANNERS.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => {
                            haptic('light');
                            setActiveBannerIndex(dotIdx);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dotIdx === activeBannerIndex ? 'w-5 bg-[#E5092F]' : 'w-1.5 bg-white/20'
                          }`}
                          aria-label={`Slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 🌟 2026 REDESIGNED CATEGORY SECTION: LARGE MODERN VISUAL CARDS            */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#E5092F] rounded-full" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300">
              Browse Categories
            </h2>
          </div>
          <button
            onClick={() => {
              haptic('light');
              onSelectCategory(expandedMainCat, 'all');
            }}
            className="text-xs text-[#E5092F] hover:text-[#ff3355] font-bold flex items-center gap-1 transition-colors"
          >
            <span>View All Items</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* THREE LARGE MODERN VISUAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. 🎮 GAMING CARD */}
          <motion.button
            id="home-main-cat-gaming"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              haptic('medium');
              if (expandedMainCat === 'gaming') {
                onSelectCategory('gaming', 'all');
              } else {
                setExpandedMainCat('gaming');
              }
            }}
            className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 transform-gpu ${
              expandedMainCat === 'gaming'
                ? 'border-[#E5092F] bg-[#141011] shadow-[0_0_24px_rgba(229,9,47,0.22)] ring-1 ring-[#E5092F]/40'
                : 'border-[#27272A] bg-[#111111] hover:border-[#3f3f46] hover:bg-[#151515] shadow-lg shadow-black/40'
            }`}
          >
            {/* Background Image with Cinematic Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
                alt="Gaming"
                className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                  expandedMainCat === 'gaming'
                    ? 'scale-105 opacity-35'
                    : 'opacity-20 group-hover:scale-105 group-hover:opacity-30'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-transparent" />
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  expandedMainCat === 'gaming'
                    ? 'bg-gradient-to-br from-[#E5092F]/15 via-transparent to-black/60 opacity-100'
                    : 'bg-gradient-to-b from-black/40 to-black/80 opacity-80'
                }`}
              />
            </div>

            {/* Card Top Row: Badge & Counter */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                  expandedMainCat === 'gaming'
                    ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40'
                    : 'bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10'
                }`}
              >
                <span className="text-xs">🎮</span>
                <span>GAMING</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
                    expandedMainCat === 'gaming'
                      ? 'bg-[#E5092F]/20 text-white border border-[#E5092F]/40'
                      : 'bg-black/60 text-[#A1A1AA] border border-white/10'
                  }`}
                >
                  {products.filter((p) => p.category === 'gaming').length} items
                </span>
                {expandedMainCat === 'gaming' && (
                  <span className="w-2 h-2 rounded-full bg-[#E5092F] animate-pulse" />
                )}
              </div>
            </div>

            {/* Card Bottom Content */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                    expandedMainCat === 'gaming'
                      ? 'text-white'
                      : 'text-neutral-100 group-hover:text-white'
                  }`}
                >
                  Gaming
                </h3>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    expandedMainCat === 'gaming'
                      ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40 scale-105'
                      : 'bg-black/50 border border-white/10 text-neutral-400 group-hover:text-white group-hover:border-white/20'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <p
                className={`text-xs font-medium tracking-tight line-clamp-1 transition-colors ${
                  expandedMainCat === 'gaming' ? 'text-[#ff788f]' : 'text-[#A1A1AA]'
                }`}
              >
                Instant Top-Ups, UC, Diamonds & Coins
              </p>
            </div>

            {expandedMainCat === 'gaming' && (
              <motion.div
                layoutId="homeActiveCatIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5092F] to-transparent z-20"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </motion.button>

          {/* 2. 📱 SOCIAL MEDIA CARD */}
          <motion.button
            id="home-main-cat-social"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              haptic('medium');
              if (expandedMainCat === 'social') {
                onSelectCategory('social', 'all');
              } else {
                setExpandedMainCat('social');
              }
            }}
            className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 transform-gpu ${
              expandedMainCat === 'social'
                ? 'border-[#E5092F] bg-[#141011] shadow-[0_0_24px_rgba(229,9,47,0.22)] ring-1 ring-[#E5092F]/40'
                : 'border-[#27272A] bg-[#111111] hover:border-[#3f3f46] hover:bg-[#151515] shadow-lg shadow-black/40'
            }`}
          >
            {/* Background Image with Cinematic Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80"
                alt="Social Media"
                className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                  expandedMainCat === 'social'
                    ? 'scale-105 opacity-35'
                    : 'opacity-20 group-hover:scale-105 group-hover:opacity-30'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-transparent" />
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  expandedMainCat === 'social'
                    ? 'bg-gradient-to-br from-[#E5092F]/15 via-transparent to-black/60 opacity-100'
                    : 'bg-gradient-to-b from-black/40 to-black/80 opacity-80'
                }`}
              />
            </div>

            {/* Card Top Row: Badge & Counter */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                  expandedMainCat === 'social'
                    ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40'
                    : 'bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10'
                }`}
              >
                <span className="text-xs">📱</span>
                <span>SOCIAL MEDIA</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
                    expandedMainCat === 'social'
                      ? 'bg-[#E5092F]/20 text-white border border-[#E5092F]/40'
                      : 'bg-black/60 text-[#A1A1AA] border border-white/10'
                  }`}
                >
                  {products.filter((p) => p.category === 'social').length} items
                </span>
                {expandedMainCat === 'social' && (
                  <span className="w-2 h-2 rounded-full bg-[#E5092F] animate-pulse" />
                )}
              </div>
            </div>

            {/* Card Bottom Content */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                    expandedMainCat === 'social'
                      ? 'text-white'
                      : 'text-neutral-100 group-hover:text-white'
                  }`}
                >
                  Social Media
                </h3>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    expandedMainCat === 'social'
                      ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40 scale-105'
                      : 'bg-black/50 border border-white/10 text-neutral-400 group-hover:text-white group-hover:border-white/20'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <p
                className={`text-xs font-medium tracking-tight line-clamp-1 transition-colors ${
                  expandedMainCat === 'social' ? 'text-[#ff788f]' : 'text-[#A1A1AA]'
                }`}
              >
                Stars, Premium, Boosts & Coins
              </p>
            </div>

            {expandedMainCat === 'social' && (
              <motion.div
                layoutId="homeActiveCatIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5092F] to-transparent z-20"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </motion.button>

          {/* 3. 🌐 WEBSITE SERVICES CARD */}
          <motion.button
            id="home-main-cat-website"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              haptic('medium');
              onSelectCategory('website', 'all');
            }}
            className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 transform-gpu ${
              expandedMainCat === 'website'
                ? 'border-[#E5092F] bg-[#141011] shadow-[0_0_24px_rgba(229,9,47,0.22)] ring-1 ring-[#E5092F]/40'
                : 'border-[#27272A] bg-[#111111] hover:border-[#3f3f46] hover:bg-[#151515] shadow-lg shadow-black/40'
            }`}
          >
            {/* Background Image with Cinematic Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
                alt="Website Services"
                className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                  expandedMainCat === 'website'
                    ? 'scale-105 opacity-35'
                    : 'opacity-20 group-hover:scale-105 group-hover:opacity-30'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-transparent" />
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  expandedMainCat === 'website'
                    ? 'bg-gradient-to-br from-[#E5092F]/15 via-transparent to-black/60 opacity-100'
                    : 'bg-gradient-to-b from-black/40 to-black/80 opacity-80'
                }`}
              />
            </div>

            {/* Card Top Row: Badge & Counter */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                  expandedMainCat === 'website'
                    ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40'
                    : 'bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10'
                }`}
              >
                <span className="text-xs">🌐</span>
                <span>WEB SERVICES</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
                    expandedMainCat === 'website'
                      ? 'bg-[#E5092F]/20 text-white border border-[#E5092F]/40'
                      : 'bg-black/60 text-[#A1A1AA] border border-white/10'
                  }`}
                >
                  Custom
                </span>
                {expandedMainCat === 'website' && (
                  <span className="w-2 h-2 rounded-full bg-[#E5092F] animate-pulse" />
                )}
              </div>
            </div>

            {/* Card Bottom Content */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                    expandedMainCat === 'website'
                      ? 'text-white'
                      : 'text-neutral-100 group-hover:text-white'
                  }`}
                >
                  Website Services
                </h3>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    expandedMainCat === 'website'
                      ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40 scale-105'
                      : 'bg-black/50 border border-white/10 text-neutral-400 group-hover:text-white group-hover:border-white/20'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <p
                className={`text-xs font-medium tracking-tight line-clamp-1 transition-colors ${
                  expandedMainCat === 'website' ? 'text-[#ff788f]' : 'text-[#A1A1AA]'
                }`}
              >
                Websites & Telegram Mini Apps
              </p>
            </div>

            {expandedMainCat === 'website' && (
              <motion.div
                layoutId="homeActiveCatIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5092F] to-transparent z-20"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </motion.button>
        </div>

        {/* ========================================================================= */}
        {/* 🚀 SMOOTH REVEAL OF SUBCATEGORIES ON SELECTION                             */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={expandedMainCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-3.5 bg-[#111111] rounded-2xl border border-[#27272A] space-y-2.5 shadow-md shadow-black/40"
          >
            {expandedMainCat === 'website' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🌐</span>
                    <span className="text-xs font-bold text-white tracking-tight">
                      Website Services & Telegram Apps
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      haptic('light');
                      onSelectCategory('website', 'all');
                    }}
                    className="text-[10px] font-bold text-[#E5092F] hover:text-[#ff3355] flex items-center gap-0.5"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#151515] border border-[#27272A] space-y-2">
                  <p className="text-xs text-white font-semibold">
                    Need a website for your business? Contact BABI STORE to discuss your project.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href="tel:0989678770"
                      onClick={() => haptic('medium')}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#1f1f1f] border border-[#27272A] hover:border-[#E5092F]/50 text-white font-medium transition-all"
                    >
                      <span className="flex items-center gap-2 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-[#E5092F]" />
                        <span>0989678770</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#E5092F]">Call</span>
                    </a>

                    <a
                      href="https://t.me/Raf_babi"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => haptic('medium')}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#1f1f1f] border border-[#27272A] hover:border-[#E5092F]/50 text-white font-medium transition-all"
                    >
                      <span className="flex items-center gap-2 text-[11px]">
                        <Send className="w-3.5 h-3.5 text-[#E5092F]" />
                        <span>@Raf_babi</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#E5092F]">Chat</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="tel:0989678770"
                    onClick={() => haptic('heavy')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#151515] hover:bg-[#1f1f1f] text-white font-bold text-xs border border-[#27272A] hover:border-[#E5092F] transition-all text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E5092F]" />
                    <span>📞 Call Now</span>
                  </a>
                  <a
                    href="https://t.me/Raf_babi"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => haptic('heavy')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-bold text-xs shadow-md shadow-[#E5092F]/30 transition-all text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    <span>💬 Telegram</span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">
                      {expandedMainCat === 'gaming' ? '🎮' : '📱'}
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight">
                      {expandedMainCat === 'gaming' ? 'Gaming' : 'Social Media'} Subcategories
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#A1A1AA]">
                    Tap to explore
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSubcategories.map((sub, subIdx) => {
                    const IconComp = sub.icon;
                    return (
                      <motion.button
                        key={sub.id}
                        id={`home-subcat-${sub.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: subIdx * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => {
                          haptic('medium');
                          onSelectCategory(expandedMainCat, sub.id);
                        }}
                        className="group flex flex-col p-3 rounded-xl bg-[#151515] hover:bg-[#1a1213] border border-[#27272A] hover:border-[#E5092F]/50 transition-all text-left"
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#27272A] text-neutral-300 group-hover:text-white group-hover:border-[#E5092F]/40 flex items-center justify-center transition-colors">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#111111] text-[#A1A1AA] border border-[#27272A] group-hover:text-[#E5092F] group-hover:border-[#E5092F]/30 transition-colors">
                              {sub.count} items
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#E5092F] transition-colors" />
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-white group-hover:text-[#E5092F] transition-colors line-clamp-1">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA] line-clamp-1 mt-0.5">
                          {sub.items}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Recent Orders Section (if user has orders) */}
      {recentOrders.length > 0 && !searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E5092F]" />
              Recent Orders
            </h2>
            <button
              onClick={() => {
                haptic('light');
                onViewAllOrders();
              }}
              className="text-xs text-[#E5092F] hover:text-[#ff3355] font-semibold flex items-center gap-1"
            >
              View All ({recentOrders.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentOrders.slice(0, 2).map((order) => (
              <div
                key={order.orderId}
                onClick={() => {
                  haptic('light');
                  onViewOrderDetails(order);
                }}
                className="cursor-pointer flex items-center justify-between p-3 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] hover:border-[#E5092F]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-[#27272A]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{order.productName}</span>
                      <span className="font-mono text-[10px] text-[#A1A1AA]">
                        #{order.orderId}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                      {order.packageName} • {formatPrice(order.totalPrice, 'BIRR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.orderStatus === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : order.orderStatus === 'Processing'
                        ? 'bg-[#E5092F]/15 text-[#E5092F] border-[#E5092F]/30'
                        : order.orderStatus === 'Confirmed'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-neutral-500/10 text-neutral-300 border-neutral-500/20'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Products / Search Results */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#E5092F]" />
            {searchQuery ? `Search Results (${filteredProducts.length})` : 'Popular Products'}
          </h2>
          {!searchQuery && (
            <button
              onClick={() => {
                haptic('light');
                onSelectCategory('gaming', 'all');
              }}
              className="text-[11px] text-[#A1A1AA] hover:text-[#E5092F] flex items-center gap-1 transition-colors font-medium"
            >
              <span>See all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-[#151515] rounded-2xl border border-[#27272A]">
            <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-300 font-semibold">No products found</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Try searching for coins, stars, or UC</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const lowestPrice = Math.min(...product.packages.map((pkg) => pkg.price));
              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  onClick={() => {
                    haptic('medium');
                    onSelectProduct(product);
                  }}
                  className="group cursor-pointer flex flex-col justify-between rounded-2xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] hover:border-[#E5092F]/50 p-3 transition-all duration-200 active:scale-[0.98]"
                >
                  <div>
                    {/* Thumbnail & Badge */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-neutral-900 border border-[#27272A]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#080808]/90 text-[#E5092F] backdrop-blur-md border border-[#E5092F]/30">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/80 text-neutral-300 backdrop-blur-sm">
                        {product.packages.length} packs
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xs font-bold text-white tracking-tight group-hover:text-[#E5092F] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-[#A1A1AA] line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-3 pt-2.5 border-t border-[#27272A] flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {product.popularPriceText ? (
                        <div className="flex flex-col">
                          <span className="text-[9px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                            Featured Deal
                          </span>
                          <span className="text-[11px] font-extrabold text-[#E5092F] font-mono tracking-tight line-clamp-1">
                            {product.popularPriceText}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] text-[#A1A1AA] block uppercase tracking-wider">From</span>
                          <span className="text-xs font-extrabold text-[#E5092F] font-mono">
                            {formatPrice(lowestPrice, 'BIRR')}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic('medium');
                        onSelectProduct(product);
                      }}
                      id={`btn-popular-arrow-${product.id}`}
                      aria-label={`View ${product.name} packages list`}
                      className="w-7 h-7 rounded-xl bg-[#E5092F]/10 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-90 border border-[#E5092F]/20 group-hover:border-[#E5092F]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Cards */}
      <section className="p-4 rounded-2xl bg-[#151515] border border-[#27272A] space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#111111] border border-[#27272A]/50">
            <Zap className="w-4 h-4 text-[#E5092F] mb-1" />
            <span className="text-[11px] font-bold text-white">Instant</span>
            <span className="text-[9px] text-[#A1A1AA]">1-5 mins delivery</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#111111] border border-[#27272A]/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] font-bold text-white">100% Safe</span>
            <span className="text-[9px] text-[#A1A1AA]">Official channels</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#111111] border border-[#27272A]/50">
            <Headphones className="w-4 h-4 text-[#E5092F] mb-1" />
            <span className="text-[11px] font-bold text-white">24/7 Live</span>
            <span className="text-[9px] text-[#A1A1AA]">Fast assistance</span>
          </div>
        </div>
      </section>
    </div>
  );
};
