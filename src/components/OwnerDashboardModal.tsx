import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  LayoutDashboard,
  FolderGit2,
  User,
  Database,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  Sparkles,
  Search,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Bell,
  Activity,
  Clock,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Shield,
  Layers,
  Upload,
  Download,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Eye,
  Globe,
  Share2,
} from 'lucide-react';
import { usePortfolioData, PortfolioOwnerData, Inquiry } from '../context/PortfolioDataContext';
import { Language, Project } from '../types';
import { useTheme } from './ThemeProvider';
import { WhatsAppIcon } from './WhatsAppIcon';

interface OwnerDashboardModalProps {
  lang: Language;
}

type SidebarTab = 'dashboard' | 'projects' | 'profile' | 'messages' | 'database';
type TimeFilter = '7D' | '30D' | '90D' | '1Y';

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({ lang }) => {
  const {
    isDashboardModalOpen,
    setIsDashboardModalOpen,
    owner,
    projects,
    inquiries = [],
    logout,
    updateOwner,
    addProject,
    updateProject,
    deleteProject,
    addInquiry,
    deleteInquiry,
    markInquiryRead,
    importDatabase,
    resetToDefaults,
  } = usePortfolioData();

  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Profile Form State initialized safely with guaranteed fallbacks
  const [profileForm, setProfileForm] = useState<PortfolioOwnerData>(() => ({
    ...owner,
    role: {
      en: owner?.role?.en || 'Aspiring Software Engineering Student at Jamhuriya University (JUST)',
      so: owner?.role?.so || 'Arday Software Engineering ka dhigta Jaamacadda Jamhuriya (JUST)',
    },
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (owner) {
      setProfileForm({
        ...owner,
        role: {
          en: owner?.role?.en || 'Aspiring Software Engineering Student at Jamhuriya University (JUST)',
          so: owner?.role?.so || 'Arday Software Engineering ka dhigta Jaamacadda Jamhuriya (JUST)',
        },
      });
    }
  }, [owner]);

  // Handle escape & keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDashboardModalOpen && !editingProject && !isCreatingProject && !selectedInquiry) {
        setIsDashboardModalOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('dashboard-global-search');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDashboardModalOpen, editingProject, isCreatingProject, selectedInquiry, setIsDashboardModalOpen]);

  if (!isDashboardModalOpen) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return lang === 'so' ? 'Subax wanaagsan' : 'Good morning';
    } else if (hour < 17) {
      return lang === 'so' ? 'Galab wanaagsan' : 'Good afternoon';
    } else {
      return lang === 'so' ? 'Fiid wanaagsan' : 'Good evening';
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwner(profileForm);
    showToast(lang === 'so' ? 'Xogta shakhsiga si guul leh ayaa loo keydiyay!' : 'Profile updated successfully!');
  };

  const handleSaveProjectForm = (projectData: Project) => {
    if (isCreatingProject) {
      addProject(projectData);
      setIsCreatingProject(false);
      showToast(lang === 'so' ? 'Mashruuc cusub ayaa lagu daray!' : 'New project added successfully!');
    } else if (editingProject) {
      updateProject(editingProject.id, projectData);
      setEditingProject(null);
      showToast(lang === 'so' ? 'Mashruuca si guul leh ayaa loo cusbooneysiiyay!' : 'Project updated successfully!');
    }
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(lang === 'so' ? `Ma hubtaa inaad tirtirto mashruuca "${title}"?` : `Are you sure you want to delete "${title}"?`)) {
      deleteProject(id);
      showToast(lang === 'so' ? 'Mashruuca waa la tirtiray!' : 'Project removed!');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDatabase(content)) {
        showToast(lang === 'so' ? 'Xogta database-ka waa la soo celiyay!' : 'Database restored from JSON successfully!');
      } else {
        alert(lang === 'so' ? 'Faylka JSON ma saxna!' : 'Invalid JSON database file!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.title?.en || '').toLowerCase().includes(q) ||
      (p.title?.so || '').toLowerCase().includes(q) ||
      (p.tagline?.en || '').toLowerCase().includes(q) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const unreadInquiriesCount = inquiries.filter((i) => !i.read).length;

  const analyticsDataMap: Record<
    TimeFilter,
    {
      summaryVisits: string;
      summaryInquiries: string;
      growth: string;
      peakText: string;
      points: Array<{
        label: string;
        subLabel: string;
        x: number;
        yBlue: number;
        yEmerald: number;
        visits: string;
        inquiries: number;
      }>;
      bluePath: string;
      blueArea: string;
      emeraldPath: string;
      emeraldArea: string;
    }
  > = {
    '7D': {
      summaryVisits: '14,820',
      summaryInquiries: '13',
      growth: '+14.2%',
      peakText: 'Peak: 2,890 visits (Saturday)',
      points: [
        { label: 'Mon', subLabel: 'Oct 20', x: 40,  yBlue: 145, yEmerald: 175, visits: '1,420', inquiries: 1 },
        { label: 'Tue', subLabel: 'Oct 21', x: 130, yBlue: 110, yEmerald: 160, visits: '1,980', inquiries: 2 },
        { label: 'Wed', subLabel: 'Oct 22', x: 220, yBlue: 125, yEmerald: 170, visits: '1,750', inquiries: 1 },
        { label: 'Thu', subLabel: 'Oct 23', x: 310, yBlue: 85,  yEmerald: 140, visits: '2,450', inquiries: 3 },
        { label: 'Fri', subLabel: 'Oct 24', x: 400, yBlue: 100, yEmerald: 155, visits: '2,180', inquiries: 2 },
        { label: 'Sat', subLabel: 'Oct 25', x: 490, yBlue: 55,  yEmerald: 120, visits: '2,890', inquiries: 4 },
        { label: 'Sun', subLabel: 'Oct 26', x: 570, yBlue: 75,  yEmerald: 135, visits: '2,550', inquiries: 3 },
      ],
      bluePath: 'M 40,145 C 90,120 100,110 130,110 C 170,110 190,135 220,125 C 260,115 280,85 310,85 C 350,85 370,105 400,100 C 440,95 460,55 490,55 C 520,55 540,80 570,75',
      blueArea: 'M 40,145 C 90,120 100,110 130,110 C 170,110 190,135 220,125 C 260,115 280,85 310,85 C 350,85 370,105 400,100 C 440,95 460,55 490,55 C 520,55 540,80 570,75 L 570,195 L 40,195 Z',
      emeraldPath: 'M 40,175 C 90,165 100,160 130,160 C 170,160 190,170 220,170 C 260,170 280,140 310,140 C 350,140 370,155 400,155 C 440,155 460,120 490,120 C 520,120 540,140 570,135',
      emeraldArea: 'M 40,175 C 90,165 100,160 130,160 C 170,160 190,170 220,170 C 260,170 280,140 310,140 C 350,140 370,155 400,155 C 440,155 460,120 490,120 C 520,120 540,140 570,135 L 570,195 L 40,195 Z',
    },
    '30D': {
      summaryVisits: '58,400',
      summaryInquiries: '48',
      growth: '+21.5%',
      peakText: 'Peak: 18,200 visits (Week 4)',
      points: [
        { label: 'Week 1', subLabel: 'Oct 1-7',   x: 60,  yBlue: 140, yEmerald: 170, visits: '11,200', inquiries: 8 },
        { label: 'Week 2', subLabel: 'Oct 8-14',  x: 230, yBlue: 115, yEmerald: 155, visits: '13,800', inquiries: 11 },
        { label: 'Week 3', subLabel: 'Oct 15-21', x: 400, yBlue: 90,  yEmerald: 135, visits: '15,200', inquiries: 14 },
        { label: 'Week 4', subLabel: 'Oct 22-28', x: 560, yBlue: 50,  yEmerald: 105, visits: '18,200', inquiries: 18 },
      ],
      bluePath: 'M 60,140 C 140,125 170,120 230,115 C 310,105 340,95 400,90 C 470,80 500,50 560,50',
      blueArea: 'M 60,140 C 140,125 170,120 230,115 C 310,105 340,95 400,90 C 470,80 500,50 560,50 L 560,195 L 60,195 Z',
      emeraldPath: 'M 60,170 C 140,165 170,160 230,155 C 310,150 340,140 400,135 C 470,125 500,105 560,105',
      emeraldArea: 'M 60,170 C 140,165 170,160 230,155 C 310,150 340,140 400,135 C 470,125 500,105 560,105 L 560,195 L 60,195 Z',
    },
    '90D': {
      summaryVisits: '142,600',
      summaryInquiries: '118',
      growth: '+34.8%',
      peakText: 'Peak: 54,200 visits (October)',
      points: [
        { label: 'August',    subLabel: 'Aug 2026', x: 80,  yBlue: 145, yEmerald: 170, visits: '38,400', inquiries: 28 },
        { label: 'September', subLabel: 'Sep 2026', x: 310, yBlue: 95,  yEmerald: 135, visits: '50,000', inquiries: 42 },
        { label: 'October',   subLabel: 'Oct 2026', x: 540, yBlue: 55,  yEmerald: 115, visits: '54,200', inquiries: 48 },
      ],
      bluePath: 'M 80,145 C 180,125 240,105 310,95 C 400,85 470,60 540,55',
      blueArea: 'M 80,145 C 180,125 240,105 310,95 C 400,85 470,60 540,55 L 540,195 L 80,195 Z',
      emeraldPath: 'M 80,170 C 180,155 240,145 310,135 C 400,125 470,120 540,115',
      emeraldArea: 'M 80,170 C 180,155 240,145 310,135 C 400,125 470,120 540,115 L 540,195 L 80,195 Z',
    },
    '1Y': {
      summaryVisits: '520,000',
      summaryInquiries: '420',
      growth: '+56.2%',
      peakText: 'Peak: 185,000 visits (Q4)',
      points: [
        { label: 'Q1', subLabel: 'Jan-Mar', x: 60,  yBlue: 155, yEmerald: 175, visits: '85,000',  inquiries: 65 },
        { label: 'Q2', subLabel: 'Apr-Jun', x: 230, yBlue: 125, yEmerald: 150, visits: '115,000', inquiries: 95 },
        { label: 'Q3', subLabel: 'Jul-Sep', x: 400, yBlue: 90,  yEmerald: 125, visits: '142,000', inquiries: 120 },
        { label: 'Q4', subLabel: 'Oct-Dec', x: 560, yBlue: 45,  yEmerald: 95,  visits: '185,000', inquiries: 160 },
      ],
      bluePath: 'M 60,155 C 140,145 170,135 230,125 C 310,110 340,95 400,90 C 470,75 500,45 560,45',
      blueArea: 'M 60,155 C 140,145 170,135 230,125 C 310,110 340,95 400,90 C 470,75 500,45 560,45 L 560,195 L 60,195 Z',
      emeraldPath: 'M 60,175 C 140,165 170,155 230,150 C 310,140 340,130 400,125 C 470,115 500,95 560,95',
      emeraldArea: 'M 60,175 C 140,165 170,155 230,150 C 310,140 340,130 400,125 C 470,115 500,95 560,95 L 560,195 L 60,195 Z',
    },
  };

  const currentAnalytics = analyticsDataMap[timeFilter];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex bg-[#f8f9fa] dark:bg-[#0c0d11] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden animate-in fade-in duration-200"
    >
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          45% { transform: rotate(14deg); }
          60% { transform: rotate(-4deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes flowLine {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 2.2s infinite ease-in-out;
        }
        .animate-flow-blue {
          stroke-dasharray: 20 120;
          animation: flowLine 3s linear infinite;
        }
        .animate-flow-emerald {
          stroke-dasharray: 16 100;
          animation: flowLine 4s linear infinite;
        }
      `}</style>

      {/* 1. LEFT EXECUTIVE SIDEBAR - Modern Clean Design */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        } transition-all duration-300 ease-in-out bg-white dark:bg-[#13151b] border-r border-zinc-900/10 dark:border-white/[0.08] flex flex-col justify-between shrink-0 z-30 select-none shadow-xs`}
      >
        <div>
          {/* Sidebar Top: Logo + Brand + Toggle Button */}
          {sidebarOpen ? (
            <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-900/10 dark:border-white/[0.08]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif italic font-bold text-lg shadow-sm shrink-0">
                  {owner?.monogram || 'A'}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xs font-extrabold tracking-wider uppercase text-zinc-900 dark:text-white truncate leading-tight">
                    {owner?.shortBrand || 'ABDIHAKIM'}
                  </h1>
                  <span className="text-[10px] font-medium tracking-wider text-zinc-500 dark:text-zinc-400 block uppercase leading-tight mt-0.5">
                    Admin Portal
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-16 flex items-center justify-center border-b border-zinc-900/10 dark:border-white/[0.08] px-2">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                title="Click to expand sidebar"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif italic font-bold text-lg shadow-sm group-hover:scale-105 transition-all">
                  {owner?.monogram || 'A'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className={sidebarOpen ? 'p-3 space-y-1.5' : 'p-2 space-y-2 flex flex-col items-center'}>
            {[
              {
                id: 'dashboard' as SidebarTab,
                icon: LayoutDashboard,
                label: lang === 'so' ? 'All-in-One Dashboard' : 'All-in-One Overview',
                badge: null,
                hasNotification: false,
              },
              {
                id: 'projects' as SidebarTab,
                icon: FolderGit2,
                label: lang === 'so' ? 'Mashruucyada' : 'Projects Studio',
                badge: `${projects.length}`,
                badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
                hasNotification: false,
              },
              {
                id: 'profile' as SidebarTab,
                icon: User,
                label: lang === 'so' ? 'Astaanta & Bio' : 'Profile & Bio',
                badge: null,
                hasNotification: false,
              },
              {
                id: 'messages' as SidebarTab,
                icon: MessageSquare,
                label: lang === 'so' ? 'Fariimaha & Leads' : 'Inquiries & Leads',
                badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} New` : `${inquiries.length}`,
                badgeColor:
                  unreadInquiriesCount > 0
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
                hasNotification: unreadInquiriesCount > 0,
              },
              {
                id: 'database' as SidebarTab,
                icon: Database,
                label: lang === 'so' ? 'Database & Backup' : 'Database & Backup',
                badge: null,
                hasNotification: false,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (sidebarOpen) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setEditingProject(null);
                      setIsCreatingProject(false);
                      setSelectedInquiry(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/[0.04] dark:hover:bg-white/[0.05]'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-950'
                          : 'bg-zinc-900/[0.05] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-900/10 dark:border-white/10'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              // Collapsed mode: perfectly centered icon button with rich tooltip
              return (
                <div key={item.id} className="relative group w-full flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setEditingProject(null);
                      setIsCreatingProject(false);
                      setSelectedInquiry(null);
                    }}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/[0.04] dark:hover:bg-white/[0.05]'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white dark:text-zinc-950' : 'group-hover:scale-110 transition-transform'}`} />
                    {item.hasNotification && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                    )}
                  </button>

                  {/* Rich Floating Tooltip */}
                  <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 flex items-center gap-2 border border-slate-700/60">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Back to Portfolio + Owner Info + Expand/Collapse button */}
        <div className={sidebarOpen ? 'p-3 border-t border-slate-200/90 dark:border-white/[0.08] space-y-1.5' : 'p-2 border-t border-slate-200/90 dark:border-white/[0.08] space-y-2 flex flex-col items-center'}>
          {sidebarOpen ? (
            <>
              <button
                type="button"
                onClick={() => setIsDashboardModalOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Return to Public Portfolio Website"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{lang === 'so' ? 'Ku Noqo Portfolio-ga' : 'View Public Site'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{lang === 'so' ? 'Ka Bax Nidaamka' : 'Sign Out'}</span>
              </button>
            </>
          ) : (
            <>
              <div className="relative group w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsDashboardModalOpen(false)}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  aria-label="View Public Site"
                >
                  <ArrowUpRight className="w-5 h-5 shrink-0" />
                </button>
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 border border-slate-700/60">
                  {lang === 'so' ? 'Ku Noqo Portfolio-ga' : 'View Public Site'}
                </div>
              </div>

              <div className="relative group w-full flex justify-center">
                <button
                  type="button"
                  onClick={logout}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                </button>
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 border border-slate-700/60">
                  {lang === 'so' ? 'Ka Bax Nidaamka' : 'Sign Out'}
                </div>
              </div>

              <div className="relative group w-full flex justify-center pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="w-11 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 border border-slate-700/60">
                  Expand sidebar
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70 dark:bg-[#0b0c10] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 border-b border-slate-200/90 dark:border-white/[0.08] bg-white/95 dark:bg-[#11131a]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 shadow-xs dark:shadow-none">
          {/* Global Search Bar (Ctrl+K) */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="dashboard-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, technologies, leads... (Ctrl+K)"
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-100/90 dark:bg-[#0e1017] border border-slate-200 dark:border-white/[0.1] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              ⌘K
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('messages');
                  showToast(`${unreadInquiriesCount} client inquiries available`);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="View Inquiries"
              >
                <Bell className="w-4 h-4" />
                {unreadInquiriesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>

            <span className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Admin User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-slate-200 shrink-0">
                <img
                  src={owner?.portrait}
                  alt={owner?.fullName || 'Eng Abdihakim'}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Eng Abdihakim</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Administrator</p>
              </div>
            </div>

            {/* Close / Return to Public Page */}
            <button
              type="button"
              onClick={() => setIsDashboardModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Close Dashboard & View Portfolio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-20 right-8 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* TOP QUICK ACTION BANNER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900/10 dark:border-white/[0.08]">
            {activeTab === 'dashboard' ? (
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>{getGreeting()}, Eng. Abdihakim</span>
                    <span className="inline-block animate-wave text-2xl sm:text-3xl select-none" role="img" aria-label="Waving hand">👋</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {lang === 'so'
                    ? 'Halkan ka maamul mashaariicdaada, xogta shakhsiga, iyo fariimaha macmiisha hal meel.'
                    : 'Manage your portfolio projects, profile details, and client inquiries in one unified place.'}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {activeTab === 'projects' && (lang === 'so' ? 'Maamulka Mashaariicda' : 'Projects Management')}
                  {activeTab === 'profile' && (lang === 'so' ? 'Astaanta & Xogta Shakhsiga' : 'Profile & Bio Editor')}
                  {activeTab === 'messages' && (lang === 'so' ? 'Fariimaha Macaamiisha' : 'Client Inquiries')}
                  {activeTab === 'database' && (lang === 'so' ? 'Maamulka Database-ka' : 'Database Management')}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {lang === 'so'
                    ? 'Dhammaan qalabka maamulka portfolio-ga hal meel ayaa la isugu keenay'
                    : 'All portfolio management tools unified in one responsive workspace.'}
                </p>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsCreatingProject(true);
                  setActiveTab('projects');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'so' ? '+ Kudar Mashruuc' : '+ New Project'}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: ALL-IN-ONE OVERVIEW (COMBINES EVERYTHING HARMONIOUSLY) */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 4 STAT METRICS CARDS - CLEAN MODERN HOMEPAGE PALETTE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. TOTAL USERS / VISITORS */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      {lang === 'so' ? 'Wadarta Booqashooyinka' : 'Total Portfolio Visits'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {currentAnalytics.summaryVisits}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ↑ {currentAnalytics.growth}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    {lang === 'so' ? 'Booqdayaal firfircoon & maamulayaal' : 'Active recruiters & engineering leads'}
                  </p>
                </div>

                {/* 2. ACTIVE PROJECTS */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      {lang === 'so' ? 'Mashaariicda Shaqaynaysa' : 'Active Projects'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {projects.length}
                    </span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-900/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-full border border-zinc-900/10 dark:border-white/10">
                      100% Production
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    ShaqoKaab, Tuko & Fintech Platforms
                  </p>
                </div>

                {/* 3. INQUIRIES / LEADS */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      {lang === 'so' ? 'Fariimaha Macaamiisha' : 'Client Inquiries'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {inquiries.length}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      unreadInquiriesCount > 0
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-zinc-700 dark:text-zinc-300 bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10'
                    }`}>
                      {unreadInquiriesCount > 0 ? `+${unreadInquiriesCount} New` : 'All Read'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    {lang === 'so' ? 'Fariimo toos ah & wada-shaqeyn' : 'Direct portfolio messages & partnerships'}
                  </p>
                </div>

                {/* 4. PERFORMANCE & UPTIME */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      {lang === 'so' ? 'Xawaaraha Nidaamka' : 'System Performance'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-zinc-900/[0.04] dark:bg-white/[0.06] border border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">99.8%</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      1.2s Fast
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    {lang === 'so' ? 'Vite 6 macmiilka & keydinta tooska ah' : 'Vite 6 Client & LocalStorage Sync'}
                  </p>
                </div>
              </div>

              {/* TRAFFIC CHART ROW + LIVE RECENT LEADS PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left 8 Cols: WORKING INTERACTIVE AREA CHART */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                            {lang === 'so' ? 'Booqashooyinka & Saamaynta Portfolio-ga' : 'Traffic & Engagement Analytics'}
                          </h3>
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Live Stream</span>
                          </div>
                          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border border-zinc-900/10 dark:border-white/10">
                            {currentAnalytics.peakText}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {lang === 'so'
                            ? `Guud ahaan muddadan: ${currentAnalytics.summaryVisits} booqasho · ${currentAnalytics.summaryInquiries} fariimo`
                            : `Total for period: ${currentAnalytics.summaryVisits} visits · ${currentAnalytics.summaryInquiries} inquiries`}
                        </p>
                      </div>

                      {/* Interactive Working Time Filter Pills */}
                      <div className="flex items-center p-1 rounded-xl bg-zinc-900/[0.03] dark:bg-white/[0.04] border border-zinc-900/10 dark:border-white/[0.08]">
                        {(['7D', '30D', '90D', '1Y'] as TimeFilter[]).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setTimeFilter(tab);
                              setHoveredChartPoint(null);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                              timeFilter === tab
                                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/[0.04] dark:hover:bg-white/[0.05]'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Graphic Visualization */}
                    <div className="relative w-full h-60 my-2 group">
                      <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="activeBlueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="activeEmeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Gridlines */}
                        <line x1="20" y1="40" x2="580" y2="40" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800/60" strokeDasharray="4 4" />
                        <line x1="20" y1="90" x2="580" y2="90" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800/60" strokeDasharray="4 4" />
                        <line x1="20" y1="140" x2="580" y2="140" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800/60" strokeDasharray="4 4" />
                        <line x1="20" y1="190" x2="580" y2="190" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700/60" />

                        {/* Interactive Scrubber Guide line on hover */}
                        {hoveredChartPoint !== null && currentAnalytics.points[hoveredChartPoint] && (
                          <line
                            x1={currentAnalytics.points[hoveredChartPoint].x}
                            y1="25"
                            x2={currentAnalytics.points[hoveredChartPoint].x}
                            y2="190"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="animate-in fade-in duration-150"
                          />
                        )}

                        {/* Secondary Curve: Inquiries (Emerald) */}
                        <path
                          d={currentAnalytics.emeraldArea}
                          fill="url(#activeEmeraldAreaGrad)"
                          className="transition-all duration-500 ease-out"
                        />
                        <path
                          d={currentAnalytics.emeraldPath}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                        {/* Live Moving Stream on Emerald Line */}
                        <path
                          d={currentAnalytics.emeraldPath}
                          fill="none"
                          stroke="#6ee7b7"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          className="animate-flow-emerald pointer-events-none"
                        />

                        {/* Primary Curve: Visits (Blue) */}
                        <path
                          d={currentAnalytics.blueArea}
                          fill="url(#activeBlueAreaGrad)"
                          className="transition-all duration-500 ease-out"
                        />
                        <path
                          d={currentAnalytics.bluePath}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                        {/* Live Moving Stream on Blue Line */}
                        <path
                          d={currentAnalytics.bluePath}
                          fill="none"
                          stroke="#93c5fd"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="animate-flow-blue pointer-events-none"
                        />

                        {/* Interactive Data Points along the curve */}
                        {currentAnalytics.points.map((pt, idx) => {
                          const isHovered = hoveredChartPoint === idx;
                          const isLastPoint = idx === currentAnalytics.points.length - 1;
                          return (
                            <g key={pt.label} className="cursor-pointer">
                              {/* Hover hitbox */}
                              <rect
                                x={pt.x - 25}
                                y="20"
                                width="50"
                                height="175"
                                fill="transparent"
                                onMouseEnter={() => setHoveredChartPoint(idx)}
                                onMouseLeave={() => setHoveredChartPoint(null)}
                              />

                              {/* Beacon Radar Wave for live last point */}
                              {isLastPoint && (
                                <>
                                  <circle
                                    cx={pt.x}
                                    cy={pt.yEmerald}
                                    r="8"
                                    fill="#10b981"
                                    opacity="0.35"
                                    className="animate-ping pointer-events-none origin-center"
                                  />
                                  <circle
                                    cx={pt.x}
                                    cy={pt.yBlue}
                                    r="10"
                                    fill="#3b82f6"
                                    opacity="0.35"
                                    className="animate-ping pointer-events-none origin-center"
                                  />
                                </>
                              )}

                              {/* Emerald dot */}
                              <circle
                                cx={pt.x}
                                cy={pt.yEmerald}
                                r={isHovered ? 5.5 : 3.5}
                                fill="#10b981"
                                stroke="currentColor"
                                className="text-white dark:text-[#13151b] transition-all duration-200"
                                strokeWidth="2"
                              />

                              {/* Blue dot */}
                              <circle
                                cx={pt.x}
                                cy={pt.yBlue}
                                r={isHovered ? 7 : 4.5}
                                fill="#3b82f6"
                                stroke="currentColor"
                                className="text-white dark:text-[#13151b] transition-all duration-200"
                                strokeWidth={isHovered ? 3 : 2}
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Floating Interactive Tooltip */}
                      {hoveredChartPoint !== null && currentAnalytics.points[hoveredChartPoint] && (
                        <div
                          className="absolute pointer-events-none z-30 px-3.5 py-2.5 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-white dark:text-zinc-950 shadow-2xl border border-white/10 dark:border-zinc-900/10 backdrop-blur-md text-xs animate-in fade-in zoom-in-95 duration-150"
                          style={{
                            left: `${(currentAnalytics.points[hoveredChartPoint].x / 600) * 100}%`,
                            top: `${Math.min(currentAnalytics.points[hoveredChartPoint].yBlue, 90)}px`,
                            transform: 'translate(-50%, -115%)',
                          }}
                        >
                          <div className="font-bold text-[11px] pb-1 mb-1 border-b border-white/20 dark:border-zinc-300 flex items-center justify-between gap-3">
                            <span>{currentAnalytics.points[hoveredChartPoint].label}</span>
                            <span className="font-sans text-[10px] opacity-75">{currentAnalytics.points[hoveredChartPoint].subLabel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-blue-400 dark:text-blue-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>{currentAnalytics.points[hoveredChartPoint].visits} visits</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-emerald-400 dark:text-emerald-600 font-bold mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{currentAnalytics.points[hoveredChartPoint].inquiries} client leads</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic X-Axis Labels aligned with data points */}
                    <div className="flex items-center justify-between px-4 pt-1 text-[11px] font-sans font-medium text-zinc-500 dark:text-zinc-400">
                      {currentAnalytics.points.map((pt, idx) => (
                        <button
                          key={pt.label}
                          type="button"
                          onMouseEnter={() => setHoveredChartPoint(idx)}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                          className={`hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer ${
                            hoveredChartPoint === idx ? 'text-zinc-900 dark:text-white font-bold' : ''
                          }`}
                        >
                          {pt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footnote / Legend */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-900/10 dark:border-white/[0.08] text-xs font-sans text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                      <span>{lang === 'so' ? 'Booqashooyinka Tooska ah' : 'Direct Portfolio Visits'}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                      <span>{lang === 'so' ? 'Fariimaha Macaamiisha' : 'Direct Inquiries'}</span>
                    </span>
                  </div>
                </div>

                {/* Right 4 Cols: RECENT INQUIRIES */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#13151b] border border-zinc-900/10 dark:border-white/[0.08] shadow-xs dark:shadow-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                          {lang === 'so' ? 'Fariimihii Ugu Dambeeyay' : 'Recent Inquiries'}
                        </h3>
                        {unreadInquiriesCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950">
                            {unreadInquiriesCount} New
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('messages')}
                        className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Dignified human-designed inquiries list */}
                    <div className="space-y-3">
                      {inquiries.slice(0, 3).map((inq, idx) => {
                        const avatarBg = 'bg-zinc-900 text-zinc-100 dark:bg-white dark:text-zinc-950';
                        const initials = inq.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase();

                        return (
                          <div
                            key={inq.id}
                            onClick={() => {
                              setSelectedInquiry(inq);
                              markInquiryRead(inq.id);
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm ${
                              !inq.read
                                ? 'bg-white dark:bg-[#181a28] border-slate-300 dark:border-white/20 border-l-[4px] border-l-zinc-950 dark:border-l-white shadow-xs'
                                : 'bg-slate-50/80 dark:bg-[#0f1118] border-slate-200/90 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar Crest */}
                              <div
                                className={`w-8 h-8 rounded-lg ${avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                              >
                                {initials}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {inq.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{inq.timestamp}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {inq.subject}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {inq.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refined Executive Bottom Button */}
                  <div className="mt-4 pt-3.5 border-t border-slate-200/90 dark:border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('messages')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>{lang === 'so' ? 'Fur Qaybta Fariimaha' : 'Open Inquiries Inbox'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION: INTEGRATED PROJECTS STUDIO (3 CARDS PER ROW) */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                      <span>{lang === 'so' ? 'Mashaariicda Portfolio-ga (3 Kaadh Safkiiba)' : 'Live Portfolio Projects (3 Cards Per Row)'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === 'so'
                        ? 'Toos uga maamul, wax ka beddel, ama kudar mashaariic cusub nidaamka'
                        : 'Manage, edit, or launch new projects directly on the live portfolio'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreatingProject(true);
                      setActiveTab('projects');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'so' ? 'Kudar Mashruuc' : 'Add Project'}</span>
                  </button>
                </div>

                {/* 3 Cards Per Row Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl bg-white dark:bg-[#13151f] border border-slate-200/90 dark:border-white/[0.08] shadow-xs dark:shadow-none overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      {/* Thumbnail & Badges */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={project.image}
                          alt={project.title?.en || 'Project'}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                            #{project.index}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 backdrop-blur-md text-white border border-white/10 text-[10px] font-semibold uppercase tracking-wider">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                            {lang === 'so' ? project.title?.so : project.title?.en}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {lang === 'so' ? project.tagline?.so : project.tagline?.en}
                          </p>

                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {(project.technologies || []).slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold"
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.technologies || []).length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
                                +{(project.technologies || []).length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {project.liveAppUrl && project.liveAppUrl !== '#' && (
                              <a
                                href={project.liveAppUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
                                title="View Live App"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject(project);
                                setIsCreatingProject(false);
                                setActiveTab('projects');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title?.en || 'Project')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PROJECTS MANAGEMENT (CREATE / EDIT / DELETE) */}
          {/* ============================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {(isCreatingProject || editingProject) ? (
                <ProjectForm
                  project={editingProject}
                  isCreating={isCreatingProject}
                  lang={lang}
                  onSave={handleSaveProjectForm}
                  onCancel={() => {
                    setEditingProject(null);
                    setIsCreatingProject(false);
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {lang === 'so' ? 'Dhammaan Mashaariicda' : 'Portfolio Projects Management'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'so'
                          ? `Wadarta: ${projects.length} mashruuc (3 kaadh ayaa safkiiba u qoran)`
                          : `Total: ${projects.length} projects displayed in responsive 3-cards-per-row grid`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'so' ? '+ Kudar Mashruuc Cusub' : '+ Add New Project'}</span>
                    </button>
                  </div>

                  {/* 3-Cards Per Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl bg-white dark:bg-[#13151f] border border-slate-200/90 dark:border-white/[0.08] shadow-xs dark:shadow-none overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={project.image}
                            alt={project.title?.en || 'Project'}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                              #{project.index}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 dark:bg-zinc-800/90 border border-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                              {lang === 'so' ? project.title?.so : project.title?.en}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {lang === 'so' ? project.tagline?.so : project.tagline?.en}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {(project.technologies || []).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {project.liveAppUrl && project.liveAppUrl !== '#' && (
                                <a
                                  href={project.liveAppUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
                                  title="View Live App"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject(project);
                                  setIsCreatingProject(false);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900/[0.05] dark:bg-white/[0.08] hover:bg-zinc-900/[0.1] dark:hover:bg-white/[0.15] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project.id, project.title?.en || 'Project')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PROFILE & BIOGRAPHY EDITOR */}
          {/* ============================================================== */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-6">
              <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#13151f] border border-slate-200/90 dark:border-white/[0.08] shadow-xs dark:shadow-none shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/90 dark:border-white/[0.08]">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {lang === 'so' ? 'Wax Ka Beddel Xogta Astaanta' : 'Edit Profile & Portfolio Identity'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'so' ? 'Magacaaga, xirfaddaada, fariimaha, iyo baraha xiriirka' : 'Update your personal name, bio, contacts, and channels'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'so' ? 'Keydi Isbeddellada' : 'Save Changes'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Display Short Brand Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.shortBrand || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, shortBrand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Monogram (Logo Initial)
                    </label>
                    <input
                      type="text"
                      value={profileForm.monogram || 'A'}
                      onChange={(e) => setProfileForm({ ...profileForm, monogram: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      University
                    </label>
                    <input
                      type="text"
                      value={profileForm.university || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Engineering Role (English)
                    </label>
                    <input
                      type="text"
                      value={profileForm.role?.en || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          role: { ...profileForm.role, en: e.target.value, so: profileForm.role?.so || '' },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Engineering Role (Somali)
                    </label>
                    <input
                      type="text"
                      value={profileForm.role?.so || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          role: { ...profileForm.role, so: e.target.value, en: profileForm.role?.en || '' },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.whatsapp || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Direct WhatsApp Link (https://wa.me/...)
                    </label>
                    <input
                      type="url"
                      value={profileForm.whatsappLink || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsappLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.github || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.linkedin || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      TikTok Profile URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.tiktok || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, tiktok: e.target.value })}
                      placeholder="https://www.tiktok.com/@..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/90 dark:border-white/[0.08]">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'so' ? 'Keydi Xogta' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: CLIENT INQUIRIES & DIRECT LEADS */}
          {/* ============================================================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lang === 'so' ? 'Fariimaha iyo Xiriirada Macaamiisha' : 'Client Inquiries & Direct Leads'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'so'
                      ? 'Fariimaha tooska ah ee kasoo gaara foomka xiriirka ee portfolio-gaaga'
                      : 'Real-time inquiries received via your portfolio contact form'}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-900/[0.05] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10">
                  {unreadInquiriesCount} Unread · {inquiries.length} Total
                </span>
              </div>

              {/* Inquiry Detail Modal */}
              {selectedInquiry && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#13151f] border border-zinc-900/20 dark:border-white/20 shadow-lg space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/90 dark:border-white/[0.08]">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {selectedInquiry.subject}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        From: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedInquiry.name}</span> ({selectedInquiry.email}) · {selectedInquiry.timestamp}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {selectedInquiry.message}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/252613993775?text=${encodeURIComponent(`Hi ${selectedInquiry.name}, regarding your portfolio message "${selectedInquiry.subject}"...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Re: ${selectedInquiry.subject}`)}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteInquiry(selectedInquiry.id);
                        setSelectedInquiry(null);
                        showToast(lang === 'so' ? 'Fariinta waa la tirtiray!' : 'Inquiry deleted!');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Inquiries List */}
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setSelectedInquiry(inq);
                      markInquiryRead(inq.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      !inq.read
                        ? 'bg-zinc-900/[0.03] dark:bg-white/[0.04] border-zinc-300 dark:border-white/20 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        !inq.read
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {inq.name}
                          </span>
                          {!inq.read && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                          {inq.subject}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {inq.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[11px] font-mono text-slate-400 mr-2">{inq.timestamp}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInquiry(inq.id);
                          showToast('Inquiry removed');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: DATABASE & BACKUP ENGINE */}
          {/* ============================================================== */}
          {activeTab === 'database' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === 'so' ? 'Maamulka Kaydka Xogta & Nuqullada (Database Engine)' : 'Portfolio Database Engine & Backups'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'so'
                    ? 'Soo degso, dib u soo geli, ama dib u celi xogta asalka ah ee portfolio-gaaga.'
                    : 'Export snapshots, restore from JSON backup, or reset to production defaults.'}
                </p>
              </div>

              {/* Status Overview Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#13151f] border border-slate-200/90 dark:border-white/[0.08] shadow-xs dark:shadow-none shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    LOCAL DATABASE STATUS
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    3 Collections · {projects.length} Projects · {inquiries.length} Inquiries
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Synced with LocalStorage
                  </span>
                </div>
              </div>

              {/* Action 1: Export JSON */}
              <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900/[0.05] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'so' ? 'Soo Degso Nuqul Xogeed (Export JSON)' : 'Export Full Database (JSON)'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'so'
                        ? 'Soo degso dhammaan mashaariicda, xogta shakhsiga ah, iyo fariimaha oo ah fayl JSON ah.'
                        : 'Download an offline snapshot of your complete portfolio data structure.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ owner, projects, inquiries }, null, 2));
                    const dl = document.createElement('a');
                    dl.setAttribute('href', dataStr);
                    dl.setAttribute('download', `abdihakim_portfolio_db_${Date.now()}.json`);
                    dl.click();
                    showToast(lang === 'so' ? 'Faylka waa la soo degsaday!' : 'JSON snapshot exported!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                >
                  {lang === 'so' ? 'Soo Degso JSON Backup' : 'Export JSON Backup'}
                </button>
              </div>

              {/* Action 2: Import JSON */}
              <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'so' ? 'Dib u Soo Geli Nuqul Xogeed (Import JSON)' : 'Import Database from JSON'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'so'
                        ? 'Dooro fayl JSON ah oo aad hore u kaydsatay si aad xogta u soo celiso.'
                        : 'Upload a previously saved JSON snapshot to restore all portfolio records.'}
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  {lang === 'so' ? 'Dooro Fayl JSON ah...' : 'Choose JSON File...'}
                </button>
              </div>

              {/* Action 3: Reset to Baseline */}
              <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'so' ? 'Dib u Celinta Xogta Asalka ah' : 'Restore Demo Baseline'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {lang === 'so'
                        ? 'Dib ugu celi 3-da mashruuc iyo xogta Eng Abdihakim qaabkii rasmiga ahaa.'
                        : 'Reset projects, biography, and credentials back to clean verified baseline values.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(lang === 'so' ? 'Ma hubtaa inaad dib u celiso dhammaan xogta?' : 'Reset database to clean production baseline?')) {
                      resetToDefaults();
                      showToast(lang === 'so' ? 'Xogta dib ayaa loogu celiyay!' : 'Database restored to defaults!');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                >
                  {lang === 'so' ? 'Dib u Celi Xogta Asalka ah' : 'Reset to Demo Defaults'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Form to Add/Edit a Project
interface ProjectFormProps {
  project: Project | null;
  isCreating: boolean;
  lang: Language;
  onSave: (p: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isCreating, lang, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>(() => {
    if (project) return { ...project };
    return {
      id: `project-${Date.now()}`,
      index: '04',
      title: { so: '', en: '' },
      tagline: { so: '', en: '' },
      category: 'web',
      categoryLabel: { so: 'Web Application', en: 'Web Application' },
      stackLabel: 'REACT · NODE.JS · TYPESCRIPT · TAILWIND CSS',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop',
      year: new Date().getFullYear().toString(),
      client: 'Self-Initiated / Client',
      featured: true,
      technologies: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
      metrics: [
        { label: { so: 'Nooca', en: 'Platform' }, value: 'Cloud Web System' },
        { label: { so: 'Xaaladda', en: 'Status' }, value: 'Production' },
      ],
      overview: { so: '', en: '' },
      architecture: { so: '', en: '' },
      challenge: { so: '', en: '' },
      solution: { so: '', en: '' },
      liveAppUrl: '#',
      githubUrl: 'https://github.com/Abdihakim-Hassan',
    };
  });

  const [techInput, setTechInput] = useState(formData.technologies?.join(', ') || '');

  const handleTechChange = (val: string) => {
    setTechInput(val);
    const parsed = val.split(',').map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, technologies: parsed }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.en && !formData.title?.so) {
      alert('Please provide a project title');
      return;
    }
    const finalProject: Project = {
      ...formData,
      title: {
        en: formData.title?.en || formData.title?.so || 'Untitled Project',
        so: formData.title?.so || formData.title?.en || 'Mashruuc aan la magacaabin',
      },
      tagline: {
        en: formData.tagline?.en || formData.tagline?.so || '',
        so: formData.tagline?.so || formData.tagline?.en || '',
      },
      overview: {
        en: formData.overview?.en || formData.overview?.so || formData.tagline?.en || '',
        so: formData.overview?.so || formData.overview?.en || formData.tagline?.so || '',
      },
    };
    onSave(finalProject);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5 p-6 rounded-2xl bg-white dark:bg-[#13151f] border border-slate-200/90 dark:border-white/[0.08] shadow-xs dark:shadow-none shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/90 dark:border-white/[0.08]">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            {isCreating
              ? lang === 'so'
                ? 'Kudar Mashruuc Cusub'
                : 'Create New Project'
              : lang === 'so'
              ? 'Wax ka beddel Mashruuca'
              : 'Edit Project'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'so' ? 'Buuxi faahfaahinta mashruuca' : 'Fill in the technical project details'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {lang === 'so' ? 'Ka noqo' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'so' ? 'Keydi' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Index (#01, #02...)
          </label>
          <input
            type="text"
            value={formData.index || ''}
            onChange={(e) => setFormData({ ...formData, index: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as any,
                categoryLabel: {
                  en: e.target.value === 'ai' ? 'AI / Machine Learning' : e.target.value === 'mobile' ? 'Mobile App' : 'Web Application',
                  so: e.target.value === 'ai' ? 'Nidaamka AI' : e.target.value === 'mobile' ? 'App-ka Moobilka' : 'Nidaamka Web-ka',
                },
              })
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          >
            <option value="web">Web Application</option>
            <option value="ai">AI & Machine Learning</option>
            <option value="mobile">Mobile Application</option>
            <option value="desktop">Enterprise Desktop</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Year
          </label>
          <input
            type="text"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Project Title (English)
          </label>
          <input
            type="text"
            value={formData.title?.en || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: { ...formData.title, en: e.target.value, so: formData.title?.so || '' },
              })
            }
            placeholder="e.g. ShaqoKaab Portal"
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Project Title (Somali)
          </label>
          <input
            type="text"
            value={formData.title?.so || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: { ...formData.title, so: e.target.value, en: formData.title?.en || '' },
              })
            }
            placeholder="e.g. ShaqoKaab"
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Tagline (English)
          </label>
          <input
            type="text"
            value={formData.tagline?.en || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                tagline: { ...formData.tagline, en: e.target.value, so: formData.tagline?.so || '' },
              })
            }
            placeholder="Brief tagline"
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Tagline (Somali)
          </label>
          <input
            type="text"
            value={formData.tagline?.so || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                tagline: { ...formData.tagline, so: e.target.value, en: formData.tagline?.en || '' },
              })
            }
            placeholder="Qoraal kooban"
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
          Image URL or Path
        </label>
        <input
          type="text"
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          required
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
          Technologies (comma separated)
        </label>
        <input
          type="text"
          value={techInput}
          onChange={(e) => handleTechChange(e.target.value)}
          placeholder="React, TypeScript, Node.js, Tailwind CSS"
          className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Live Application URL
          </label>
          <input
            type="text"
            value={formData.liveAppUrl || ''}
            onChange={(e) => setFormData({ ...formData, liveAppUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 font-semibold mb-1">
            GitHub Repository URL
          </label>
          <input
            type="text"
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#0e1017] border border-slate-300 dark:border-white/[0.12] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0e1017] focus:border-zinc-950 dark:focus:border-white focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 transition-all outline-none shadow-2xs"
          />
        </div>
      </div>
    </form>
  );
};
