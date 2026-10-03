import React, { useState, useEffect } from 'react';
import {
  SiteContent,
  GitHubConfig,
  getLocalContent,
  saveLocalContent,
  resetLocalContent,
  getGitHubConfig,
  saveGitHubConfig,
  clearGitHubConfig,
  pushContentToGitHub,
} from '../lib/contentStore';
import { ImageUploader } from './ImageUploader';
import { LiveDevicePreview } from './LiveDevicePreview';
import {
  Palette,
  LayoutTemplate,
  BedDouble,
  Sparkles,
  UtensilsCrossed,
  CalendarDays,
  PhoneCall,
  GitBranch,
  UploadCloud,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Key,
  FolderGit2,
  ChevronLeft,
  Menu,
  X,
  Lock,
  Layers,
  Columns,
  Check,
  Zap,
  Globe,
  Sliders,
  Type,
  Download,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onExit: () => void;
}

type TabType =
  | 'general'
  | 'typography'
  | 'hero'
  | 'suites'
  | 'wellness'
  | 'dining'
  | 'events'
  | 'contact'
  | 'github';

type ViewMode = 'editor' | 'split' | 'preview';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [content, setContent] = useState<SiteContent>(() => getLocalContent());
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [githubConfig, setGithubConfig] = useState<GitHubConfig | null>(() => getGitHubConfig());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);

  // Unified Save & Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<'idle' | 'saving' | 'pushing' | 'done'>('idle');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    details?: string;
  } | null>(null);

  // GitHub Modal / Form state
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [setupToken, setSetupToken] = useState('');
  const [setupRepo, setSetupRepo] = useState('');
  const [setupBranch, setSetupBranch] = useState('main');

  // Track edits
  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    setHasUnsavedEdits(true);
  };

  // Ensure robots meta tag is set to noindex
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    const previousContent = metaRobots.content;
    metaRobots.content = 'noindex, nofollow';

    return () => {
      if (metaRobots) {
        metaRobots.content = previousContent || '';
      }
    };
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + S to Save & Publish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleUnifiedSaveAndPublish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const showNotification = (type: 'success' | 'error' | 'info', text: string, details?: string) => {
    setStatusMessage({ type, text, details });
    setTimeout(() => {
      setStatusMessage((current) => (current?.text === text ? null : current));
    }, 6000);
  };

  const handleDownloadContent = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', 'content.json downloaded!', 'Upload to src/data/content.json in your GitHub repository.');
  };

  /**
   * UNIFIED SAVE & PUBLISH ENGINE:
   * 1. Saves instantly to browser localStorage AND app server /api/content (updates globally for all visitors in 0ms).
   * 2. If GitHub token is present: commits to GitHub repository via REST API.
   * 3. If GitHub token is missing: saves to server and invites 1-click token setup for GitHub/Vercel global sync.
   */
  const handleUnifiedSaveAndPublish = async () => {
    setIsPublishing(true);
    setPublishStep('saving');

    // Step 1: Save locally and to app server immediately
    saveLocalContent(content);
    setHasUnsavedEdits(false);

    // Step 2: Push to GitHub if configured
    setPublishStep('pushing');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const autoCommitMessage = `✨ Update site content via Violet CMS (${now})`;

    const result = await pushContentToGitHub(content, githubConfig || getGitHubConfig(), autoCommitMessage);
    setIsPublishing(false);
    setPublishStep('done');

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.15, x: 0.8 },
      colors: ['#8A2BE2', '#D4AF37', '#9333EA', '#F59E0B', '#EAB308'],
    });

    if (result.needsToken) {
      showNotification(
        'info',
        'Saved to Server & Preview! ✓',
        'To push to GitHub/Vercel globally, add your 1-time GitHub token.'
      );
      setIsGitHubModalOpen(true);
    } else {
      showNotification(
        'success',
        'Published Globally! 🚀',
        result.message || 'Changes saved to server and committed to GitHub.'
      );
    }
  };

  const handleSaveGitHubConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupToken.trim()) {
      showNotification('error', 'Please paste your GitHub Personal Access Token.');
      return;
    }

    const config: GitHubConfig = {
      token: setupToken.trim(),
      repo: setupRepo.trim() ? setupRepo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').trim() : 'thaanemoletsane/The-Violet-House-Lesotho',
      branch: setupBranch.trim() || 'main',
    };
    saveGitHubConfig(config);
    setGithubConfig(config);

    // Immediately trigger push with the new token
    setIsPublishing(true);
    setPublishStep('pushing');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const autoCommitMessage = `✨ Update site content via Violet CMS (${now})`;

    const result = await pushContentToGitHub(content, config, autoCommitMessage);
    setIsPublishing(false);
    setPublishStep('done');

    if (result.success && !result.needsToken) {
      setIsGitHubModalOpen(false);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.2, x: 0.5 },
        colors: ['#8A2BE2', '#D4AF37', '#9333EA', '#F59E0B'],
      });
      showNotification(
        'success',
        'Published Globally to GitHub! 🚀',
        'Committed to repository. Production site updating!'
      );
    } else {
      showNotification(
        'error',
        'GitHub Connection Issue',
        result.message || 'Token could not push commit. Please check token permissions.'
      );
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all content back to factory default? Uncommitted local edits will be lost.')) {
      resetLocalContent();
      setContent(getLocalContent());
      setHasUnsavedEdits(false);
      showNotification('info', 'Content reset to defaults.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30">
      {/* 1. APPLE-STYLE TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-2xl border-b border-zinc-800 px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Drawer Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-amber-400 p-0.5 shadow-lg shadow-violet-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <Layers size={16} className="text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-zinc-100">
                  Violet Studio
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800/40 font-mono">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                {hasUnsavedEdits ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Unsaved edits
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    In Sync
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher (Editor / Split / Preview) */}
        <div className="hidden lg:flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner text-xs">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              viewMode === 'editor'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns size={13} />
            <span>Split View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Live Device</span>
          </button>
        </div>

        {/* Top Action Buttons: UNIFIED SAVE & PUBLISH */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unified Save & Publish Button */}
          <button
            onClick={handleUnifiedSaveAndPublish}
            disabled={isPublishing}
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-xs font-semibold text-white shadow-lg shadow-violet-900/40 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            {isPublishing ? (
              <>
                <RefreshCw size={14} className="animate-spin text-white" />
                <span>
                  {publishStep === 'saving'
                    ? 'Saving Locally...'
                    : publishStep === 'pushing'
                    ? 'Deploying to GitHub...'
                    : 'Finalizing...'}
                </span>
              </>
            ) : (
              <>
                <UploadCloud size={15} className="text-white transform group-hover:-translate-y-0.5 transition-transform" />
                <span>Save &amp; Publish</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white/90 font-mono">
                  ⌘S
                </span>
              </>
            )}
          </button>

          {/* Exit to Site */}
          <button
            onClick={onExit}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Return to website"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </header>

      {/* 2. TOAST ALERTS */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-950/50'
              : 'bg-zinc-900/95 border-violet-500/40 text-zinc-100 shadow-violet-950/50'
          }`}
        >
          {statusMessage.type === 'success' && (
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
          {statusMessage.type === 'error' && (
            <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          {statusMessage.type === 'info' && (
            <Zap size={20} className="text-violet-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <p className="font-semibold">{statusMessage.text}</p>
            {statusMessage.details && (
              <p className="text-[11px] opacity-80 mt-1 leading-relaxed">{statusMessage.details}</p>
            )}
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 py-2 flex items-center justify-between">
                <span>Content Studio</span>
                <span className="w-2 h-2 rounded-full bg-violet-500" />
              </div>

              {[
                { id: 'general', label: 'General & Colors', icon: Palette },
                { id: 'typography', label: 'Typography & Fonts', icon: Type },
                { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
                { id: 'suites', label: 'Suites & Living', icon: BedDouble },
                { id: 'wellness', label: 'Wellness & Pool', icon: Sparkles },
                { id: 'dining', label: 'Gourmet Dining', icon: UtensilsCrossed },
                { id: 'events', label: 'Events & Hosting', icon: CalendarDays },
                { id: 'contact', label: 'Contact & Concierge', icon: PhoneCall },
                { id: 'github', label: 'GitHub Cloud Deploy', icon: GitBranch },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setIsSidebarOpen(false);
                      if (viewMode === 'preview') setViewMode('split');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-violet-400' : 'text-zinc-500'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Status Card */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              {/* Site Health Card */}
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-2">
                <div className="flex items-center justify-between text-zinc-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} className="text-violet-400" />
                    Site Readiness
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">100% Ready</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>Static JSON Engine</span>
                  <span>Zero Database</span>
                </div>
              </div>

              <button
                onClick={onExit}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Return to Live Website</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Multi-Pane Layout: Editor Pane & Live Preview Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* EDITOR COLUMN */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <main
              className={`flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-950 ${
                viewMode === 'split' ? 'lg:w-1/2 lg:max-w-2xl border-r border-zinc-800/80' : 'max-w-4xl mx-auto'
              }`}
            >
              <div className="space-y-8 pb-16">
                {/* 1. GENERAL & COLORS */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">General & Brand Colors</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Configure brand name, logo image, 4-digit PIN, and custom color accents.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Site Name
                          </label>
                          <input
                            type="text"
                            value={content.general.siteName}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                general: { ...content.general, siteName: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Brand Tagline
                          </label>
                          <input
                            type="text"
                            value={content.general.siteTagline}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                general: { ...content.general, siteTagline: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>

                      {/* Brand Logo with Device Upload */}
                      <ImageUploader
                        label="Official Brand Logo Asset"
                        aspectRatio="1:1"
                        value={content.general.logoUrl || '/images/logo.png'}
                        onChange={(url) =>
                          updateContent({
                            ...content,
                            general: { ...content.general, logoUrl: url },
                          })
                        }
                        helperText="Upload any SVG, PNG, or JPG logo from your phone or computer."
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Admin 4-Digit Passcode
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={6}
                              value={content.general.passcode || '1234'}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  general: { ...content.general, passcode: e.target.value },
                                })
                              }
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                            <Lock size={14} className="absolute right-3 top-3 text-zinc-500" />
                          </div>
                        </div>

                        {/* Interactive Primary Color Picker */}
                        <div className="p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-zinc-200">Primary Color</div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {content.general.primaryColor}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {['#8A2BE2', '#7C3AED', '#9333EA', '#D4AF37'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() =>
                                  updateContent({
                                    ...content,
                                    general: { ...content.general, primaryColor: c },
                                  })
                                }
                                className="w-5 h-5 rounded-full border border-white/20"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                            <input
                              type="color"
                              value={content.general.primaryColor}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  general: { ...content.general, primaryColor: e.target.value },
                                })
                              }
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0 ml-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TYPOGRAPHY & LUXURY FONTS */}
                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Typography &amp; Typefaces</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Select refined display and body typefaces. Simplicity favours regularity — pick from curated luxury presets or customize directly.
                      </p>
                    </div>

                    {/* Curated Luxury Presets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          name: 'Editorial Heritage',
                          display: 'Playfair Display',
                          body: 'Plus Jakarta Sans',
                          desc: 'Prestigious serif titles paired with crystal-clear modern sans prose.',
                        },
                        {
                          name: 'Imperial Majesty',
                          display: 'Cinzel',
                          body: 'Plus Jakarta Sans',
                          desc: 'Royal, timeless Roman proportions with clean geometric body text.',
                        },
                        {
                          name: 'Haute Grandeur',
                          display: 'Cormorant Garamond',
                          body: 'Outfit',
                          desc: 'High-contrast French Renaissance aesthetic paired with modern luxury sans.',
                        },
                        {
                          name: 'Milano Vogue',
                          display: 'Bodoni Moda',
                          body: 'Outfit',
                          desc: 'Dramatic high-fashion serif titles with balanced geometric body copy.',
                        },
                      ].map((preset) => {
                        const isSelected =
                          (content.typography?.displayFont || 'Playfair Display') === preset.display &&
                          (content.typography?.bodyFont || 'Plus Jakarta Sans') === preset.body;
                        return (
                          <div
                            key={preset.name}
                            onClick={() =>
                              updateContent({
                                ...content,
                                typography: {
                                  displayFont: preset.display,
                                  bodyFont: preset.body,
                                },
                              })
                            }
                            className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-violet-950/40 border-violet-500 shadow-lg shadow-violet-950/50 ring-1 ring-violet-500/40'
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-zinc-200">{preset.name}</span>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div
                              className="text-2xl text-white font-light tracking-tight mb-1"
                              style={{ fontFamily: `${preset.display}, serif` }}
                            >
                              Elegance Perfected
                            </div>
                            <p
                              className="text-xs text-zinc-400 leading-relaxed mb-3"
                              style={{ fontFamily: `${preset.body}, sans-serif` }}
                            >
                              {preset.desc}
                            </p>
                            <div className="flex gap-2 text-[10px] text-zinc-500 font-mono">
                              <span className="px-2 py-0.5 rounded bg-zinc-800">{preset.display}</span>
                              <span className="px-2 py-0.5 rounded bg-zinc-800">{preset.body}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Font Selectors */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Custom Typeface Selection
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            Display / Headline Typeface
                          </label>
                          <select
                            value={content.typography?.displayFont || 'Playfair Display'}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                typography: {
                                  displayFont: e.target.value,
                                  bodyFont: content.typography?.bodyFont || 'Plus Jakarta Sans',
                                },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 cursor-pointer"
                          >
                            <option value="Playfair Display">Playfair Display (Editorial Standard)</option>
                            <option value="Cinzel">Cinzel (Royal Roman Classical)</option>
                            <option value="Cormorant Garamond">Cormorant Garamond (High Luxury)</option>
                            <option value="Bodoni Moda">Bodoni Moda (High Fashion Vogue)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            Body / Prose Typeface
                          </label>
                          <select
                            value={content.typography?.bodyFont || 'Plus Jakarta Sans'}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                typography: {
                                  displayFont: content.typography?.displayFont || 'Playfair Display',
                                  bodyFont: e.target.value,
                                },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 cursor-pointer"
                          >
                            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Crisp Modern)</option>
                            <option value="Outfit">Outfit (Clean Geometric Luxury)</option>
                            <option value="Inter">Inter (Universal Neutral)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HERO SECTION */}
                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Hero Section</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Configure the opening view of the estate, background image, and calls to action.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
                      <ImageUploader
                        label="Hero Background Media"
                        aspectRatio="16:9"
                        value={content.hero.bgImageUrl || '/images/new.jpeg'}
                        onChange={(url) =>
                          updateContent({
                            ...content,
                            hero: { ...content.hero, bgImageUrl: url },
                          })
                        }
                        helperText="Upload high-res photography directly from phone or desktop."
                      />

                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Kicker Subtitle
                          </label>
                          <input
                            type="text"
                            value={content.hero.kicker}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                hero: { ...content.hero, kicker: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                              Main Headline
                            </label>
                            <input
                              type="text"
                              value={content.hero.headlineMain}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  hero: { ...content.hero, headlineMain: e.target.value },
                                })
                              }
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                              Italic Accent Headline
                            </label>
                            <input
                              type="text"
                              value={content.hero.headlineItalic}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  hero: { ...content.hero, headlineItalic: e.target.value },
                                })
                              }
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                              Primary Button Text
                            </label>
                            <input
                              type="text"
                              value={content.hero.primaryButtonText}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  hero: { ...content.hero, primaryButtonText: e.target.value },
                                })
                              }
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                              Secondary Button Text
                            </label>
                            <input
                              type="text"
                              value={content.hero.secondaryButtonText}
                              onChange={(e) =>
                                updateContent({
                                  ...content,
                                  hero: { ...content.hero, secondaryButtonText: e.target.value },
                                })
                              }
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SUITES MANAGEMENT */}
                {activeTab === 'suites' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-100">Suites & Living Spaces</h2>
                        <p className="text-xs text-zinc-400 mt-1">
                          Manage rooms, upload photography, and set room specs.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newSuite = {
                            id: `suite-${Date.now()}`,
                            title: 'New Luxury Suite',
                            subtitle: 'Panoramic Mountain Retreat',
                            category: 'Master Suite',
                            image: '/images/image_2.png',
                            description: 'Enter room narrative here.',
                            specs: ['King Bed', 'Private Jacuzzi', 'Balcony'],
                          };
                          updateContent({
                            ...content,
                            suites: {
                              ...content.suites,
                              items: [...content.suites.items, newSuite],
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md shadow-violet-950/40"
                      >
                        <Plus size={14} />
                        <span>Add Suite</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {content.suites.items.map((suite, index) => (
                        <div
                          key={suite.id || index}
                          className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-violet-950 text-violet-400 text-[10px] font-mono flex items-center justify-center">
                                {index + 1}
                              </span>
                              {suite.title}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                disabled={index === 0}
                                onClick={() => {
                                  const items = [...content.suites.items];
                                  [items[index - 1], items[index]] = [items[index], items[index - 1]];
                                  updateContent({ ...content, suites: { ...content.suites, items } });
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                disabled={index === content.suites.items.length - 1}
                                onClick={() => {
                                  const items = [...content.suites.items];
                                  [items[index + 1], items[index]] = [items[index], items[index + 1]];
                                  updateContent({ ...content, suites: { ...content.suites, items } });
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${suite.title}"?`)) {
                                    const items = content.suites.items.filter((_, i) => i !== index);
                                    updateContent({ ...content, suites: { ...content.suites, items } });
                                  }
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <ImageUploader
                            label="Suite Photography"
                            aspectRatio="16:9"
                            value={suite.image}
                            onChange={(url) => {
                              const items = [...content.suites.items];
                              items[index] = { ...items[index], image: url };
                              updateContent({ ...content, suites: { ...content.suites, items } });
                            }}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={suite.title}
                                onChange={(e) => {
                                  const items = [...content.suites.items];
                                  items[index] = { ...items[index], title: e.target.value };
                                  updateContent({ ...content, suites: { ...content.suites, items } });
                                }}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                                Category
                              </label>
                              <input
                                type="text"
                                value={suite.category}
                                onChange={(e) => {
                                  const items = [...content.suites.items];
                                  items[index] = { ...items[index], category: e.target.value };
                                  updateContent({ ...content, suites: { ...content.suites, items } });
                                }}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={suite.description}
                              onChange={(e) => {
                                const items = [...content.suites.items];
                                items[index] = { ...items[index], description: e.target.value };
                                updateContent({ ...content, suites: { ...content.suites, items } });
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                              Specifications (comma separated)
                            </label>
                            <input
                              type="text"
                              value={suite.specs.join(', ')}
                              onChange={(e) => {
                                const items = [...content.suites.items];
                                items[index] = {
                                  ...items[index],
                                  specs: e.target.value.split(',').map((s) => s.trim()),
                                };
                                updateContent({ ...content, suites: { ...content.suites, items } });
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. WELLNESS & AMENITIES */}
                {activeTab === 'wellness' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Wellness & Pool Deck</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Manage private jacuzzi imagery, infinity pool deck, and amenity highlights.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageUploader
                          label="Pool Deck Photo"
                          aspectRatio="1:1"
                          value={content.wellness.poolImage}
                          onChange={(url) =>
                            updateContent({
                              ...content,
                              wellness: { ...content.wellness, poolImage: url },
                            })
                          }
                        />

                        <ImageUploader
                          label="Lifestyle / Spa Photo"
                          aspectRatio="1:1"
                          value={content.wellness.modelImage}
                          onChange={(url) =>
                            updateContent({
                              ...content,
                              wellness: { ...content.wellness, modelImage: url },
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                          Wellness Narrative
                        </label>
                        <textarea
                          rows={2}
                          value={content.wellness.description}
                          onChange={(e) =>
                            updateContent({
                              ...content,
                              wellness: { ...content.wellness, description: e.target.value },
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. GOURMET DINING */}
                {activeTab === 'dining' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Gourmet Dining Experience</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Upload custom culinary photos, describe courses, and specify chef highlights.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {content.dining.courses.map((course, index) => (
                        <div
                          key={course.id || index}
                          className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                              Course: {course.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">{course.subtitle}</span>
                          </div>

                          <ImageUploader
                            label={`${course.name} Dish Media`}
                            aspectRatio="16:9"
                            value={course.image}
                            onChange={(url) => {
                              const courses = [...content.dining.courses];
                              courses[index] = { ...courses[index], image: url };
                              updateContent({ ...content, dining: { ...content.dining, courses } });
                            }}
                          />

                          <div>
                            <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={course.title}
                              onChange={(e) => {
                                const courses = [...content.dining.courses];
                                courses[index] = { ...courses[index], title: e.target.value };
                                updateContent({ ...content, dining: { ...content.dining, courses } });
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-medium text-zinc-400 uppercase block mb-1">
                              Narrative Description
                            </label>
                            <textarea
                              rows={2}
                              value={course.desc}
                              onChange={(e) => {
                                const courses = [...content.dining.courses];
                                courses[index] = { ...courses[index], desc: e.target.value };
                                updateContent({ ...content, dining: { ...content.dining, courses } });
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. EVENTS & HOSTING */}
                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Events & Hosting</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Manage photography and narrative for high-profile estate events.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
                      <ImageUploader
                        label="Primary Event Showcase"
                        aspectRatio="16:9"
                        value={content.events.image}
                        onChange={(url) =>
                          updateContent({
                            ...content,
                            events: { ...content.events, image: url },
                          })
                        }
                      />

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                          Event Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={content.events.description}
                          onChange={(e) =>
                            updateContent({
                              ...content,
                              events: { ...content.events, description: e.target.value },
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. CONTACT & CONCIERGE */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">Contact & Concierge</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Configure WhatsApp booking numbers, telephone, location, and philosophy quotes.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={content.contact.phone}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                contact: { ...content.contact, phone: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            WhatsApp Number
                          </label>
                          <input
                            type="text"
                            value={content.contact.whatsapp}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                contact: { ...content.contact, whatsapp: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Concierge Email
                          </label>
                          <input
                            type="email"
                            value={content.contact.email}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                contact: { ...content.contact, email: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                            Address
                          </label>
                          <input
                            type="text"
                            value={content.contact.address}
                            onChange={(e) =>
                              updateContent({
                                ...content,
                                contact: { ...content.contact, address: e.target.value },
                              })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                          Footer Brand Philosophy Quote
                        </label>
                        <textarea
                          rows={2}
                          value={content.contact.quote}
                          onChange={(e) =>
                            updateContent({
                              ...content,
                              contact: { ...content.contact, quote: e.target.value },
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. GITHUB CLOUD DEPLOY */}
                {activeTab === 'github' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">GitHub Cloud Deployment</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Connect your GitHub repository to enable 1-click publishing directly to production.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                              githubConfig
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                            }`}
                          >
                            <FolderGit2 size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-zinc-200">
                              {githubConfig ? githubConfig.repo : 'No repository connected yet'}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {githubConfig
                                ? `Branch: ${githubConfig.branch} • Connected via REST API`
                                : 'Enter your GitHub Token below'}
                            </div>
                          </div>
                        </div>

                        {githubConfig && (
                          <button
                            onClick={() => {
                              if (confirm('Disconnect GitHub credentials from this browser?')) {
                                clearGitHubConfig();
                                setGithubConfig(null);
                                showNotification('info', 'GitHub credentials disconnected.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50 text-xs transition-colors"
                          >
                            Disconnect
                          </button>
                        )}
                      </div>

                      {/* Connection Form */}
                      <form onSubmit={handleSaveGitHubConfig} className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-zinc-400 block mb-1">
                            GitHub Repository (<span className="text-zinc-500 font-mono">owner/repo-name</span>)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. thaanemoletsane/The-Violet-House-Lesotho"
                            value={setupRepo}
                            onChange={(e) => setSetupRepo(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-zinc-400 block mb-1">
                            GitHub Personal Access Token (PAT)
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                              value={setupToken}
                              onChange={(e) => setSetupToken(e.target.value)}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 font-mono"
                            />
                            <Key size={14} className="absolute right-3 top-3 text-zinc-500" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-zinc-400 block mb-1">
                            Target Branch
                          </label>
                          <input
                            type="text"
                            placeholder="main"
                            value={setupBranch}
                            onChange={(e) => setSetupBranch(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                        >
                          Save Credentials &amp; Connect
                        </button>
                      </form>

                      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                        <button
                          onClick={handleResetDefaults}
                          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          Reset Content to Defaults
                        </button>
                        <span className="text-[10px] text-zinc-600">
                          Tokens are stored locally in your browser.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          )}

          {/* REAL-TIME INTERACTIVE LIVE DEVICE PREVIEW COLUMN */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`p-3 sm:p-6 bg-zinc-900/40 overflow-hidden flex flex-col ${
                viewMode === 'split' ? 'hidden lg:flex lg:w-1/2' : 'w-full'
              }`}
            >
              <LiveDevicePreview
                content={content}
                isSplitView={viewMode === 'split'}
                onClose={() => setViewMode('editor')}
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. GITHUB CLOUD GLOBAL PUBLISHING MODAL */}
      {isGitHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsGitHubModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Step 1: Saved to App Server &amp; Preview ✓
                </span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Publish Globally to GitHub &amp; Vercel
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Your changes are already saved to this app server. To deploy globally to your public production website on GitHub and Vercel, connect your 1-time GitHub Personal Access Token.
              </p>
            </div>

            {/* Quick 1-Click Link to Generate Token */}
            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 space-y-3">
              <div className="text-xs font-semibold text-violet-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Key size={14} className="text-violet-400" />
                  <span>Use: <strong>Personal Access Token (Classic)</strong></span>
                </div>
                <span className="text-[10px] bg-violet-800/50 text-violet-200 px-2 py-0.5 rounded-full border border-violet-500/30">Starts with ghp_</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Click the button below to open GitHub with the <code className="text-violet-300 bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-500/30">repo</code> scope already pre-checked. Scroll to the bottom, click the green <strong className="text-zinc-200">"Generate token"</strong> button, copy it, and paste it here:
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <a
                  href="https://github.com/settings/tokens/new?description=The+Violet+House+CMS&scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-sm transition-all"
                >
                  <span>1. Click Here to Open Pre-Configured Token</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="text-[10px] text-zinc-500 pt-1">
                Required Permission: <strong>repo</strong> (Full control of private repositories) • Expiration: <strong>No expiration</strong> (or 90 days).
              </div>
            </div>

            {/* Token Input Form */}
            <form onSubmit={handleSaveGitHubConfig} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Paste GitHub Token (PAT)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-violet-500"
                    autoFocus
                  />
                  <Key size={14} className="absolute right-3 top-3 text-zinc-500" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPublishing || !setupToken.trim()}
                  className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-violet-950/50 transition-all cursor-pointer text-center"
                >
                  {isPublishing ? 'Pushing to GitHub...' : 'Save Token & Push Globally 🚀'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadContent}
                  className="py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                  title="Alternative: Download updated content.json file directly"
                >
                  <Download size={14} />
                  <span>Download JSON</span>
                </button>
              </div>
            </form>

            <div className="text-[10px] text-zinc-500 text-center pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span>Token is saved securely in your browser.</span>
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                className="text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Close (Saved to Server)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
