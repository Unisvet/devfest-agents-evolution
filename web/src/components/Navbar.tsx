import React from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  FlaskConical,
  PanelTopClose,
  Presentation,
  Printer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DemoExecutionMode, NavView } from '../types/presentation';

export const Navbar: React.FC<{
  activeView: NavView;
  onSelectView: (v: NavView) => void;
  demoMode: DemoExecutionMode;
  onToggleDemoMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  cinemaMode: boolean;
  onToggleCinemaMode: () => void;
}> = ({
  activeView,
  onSelectView,
  demoMode,
  onToggleDemoMode,
  soundEnabled,
  onToggleSound,
  onToggleCinemaMode,
}) => {
  const tabs: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'deck', label: 'Presentation Deck', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'demos', label: 'Demos Lab', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'resources', label: 'Learning & Video Hub', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'pdf', label: 'Organizer PDF', icon: <Printer className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="no-print sticky top-0 z-40 w-full backdrop-blur-md bg-[#060913]/90 border-b border-slate-800/80">
      <div className="w-full px-5 sm:px-8 lg:px-12 h-13 py-2 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-emerald-500/30 border border-cyan-400/40 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="truncate">
            <div className="text-sm font-extrabold text-slate-100 truncate tracking-tight">
              From Agents to Evolution
            </div>
            <div className="text-[11px] font-mono text-cyan-300/90 truncate">
              <a
                href="https://devfest.gdg-stuttgart.dev/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit DevFest Stuttgart 2026 Official Website"
                className="underline decoration-cyan-400/50 underline-offset-2 hover:text-cyan-200 hover:decoration-cyan-300 transition"
              >
                DevFest Stuttgart 2026
              </a>{' '}
              • Antigravity × AlphaEvolve × Cloud TPUs
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const active = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectView(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {activeView === 'deck' && (
            <button
              type="button"
              onClick={onToggleCinemaMode}
              title="Cinema Stage Mode — Hide top bar for 100% viewport slide (Shortcut: C)"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-200 transition"
            >
              <PanelTopClose className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cinema (C)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleDemoMode}
            title="Switch between Stage-Safe Prerecorded traces and Live GCP / SDK mode"
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold border transition ${
              demoMode === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                : 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-500/40'
            }`}
          >
            {demoMode === 'live' ? '● LIVE GCP' : '◉ PRERECORDED'}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            title="Toggle Stage Transition Audio (Shortcut: M)"
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-purple-500/20 text-purple-200 border-purple-400/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <a
            href="https://github.com/Unisvet/devfest-agents-evolution"
            target="_blank"
            rel="noopener noreferrer"
            title="Open GitHub Repository"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono transition"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden xl:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Mobile Tab Row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950/90">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectView(tab.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
              activeView === tab.id ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400'
            }`}
          >
            {tab.icon}
            <span>{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
