import React, { useState } from 'react';
import { OrderItem } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { getOrderStatusBannerText } from '../lib/ordersService';
import {
  X,
  Copy,
  Check,
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onOpenSupportWithOrder: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onOpenSupportWithOrder
}) => {
  const { haptic } = useTelegram();
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    haptic('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Processing':
        return 'bg-[#E5092F]/15 text-[#E5092F] border-[#E5092F]/30';
      case 'Confirmed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-500/10 text-neutral-300 border-neutral-500/30';
    }
  };

  const getBannerStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Processing':
        return 'bg-[#E5092F]/10 border-[#E5092F]/30 text-[#E5092F]';
      case 'Confirmed':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'Cancelled':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
      default:
        return 'bg-neutral-900 border-neutral-700 text-neutral-300';
    }
  };

  const steps = [
    {
      title: 'Order Submitted',
      done: true,
      time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      title: 'Order Confirmed (Accepted)',
      done: order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Completed',
      time: order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Completed' ? 'Confirmed' : 'Pending'
    },
    {
      title: 'Processing Top-up',
      done: order.orderStatus === 'Processing' || order.orderStatus === 'Completed',
      time: order.orderStatus === 'Completed' ? 'Delivered' : order.orderStatus === 'Processing' ? 'In progress' : 'Pending'
    },
    {
      title: 'Delivered & Completed',
      done: order.orderStatus === 'Completed',
      time: order.orderStatus === 'Completed' ? 'Delivered' : 'Pending'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#151515] border border-[#27272A] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#27272A] bg-[#080808] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-[#E5092F]">
                #{order.orderId}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus === 'Confirmed' ? 'Order Confirmed' : order.orderStatus}
              </span>
            </div>
            <span className="text-[10px] text-[#A1A1AA]">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              haptic('light');
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#111111] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Prominent Status Banner */}
          <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${getBannerStyle(order.orderStatus)}`}>
            {order.orderStatus === 'Confirmed' && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
            {order.orderStatus === 'Processing' && <Zap className="w-4 h-4 text-[#E5092F] shrink-0" />}
            {order.orderStatus === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {order.orderStatus === 'Cancelled' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {order.orderStatus === 'Pending' && <Clock className="w-4 h-4 text-neutral-400 shrink-0" />}
            <span>{getOrderStatusBannerText(order.orderStatus)}</span>
          </div>

          {/* Product Header Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111111] border border-[#27272A]">
            <img
              src={order.productImage}
              alt={order.productName}
              className="w-12 h-12 rounded-xl object-cover border border-[#27272A]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white tracking-tight truncate">
                {order.productName}
              </h3>
              <p className="text-xs font-extrabold text-[#E5092F]">
                {order.packageName} {order.quantity > 1 ? `(Qty: ${order.quantity})` : ''}
              </p>
              <span className="text-[10px] text-[#A1A1AA]">
                {order.amount} {order.packageUnit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-[#E5092F] font-mono">
                {formatPrice(order.totalPrice, 'BIRR')}
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Timeline / Progress */}
          <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-3">
            <span className="text-xs font-bold text-neutral-300 block">
              Fulfillment Timeline
            </span>

            <div className="space-y-2.5">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        s.done
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#151515] border border-[#27272A] text-neutral-500'
                      }`}
                    >
                      {s.done ? '✓' : idx + 1}
                    </div>
                    <span className={s.done ? 'text-white font-semibold' : 'text-neutral-500'}>
                      {s.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] font-mono">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Profile & Identity Section */}
          <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-2 text-xs">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <span>👤</span> Customer
            </span>

            <div className="flex justify-between py-1 border-b border-[#27272A] items-center">
              <span className="text-[#A1A1AA]">Telegram Username</span>
              <span className={`font-mono font-bold ${order.telegramUsername || order.telegramUser?.username ? 'text-white' : 'text-neutral-500 italic'}`}>
                {order.telegramUsername || (order.telegramUser?.username ? `@${order.telegramUser.username}` : 'No Telegram username')}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#27272A] items-center">
              <span className="text-[#A1A1AA]">Telegram ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-white">
                  {order.telegramId || (order.telegramUser?.id && order.telegramUser.id > 0 ? order.telegramUser.id : (order.guestId ? `Guest (${order.guestId.slice(0, 10)}...)` : 'N/A'))}
                </span>
                {(order.telegramId || (order.telegramUser?.id && order.telegramUser.id > 0)) && (
                  <button
                    onClick={() => handleCopy(String(order.telegramId || order.telegramUser?.id))}
                    className="text-[#A1A1AA] hover:text-white p-0.5"
                    title="Copy Telegram ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">First Name</span>
              <span className="text-white font-medium">
                {order.telegramFirstName || order.telegramUser?.firstName || (order.guestId ? 'Guest Customer' : 'N/A')}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Last Name</span>
              <span className="text-white font-medium">
                {order.telegramLastName || order.telegramUser?.lastName || 'None'}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-2 text-xs">
            <span className="text-xs font-bold text-neutral-300 block">
              Recipient & Account Details
            </span>

            {Object.entries(order.customerInfo).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#A1A1AA] capitalize">{k.replace('_', ' ')}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-white">{String(v)}</span>
                  <button
                    onClick={() => handleCopy(String(v))}
                    className="text-[#A1A1AA] hover:text-white p-0.5"
                    title="Copy info"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Payment Gateway</span>
              <span className="font-semibold text-white">{order.paymentMethod}</span>
            </div>

            {order.paymentAccount && (
              <div className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#A1A1AA]">Payment Account</span>
                <span className="font-mono text-white text-right">{order.paymentAccount}</span>
              </div>
            )}

            {(order.transactionId || order.customerInfo?.transaction_id) && (
              <div className="flex justify-between py-1 items-center">
                <span className="text-[#A1A1AA]">Transaction / Ref No</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {order.transactionId || order.customerInfo?.transaction_id}
                  </span>
                  <button
                    onClick={() => handleCopy(order.transactionId || order.customerInfo?.transaction_id || '')}
                    className="text-[#A1A1AA] hover:text-white p-0.5"
                    title="Copy Transaction ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {order.notes && (
            <div className="p-3 rounded-xl bg-[#111111] border border-[#27272A] text-[11px] text-[#A1A1AA]">
              <span className="font-bold text-neutral-300 block mb-0.5">System Dispatch Notes:</span>
              <span>{order.notes}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#27272A] bg-[#080808] grid grid-cols-2 gap-2">
          <button
            id={`btn-copy-id-${order.orderId}`}
            onClick={() => handleCopy(order.orderId)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-[#1b1b1b] text-neutral-300 text-xs font-bold border border-[#27272A]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied ID' : 'Copy Order ID'}</span>
          </button>

          <button
            id={`btn-order-support-${order.orderId}`}
            onClick={() => {
              haptic('medium');
              onOpenSupportWithOrder(order.orderId);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white text-xs font-extrabold shadow-md shadow-[#E5092F]/20"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Order Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};
