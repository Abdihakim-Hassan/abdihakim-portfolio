import React, { useState } from 'react';
import { X, Mail, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { usePortfolioData } from '../context/PortfolioDataContext';

interface EmailOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const EmailOptionsModal: React.FC<EmailOptionsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { owner } = usePortfolioData();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = owner.email || 'ccakiincasan@gmail.com';
  const defaultSubject = encodeURIComponent('Project Collaboration & Inquiry - Eng. Abdihakim Hassan');
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${defaultSubject}`;
  const defaultMailUrl = `mailto:${email}?subject=${defaultSubject}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const isSomali = lang === 'so';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#14161f] border border-zinc-200 dark:border-white/10 shadow-2xl p-6 text-zinc-900 dark:text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
                <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.8V6.5z" fill="#4285F4" />
                <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3V6.5z" fill="#34A853" />
                <path d="M18 9.8V4.8c1.4-1.1 3.5-.1 3.5 1.7v.3l-3.5 3z" fill="#FBBC04" />
                <path d="M6 9.8V4.8C4.6 3.7 2.5 4.7 2.5 6.5v.3L6 9.8z" fill="#C5221F" />
              </svg>
            </div>
            <div>
              <h3 id="email-modal-title" className="text-sm font-bold tracking-tight">
                {isSomali ? 'La Xiriir Eng. Cabdixakiim' : 'Contact via Email'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {isSomali ? 'Dooro sida aad u rabto inaad iimaylka u dirto' : 'Choose how you prefer to send an email'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Verified Email Address with 1-click Copy */}
        <div className="my-5 p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">
              {isSomali ? 'Cinwaanka Iimaylka ee Rasmiga ah' : 'Verified Direct Email'}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white truncate block select-all">
              {email}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900/[0.06] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900/[0.12] dark:hover:bg-white/[0.15]'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isSomali ? 'Waa koobiyaysan' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isSomali ? 'Koobiyeey' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-2.5">
          {/* Option 1: Open in Gmail Web */}
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.8V6.5z" fill="#4285F4" />
                  <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3V6.5z" fill="#34A853" />
                  <path d="M18 9.8V4.8c1.4-1.1 3.5-.1 3.5 1.7v.3l-3.5 3z" fill="#FBBC04" />
                  <path d="M6 9.8V4.8C4.6 3.7 2.5 4.7 2.5 6.5v.3L6 9.8z" fill="#C5221F" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>{isSomali ? 'Ku fur Gmail (Bogga Internet-ka)' : 'Open in Gmail (Web Browser)'}</span>
                </p>
                <p className="text-[11px] text-zinc-300 dark:text-zinc-600 truncate mt-0.5">
                  {isSomali ? 'Fariin toos ah oo bog cusub ku furmaysa' : 'Compose in a new browser tab with pre-filled details'}
                </p>
              </div>
            </div>

            <ExternalLink className="w-4 h-4 shrink-0 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Option 2: Open in Default System Mail App */}
          <a
            href={defaultMailUrl}
            onClick={onClose}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50/60 dark:bg-white/[0.02] hover:bg-zinc-100/60 dark:hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {isSomali ? 'Barnaamijka Iimaylka (Outlook, Apple Mail...)' : 'Default Mail Client (Outlook, Apple Mail)'}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  {isSomali ? 'Ku fur barnaamijka iimaylka ee aaladdaada' : 'Launches your installed operating system email app'}
                </p>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 shrink-0 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 mt-4 font-mono">
          {isSomali ? 'Jawaab degdeg ah wax ka yar 24 saac gudahood' : 'Typically replies within 24 hours'}
        </p>
      </div>
    </div>
  );
};
