import React, { useState } from 'react';
import { OrderItem, OrderStatus } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { getOrderStatusBannerText } from '../lib/ordersService';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Filter,
  ArrowLeft,
  Zap,
  AlertCircle
} from 'lucide-react';

interface OrdersViewProps {
  orders: OrderItem[];
  onSelectOrder: (order: OrderItem) => void;
  onBrowseStore: () => void;
  onRefreshOrders: () => void;
  isRefreshing?: boolean;
  onBack?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onSelectOrder,
  onBrowseStore,
  onRefreshOrders,
  isRefreshing = false,
  onBack
}) => {
  const { haptic } = useTelegram();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all' ||
      order.orderStatus.toLowerCase() === selectedStatus.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderId.toLowerCase().includes(q) ||
      order.productName.toLowerCase().includes(q) ||
      order.packageName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5092F]/15 text-[#E5092F] border border-[#E5092F]/30 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Processing
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            Order Confirmed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-500/10 text-neutral-300 border border-neutral-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header with back button and refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-orders-back"
            onClick={() => {
              haptic('light');
              if (onBack) onBack();
              else onBrowseStore();
            }}
            className="p-2 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white hover:border-[#E5092F]/40 hover:bg-[#1f1f1f] transition-all flex items-center justify-center flex-shrink-0"
            title="Back to Store"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              My Orders
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Track your instant top-ups and delivery statuses
            </p>
          </div>
        </div>

        <button
          id="btn-refresh-orders"
          onClick={() => {
            haptic('light');
            onRefreshOrders();
          }}
          className={`p-2 rounded-xl bg-[#151515] border border-[#27272A] text-neutral-300 hover:text-white transition-colors ${
            isRefreshing ? 'animate-spin text-[#E5092F]' : ''
          }`}
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input
          id="input-orders-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID (e.g. BABI-...) or game..."
          className="w-full bg-[#151515] border border-[#27272A] focus:border-[#E5092F] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors placeholder:text-[#A1A1AA]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => {
          const isSelected = selectedStatus === tab.id;
          const count =
            tab.id === 'all'
              ? orders.length
              : orders.filter(
                  (o) => o.orderStatus.toLowerCase() === tab.id.toLowerCase()
                ).length;

          return (
            <button
              key={tab.id}
              id={`filter-order-status-${tab.id}`}
              onClick={() => {
                haptic('selectionChanged');
                setSelectedStatus(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#E5092F] text-white border-[#E5092F] shadow-sm shadow-[#E5092F]/20'
                  : 'bg-[#151515] text-[#A1A1AA] border-[#27272A] hover:bg-[#1b1b1b] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-[#111111] text-[#A1A1AA] border border-[#27272A]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-[#151515] border border-[#27272A] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-neutral-500 mx-auto flex items-center justify-center border border-[#27272A]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">No orders found</h3>
            <p className="text-xs text-[#A1A1AA] mt-1">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You have not placed any orders yet.'}
            </p>
          </div>
          <button
            id="btn-empty-browse-store"
            onClick={() => {
              haptic('medium');
              onBrowseStore();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-md shadow-[#E5092F]/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Products</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              id={`order-item-${order.orderId}`}
              onClick={() => {
                haptic('light');
                onSelectOrder(order);
              }}
              className="cursor-pointer group flex flex-col p-3.5 rounded-2xl bg-[#151515] hover:bg-[#1b1b1b] border border-[#27272A] hover:border-[#E5092F]/40 transition-all duration-200 active:scale-[0.99] gap-2.5"
            >
              {/* Header: ID + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#E5092F]">
                    #{order.orderId}
                  </span>
                  <span className="text-[10px] text-[#A1A1AA]">
                    {new Date(order.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {getStatusBadge(order.orderStatus)}
              </div>

              {/* Body: Thumbnail, Package & Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#27272A]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E5092F] transition-colors">
                      {order.productName}
                    </h4>
                    <p className="text-[11px] text-neutral-300">
                      {order.packageName} {order.quantity > 1 ? `(×${order.quantity})` : ''}
                    </p>
                    <span className="text-[10px] text-[#A1A1AA]">
                      via {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-white font-mono block">
                      {formatPrice(order.totalPrice, 'BIRR')}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#E5092F] transition-colors" />
                </div>
              </div>

              {/* Live Status Notice */}
              <div
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 border ${
                  order.orderStatus === 'Confirmed'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                    : order.orderStatus === 'Processing'
                    ? 'bg-[#E5092F]/10 border-[#E5092F]/25 text-[#E5092F]'
                    : order.orderStatus === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : order.orderStatus === 'Cancelled'
                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                    : 'bg-[#111111] border-[#27272A] text-[#A1A1AA]'
                }`}
              >
                <span>{getOrderStatusBannerText(order.orderStatus)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
