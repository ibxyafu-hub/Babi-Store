import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, StoreCategory, MainCategory } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { WebsiteServicesSection } from './WebsiteServicesSection';
import {
  Gamepad2,
  TrendingUp,
  CreditCard,
  Smartphone,
  Globe,
  ChevronRight,
  ChevronDown,
  Zap,
  Search,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

interface CategoriesViewProps {
  categories: StoreCategory[];
  products: Product[];
  selectedCategoryFilter: string;
  selectedSubCategoryFilter?: string;
  onSelectCategoryFilter: (cat: string, subCat?: string) => void;
  onSelectProduct: (product: Product) => void;
  onBack?: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  products,
  selectedCategoryFilter,
  selectedSubCategoryFilter = 'all',
  onSelectCategoryFilter,
  onSelectProduct,
  onBack
}) => {
  const { haptic } = useTelegram();

  // Active Main Category ('gaming', 'social', or 'website')
  const [activeMainCategory, setActiveMainCategory] = useState<MainCategory>(
    selectedCategoryFilter === 'website' || selectedCategoryFilter === 'web-development'
      ? 'website'
      : selectedCategoryFilter === 'social' ||
        selectedCategoryFilter === 'social-services' ||
        selectedCategoryFilter === 'social-accounts'
      ? 'social'
      : 'gaming'
  );

  // Expanded subcategories state for accordion dropdown effect
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({
    'gaming-topup': true,
    'social-services': true
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize when external props change
  useEffect(() => {
    if (selectedCategoryFilter === 'website' || selectedCategoryFilter === 'web-development') {
      setActiveMainCategory('website');
    } else if (
      selectedCategoryFilter === 'social' ||
      selectedCategoryFilter === 'social-services' ||
      selectedCategoryFilter === 'social-accounts'
    ) {
      setActiveMainCategory('social');
      if (selectedCategoryFilter.startsWith('social-')) {
        setExpandedSubCategories((prev) => ({ ...prev, [selectedCategoryFilter]: true }));
      }
    } else if (
      selectedCategoryFilter === 'gaming' ||
      selectedCategoryFilter === 'gaming-topup' ||
      selectedCategoryFilter === 'gaming-accounts'
    ) {
      setActiveMainCategory('gaming');
      if (selectedCategoryFilter.startsWith('gaming-')) {
        setExpandedSubCategories((prev) => ({ ...prev, [selectedCategoryFilter]: true }));
      }
    }

    if (selectedSubCategoryFilter && selectedSubCategoryFilter !== 'all') {
      setExpandedSubCategories((prev) => ({ ...prev, [selectedSubCategoryFilter]: true }));
    }
  }, [selectedCategoryFilter, selectedSubCategoryFilter]);

  // Toggle subcategory accordion open/collapse
  const toggleSubCategory = (subId: string) => {
    haptic('light');
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Main visual category definitions with BABI STORE red accents
  const mainCategoriesList = [
    {
      id: 'gaming' as MainCategory,
      title: 'Gaming',
      subtitle: 'Top-Ups, Diamonds, Coins & UC',
      emoji: '🎮',
      icon: Gamepad2,
      badge: 'TOP UP & COINS',
      image:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      totalItems: products.filter((p) => p.category === 'gaming').length,
      badgeText: 'GAMING'
    },
    {
      id: 'social' as MainCategory,
      title: 'Social Media',
      subtitle: 'Stars, Premium, Boosts & Coins',
      emoji: '📱',
      icon: Smartphone,
      badge: 'SERVICES & BOOST',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      totalItems: products.filter((p) => p.category === 'social').length,
      badgeText: 'SOCIAL MEDIA'
    },
    {
      id: 'website' as MainCategory,
      title: 'Website Services',
      subtitle: 'Websites & Telegram Mini Apps',
      emoji: '🌐',
      icon: Globe,
      badge: 'CUSTOM BUILD',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
      totalItems: 'Custom',
      badgeText: 'WEB SERVICES'
    }
  ];

  // Subcategories mapping for active main category
  const subCategoryOptions =
    activeMainCategory === 'gaming'
      ? [
          {
            id: 'gaming-topup',
            name: 'Gaming Top Up',
            tagline: 'Instant Coins, Diamonds & UC',
            icon: CreditCard,
            emoji: '💳',
            desc: 'PUBG UC, Free Fire Diamonds, COD CP, eFootball Coins, FC Mobile',
            count: products.filter((p) => p.subCategory === 'gaming-topup').length
          }
        ]
      : [
          {
            id: 'social-services',
            name: 'Social Media Services',
            tagline: 'Stars, Premium & Boosts',
            icon: TrendingUp,
            emoji: '📈',
            desc: 'Telegram Stars, Telegram Premium, TikTok Coins, Boost, Snapchat+',
            count: products.filter((p) => p.subCategory === 'social-services').length
          }
        ];

  const getCategoryTitle = () => {
    if (activeMainCategory === 'website') return '🌐 Website Services';
    if (activeMainCategory === 'social') return '📱 Social Media';
    return '🎮 Gaming';
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Top Header & Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-start gap-3"
      >
        <button
          id="btn-categories-back"
          onClick={() => {
            haptic('light');
            if (onBack) {
              onBack();
            } else {
              onSelectCategoryFilter('all', 'all');
            }
          }}
          className="mt-0.5 p-2 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white hover:border-[#E5092F]/40 hover:bg-[#1f1f1f] transition-all flex items-center justify-center flex-shrink-0 active:scale-95"
          title="Back to Home"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA] font-medium mb-1">
            <button
              onClick={() => {
                haptic('light');
                if (onBack) onBack();
                else onSelectCategoryFilter('all', 'all');
              }}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#E5092F] font-bold">
              {getCategoryTitle()}
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {activeMainCategory === 'website'
              ? 'Website Services'
              : activeMainCategory === 'gaming'
              ? 'Gaming Catalog'
              : 'Social Media Services'}
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            {activeMainCategory === 'website'
              ? 'Custom business websites, web applications & Telegram Mini Apps'
              : activeMainCategory === 'gaming'
              ? 'Instant top-ups, diamonds, coins, CP & UC with automated delivery'
              : 'Telegram Stars, Premium, TikTok Coins, Boost & Snapchat+'}
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 🌟 MAIN CATEGORY CARDS                                                    */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        {!searchQuery.trim() && (
          <>
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#E5092F] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-300">
                  Select Category
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#A1A1AA]">
                3 Main Categories
              </span>
            </div>

            {/* THREE LARGE VISUAL MAIN CATEGORY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mainCategoriesList.map((cat, idx) => {
                const isSelected = activeMainCategory === cat.id;

                return (
                  <motion.button
                    key={cat.id}
                    id={`cat-card-${cat.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.08,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      haptic('medium');
                      setActiveMainCategory(cat.id);
                      onSelectCategoryFilter(cat.id, 'all');
                    }}
                    className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 transform-gpu ${
                      isSelected
                        ? 'border-[#E5092F] bg-[#141011] shadow-[0_0_24px_rgba(229,9,47,0.22)] ring-1 ring-[#E5092F]/40'
                        : 'border-[#27272A] bg-[#111111] hover:border-[#3f3f46] hover:bg-[#151515] shadow-lg shadow-black/40'
                    }`}
                  >
                    {/* Background Image with Cinematic Gradient */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                          isSelected
                            ? 'scale-105 opacity-35'
                            : 'opacity-20 group-hover:scale-105 group-hover:opacity-30'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-transparent" />
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#E5092F]/15 via-transparent to-black/60 opacity-100'
                            : 'bg-gradient-to-b from-black/40 to-black/80 opacity-80'
                        }`}
                      />
                    </div>

                    {/* Card Top Row: Badge & Status Pill */}
                    <div className="relative z-10 flex items-center justify-between mb-5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                          isSelected
                            ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40'
                            : 'bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10'
                        }`}
                      >
                        <span className="text-xs">{cat.emoji}</span>
                        <span>{cat.badgeText}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
                            isSelected
                              ? 'bg-[#E5092F]/20 text-white border border-[#E5092F]/40'
                              : 'bg-black/60 text-[#A1A1AA] border border-white/10'
                          }`}
                        >
                          {typeof cat.totalItems === 'number' ? `${cat.totalItems} items` : cat.totalItems}
                        </span>

                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#E5092F] animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Content */}
                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                            isSelected ? 'text-white' : 'text-neutral-100 group-hover:text-white'
                          }`}
                        >
                          {cat.title}
                        </h2>
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#E5092F] text-white shadow-sm shadow-[#E5092F]/40 scale-105'
                              : 'bg-black/50 border border-white/10 text-neutral-400 group-hover:text-white group-hover:border-white/20'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <p
                        className={`text-xs font-medium tracking-tight line-clamp-1 transition-colors ${
                          isSelected ? 'text-[#ff788f]' : 'text-[#A1A1AA]'
                        }`}
                      >
                        {cat.subtitle}
                      </p>
                    </div>

                    {/* Active Indicator Line on Card Bottom */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5092F] to-transparent z-20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* 🌐 WEBSITE SERVICES SPECIAL VIEW (IF WEBSITE CATEGORY IS SELECTED)        */}
        {/* ========================================================================= */}
        {activeMainCategory === 'website' ? (
          <WebsiteServicesSection onBack={onBack} />
        ) : (
          <div className="space-y-4 pt-1">
            {/* Search Input for Products */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                id="cat-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeMainCategory === 'gaming' ? 'eFootball, PUBG UC, Free Fire diamonds, FC Mobile...' : 'Telegram Stars, Premium, TikTok coins, Snapchat+...'}`}
                className="w-full bg-[#151515] border border-[#27272A] focus:border-[#E5092F] text-white text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none transition-all placeholder:text-[#A1A1AA]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ========================================================================= */}
            {/* 🔍 DIRECT SEARCH RESULTS (WHEN SEARCH QUERY IS ACTIVE)                    */}
            {/* ========================================================================= */}
            {searchQuery.trim() ? (
              <div className="space-y-3">
                {(() => {
                  const q = searchQuery.toLowerCase().trim();
                  const searchResults = products.filter((p) => {
                    return (
                      p.name.toLowerCase().includes(q) ||
                      p.tagline.toLowerCase().includes(q) ||
                      p.shortDescription.toLowerCase().includes(q) ||
                      (p.badge && p.badge.toLowerCase().includes(q)) ||
                      p.category.toLowerCase().includes(q) ||
                      p.subCategory.toLowerCase().includes(q)
                    );
                  });

                  return (
                    <>
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-[#E5092F] rounded-full" />
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300">
                            Search Results ({searchResults.length})
                          </h3>
                        </div>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-[11px] font-bold text-[#E5092F] hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>

                      {searchResults.length === 0 ? (
                        <div className="text-center py-12 bg-[#151515] rounded-2xl border border-[#27272A] p-6 space-y-2">
                          <Search className="w-8 h-8 text-neutral-600 mx-auto" />
                          <p className="text-sm font-bold text-white">No products found</p>
                          <p className="text-xs text-[#A1A1AA]">
                            No results found for "{searchQuery}". Try searching for PUBG, Telegram, or Diamonds.
                          </p>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-[#27272A] hover:bg-[#333] text-white text-xs font-semibold"
                          >
                            Clear Search
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {searchResults.map((product) => {
                            const lowestPrice = Math.min(...product.packages.map((pkg) => pkg.price));

                            return (
                              <motion.div
                                key={product.id}
                                id={`search-prod-card-${product.id}`}
                                whileHover={{ scale: 1.008 }}
                                whileTap={{ scale: 0.992 }}
                                onClick={() => {
                                  haptic('medium');
                                  onSelectProduct(product);
                                }}
                                className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-[#151515] hover:bg-[#1a1415] border border-[#27272A] hover:border-[#E5092F]/50 transition-all duration-200 gap-3 shadow-sm"
                              >
                                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-[#27272A] group-hover:border-[#E5092F]/40 transition-colors">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                    {product.badge && (
                                      <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-extrabold bg-[#080808]/90 text-[#E5092F] border border-[#E5092F]/30 backdrop-blur-sm">
                                        {product.badge.split(' ')[0]}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[#E5092F] transition-colors">
                                        {product.name}
                                      </h4>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {product.status}
                                      </span>
                                    </div>

                                    <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                      {product.shortDescription}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#A1A1AA] flex-wrap">
                                      <span className="flex items-center gap-1 text-[#E5092F] font-semibold">
                                        <Zap className="w-3 h-3 text-[#E5092F]" />
                                        {product.deliveryEstimate}
                                      </span>
                                      <span>•</span>
                                      <span className="text-neutral-300 font-medium">
                                        {product.packages.length} {product.packageType || 'packages'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272A] gap-3">
                                  <div className="sm:text-right">
                                    <span className="text-[9px] text-[#A1A1AA] uppercase tracking-wider block">
                                      Starting from
                                    </span>
                                    <span className="text-sm font-extrabold text-[#E5092F] font-mono">
                                      {formatPrice(lowestPrice, 'BIRR')}
                                    </span>
                                  </div>

                                  <button
                                    id={`btn-search-select-${product.id}`}
                                    type="button"
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c1c1c] group-hover:bg-[#E5092F] text-white text-xs font-bold border border-[#27272A] group-hover:border-[#E5092F] shadow-sm transition-all flex-shrink-0"
                                  >
                                    <span>Select</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              /* ========================================================================= */
              /* 🚀 ANIMATED ACCORDION / DROPDOWN SUBCATEGORY SECTIONS                      */
              /* ========================================================================= */
              <div className="space-y-3">
                {subCategoryOptions.map((sub, sIdx) => {
                  const isExpanded = !!expandedSubCategories[sub.id];
                  const IconComponent = sub.icon;

                  // Filter products that belong strictly to this subcategory
                  const subProducts = products.filter((p) => {
                    if (p.category !== activeMainCategory) return false;
                    if (p.subCategory !== sub.id) return false;
                    return true;
                  });

                  return (
                    <div
                      key={sub.id}
                      id={`subcat-accordion-${sub.id}`}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? 'bg-[#120e0f] border-[#E5092F]/60 shadow-lg shadow-[#E5092F]/10 ring-1 ring-[#E5092F]/30'
                          : 'bg-[#111111] border-[#27272A] hover:border-[#3f3f46]'
                      }`}
                    >
                      {/* Subcategory Accordion Header Trigger */}
                      <button
                        id={`subcat-trigger-${sub.id}`}
                        type="button"
                        onClick={() => toggleSubCategory(sub.id)}
                        className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                          isExpanded ? 'bg-[#171213]' : 'hover:bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              isExpanded
                                ? 'bg-[#E5092F] text-white shadow-md shadow-[#E5092F]/40'
                                : 'bg-[#181818] border border-[#27272A] text-neutral-300'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-white tracking-tight truncate">
                                {sub.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  isExpanded
                                    ? 'bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/40'
                                    : 'bg-[#1c1c1c] text-[#A1A1AA] border border-[#27272A]'
                                }`}
                              >
                                {subProducts.length} {subProducts.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#A1A1AA] font-medium line-clamp-1 mt-0.5">
                              {sub.tagline} • {sub.desc}
                            </p>
                          </div>
                        </div>

                        {/* Dropdown Chevron Indicator */}
                        <div className="flex items-center gap-2 pl-2">
                          <span className="hidden sm:inline text-[11px] font-semibold text-[#A1A1AA]">
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                              isExpanded
                                ? 'bg-[#E5092F] text-white'
                                : 'bg-[#181818] border border-[#27272A] text-[#A1A1AA]'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Smooth Animated Accordion Dropdown Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            id={`subcat-dropdown-${sub.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden border-t border-[#27272A]"
                          >
                            <div className="p-3.5 sm:p-4 space-y-2.5 bg-[#0f0f10]">
                              {subProducts.map((product) => {
                                const lowestPrice = Math.min(...product.packages.map((pkg) => pkg.price));

                                return (
                                  <motion.div
                                    key={product.id}
                                    id={`prod-card-${product.id}`}
                                    whileHover={{ scale: 1.008 }}
                                    whileTap={{ scale: 0.992 }}
                                    onClick={() => {
                                      haptic('medium');
                                      onSelectProduct(product);
                                    }}
                                    className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-[#151515] hover:bg-[#1a1415] border border-[#27272A] hover:border-[#E5092F]/50 transition-all duration-200 gap-3 shadow-sm"
                                  >
                                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                                      {/* Product Image */}
                                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-[#27272A] group-hover:border-[#E5092F]/40 transition-colors">
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          loading="lazy"
                                        />
                                        {product.badge && (
                                          <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-extrabold bg-[#080808]/90 text-[#E5092F] border border-[#E5092F]/30 backdrop-blur-sm">
                                            {product.badge.split(' ')[0]}
                                          </span>
                                        )}
                                      </div>

                                      {/* Product Info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h3 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[#E5092F] transition-colors">
                                            {product.name}
                                          </h3>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {product.status}
                                          </span>
                                        </div>

                                        <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                          {product.shortDescription}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#A1A1AA] flex-wrap">
                                          <span className="flex items-center gap-1 text-[#E5092F] font-semibold">
                                            <Zap className="w-3 h-3 text-[#E5092F]" />
                                            {product.deliveryEstimate}
                                          </span>
                                          <span>•</span>
                                          <span className="text-neutral-300 font-medium">
                                            {product.packages.length} {product.packageType || 'packages'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Price and Action Button */}
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272A] gap-3">
                                      <div className="sm:text-right">
                                        <span className="text-[9px] text-[#A1A1AA] uppercase tracking-wider block">
                                          Starting from
                                        </span>
                                        <span className="text-sm font-extrabold text-[#E5092F] font-mono">
                                          {formatPrice(lowestPrice, 'BIRR')}
                                        </span>
                                      </div>

                                      <button
                                        id={`btn-select-${product.id}`}
                                        type="button"
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c1c1c] group-hover:bg-[#E5092F] text-white text-xs font-bold border border-[#27272A] group-hover:border-[#E5092F] shadow-sm transition-all flex-shrink-0"
                                      >
                                        <span>Select</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};


