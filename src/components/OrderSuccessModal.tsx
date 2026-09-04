import React, { useState } from 'react';
import { OrderItem } from '../types';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { getOrderStatusBannerText } from '../lib/ordersService';
import {
  CheckCircle2,
  Copy,
  Check,
  Package,
  Headphones,
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderItem;
  onClose: () => void;
  onViewOrders: () => void;
  onOpenSupport: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
  onOpenSupport
}) => {
  const { haptic } = useTelegram();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    haptic('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const isConfirmed = order.orderStatus === 'Confirmed';
  const isProcessing = order.orderStatus === 'Processing';
  const isCompleted = order.orderStatus === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#151515] border border-[#27272A] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon & Banner */}
        <div className="p-6 text-center bg-gradient-to-b from-[#E5092F]/15 via-[#151515] to-[#151515] border-b border-[#27272A]">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg animate-fadeIn border-2 ${
              isCompleted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
                : isConfirmed
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isConfirmed ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : (
              <CheckCircle2 className="w-9 h-9" />
            )}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            {isConfirmed ? 'Order Confirmed' : isCompleted ? 'Order Completed' : 'Order Received'}
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            {isConfirmed
              ? 'Your payment was verified and the order is accepted.'
              : isCompleted
              ? 'Your top-up has been successfully delivered!'
              : 'Thank you! Your order has been registered in the automated dispatch queue.'}
          </p>

          {/* Unique Order ID badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111111] border border-[#27272A]">
            <span className="text-[11px] text-[#A1A1AA]">Order ID:</span>
            <span className="font-mono text-sm font-extrabold text-[#E5092F]">
              #{order.orderId}
            </span>
            <button
              id="btn-copy-order-id"
              onClick={handleCopyOrderId}
              className="p-1 rounded hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
              title="Copy Order ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* Real-time status callout */}
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
              isConfirmed
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : isProcessing
                ? 'bg-[#E5092F]/10 border-[#E5092F]/30 text-[#E5092F]'
                : isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300'
            }`}
          >
            <span>{getOrderStatusBannerText(order.orderStatus)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Product</span>
              <span className="font-bold text-white">{order.productName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Package Tier</span>
              <span className="font-bold text-[#E5092F]">
                {order.packageName} (Qty: {order.quantity})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Amount / Delivered Units</span>
              <span className="font-bold text-white">
                {order.amount} {order.packageUnit}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Payment Status</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Order Status</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  isConfirmed
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-[#E5092F]/15 text-[#E5092F] border-[#E5092F]/30'
                }`}
              >
                {isConfirmed ? 'Order Confirmed' : order.orderStatus}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272A]">
              <span className="text-[#A1A1AA]">Payment Gateway</span>
              <span className="font-medium text-white">{order.paymentMethod}</span>
            </div>
            {(order.transactionId || order.customerInfo?.transaction_id) && (
              <div className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#A1A1AA]">Transaction Ref ID</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                  {order.transactionId || order.customerInfo?.transaction_id}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="font-bold text-neutral-300">Total Charged</span>
              <span className="font-extrabold text-[#E5092F] font-mono text-sm">
                {formatPrice(order.totalPrice, 'BIRR')}
              </span>
            </div>
          </div>

          {/* Automated fulfillment notice */}
          <div className="p-3 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/20 text-[11px] text-neutral-300 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#E5092F] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">Automated Fulfillment Running</span>
              <span className="text-[#A1A1AA]">
                Your account will be credited automatically within 1 to 5 minutes. You can check real-time progress in the Orders tab.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#27272A] bg-[#080808] space-y-2">
          <button
            id="btn-track-in-orders"
            onClick={() => {
              haptic('medium');
              onViewOrders();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all active:scale-[0.98]"
          >
            <Package className="w-4 h-4" />
            <span>Track Order in My Orders</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-support-from-order"
              onClick={() => {
                haptic('light');
                onOpenSupport();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-[#1b1b1b] text-neutral-300 text-xs font-bold border border-[#27272A]"
            >
              <Headphones className="w-3.5 h-3.5 text-[#E5092F]" />
              <span>Contact Support</span>
            </button>

            <button
              id="btn-continue-shopping"
              onClick={() => {
                haptic('light');
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-[#1b1b1b] text-neutral-300 text-xs font-bold border border-[#27272A]"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
