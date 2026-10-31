import React, { useState, useEffect } from 'react';
import {
  Code2,
  Layers,
  GraduationCap,
  Cpu,
  Terminal,
  GitBranch,
  Check,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';

interface AboutSectionProps {
  lang: Language;
  onOpenCV?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, onOpenCV }) => {
  const { owner } = usePortfolioData();
  const t = translations[lang].about;
  const [wordIndex, setWordIndex] = useState(0);
  const [subText, setSubText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [traitIndex, setTraitIndex] = useState(0);

  // Smooth typewriter animation matching Screenshot 3 ("Problem Solver. Di|")
  useEffect(() => {
    const words = t.typingWords;
    const currentWord = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = currentWord.slice(0, subText.length + 1);
          setSubText(next);
          if (next === currentWord) {
            setTimeout(() => setIsDeleting(true), 1400);
          }
        } else {
          const next = currentWord.slice(0, subText.length - 1);
          setSubText(next);
          if (next === '') {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 45 : 85
    );

    return () => clearTimeout(timeout);
  }, [subText, isDeleting, wordIndex, t.typingWords]);

  const activeTrait = t.traits[traitIndex % t.traits.length];

  // 6 Structured Professional Engineering Activity Boxes
  const activityTracks = [
    {
      id: 'production',
      icon: Code2,
      status: lang === 'so' ? 'Toos u Shaqeynaya' : 'Live in Production',
      dotColor: 'bg-emerald-500',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'ShaqoKaab & Tuko (Salaad & Adhkaar)' : 'ShaqoKaab & Tuko Production Systems',
      description:
        lang === 'so'
          ? 'Dhisidda iyo maamulidda laba barnaamij oo dadka Soomaaliyeed u adeegaya: shaqo raadin casri ah & xisaabinta waqtiyada salaadaha iyo adhkaarta.'
          : 'Actively building and maintaining 2 live production web applications: a Somali modern job board (ShaqoKaab) and an Islamic prayer times & daily adhkaar app (Tuko).',
      track: lang === 'so' ? 'Barnaamijyo Toos ah' : 'Live Products',
      metrics: '02 Deployed Apps',
    },
    {
      id: 'architecture',
      icon: Layers,
      status: lang === 'so' ? 'Koodh Nadiif ah' : 'Strict TypeScript',
      dotColor: 'bg-zinc-950 dark:bg-white',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'Qaab-dhismeedka Koodhka & Modular Components' : 'Full-Stack Architecture & Modular Systems',
      description:
        lang === 'so'
          ? 'U habeynta koodhka hab modular ah, qorista interfaces cadcad oo TypeScript ah, iyo hubinta in nidaamku yahay mid waara oo si sahlan loo ballaarin karo.'
          : 'Architecting clean modular components, strict TypeScript data contracts, and scalable REST API integrations with zero spaghetti code.',
      track: lang === 'so' ? 'Habeynta Nidaamka' : 'Code Quality',
      metrics: 'Maintainable & Typed',
    },
    {
      id: 'academic',
      icon: GraduationCap,
      status: 'JUST · Mogadishu',
      dotColor: 'bg-zinc-950 dark:bg-white',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'Computer Application (SE) @ Jaamacadda JUST' : 'Software Engineering Student @ JUST',
      description:
        lang === 'so'
          ? 'Dhigashada heerka jaamacadeed ee Jaamacadda Jamhuriya ee Muqdisho — diiradda la saarayo algorithms, databases, nidaamyada koodhka, iyo software testing.'
          : 'Pursuing a Bachelor of Science in Computer Application (Software Engineering) at Jamhuriya University of Science and Technology in Mogadishu, Somalia.',
      track: lang === 'so' ? 'Waxbarasho Jaamacadeed' : 'Higher Education',
      metrics: '2026 – Present',
    },
    {
      id: 'exploring',
      icon: Cpu,
      status: 'React 19 & Next.js',
      dotColor: 'bg-zinc-950 dark:bg-white',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'Sahaminta React 19, Server Actions & Tailwind v4' : 'Exploring React 19 Ecosystem & Modern Web',
      description:
        lang === 'so'
          ? 'Tijaabinta astaamaha cusub ee React 19, qaab-dhismeedka Server Components, iyo aaladaha casriga ah sida Tailwind CSS v4 iyo Vite si bogaggu u noqdaan kuwa ugu dheereeya.'
          : 'Hands-on exploration of React 19 capabilities, Server Actions, modern bundlers (Vite), and Tailwind CSS v4 styling pipelines for optimum performance.',
      track: lang === 'so' ? 'Tiknoolajiyada Cusub' : 'Ecosystem R&D',
      metrics: 'Modern Stack',
    },
    {
      id: 'tooling',
      icon: Terminal,
      status: '75+ WPM · Linux CLI',
      dotColor: 'bg-zinc-950 dark:bg-white',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'Git, Terminal & Xawaaraha Qoraalka Kumbuyuutarka' : 'Terminal Velocity, Git & Touch Typing',
      description:
        lang === 'so'
          ? 'Xirfad sare oo ku saabsan maamulka laamaha Git, amarrada Linux/CLI, iyo xawaaraha qoraalka kumbuyuutarka oo la hubiyay inuu ka badan yahay 75 erey daqiiqaddii.'
          : 'High developer velocity utilizing advanced Git branching models, command-line terminal tooling, and verified 75+ WPM touch typing speed.',
      track: lang === 'so' ? 'Xawaaraha Shaqada' : 'Developer Flow',
      metrics: '75+ WPM Certified',
    },
    {
      id: 'collaboration',
      icon: GitBranch,
      status: 'GitHub · Open Source',
      dotColor: 'bg-zinc-950 dark:bg-white',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100',
      iconBorder: 'border-zinc-900/10 dark:border-white/10',
      border: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/30 dark:hover:border-white/30',
      badgeClass: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      title: lang === 'so' ? 'Dukumiinti Farsamo & Koodh Furan oo GitHub ah' : 'Open Collaboration & Technical Documentation',
      description:
        lang === 'so'
          ? 'Qorista faahfaahin buuxda (documentation) oo ku saabsan mashaariicda, furidda keydadka koodhka ee GitHub, iyo xal-u-helidda baahiyaha dhabta ah ee dadka.'
          : 'Documenting engineering decisions with clear README files, public GitHub repositories, and continuous code quality audits for open collaboration.',
      track: lang === 'so' ? 'Wada Shaqeyn Furan' : 'Community & Code',
      metrics: 'Public GitHub Repos',
    },
  ];

  // Trait Philosophy Details
  const traitDetails: Record<
    string,
    { so: { philosophy: string; tag: string }; en: { philosophy: string; tag: string } }
  > = {
    'Problem Solver': {
      so: {
        philosophy:
          'Waxaan diiradda saaraa fahamka qotada dheer ee asalka dhibaatada ka hor inta aanan bilaabin qorista koodhka, si aan u abuuro xal fudud oo waara.',
        tag: 'First-Principles Thinking',
      },
      en: {
        philosophy:
          'Deeply dissecting the root cause of user and technical bottlenecks before writing code, prioritizing scalable, durable, and pragmatic solutions.',
        tag: 'First-Principles Thinking',
      },
    },
    'Clean Coder': {
      so: {
        philosophy:
          'Koodhka waxaa la akhriyaa 10 jeer ka badan inta la qoro. Waxaan dhisnaa koodh modular ah, leh magacyo cadcad, oo dadka kale si sahlan u fahmi karaan.',
        tag: 'Readable & Maintainable',
      },
      en: {
        philosophy:
          'Code is read ten times more often than it is written. I craft self-documenting, modular components with strict typing and clear naming conventions.',
        tag: 'Readable & Maintainable',
      },
    },
    'Web Developer': {
      so: {
        philosophy:
          'Dhisidda bogag iyo barnaamijyo casri ah oo degdeg ku furma, mobilada iyo kombuyuutarrada labadaba si cajiib ah ugu shaqeeya.',
        tag: 'Fast & Accessible',
      },
      en: {
        philosophy:
          'Engineering responsive, accessible, mobile-first web applications optimized for lightning-fast load times and pleasant user interactions.',
        tag: 'Fast & Accessible',
      },
    },
    'Fast Learner': {
      so: {
        philosophy:
          'La qabsasho degdeg ah oo ku saabsan aaladaha casriga ah, maktabadaha cusub, iyo hababka casriga ah ee warshadaha software-ka iyada oo loo marayo ku celcelin joogto ah.',
        tag: 'Continuous Growth',
      },
      en: {
        philosophy:
          'Quickly absorbing modern frameworks, industry best practices, and evolving standards through disciplined curiosity and relentless hands-on building.',
        tag: 'Continuous Growth',
      },
    },
  };

  const traitColorThemes: Record<
    string,
    {
      cardBg: string;
      cardBorder: string;
      shadowBg: string;
      shadowBorder: string;
      accentLine: string;
      labelColor: string;
      titleColor: string;
      refreshBg: string;
      dotColor: string;
      promptColor: string;
    }
  > = {
    'Problem Solver': {
      cardBg: 'bg-white dark:bg-[#13151b]',
      cardBorder: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20 shadow-xs hover:shadow-md',
      shadowBg: 'bg-zinc-900/[0.03] dark:bg-white/[0.04]',
      shadowBorder: 'border-zinc-900/10 dark:border-white/10',
      accentLine: 'bg-zinc-950 dark:bg-white',
      labelColor: 'text-zinc-500 dark:text-zinc-400',
      titleColor: 'text-zinc-950 dark:text-white',
      refreshBg: 'bg-zinc-900/[0.04] text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10',
      dotColor: 'bg-emerald-500',
      promptColor: 'text-zinc-700 dark:text-zinc-300',
    },
    'Clean Coder': {
      cardBg: 'bg-white dark:bg-[#13151b]',
      cardBorder: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20 shadow-xs hover:shadow-md',
      shadowBg: 'bg-zinc-900/[0.03] dark:bg-white/[0.04]',
      shadowBorder: 'border-zinc-900/10 dark:border-white/10',
      accentLine: 'bg-zinc-950 dark:bg-white',
      labelColor: 'text-zinc-500 dark:text-zinc-400',
      titleColor: 'text-zinc-950 dark:text-white',
      refreshBg: 'bg-zinc-900/[0.04] text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10',
      dotColor: 'bg-emerald-500',
      promptColor: 'text-zinc-700 dark:text-zinc-300',
    },
    'Web Developer': {
      cardBg: 'bg-white dark:bg-[#13151b]',
      cardBorder: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20 shadow-xs hover:shadow-md',
      shadowBg: 'bg-zinc-900/[0.03] dark:bg-white/[0.04]',
      shadowBorder: 'border-zinc-900/10 dark:border-white/10',
      accentLine: 'bg-zinc-950 dark:bg-white',
      labelColor: 'text-zinc-500 dark:text-zinc-400',
      titleColor: 'text-zinc-950 dark:text-white',
      refreshBg: 'bg-zinc-900/[0.04] text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10',
      dotColor: 'bg-emerald-500',
      promptColor: 'text-zinc-700 dark:text-zinc-300',
    },
    'Fast Learner': {
      cardBg: 'bg-white dark:bg-[#13151b]',
      cardBorder: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20 shadow-xs hover:shadow-md',
      shadowBg: 'bg-zinc-900/[0.03] dark:bg-white/[0.04]',
      shadowBorder: 'border-zinc-900/10 dark:border-white/10',
      accentLine: 'bg-zinc-950 dark:bg-white',
      labelColor: 'text-zinc-500 dark:text-zinc-400',
      titleColor: 'text-zinc-950 dark:text-white',
      refreshBg: 'bg-zinc-900/[0.04] text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10',
      dotColor: 'bg-emerald-500',
      promptColor: 'text-zinc-700 dark:text-zinc-300',
    },
  };

  const currentTheme =
    traitColorThemes[activeTrait] || traitColorThemes['Problem Solver'];

  const currentTraitInfo =
    traitDetails[activeTrait] || traitDetails['Problem Solver'];

  return (
    <section
      id="about"
      className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Eyebrow & Typewriter Heading matching Screenshot 3 */}
        <div className="mb-10 sm:mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 mb-2.5 sm:mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
            {t.typingPrefix}{' '}
            <span className="text-zinc-700 dark:text-zinc-200">{subText}</span>
            <span
              aria-hidden="true"
              className="inline-block w-[3px] h-[0.9em] bg-zinc-950 dark:bg-white ml-1 align-middle animate-pulse"
            />
          </h2>
        </div>

        {/* Profile Split Layout matching Screenshot 3 */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 sm:gap-8 md:gap-10">
          {/* Left: Circular Portrait Avatar */}
          <div className="shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-zinc-900/15 dark:border-white/15 bg-[#d9dce1] shadow-xl">
              <img
                src={owner.portrait}
                alt={owner.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right: Name + Verified Badge, 3 Metrics, Bio Paragraphs & Resume Link */}
          <div className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-xl font-extrabold tracking-wide uppercase text-zinc-950 dark:text-white">
                {owner.fullName}
              </h3>
              {/* Monochrome Verified Checkmark Badge */}
              <span
                className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 inline-flex items-center justify-center shadow-sm"
                title="Verified Portfolio Identity"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                ({owner.name})
              </span>
            </div>

            {/* 3 Honest Stats Columns matching Screenshot 3 */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-12 mt-4 mb-6">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  {t.stats.projectsLabel}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white">
                  2 Live Apps
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  {t.stats.skillsLabel}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white">
                  5 Core
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  {t.stats.universityLabel}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white">
                  2026 – Present
                </span>
              </div>
            </div>

            {/* Editorial Biography */}
            <div className="space-y-4 text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              <p>{t.bioParagraph1}</p>
              <p>{t.bioParagraph2}</p>
            </div>

            {/* "Want to know more about my experience? Download my resume." */}
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              {t.resumePrompt}{' '}
              {onOpenCV ? (
                <button
                  type="button"
                  onClick={onOpenCV}
                  className="font-bold text-zinc-950 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {t.resumeLink}
                </button>
              ) : (
                <a
                  href="/Abdihakim_Hassan_Resume.txt"
                  download
                  className="font-bold text-zinc-950 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {t.resumeLink}
                </a>
              )}
            </p>
          </div>
        </div>

        {/* Bottom Row: 6 Professional Engineering Activity Boxes + Interactive Philosophy Trait Showcase */}
        <div className="mt-16 pt-10 border-t border-zinc-900/10 dark:border-white/[0.07] space-y-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
                  {lang === 'so' ? 'HAWLAHA FARSAMADA & XAQIIQADA' : 'CURRENT ACTIVITIES & CORE FOCUS'}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                {lang === 'so' ? 'Waxyaabaha aan Hadduu Dhisayo & Baranayo' : 'What I Am Building, Studying & Practicing'}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {lang === 'so' ? '06 Qaybood oo Farsamo' : '06 Active Tracks'}
            </p>
          </div>

          {/* 6 Structured Engineering Activity Bento Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {activityTracks.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className={`group relative rounded-2xl p-5 bg-white/80 dark:bg-[#13151b] border ${act.border} hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Row: Icon + Status Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${act.iconBg} border ${act.iconBorder} flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${act.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${act.dotColor} mr-1.5 inline-block`}
                        />
                        {act.status}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-[15px] font-extrabold text-zinc-950 dark:text-white group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors leading-snug">
                      {act.title}
                    </h4>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Card Footer: Scope tag & verified metric */}
                  <div className="mt-4 pt-3 border-t border-zinc-900/5 dark:border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {act.track}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      {act.metrics}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Engineering Trait & Core Philosophy Card */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Trait Selection Tabs */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400 font-semibold">
                    {t.traitLabel} &mdash; {lang === 'so' ? 'ASTAANTA FARSAAMADA' : 'CORE ENGINEERING PHILOSOPHY'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {t.traits.map((traitName, idx) => {
                    const isSelected = activeTrait === traitName;
                    return (
                      <button
                        key={traitName}
                        type="button"
                        onClick={() => setTraitIndex(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm scale-105'
                            : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200/80 dark:border-white/10'
                        }`}
                      >
                        {traitName}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-extrabold text-zinc-950 dark:text-white font-mono uppercase tracking-wider">
                      {activeTrait}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                      {currentTraitInfo[lang].tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                    "{currentTraitInfo[lang].philosophy}"
                  </p>
                </div>
              </div>

              {/* Right Column: Physical Tilted Trait Badge Card with Dynamic Professional Colors */}
              <div className="shrink-0 relative self-center lg:self-auto pr-3 pb-2">
                {/* Back tilted card with dynamic theme color */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 translate-x-3 translate-y-2.5 rotate-6 rounded-2xl ${currentTheme.shadowBg} border ${currentTheme.shadowBorder} transition-all duration-500`}
                />
                <button
                  type="button"
                  onClick={() => setTraitIndex((prev) => prev + 1)}
                  title="Click to cycle traits"
                  className={`relative w-60 sm:w-64 h-36 p-5 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} transition-all duration-300 -rotate-2 hover:rotate-0 flex flex-col justify-between text-left cursor-pointer group overflow-hidden`}
                >
                  {/* Top Colorful Accent Line */}
                  <div
                    aria-hidden="true"
                    className={`absolute top-0 inset-x-0 h-1.5 ${currentTheme.accentLine}`}
                  />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-[0.22em] font-extrabold ${currentTheme.labelColor}`}
                    >
                      {t.traitLabel} · DEV TRAIT
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg ${currentTheme.refreshBg} flex items-center justify-center transition-transform duration-500 group-hover:rotate-180 shadow-xs`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Trait Title */}
                  <div>
                    <span
                      className={`text-xl font-extrabold ${currentTheme.titleColor} tracking-tight block`}
                    >
                      {activeTrait}
                    </span>
                  </div>

                  {/* Card Footer: Status Tag */}
                  <div className="flex items-center text-[11px] font-mono border-t border-zinc-900/5 dark:border-white/5 pt-2">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${currentTheme.dotColor} animate-pulse`}
                      />
                      <span className={`font-bold ${currentTheme.promptColor}`}>
                        {currentTraitInfo[lang].tag}
                      </span>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
