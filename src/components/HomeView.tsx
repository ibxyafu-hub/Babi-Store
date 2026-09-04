import React, { useState } from 'react';
import { Product, StoreCategory, OrderItem, ProductCategory } from '../types';
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
  Flame,
  Star,
  X
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
    badge: 'Instant 24/7',
    badgeType: 'zap',
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
    badge: '0% Fee',
    badgeType: 'star',
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
    badge: 'Best Rates',
    badgeType: 'flame',
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

  return (
    <div className="space-y-5 pb-6 sm:pb-8 animate-fadeIn">
      {/* Welcome & Search Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#A1A1AA] font-medium">Welcome back,</span>
              <span className="text-xs font-bold text-[#E5092F]">
                {user.first_name || 'Gamer'}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white p-1 rounded-md transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30">
                      {banner.badgeType === 'zap' && <Zap className="w-3 h-3 text-[#E5092F]" />}
                      {banner.badgeType === 'star' && <Star className="w-3 h-3 text-[#E5092F] fill-current" />}
                      {banner.badgeType === 'flame' && <Flame className="w-3 h-3 text-[#E5092F]" />}
                      <span>{banner.badge}</span>
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
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-bold text-xs shadow-md shadow-[#E5092F]/25 transition-all active:scale-[0.98]"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentOrders.slice(0, 2).map((order) => (
              <div
                key={order.orderId}
                onClick={() => {
                  haptic('light');
                  onViewOrderDetails(order);
                }}
                className="cursor-pointer flex items-center justify-between p-3.5 rounded-xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] hover:border-[#E5092F]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-11 h-11 rounded-lg object-cover bg-neutral-900 border border-[#27272A]"
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
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-neutral-500/10 text-neutral-300 border-neutral-500/20'
                    }`}
                  >
                    {order.orderStatus === 'Confirmed' ? 'Order Confirmed' : order.orderStatus}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                        className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
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
                      className="w-7 h-7 rounded-xl bg-[#E5092F]/10 group-hover:bg-[#E5092F] text-[#E5092F] group-hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98] border border-[#E5092F]/20 group-hover:border-[#E5092F]"
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
