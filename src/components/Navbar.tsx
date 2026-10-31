import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Lock, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenContact: () => void;
  onOpenCV?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenContact,
  onOpenCV,
}) => {
  const { owner, isAdminLoggedIn, setIsSignInModalOpen, setIsDashboardModalOpen, logout } = usePortfolioData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const t = translations[lang].nav;

  const navLinks = [
    { id: 'work', href: '#work', label: t.work },
    { id: 'skills', href: '#skills', label: t.whatICanDo },
    { id: 'about', href: '#about', label: t.about },
    { id: 'journey', href: '#journey', label: t.journey },
    { id: 'archive', href: '#archive', label: t.archive },
    { id: 'contact', href: '#contact', label: t.contact },
  ];

  useEffect(() => {
    const sectionIds = ['home', 'work', 'skills', 'about', 'journey', 'archive', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(id);
    if (id === 'home' || href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      if (id === 'work' || href === '#work') {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        {/* Floating Pill-Shaped Container matching reference screenshots */}
        <div className="h-13 sm:h-16 px-3 sm:px-5 rounded-2xl bg-white/95 dark:bg-[#15161b]/92 border border-zinc-900/10 dark:border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.65)] backdrop-blur-xl flex items-center justify-between gap-2 xl:gap-4 transition-colors duration-200">
          
          {/* Left: Rounded Square Monogram + Spaced Brand Name */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home', 'home')}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group focus-visible:outline-none whitespace-nowrap"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif italic font-bold text-sm sm:text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
              {owner.monogram}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.14em] sm:tracking-[0.22em] uppercase text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              {owner.shortBrand}
            </span>
          </a>

          {/* Center: Minimalist Uppercase Navigation Links with Active Underline */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`relative py-1.5 text-[11px] font-medium tracking-[0.13em] xl:tracking-[0.15em] uppercase whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-zinc-950 dark:text-white font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-0 h-[1.5px] bg-zinc-950 dark:bg-white rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Language Toggle, Theme Toggle, CV & Bordered "Hire Me" Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Bilingual Switcher (SO / EN) */}
            <button
              type="button"
              onClick={onToggleLang}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] hover:bg-zinc-900/[0.08] dark:hover:bg-white/[0.08] text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={lang === 'so' ? 'Switch to English' : 'U wareeji Af-Soomaali'}
              aria-label="Toggle language between Somali and English"
            >
              <span className={lang === 'so' ? 'text-zinc-950 dark:text-white font-bold' : 'text-zinc-400 dark:text-zinc-500'}>
                SO
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">/</span>
              <span className={lang === 'en' ? 'text-zinc-950 dark:text-white font-bold' : 'text-zinc-400 dark:text-zinc-500'}>
                EN
              </span>
            </button>

            {/* Smooth Light/Dark Mode Toggle */}
            <ThemeToggle />

            {/* CV Modal Trigger */}
            {onOpenCV && (
              <button
                type="button"
                onClick={onOpenCV}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] hover:bg-zinc-900/[0.08] dark:hover:bg-white/[0.08] text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title={lang === 'so' ? 'Eeg CV-ga' : 'View Resume / CV'}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>CV</span>
              </button>
            )}

            {/* Owner Access / Dashboard Trigger */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDashboardModalOpen(true)}
                  className="h-8 sm:h-9 px-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-[11px] sm:text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0 transition-transform active:scale-95"
                  title={lang === 'so' ? 'Fur Dashboard-ka' : 'Open Dashboard'}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="h-8 sm:h-9 w-8 sm:w-9 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title={lang === 'so' ? 'Ka bax' : 'Sign Out'}
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignInModalOpen(true)}
                className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] hover:bg-zinc-900/[0.08] dark:hover:bg-white/[0.08] text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title={lang === 'so' ? 'Galitaanka' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>{lang === 'so' ? 'Galitaanka' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-900/15 dark:border-white/15 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shrink-0"
              aria-label="Toggle mobile navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3.5 rounded-2xl bg-white/98 dark:bg-[#15161b]/98 border border-zinc-900/10 dark:border-white/10 shadow-2xl backdrop-blur-xl">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, link.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-zinc-900/5 dark:bg-white/10 text-zinc-950 dark:text-white font-bold'
                        : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-900/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white" />}
                  </a>
                );
              })}
              {/* Owner Access Trigger in Mobile Menu */}
              {isAdminLoggedIn ? (
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsDashboardModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{lang === 'so' ? 'Fur Dashboard-ka' : 'Dashboard'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2.5 px-3 rounded-xl border border-zinc-900/15 dark:border-white/15 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-red-500/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title={lang === 'so' ? 'Ka bax' : 'Sign Out'}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{lang === 'so' ? 'Ka bax' : 'Sign Out'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSignInModalOpen(true);
                  }}
                  className="mt-1 w-full py-2.5 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>{lang === 'so' ? 'Galitaanka' : 'Sign In'}</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
