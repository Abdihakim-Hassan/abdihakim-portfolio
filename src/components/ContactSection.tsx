import React, { useState } from 'react';
import {
  MapPin,
  Send,
  CheckCircle2,
  Github,
  Linkedin,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { submitContactMessage, validateContactInput } from '../services/contactService';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const { owner, setIsEmailModalOpen } = usePortfolioData();
  const t = translations[lang].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [lastSubmitted, setLastSubmitted] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot bot protection: ignore submission silently if hidden field is filled
    if (honeypot.trim()) {
      return;
    }

    // Duplicate submission guard: prevent double-clicks while submitting
    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    // Validate inputs
    const validation = validateContactInput(formData);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct Firestore submission to contactMessages collection
      await submitContactMessage(formData);

      // Confirmed server acknowledgement
      setLastSubmitted({ ...formData });
      setSubmitted(true);
      // Clear form inputs only after successful server acknowledgement
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: unknown) {
      console.error('Contact submission error:', err);
      // Preserve form contents upon failure — formData remains untouched
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send your message. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 mb-2.5 sm:mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 sm:mt-3 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Real Contact Channels & Socials */}
          <div className="lg:col-span-5 p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-6">
                {t.getInTouch}
              </h3>

              <div className="space-y-3.5">
                {/* WhatsApp: Official WhatsApp Green (#25D366) & Authentic Logo */}
                <a
                  href={owner.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-[#25D366]/[0.05] dark:bg-[#25D366]/[0.07] border border-[#25D366]/25 hover:border-[#25D366] hover:bg-[#25D366]/[0.1] transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(37,211,102,0.35)] group-hover:scale-105 transition-transform">
                      <WhatsAppIcon className="w-6 h-6" variant="two-tone" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                        {t.whatsappLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white font-mono">
                        {owner.whatsapp}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                {/* Email — Interactive Email Options Action Card */}
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/20 dark:hover:border-white/20 transition-all group shadow-xs cursor-pointer text-left"
                  title="Send Email (Open in Gmail, Default Mail, or Copy Address)"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c1f28] border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z"
                        />
                        <path fill="#34A853" d="M18 20h2c1.1 0 2-.9 2-2v-8.2l-4 3V20z" />
                        <path fill="#FBBC05" d="M18 9.8v3l4-3V6.5c0-1.8-2.1-2.8-3.5-1.7L18 5.2v4.6z" />
                        <path fill="#EA4335" d="M6 9.8L12 14.3 18 9.8V5.2L12 9.7 6 5.2v4.6z" />
                        <path fill="#C5221F" d="M2 6.5v3.3l4 3V5.2L5.5 4.8C4.1 3.7 2 4.7 2 6.5z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        {t.emailLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white font-mono truncate block">
                        {owner.email}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </button>

                {/* Location: Mogadishu, Somalia — Sleek Professional Clean Card */}
                <a
                  href="https://www.google.com/maps/place/Mogadishu,+Somalia"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/20 dark:hover:border-white/20 transition-all group shadow-xs cursor-pointer"
                  title="View Mogadishu, Somalia on Google Maps"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        {t.locationLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white">
                          {t.locationValue}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Social Profiles Strip — Single Horizontal Flex Row with Authentic Brand Colors */}
            <div className="pt-6 mt-8 border-t border-zinc-900/10 dark:border-white/[0.07]">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-3">
                SOCIAL PROFILES
              </p>
              <div className="flex items-center gap-2 w-full">
                {/* GitHub — Official Dark Charcoal (#181717) */}
                <a
                  href={owner.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#181717] text-white border border-white/10 text-xs font-bold shadow-sm hover:scale-[1.03] hover:opacity-95 transition-all whitespace-nowrap"
                  title={`GitHub: ${owner.githubHandle}`}
                >
                  <Github className="w-3.5 h-3.5 shrink-0" />
                  <span>GitHub</span>
                </a>

                {/* LinkedIn — Official LinkedIn Blue (#0A66C2) */}
                <a
                  href={owner.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0A66C2] text-white border border-[#0A66C2] text-xs font-bold shadow-sm hover:scale-[1.03] hover:opacity-95 transition-all whitespace-nowrap"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 shrink-0" />
                  <span>LinkedIn</span>
                </a>

                {/* TikTok — Official Black (#000000) with Cyan (#25F4EE) & Red (#FE2C55) Glitch Note */}
                <a
                  href={owner.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#000000] text-white border border-white/15 text-xs font-bold shadow-sm hover:scale-[1.03] hover:border-[#25F4EE]/60 transition-all whitespace-nowrap"
                  title={`TikTok: ${owner.tiktokHandle || '@abdihakim.dev'}`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#25F4EE"
                      transform="translate(-1.1, -0.9)"
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    />
                    <path
                      fill="#FE2C55"
                      transform="translate(1.1, 0.9)"
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    />
                    <path
                      fill="#FFFFFF"
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 relative overflow-hidden p-7 sm:p-8 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all">
            {submitted ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {t.form.success}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  {lang === 'so'
                    ? 'Fariintaada si guul leh ayaa loo diray looguna keydiyay database-ka. Waxa kale oo aad toos iigala soo xiriiri kartaa:'
                    : 'Your message has been successfully received and stored in the database. You can also connect directly via:'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {lastSubmitted && (
                    <>
                      <a
                        href={`mailto:${owner.email}?subject=${encodeURIComponent(
                          lastSubmitted.subject || 'Portfolio Inquiry'
                        )}&body=${encodeURIComponent(
                          `Name: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\n\n${lastSubmitted.message}`
                        )}`}
                        className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm transition-all"
                      >
                        {lang === 'so' ? 'Ku Dir Email Client' : 'Send via Email Client'}
                      </a>
                      <a
                        href={`${owner.whatsappLink}?text=${encodeURIComponent(
                          `Hello Eng Abdihakim,\nName: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\nSubject: ${
                            lastSubmitted.subject || 'Project Inquiry'
                          }\n\n${lastSubmitted.message}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-[0_4px_14px_rgba(37,211,102,0.35)] hover:opacity-95 transition-opacity"
                      >
                        {lang === 'so' ? 'Ku Dir WhatsApp' : 'Send via WhatsApp'}
                      </a>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                      setLastSubmitted(null);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer"
                  >
                    {lang === 'so' ? 'Foom Cusub' : 'Send Another Message'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Honeypot field (hidden from legitimate users, traps bots) */}
                <input
                  type="text"
                  name="user_organization_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0"
                  aria-hidden="true"
                />

                {/* Error Banner with input preservation */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="font-medium leading-relaxed">{errorMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold text-xs shrink-0 cursor-pointer p-0.5"
                      title="Dismiss error"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300 mb-1.5 font-bold"
                    >
                      {t.form.name} <span className="text-zinc-400 dark:text-zinc-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Abdihakim..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/[0.03] dark:bg-black/40 border border-zinc-900/15 dark:border-white/10 text-zinc-950 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:bg-white dark:focus:bg-black/60 focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300 mb-1.5 font-bold"
                    >
                      {t.form.email} <span className="text-zinc-400 dark:text-zinc-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/[0.03] dark:bg-black/40 border border-zinc-900/15 dark:border-white/10 text-zinc-950 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:bg-white dark:focus:bg-black/60 focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300 mb-1.5 font-bold"
                  >
                    {t.form.subject} <span className="text-zinc-400 dark:text-zinc-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={
                      lang === 'so' ? 'Mowduuca fariintaada...' : 'Project collaboration or inquiry'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/[0.03] dark:bg-black/40 border border-zinc-900/15 dark:border-white/10 text-zinc-950 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:bg-white dark:focus:bg-black/60 focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300 mb-1.5 font-bold"
                  >
                    {t.form.message} <span className="text-zinc-400 dark:text-zinc-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.form.message}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/[0.03] dark:bg-black/40 border border-zinc-900/15 dark:border-white/10 text-zinc-950 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:bg-white dark:focus:bg-black/60 focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs uppercase tracking-[0.16em] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === 'so' ? 'Waa la dirayaa...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      <span>{t.form.submit}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
