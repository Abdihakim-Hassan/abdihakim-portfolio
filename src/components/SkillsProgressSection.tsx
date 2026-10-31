import React from 'react';
import { Code2, Layout, Server, GitBranch, Terminal } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { SKILLS_PROGRESS, SERVICES_DATA } from '../data/portfolioData';

interface SkillsProgressSectionProps {
  lang: Language;
}

/* Clean, Human-Engineered Tech Brand Badges */
function renderTechPill(tech: string) {
  const norm = tech.toLowerCase();
  let dotColor = 'bg-zinc-400 dark:bg-zinc-500';
  let label = tech;

  if (norm.includes('html')) {
    dotColor = 'bg-[#E34F26]';
    label = 'HTML5';
  } else if (norm.includes('tailwind')) {
    dotColor = 'bg-[#06B6D4]';
    label = 'Tailwind CSS';
  } else if (norm.includes('css')) {
    dotColor = 'bg-[#1572B6]';
  } else if (norm.includes('javascript') || norm === 'js') {
    dotColor = 'bg-[#EAB308]';
    label = 'JavaScript';
  } else if (norm.includes('react')) {
    dotColor = 'bg-[#087EA4] dark:bg-[#61DAFB]';
    label = 'React';
  } else if (norm.includes('node')) {
    dotColor = 'bg-[#22C55E]';
    label = 'Node.js';
  } else if (norm.includes('websocket') || norm.includes('socket')) {
    dotColor = 'bg-zinc-600 dark:bg-zinc-300';
    label = 'WebSockets';
  } else if (norm.includes('git')) {
    dotColor = 'bg-[#F05032]';
    label = 'Git';
  }

  return (
    <span
      key={tech}
      className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}

/* Crisp, Real Vector Icons for Each Tech */
function renderSkillIcon(skillId: string) {
  switch (skillId) {
    case 'html5':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#E34F26]/10 dark:bg-[#E34F26]/15 border border-[#E34F26]/25 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.5 1h19l-1.8 19.3L12 23l-7.7-2.7L2.5 1z" fill="#E34F26" />
            <path d="M12 21.2l6.3-1.8 1.5-16.6H12v18.4z" fill="#EF652A" />
            <path d="M12 9.2H8.3l-.3-3H16V3.8H5l.8 8.4H12V9.2zm0 6l-.1.03-3.1-.8-.2-2.2H6.3l.4 4.3 5.3 1.5V15.2zm0-3h3.5l-.4 3.8-3.1.8v2.3l5.3-1.5.7-8.4H12v3z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'css3':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 border border-[#06B6D4]/25 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.5 1h19l-1.8 19.3L12 23l-7.7-2.7L2.5 1z" fill="#1572B6" />
            <path d="M12 21.2l6.3-1.8 1.5-16.6H12v18.4z" fill="#33A9DC" />
            <path d="M12 8.7H8.5l-.3-3H16V3.8H5.2l.8 8h6V8.7zm0 6.5l-3.1-.8-.2-2.2H6.3l.4 4.3 5.3 1.5v-2.8zm4.4-5.5l-.3 3.1-4.1 1.1v2.3l6.3-1.7.8-8.4H12v2.1h4.4z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'javascript':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#F7DF1E] text-black font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs border border-[#CA8A04]/40 select-none">
          JS
        </div>
      );

    case 'react':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#087EA4]/10 dark:bg-[#61DAFB]/15 border border-[#087EA4]/25 dark:border-[#61DAFB]/30 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#087EA4] dark:text-[#61DAFB] fill-none stroke-current" strokeWidth="1.6">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
            <circle cx="12" cy="12" r="2" className="fill-current stroke-none" />
          </svg>
        </div>
      );

    case 'nodejs':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 dark:bg-[#22C55E]/15 border border-[#22C55E]/25 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M12 1.5a1.4 1.4 0 00-.7.2L3.1 6.6a1.4 1.4 0 00-.7 1.2v9.4a1.4 1.4 0 00.7 1.2l8.2 4.9a1.4 1.4 0 001.4 0l8.2-4.9a1.4 1.4 0 00.7-1.2V7.8a1.4 1.4 0 00-.7-1.2l-8.2-4.9a1.4 1.4 0 00-.7-.2zm0 2.2l7.3 4.3v8.5L12 20.8 4.7 16.5V8l7.3-4.3zm0 2.8c-.4 0-.7.3-.7.7v4.6l-3.2-3.8c-.3-.3-.8-.3-1.1 0-.3.3-.3.8 0 1.1l4.4 5.2c.2.2.4.3.7.3.4 0 .7-.3.7-.7v-4.6l3.2 3.8c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1l-4.4-5.2c-.2-.2-.4-.3-.7-.3z" />
          </svg>
        </div>
      );

    case 'git-tools':
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-zinc-900/10 dark:bg-white/10 border border-zinc-700/20 dark:border-white/15 text-zinc-900 dark:text-zinc-100 flex items-center justify-center shrink-0">
          <GitBranch className="w-5 h-5 text-[#F05032]" />
        </div>
      );
  }
}

/* Professional Human-Engineered Progress Bar & Accent Colors */
function getSkillColors(skillId: string) {
  switch (skillId) {
    case 'html5':
      return {
        barColor: 'bg-[#E34F26]',
        textColor: 'text-[#E34F26]',
      };
    case 'css3':
      return {
        barColor: 'bg-[#06B6D4]',
        textColor: 'text-[#0891B2] dark:text-[#22D3EE]',
      };
    case 'javascript':
      return {
        barColor: 'bg-[#EAB308]',
        textColor: 'text-[#854D0E] dark:text-[#FACC15]',
      };
    case 'react':
      return {
        barColor: 'bg-[#0284C7] dark:bg-[#38BDF8]',
        textColor: 'text-[#0284C7] dark:text-[#38BDF8]',
      };
    case 'nodejs':
      return {
        barColor: 'bg-[#16A34A] dark:bg-[#22C55E]',
        textColor: 'text-[#16A34A] dark:text-[#4ADE80]',
      };
    case 'git-tools':
    default:
      return {
        barColor: 'bg-[#F05032]',
        textColor: 'text-[#C2410C] dark:text-[#FB923C]',
      };
  }
}

export const SkillsProgressSection: React.FC<SkillsProgressSectionProps> = ({ lang }) => {
  const t = translations[lang].whatICanDo;

  const pillars = [
    {
      icon: <Code2 className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />,
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10',
    },
    {
      icon: <Layout className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />,
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10',
    },
    {
      icon: <Server className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />,
      iconBg: 'bg-zinc-900/[0.04] dark:bg-white/[0.06] border-zinc-900/10 dark:border-white/10',
    },
  ];

  return (
    <section
      id="skills"
      className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header — Clean Minimalist Eyebrow (No cheesy AI sparkles) */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 mb-2.5 sm:mb-3 font-semibold">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 sm:mt-3 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Core Capability Pillars — Human Crafted Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {SERVICES_DATA.map((service, idx) => {
            const pillar = pillars[idx % pillars.length];
            return (
              <div
                key={service.id}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#12141a] border border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`w-10 h-10 rounded-xl ${pillar.iconBg} border flex items-center justify-center shrink-0`}
                    >
                      {pillar.icon}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">
                    {service.title[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {service.description[lang]}
                  </p>
                </div>

                {/* Professional Tech Pills */}
                <div className="pt-4 border-t border-zinc-900/10 dark:border-white/[0.06] flex flex-wrap gap-1.5">
                  {service.technologies.map((tech) => renderTechPill(tech))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Sub-Eyebrow for Core Tech Stack */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {lang === 'so' ? 'Luuqadaha & Xirfadaha (Core Stack)' : 'Core Technical Stack'}
          </p>
          <span className="h-[1px] flex-1 bg-zinc-900/10 dark:bg-white/10" />
        </div>

        {/* 6 Core Technical Stack Cards — Clean, Human-Crafted Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS_PROGRESS.map((skill) => {
            const colors = getSkillColors(skill.id);
            return (
              <div
                key={skill.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Card Header: Real Icon + Category + Title */}
                  <div className="flex items-start gap-3 mb-4">
                    {renderSkillIcon(skill.id)}
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-zinc-500 dark:text-zinc-400 block">
                        {skill.category}
                      </span>
                      <h4 className="text-base font-bold text-zinc-950 dark:text-white truncate">
                        {skill.name[lang]}
                      </h4>
                    </div>
                  </div>

                  {/* Clean Engineering Metric Progress Bar */}
                  <div className="mb-4 bg-zinc-100/80 dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-900/5 dark:border-white/5">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">
                        {skill.stage[lang]}
                      </span>
                      <span className={`font-bold ${colors.textColor}`}>
                        {skill.percentage}%
                      </span>
                    </div>
                    {/* Clean Solid Progress Bar (No cheesy AI neon) */}
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.barColor} transition-all duration-700`}
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                    {skill.description[lang]}
                  </p>
                </div>

                {/* Minimalist Professional Topic Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-900/10 dark:border-white/[0.06]">
                  {skill.topics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
