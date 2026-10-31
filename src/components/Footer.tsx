import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSetLang }) => {
  const { owner, setIsEmailModalOpen } = usePortfolioData();
  const t = translations[lang].footer;

  return (
    <footer className="pt-10 pb-24 sm:py-12 border-t border-zinc-900/10 dark:border-white/[0.08] bg-white/60 dark:bg-[#0a0b0e] text-zinc-500 dark:text-zinc-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Left: Monogram + Full Name + Year */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif italic font-bold text-xs">
              {owner.monogram}
            </span>
            <span className="font-bold text-zinc-950 dark:text-white tracking-wide">
              {owner.fullName}
            </span>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">·</span>

          <p className="font-mono text-[11px]">
            © {new Date().getFullYear()} {owner.name}. {t.rights}
          </p>
        </div>

        {/* Right: Language Switch, Social Icons & Back to Top */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => onSetLang('so')}
              className={`cursor-pointer transition-colors ${
                lang === 'so'
                  ? 'text-zinc-950 dark:text-white font-bold underline underline-offset-4'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {t.somaliLang}
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onSetLang('en')}
              className={`cursor-pointer transition-colors ${
                lang === 'en'
                  ? 'text-zinc-950 dark:text-white font-bold underline underline-offset-4'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {t.englishLang}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={owner.github}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#181717] text-white border border-white/15 hover:scale-105 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={owner.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0A66C2] text-white border border-[#0A66C2] hover:scale-105 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={owner.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#25D366] text-white border border-[#25D366] hover:scale-105 transition-all"
              aria-label="WhatsApp"
              title={`WhatsApp: ${owner.whatsapp}`}
            >
              <WhatsAppIcon className="w-4 h-4" variant="two-tone" />
            </a>
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-[#1e2028] border border-zinc-200 dark:border-white/15 hover:scale-105 transition-all cursor-pointer"
              aria-label="Email Options"
              title="Send Email (Open in Gmail, Default Mail, or Copy Address)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
                <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.8V6.5z" fill="#4285F4" />
                <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3V6.5z" fill="#34A853" />
                <path d="M18 9.8V4.8c1.4-1.1 3.5-.1 3.5 1.7v.3l-3.5 3z" fill="#FBBC04" />
                <path d="M6 9.8V4.8C4.6 3.7 2.5 4.7 2.5 6.5v.3L6 9.8z" fill="#C5221F" />
              </svg>
            </button>
            <a
              href={owner.tiktok}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#000000] border border-white/15 hover:scale-105 transition-all"
              aria-label="TikTok"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M11.7 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  fill="#25F4EE"
                  transform="translate(-0.9, -0.7)"
                />
                <path
                  d="M13.3 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  fill="#FE2C55"
                  transform="translate(0.9, 0.7)"
                />
                <path
                  d="M12.5 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  fill="#FFFFFF"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
