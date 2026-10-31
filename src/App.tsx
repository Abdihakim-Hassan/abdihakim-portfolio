import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from './types';
import { PortfolioProvider, usePortfolioData } from './context/PortfolioDataContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsProgressSection } from './components/SkillsProgressSection';
import { AboutSection } from './components/AboutSection';
import { JourneySection } from './components/JourneySection';
import { ContactSection } from './components/ContactSection';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { OwnerSignInModal } from './components/OwnerSignInModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { EmailOptionsModal } from './components/EmailOptionsModal';

function PortfolioMain() {
  const { isEmailModalOpen, setIsEmailModalOpen } = usePortfolioData();
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('abdihakim_portfolio_lang');
      if (saved === 'so' || saved === 'en') return saved;
    } catch {
      // Default to English to match reference screenshots while supporting instant Somali toggle
    }
    return 'en';
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show when the user scrolls down deeply (past the hero section)
      setShowScrollUp(window.scrollY > 650);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      localStorage.setItem('abdihakim_portfolio_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage error
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'so' ? 'en' : 'so'));
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0c0d11] text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-blue-500/25 font-sans">
      {/* Floating Pill-Shaped Navigation Bar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenContact={scrollToContact}
        onOpenCV={() => setIsResumeOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* 1. Hero Section */}
        <HeroSection
          lang={lang}
          onExploreProjects={scrollToProjects}
          onOpenContact={scrollToContact}
          onOpenCV={() => setIsResumeOpen(true)}
        />

        {/* 2. Selected Work: 3D Fanned Carousel + 3-Cards-Per-Line Technical Projects */}
        <ProjectsSection lang={lang} />

        {/* 3. What I Can Do: Skills & Capabilities */}
        <SkillsProgressSection lang={lang} />

        {/* 4. About Me: Problem Solver + Portrait + Trait Card */}
        <AboutSection lang={lang} onOpenCV={() => setIsResumeOpen(true)} />

        {/* 5. Journey: Jamhuriya University (JUST) */}
        <JourneySection lang={lang} />

        {/* 6. Contact: WhatsApp, Email, GitHub, LinkedIn, TikTok & Form */}
        <ContactSection lang={lang} />
      </main>

      {/* Scroll Up Floating Button */}
      <div
        className={`fixed bottom-5 left-5 z-40 transition-all duration-500 ease-out ${
          showScrollUp
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={lang === 'so' ? 'Kor u noqo' : 'Scroll to top'}
          title={lang === 'so' ? 'Kor u noqo' : 'Scroll to top'}
          className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.14em] shadow-lg border border-zinc-800/20 dark:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
        >
          <span>{lang === 'so' ? 'Kor u Noqo' : 'Scroll Up'}</span>
          <span className="w-5 h-5 rounded-full bg-white/20 dark:bg-zinc-950/20 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
            <ArrowUp className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Persistent WhatsApp Quick Action */}
      <WhatsAppFloatingButton lang={lang} />

      {/* Printable / Downloadable Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        lang={lang}
      />

      {/* Owner Sign In Modal */}
      <OwnerSignInModal lang={lang} />

      {/* Owner Dashboard Modal */}
      <OwnerDashboardModal lang={lang} />

      {/* Gmail & Contact Options Modal */}
      <EmailOptionsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        lang={lang}
      />

      {/* Minimalist Editorial Footer */}
      <Footer lang={lang} onSetLang={setLang} />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}
