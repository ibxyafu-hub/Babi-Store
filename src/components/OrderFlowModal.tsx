import React, { useState } from 'react';
import { Product, ProductPackage, PaymentMethod, OrderItem } from '../types';
import { PAYMENT_METHODS } from '../data/catalog';
import { useTelegram } from '../context/TelegramContext';
import { formatPrice } from '../utils/formatters';
import { createFirestoreOrder } from '../lib/ordersService';
import {
  X,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Building2,
  Smartphone,
  Copy,
  Check,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  Info,
  QrCode
} from 'lucide-react';

interface OrderFlowModalProps {
  product: Product;
  selectedPackage: ProductPackage;
  quantity: number;
  onClose: () => void;
  onOrderSuccess: (order: OrderItem) => void;
}

type OrderStep = 'details' | 'payment' | 'review';

export const OrderFlowModal: React.FC<OrderFlowModalProps> = ({
  product,
  selectedPackage,
  quantity,
  onClose,
  onOrderSuccess
}) => {
  const { user, haptic } = useTelegram();

  const [currentStep, setCurrentStep] = useState<OrderStep>('details');
  const [customerInfo, setCustomerInfo] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.requiredFields.forEach((field) => {
      // Auto-populate telegram username if applicable
      if (field.id === 'telegram_username' && user.username) {
        initial[field.id] = `@${user.username}`;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        initial[field.id] = field.options[0];
      } else {
        initial[field.id] = '';
      }
    });
    return initial;
  });

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(
    PAYMENT_METHODS[0].id
  );
  const [transactionId, setTransactionId] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalPrice = Number((selectedPackage.price * quantity).toFixed(2));
  const activePaymentMethod =
    PAYMENT_METHODS.find((pm) => pm.id === selectedPaymentMethodId) || PAYMENT_METHODS[0];

  const handleCopy = (text: string, type: 'account' | 'amount') => {
    navigator.clipboard.writeText(text);
    haptic('success');
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};
    product.requiredFields.forEach((field) => {
      if (field.required) {
        const val = customerInfo[field.id]?.trim();
        if (!val) {
          errors[field.id] = `${field.label} is required`;
        } else if (field.id === 'telegram_username' && !val.startsWith('@') && !val.includes('t.me/')) {
          errors[field.id] = 'Username must start with @ (e.g. @username)';
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromDetails = () => {
    if (validateDetails()) {
      haptic('medium');
      setCurrentStep('payment');
    } else {
      haptic('error');
    }
  };

  const handleNextFromPayment = () => {
    if (!transactionId.trim()) {
      setPaymentError('Please enter the Transaction Number / Reference ID from your transfer.');
      haptic('error');
      return;
    }
    setPaymentError(null);
    haptic('medium');
    setCurrentStep('review');
  };

  const handleSubmitOrder = async () => {
    if (!transactionId.trim()) {
      setSubmitError('Transaction ID is required to verify your payment.');
      haptic('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    haptic('heavy');

    try {
      // Save directly to Firebase Firestore
      const newOrder = await createFirestoreOrder({
        product,
        selectedPackage,
        quantity,
        paymentMethod: activePaymentMethod.name,
        paymentAccount: `${activePaymentMethod.accountName} (${activePaymentMethod.accountNumber})`,
        transactionId: transactionId.trim(),
        customerInfo: {
          ...customerInfo,
          transaction_id: transactionId.trim(),
          payment_gateway: activePaymentMethod.name,
          account_number: activePaymentMethod.accountNumber
        },
        telegramUser: {
          id: user.id,
          username: user.username || 'user',
          firstName: user.first_name,
          lastName: user.last_name
        },
        notes: `Order created via BABI STORE Mini App.`
      });

      haptic('success');
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Order submission Firestore error:', err);
      setSubmitError(err.message || 'Unable to register your order in Firestore. Please check your connection and try again.');
      haptic('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#E5092F]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#E5092F]" />;
      default:
        return <Smartphone className="w-5 h-5 text-[#E5092F]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#151515] border border-[#27272A] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Indicator Header */}
        <div className="p-4 border-b border-[#27272A] bg-[#080808] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep !== 'details' ? (
              <button
                onClick={() => {
                  haptic('light');
                  if (currentStep === 'review') setCurrentStep('payment');
                  else if (currentStep === 'payment') setCurrentStep('details');
                }}
                className="w-7 h-7 rounded-lg bg-[#111111] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#E5092F]" />
            )}

            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                {currentStep === 'details' && 'Step 1: Account Information'}
                {currentStep === 'payment' && 'Step 2: Transfer & Transaction ID'}
                {currentStep === 'review' && 'Step 3: Review & Confirm Order'}
              </h2>
              <p className="text-[10px] text-[#A1A1AA]">
                {product.name} • {selectedPackage.name}
              </p>
            </div>
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

        {/* Modal Content / Steps */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Order Summary Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111111] border border-[#27272A]">
            <div className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#27272A]"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  {product.name}
                </span>
                <span className="text-[11px] text-[#E5092F] font-semibold">
                  {selectedPackage.name} {quantity > 1 ? `(×${quantity})` : ''}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-[#E5092F] font-mono">
                {formatPrice(totalPrice, 'BIRR')}
              </span>
              <span className="text-[10px] text-[#A1A1AA] block">
                {product.deliveryEstimate}
              </span>
            </div>
          </div>

          {/* STEP 1: Enter Required Information */}
          {currentStep === 'details' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-[#E5092F]" />
                <span>Please fill in the required delivery details:</span>
              </div>

              {product.requiredFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
                    <span>
                      {field.label}
                      {field.required && <span className="text-[#E5092F] ml-1">*</span>}
                    </span>
                  </label>

                  {field.type === 'select' && field.options ? (
                    <select
                      id={`field-${field.id}`}
                      value={customerInfo[field.id] || field.options[0]}
                      onChange={(e) => {
                        setCustomerInfo({ ...customerInfo, [field.id]: e.target.value });
                        if (formErrors[field.id]) {
                          setFormErrors({ ...formErrors, [field.id]: '' });
                        }
                      }}
                      className="w-full bg-[#111111] border border-[#27272A] focus:border-[#E5092F] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#151515] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`field-${field.id}`}
                      type={field.type === 'number' ? 'text' : field.type}
                      value={customerInfo[field.id] || ''}
                      onChange={(e) => {
                        setCustomerInfo({ ...customerInfo, [field.id]: e.target.value });
                        if (formErrors[field.id]) {
                          setFormErrors({ ...formErrors, [field.id]: '' });
                        }
                      }}
                      placeholder={field.placeholder}
                      className={`w-full bg-[#111111] border text-white text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#A1A1AA] ${
                        formErrors[field.id]
                          ? 'border-rose-500 bg-rose-500/[0.04]'
                          : 'border-[#27272A] focus:border-[#E5092F]'
                      }`}
                    />
                  )}

                  {formErrors[field.id] ? (
                    <p className="text-[10px] text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors[field.id]}
                    </p>
                  ) : field.helperText ? (
                    <p className="text-[10px] text-[#A1A1AA]">{field.helperText}</p>
                  ) : null}
                </div>
              ))}

              <div className="p-3 rounded-xl bg-[#E5092F]/10 border border-[#E5092F]/20 text-[11px] text-neutral-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5092F] flex-shrink-0 mt-0.5" />
                <span>
                  All information is encrypted and transmitted directly to automated dispatch servers.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Payment Method & Enter Transaction Number */}
          {currentStep === 'payment' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  1. Select Payment Method
                </span>
                <p className="text-[11px] text-[#A1A1AA]">
                  Transfer the exact amount using Telebirr or Commercial Bank of Ethiopia.
                </p>
              </div>

              {/* 2 Payment Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPaymentMethodId === pm.id;
                  return (
                    <div
                      key={pm.id}
                      id={`payment-method-${pm.id}`}
                      onClick={() => {
                        haptic('selectionChanged');
                        setSelectedPaymentMethodId(pm.id);
                        setPaymentError(null);
                      }}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#E5092F]/10 border-[#E5092F] shadow-sm shadow-[#E5092F]/20 ring-1 ring-[#E5092F]/40'
                          : 'bg-[#111111] border-[#27272A] hover:bg-[#1b1b1b]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#151515] border border-[#27272A] flex items-center justify-center">
                          {getPaymentIcon(pm.icon)}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-[#E5092F] border-[#E5092F] text-white'
                              : 'border-white/30 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-extrabold ${
                              isSelected ? 'text-white' : 'text-neutral-200'
                            }`}
                          >
                            {pm.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#A1A1AA] line-clamp-1 block">
                          {pm.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bank Account Transfer Details Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18181b] to-[#111111] border border-[#E5092F]/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(activePaymentMethod.icon)}
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {activePaymentMethod.name} Transfer Details
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Active & Verified Account
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#E5092F]/20 text-[#E5092F] border border-[#E5092F]/30">
                    {activePaymentMethod.badge || 'Official'}
                  </span>
                </div>

                {/* Account Name & Number Rows */}
                <div className="space-y-2 text-xs">
                  {/* Account Name */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d0d0e] border border-[#27272A]">
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] block uppercase tracking-wider">
                        Account Holder / Name
                      </span>
                      <span className="font-extrabold text-white text-xs">
                        {activePaymentMethod.accountName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A1A1AA] border border-white/10 font-mono">
                      Verified
                    </span>
                  </div>

                  {/* Account Number / Telebirr Phone */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0d0e] border border-[#E5092F]/40">
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] block uppercase tracking-wider">
                        {activePaymentMethod.id === 'telebirr' ? 'Telebirr Phone Number' : 'CBE Account Number'}
                      </span>
                      <span className="font-mono font-black text-sm text-[#E5092F] tracking-wide">
                        {activePaymentMethod.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(activePaymentMethod.accountNumber, 'account')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E5092F] hover:bg-[#c70828] text-white text-[11px] font-bold shadow-md shadow-[#E5092F]/30 transition-all active:scale-95"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Amount to transfer with Copy */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d0d0e] border border-[#27272A]">
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] block uppercase tracking-wider">
                        Exact Amount to Transfer
                      </span>
                      <span className="font-mono font-extrabold text-white text-xs">
                        {formatPrice(totalPrice, 'BIRR')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(totalPrice.toString(), 'amount')}
                      className="text-[10px] font-bold text-[#A1A1AA] hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      {copiedAmount ? 'Copied Amount' : 'Copy Amount'}
                    </button>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#111111] text-[10px] text-neutral-300 space-y-1">
                  <span className="font-bold text-[#E5092F] block">Quick Transfer Instructions:</span>
                  <ol className="list-decimal list-inside space-y-0.5 text-[#A1A1AA]">
                    <li>Open your {activePaymentMethod.name} App (or USSD).</li>
                    <li>Transfer <b>{formatPrice(totalPrice, 'BIRR')}</b> to <b>{activePaymentMethod.accountNumber}</b> ({activePaymentMethod.accountName}).</li>
                    <li>Copy the Transaction ID from the transfer confirmation SMS / receipt.</li>
                  </ol>
                </div>
              </div>

              {/* 2. Transaction Number Enter Place */}
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="input-transaction-id"
                  className="text-xs font-bold text-neutral-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#E5092F]" />
                    <span>Transaction Number / Reference ID</span>
                    <span className="text-[#E5092F]">*</span>
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] font-normal">
                    Required for verification
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="input-transaction-id"
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      if (paymentError) setPaymentError(null);
                    }}
                    placeholder={
                      activePaymentMethod.id === 'telebirr'
                        ? 'e.g. FT26081492048 or Telebirr Txn ID'
                        : 'e.g. 1000367064297 / CBE Ref No'
                    }
                    className={`w-full bg-[#111111] border text-white text-xs font-mono rounded-xl px-3.5 py-3 outline-none transition-colors placeholder:text-[#71717A] ${
                      paymentError
                        ? 'border-rose-500 bg-rose-500/[0.04]'
                        : 'border-[#27272A] focus:border-[#E5092F]'
                    }`}
                  />
                  {transactionId && (
                    <button
                      type="button"
                      onClick={() => setTransactionId('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {paymentError ? (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {paymentError}
                  </p>
                ) : (
                  <p className="text-[10px] text-[#A1A1AA]">
                    Enter the transaction number from your {activePaymentMethod.name} confirmation SMS to instantly link your payment.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Review Order */}
          {currentStep === 'review' && (
            <div className="space-y-3.5 animate-fadeIn">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Order Review Summary
              </span>

              <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#27272A] space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Product</span>
                  <span className="font-bold text-white">{product.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Package Tier</span>
                  <span className="font-bold text-[#E5092F]">
                    {selectedPackage.name} (Qty: {quantity})
                  </span>
                </div>
                {Object.entries(customerInfo).map(([key, val]) => {
                  const field = product.requiredFields.find((f) => f.id === key);
                  return (
                    <div key={key} className="flex justify-between py-1 border-b border-[#27272A]">
                      <span className="text-[#A1A1AA]">{field?.label || key}</span>
                      <span className="font-mono font-bold text-white max-w-[180px] truncate text-right">
                        {val}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Payment Gateway</span>
                  <span className="font-bold text-white">{activePaymentMethod.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Transferred To</span>
                  <span className="font-mono font-bold text-white text-right">
                    {activePaymentMethod.accountName} ({activePaymentMethod.accountNumber})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Transaction Number</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]">
                  <span className="text-[#A1A1AA]">Estimated Delivery</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#E5092F]" />
                    {product.deliveryEstimate}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-sm font-extrabold text-white">Total Due</span>
                  <span className="text-base font-extrabold text-[#E5092F] font-mono">
                    {formatPrice(totalPrice, 'BIRR')}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#27272A] bg-[#080808] flex items-center justify-between gap-3">
          {currentStep === 'details' && (
            <button
              id="btn-next-to-payment"
              onClick={handleNextFromDetails}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all transform active:scale-95"
            >
              <span>Continue to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'payment' && (
            <button
              id="btn-next-to-review"
              onClick={handleNextFromPayment}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all transform active:scale-95"
            >
              <span>Verify & Review Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'review' && (
            <button
              id="btn-submit-order"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E5092F] hover:bg-[#c70828] text-white font-extrabold text-xs shadow-lg shadow-[#E5092F]/25 transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order Dispatch...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Submit & Place Order ({formatPrice(totalPrice, 'BIRR')})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

