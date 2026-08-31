import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { HowIWork } from './components/HowIWork';
import { Testimonials } from './components/Testimonials';
import { CtaSection } from './components/CtaSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { StickyMobileCta } from './components/StickyMobileCta';
import { TopUpModal } from './components/TopUpModal';
import { ProjectInquiryModal, InquiryFormData } from './components/ProjectInquiryModal';

function MainApp() {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpModalType, setTopUpModalType] = useState<'gaming' | 'social'>('gaming');
  const [isProjectInquiryOpen, setIsProjectInquiryOpen] = useState(false);
  const [selectedContactService, setSelectedContactService] = useState('Website Development');

  // Persistent Project Inquiry Form Data (retains client input across steps)
  const [inquiryFormData, setInquiryFormData] = useState<InquiryFormData>({
    service: 'WEB DEVELOPING',
    name: '',
    brand: '',
    email: '',
    notes: '',
  });

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenProjectInquiry = (initialService?: string) => {
    if (initialService) {
      const lower = initialService.toLowerCase();
      let matchedService = 'WEB DEVELOPING';
      if (lower.includes('gaming') || lower.includes('top-up') || lower.includes('social media')) {
        matchedService = 'GAMING & SOCIAL MEDIA TOP-UP';
      } else if (lower.includes('video') || lower.includes('edit') || lower.includes('motion')) {
        matchedService = 'VIDEO EDITING';
      } else if (lower.includes('graphic') || lower.includes('design') || lower.includes('brand') || lower.includes('logo')) {
        matchedService = 'GRAPHICS DESIGN';
      } else if (lower.includes('web') || lower.includes('site') || lower.includes('develop')) {
        matchedService = 'WEB DEVELOPING';
      }

      setInquiryFormData((prev) => ({
        ...prev,
        service: matchedService,
      }));
      setSelectedContactService(initialService);
    }
    setIsProjectInquiryOpen(true);
  };

  const handleOpenTopUp = (type: 'gaming' | 'social') => {
    setTopUpModalType(type);
    setIsTopUpModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] dark:bg-[#080808] text-white dark:text-white light:bg-[#F7F7F7] light:text-[#111111] flex flex-col selection:bg-[#FF2B2B]/30 selection:text-white transition-colors duration-300 relative pb-16 md:pb-0">
      {/* Global Navbar with Mobile Menu & Theme Toggle */}
      <Navbar onWorkTogetherClick={() => handleOpenProjectInquiry()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onContactClick={() => handleOpenProjectInquiry()}
          onServicesClick={() => scrollToSection('services')}
        />

        {/* 2. About Section */}
        <About onStartCollaboration={() => handleOpenProjectInquiry()} />

        {/* 3. Services Section */}
        <Services
          onSelectService={(serviceTitle) => {
            if (serviceTitle.toLowerCase().includes('game') || serviceTitle.toLowerCase().includes('gaming')) {
              handleOpenTopUp('gaming');
            } else if (serviceTitle.toLowerCase().includes('social')) {
              handleOpenTopUp('social');
            } else {
              handleOpenProjectInquiry(serviceTitle);
            }
          }}
          onOpenTopUpModal={handleOpenTopUp}
        />

        {/* 4. How I Work Section */}
        <HowIWork onStartProject={() => handleOpenProjectInquiry()} />

        {/* 5. Feedback & Reviews Section */}
        <Testimonials />

        {/* 6. High-Impact CTA Section */}
        <CtaSection onStartProject={() => handleOpenProjectInquiry()} />

        {/* 7. Contact & Social Channels Section */}
        <Contact initialService={selectedContactService} />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky CTA Bar */}
      <StickyMobileCta
        onStartProject={() => handleOpenProjectInquiry()}
        telegramUrl="https://t.me/Raf_babi"
      />

      {/* 2-Step Project Inquiry Pop-In Modal */}
      <ProjectInquiryModal
        isOpen={isProjectInquiryOpen}
        onClose={() => setIsProjectInquiryOpen(false)}
        formData={inquiryFormData}
        setFormData={setInquiryFormData}
      />

      {/* Interactive Digital Services & Top-Up Order Modal */}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        initialType={topUpModalType}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
