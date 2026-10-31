import React, { useEffect } from 'react';
import { X, Github, ArrowUpRight, Layers, CheckCircle2 } from 'lucide-react';
import { Language, Project } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';

interface ProjectModalProps {
  project: Project | null;
  lang: Language;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  lang,
  onClose,
  onSelectProject,
}) => {
  const { projects } = usePortfolioData();
  const t = translations[lang].projects;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const otherProjects = projects.filter((p) => p.id !== project.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/75 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92svh] sm:max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/15 dark:border-white/15 shadow-2xl text-zinc-900 dark:text-zinc-100">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 dark:bg-[#13151b]/95 border-b border-zinc-900/10 dark:border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 shrink-0">
              {project.index}
            </span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">
              {project.categoryLabel[lang]}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-900/15 dark:border-white/15 flex items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            aria-label={t.closeModal}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Preview — Interactive Live App Iframe if available, else Image */}
        {project.liveAppUrl ? (
          <div className="w-full h-[340px] sm:h-[580px] overflow-hidden bg-black border-b border-zinc-900/10 dark:border-white/10 relative">
            <iframe
              src={project.liveAppUrl}
              title={project.title[lang]}
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full overflow-hidden bg-black border-b border-zinc-900/10 dark:border-white/10">
            <img
              src={project.image}
              alt={project.title[lang]}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div>
            <h2
              id="modal-project-title"
              className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white"
            >
              {project.title[lang]}
            </h2>
            <p className="mt-2 sm:mt-2.5 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {project.overview[lang]}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              {project.liveAppUrl ? (
                <a
                  href={project.liveAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>{lang === 'so' ? 'Fur Mashruuca Oo Buuxa (Full Screen)' : 'Open Full Screen App'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <span>{t.liveDemo}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl border border-zinc-900/20 dark:border-white/20 text-xs font-semibold hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>{t.sourceCode}</span>
                </a>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-900/10 dark:border-white/10"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  {m.label[lang]}
                </span>
                <span className="text-sm font-bold text-zinc-950 dark:text-white mt-1 block">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Architecture, Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>{t.architectureFlow}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.architecture[lang]}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-2">
                <span>{t.theChallenge}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.challenge[lang]}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-900/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.theSolution}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.solution[lang]}
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
              {t.technologiesUsed}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900/[0.04] dark:bg-white/[0.05] border border-zinc-900/10 dark:border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Switch to Another Project */}
          {onSelectProject && otherProjects.length > 0 && (
            <div className="pt-6 border-t border-zinc-900/10 dark:border-white/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                {lang === 'so' ? 'Mashaariicda Kale' : 'More Projects'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherProjects.map((other) => (
                  <button
                    key={other.id}
                    type="button"
                    onClick={() => onSelectProject(other)}
                    className="p-3.5 rounded-xl border border-zinc-900/10 dark:border-white/10 hover:border-zinc-900/30 dark:hover:border-white/30 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block">
                        {other.index}
                      </span>
                      <span className="text-xs font-bold text-zinc-950 dark:text-white">
                        {other.title[lang]}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
