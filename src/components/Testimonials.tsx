import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star, StarHalf, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handleSelectReview = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - Math.ceil(rating));

    return (
      <div className="flex items-center gap-1.5 mb-6 text-[#FF2B2B]">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF2B2B] text-[#FF2B2B]" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF2B2B] text-[#FF2B2B]" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 opacity-40" />
        ))}
      </div>
    );
  };

  return (
    <section 
      id="reviews" 
      className={`py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-16 transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#FF2B2B]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                FEEDBACK & REVIEWS
              </span>
            </div>

            <h2 className={`font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              WHAT <span className="text-gradient-red">PEOPLE SAY</span>
            </h2>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#141414] border-white/15 text-white hover:border-[#FF2B2B] hover:text-[#FF2B2B]'
                  : 'bg-white border-[#E5E5E5] text-[#111111] hover:border-[#E50914] hover:text-[#E50914] shadow-sm'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#141414] border-white/15 text-white hover:border-[#FF2B2B] hover:text-[#FF2B2B]'
                  : 'bg-white border-[#E5E5E5] text-[#111111] hover:border-[#E50914] hover:text-[#E50914] shadow-sm'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Testimonial Showcase Container */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-3xl p-8 sm:p-12 border relative shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#111111] border-white/10 hover:border-[#FF2B2B]/40'
                  : 'bg-white border-[#E5E5E5] hover:border-[#E50914]/40 shadow-md'
              }`}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Quote Icon Background */}
              <Quote className={`w-16 h-16 sm:w-20 sm:h-20 absolute top-6 right-6 pointer-events-none ${
                isDark ? 'text-white/5' : 'text-black/5'
              }`} />

              <div>
                {/* Rating stars */}
                {renderStars(TESTIMONIALS_DATA[currentIndex].rating)}

                {/* Quote Text */}
                <p className={`font-display font-medium text-lg sm:text-2xl leading-relaxed mb-8 transition-colors ${
                  isDark ? 'text-white' : 'text-[#111111]'
                }`}>
                  "{TESTIMONIALS_DATA[currentIndex].content}"
                </p>
              </div>

              {/* Author Info */}
              <div className={`flex items-center justify-between pt-6 border-t flex-wrap gap-4 ${
                isDark ? 'border-white/10' : 'border-[#E5E5E5]'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-display font-black text-sm ${
                    isDark
                      ? 'bg-[#1C1C1C] border-[#FF2B2B]/40 text-white'
                      : 'bg-neutral-100 border-[#E50914]/40 text-[#111111]'
                  }`}>
                    {TESTIMONIALS_DATA[currentIndex].clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`font-display font-bold text-base transition-colors ${
                      isDark ? 'text-white' : 'text-[#111111]'
                    }`}>
                      {TESTIMONIALS_DATA[currentIndex].clientName}
                    </h4>
                    <span className={`text-xs font-mono-tech block ${
                      isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                    }`}>
                      {TESTIMONIALS_DATA[currentIndex].clientRole} • {TESTIMONIALS_DATA[currentIndex].companyOrHandle}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-mono-tech px-3.5 py-1.5 rounded-full border font-semibold ${
                  isDark
                    ? 'bg-[#181818] text-[#FF2B2B] border-[#FF2B2B]/30'
                    : 'bg-neutral-100 text-[#E50914] border-[#E50914]/30'
                }`}>
                  {TESTIMONIALS_DATA[currentIndex].serviceType}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots & Verified Indicator */}
          <div className="flex items-center justify-between mt-6 px-2">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectReview(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === i 
                      ? 'w-8 bg-[#FF2B2B]' 
                      : isDark ? 'w-2 bg-white/20 hover:bg-white/40' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>

            <div className={`flex items-center gap-1.5 text-xs font-mono-tech ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Feedback</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
