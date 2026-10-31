import React from 'react';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Code2,
  Database,
  Layers,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { PORTFOLIO_OWNER } from '../data/portfolioData';
import justCrestImg from '../assets/images/just_crest.png';

interface JourneySectionProps {
  lang: Language;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ lang }) => {
  const t = translations[lang].journey;

  const curriculumPillars = [
    {
      icon: Code2,
      title: lang === 'so' ? "Mabaadii'da Algorithms & CS" : 'Algorithms & Computational Logic',
      desc:
        lang === 'so'
          ? 'Data Structures, falanqaynta xawaaraha koodhka (Big-O), iyo xallinta dhibaatooyinka computational-ka ah.'
          : 'Data structures, algorithm complexity analysis (Big-O), recursion, and computational problem solving.',
      tag: 'Computer Science',
      cardBg: 'bg-white dark:bg-[#13151b]',
      borderColor: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200',
      tagColor: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      accentDot: 'bg-zinc-950 dark:bg-white',
    },
    {
      icon: Layers,
      title: lang === 'so' ? 'Naqshadaynta Koodhka & OOP' : 'Software Engineering & OOP',
      desc:
        lang === 'so'
          ? "Mabaadii'da Object-Oriented Programming (OOP), modular architecture, iyo nidaamyada casriga ah ee SDLC."
          : 'Object-oriented architecture, design patterns, clean code principles, and software development lifecycles.',
      tag: 'Architecture',
      cardBg: 'bg-white dark:bg-[#13151b]',
      borderColor: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200',
      tagColor: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      accentDot: 'bg-zinc-950 dark:bg-white',
    },
    {
      icon: Database,
      title: lang === 'so' ? 'Xog-kaydiyayaasha & Shabakadaha' : 'Databases & Web Engineering',
      desc:
        lang === 'so'
          ? 'Relational databases (SQL), naqshadaynta xogta (DBMS), iyo qaab-dhismeedka client-server APIs.'
          : 'Relational database modeling, SQL queries, system integration, and distributed web applications.',
      tag: 'Systems',
      cardBg: 'bg-white dark:bg-[#13151b]',
      borderColor: 'border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-900/25 dark:hover:border-white/20',
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200',
      tagColor: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border-zinc-900/10 dark:border-white/10',
      accentDot: 'bg-zinc-950 dark:bg-white',
    },
  ];

  return (
    <section
      id="journey"
      className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
              {t.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 sm:mt-3 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* Master Academic Showcase Card */}
        <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white/80 dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-sm hover:border-zinc-900/20 dark:hover:border-white/20 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left 7 Columns: Degree Overview, Academic Focus & Pillars */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
                  {lang === 'so'
                    ? 'Computer Application'
                    : 'B.Sc. in Computer Application'}
                </h3>

                {/* University & Location Badges with Professional Colors */}
                <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Jamhuriya University of Science and Technology</span>
                  </div>

                  <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs">•</span>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 text-rose-900 dark:text-rose-300 text-xs font-semibold shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Mogadishu, Somalia</span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lang === 'so'
                    ? "Waxaan heer jaamacadeed kaga jiraa Jaamacadda Jamhuriya (JUST) anigoo baranaya cilmiga Software Engineering. Waxbarashadaydu waxay isku xirtaa mabaadii'da adag ee sayniska kumbuyuutarka (algorithms, xog-kaydiyayaasha, iyo naqshadaynta habaysan) iyo xirfadaha dhabta ah ee lagu dhiso barnaamijyo casri ah oo dadka waxtara."
                    : 'Pursuing software engineering studies at Jamhuriya University of Science and Technology (JUST) in Mogadishu. My academic trajectory bridges theoretical computer science fundamentals—data structures, system design, and database modeling—with pragmatic full-stack web engineering.'}
                </p>

                {/* 3 Academic Foundations */}
                <div className="mt-6 pt-6 border-t border-zinc-900/5 dark:border-white/[0.05]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 font-bold block mb-3">
                    {lang === 'so' ? 'TIIRARKA WAXBARASHADA JAAMACADDA' : 'CORE ACADEMIC PILLARS'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {curriculumPillars.map((pillar) => {
                      const Icon = pillar.icon;
                      return (
                        <div
                          key={pillar.title}
                          className={`p-3.5 rounded-xl ${pillar.cardBg} border ${pillar.borderColor} hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg ${pillar.iconBg} border flex items-center justify-center shrink-0 shadow-xs`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${pillar.tagColor}`}
                              >
                                {pillar.tag}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-[13px] font-extrabold text-zinc-950 dark:text-white leading-snug group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors">
                              {pillar.title}
                            </h4>

                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                              {pillar.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-zinc-900/5 dark:border-white/[0.05] flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${pillar.accentDot}`} />
                            <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
                              {lang === 'so' ? 'Tiirka Aasaasiga' : 'Core Foundation'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Link to Official University */}
              <div className="mt-6 pt-5 border-t border-zinc-900/5 dark:border-white/[0.05] flex items-center justify-between flex-wrap gap-3">
                <a
                  href="https://just.edu.so"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{lang === 'so' ? 'Booqo Bogga Jaamacadda JUST' : 'Visit JUST Portal'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'so' ? 'Waxbarasho Rasmi ah' : 'Verified Academic Program'}</span>
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Verified Academic Credential Badge Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative group">
                {/* Physical-style Credential Card */}
                <div className="relative rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-white/15 shadow-2xl overflow-hidden">
                  {/* Subtle watermarked seal pattern in background */}
                  <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/[0.03] border border-white/[0.05] pointer-events-none flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white/[0.05]" />
                  </div>

                  {/* Top Bar: University Header with Official JUST Logo */}
                  <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20">
                      <img
                        src={justCrestImg}
                        alt="Jamhuriya University of Science and Technology (JUST)"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-amber-400/95 uppercase font-bold whitespace-nowrap">
                        JAMHURIYA UNIVERSITY
                      </span>
                      <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                        Faculty of Computer Applications
                      </span>
                    </div>
                  </div>

                  {/* Student & Degree Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 block mb-0.5">
                        {lang === 'so' ? 'ARDAYGA' : 'STUDENT CANDIDATE'}
                      </span>
                      <p className="text-base font-extrabold text-white tracking-wide">
                        {PORTFOLIO_OWNER.fullName}
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">
                        Eng Abdihakim Hassan
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 block mb-0.5">
                        {lang === 'so' ? 'BULLAADA DEGREE-GA' : 'DEGREE PROGRAM'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-amber-300/95 leading-snug">
                        Computer Application
                      </p>
                    </div>

                    {/* Verified Subjects Tag Grid */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 block mb-2">
                        {lang === 'so' ? 'MAADOOYINKA MUHIIMKA AH' : 'CORE CURRICULUM'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Algorithms',
                          'Data Structures',
                          'OOP',
                          'DBMS & SQL',
                          'System Analysis',
                          'Web Tech',
                        ].map((sub) => (
                          <span
                            key={sub}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.07] border border-white/10 text-zinc-300"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Footer */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'so' ? 'Xaqiijiyay JUST' : 'JUST Verified Program'}</span>
                    </span>
                    <span>Mogadishu, SO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
