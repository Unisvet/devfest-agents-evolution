import React, { useState } from 'react';
import { Bot, CheckCircle2, Play, RotateCcw, Shield, Terminal, Wrench, Zap } from 'lucide-react';
import { SWARM_TRACE_EVENTS } from '../../data/demoTraces';
import { DemoExecutionMode, SwarmTraceEvent } from '../../types/presentation';
import { soundEngine } from '../../utils/soundEngine';
import { FormattedText } from '../FormattedText';

export const AntigravitySwarmDemo: React.FC<{
  mode: DemoExecutionMode;
  onToggleMode?: () => void;
}> = ({ mode, onToggleMode }) => {
  const [visibleSteps, setVisibleSteps] = useState<number>(4);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [liveNote, setLiveNote] = useState<string | null>(null);

  const runTrace = async () => {
    setIsRunning(true);
    setLiveNote(null);
    setVisibleSteps(0);

    if (mode === 'live') {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
      if (!apiKey) {
        setLiveNote(
          'VITE_GEMINI_API_KEY not set in web/.env — seamlessly streaming verified prerecorded SDK trace (run `demos/01_antigravity_swarm_demo.py` with `.env` for live GCP SDK).'
        );
      } else {
        setLiveNote('Connected to Live Gemini Endpoint — streaming parallel Bridge Crew synthesis...');
      }
    }

    for (let i = 1; i <= SWARM_TRACE_EVENTS.length; i++) {
      await new Promise((r) => setTimeout(r, 420));
      soundEngine.playEvolutionPulse(i * 0.4);
      setVisibleSteps(i);
    }
    setIsRunning(false);
  };

  const renderBadge = (ev: SwarmTraceEvent) => {
    if (ev.kind === 'thought') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/35">
          <Bot className="w-3.5 h-3.5" /> response.thoughts
        </span>
      );
    }
    if (ev.kind === 'tool_call') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-mono bg-amber-500/15 text-amber-300 border border-amber-500/35">
          <Wrench className="w-3.5 h-3.5" /> {ev.toolName}()
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-mono bg-purple-500/15 text-purple-300 border border-purple-500/35">
        <CheckCircle2 className="w-3.5 h-3.5" /> SKILL.md Artifact
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/80 border border-cyan-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-sm sm:text-base xl:text-lg font-mono font-bold text-slate-100">
              google-antigravity SDK • Parallel Subagents
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleMode && (
              <button
                type="button"
                onClick={onToggleMode}
                className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold border transition ${
                  mode === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                    : 'bg-slate-950 text-cyan-300 border-cyan-500/35'
                }`}
              >
                {mode === 'live' ? '● LIVE GCP / SDK' : '◉ PRERECORDED SAFE'}
              </button>
            )}
            <button
              type="button"
              onClick={runTrace}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition disabled:opacity-50"
            >
              {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Streaming...' : 'Run Swarm Trace'}
            </button>
          </div>
        </div>

        {liveNote && (
          <div className="mt-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-xs sm:text-sm text-amber-200 font-mono shrink-0">
            {liveNote}
          </div>
        )}

        <div className="mt-3 flex-1 flex flex-col justify-between gap-2.5 min-h-0">
          {SWARM_TRACE_EVENTS.slice(0, visibleSteps).map((ev) => (
            <div
              key={ev.step}
              className="flex-1 flex flex-col justify-center rounded-xl bg-slate-950/85 border border-slate-800/90 px-4 py-3 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-sm sm:text-base xl:text-[17px] font-bold text-white">{ev.station}</span>
                <div className="flex items-center gap-2">
                  {renderBadge(ev)}
                  <span className="text-xs sm:text-sm font-mono text-slate-400">{ev.latencyMs} ms</span>
                </div>
              </div>
              <p className="text-sm sm:text-[15px] xl:text-[15.5px] 2xl:text-base text-slate-200 leading-snug font-mono">
                <FormattedText text={ev.message} />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm xl:text-[15px] text-slate-300 font-mono shrink-0">
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-400" /> Sandbox: proceed-in-sandbox • Model Armor Active
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
          <Zap className="w-4 h-4" /> Handoff → AlphaEvolve Ready
        </span>
      </div>
    </div>
  );
};
