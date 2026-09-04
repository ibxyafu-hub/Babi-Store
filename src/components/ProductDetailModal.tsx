import React, { useState, useMemo } from 'react';
import { Product, ProductPackage } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import {
  X,
  Zap,
  Check,
  ChevronRight,
  Info,
  Plus,
  Minus,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  Copy
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedToOrder: (product: Product, selectedPackage: ProductPackage, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onProceedToOrder
}) => {
  const { haptic, openTelegramLink } = useTelegram();

  if (!product) return null;

  // Extract unique groups if any (e.g. Free Fire has Diamonds & Membership)
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    product.packages.forEach((pkg) => {
      if (pkg.packageGroup) {
        groups.add(pkg.packageGroup);
      }
    });
    return Array.from(groups);
  }, [product]);

  const [selectedGroup, setSelectedGroup] = useState<string>(() =>
    availableGroups.length > 0 ? availableGroups[0] : 'all'
  );

  const displayedPackages = useMemo(() => {
    if (availableGroups.length === 0 || selectedGroup === 'all') {
      return product.packages;
    }
    return product.packages.filter((p) => p.packageGroup === selectedGroup);
  }, [product, selectedGroup, availableGroups]);

  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    return product.packages[0]?.id || '';
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [showFullGuide, setShowFullGuide] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);

  const isFacebookBoost = product.id === 'facebook-boost' || product.name.toLowerCase().includes('facebook');

  const selectedPackage =
    product.packages.find((p) => p.id === selectedPackageId) ||
    displayedPackages[0] ||
    product.packages[0];

  const totalPrice = selectedPackage ? selectedPackage.price * quantity : 0;

  const handleIncrement = () => {
    if (quantity < 10) {
      haptic('light');
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      haptic('light');
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#151515] border border-[#27272A] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/50" />

          {/* Close button */}
          <button
            id="btn-close-product-detail"
            onClick={() => {
              haptic('light');
              onClose();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status & Estimate badges */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {product.status}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30 backdrop-blur-md flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#E5092F]" />
              {product.deliveryEstimate}
            </span>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Title & Short description */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {product.name}
              </h2>
              {product.packageType && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E5092F]/15 text-[#E5092F] border border-[#E5092F]/30">
                  {product.packageType}
                </span>
              )}
            </div>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Delivery Note if present (e.g. UC የሚገባበት ጊዜ 2-8 ደቂቃ! or Login price 3-7 ደቂቃ ይገባል) */}
          {product.packageNote && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/25 text-xs text-[#E5092F] font-semibold">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{product.packageNote}</span>
            </div>
          )}

          {isFacebookBoost ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-[#1A1016] border border-[#3A1B28] text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5092F]/15 text-[#ff8093] text-[11px] font-mono font-bold border border-[#E5092F]/30 uppercase tracking-wider">
                  Facebook Page Boost
                </div>
                <h3 className="text-xl font-extrabold text-white">Contact Me</h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
                  For Facebook Page Boost services, please contact me directly:
                </p>
              </div>

              {/* Phone Link */}
              <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] hover:border-[#E5092F]/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="tel:0989678770"
                    id="modal-link-facebook-phone"
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
                      <span className="text-sm font-mono font-black text-white group-hover:text-emerald-400 transition-colors tracking-wide underline underline-offset-2 decoration-emerald-500/50">
                        0989678770
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      id="modal-btn-copy-facebook-phone"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic('selectionChanged');
                        navigator.clipboard.writeText('0989678770');
                        setCopiedPhone(true);
                        setTimeout(() => setCopiedPhone(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-[#1E1E24] hover:bg-[#2A2A32] border border-[#3A3A42] text-neutral-300 hover:text-white transition-all active:scale-95"
                      title="Copy Phone Number"
                    >
                      {copiedPhone ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                    <a
                      href="tel:0989678770"
                      id="modal-btn-dial-facebook-phone"
                      onClick={() => haptic('selectionChanged')}
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Telegram Link */}
              <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] hover:border-[#E5092F]/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="https://t.me/Raf_babi"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="modal-link-facebook-telegram"
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
                      <span className="text-sm font-mono font-black text-white group-hover:text-[#29b6f6] transition-colors tracking-wide underline underline-offset-2 decoration-[#0088cc]/50">
                        @Raf_babi
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      id="modal-btn-copy-facebook-telegram"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic('selectionChanged');
                        navigator.clipboard.writeText('@Raf_babi');
                        setCopiedTg(true);
                        setTimeout(() => setCopiedTg(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-[#1E1E24] hover:bg-[#2A2A32] border border-[#3A3A42] text-neutral-300 hover:text-white transition-all active:scale-95"
                      title="Copy Telegram Username"
                    >
                      {copiedTg ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                    <a
                      href="https://t.me/Raf_babi"
                      target="_blank"
                      rel="noopener noreferrer"
                      id="modal-btn-chat-facebook-telegram"
                      onClick={() => {
                        haptic('selectionChanged');
                        openTelegramLink('https://t.me/Raf_babi');
                      }}
                      className="px-3 py-2 rounded-lg bg-[#E5092F] hover:bg-[#c70828] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Group Filter Tabs (e.g. Free Fire Diamonds vs Membership) */}
          {availableGroups.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111111] border border-[#27272A]">
              <button
                type="button"
                onClick={() => {
                  haptic('selectionChanged');
                  setSelectedGroup('all');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  selectedGroup === 'all'
                    ? 'bg-[#E5092F] text-white shadow-sm'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                All Packages
              </button>
              {availableGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    haptic('selectionChanged');
                    setSelectedGroup(group);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    selectedGroup === group
                      ? 'bg-[#E5092F] text-white shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          )}

          {/* Packages Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Choose Your Package ({displayedPackages.length})
              </span>
              <span className="text-[11px] text-[#E5092F] font-semibold">
                Official BABI STORE Pricing
              </span>
            </div>

            {/* Vertically scrollable Package cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {displayedPackages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    id={`package-card-${pkg.id}`}
                    onClick={() => {
                      haptic('selectionChanged');
                      setSelectedPackageId(pkg.id);
                    }}
                    className={`cursor-pointer relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#E5092F]/10 border-[#E5092F] shadow-sm shadow-[#E5092F]/20 ring-1 ring-[#E5092F]'
                        : 'bg-[#111111] border-[#27272A] hover:bg-[#191919] hover:border-neutral-700'
                    }`}
                  >
                    {/* Top Row: Package Name & Badge */}
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isSelected ? 'text-white' : 'text-neutral-200'
                        }`}
                      >
                        {pkg.name}
                      </span>
                      {pkg.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#E5092F] text-white uppercase flex-shrink-0">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Exact BIRR Price Display */}
                    <div className="my-1">
                      <span className="text-sm font-extrabold text-[#E5092F] font-mono block">
                        {formatPrice(pkg.price, 'BIRR')}
                      </span>
                      {pkg.packageNote && (
                        <span className="text-[9px] text-[#A1A1AA] block mt-0.5">
                          {pkg.packageNote}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Selection Indicator */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#27272A]/60 mt-1">
                      <span className="text-[10px] text-[#A1A1AA]">
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-[#E5092F] border-[#E5092F] text-white'
                            : 'border-white/30 text-transparent'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-[#27272A]">
            <div>
              <span className="text-xs font-bold text-white block">Quantity</span>
              <span className="text-[10px] text-[#A1A1AA]">
                Multiplies package units directly
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#151515] border border-[#27272A] rounded-lg p-1">
              <button
                id="btn-qty-minus"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-md bg-[#1b1b1b] hover:bg-[#222222] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-extrabold text-white min-w-[20px] text-center font-mono">
                {quantity}
              </span>
              <button
                id="btn-qty-plus"
                onClick={handleIncrement}
                disabled={quantity >= 10}
                className="w-7 h-7 rounded-md bg-[#1b1b1b] hover:bg-[#222222] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Delivery steps toggle */}
          {product.guideSteps && (
            <div className="rounded-xl bg-[#111111] border border-[#27272A] p-3">
              <button
                type="button"
                onClick={() => setShowFullGuide(!showFullGuide)}
                className="w-full flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#E5092F]" />
                  How Delivery Works ({product.deliveryEstimate})
                </span>
                <span className="text-[10px] text-[#E5092F]">
                  {showFullGuide ? 'Hide' : 'View Steps'}
                </span>
              </button>

              {showFullGuide && (
                <ol className="mt-2.5 space-y-1.5 text-[11px] text-[#A1A1AA] list-decimal list-inside border-t border-[#27272A] pt-2">
                  {product.guideSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
            </>
          )}
        </div>

        {/* Footer & Continue CTA */}
        {isFacebookBoost ? (
          <div className="p-4 border-t border-[#27272A] bg-[#080808] flex items-center gap-3">
            <a
              href="tel:0989678770"
              id="footer-btn-call-facebook"
              onClick={() => haptic('medium')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span>CALL (0989678770)</span>
            </a>
            <a
              href="https://t.me/Raf_babi"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-btn-tg-facebook"
              onClick={() => {
                haptic('medium');
                openTelegramLink('https://t.me/Raf_babi');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>MESSAGE TELEGRAM</span>
            </a>
          </div>
        ) : (
          <div className="p-4 border-t border-[#27272A] bg-[#080808] flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block truncate">
                {selectedPackage?.name} {quantity > 1 ? `(×${quantity})` : ''}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-[#E5092F] font-mono">
                  {formatPrice(totalPrice, 'BIRR')}
                </span>
              </div>
            </div>

            <button
              id="btn-buy-now"
              onClick={() => {
                if (selectedPackage) {
                  haptic('heavy');
                  onProceedToOrder(product, selectedPackage, quantity);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all active:scale-[0.98]"
            >
              <span>CONTINUE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
