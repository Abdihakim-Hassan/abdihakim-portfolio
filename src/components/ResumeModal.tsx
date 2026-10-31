import React, { useEffect, useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  FileDown,
  Building2,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { Language } from '../types';
import { usePortfolioData } from '../context/PortfolioDataContext';
import justCrestImg from '../assets/images/just_crest.png';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, lang }) => {
  const { owner } = usePortfolioData();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSomali = lang === 'so';

  const plainTextResume = `================================================================================
                    ABDIHAKIM HASSAN MOHAMUD (ENG ABDIHAKIM HASSAN)
================================================================================
Mogadishu, Somalia | Phone/WhatsApp: +252 61 399 3775 | Email: ccakiincasan@gmail.com
GitHub: https://github.com/Abdihakim-Hassan
LinkedIn: https://www.linkedin.com/in/abdihakim-hassan-094502392
Portfolio: https://github.com/Abdihakim-Hassan
================================================================================

PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
Web Developer and Software Engineering undergraduate student pursuing a Bachelor
of Computer Application at Jamhuriya University of Science and Technology (JUST)
in Mogadishu, Somalia. Demonstrated capability in designing and shipping 2 live
production web applications (ShaqoKaab & Tuko) using HTML5, CSS3, JavaScript (ES6+),
React 19, TypeScript, and Node.js. Focused on clean code, modular architectures,
and practical digital problem-solving.

EDUCATION
--------------------------------------------------------------------------------
Jamhuriya University of Science and Technology (JUST) — Mogadishu, Somalia
Degree:   Bachelor of Computer Application (BCA)
Faculty:  Faculty of Computer Applications
Period:   2026 – Present (Active Undergraduate Student)
Core:     Algorithms, Data Structures, OOP, DBMS & SQL, System Analysis, Web Tech

TECHNICAL SKILLS
--------------------------------------------------------------------------------
* Languages:        HTML5, CSS3, JavaScript (ES6+), TypeScript
* Frontend & UI:    React 19, Tailwind CSS, Component Architecture, Responsive Design
* Backend & Data:   Node.js, REST APIs, Firebase Firestore, WebSockets
* Developer Tools:  Git, GitHub, VS Code, Linux CLI, 75+ WPM Touch Typing, Elements of AI

SELECTED PRODUCTION PROJECTS
--------------------------------------------------------------------------------
1. ShaqoKaab — Somali Employment & Kanban ATS Network
   Stack: React 19, Node.js, TypeScript, Tailwind CSS, WebSockets
   * Engineered an end-to-end employment platform tailored for Somali companies and job seekers.
   * Built interactive Kanban candidate workflow boards and real-time status pipelines.
   * Implemented full bilingual support (Somali & English) and modular component architecture.

2. Tuko — Salaad, Adhaan & Adhkaar Soomaali
   Stack: React 19, TypeScript, Tailwind CSS, Firebase, PWA
   * Developed a comprehensive Islamic companion web application for Somali users worldwide.
   * Automated accurate prayer schedules across Somali cities with real-time Adhan alarms.
   * Integrated 360° Qibla compass, digital Tasbeeh counter, and offline-first PWA caching.

LANGUAGES
--------------------------------------------------------------------------------
* Somali:  Native
* English: Professional Working & Technical Proficiency
================================================================================`;

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(plainTextResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([plainTextResume], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Abdihakim_Hassan_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-8 overflow-y-auto bg-black/85 backdrop-blur-md print:p-0 print:bg-white print:static"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#12141c] border border-zinc-900/15 dark:border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 text-zinc-900 dark:text-zinc-100 my-auto print:border-none print:shadow-none print:max-h-none print:p-0 print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-zinc-900/10 dark:border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              {isSomali
                ? 'CV-ga Rasmiga ah — Eng Abdihakim Hassan'
                : 'Official Curriculum Vitae — Eng Abdihakim Hassan'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadTxt}
              title="Download Plain Text Resume (.TXT)"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <FileDown className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              <span>.TXT</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPlainText}
              title="Copy Plain Text to Clipboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              )}
              <span>{copied ? (isSomali ? 'La koobiyeeyay' : 'Copied!') : isSomali ? 'Koobiyeey' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              title="Print or Save as PDF"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Close Resume"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ================= RESUME DOCUMENT BODY ================= */}
        <div className="space-y-8 text-zinc-900 dark:text-zinc-100">
          {/* Header Block: Identity, Real JUST Crest, Role & Contacts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isSomali ? 'Injineer Software & Web Developer' : 'Web Developer & Software Engineering Student'}</span>
                </div>

                <h1
                  id="resume-title"
                  className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight"
                >
                  {owner.fullName}
                </h1>
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
                  Eng Abdihakim Hassan · {isSomali ? 'Jaamacadda Jamhuriya (JUST)' : 'Jamhuriya University (JUST)'}
                </p>
              </div>

              {/* Official JUST Crest Emblem */}
              <div className="shrink-0 flex items-center gap-3 bg-white dark:bg-zinc-900/80 p-2 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100">
                  <img
                    src={justCrestImg}
                    alt="Jamhuriya University of Science and Technology"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="pr-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400 block font-bold">
                    JUST UNIVERSITY
                  </span>
                  <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                    Faculty of Computer App.
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Pills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-zinc-900/10 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/10">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="font-medium truncate">{owner.location}</span>
              </div>

              <a
                href={`mailto:${owner.email}`}
                className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-medium truncate">{owner.email}</span>
              </a>

              <a
                href={owner.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/10 hover:border-emerald-500/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium truncate">{owner.whatsapp}</span>
              </a>

              <a
                href={owner.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="font-medium truncate">github.com/{owner.githubHandle}</span>
              </a>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-zinc-900/10 dark:border-white/10">
              <Briefcase className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-950 dark:text-white">
                {isSomali ? 'SOO KOOBIDDA XIRFADAHA (EXECUTIVE SUMMARY)' : 'PROFESSIONAL SUMMARY'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {isSomali
                ? 'Injineer Software iyo Web Developer da\' yar oo dhigta shahaadada Computer Application ee Jaamacadda Jamhuriya (JUST) ee Muqdisho. Waxaan khibrad la taaban karo u leeyahay dhisidda barnaamijyo casri ah oo toos u shaqeynaya sida ShaqoKaab (Job Portal & Kanban ATS) iyo Tuko (Prayer Times & Adhkaar). Waxaan xoogga saaraa koodh nadiif ah oo modular ah, TypeScript, iyo dhisidda xalal waxtar u leh bulshada Soomaaliyeed.'
                : 'Dedicated Web Developer and Software Engineering undergraduate pursuing a Bachelor of Computer Application at Jamhuriya University of Science and Technology (JUST) in Mogadishu, Somalia. Demonstrated hands-on engineering track record through architecting and deploying 2 live production web applications (ShaqoKaab and Tuko) using modern React 19, TypeScript, and Node.js. Passionate about modular design patterns, algorithmic efficiency, and clean code.'}
            </p>
          </div>

          {/* Section 2: Education (Real University Data) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-zinc-900/10 dark:border-white/10">
              <GraduationCap className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-950 dark:text-white">
                {isSomali ? 'WAXBARASHADA JAAMACADDA (EDUCATION)' : 'EDUCATION & DEGREE'}
              </h2>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white">
                    Jamhuriya University of Science and Technology (JUST)
                  </h3>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                    Bachelor of Computer Application (BCA) — Faculty of Computer Applications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    2026 – Present
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Mogadishu, Somalia · {isSomali ? 'Waxbarasho Joogto ah' : 'Full-Time Degree Student'}
              </p>

              {/* Coursework Tags */}
              <div className="pt-2 border-t border-zinc-900/5 dark:border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5 font-bold">
                  {isSomali ? 'MAADOOYINKA ASLIGA AH (CORE CURRICULUM):' : 'CORE CURRICULUM:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Algorithms & Big-O',
                    'Data Structures',
                    'OOP Principles',
                    'DBMS & SQL',
                    'System Analysis',
                    'Web Architecture',
                  ].map((course) => (
                    <span
                      key={course}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills Matrix */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-zinc-900/10 dark:border-white/10">
              <Code2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-950 dark:text-white">
                {isSomali ? 'XIRFADAHA FARSAMADA (TECHNICAL SKILLS)' : 'CORE TECHNICAL SKILLS'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block mb-2">
                  LANGUAGES & CORE WEB
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript'].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block mb-2">
                  FRONTEND & FRAMEWORKS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'Tailwind CSS', 'Vite', 'Responsive Mobile-First UI'].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block mb-2">
                  BACKEND & DATA INTEGRATION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Node.js', 'REST APIs', 'Firebase Firestore', 'WebSockets'].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block mb-2">
                  TOOLING & WORKFLOW
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Git & GitHub', 'VS Code', 'Linux CLI', '75+ WPM Typing', 'Elements of AI'].map(
                    (s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-white dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Selected Production Projects (Real Data) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-zinc-900/10 dark:border-white/10">
              <Layers className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-950 dark:text-white">
                {isSomali ? 'MASHAARIICDA TOOSKA AH (LIVE PRODUCTION SYSTEMS)' : 'FEATURED PRODUCTION PROJECTS'}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Project 1: ShaqoKaab */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white">
                      ShaqoKaab — Somali Employment &amp; Kanban ATS Network
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Stack: React 19 · Node.js · TypeScript · Tailwind CSS · WebSockets
                    </p>
                  </div>
                  <a
                    href="/projects/shaqokaab/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{isSomali ? 'Toos u Fur' : 'Live Demo'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc pl-5 leading-relaxed">
                  <li>
                    {isSomali
                      ? 'Waxaa la dhisay barxad shaqo raadin casri ah oo isku xirta shirkadaha Soomaaliyeed iyo shaqo-doonka.'
                      : 'Architected a full-featured job discovery and hiring platform designed specifically for Somali businesses and candidates.'}
                  </li>
                  <li>
                    {isSomali
                      ? 'Waxaa lagu dhex daray nidaamka Kanban ATS si loo maamulo heerarka wareysiyada iyo xulashada murashaxiinta.'
                      : 'Built an interactive drag-and-drop Kanban ATS candidate board for recruitment pipeline management.'}
                  </li>
                  <li>
                    {isSomali
                      ? 'Waxaa loo habeeyay labada luuqadood (Soomaali & English) iyada oo xogta si toos ah loo kaydinayo.'
                      : 'Implemented complete bilingual localization (Somali & English) with responsive state synchronization.'}
                  </li>
                </ul>
              </div>

              {/* Project 2: Tuko */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white">
                      Tuko — Salaad, Adhaan &amp; Adhkaar Soomaali
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Stack: React 19 · TypeScript · Tailwind CSS · Firebase · Audio Engine · PWA
                    </p>
                  </div>
                  <a
                    href="/projects/tuko-salaad/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{isSomali ? 'Toos u Fur' : 'Live Demo'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc pl-5 leading-relaxed">
                  <li>
                    {isSomali
                      ? 'Barnaamij casri ah oo dadka Soomaaliyeed ku xisaabiya waqtiyada 5-ta salaadood magaalooyinka kala duwan.'
                      : 'Built automated accurate prayer calculation engine across major Somali cities with live time countdowns.'}
                  </li>
                  <li>
                    {isSomali
                      ? 'Leh dhawaaqa Aadaanka tooska ah, jihada Qiblada (360° Compass), Tasbiix dijitaal ah, iyo Adhkaar maalinle ah.'
                      : 'Integrated dynamic Adhan audio alerts, interactive 360° Qibla direction, daily Adhkaar, and Tasbeeh counter.'}
                  </li>
                  <li>
                    {isSomali
                      ? 'Wuxuu ku shaqeynayaa hab offline-first ah oo taleefanka lagu dagi karo sidii App rasmi ah (PWA).'
                      : 'Engineered offline-capable Progressive Web App (PWA) caching for uninterrupted offline daily prayer tracking.'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Languages & Credentials */}
          <div className="pt-4 border-t border-zinc-900/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              <span className="font-bold text-zinc-950 dark:text-white mr-1.5">
                {isSomali ? 'Luuqadaha:' : 'Languages:'}
              </span>
              <span>Somali (Native), English (Professional Technical)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{isSomali ? 'Xogta waxaa xaqiijiyay Eng Abdihakim' : 'Verified Engineering Credentials'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
