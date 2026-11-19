import React, { useState } from 'react';
import { BookOpen, CheckCircle2, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { AGI_MATRIX_CELLS } from '../../data/demoTraces';
import { FormattedText } from '../FormattedText';

export const LemArchetypeExplorer: React.FC = () => {
  const [selected, setSelected] = useState<'golem' | 'solaris'>('golem');

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-cyan-500/30 p-5 xl:p-6 gap-4">
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Stanisław Lem’s Two AGI Horizons
          </span>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setSelected('golem')}
              className={`px-3.5 py-1.5 rounded-lg text-sm xl:text-base font-semibold transition ${
                selected === 'golem'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Golem XIV (2027!)
            </button>
            <button
              type="button"
              onClick={() => setSelected('solaris')}
              className={`px-3.5 py-1.5 rounded-lg text-sm xl:text-base font-semibold transition ${
                selected === 'solaris'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Solaris (1961)
            </button>
          </div>
        </div>

        {selected === 'golem' ? (
          <div className="flex-1 flex flex-col justify-between rounded-xl bg-emerald-950/25 border border-emerald-500/35 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg sm:text-xl xl:text-2xl font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 shrink-0" /> Archetype A: Golem XIV — Dialogic Autoevolution
              </h4>
              <span className="text-xs sm:text-sm font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/35">
                Foreword Dated: 2027
              </span>
            </div>
            <p className="text-base sm:text-[1.06rem] xl:text-[1.18rem] text-slate-100 leading-relaxed">
              In Lem’s <em>Golem XIV</em>, Irving T. Creve’s foreword is dated <strong>2027</strong> — next year! Built as an optimization engine, Golem enters{' '}
              <strong>autoevolution</strong>, rewriting its own logic while pausing to converse with humanity in crystal-clear symbolic lectures (<em>"On Man Threefold"</em>).
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                <div className="text-sm sm:text-base xl:text-lg text-emerald-300 font-bold">Shared Protocol Window</div>
                <div className="text-sm xl:text-[15.5px] text-slate-200 mt-1 leading-snug">Outputs human-readable code diffs, proofs, and MCP/A2A messages.</div>
              </div>
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                <div className="text-sm sm:text-base xl:text-lg text-cyan-300 font-bold">2026–2027 Realization</div>
                <div className="text-sm xl:text-[15.5px] text-slate-200 mt-1 leading-snug">
                  <FormattedText text="Antigravity + AlphaEvolve `# EVOLVE-BLOCK` + provable Evo-FedAgg code." />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between rounded-xl bg-rose-950/25 border border-rose-500/35 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg sm:text-xl xl:text-2xl font-bold text-rose-300 flex items-center gap-2">
                <EyeOff className="w-5 h-5 shrink-0" /> Archetype B: Solaris — The Inscrutable Black Box
              </h4>
              <span className="text-xs sm:text-sm font-mono font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/35">
                Zero Shared Logos
              </span>
            </div>
            <p className="text-base sm:text-[1.06rem] xl:text-[1.18rem] text-slate-100 leading-relaxed">
              Lem’s sentient planetary ocean stabilizes binary star orbits (superhuman physics mastery!), yet shares{' '}
              <strong>no language, no modular tool boundary, and no inspectable equations</strong>. Decades of human science fail to verify its intent.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                <div className="text-sm sm:text-base xl:text-lg text-rose-300 font-bold">Architectural Failure Mode</div>
                <div className="text-sm xl:text-[15.5px] text-slate-200 mt-1 leading-snug">Unverified black-box neural weights mutating without interpretable invariants.</div>
              </div>
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                <div className="text-sm sm:text-base xl:text-lg text-amber-300 font-bold">How We Prevent It</div>
                <div className="text-sm xl:text-[15.5px] text-slate-200 mt-1 leading-snug">Deterministic verifiers, readable Pallas/Python code &amp; Model Armor gates.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 flex items-center justify-between text-sm sm:text-base xl:text-[1.06rem]">
        <span className="text-slate-200 font-mono leading-snug">
          "Intelligence was biology’s emergency patch; <strong className="text-cyan-300">autoevolution</strong> is engineering’s deliberate horizon."
        </span>
        <span className="text-slate-400 font-mono shrink-0 ml-3 font-semibold">— Golem XIV</span>
      </div>
    </div>
  );
};

export const AgiLevelsMatrixWidget: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(3);
  const active = AGI_MATRIX_CELLS[activeIdx];

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-purple-500/30 p-5 xl:p-6 gap-3">
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-purple-300">
            DeepMind Levels of AGI × Autonomy (Click Row)
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold text-emerald-300">Morris et al. + Evolution Axis</span>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-2.5">
          {AGI_MATRIX_CELLS.map((row, idx) => {
            const isSel = idx === activeIdx;
            return (
              <button
                key={row.level}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`flex-1 w-full text-left rounded-xl px-4 py-3 border transition flex items-center justify-between gap-3 ${
                  isSel
                    ? 'bg-purple-950/40 border-purple-400/60 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-base xl:text-lg font-bold text-white">{row.level}</div>
                  <div className="text-xs sm:text-sm xl:text-[15px] text-slate-300 mt-0.5">{row.generalSystem}</div>
                </div>
                <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {row.autonomyTier}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-emerald-500/35 p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm sm:text-base xl:text-lg font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> {active.level} ({active.percentile})
          </span>
          <span className="text-xs sm:text-sm font-mono text-slate-300">Narrow Ref: {active.narrowExample}</span>
        </div>
        <p className="text-sm sm:text-base xl:text-[1.05rem] text-slate-200 flex items-start gap-2 pt-0.5 leading-snug">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <span>{active.missingForNext}</span>
        </p>
      </div>
    </div>
  );
};
