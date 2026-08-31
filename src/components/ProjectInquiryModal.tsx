import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Globe,
  Gamepad2,
  Film,
  Palette,
  Loader2,
  AlertCircle,
  Mail,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ApexLogo } from './ApexLogo';

export interface InquiryFormData {
  service: string;
  name: string;
  brand: string;
  email: string;
  notes: string;
}

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InquiryFormData;
  setFormData: React.Dispatch<React.SetStateAction<InquiryFormData>>;
  initialStep?: 1 | 2;
}

export const SERVICE_CHOICES = [
  {
    id: 'GAMING & SOCIAL MEDIA TOP-UP',
    title: 'GAMING & SOCIAL MEDIA TOP-UP',
    icon: Gamepad2,
    desc: 'In-game currency, game passes, account boosts & social growth',
  },
  {
    id: 'WEB DEVELOPING',
    title: 'WEB DEVELOPING',
    icon: Globe,
    desc: 'Modern websites, web apps, portfolios, and responsive interfaces',
  },
  {
    id: 'VIDEO EDITING',
    title: 'VIDEO EDITING',
    icon: Film,
    desc: 'Shorts, reels, long-form YouTube editing & kinetic motion',
  },
  {
    id: 'GRAPHICS DESIGN',
    title: 'GRAPHICS DESIGN',
    icon: Palette,
    desc: 'Logos, branding, social thumbnails, posters & visual assets',
  },
];

export const ProjectInquiryModal: React.FC<ProjectInquiryModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  initialStep = 1,
}) => {
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    service?: string;
    name?: string;
    email?: string;
    notes?: string;
  }>({});

  const { isDark } = useTheme();

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSelectService = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, service: serviceId }));
    if (validationErrors.service) {
      setValidationErrors((prev) => ({ ...prev, service: undefined }));
    }
  };

  const handleInputChange = (field: keyof InquiryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinueToStep2 = () => {
    if (!formData.service) {
      setValidationErrors({ service: 'Please select one service to continue.' });
      return;
    }
    setValidationErrors({});
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setErrorMessage(null);
    setValidationErrors({});
    setStep(1);
  };

  const validateStep2 = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      notes?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.notes.trim()) {
      errors.notes = 'Please enter your project notes or requirements.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          service: formData.service || 'WEB DEVELOPING',
          name: formData.name.trim(),
          brand: formData.brand.trim() || 'N/A',
          email: formData.email.trim(),
          notes: formData.notes.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setIsSubmitted(true);
        setErrorMessage(null);
        // Clear the form after successful submission
        setFormData({
          service: 'WEB DEVELOPING',
          name: '',
          brand: '',
          email: '',
          notes: '',
        });
      } else {
        setErrorMessage(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="project-inquiry-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleResetAndClose();
            }
          }}
          className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-5 md:p-6 transition-colors duration-300 ${
            isDark
              ? 'bg-[#050505]/95 backdrop-blur-xl'
              : 'bg-black/60 backdrop-blur-md'
          }`}
        >
          {/* Subtle Ambient Background Glows */}
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF2B2B]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col border rounded-2xl sm:rounded-3xl relative my-auto shadow-2xl transition-all duration-300 overflow-hidden ${
              isDark
                ? 'bg-[#0D0D0D] border-white/10 text-white'
                : 'bg-white border-[#E5E5E5] text-[#111111]'
            }`}
          >
            {/* Top Navigation & Close Header - Pinned at top of modal */}
            <div
              className={`shrink-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b z-10 ${
                isDark ? 'border-white/5 bg-[#0D0D0D]' : 'border-[#E5E5E5] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ApexLogo variant="icon" size="xs" />
                <div className="flex flex-col">
                  <span
                    className={`font-mono-tech text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}
                  >
                    APEX CREATIVES
                  </span>
                  <span className="text-[10px] font-mono-tech text-[#FF2B2B] font-semibold">
                    PROJECT INQUIRY
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleResetAndClose}
                aria-label="Close modal"
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-[#A8A8A8] hover:text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 border-[#E5E5E5] text-[#666666] hover:text-black'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 md:p-8 touch-pan-y focus:outline-none">
              {/* Success State */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 sm:py-12 text-center space-y-6 max-w-md mx-auto"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF2B2B]/15 border border-[#FF2B2B]/40 text-[#FF2B2B] flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(255,43,43,0.3)]">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3
                      className={`font-display font-black text-2xl sm:text-3xl tracking-tight ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}
                    >
                      ✓ MESSAGE SENT
                    </h3>
                    <p
                      className={`text-sm sm:text-base font-light leading-relaxed ${
                        isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                      }`}
                    >
                      Thanks for contacting Apex Creatives.
                      <br />
                      I'll get back to you as soon as possible.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      id="inquiry-return-btn"
                      className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                        isDark
                          ? 'bg-white hover:bg-white/90 text-black'
                          : 'bg-[#111111] hover:bg-black text-white'
                      }`}
                    >
                      BACK TO APEX CREATIVES
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Multi-step Form Flow */
                <div className="space-y-6">
                  {/* STEP 1: Choose What You Want */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="space-y-1.5 text-left">
                        <h2
                          className={`font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight ${
                            isDark ? 'text-white' : 'text-[#111111]'
                          }`}
                        >
                          WHAT DO YOU WANT TO CREATE?
                        </h2>
                        <p
                          className={`text-sm sm:text-base font-light ${
                            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                          }`}
                        >
                          Choose the service you're interested in.
                        </p>
                      </div>

                      {/* Validation Notice if any */}
                      {validationErrors.service && (
                        <div className="flex items-center gap-2 text-xs text-[#FF2B2B] font-mono-tech bg-[#FF2B2B]/10 border border-[#FF2B2B]/30 px-3.5 py-2.5 rounded-xl">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{validationErrors.service}</span>
                        </div>
                      )}

                      {/* 4 Large Clickable Service Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {SERVICE_CHOICES.map((choice, index) => {
                          const isSelected = formData.service === choice.id;
                          const Icon = choice.icon;

                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => handleSelectService(choice.id)}
                              id={`select-service-${index + 1}`}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none flex flex-col justify-between relative border ${
                                isSelected
                                  ? isDark
                                    ? 'bg-[#161616] border-2 border-[#FF2B2B] shadow-[0_0_25px_rgba(255,43,43,0.22)]'
                                    : 'bg-white border-2 border-[#E50914] shadow-md'
                                  : isDark
                                    ? 'bg-[#121212] border-white/10 hover:border-white/20 hover:bg-[#151515]'
                                    : 'bg-neutral-50 border-[#E5E5E5] hover:border-[#CCCCCC] hover:bg-neutral-100'
                              }`}
                            >
                              <div className="flex items-start justify-between w-full mb-3">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
                                    isSelected
                                      ? 'bg-[#FF2B2B] text-white shadow-md'
                                      : isDark
                                        ? 'bg-[#1A1A1A] text-white/80 border border-white/5'
                                        : 'bg-neutral-200 text-neutral-800 border border-[#E5E5E5]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>

                                {/* Checkmark Indicator */}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-[#FF2B2B] text-white scale-100 ring-2 ring-[#FF2B2B]/40'
                                      : isDark
                                        ? 'border border-white/20 opacity-40'
                                        : 'border border-neutral-300 opacity-60'
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  )}
                                </div>
                              </div>

                              <div>
                                <h3
                                  className={`font-display font-black text-sm sm:text-base tracking-wide ${
                                    isSelected
                                      ? isDark
                                        ? 'text-white'
                                        : 'text-[#111111]'
                                      : isDark
                                        ? 'text-white/90'
                                        : 'text-neutral-900'
                                  }`}
                                >
                                  {choice.title}
                                </h3>
                                <p
                                  className={`text-xs font-light mt-1.5 line-clamp-2 ${
                                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                                  }`}
                                >
                                  {choice.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Step 1 Continue Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleContinueToStep2}
                          id="inquiry-continue-btn"
                          className="w-full bg-[#FF2B2B] hover:bg-[#E50914] text-white py-4 px-6 rounded-xl font-display font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-[0_8px_30px_rgba(255,43,43,0.35)] hover:shadow-[0_12px_40px_rgba(255,43,43,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          <span>CONTINUE</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Project Details */}
                  {step === 2 && (
                    <motion.form
                      key="step-2"
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      noValidate
                    >
                      {/* Header */}
                      <div className="space-y-2 text-left">
                        <h2
                          className={`font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight ${
                            isDark ? 'text-white' : 'text-[#111111]'
                          }`}
                        >
                          TELL ME ABOUT YOUR PROJECT
                        </h2>

                        {/* Display Selected Service Pill */}
                        <div className="pt-1">
                          <div
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono-tech ${
                              isDark
                                ? 'bg-white/5 border-[#FF2B2B]/40 text-white'
                                : 'bg-neutral-100 border-[#FF2B2B]/40 text-neutral-900'
                            }`}
                          >
                            <span className="text-[#FF2B2B] font-bold uppercase tracking-wider">
                              SERVICE SELECTED:
                            </span>
                            <span className="font-extrabold uppercase text-white bg-[#FF2B2B] px-2 py-0.5 rounded text-[11px]">
                              {formData.service || 'WEB DEVELOPING'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4 pt-1">
                        {/* FULL NAME */}
                        <div className="space-y-1.5 text-left">
                          <label
                            className={`block text-[11px] font-mono-tech uppercase tracking-wider font-bold ${
                              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                            }`}
                          >
                            FULL NAME <span className="text-[#FF2B2B]">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your name"
                            className={`w-full min-h-[48px] border rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none ${
                              isDark
                                ? `bg-[#121212] text-white placeholder-white/20 ${
                                    validationErrors.name
                                      ? 'border-[#FF2B2B] ring-1 ring-[#FF2B2B]'
                                      : 'border-white/10 focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B]'
                                  }`
                                : `bg-neutral-50 text-[#111111] placeholder-neutral-400 ${
                                    validationErrors.name
                                      ? 'border-[#E50914] ring-1 ring-[#E50914]'
                                      : 'border-[#E5E5E5] focus:bg-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]'
                                  }`
                            }`}
                          />
                          {validationErrors.name && (
                            <p className="text-[11px] text-[#FF2B2B] font-mono-tech">
                              {validationErrors.name}
                            </p>
                          )}
                        </div>

                        {/* BRAND / BUSINESS NAME */}
                        <div className="space-y-1.5 text-left">
                          <label
                            className={`block text-[11px] font-mono-tech uppercase tracking-wider font-bold ${
                              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                            }`}
                          >
                            BRAND / BUSINESS NAME
                          </label>
                          <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            placeholder="Enter your brand or business name"
                            className={`w-full min-h-[48px] border rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none ${
                              isDark
                                ? 'bg-[#121212] border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B]'
                                : 'bg-neutral-50 border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]'
                            }`}
                          />
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div className="space-y-1.5 text-left">
                          <label
                            className={`block text-[11px] font-mono-tech uppercase tracking-wider font-bold ${
                              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                            }`}
                          >
                            EMAIL ADDRESS <span className="text-[#FF2B2B]">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email address"
                            className={`w-full min-h-[48px] border rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none ${
                              isDark
                                ? `bg-[#121212] text-white placeholder-white/20 ${
                                    validationErrors.email
                                      ? 'border-[#FF2B2B] ring-1 ring-[#FF2B2B]'
                                      : 'border-white/10 focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B]'
                                  }`
                                : `bg-neutral-50 text-[#111111] placeholder-neutral-400 ${
                                    validationErrors.email
                                      ? 'border-[#E50914] ring-1 ring-[#E50914]'
                                      : 'border-[#E5E5E5] focus:bg-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]'
                                  }`
                            }`}
                          />
                          {validationErrors.email && (
                            <p className="text-[11px] text-[#FF2B2B] font-mono-tech">
                              {validationErrors.email}
                            </p>
                          )}
                        </div>

                        {/* PROJECT NOTES */}
                        <div className="space-y-1.5 text-left">
                          <label
                            className={`block text-[11px] font-mono-tech uppercase tracking-wider font-bold ${
                              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                            }`}
                          >
                            PROJECT NOTES <span className="text-[#FF2B2B]">*</span>
                          </label>
                          <textarea
                            rows={4}
                            name="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Tell me what you want, your idea, requirements, deadline, budget, or anything else..."
                            className={`w-full border rounded-xl p-4 text-sm transition-all resize-none focus:outline-none ${
                              isDark
                                ? `bg-[#121212] text-white placeholder-white/20 ${
                                    validationErrors.notes
                                      ? 'border-[#FF2B2B] ring-1 ring-[#FF2B2B]'
                                      : 'border-white/10 focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B]'
                                  }`
                                : `bg-neutral-50 text-[#111111] placeholder-neutral-400 ${
                                    validationErrors.notes
                                      ? 'border-[#E50914] ring-1 ring-[#E50914]'
                                      : 'border-[#E5E5E5] focus:bg-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]'
                                  }`
                            }`}
                          />
                          {validationErrors.notes && (
                            <p className="text-[11px] text-[#FF2B2B] font-mono-tech">
                              {validationErrors.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Submission Error Banner if any */}
                      {errorMessage && (
                        <div className="p-4 bg-red-950/60 border border-[#FF2B2B]/60 rounded-xl text-xs font-mono-tech text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                          <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                            <div>
                              <p className="font-bold text-white">
                                {errorMessage}
                              </p>
                            </div>
                          </div>

                          <a
                            href="mailto:apexcreativesaio@gmail.com"
                            className="px-3 py-1.5 rounded-lg bg-[#FF2B2B]/20 hover:bg-[#FF2B2B]/30 text-white border border-[#FF2B2B]/40 font-bold transition-all text-[11px] flex items-center gap-1.5 shrink-0"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#FF2B2B]" />
                            <span>apexcreativesaio@gmail.com</span>
                          </a>
                        </div>
                      )}

                      {/* Action Buttons: BACK and SEND MESSAGE */}
                      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={handleBackToStep1}
                          id="inquiry-back-btn"
                          className={`w-full sm:w-auto px-6 py-4 rounded-xl border font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                            isDark
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 border-[#E5E5E5] text-[#111111]'
                          }`}
                        >
                          <span>BACK</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          id="submit-project-request-btn"
                          className="w-full sm:flex-1 bg-[#FF2B2B] hover:bg-[#E50914] disabled:opacity-60 text-white py-4 px-6 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_8px_30px_rgba(255,43,43,0.35)] hover:shadow-[0_12px_40px_rgba(255,43,43,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>SENDING MESSAGE...</span>
                            </>
                          ) : (
                            <>
                              <span>SEND MESSAGE</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
