import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Instagram, 
  Mail, 
  Check, 
  Copy, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface ContactProps {
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialService = 'Website Development' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: initialService,
    message: '',
  });

  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isDark } = useTheme();

  const servicesOptions = [
    'Website Development',
    'Gaming Top-Up',
    'Social Media Top-Up',
    'Graphic Design & Branding',
    'Video Editing',
    'Other Custom Digital Request',
  ];

  const socialLinks = [
    {
      name: 'Telegram (Direct / Fast)',
      handle: '@Raf_babi',
      url: BRAND_INFO.socials.telegram,
      icon: MessageSquare,
      color: '#229ED9',
    },
    {
      name: 'Instagram (Apex Creatives)',
      handle: '@apex.creativesaio',
      url: BRAND_INFO.socials.instagram,
      icon: Instagram,
      color: '#E1306C',
    },
    {
      name: 'TikTok Official',
      handle: '@apexcreatives.aio',
      url: BRAND_INFO.socials.tiktok,
      icon: ExternalLink,
      color: '#00F2FE',
    },
    {
      name: 'Official Email',
      handle: BRAND_INFO.socials.email,
      url: `mailto:${BRAND_INFO.socials.email}`,
      icon: Mail,
      color: '#FF2B2B',
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSocial(label);
    setTimeout(() => {
      setCopiedSocial(null);
    }, 2000);
  };

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`[Apex Creatives Inquiry] ${formData.service} - ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Babi / Apex Creatives,\n\n` +
      `I would like to inquire about your services:\n\n` +
      `Client / Brand Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Service Requested: ${formData.service}\n\n` +
      `Project Details / Inquiry:\n${formData.message}\n\n` +
      `---\nSent via Apex Creatives Portfolio`
    );
    return `mailto:${BRAND_INFO.socials.email}?subject=${subject}&body=${body}`;
  };

  const getGmailWebUrl = () => {
    const subject = encodeURIComponent(`[Apex Creatives Inquiry] ${formData.service} - ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Babi / Apex Creatives,\n\n` +
      `I would like to inquire about your services:\n\n` +
      `Client / Brand Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Service Requested: ${formData.service}\n\n` +
      `Project Details / Inquiry:\n${formData.message}\n\n` +
      `---\nSent via Apex Creatives Portfolio`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${BRAND_INFO.socials.email}&su=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          services: [formData.service],
          message: formData.message.trim(),
        }),
      }).catch(() => null);
    } catch {
      // ignore
    }

    // Launch email composer directly
    const mailUrl = getMailtoUrl();
    window.location.href = mailUrl;

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section 
      id="contact" 
      className={`py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-16 transition-colors duration-300 border-t ${
        isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-[#FF2B2B]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
            <span className={`font-mono-tech text-xs uppercase tracking-[0.25em] font-bold ${
              isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
            }`}>
              GET IN TOUCH
            </span>
          </div>

          <h2 className={`font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}>
            LET'S WORK <span className="text-gradient-red">TOGETHER.</span>
          </h2>
        </motion.div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Channels & Social Placeholders */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className={`font-display font-bold text-xl sm:text-2xl mb-3 transition-colors ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                Start a conversation.
              </h3>
              <p className={`text-sm leading-relaxed transition-colors ${
                isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
              }`}>
                Have an inquiry about a website build, design project, video edit, or game/social top-up? Send a direct message or use the form.
              </p>
            </div>

            {/* Social & Channel Cards */}
            <div className="space-y-3">
              <span className={`font-mono-tech text-xs uppercase tracking-wider block ${
                isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
              }`}>
                Direct Channels:
              </span>
              
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isCopied = copiedSocial === social.name;
                const isEmail = social.url.startsWith('mailto:');

                return (
                  <div
                    key={social.name}
                    className={`rounded-xl border transition-all flex items-center justify-between group overflow-hidden ${
                      isDark
                        ? 'bg-[#111111] hover:bg-[#151515] border-white/10 hover:border-[#FF2B2B]/40'
                        : 'bg-white hover:bg-neutral-50 border-[#E5E5E5] hover:border-[#E50914]/40 shadow-sm'
                    }`}
                  >
                    <a
                      href={social.url}
                      target={isEmail ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 flex-1 min-w-0 cursor-pointer"
                      title={`Open ${social.name}`}
                    >
                      <div className={`w-10 h-10 rounded-lg border shrink-0 flex items-center justify-center transition-colors ${
                        isDark
                          ? 'bg-[#181818] border-white/10 text-white group-hover:text-[#FF2B2B] group-hover:border-[#FF2B2B]/30'
                          : 'bg-neutral-100 border-[#E5E5E5] text-[#111111] group-hover:text-[#E50914] group-hover:border-[#E50914]/30'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block transition-colors group-hover:text-[#FF2B2B] ${
                          isDark ? 'text-white' : 'text-[#111111]'
                        }`}>
                          {social.name}
                        </span>
                        <span className={`text-xs font-mono-tech truncate block ${
                          isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                        }`}>
                          {social.handle}
                        </span>
                      </div>
                    </a>

                    <div className="flex items-center gap-2 pr-4 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy(social.handle, social.name);
                        }}
                        title="Copy handle"
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#181818] hover:bg-[#222222] text-[#A8A8A8] hover:text-white border-white/5'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-[#666666] hover:text-[#111111] border-[#E5E5E5]'
                        }`}
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={social.url}
                        target={isEmail ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isDark
                            ? 'bg-[#181818] hover:bg-[#FF2B2B] text-[#A8A8A8] hover:text-white border-white/5'
                            : 'bg-neutral-100 hover:bg-[#E50914] text-[#666666] hover:text-white border-[#E5E5E5]'
                        }`}
                        title={`Open ${social.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Response Guarantee Info */}
            <div className={`p-5 rounded-xl border flex items-start gap-3.5 ${
              isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-[#E5E5E5] shadow-sm'
            }`}>
              <ShieldCheck className="w-5 h-5 text-[#FF2B2B] shrink-0 mt-0.5" />
              <div>
                <span className={`text-xs font-bold block mb-0.5 ${
                  isDark ? 'text-white' : 'text-[#111111]'
                }`}>
                  Quick Direct Replies
                </span>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  All messages are received directly by Babi. Responses typically provided within 24 hours.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl p-7 sm:p-10 border relative transition-all duration-300 ${
              isDark ? 'bg-[#111111] border-white/10 shadow-2xl' : 'bg-white border-[#E5E5E5] shadow-xl'
            }`}>
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#FF2B2B]/20 border border-[#FF2B2B] text-[#FF2B2B] flex items-center justify-center mx-auto mb-4 apex-glow-sm">
                      <Check className="w-8 h-8" />
                    </div>

                    <h3 className={`font-display font-black text-2xl sm:text-3xl ${
                      isDark ? 'text-white' : 'text-[#111111]'
                    }`}>
                      Inquiry Ready & Directed to Email!
                    </h3>

                    <p className={`text-sm max-w-md mx-auto leading-relaxed ${
                      isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                    }`}>
                      Your message has been formatted for <span className={`font-mono-tech font-semibold ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}>apexcreativesaio@gmail.com</span>. If your email application didn't open automatically, use the buttons below:
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a
                        href={getGmailWebUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Open in Gmail</span>
                      </a>

                      <a
                        href={getMailtoUrl()}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-colors ${
                          isDark
                            ? 'bg-[#181818] hover:bg-[#222222] text-white border-white/10'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-[#111111] border-[#E5E5E5]'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#FF2B2B]" />
                        <span>Open Email App</span>
                      </a>

                      <a
                        href={BRAND_INFO.socials.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-colors ${
                          isDark
                            ? 'bg-[#181818] hover:bg-[#222222] text-white border-white/10'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-[#111111] border-[#E5E5E5]'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#229ED9]" />
                        <span>Telegram @Raf_babi</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', service: 'Website Development', message: '' });
                      }}
                      className={`mt-6 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#141414] hover:bg-[#1c1c1c] text-[#A8A8A8] hover:text-white border-white/10'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-[#666666] hover:text-[#111111] border-[#E5E5E5]'
                      }`}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" id="apex-contact-form">
                    
                    {/* Name Field */}
                    <div>
                      <label htmlFor="contact-name" className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}>
                        Your Name / Brand *
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        placeholder="e.g. Alex Rivera or Apex Esports"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                          isDark
                            ? 'bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B] focus:ring-[#FF2B2B]'
                            : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914] focus:ring-[#E50914]'
                        }`}
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="contact-email" className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                          isDark
                            ? 'bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B] focus:ring-[#FF2B2B]'
                            : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914] focus:ring-[#E50914]'
                        }`}
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label htmlFor="contact-service" className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}>
                        Service of Interest *
                      </label>
                      <select
                        id="contact-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 transition-all cursor-pointer ${
                          isDark
                            ? 'bg-[#0A0A0A] border border-white/10 text-white focus:border-[#FF2B2B] focus:ring-[#FF2B2B]'
                            : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] focus:bg-white focus:border-[#E50914] focus:ring-[#E50914]'
                        }`}
                      >
                        {servicesOptions.map((opt) => (
                          <option 
                            key={opt} 
                            value={opt} 
                            className={isDark ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="contact-message" className={`block font-mono-tech text-xs uppercase tracking-wider font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-[#111111]'
                      }`}>
                        Project Details / Inquiry *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Describe your website goals, required graphics/video format, or top-up details..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 transition-all resize-none ${
                          isDark
                            ? 'bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 focus:border-[#FF2B2B] focus:ring-[#FF2B2B]'
                            : 'bg-neutral-50 border border-[#E5E5E5] text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#E50914] focus:ring-[#E50914]'
                        }`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="contact-submit-btn"
                      className="w-full py-4 px-6 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center gap-2.5 transition-all duration-200 apex-glow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>TRANSMITTING...</span>
                        </div>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
