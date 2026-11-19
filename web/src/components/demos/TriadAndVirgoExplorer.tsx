import React, { useState } from 'react';
import {
  Cpu,
  GitBranch,
  Layers,
  MessageSquare,
  Network,
  Orbit,
  Sparkles,
  Wrench,
} from 'lucide-react';

type ExplorerTab = 'virgo' | 'ascent';
type CosmicPreset = 'googol' | 'andromeda' | 'virgo';

interface ComparisonRow {
  feature: string;
  andromeda: string;
  virgo: string;
}

const ANDROMEDA_VS_VIRGO: ComparisonRow[] = [
  {
    feature: 'Primary Era',
    andromeda: 'Cloud Era (introduced in 2014)',
    virgo: 'AI Era (unveiled in 2026)',
  },
  {
    feature: 'Core Purpose',
    andromeda: 'Multi-tenant cloud virtualization and tenant isolation',
    virgo: 'Scale-out AI accelerator connectivity and massive data movement',
  },
  {
    feature: 'Architecture Type',
    andromeda: 'Software-defined networking (SDN) and packet encapsulation',
    virgo: 'Flat, two-layer physical switching fabric with multi-planar design',
  },
  {
    feature: 'Target Hardware',
    andromeda: 'Virtual Machines (VMs), standard CPUs, and cloud storage',
    virgo: 'AI accelerators, specifically eighth-generation TPU 8t chips',
  },
  {
    feature: 'Scale & Bandwidth',
    andromeda: 'Up to 100,000 VMs per virtual network',
    virgo: 'Up to 134,000 TPU chips with 47 petabits/sec bandwidth',
  },
];

interface AscentStage {
  id: string;
  step: string;
  figure: string;
  era: string;
  archetype: string;
  systemTier: string;
  quote: string;
  modernMapping: string;
  explanation: string;
  accent: 'cyan' | 'amber' | 'purple' | 'emerald';
}

const ASCENT_STAGES: AscentStage[] = [
  {
    id: 'socrates',
    step: '01',
    figure: 'Socrates',
    era: '~470–399 BCE',
    archetype: 'Homo Loquens • Dialogue',
    systemTier: 'System 1 • Frontier LLMs',
    quote: '“Wonder is the beginning of wisdom.”',
    modernMapping: 'Conversational LLMs (Gemini)',
    explanation:
      'Socratic dialogue unlocked collective reasoning through language. Modern LLMs master fluent statistical conversation — yet dialogue alone cannot test hypotheses against physical or mathematical reality.',
    accent: 'cyan',
  },
  {
    id: 'galileo',
    step: '02',
    figure: 'Galileo Galilei',
    era: '1564–1642',
    archetype: 'Homo Faber • Empirical Tools',
    systemTier: 'System 2 • Antigravity Agents',
    quote: '“Measure what is measurable, and make measurable what is not so.”',
    modernMapping: 'Antigravity 2.0 • MCP Tools & Sandboxes',
    explanation:
      'Galileo pointed an engineered lens at Jupiter’s moons and grounded reason in repeatable instruments. Tool-using agents automate known engineering playbooks via MCP servers, CLIs, and tests.',
    accent: 'amber',
  },
  {
    id: 'lovelace',
    step: '03',
    figure: 'Ada Lovelace',
    era: 'Note G • 1843',
    archetype: 'The Origin Barrier',
    systemTier: 'Limits of Static Programs',
    quote: '“The Analytical Engine has no pretensions whatever to originate anything.”',
    modernMapping: 'The Challenge Before Evolutionary AI',
    explanation:
      'In 1843, Ada Lovelace foresaw general symbolic computing — and posed the sharpest objection in AI history: can a machine ever originate algorithms its human programmers did not already know?',
    accent: 'purple',
  },
  {
    id: 'virgo-agi',
    step: '04',
    figure: 'Turing → Multi-Agent Virgo',
    era: '1950 → 2026+ AGI Horizon',
    archetype: 'Homo Evolvens • Verified Surprise',
    systemTier: 'System 3 • AlphaEvolve @ Virgo',
    quote: '“Machines take me by surprise with great frequency.” — Alan Turing (1950)',
    modernMapping: 'AlphaEvolve + 134,000 TPU 8t Chips (47 Pb/s)',
    explanation:
      'Turing directly answered Lady Lovelace’s Objection: verified evolutionary search mutates executable code across islands and selects real breakthroughs — scaling toward Artificial General Intelligence on Google’s Virgo fabric.',
    accent: 'emerald',
  },
];

const ACCENT_STYLES: Record<
  AscentStage['accent'],
  { border: string; bg: string; text: string; pill: string }
> = {
  cyan: {
    border: 'border-cyan-400/50',
    bg: 'bg-cyan-950/30',
    text: 'text-cyan-300',
    pill: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  },
  amber: {
    border: 'border-amber-400/50',
    bg: 'bg-amber-950/30',
    text: 'text-amber-300',
    pill: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  },
  purple: {
    border: 'border-purple-400/50',
    bg: 'bg-purple-950/30',
    text: 'text-purple-300',
    pill: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  },
  emerald: {
    border: 'border-emerald-400/55',
    bg: 'bg-emerald-950/30',
    text: 'text-emerald-300',
    pill: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/45',
  },
};

/**
 * Full-height interactive Slide 4 explorer contrasting Google's cosmic naming
 * progression (Googol 10^100 -> Andromeda SDN -> Virgo Network 47 Pb/s fabric)
 * alongside the intellectual ascent from Socrates, Galileo, and Ada Lovelace
 * toward Multi-Agent Evolutionary AGI.
 */
export const TriadAndVirgoExplorer: React.FC<{ staticPrint?: boolean }> = ({
  staticPrint = false,
}) => {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('virgo');
  const [cosmicPreset, setCosmicPreset] = useState<CosmicPreset>('virgo');
  const [selectedRow, setSelectedRow] = useState<number>(4);
  const [ascentIdx, setAscentIdx] = useState<number>(3);

  const stage = ASCENT_STAGES[ascentIdx];
  const stageStyle = ACCENT_STYLES[stage.accent];

  return (
    <div className="flex flex-col justify-between h-full w-full rounded-2xl bg-slate-900/80 border border-cyan-500/35 p-4 xl:p-5 shadow-2xl gap-3 min-h-0">
      {/* Top Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950/90 p-1 border border-slate-800">
          <button
            type="button"
            disabled={staticPrint}
            onClick={() => setActiveTab('virgo')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm xl:text-[15px] font-mono font-semibold transition ${
              activeTab === 'virgo'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Orbit className="w-4 h-4" />
            Google Scale: Googol → Andromeda → Virgo
          </button>
          <button
            type="button"
            disabled={staticPrint}
            onClick={() => setActiveTab('ascent')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm xl:text-[15px] font-mono font-semibold transition ${
              activeTab === 'ascent'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Socrates → Galileo → Lovelace → AGI
          </button>
        </div>

        <span className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs xl:text-sm font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
          <Network className="w-4 h-4" />
          Virgo Cluster (~2,000 Galaxies)
        </span>
      </div>

      {activeTab === 'virgo' ? (
        <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
          {/* Interactive Cosmic Naming Cards (Googol 10^100 -> Andromeda -> Virgo) */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <button
              type="button"
              disabled={staticPrint}
              onClick={() => setCosmicPreset('googol')}
              className={`text-left rounded-xl p-3 border transition ${
                cosmicPreset === 'googol'
                  ? 'bg-amber-950/35 border-amber-400/70 shadow-[0_0_20px_rgba(251,191,36,0.18)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs sm:text-[13px] xl:text-sm text-amber-300 mb-1">
                <span>1998 • Origin</span>
                <span className="font-bold">10¹⁰⁰</span>
              </div>
              <div className="text-base xl:text-lg 2xl:text-xl font-bold text-white">Googol</div>
              <p className="text-xs sm:text-sm xl:text-[15px] text-slate-200 mt-0.5 leading-snug">
                1 followed by 100 zeros — organizing the universe of information.
              </p>
            </button>

            <button
              type="button"
              disabled={staticPrint}
              onClick={() => setCosmicPreset('andromeda')}
              className={`text-left rounded-xl p-3 border transition ${
                cosmicPreset === 'andromeda'
                  ? 'bg-cyan-950/35 border-cyan-400/70 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-400/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs sm:text-[13px] xl:text-sm text-cyan-300 mb-1">
                <span>2014 • 1 Galaxy</span>
                <span className="font-bold">SDN</span>
              </div>
              <div className="text-base xl:text-lg 2xl:text-xl font-bold text-white">Andromeda</div>
              <p className="text-xs sm:text-sm xl:text-[15px] text-slate-200 mt-0.5 leading-snug">
                Cloud SDN stack — virtualized isolation up to 100k VMs.
              </p>
            </button>

            <button
              type="button"
              disabled={staticPrint}
              onClick={() => setCosmicPreset('virgo')}
              className={`text-left rounded-xl p-3 border transition ${
                cosmicPreset === 'virgo'
                  ? 'bg-purple-950/40 border-purple-400/75 shadow-[0_0_22px_rgba(192,132,252,0.24)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-purple-400/45'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs sm:text-[13px] xl:text-sm text-purple-300 mb-1">
                <span>2026 • ~2k Galaxies</span>
                <span className="font-bold text-emerald-300">47 Pb/s</span>
              </div>
              <div className="text-base xl:text-lg 2xl:text-xl font-bold text-white">Virgo Network</div>
              <p className="text-xs sm:text-sm xl:text-[15px] text-slate-100 mt-0.5 leading-snug">
                Flat 2-layer physical AI fabric linking 134,000 TPU 8t chips.
              </p>
            </button>
          </div>

          {/* Interactive Architectural Context Banner based on Selected Cosmic Preset */}
          <div
            className={`rounded-xl px-4 py-2.5 border text-sm sm:text-base xl:text-[1.05rem] 2xl:text-[1.12rem] leading-snug shrink-0 ${
              cosmicPreset === 'virgo'
                ? 'bg-purple-950/30 border-purple-400/45 text-purple-100'
                : cosmicPreset === 'andromeda'
                  ? 'bg-cyan-950/30 border-cyan-400/45 text-cyan-100'
                  : 'bg-amber-950/25 border-amber-400/45 text-amber-100'
            }`}
          >
            {cosmicPreset === 'googol' && (
              <>
                <strong className="font-mono text-amber-300 mr-1.5">[Cosmic Naming]:</strong>
                From <span className="font-mono text-white">Googol (10¹⁰⁰)</span> to a single neighbor galaxy (<strong>Andromeda</strong>, 2014 Cloud SDN) to the <strong>Virgo Cluster</strong> (~2,000 galaxies → 2026 physical AI superfabric for multi-agent &amp; evolutionary AGI scale).
              </>
            )}
            {cosmicPreset === 'andromeda' && (
              <>
                <strong className="font-mono text-cyan-300 mr-1.5">[Andromeda • Cloud Era]:</strong>
                Software-defined network virtualization &amp; packet encapsulation engineered for multi-tenant VMs, CPUs, and cloud storage (up to <strong>100,000 VMs</strong> per virtual network).
              </>
            )}
            {cosmicPreset === 'virgo' && (
              <>
                <strong className="font-mono text-emerald-300 mr-1.5">[Virgo Network • AI Era]:</strong>
                Flat, two-layer multi-planar physical switching fabric bypassing virtualized bottlenecks — uniting up to <strong>134,000 eighth-gen TPU 8t chips</strong> across <strong>47 petabits/sec</strong> of bandwidth!
              </>
            )}
          </div>

          {/* Full-Height Interactive Comparison Table: Andromeda vs Virgo Network */}
          <div className="flex-1 flex flex-col rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden min-h-0">
            <div className="grid grid-cols-12 bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 font-mono text-xs sm:text-sm xl:text-[15px] font-bold uppercase tracking-wider shrink-0">
              <div className="col-span-3 text-slate-300">Feature</div>
              <div className="col-span-4 text-cyan-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 shrink-0" /> Andromeda
              </div>
              <div className="col-span-5 text-emerald-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 shrink-0" /> Virgo Network
              </div>
            </div>

            <div className="flex-1 flex flex-col divide-y divide-slate-800/80 min-h-0">
              {ANDROMEDA_VS_VIRGO.map((row, idx) => {
                const isSelected = idx === selectedRow && !staticPrint;
                return (
                  <button
                    key={row.feature}
                    type="button"
                    disabled={staticPrint}
                    onClick={() => setSelectedRow(idx)}
                    className={`flex-1 grid grid-cols-12 items-center text-left px-4 py-2 gap-3 transition ${
                      isSelected
                        ? 'bg-purple-500/15'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-xs sm:text-sm xl:text-[15px] font-bold text-slate-100">
                      {row.feature}
                    </div>
                    <div
                      className={`col-span-4 text-sm sm:text-[15px] xl:text-base 2xl:text-[1.06rem] leading-snug ${
                        cosmicPreset === 'andromeda' ? 'text-cyan-100' : 'text-slate-200'
                      }`}
                    >
                      {row.andromeda}
                    </div>
                    <div
                      className={`col-span-5 text-sm sm:text-[15px] xl:text-base 2xl:text-[1.06rem] leading-snug ${
                        cosmicPreset === 'virgo' ? 'text-emerald-100' : 'text-slate-100'
                      }`}
                    >
                      {row.virgo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Interactive 4-Stage Intellectual Ascent (Socrates -> Galileo -> Lovelace -> AGI) */
        <div className="flex-1 flex flex-col justify-between gap-3.5 min-h-0">
          {/* 4-Stage Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            {ASCENT_STAGES.map((s, idx) => {
              const selected = idx === ascentIdx;
              const st = ACCENT_STYLES[s.accent];
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={staticPrint}
                  onClick={() => setAscentIdx(idx)}
                  className={`text-left rounded-xl p-3 border transition ${
                    selected
                      ? `${st.bg} ${st.border} shadow-lg`
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className={`font-mono text-xs sm:text-[13px] xl:text-sm font-bold ${st.text}`}>
                    {s.step} • {s.era}
                  </div>
                  <div className="text-base xl:text-lg font-bold text-white mt-0.5 truncate">
                    {s.figure}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Spotlight Card */}
          <div
            className={`flex-1 flex flex-col justify-between rounded-2xl border p-5 xl:p-6 ${stageStyle.bg} ${stageStyle.border}`}
          >
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 text-base xl:text-lg font-mono font-bold ${stageStyle.text}`}>
                  {stage.accent === 'cyan' && <MessageSquare className="w-5 h-5" />}
                  {stage.accent === 'amber' && <Wrench className="w-5 h-5" />}
                  {stage.accent === 'purple' && <Sparkles className="w-5 h-5" />}
                  {stage.accent === 'emerald' && <GitBranch className="w-5 h-5" />}
                  {stage.archetype}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm xl:text-[15px] font-mono border ${stageStyle.pill}`}>
                  {stage.systemTier}
                </span>
              </div>

              <blockquote className="text-xl sm:text-2xl xl:text-[1.75rem] italic font-normal text-white leading-relaxed border-l-2 border-white/30 pl-4 py-1">
                {stage.quote}
              </blockquote>

              <p className="text-base sm:text-lg xl:text-[1.22rem] font-normal text-slate-100 leading-relaxed">
                {stage.explanation}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-sm xl:text-base">
              <span className="text-slate-300">Modern Architecture Layer:</span>
              <span className={`font-bold ${stageStyle.text}`}>{stage.modernMapping}</span>
            </div>
          </div>

          {/* AGI Composition Formula */}
          <div className="rounded-xl bg-slate-950/95 px-4 py-3 border border-cyan-500/30 font-mono text-sm xl:text-base text-center text-cyan-200 shrink-0">
            AGI Trajectory = Dialogue(Antigravity) ∘ Tools(MCP) ∘ Verify(Mutate(AlphaEvolve)) @ Virgo 47 Pb/s
          </div>
        </div>
      )}
    </div>
  );
};
