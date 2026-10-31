import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, Project } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  lang: Language;
}

function renderTechMiniBadge(tech: string) {
  const normalized = tech.toLowerCase();

  // Subtle brand indicator dot on clean, professional neutral tag
  let dotColor = 'bg-zinc-400 dark:bg-zinc-500';
  if (normalized.includes('html')) dotColor = 'bg-[#E34F26]';
  else if (normalized.includes('tailwind')) dotColor = 'bg-[#06B6D4]';
  else if (normalized.includes('css')) dotColor = 'bg-[#1572B6]';
  else if (normalized.includes('typescript') || normalized === 'ts') dotColor = 'bg-[#3178C6]';
  else if (normalized.includes('javascript') || normalized === 'js') dotColor = 'bg-[#EAB308]';
  else if (normalized.includes('react')) dotColor = 'bg-[#087EA4] dark:bg-[#61DAFB]';
  else if (normalized.includes('node')) dotColor = 'bg-[#22C55E]';

  return (
    <span
      key={tech}
      title={tech}
      className="px-2.5 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {tech}
    </span>
  );
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang }) => {
  const t = translations[lang].workGallery;
  const { projects } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<string>('all');

  const activeProject = projects[activeIndex] || projects[0] || null;
  const filteredArchiveProjects = projects.filter((p) => {
    if (archiveFilter === 'all') return true;
    return p.id === archiveFilter || p.id.startsWith(archiveFilter) || p.client.toLowerCase().includes(archiveFilter.toLowerCase());
  });

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const scrollToArchive = () => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* SECTION 1: SELECTED WORK — "Work Gallery" 3D Fanned Carousel (Matches Screenshot 2) */}
      <section
        id="work"
        className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header Row matching Screenshot 2 */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
            <div>
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

            <button
              type="button"
              onClick={scrollToArchive}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-sm"
            >
              <span>{t.viewMoreBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3D Fanned Horizontal Card Stage matching Screenshot 2 */}
          <div className="relative h-[220px] sm:h-[340px] md:h-[390px] flex items-center justify-center my-2 sm:my-4 select-none">
            {projects.map((project, idx) => {
              const total = projects.length;
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;
              const isFar = !isCenter && !isLeft && !isRight;

              let transformClass = 'scale-70 opacity-0 pointer-events-none z-0';
              if (isCenter) {
                transformClass =
                  'translate-x-0 scale-100 opacity-100 z-30 shadow-[0_25px_70px_rgba(0,0,0,0.65)] ring-1 ring-zinc-900/15 dark:ring-white/15';
              } else if (isLeft) {
                transformClass =
                  '-translate-x-[18%] sm:-translate-x-[48%] scale-[0.86] sm:scale-[0.83] opacity-55 sm:opacity-65 hover:opacity-90 z-20 cursor-pointer';
              } else if (isRight) {
                transformClass =
                  'translate-x-[18%] sm:translate-x-[48%] scale-[0.86] sm:scale-[0.83] opacity-55 sm:opacity-65 hover:opacity-90 z-20 cursor-pointer';
              } else if (isFar) {
                transformClass =
                  'translate-x-0 scale-[0.72] opacity-25 pointer-events-none z-10';
              }

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedProject(project);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isCenter) setSelectedProject(project);
                      else setActiveIndex(idx);
                    }
                  }}
                  aria-label={project.title[lang]}
                  className={`absolute w-[86%] sm:w-[62%] md:w-[56%] aspect-[16/10] rounded-2xl overflow-hidden bg-[#12151e] border border-zinc-900/15 dark:border-white/15 transition-all duration-500 ease-out cursor-pointer group ${transformClass}`}
                >
                  <img
                    src={project.image}
                    alt={project.title[lang]}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20 opacity-80 group-hover:opacity-55 transition-opacity pointer-events-none" />

                  {/* Top Live App Pill & Stack Label */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 px-1 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-emerald-500/95 backdrop-blur-md text-[9px] sm:text-[10px] font-mono font-extrabold uppercase tracking-wider text-white shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE PROJECT
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold text-white/90 truncate max-w-[65%]">
                      {project.stackLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-white/95 px-1 pointer-events-none">
                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 font-semibold truncate max-w-[75%]">
                      {project.categoryLabel[lang]}
                    </span>
                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 font-extrabold shrink-0">
                      #{project.index}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Subtle Prev/Next Controls */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-0 sm:left-2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#181b24]/95 border border-zinc-900/15 dark:border-white/15 text-zinc-900 dark:text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-0 sm:right-2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#181b24]/95 border border-zinc-900/15 dark:border-white/15 text-zinc-900 dark:text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Centered Active Project Title, Description, Tech Stack & Live Action Buttons */}
          <div className="mt-6 sm:mt-8 text-center max-w-2xl mx-auto">
            {/* Project Selector Dots */}
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Select ${p.title[lang]}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'w-8 bg-zinc-950 dark:bg-white'
                      : 'w-2 bg-zinc-400/40 dark:bg-white/20 hover:bg-zinc-600'
                  }`}
                />
              ))}
            </div>

            {activeProject && (
              <>
                <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-snug">
                  {activeProject.title[lang]}
                </h3>

                <p className="mt-3 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {activeProject.overview[lang]}
                </p>

                {/* Real Project Colored Tech Badges */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {activeProject.technologies.map((tech) => renderTechMiniBadge(tech))}
                </div>

                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                  {activeProject.liveAppUrl && (
                    <a
                      href={activeProject.liveAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-bold transition-all shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{lang === 'so' ? 'Fur Mashruuca Tooska ah' : 'Open Live Project'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(activeProject)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <span>{t.viewProjectLink}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: ARCHIVE — 2026 Professional Engineering Project Archive */}
      <section
        id="archive"
        className="py-16 sm:py-24 md:py-32 relative border-t border-zinc-900/10 dark:border-white/[0.07] editorial-wave-bg"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Archive Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
                  {t.archiveEyebrow} &mdash; 0{projects.length} {lang === 'so' ? 'BAARNAAMIJYO TOOS U SHAQEYNAYA' : 'PRODUCTION SYSTEMS'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {t.archiveTitle}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 sm:mt-3 max-w-xl">
                {t.archiveSubtitle}
              </p>
            </div>

            {/* Interactive Category Filter Tabs — Dynamic with count */}
            <div className="w-full sm:w-auto flex items-center p-1.5 rounded-2xl bg-white/80 dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-sm self-start md:self-end overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setArchiveFilter('all')}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                  archiveFilter === 'all'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {lang === 'so' ? `Dhammaan (${projects.length})` : `All Live (${projects.length})`}
              </button>

              {projects.map((proj) => {
                const active = archiveFilter === proj.id;
                const label = proj.client || proj.title[lang].split(' ')[0];
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setArchiveFilter(proj.id)}
                    className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                      active
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {label} (1)
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Cards-Per-Line Equal-Size Professional Flex/Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredArchiveProjects.map((project) => {
              const isLiveApp = Boolean(project.liveAppUrl);

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="w-full h-full group relative rounded-2xl overflow-hidden bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] hover:border-zinc-950/30 dark:hover:border-white/30 shadow-sm hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Visual Cover Frame (Uniform Height h-48) */}
                  <div className="relative w-full h-48 overflow-hidden bg-zinc-950 border-b border-zinc-900/10 dark:border-white/[0.07] shrink-0">
                    <img
                      src={project.image}
                      alt={project.title[lang]}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15" />

                    {/* Top Row Badges: Index & Category */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold text-white shadow-sm">
                        #{project.index}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md border border-white/15 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-200 shadow-sm">
                        {project.category}
                      </span>
                    </div>

                    {/* Bottom Overlay Status Badge */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      {isLiveApp ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          LIVE APP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-300 shadow-sm">
                          CASE STUDY
                        </span>
                      )}

                      <span className="text-[10px] font-mono font-medium text-zinc-300 truncate max-w-[60%] bg-zinc-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                        {project.stackLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Uniform Height Title, Tagline & Colored Tech Stack Pills */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
                        {project.title[lang]}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {project.tagline[lang]}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-zinc-900/5 dark:border-white/[0.05]">
                      {project.technologies.slice(0, 5).map((tech) => renderTechMiniBadge(tech))}
                    </div>
                  </div>

                  {/* Card Footer: Uniform Height Action Bar */}
                  <div className="h-16 px-5 bg-zinc-50/80 dark:bg-white/[0.02] border-t border-zinc-900/10 dark:border-white/[0.07] flex items-center justify-between gap-2.5 shrink-0">
                    {project.liveAppUrl ? (
                      <a
                        href={project.liveAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{lang === 'so' ? 'Fur App-ka' : 'Launch App'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {lang === 'so' ? 'Mashruuc Farsamo' : 'Case Study'}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <span>{lang === 'so' ? 'Faahfaahin' : 'Details'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
      />
    </>
  );
};
