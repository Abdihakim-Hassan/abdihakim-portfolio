import React, { useState } from 'react';
import { X, Send, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WhatsAppFloatingButtonProps {
  lang: Language;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ lang }) => {
  const { owner } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const t = translations[lang].whatsappModal;

  const handleLaunchWhatsApp = (customText?: string) => {
    const textToSend = customText || message || t.defaultMsg;
    const encoded = encodeURIComponent(textToSend);
    const cleanNumber = owner.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-80 sm:max-w-96 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#15171e] border border-zinc-900/15 dark:border-white/15 shadow-2xl text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-900/10 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                <WhatsAppIcon className="w-5 h-5" variant="two-tone" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{t.title}</h4>
                <p className="text-[10px] text-[#1da851] dark:text-[#25D366] font-mono font-semibold">
                  {owner.whatsapp}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
            {t.subtitle}
          </p>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.defaultMsg}
            className="w-full p-2.5 rounded-xl bg-zinc-900/[0.03] dark:bg-black/40 border border-zinc-900/15 dark:border-white/10 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none mb-3"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLaunchWhatsApp()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.openWhatsApp}</span>
            </button>

            <a
              href="tel:+252613993775"
              className="p-2.5 rounded-xl border border-zinc-900/15 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors"
              title={t.callNow}
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Sleek Professional WhatsApp Floating Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Chat on WhatsApp"
          title={`WhatsApp: ${owner.whatsapp}`}
        >
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" variant="two-tone" />

          {/* Live Online Status Badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#25D366]" />
          </span>
        </button>
      </div>
    </div>
  );
};
