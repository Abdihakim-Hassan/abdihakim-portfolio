import React, { useState, useEffect } from 'react';
import { PORTFOLIO_OWNER } from '../data/portfolioData';
import {
  Github,
  Linkedin,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  lang: Language;
  onExploreProjects: () => void;
  onOpenContact: () => void;
  onOpenCV: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreProjects,
}) => {
  const { owner, setIsEmailModalOpen } = usePortfolioData();
  const t = translations[lang].hero;
  const [portraitSrc, setPortraitSrc] = useState<string>(owner.portrait || PORTFOLIO_OWNER.portrait);

  useEffect(() => {
    setPortraitSrc(owner.portrait || PORTFOLIO_OWNER.portrait);
  }, [owner.portrait]);

  useEffect(() => {
    try {
      sessionStorage.removeItem('abdihakim_cutout_cache_v2');
      sessionStorage.removeItem('abdihakim_cutout_cache');
    } catch {
      // ignore
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[100svh] sm:min-h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 overflow-hidden bg-[#f4f5f7] dark:bg-[#0c0d11] transition-colors duration-300 select-none"
    >
      {/* Top Status & Identity Strip */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-2 sm:pt-6 relative z-20 flex flex-col items-center text-center">
        <div className="hero-status-pill group relative overflow-hidden inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/85 dark:bg-white/[0.06] border border-emerald-500/25 dark:border-emerald-400/25 backdrop-blur-md text-[10px] sm:text-xs font-mono font-semibold tracking-wide text-zinc-800 dark:text-zinc-100 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300">
          {/* Subtle Periodic Glass Shimmer Sweep */}
          <span
            aria-hidden="true"
            className="hero-status-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/20 dark:via-emerald-300/15 to-transparent"
          />

          {/* Live Radar Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="relative z-10">{t.badge}</span>
        </div>
      </div>

      {/* Center Stage: Giant Outlined Typography Behind Centered Portrait (Matches Screenshot 1) */}
      <div className="relative flex-grow flex items-end justify-center w-full mt-2 sm:mt-4">
        {/* Giant Edge-to-Edge Continuous Infinite Outlined Wordmark Marquee */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 overflow-hidden"
        >
          <div className="hero-marquee-track items-center">
            {[0, 1].map((groupIndex) => (
              <div key={groupIndex} className="flex items-center shrink-0">
                {[0, 1, 2, 3].map((itemIndex) => (
                  <span
                    key={itemIndex}
                    className="hero-outline-text font-extrabold uppercase tracking-[-0.03em] text-[24vw] sm:text-[18.5vw] lg:text-[16.5vw] leading-none whitespace-nowrap pr-[6vw] select-none"
                  >
                    {owner.shortBrand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Centered Cutout Portrait of Abdihakim Hassan Mohamud */}
        <div className="relative z-20 w-full max-w-[360px] sm:max-w-[540px] lg:max-w-[620px] mx-auto flex justify-center items-end px-2 sm:px-4 pointer-events-none select-none">
          <img
            src={portraitSrc}
            alt={owner.fullName}
            onError={() => {
              if (portraitSrc !== PORTFOLIO_OWNER.portrait) {
                setPortraitSrc(PORTFOLIO_OWNER.portrait);
              }
            }}
            className="w-full h-auto max-h-[52svh] sm:max-h-[72vh] object-contain object-bottom drop-shadow-2xl transition-all duration-300"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      {/* Bottom Clean Full-Width Identity & Actions Strip (Placed BELOW the portrait & marquee so it never covers the ABDIHAKIM text) */}
      <div className="relative z-30 w-full bg-white/90 dark:bg-[#111319]/92 border-t border-zinc-900/10 dark:border-white/[0.08] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <p className="text-[11px] sm:text-sm font-sans font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] text-zinc-900 dark:text-zinc-100">
                {owner.fullName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              {/* GitHub — Official Dark Charcoal (#181717) */}
              <a
                href={owner.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#181717] text-white border border-white/15 shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label="GitHub: Abdihakim-Hassan"
                title={`GitHub: ${owner.githubHandle}`}
              >
                <Github className="w-4 h-4" />
              </a>

              {/* LinkedIn — Official LinkedIn Blue (#0A66C2) */}
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0A66C2] text-white border border-[#0A66C2] shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* WhatsApp — Official WhatsApp Green (#25D366) with Authentic Phone Bubble Logo */}
              <a
                href={owner.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#25D366] text-white border border-[#25D366] shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label={`WhatsApp: ${owner.whatsapp}`}
                title={`WhatsApp: ${owner.whatsapp}`}
              >
                <WhatsAppIcon className="w-5 h-5" variant="two-tone" />
              </a>

              {/* Email / Gmail — Interactive Gmail Options Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#1e2028] border border-zinc-200 dark:border-white/15 shadow-sm hover:scale-105 transition-all cursor-pointer"
                aria-label={`Email: ${owner.email}`}
                title="Send Email (Open in Gmail, Default Mail, or Copy Address)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.8V6.5z" fill="#4285F4" />
                  <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3V6.5z" fill="#34A853" />
                  <path d="M18 9.8V4.8c1.4-1.1 3.5-.1 3.5 1.7v.3l-3.5 3z" fill="#FBBC04" />
                  <path d="M6 9.8V4.8C4.6 3.7 2.5 4.7 2.5 6.5v.3L6 9.8z" fill="#C5221F" />
                </svg>
              </button>

              {/* TikTok — Official Original Black Badge with Cyan (#25F4EE), Red (#FE2C55) & White Glitch Note */}
              <a
                href={owner.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#000000] border border-white/15 shadow-sm hover:scale-105 transition-all"
                aria-label="TikTok"
                title={`TikTok: ${owner.tiktokHandle}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {/* Cyan Glitch Layer */}
                  <path
                    d="M11.7 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#25F4EE"
                    transform="translate(-0.9, -0.7)"
                  />
                  {/* Red/Pink Glitch Layer */}
                  <path
                    d="M13.3 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#FE2C55"
                    transform="translate(0.9, 0.7)"
                  />
                  {/* Center White Layer */}
                  <path
                    d="M12.5 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
