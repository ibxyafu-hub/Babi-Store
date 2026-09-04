import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, StoreCategory, MainCategory, StoreSubCategory } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { WebsiteServicesSection } from './WebsiteServicesSection';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Package,
  Zap,
  CreditCard,
  TrendingUp,
  Code,
  Gamepad2,
  Smartphone,
  Globe,
  ShoppingBag,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Users,
  X,
  Clock,
  Send,
  Copy,
  Check,
  Phone
} from 'lucide-react';

interface CategoriesViewProps {
  categories: StoreCategory[];
  products: Product[];
  selectedCategoryFilter?: string | null;
  selectedSubCategoryFilter?: string;
  onSelectCategoryFilter: (cat: string | null, subCat?: string) => void;
  onSelectProduct: (product: Product) => void;
  onBack?: () => void;
}

// Curated high-res imagery & metadata for primary categories
const CATEGORY_META: Record<
  string,
  {
    image: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    badge: string;
    previewTags: string[];
  }
> = {
  gaming: {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    icon: Gamepad2,
    accent: '#E5092F',
    badge: 'Instant Delivery',
    previewTags: ['PUBG UC', 'Free Fire', 'COD CP', 'eFootball', 'FC Mobile']
  },
  social: {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    icon: Smartphone,
    accent: '#E5092F',
    badge: 'Official Services',
    previewTags: ['Telegram Stars', 'Telegram Premium', 'TikTok Coins', 'FB Boost']
  },
  website: {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    icon: Globe,
    accent: '#E5092F',
    badge: 'Custom Solutions',
    previewTags: ['Custom Websites', 'Telegram Mini Apps', '24/7 Tech Support']
  }
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  products,
  selectedCategoryFilter,
  selectedSubCategoryFilter = 'all',
  onSelectCategoryFilter,
  onSelectProduct,
  onBack
}) => {
  const { haptic, openTelegramLink } = useTelegram();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTg, setCopiedTg] = useState(false);
  const [showFacebookContactModal, setShowFacebookContactModal] = useState(false);
  const [copiedContactPhone, setCopiedContactPhone] = useState(false);
  const [copiedContactTg, setCopiedContactTg] = useState(false);

  const isFacebookBoostProduct = (prod: Product | null | undefined) => {
    if (!prod) return false;
    return prod.id === 'facebook-boost' || prod.name.toLowerCase().includes('facebook');
  };

  const handleCopyTg = (text: string) => {
    haptic('selectionChanged');
    navigator.clipboard.writeText(text);
    setCopiedTg(true);
    setTimeout(() => setCopiedTg(false), 2000);
  };

  const renderFacebookContactModal = () => (
    <AnimatePresence>
      {showFacebookContactModal && (
        <div
          id="modal-facebook-contact"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowFacebookContactModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#140F15] border border-[#2B1B25] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden space-y-5 text-center"
          >
            {/* Ambient Red Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E5092F]/15 blur-[60px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              id="btn-close-facebook-contact"
              onClick={() => {
                haptic('light');
                setShowFacebookContactModal(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1E141E] hover:bg-[#2A1B28] text-neutral-400 hover:text-white border border-[#3A2233] flex items-center justify-center transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] flex items-center justify-center mx-auto shadow-lg shadow-[#E5092F]/20 relative z-10">
              <TrendingUp className="w-7 h-7 text-[#E5092F]" />
            </div>

            {/* Contact Me Message */}
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] text-[11px] font-mono font-bold border border-[#E5092F]/30 uppercase tracking-wider">
                Facebook Page Boost
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Contact Me
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xs mx-auto">
                For Facebook Page Boost services, please contact me directly:
              </p>
            </div>

            {/* Contact Information & Links */}
            <div className="space-y-3 relative z-10 text-left">
              {/* Phone Link */}
              <div className="p-3.5 rounded-2xl bg-[#100C12] border border-[#2D1C28] hover:border-[#E5092F]/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="tel:0989678770"
                    id="link-facebook-phone"
                    onClick={() => haptic('selectionChanged')}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block tracking-wider">
                        Phone
                      </span>
                      <span className="text-sm sm:text-base font-mono font-black text-white group-hover:text-emerald-400 transition-colors tracking-wide underline underline-offset-2 decoration-emerald-500/50">
                        0989678770
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      id="btn-copy-facebook-phone"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic('selectionChanged');
                        navigator.clipboard.writeText('0989678770');
                        setCopiedContactPhone(true);
                        setTimeout(() => setCopiedContactPhone(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-[#1E141E] hover:bg-[#2A1B28] border border-[#3A2233] text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="Copy Phone Number"
                    >
                      {copiedContactPhone ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                    <a
                      href="tel:0989678770"
                      id="btn-dial-facebook-phone"
                      onClick={() => haptic('selectionChanged')}
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Telegram Link */}
              <div className="p-3.5 rounded-2xl bg-[#100C12] border border-[#2D1C28] hover:border-[#E5092F]/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="https://t.me/Raf_babi"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="link-facebook-telegram"
                    onClick={() => {
                      haptic('selectionChanged');
                      openTelegramLink('https://t.me/Raf_babi');
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#29b6f6] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block tracking-wider">
                        Telegram
                      </span>
                      <span className="text-sm sm:text-base font-mono font-black text-white group-hover:text-[#29b6f6] transition-colors tracking-wide underline underline-offset-2 decoration-[#0088cc]/50">
                        @Raf_babi
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      id="btn-copy-facebook-telegram"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic('selectionChanged');
                        navigator.clipboard.writeText('@Raf_babi');
                        setCopiedContactTg(true);
                        setTimeout(() => setCopiedContactTg(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-[#1E141E] hover:bg-[#2A1B28] border border-[#3A2233] text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="Copy Telegram Username"
                    >
                      {copiedContactTg ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                    <a
                      href="https://t.me/Raf_babi"
                      target="_blank"
                      rel="noopener noreferrer"
                      id="btn-chat-facebook-telegram"
                      onClick={() => {
                        haptic('selectionChanged');
                        openTelegramLink('https://t.me/Raf_babi');
                      }}
                      className="px-3 py-2 rounded-lg bg-[#E5092F] hover:bg-[#c70828] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Active category: if null, we show the MAIN CATEGORIES screen. If set, we show that category's view!
  const activeCategoryId = selectedCategoryFilter || null;

  // Find the selected category object
  const selectedCategory = useMemo(() => {
    if (!activeCategoryId) return null;
    return categories.find((c) => c.id === activeCategoryId) || null;
  }, [categories, activeCategoryId]);

  // Products belonging to the selected category
  const activeCategoryProducts = useMemo(() => {
    if (!activeCategoryId) return [];
    return products.filter((p) => p.category === activeCategoryId);
  }, [products, activeCategoryId]);

  // Subcategories belonging to this category - strictly enforce category navigation structure
  const subcategories: StoreSubCategory[] = useMemo(() => {
    if (!selectedCategory) return [];

    if (selectedCategory.id === 'gaming') {
      return [
        {
          id: 'gaming-topup',
          mainCategoryId: 'gaming',
          name: 'Gaming Top Up',
          emoji: '💳',
          icon: 'CreditCard',
          description: 'PUBG UC, Free Fire Diamonds, COD CP, eFootball Coins, FC Mobile'
        },
        {
          id: 'gaming-accounts',
          mainCategoryId: 'gaming',
          name: 'Accounts',
          emoji: '🛡️',
          icon: 'ShieldCheck',
          description: 'Verified game accounts, Konami ID squads & custom orders'
        }
      ];
    }

    if (selectedCategory.id === 'social') {
      return [
        {
          id: 'social-services',
          mainCategoryId: 'social',
          name: 'Social Media Services',
          emoji: '📈',
          icon: 'TrendingUp',
          description: 'Telegram Stars, Telegram Premium, TikTok Coins, FB Boost, Snapchat+'
        },
        {
          id: 'social-accounts',
          mainCategoryId: 'social',
          name: 'Accounts',
          emoji: '👥',
          icon: 'Users',
          description: 'Monetized & aged social accounts, verified channels'
        }
      ];
    }

    return selectedCategory.subcategories && selectedCategory.subcategories.length > 0
      ? selectedCategory.subcategories
      : [
          {
            id: `${selectedCategory.id}-default` as any,
            mainCategoryId: selectedCategory.id,
            name: selectedCategory.name,
            emoji: selectedCategory.emoji,
            icon: selectedCategory.icon,
            description: selectedCategory.description
          }
        ];
  }, [selectedCategory]);

  // Helper for subcategory icon
  const renderSubCategoryIcon = (iconName: string, subId: string) => {
    switch (iconName?.toLowerCase() || subId?.toLowerCase()) {
      case 'creditcard':
      case 'gaming-topup':
        return <CreditCard className="w-5 h-5 text-[#E5092F]" />;
      case 'shieldcheck':
      case 'gaming-accounts':
        return <ShieldCheck className="w-5 h-5 text-[#E5092F]" />;
      case 'trendingup':
      case 'social-services':
        return <TrendingUp className="w-5 h-5 text-[#E5092F]" />;
      case 'users':
      case 'social-accounts':
        return <Users className="w-5 h-5 text-[#E5092F]" />;
      case 'code':
      case 'web-development':
        return <Code className="w-5 h-5 text-[#E5092F]" />;
      default:
        return <Layers className="w-5 h-5 text-[#E5092F]" />;
    }
  };

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery('');
  }, [activeCategoryId, selectedSubCategoryFilter]);

  // =========================================================================
  // VIEW 1: MAIN CATEGORIES SCREEN (When no category is selected)
  // =========================================================================
  if (!selectedCategory) {
    // Filter categories if user types a search query
    const filteredCategories = categories.filter((cat) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchCat = cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
      const matchProd = products.some(
        (p) =>
          p.category === cat.id &&
          (p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q))
      );
      return matchCat || matchProd;
    });

    // Also match individual products if user searches
    const matchingSearchProducts = searchQuery.trim()
      ? products.filter((p) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
          );
        })
      : [];

    return (
      <div className="space-y-5 pb-6 sm:pb-8 animate-fadeIn relative w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Ambient background glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-xl h-36 bg-[#E5092F]/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        {/* Clean Modern Header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Store Categories
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select a category to browse subcategories, game top-ups, and services
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              id="category-search-bar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories, games, stars, coins, packages..."
              className="w-full bg-[#110E12] border border-[#271920] focus:border-[#E5092F] text-white text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 outline-none transition-all placeholder:text-neutral-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  haptic('light');
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* MAIN CATEGORIES: Compact Clean Clickable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {filteredCategories.map((category, idx) => {
            const meta = CATEGORY_META[category.id] || {
              image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
              icon: Gamepad2,
              accent: '#E5092F',
              badge: 'Category',
              previewTags: []
            };
            const CategoryIcon = meta.icon;
            const categoryProducts = products.filter((p) => p.category === category.id);
            const countLabel = category.id === 'website' ? 'Custom Studio' : `${categoryProducts.length} Items`;

            return (
              <motion.div
                key={category.id}
                id={`main-category-card-${category.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  haptic('medium');
                  onSelectCategoryFilter(category.id, 'all');
                }}
                className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#271B23] hover:border-[#E5092F]/60 bg-gradient-to-br from-[#140F15] via-[#100D12] to-[#0A080C] hover:bg-[#160E16] p-3.5 sm:p-4 transition-all duration-200 shadow-md shadow-black/40 flex flex-col justify-between"
              >
                {/* Subtle high-res background preview */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-15 group-hover:opacity-25 transition-opacity">
                  <img
                    src={meta.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A080C] via-[#0A080C]/85 to-[#140F15]/70" />
                </div>

                {/* Card Top Row: Icon & Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] flex items-center justify-center text-lg shadow-sm group-hover:bg-[#E5092F] group-hover:text-white transition-all">
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1C121A] text-[#ff8093] border border-[#331C28] group-hover:border-[#E5092F]/40 transition-colors">
                    {countLabel}
                  </span>
                </div>

                {/* Card Middle: Title, Description & Sample Tags */}
                <div className="relative z-10 mt-2.5 space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-white group-hover:text-[#ff4d6d] tracking-tight transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-xs text-neutral-400 line-clamp-1 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Subcategory / Item Preview Pills */}
                  {meta.previewTags && meta.previewTags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {meta.previewTags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#191118] text-neutral-300 border border-[#2B1B25]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Link */}
                <div className="relative z-10 mt-3 pt-2.5 border-t border-[#23151F] flex items-center justify-between text-xs font-bold text-neutral-300 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-1 text-[#ff8093] group-hover:text-[#E5092F] font-bold tracking-wide uppercase text-[10px]">
                    Browse {category.name}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#191018] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* If user searched and found products directly, show them below */}
        {searchQuery.trim() && matchingSearchProducts.length > 0 && (
          <div className="mt-8 space-y-3 pt-6 border-t border-[#251821]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#E5092F]" />
                <span>Matching Products ({matchingSearchProducts.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {matchingSearchProducts.map((prod) => {
                const lowestPrice = Math.min(...prod.packages.map((pkg) => pkg.price));
                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      haptic('medium');
                      if (isFacebookBoostProduct(prod)) {
                        setShowFacebookContactModal(true);
                        return;
                      }
                      onSelectProduct(prod);
                    }}
                    className="cursor-pointer p-3.5 rounded-2xl bg-[#130E14] border border-[#271922] hover:border-[#E5092F]/50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-[#2C1C26] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{prod.name}</h4>
                        <span className="text-xs font-mono font-bold text-[#ff4d6d]">
                          From {formatPrice(lowestPrice, 'BIRR')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[#E5092F] text-white text-xs font-bold shadow-sm"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Facebook Boost Contact Me Modal */}
        {renderFacebookContactModal()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SELECTED CATEGORY DETAIL SCREEN
  // Shows ONLY the subcategories & items belonging to THIS category
  // =========================================================================
  const meta = CATEGORY_META[selectedCategory.id] || {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    icon: Gamepad2,
    accent: '#E5092F',
    badge: 'Store',
    previewTags: []
  };
  const CategoryIcon = meta.icon;

  // Filter products by search query inside this category
  const filteredCategoryProducts = activeCategoryProducts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  });

  // Check if a specific subcategory option is selected
  const isSubCategorySelected = Boolean(
    selectedSubCategoryFilter && selectedSubCategoryFilter !== 'all'
  );
  const activeSubCategory = isSubCategorySelected
    ? subcategories.find((s) => s.id === selectedSubCategoryFilter) || null
    : null;

  return (
    <motion.div
      key={`category-screen-${selectedCategory.id}-${selectedSubCategoryFilter || 'all'}`}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="space-y-5 pb-6 sm:pb-8 relative w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto"
    >
      {/* Top Navigation Row: Back Button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {activeSubCategory ? (
          /* Back button to the Options list within this category */
          <button
            type="button"
            id="btn-back-to-options"
            onClick={() => {
              haptic('light');
              onSelectCategoryFilter(selectedCategory.id, 'all');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140F15] hover:bg-[#1E141E] border border-[#2B1B25] hover:border-[#E5092F]/60 text-neutral-200 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E5092F]" />
            <span>{selectedCategory.name}</span>
          </button>
        ) : (
          /* Back button to Main Categories */
          <button
            type="button"
            id="btn-back-to-categories"
            onClick={() => {
              haptic('light');
              onSelectCategoryFilter(null);
              if (onBack) onBack();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140F15] hover:bg-[#1E141E] border border-[#2B1B25] hover:border-[#E5092F]/60 text-neutral-200 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E5092F]" />
            <span>All Categories</span>
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <span
            onClick={() => {
              haptic('light');
              onSelectCategoryFilter(null);
            }}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Categories
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span
            onClick={() => {
              if (activeSubCategory) {
                haptic('light');
                onSelectCategoryFilter(selectedCategory.id, 'all');
              }
            }}
            className={`flex items-center gap-1.5 transition-colors ${
              activeSubCategory ? 'hover:text-white cursor-pointer' : 'text-[#ff8093] font-bold'
            }`}
          >
            <CategoryIcon className="w-3.5 h-3.5 text-[#E5092F]" />
            <span>{selectedCategory.name}</span>
          </span>
          {activeSubCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-[#ff8093] font-bold truncate max-w-[140px] sm:max-w-xs">
                {activeSubCategory.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Website Services Section */}
      {selectedCategory.id === 'website' ? (
        <div className="space-y-4">
          <WebsiteServicesSection onBack={() => onSelectCategoryFilter(null)} />
        </div>
      ) : !activeSubCategory && (selectedCategory.id === 'gaming' || selectedCategory.id === 'social') ? (
        /* =========================================================================
           VIEW 2A: CATEGORY OPTIONS SCREEN (e.g. Gaming Topup / Social Media Topup)
           Revealed ONLY when the Gaming Topup page or Social Media page opens
           ========================================================================= */
        <div className="space-y-4 animate-fadeIn">
          {/* Hero Category Banner (Compact) */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#271B23] bg-gradient-to-r from-[#140F15] via-[#100D12] to-[#0A080C] p-3.5 sm:p-4 shadow-lg shadow-black/50">
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
              <img
                src={meta.image}
                alt={selectedCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A080C] via-[#0A080C]/85 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E5092F]/20 border border-[#E5092F]/40 text-[#E5092F] flex items-center justify-center text-xl shadow-md flex-shrink-0">
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight">
                      {selectedCategory.name}
                    </h1>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] border border-[#E5092F]/30">
                      Select Option
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed line-clamp-1 max-w-xl">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Options Header: ONLY revealed on Gaming Topup or Social Media page */}
          <div className="flex items-center justify-between pt-0.5">
            <h2 id="heading-choose-service-category" className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <span>Choose Service Category</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-neutral-500">
              {subcategories.length} Options Available
            </span>
          </div>

          {/* Clickable Compact Rows/Cards, Each With a Name and Right Arrow (→) */}
          <div className="space-y-2.5">
            {subcategories.map((sub, sIdx) => {
              const subCategoryProducts = activeCategoryProducts.filter(
                (p) => p.subCategory === sub.id
              );
              const isAvailable = subCategoryProducts.length > 0;
              const isAccountOption =
                sub.id === 'gaming-accounts' ||
                sub.id === 'social-accounts' ||
                sub.id.includes('account') ||
                sub.name.toLowerCase() === 'account';

              return (
                <motion.div
                  key={sub.id}
                  id={`subcat-option-${sub.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: sIdx * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    haptic('medium');
                    onSelectCategoryFilter(selectedCategory.id, sub.id);
                  }}
                  className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#2A1C26] hover:border-[#E5092F] bg-gradient-to-r from-[#140F16] via-[#100D12] to-[#0D0A0F] hover:from-[#1A121D] hover:to-[#130E17] p-3 sm:p-3.5 transition-all duration-200 shadow-md shadow-black/40 flex items-center justify-between gap-3"
                >
                  {/* Subtle Red glow on hover */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#E5092F]/0 group-hover:bg-[#E5092F]/15 blur-2xl rounded-full transition-all duration-300 pointer-events-none" />

                  {/* Left: Icon, Name & Details */}
                  <div className="relative z-10 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E5092F] group-hover:text-white transition-all shadow-sm">
                      {renderSubCategoryIcon(sub.icon, sub.id)}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#ff4d6d] tracking-tight transition-colors">
                          {sub.name}
                        </h3>
                        {isAccountOption ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] border border-[#E5092F]/30">
                            Soon
                          </span>
                        ) : isAvailable ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1E121A] text-[#ff8093] border border-[#3A1D2D] group-hover:border-[#E5092F]/50 transition-colors">
                            {subCategoryProducts.length} Items
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-300 border border-neutral-700/60">
                            Verified Orders
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 leading-normal">
                        {isAccountOption
                          ? 'Verified accounts launching soon • Contact @Raf_babi'
                          : sub.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Prominent Right Arrow */}
                  <div className="relative z-10 flex items-center gap-2 flex-shrink-0 pl-1">
                    <div className="w-8 h-8 rounded-xl bg-[#1B1119] group-hover:bg-[#E5092F] text-neutral-400 group-hover:text-white flex items-center justify-center transition-all shadow-md group-hover:shadow-[#E5092F]/30">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 2B: SELECTED OPTION ITEMS SCREEN (Or Account Coming Soon Screen)
           ========================================================================= */
        <div className="space-y-4 animate-fadeIn">
          {/* Subcategory Detail Header Banner (Compact) */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#271B23] bg-gradient-to-r from-[#140F15] via-[#100D12] to-[#0A080C] p-3.5 sm:p-4 shadow-lg shadow-black/50">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E5092F]/20 border border-[#E5092F]/40 text-[#E5092F] flex items-center justify-center text-lg shadow-md flex-shrink-0">
                  {renderSubCategoryIcon(activeSubCategory.icon, activeSubCategory.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {activeSubCategory.name}
                    </h1>
                    {activeSubCategory.id === 'gaming-accounts' ||
                    activeSubCategory.id === 'social-accounts' ||
                    activeSubCategory.id.includes('account') ||
                    activeSubCategory.name.toLowerCase() === 'account' ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] border border-[#E5092F]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-pulse" />
                        Soon
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] border border-[#E5092F]/30">
                        {filteredCategoryProducts.filter((p) => p.subCategory === activeSubCategory.id).length} Items Available
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed line-clamp-1">
                    {activeSubCategory.id === 'gaming-accounts' ||
                    activeSubCategory.id === 'social-accounts' ||
                    activeSubCategory.id.includes('account') ||
                    activeSubCategory.name.toLowerCase() === 'account'
                      ? 'Verified accounts & custom orders launching soon'
                      : activeSubCategory.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {activeSubCategory.id === 'gaming-accounts' ||
          activeSubCategory.id === 'social-accounts' ||
          activeSubCategory.id.includes('account') ||
          activeSubCategory.name.toLowerCase() === 'account' ? (
            /* Dedicated Clean Coming Soon Screen for Account */
            <div className="py-12 sm:py-16 px-4 sm:px-8 text-center space-y-6 bg-[#140F15] rounded-3xl border border-[#291A23] shadow-xl relative overflow-hidden">
              {/* Subtle Red Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#E5092F]/10 blur-[100px] rounded-full pointer-events-none -z-0" />

              <div className="relative z-10 space-y-4 max-w-md mx-auto">
                {/* Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] flex items-center justify-center mx-auto shadow-lg shadow-[#E5092F]/20">
                  <Clock className="w-8 h-8 text-[#E5092F]" />
                </div>

                {/* Coming Soon / Soon Header */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#ff8093] text-[11px] font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-pulse" />
                    Soon
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Coming Soon
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
                    {selectedCategory.id === 'gaming'
                      ? 'Verified gaming accounts, Konami ID squads, and custom game accounts are coming soon.'
                      : 'Aged social accounts, monetized channels, and verified profiles are coming soon.'}
                  </p>
                </div>

                {/* Telegram Username Box */}
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-[#100C12] border border-[#2D1C28] space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-neutral-400">
                        Direct Telegram Contact
                      </span>
                      <span className="text-[10px] text-[#ff8093] font-mono font-bold">Official Support</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#171019] border border-[#381F30]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#29b6f6] flex items-center justify-center flex-shrink-0">
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="text-[10px] text-neutral-400 block font-medium">Telegram</span>
                          <span className="font-mono font-black text-sm sm:text-base text-white tracking-wide truncate block">
                            @Raf_babi
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        id="btn-copy-account-telegram"
                        onClick={() => handleCopyTg('@Raf_babi')}
                        className="px-3 py-1.5 rounded-lg bg-[#241522] hover:bg-[#321C2F] border border-[#44233A] text-xs font-bold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95 cursor-pointer"
                        title="Copy Telegram Username"
                      >
                        {copiedTg ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Action Button: Direct Link to Telegram */}
                    <a
                      href="https://t.me/Raf_babi"
                      target="_blank"
                      rel="noopener noreferrer"
                      id="btn-open-account-telegram"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#E5092F]/30 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <span>Message @Raf_babi on Telegram</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Search Filter Inside This Option */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="option-items-search-bar"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search within ${activeSubCategory.name}...`}
                  className="w-full bg-[#110E12] border border-[#271920] focus:border-[#E5092F] text-white text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 outline-none transition-all placeholder:text-neutral-500 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      haptic('light');
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Existing Items Grid */}
              {(() => {
                const subCategoryProducts = filteredCategoryProducts.filter(
                  (p) => p.subCategory === activeSubCategory.id
                );

                if (subCategoryProducts.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-4 bg-[#140F15] rounded-3xl border border-[#291A23] p-8 shadow-inner">
                      <div className="w-14 h-14 rounded-2xl bg-[#E5092F]/15 border border-[#E5092F]/30 text-[#E5092F] flex items-center justify-center mx-auto">
                        {renderSubCategoryIcon(activeSubCategory.icon, activeSubCategory.id)}
                      </div>
                      <div className="space-y-1.5 max-w-md mx-auto">
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {searchQuery
                            ? `No items matching "${searchQuery}"`
                            : `${activeSubCategory.name} Stock`}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                          {searchQuery
                            ? 'Try searching with a different keyword or browse all items.'
                            : 'Stock is updated regularly.'}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                    {subCategoryProducts.map((product, pIdx) => {
                      const lowestPrice = Math.min(...product.packages.map((pkg) => pkg.price));

                  return (
                    <motion.div
                      key={product.id}
                      id={`product-item-${product.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: pIdx * 0.03 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => {
                        haptic('medium');
                        if (isFacebookBoostProduct(product)) {
                          setShowFacebookContactModal(true);
                          return;
                        }
                        onSelectProduct(product);
                      }}
                      className="group relative overflow-hidden rounded-2xl bg-[#140F15] hover:bg-[#1A131C] border border-[#2B1B25] hover:border-[#E5092F]/60 p-4 transition-all duration-200 shadow-sm cursor-pointer flex flex-col justify-between gap-3.5"
                    >
                      {/* Product Info Row */}
                      <div className="flex items-start gap-3.5">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 border border-[#321C27] group-hover:border-[#E5092F]/50 flex-shrink-0 shadow-inner">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {product.badge && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-black/85 text-[#ff8093] border border-[#E5092F]/40 backdrop-blur-sm">
                              {product.badge.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#ff4d6d] transition-colors truncate">
                              {product.name}
                            </h3>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex-shrink-0">
                              {product.status || 'Active'}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                            {product.shortDescription}
                          </p>

                          {/* Specs */}
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-neutral-400 flex-wrap">
                            <span className="flex items-center gap-1 text-[#ff8093] font-bold bg-[#E5092F]/10 px-2 py-0.5 rounded border border-[#E5092F]/20">
                              <Zap className="w-2.5 h-2.5 text-[#E5092F]" />
                              {product.deliveryEstimate}
                            </span>
                            <span className="text-neutral-300 font-medium">
                              {product.packages.length} {product.packageType || 'Packages'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action / Price Bottom Row */}
                      <div className="pt-2.5 border-t border-[#241620] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                            From
                          </span>
                          <span className="text-sm sm:text-base font-black text-[#ff4d6d] font-mono">
                            {formatPrice(lowestPrice, 'BIRR')}
                          </span>
                        </div>

                        <button
                          id={`btn-order-cta-${product.id}`}
                          type="button"
                          onClick={(e) => {
                            if (isFacebookBoostProduct(product)) {
                              e.stopPropagation();
                              haptic('medium');
                              setShowFacebookContactModal(true);
                              return;
                            }
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] active:scale-[0.98] text-white text-xs font-black shadow-md shadow-[#E5092F]/20 transition-all flex-shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
            </>
          )}
        </div>
      )}

      {/* Facebook Boost Contact Me Modal */}
      {renderFacebookContactModal()}
    </motion.div>
  );
};
