import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTelegram } from '../context/TelegramContext';
import { Product, OrderItem, StoreCategory, OrderStatus } from '../types';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import { INITIAL_PRODUCTS, STORE_CATEGORIES, PAYMENT_METHODS } from '../data/catalog';
import {
  Send,
  Package,
  ScrollText,
  HelpCircle,
  RotateCcw,
  Mail,
  MessageCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Info,
  Gamepad2,
  ShieldCheck,
  Star,
  Heart,
  Bot,
  Search,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Smartphone,
  Globe,
  Tag,
  Share2,
  Zap
} from 'lucide-react';

export interface BotActionBtn {
  text: string;
  action: string;
  iconType?: 'orders' | 'rules' | 'support' | 'about' | 'payment' | 'how_to_order' | 'price' | 'product' | 'store' | 'bot';
}

export interface SupportLink {
  type: 'email' | 'telegram';
  title: string;
  handle: string;
  url: string;
}

export interface BotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  type?:
    | 'welcome'
    | 'orders'
    | 'order_single'
    | 'product'
    | 'product_list'
    | 'prices'
    | 'rules'
    | 'support'
    | 'how_to_order'
    | 'payment'
    | 'about'
    | 'text';
  ordersData?: OrderItem[];
  singleOrder?: OrderItem;
  productData?: Product;
  productsList?: Product[];
  supportLinks?: SupportLink[];
  buttons?: BotActionBtn[];
}

interface ChatContext {
  activeProductId: string | null;
  activeCategoryId: string | null;
  lastTopic: 'product' | 'price' | 'order' | 'faq' | 'payment' | 'rules' | 'support' | null;
}

interface BotSimulatorViewProps {
  orders?: OrderItem[];
  products?: Product[];
  categories?: StoreCategory[];
  onViewOrderDetails?: (order: OrderItem) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenStore?: () => void;
  onOpenOrders?: () => void;
  onOpenSupport?: () => void;
  onCloseBotMode?: () => void;
}

export const BotSimulatorView: React.FC<BotSimulatorViewProps> = ({
  orders = [],
  products = INITIAL_PRODUCTS,
  categories = STORE_CATEGORIES,
  onViewOrderDetails,
  onSelectProduct,
  onOpenStore,
  onOpenOrders,
  onOpenSupport,
  onCloseBotMode
}) => {
  const { user, haptic } = useTelegram();
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputCommand, setInputCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Chat Conversation Context (remembers active product, category, or topic)
  const [chatContext, setChatContext] = useState<ChatContext>({
    activeProductId: null,
    activeCategoryId: null,
    lastTopic: null
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const responseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const userName = user.first_name || (user.username ? `@${user.username}` : 'Valued Customer');

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 5 Quick Navigation FAQ buttons
  const quickFaqButtons: BotActionBtn[] = [
    { text: 'My Orders', action: 'my_orders', iconType: 'orders' },
    { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
    { text: 'Payment', action: 'payment', iconType: 'payment' },
    { text: 'Rules', action: 'rules', iconType: 'rules' },
    { text: 'Talk to Support', action: 'support', iconType: 'support' }
  ];

  const getButtonIcon = (action: string, iconType?: string) => {
    const act = action.toLowerCase();
    if (iconType === 'orders' || act.includes('order')) {
      return <Package className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'payment' || act.includes('pay') || act.includes('telebirr') || act.includes('cbe')) {
      return <CreditCard className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'rules' || act.includes('rule')) {
      return <ScrollText className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'support' || act.includes('support') || act.includes('help')) {
      return <MessageCircle className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'price' || act.includes('price') || act.includes('cost')) {
      return <Tag className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'product' || act.includes('product') || act.includes('store')) {
      return <ShoppingBag className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (iconType === 'how_to_order' || act.includes('how')) {
      return <HelpCircle className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    if (act.includes('about')) {
      return <Info className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
    }
    return <Bot className="w-3 h-3 text-[#E5092F] flex-shrink-0" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E5092F]/15 text-[#ff6680] border border-[#E5092F]/30">
            <Clock className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  // Render Visual Stepper: Pending → Confirmed → Processing → Completed (or Rejected)
  const renderOrderStepper = (status: OrderStatus | string) => {
    const s = (status || '').toLowerCase();
    const isRejected = s === 'cancelled' || s === 'rejected';

    if (isRejected) {
      return (
        <div className="w-full mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Status: Order Rejected / Cancelled. Please contact support.</span>
        </div>
      );
    }

    const steps = ['Pending', 'Confirmed', 'Processing', 'Completed'];
    const getStepIndex = (st: string) => {
      switch (st) {
        case 'pending':
          return 0;
        case 'confirmed':
          return 1;
        case 'processing':
          return 2;
        case 'completed':
          return 3;
        default:
          return 0;
      }
    };
    const currentIdx = getStepIndex(s);

    return (
      <div className="w-full mt-2 pt-1 border-t border-[#2A1821]">
        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mb-1">
          <span className="font-bold text-[#ff8093]">Status Flow</span>
          <span>Step {currentIdx + 1} of 4</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {steps.map((step, idx) => {
            const isPassed = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step} className="flex flex-col items-center gap-0.5">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    isCurrent
                      ? 'bg-[#E5092F] shadow-[0_0_8px_rgba(229,9,47,0.7)]'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-[#26151E]'
                  }`}
                />
                <span
                  className={`text-[8px] font-mono truncate max-w-full ${
                    isCurrent
                      ? 'text-white font-black'
                      : isPassed
                      ? 'text-emerald-400 font-semibold'
                      : 'text-neutral-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    };
  }, []);

  const executeSimulatedResponse = (botMsg: BotMessage) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      setIsTyping(true);

      responseTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        haptic('light');
      }, 550);
    }, 120);
  };

  // Search product catalog with fuzzy keywords & synonyms
  const searchProductCatalog = (query: string): Product[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    // Map common user aliases to product IDs
    const aliasMap: Record<string, string[]> = {
      pubg: ['pubg-uc'],
      uc: ['pubg-uc'],
      royale: ['pubg-uc'],
      'free fire': ['free-fire-diamonds'],
      freefire: ['free-fire-diamonds'],
      ff: ['free-fire-diamonds'],
      diamond: ['free-fire-diamonds', 'mobile-legends-diamonds'],
      diamonds: ['free-fire-diamonds', 'mobile-legends-diamonds'],
      efootball: ['efootball-android-user', 'efootball-iphone-user', 'efootball-squad-accounts'],
      pes: ['efootball-android-user', 'efootball-iphone-user', 'efootball-squad-accounts'],
      konami: ['efootball-android-user', 'efootball-iphone-user', 'efootball-squad-accounts'],
      'call of duty': ['call-of-duty-cp'],
      cod: ['call-of-duty-cp'],
      cp: ['call-of-duty-cp'],
      'fc mobile': ['fc-mobile-points'],
      fifa: ['fc-mobile-points'],
      ea: ['fc-mobile-points'],
      'mobile legends': ['mobile-legends-diamonds'],
      mlbb: ['mobile-legends-diamonds'],
      telegram: ['telegram-stars', 'telegram-premium', 'aged-telegram-accounts'],
      star: ['telegram-stars'],
      stars: ['telegram-stars'],
      premium: ['telegram-premium', 'snapchat-premium'],
      tiktok: ['tiktok-coins', 'monetized-tiktok-accounts'],
      'tiktok coins': ['tiktok-coins'],
      'tiktok followers': ['tiktok-coins', 'monetized-tiktok-accounts'],
      follower: ['tiktok-coins', 'facebook-boost', 'monetized-tiktok-accounts'],
      followers: ['tiktok-coins', 'facebook-boost', 'monetized-tiktok-accounts'],
      snapchat: ['snapchat-premium'],
      snap: ['snapchat-premium'],
      facebook: ['facebook-boost'],
      fb: ['facebook-boost'],
      boost: ['facebook-boost'],
      accounts: ['efootball-squad-accounts', 'aged-telegram-accounts', 'monetized-tiktok-accounts'],
      account: ['efootball-squad-accounts', 'aged-telegram-accounts', 'monetized-tiktok-accounts'],
      website: ['web-development'],
      web: ['web-development'],
      coding: ['web-development'],
      developer: ['web-development']
    };

    const directMatchedIds = new Set<string>();

    // Check alias direct hits
    for (const [key, ids] of Object.entries(aliasMap)) {
      if (q.includes(key)) {
        ids.forEach((id) => directMatchedIds.add(id));
      }
    }

    // Direct search on product properties
    const generalMatches = products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const tagMatch = p.tagline.toLowerCase().includes(q);
      const badgeMatch = (p.badge || '').toLowerCase().includes(q);
      const shortMatch = p.shortDescription.toLowerCase().includes(q);
      const subCatMatch = p.subCategory.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const packageMatch = p.packages?.some((pkg) => pkg.name.toLowerCase().includes(q));

      return nameMatch || tagMatch || badgeMatch || shortMatch || subCatMatch || catMatch || packageMatch;
    });

    generalMatches.forEach((p) => directMatchedIds.add(p.id));

    return products.filter((p) => directMatchedIds.has(p.id));
  };

  // 1. Handle Smart Product Finder
  const handleProductSearch = (query: string) => {
    const matches = searchProductCatalog(query);

    const userMsg: BotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: getCurrentTime()
    };
    setMessages((prev) => [...prev, userMsg]);

    // If customer asked about TikTok followers specifically
    const isFollowerQuery = query.toLowerCase().includes('follower');

    if (matches.length === 1) {
      const product = matches[0];
      setChatContext({
        activeProductId: product.id,
        activeCategoryId: product.category,
        lastTopic: 'product'
      });

      const popularPackage = product.packages?.find((pkg) => pkg.badge) || product.packages?.[0];
      const priceText = popularPackage ? `${formatPrice(popularPackage.price, 'BIRR')}` : 'View Prices';

      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'product',
        productData: product,
        text: `Found matching service: <b>${product.name}</b>\n\n` +
          `• <b>Category:</b> ${product.category === 'gaming' ? 'Gaming Topup' : product.category === 'social' ? 'Social Media' : 'Web Services'}\n` +
          `• <b>Delivery:</b> ${product.deliveryEstimate}\n` +
          `• <b>Pricing:</b> Packages from ${priceText}\n` +
          `• <i>${product.shortDescription}</i>\n\n` +
          `What would you like to do?`,
        time: getCurrentTime(),
        buttons: [
          { text: 'View Prices', action: `price:${product.id}`, iconType: 'price' },
          { text: 'Order in Store', action: `order_product:${product.id}`, iconType: 'store' },
          { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
          { text: 'Talk to Support', action: 'support', iconType: 'support' }
        ]
      };
      executeSimulatedResponse(botMsg);
      return;
    }

    if (matches.length > 1) {
      setChatContext((prev) => ({
        ...prev,
        lastTopic: 'product'
      }));

      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'product_list',
        productsList: matches.slice(0, 6),
        text: isFollowerQuery
          ? `We offer <b>TikTok Coins</b> and <b>Monetized Social Accounts</b> in our store! *(For custom followers or large boosts, our direct support team can also assist)*.\n\nHere are matching products available in BABI STORE:`
          : `Found <b>${matches.length} matching products</b> in our store catalog:`,
        time: getCurrentTime(),
        buttons: [
          ...matches.slice(0, 4).map((p) => ({
            text: p.name,
            action: `select_product:${p.id}`,
            iconType: 'product' as const
          })),
          { text: 'Talk to Support', action: 'support', iconType: 'support' }
        ]
      };
      executeSimulatedResponse(botMsg);
      return;
    }

    // No direct product matches
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'text',
      text: `We could not find an exact match for "<b>${query}</b>" in the catalog.\n\nBABI STORE offers <b>Gaming Topup</b> (PUBG, Free Fire, eFootball, COD, FC Mobile), <b>Social Media Services</b> (Telegram Stars/Premium, TikTok Coins, Boosts), and <b>Website Services</b>.`,
      time: getCurrentTime(),
      buttons: [
        { text: 'Gaming Topup', action: 'category:gaming', iconType: 'product' },
        { text: 'Social Media', action: 'category:social', iconType: 'product' },
        { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // 2. Handle Price Checker (Strict real prices from catalog)
  const handlePriceCheck = (targetProduct?: Product | null, queryText?: string) => {
    let productToUse = targetProduct;

    // If not supplied, try chatContext activeProductId
    if (!productToUse && chatContext.activeProductId) {
      productToUse = products.find((p) => p.id === chatContext.activeProductId) || null;
    }

    // If query has a product name, try to locate it
    if (!productToUse && queryText) {
      const found = searchProductCatalog(queryText);
      if (found.length > 0) {
        productToUse = found[0];
      }
    }

    if (!productToUse) {
      // Prompt user to pick a product
      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'text',
        text: `Which product's price would you like to check? Here are our most requested services:`,
        time: getCurrentTime(),
        buttons: [
          { text: 'PUBG UC Prices', action: 'price:pubg-uc', iconType: 'price' },
          { text: 'Telegram Stars Prices', action: 'price:telegram-stars', iconType: 'price' },
          { text: 'TikTok Coins Prices', action: 'price:tiktok-coins', iconType: 'price' },
          { text: 'Free Fire Diamonds Prices', action: 'price:free-fire-diamonds', iconType: 'price' },
          { text: 'Talk to Support', action: 'support', iconType: 'support' }
        ]
      };
      executeSimulatedResponse(botMsg);
      return;
    }

    // Update active context
    setChatContext({
      activeProductId: productToUse.id,
      activeCategoryId: productToUse.category,
      lastTopic: 'price'
    });

    const pkgs = productToUse.packages || [];
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'prices',
      productData: productToUse,
      text: `Official current prices for <b>${productToUse.name}</b>:\n` +
        `• <i>Delivery speed: ${productToUse.deliveryEstimate}</i>\n` +
        (productToUse.packageNote ? `• <i>Note: ${productToUse.packageNote}</i>\n` : '') +
        `\nAll prices in Ethiopian Birr (ETB):`,
      time: getCurrentTime(),
      buttons: [
        { text: 'Order in Store', action: `order_product:${productToUse.id}`, iconType: 'store' },
        { text: 'Payment Methods', action: 'payment', iconType: 'payment' },
        { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };

    executeSimulatedResponse(botMsg);
  };

  // 3. Handle Order Status
  const handleMyOrdersAction = (specificOrderId?: string) => {
    // If user asked for a specific order ID (e.g. BABI-12345)
    if (specificOrderId) {
      const match = orders.find(
        (o) => o.orderId.toLowerCase().includes(specificOrderId.toLowerCase().trim())
      );
      if (match) {
        const botMsg: BotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'order_single',
          singleOrder: match,
          text: `Found order <b>#${match.orderId}</b>:`,
          time: getCurrentTime(),
          buttons: [
            { text: 'View Order Details', action: `view_order:${match.orderId}`, iconType: 'orders' },
            { text: 'Talk to Support', action: 'support', iconType: 'support' },
            { text: 'My Orders', action: 'my_orders', iconType: 'orders' }
          ]
        };
        executeSimulatedResponse(botMsg);
        return;
      }
    }

    // General order listing
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'orders',
      text:
        orders.length > 0
          ? `Here are your real-time orders with live progress status:`
          : `<b>You currently have no orders placed.</b>\n\nWhen you place an order in BABI STORE, its live tracking, Order ID, and progress status will appear here.`,
      ordersData: orders,
      time: getCurrentTime(),
      buttons:
        orders.length > 0
          ? [
              { text: 'Talk to Support', action: 'support', iconType: 'support' },
              { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
              { text: 'Payment Methods', action: 'payment', iconType: 'payment' }
            ]
          : [
              { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
              { text: 'Gaming Topup', action: 'category:gaming', iconType: 'product' },
              { text: 'Talk to Support', action: 'support', iconType: 'support' }
            ]
    };

    executeSimulatedResponse(botMsg);
  };

  // 4. Handle "How to Order" FAQ
  const handleHowToOrderAction = () => {
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'how_to_order',
      text: `<b>How to place an order in BABI STORE:</b>\n\n` +
        `<b>1. Select Product & Package</b>\nChoose your desired game top-up, social package, or service.\n\n` +
        `<b>2. Enter Required Details</b>\nEnter your Character ID, Username, or link (no passwords required for ID top-ups).\n\n` +
        `<b>3. Transfer Payment</b>\nPay via Telebirr or CBE to our official accounts.\n\n` +
        `<b>4. Submit Transaction Proof</b>\nEnter your Transaction ID or upload a transfer screenshot.\n\n` +
        `<b>5. Instant Delivery</b>\nOrders are completed automatically in 2 - 8 minutes!`,
      time: getCurrentTime(),
      buttons: [
        { text: 'Payment Methods', action: 'payment', iconType: 'payment' },
        { text: 'Store Rules', action: 'rules', iconType: 'rules' },
        { text: 'Browse Gaming Topup', action: 'category:gaming', iconType: 'product' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // 5. Handle Payment FAQ
  const handlePaymentAction = () => {
    const telebirr = PAYMENT_METHODS.find((p) => p.id === 'telebirr');
    const cbe = PAYMENT_METHODS.find((p) => p.id === 'cbe');

    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'payment',
      text: `<b>Official BABI STORE Payment Methods:</b>\n\n` +
        `<b>Telebirr</b>\n` +
        `• Account: <code>${telebirr?.accountNumber || '0989678770'}</code>\n` +
        `• Name: <b>${telebirr?.accountName || 'Kirubel Wondwosen'}</b>\n\n` +
        `<b>Commercial Bank of Ethiopia (CBE)</b>\n` +
        `• Account: <code>${cbe?.accountNumber || '1000367064297'}</code>\n` +
        `• Name: <b>${cbe?.accountName || 'Kirubel Wondwosen'}</b>\n\n` +
        `<i>Note: Send your transaction reference or receipt right after payment.</i>`,
      time: getCurrentTime(),
      buttons: [
        { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
        { text: 'Store Rules', action: 'rules', iconType: 'rules' },
        { text: 'My Orders', action: 'my_orders', iconType: 'orders' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // 6. Handle Rules Action
  const handleRulesAction = () => {
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'rules',
      text: `እነዚህን አንብቡ ከመግዛታችሁ በፊት`,
      time: getCurrentTime(),
      buttons: [
        { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
        { text: 'Payment Methods', action: 'payment', iconType: 'payment' },
        { text: 'My Orders', action: 'my_orders', iconType: 'orders' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // 7. Handle Human Support Action
  const handleSupportAction = () => {
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'support',
      text: 'Having a problem with your order or need help? Our support team is active and ready to help. Contact us directly on Telegram or Email:',
      supportLinks: [
        {
          type: 'telegram',
          title: 'Telegram Live Support',
          handle: '@Raf_babi',
          url: 'https://t.me/Raf_babi'
        },
        {
          type: 'email',
          title: 'Official Email Support',
          handle: 'apexcreativesaio@gmail.com',
          url: 'mailto:apexcreativesaio@gmail.com'
        }
      ],
      time: getCurrentTime(),
      buttons: [
        { text: 'My Orders', action: 'my_orders', iconType: 'orders' },
        { text: 'How to Order?', action: 'how_to_order', iconType: 'how_to_order' },
        { text: 'Payment Methods', action: 'payment', iconType: 'payment' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // 8. Handle About Action
  const handleAboutAction = () => {
    const botMsg: BotMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      type: 'about',
      text: 'About BABI STORE',
      time: getCurrentTime(),
      buttons: [
        { text: 'Gaming Topup', action: 'category:gaming', iconType: 'product' },
        { text: 'My Orders', action: 'my_orders', iconType: 'orders' },
        { text: 'Talk to Support', action: 'support', iconType: 'support' }
      ]
    };
    executeSimulatedResponse(botMsg);
  };

  // Master Action & Query Dispatcher
  const handleAction = (action: string) => {
    if (isTyping) return;

    haptic('medium');
    setActiveButton(action);
    setTimeout(() => setActiveButton(null), 250);

    const cleanAction = action.trim();
    const actLower = cleanAction.toLowerCase();

    // Check specific prefixed actions
    if (cleanAction.startsWith('select_product:')) {
      const prodId = cleanAction.replace('select_product:', '');
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        const userMsg: BotMessage = {
          id: `usr-${Date.now()}`,
          sender: 'user',
          text: `Show ${prod.name}`,
          time: getCurrentTime()
        };
        setMessages((prev) => [...prev, userMsg]);
        handleProductSearch(prod.name);
        return;
      }
    }

    if (cleanAction.startsWith('order_product:')) {
      const prodId = cleanAction.replace('order_product:', '');
      const prod = products.find((p) => p.id === prodId);
      if (prod && onSelectProduct) {
        onSelectProduct(prod);
        return;
      }
    }

    if (cleanAction.startsWith('price:')) {
      const prodId = cleanAction.replace('price:', '');
      const prod = products.find((p) => p.id === prodId);
      const userMsg: BotMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: prod ? `Prices for ${prod.name}` : 'Check Prices',
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, userMsg]);
      handlePriceCheck(prod);
      return;
    }

    if (cleanAction.startsWith('category:')) {
      const catId = cleanAction.replace('category:', '');
      const catProducts = products.filter((p) => p.category === catId);
      const userMsg: BotMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: catId === 'gaming' ? 'Gaming Topup' : catId === 'social' ? 'Social Media' : 'Website Services',
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, userMsg]);

      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'product_list',
        productsList: catProducts,
        text: `Here are our available services under <b>${catId === 'gaming' ? 'Gaming Top Up' : catId === 'social' ? 'Social Media' : 'Web Services'}</b>:`,
        time: getCurrentTime(),
        buttons: [
          ...catProducts.slice(0, 4).map((p) => ({
            text: p.name,
            action: `select_product:${p.id}`,
            iconType: 'product' as const
          })),
          { text: 'Talk to Support', action: 'support', iconType: 'support' }
        ]
      };
      executeSimulatedResponse(botMsg);
      return;
    }

    if (cleanAction.startsWith('view_order:')) {
      const orderId = cleanAction.replace('view_order:', '');
      const ord = orders.find((o) => o.orderId === orderId);
      if (ord && onViewOrderDetails) {
        onViewOrderDetails(ord);
        return;
      }
    }

    // Natural & Standard Action Parsing
    const userMsg: BotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cleanAction,
      time: getCurrentTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputCommand('');

    // Check for Order ID search in query
    const orderIdMatch = actLower.match(/babi-[a-z0-9]+/i) || actLower.match(/\b\d{5,}\b/);
    if (orderIdMatch && (actLower.includes('order') || actLower.includes('status') || actLower.includes('where'))) {
      handleMyOrdersAction(orderIdMatch[0]);
      return;
    }

    // My Orders query
    if (
      actLower === 'my_orders' ||
      actLower === '/orders' ||
      actLower.includes('my order') ||
      actLower.includes('order status') ||
      actLower === 'orders' ||
      actLower.includes('track order') ||
      actLower.includes('where is my order')
    ) {
      handleMyOrdersAction();
      return;
    }

    // How to order query
    if (
      actLower === 'how_to_order' ||
      actLower.includes('how to order') ||
      actLower.includes('how to buy') ||
      actLower.includes('order guide') ||
      actLower.includes('how do i order')
    ) {
      handleHowToOrderAction();
      return;
    }

    // Payment query
    if (
      actLower === 'payment' ||
      actLower.includes('payment') ||
      actLower.includes('telebirr') ||
      actLower.includes('cbe') ||
      actLower.includes('how to pay') ||
      actLower.includes('bank') ||
      actLower.includes('account number')
    ) {
      handlePaymentAction();
      return;
    }

    // Rules query
    if (actLower === 'rules' || actLower === '/rules' || actLower.includes('rule') || actLower.includes('refund')) {
      handleRulesAction();
      return;
    }

    // Support query
    if (
      actLower === 'support' ||
      actLower === '/support' ||
      actLower.includes('support') ||
      actLower.includes('help') ||
      actLower.includes('talk to support') ||
      actLower.includes('contact') ||
      actLower.includes('human') ||
      actLower.includes('admin')
    ) {
      handleSupportAction();
      return;
    }

    // About Us query
    if (actLower === 'about' || actLower === '/about' || actLower.includes('about')) {
      handleAboutAction();
      return;
    }

    // Price query: "how much is...", "price of...", "cost", "how much is this package"
    if (
      actLower.includes('price') ||
      actLower.includes('how much') ||
      actLower.includes('cost') ||
      actLower.includes('ዋጋ') ||
      actLower.includes('rate') ||
      actLower.includes('birr') ||
      actLower.includes('etb')
    ) {
      // If customer asks "how much is this package" and context has an active product
      if ((actLower.includes('this') || actLower.includes('it') || actLower.includes('package')) && chatContext.activeProductId) {
        const prod = products.find((p) => p.id === chatContext.activeProductId);
        handlePriceCheck(prod);
        return;
      }
      handlePriceCheck(null, actLower);
      return;
    }

    // Check if customer is asking about delivery time using context
    if (actLower.includes('time') || actLower.includes('how long') || actLower.includes('minute') || actLower.includes('delivery')) {
      if (chatContext.activeProductId) {
        const activeProd = products.find((p) => p.id === chatContext.activeProductId);
        if (activeProd) {
          const botMsg: BotMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'text',
            text: `Delivery time for <b>${activeProd.name}</b> is typically <b>${activeProd.deliveryEstimate}</b>!\n\n` +
              `Orders are processed automatically once your payment verification is submitted.`,
            time: getCurrentTime(),
            buttons: [
              { text: 'Order in Store', action: `order_product:${activeProd.id}`, iconType: 'store' },
              { text: 'View Prices', action: `price:${activeProd.id}`, iconType: 'price' },
              { text: 'Talk to Support', action: 'support', iconType: 'support' }
            ]
          };
          executeSimulatedResponse(botMsg);
          return;
        }
      }
    }

    // General product/service search
    handleProductSearch(cleanAction);
  };

  const initWelcomeMessage = () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    setIsTyping(false);

    const welcomeMsg: BotMessage = {
      id: `bot-welcome-${Date.now()}`,
      sender: 'bot',
      type: 'welcome',
      text: `Welcome to <b>BABI AI Chat</b>, ${userName}!\n\nI am your automated store assistant. You can check order status, search products, view official Birr prices, or reach human support.\n\nChoose an action below or type any question:`,
      time: getCurrentTime(),
      buttons: quickFaqButtons
    };
    setMessages([welcomeMsg]);
  };

  useEffect(() => {
    initWelcomeMessage();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto bg-[#08080A] text-white animate-fadeIn pb-safe">
      {/* Bot Chat Header */}
      <div className="p-3 bg-[#110E12] border-b border-[#2B1B22] flex items-center justify-between flex-shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E5092F] to-[#ff4d6d] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(229,9,47,0.4)]">
              <img
                src="/botlogo.jpg"
                alt="BABI AI Chat"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#110E12] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-white tracking-tight">BABI AI Chat</h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#E5092F]/20 text-[#ff8093] font-bold">
                STORE BOT
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Products • Prices • Orders • Live Support</p>
          </div>
        </div>

        <button
          onClick={() => {
            haptic('light');
            initWelcomeMessage();
          }}
          className="p-1.5 rounded-lg bg-[#181116] hover:bg-[#25151F] text-neutral-400 hover:text-white border border-[#311B23] transition-all cursor-pointer"
          title="Restart Chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-[#25151F]">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Label */}
            <span className="text-[10px] font-mono text-neutral-400 mb-1 px-1">
              {msg.sender === 'user' ? 'You' : 'BABI AI Assistant'}
            </span>

            {/* Bubble */}
            <div
              className={`max-w-[94%] sm:max-w-[88%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed shadow-lg overflow-hidden ${
                msg.sender === 'user'
                  ? 'bg-[#E5092F] text-white font-semibold rounded-tr-none shadow-[0_4px_16px_rgba(229,9,47,0.35)]'
                  : 'bg-[#130F14] text-neutral-100 border border-[#2C1920] rounded-tl-none'
              }`}
            >
              {/* Product Card Rendering */}
              {msg.type === 'product' && msg.productData ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 border-b border-[#2C1821] pb-2">
                    <img
                      src={msg.productData.image}
                      alt={msg.productData.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#3A1E27] flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-white text-xs truncate">
                          {msg.productData.name}
                        </span>
                        {msg.productData.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E5092F]/20 text-[#ff8093] border border-[#E5092F]/30">
                            {msg.productData.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        {msg.productData.tagline}
                      </span>
                    </div>
                  </div>

                  <div
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                    className="text-[11px] leading-relaxed text-neutral-200"
                  />
                </div>
              ) : msg.type === 'product_list' && msg.productsList ? (
                <div className="space-y-2.5">
                  <div
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                    className="text-[11px] leading-relaxed text-neutral-200"
                  />
                  <div className="space-y-1.5 pt-1">
                    {msg.productsList.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleAction(`select_product:${prod.id}`)}
                        className="p-2 rounded-xl bg-[#1A1117] border border-[#331C26] hover:border-[#E5092F]/70 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-7 h-7 rounded-lg object-cover border border-[#3A1E27] flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-white group-hover:text-[#ff8093] truncate block">
                              {prod.name}
                            </span>
                            <span className="text-[9px] text-neutral-400 flex items-center gap-1 font-mono">
                              <Zap className="w-2.5 h-2.5 text-[#E5092F]" />
                              <span>{prod.deliveryEstimate}</span>
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : msg.type === 'prices' && msg.productData ? (
                /* Strict Real Price List */
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-[#2C1821] pb-2">
                    <Tag className="w-4 h-4 text-[#E5092F] flex-shrink-0" />
                    <div>
                      <span className="font-black text-white text-xs block">
                        {msg.productData.name} — Price List
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Instant Delivery: {msg.productData.deliveryEstimate}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-[#2F1A25]">
                    {msg.productData.packages?.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-1.5 px-2 rounded-lg bg-[#181015] border border-[#2B1821] flex items-center justify-between gap-2 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-neutral-200 truncate">
                            {pkg.name}
                          </span>
                          {pkg.badge && (
                            <span className="text-[8px] font-mono px-1 rounded bg-[#E5092F]/20 text-[#ff8093]">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-black text-[#ff8093] flex-shrink-0">
                          {formatPrice(pkg.price, 'BIRR')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {msg.productData.packageNote && (
                    <p className="text-[10px] text-neutral-400 italic pt-0.5 flex items-center gap-1">
                      <Info className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                      <span>{msg.productData.packageNote}</span>
                    </p>
                  )}
                </div>
              ) : msg.type === 'about' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 border-b border-[#2C1821] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E5092F]/20 border border-[#E5092F]/40 flex items-center justify-center text-[#ff6680] font-black">
                      B
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">BABI STORE</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Official Telegram Mini App & Store
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-200 leading-relaxed">
                    BABI STORE provides fast, verified gaming top-ups, social media packages, and modern web development services in Ethiopia.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-lg bg-[#1A1116] border border-[#331B25]">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#E5092F]" />
                        <span>Fast Delivery</span>
                      </span>
                      <span className="text-neutral-400">2 - 8 mins for ID top-ups</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1A1116] border border-[#331B25]">
                      <span className="font-bold text-white flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Safe & Verified</span>
                      </span>
                      <span className="text-neutral-400">No passwords for ID topup</span>
                    </div>
                  </div>
                </div>
              ) : msg.type === 'rules' ? (
                <div className="space-y-2.5">
                  <div className="text-xs font-black text-[#ff8093] tracking-wide border-b border-[#381F27] pb-1.5 flex items-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5 text-[#E5092F]" />
                    <span>እነዚህን አንብቡ ከመግዛታችሁ በፊት (Store Rules)</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed text-neutral-200">
                    <div className="p-2 rounded-lg bg-[#1A1217] border border-[#3A1F27]">
                      <span className="font-bold text-[#ff8093] block mb-0.5">1. Refund ፖሊሲ</span>
                      እኛ የታዘዘውን እቃ ማቅረብ እስከቻልን ድረስ refund የለም።
                    </div>
                    <div className="p-2 rounded-lg bg-[#1A1217] border border-[#3A1F27]">
                      <span className="font-bold text-[#ff8093] block mb-0.5">2. የክፍያ ማስረጃ ጊዜ (20 ደቂቃ)</span>
                      ብር ከላካችሁ በኋላ ማስረጃ ሳትልኩ 20 ደቂቃ ካለፈ ተቀባይነት አይኖረውም።
                    </div>
                    <div className="p-2 rounded-lg bg-[#1A1217] border border-[#3A1F27]">
                      <span className="font-bold text-[#ff8093] block mb-0.5">3. ደረሰኝ</span>
                      ደረሰኝ ወይም transaction number ሳትልኩ "ልኬአለው" ማለት ተቀባይነት የለውም።
                    </div>
                    <div className="p-2 rounded-lg bg-[#1A1217] border border-[#3A1F27]">
                      <span className="font-bold text-[#ff8093] block mb-0.5">4. ቅሬታ ማቅረቢያ</span>
                      እቃው ካልደረሳችሁ በ30 ደቂቃ ውስጥ ቅሬታ ማቅረብ አለባችሁ።
                    </div>
                  </div>
                </div>
              ) : msg.type === 'order_single' && msg.singleOrder ? (
                /* Single Specific Order with Stepper */
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#2C1821] pb-1.5">
                    <span className="font-mono font-black text-[#ff8093] text-xs">
                      #{msg.singleOrder.orderId}
                    </span>
                    {getStatusBadge(msg.singleOrder.orderStatus)}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[160px]">
                      {msg.singleOrder.productName}
                    </span>
                    <span className="font-bold text-[#ff8093] font-mono">
                      {formatPrice(msg.singleOrder.totalPrice, 'BIRR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>{msg.singleOrder.packageName}</span>
                    <span>{formatRelativeTime(msg.singleOrder.createdAt)}</span>
                  </div>

                  {/* Stepper */}
                  {renderOrderStepper(msg.singleOrder.orderStatus)}
                </div>
              ) : msg.type === 'orders' && msg.ordersData && msg.ordersData.length > 0 ? (
                /* Orders List with Steppers */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#2E1A22] pb-1.5">
                    <span className="font-black text-white text-xs flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#E5092F]" />
                      My Orders ({msg.ordersData.length})
                    </span>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      Your Account Orders
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2F1A25]">
                    {msg.ordersData.map((ord) => (
                      <div
                        key={ord.orderId}
                        id={`chat-order-${ord.orderId}`}
                        onClick={() => onViewOrderDetails && onViewOrderDetails(ord)}
                        className="p-2.5 rounded-xl bg-[#1A1217] border border-[#361E26] hover:border-[#E5092F]/60 transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-[#ff8093] text-xs">
                            #{ord.orderId}
                          </span>
                          {getStatusBadge(ord.orderStatus)}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {ord.productName}
                          </span>
                          <span className="font-bold text-[#ff8093] font-mono">
                            {formatPrice(ord.totalPrice, 'BIRR')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-0.5">
                          <span className="truncate max-w-[150px]">{ord.packageName}</span>
                          <span>{formatRelativeTime(ord.createdAt)}</span>
                        </div>

                        {/* Order Progress Stepper */}
                        {renderOrderStepper(ord.orderStatus)}
                      </div>
                    ))}
                  </div>

                  {onOpenOrders && (
                    <button
                      onClick={() => {
                        haptic('light');
                        onOpenOrders();
                      }}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-[#1C141A] hover:bg-[#281A24] border border-[#381F27] text-neutral-200 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E5092F]" />
                      <span>View In Orders Tab</span>
                    </button>
                  )}
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                  className="space-y-1 text-xs"
                />
              )}

              {/* Support Clickable Action Cards */}
              {msg.supportLinks && msg.supportLinks.length > 0 && (
                <div className="mt-2.5 space-y-1.5 pt-2 border-t border-[#2C1920]">
                  {msg.supportLinks.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      id={`chat-support-link-${link.type}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => haptic('medium')}
                      className="block p-2.5 rounded-xl bg-[#1A1116] hover:bg-[#25151F] border border-[#3D1E27] hover:border-[#E5092F] transition-all duration-200 shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#E5092F]/15 border border-[#E5092F]/30 flex items-center justify-center text-[#ff6680] group-hover:scale-105 transition-transform">
                            {link.type === 'email' ? (
                              <Mail className="w-3.5 h-3.5 text-[#E5092F]" />
                            ) : (
                              <MessageCircle className="w-3.5 h-3.5 text-[#E5092F]" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-black text-white group-hover:text-[#ff8093] transition-colors block">
                              {link.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono block">
                              {link.handle}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#ff8093] transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Inline Action Buttons inside the message bubble directly below response text */}
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#2B1821] w-full">
                  <div className="flex flex-wrap gap-1.5 w-full">
                    {msg.buttons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        id={`btn-bot-inline-${btn.action}-${bIdx}`}
                        type="button"
                        disabled={isTyping}
                        onClick={() => handleAction(btn.action)}
                        className="flex-1 min-w-[85px] max-w-full py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all duration-150 bg-[#191117] hover:bg-[#261520] active:scale-95 disabled:opacity-50 text-neutral-200 hover:text-white border border-[#351C27] hover:border-[#E5092F]/70 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer select-none"
                      >
                        {getButtonIcon(btn.action, btn.iconType)}
                        <span className="truncate">{btn.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Time */}
              <span
                className={`text-[9px] block text-right mt-1.5 font-mono ${
                  msg.sender === 'user' ? 'text-white/80' : 'text-neutral-500'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Natural AI Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#130F14] border border-[#2C1920] rounded-tl-none w-fit shadow-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-pulse [animation-duration:1s] [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5092F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* ========================================================================= */}
      {/* Quick Action Navigation Buttons: My Orders, How to Order, Payment, Rules, Support */}
      {/* ========================================================================= */}
      <div className="p-2.5 bg-[#110E12] border-t border-[#291920] space-y-2 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickFaqButtons.map((btn) => (
            <button
              key={btn.action}
              id={`btn-bottom-quick-${btn.action}`}
              type="button"
              disabled={isTyping}
              onClick={() => handleAction(btn.action)}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-all duration-150 text-[11px] font-bold shadow-xs whitespace-nowrap ${
                activeButton === btn.action
                  ? 'scale-[0.98] bg-[#E5092F] text-white border-[#E5092F]'
                  : isTyping
                  ? 'opacity-50 bg-[#140E12] text-neutral-400 border-[#2B1720]'
                  : 'bg-[#181116] hover:bg-[#25151F] active:scale-[0.98] text-neutral-200 hover:text-white border border-[#331C24] hover:border-[#E5092F]/60'
              }`}
            >
              {getButtonIcon(btn.action, btn.iconType)}
              <span>{btn.text}</span>
            </button>
          ))}
        </div>

        {/* Text Input Bar for custom natural questions & queries */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputCommand.trim() && !isTyping) {
              handleAction(inputCommand.trim());
              setInputCommand('');
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-bot-command"
            type="text"
            value={inputCommand}
            disabled={isTyping}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder={
              isTyping
                ? 'BABI AI is typing a response...'
                : 'Ask: "PUBG price?", "TikTok coins", "where is my order"...'
            }
            className="flex-1 bg-[#161015] border border-[#2F1B23] focus:border-[#E5092F] text-white text-xs rounded-xl px-3 py-2 outline-none transition-all placeholder:text-neutral-500 shadow-inner disabled:opacity-50"
          />
          <button
            id="btn-bot-send"
            type="submit"
            disabled={!inputCommand.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white flex items-center justify-center disabled:opacity-40 shadow-md shadow-[#E5092F]/30 transition-all flex-shrink-0 active:scale-[0.98] cursor-pointer"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
