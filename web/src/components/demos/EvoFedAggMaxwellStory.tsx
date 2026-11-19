import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  DoorOpen,
  ExternalLink,
  Flame,
  Lock,
  Radio,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

type StoryStage = 'chambers' | 'attacks' | 'gatekeepers';
type GatekeeperKind = 'fedavg' | 'slits' | 'multikrum';

const GATEKEEPERS: Record<
  GatekeeperKind,
  {
    label: string;
    metaphor: string;
    verdictBadge: string;
    verdictColor: string;
    orbValue: string;
    orbSub: string;
    complexity: string;
    shortWhy: string;
  }
> = {
  fedavg: {
    label: 'Naive FedAvg',
    metaphor: 'The Wide-Open Door',
    verdictBadge: 'SHATTERS: 79.1% → 19.1%',
    verdictColor: 'bg-rose-500/20 text-rose-200 border-rose-400/50',
    orbValue: '19.1%',
    orbSub: 'Model Shattered!',
    complexity: 'O(Nd) • Zero Defense',
    shortWhy: 'Averages every particle blindly (9.6% @ 40% rogue).',
  },
  slits: {
    label: 'Median / Trim',
    metaphor: 'The 1D Slit Grating',
    verdictBadge: 'BLIND TO SYBILS & ALIE',
    verdictColor: 'bg-amber-500/20 text-amber-200 border-amber-400/50',
    orbValue: '53.6%',
    orbSub: 'Sybil Drifted!',
    complexity: 'O(Nd) • 1D Axis Only',
    shortWhy: 'Checks 1 axis at a time — Sybils & ALIE slip obliquely.',
  },
  multikrum: {
    label: 'Multi-Krum',
    metaphor: 'The Bottlenecked Demon',
    verdictBadge: 'FREEZES GATEWAY: 17.5 s!',
    verdictColor: 'bg-purple-500/20 text-purple-200 border-purple-400/50',
    orbValue: '17.5 s',
    orbSub: 'Gateway Frozen!',
    complexity: 'O(mN²d) • Greedy Loop',
    shortWhy: 'Re-scores chamber 1-by-1 in a sequential greedy loop.',
  },
};

const FogGatewayDiagram: React.FC<{
  stage: StoryStage;
  gatekeeper: GatekeeperKind;
  compact?: boolean;
}> = ({ stage, gatekeeper, compact = false }) => {
  const showAttacks = stage !== 'chambers';
  const isBrokenOpen = stage === 'gatekeepers' && gatekeeper === 'fedavg';
  const isSlits = stage === 'gatekeepers' && gatekeeper === 'slits';
  const isSlowLoop = stage === 'gatekeepers' && gatekeeper === 'multikrum';
  const activeGk = GATEKEEPERS[gatekeeper];

  const centerBorder =
    stage === 'chambers'
      ? 'border-cyan-400/50'
      : isBrokenOpen
        ? 'border-rose-400/55'
        : isSlits
          ? 'border-amber-400/55'
          : isSlowLoop
            ? 'border-purple-400/55'
            : 'border-emerald-400/50';

  const rightTheme =
    stage === 'chambers'
      ? 'from-emerald-950/85 via-slate-950 to-slate-950 border-emerald-400/50'
      : isBrokenOpen
        ? 'from-rose-950/85 via-slate-950 to-slate-950 border-rose-400/55'
        : isSlits
          ? 'from-amber-950/80 via-slate-950 to-slate-950 border-amber-400/55'
          : isSlowLoop
            ? 'from-purple-950/85 via-slate-950 to-slate-950 border-purple-400/55'
            : 'from-cyan-950/80 via-slate-950 to-slate-950 border-cyan-400/50';

  const vessels = showAttacks
    ? [
        {
          title: 'Honest IoT Swarm',
          sub: 'Private SGD gradients gᵢ →',
          tone: 'bg-slate-950/90 border-cyan-400/45 text-cyan-200',
          dot: 'bg-cyan-400',
        },
        {
          title: 'Gaussian Noise',
          sub: 'Thermal explosion spikes!',
          tone: 'bg-rose-950/55 border-rose-400/55 text-rose-200',
          dot: 'bg-rose-400',
        },
        {
          title: 'Sign-Flipping',
          sub: 'Antimatter (-2× honest)',
          tone: 'bg-purple-950/55 border-purple-400/55 text-purple-200',
          dot: 'bg-purple-400',
        },
        {
          title: 'Colluding Sybils',
          sub: 'Rogue gravity well (+15·1)',
          tone: 'bg-amber-950/55 border-amber-400/55 text-amber-200',
          dot: 'bg-amber-400',
        },
      ]
    : [
        {
          title: 'Sealed IoT Vessel #1',
          sub: 'Raw data locked • sends g₁',
          tone: 'bg-slate-950/90 border-cyan-400/40 text-cyan-100',
          dot: 'bg-cyan-400',
        },
        {
          title: 'Sealed IoT Vessel #2',
          sub: 'Raw data locked • sends g₂',
          tone: 'bg-slate-950/90 border-cyan-400/40 text-cyan-100',
          dot: 'bg-cyan-400',
        },
        {
          title: 'Sealed IoT Vessel #3',
          sub: 'Raw data locked • sends g₃',
          tone: 'bg-slate-950/90 border-cyan-400/40 text-cyan-100',
          dot: 'bg-cyan-400',
        },
        {
          title: 'Sealed IoT Vessel #N',
          sub: 'Raw data locked • sends gₙ',
          tone: 'bg-slate-950/90 border-cyan-400/40 text-cyan-100',
          dot: 'bg-cyan-400',
        },
      ];

  return (
    <div
      className={`w-full h-full flex-1 min-h-0 rounded-2xl bg-[#050915] border border-slate-700/80 grid grid-cols-12 items-stretch select-none ${
        compact ? 'p-2.5 gap-2.5' : 'p-3 sm:p-4 gap-3 sm:gap-3.5'
      }`}
      role="img"
      aria-label="Maxwell Demon at the Fog Gateway showing sealed IoT chambers, Byzantine adversarial particles, and the Cloud Parameter Server"
    >
      {/* LEFT CHAMBER: SEALED EDGE IOT VESSELS */}
      <div
        className={`col-span-4 rounded-xl bg-gradient-to-br from-sky-950/90 via-slate-950 to-slate-950 border border-sky-400/50 flex flex-col justify-between min-h-0 ${
          compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2'
        }`}
      >
        <div className="shrink-0">
          <div className="text-xs sm:text-sm xl:text-base font-mono font-extrabold text-sky-300 tracking-tight">
            {showAttacks ? 'HONEST + ROGUE NODES' : 'SEALED EDGE VESSELS'}
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300">
            {showAttacks ? '3 adversarial entropy attacks' : 'Private data never leaves vessel'}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 py-0.5">
          {vessels.map((v) => (
            <div
              key={v.title}
              className={`flex-1 rounded-lg border px-2.5 py-1.5 flex items-center gap-2 min-h-0 ${v.tone}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${v.dot}`} />
              <div className="min-w-0 leading-tight">
                <div className="text-xs sm:text-[13px] font-mono font-extrabold truncate">{v.title}</div>
                {!compact && (
                  <div className="text-[11px] text-slate-300 font-mono truncate mt-0.5">{v.sub}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="shrink-0 rounded-lg bg-slate-950/90 border border-sky-500/30 px-2.5 py-2 flex items-center justify-between gap-1.5 font-mono">
          <span className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1 truncate">
            <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Telemetry:
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-cyan-200 shrink-0">
            {showAttacks ? 'Up to 40% Rogue' : 'Gradients gᵢ Only'}
          </span>
        </div>
      </div>

      {/* CENTER CHAMBER: FOG GATEWAY TRAPDOOR */}
      <div
        className={`col-span-4 relative rounded-xl bg-[#0b1120] border flex flex-col justify-between min-h-0 ${centerBorder} ${
          compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2'
        }`}
      >
        {/* Glowing Vertical Trapdoor Strip on Right Edge */}
        <div
          className={`absolute right-0 top-6 bottom-6 w-1.5 rounded-full ${
            isBrokenOpen
              ? 'bg-gradient-to-b from-rose-500 via-amber-400 to-rose-500 shadow-[0_0_14px_rgba(251,113,133,0.8)]'
              : isSlits
                ? 'bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_14px_rgba(251,191,36,0.8)]'
                : isSlowLoop
                  ? 'bg-gradient-to-b from-purple-400 via-fuchsia-400 to-purple-500 shadow-[0_0_14px_rgba(192,132,252,0.8)]'
                  : 'bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]'
          }`}
        />

        <div className="shrink-0 text-center">
          <div className="text-xs sm:text-sm xl:text-base font-mono font-extrabold text-cyan-300 tracking-tight">
            FOG GATEWAY
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300 truncate">
            {stage === 'chambers'
              ? 'Maxwell’s Demon Trapdoor'
              : stage === 'attacks'
                ? 'Separating Signal vs Entropy'
                : activeGk.metaphor}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <svg viewBox="0 0 220 170" className="w-full h-full max-h-full">
            <defs>
              <marker id="fgCyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
              </marker>
              <marker id="fgRose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
              </marker>
              <marker id="fgAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
              </marker>
            </defs>

            {isBrokenOpen ? (
              <>
                <rect x="20" y="12" width="180" height="86" rx="10" fill="#4c0519" fillOpacity="0.45" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 4" />
                <text x="110" y="42" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="800" fontFamily="monospace">
                  DOOR WIDE OPEN
                </text>
                <text x="110" y="62" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="monospace">
                  No Demon at the Gate
                </text>
                <text x="110" y="83" textAnchor="middle" fill="#fb7185" fontSize="11.5" fontWeight="800" fontFamily="monospace">
                  All Poison Streams In!
                </text>
                <line x1="10" y1="120" x2="208" y2="120" stroke="#22d3ee" strokeWidth="2.8" markerEnd="url(#fgCyan)" />
                <line x1="10" y1="148" x2="208" y2="148" stroke="#fb7185" strokeWidth="3.4" strokeDasharray="5 3" markerEnd="url(#fgRose)" />
              </>
            ) : isSlits ? (
              <>
                {[36, 66, 96, 126, 156, 186].map((x) => (
                  <line key={x} x1={x} y1="14" x2={x} y2="122" stroke="#fbbf24" strokeWidth="4" strokeOpacity="0.72" />
                ))}
                <line x1="12" y1="36" x2="208" y2="36" stroke="#22d3ee" strokeWidth="2.6" markerEnd="url(#fgCyan)" />
                {/* Oblique Sybil swarm sneaking diagonally through slits */}
                <line x1="12" y1="114" x2="208" y2="62" stroke="#fbbf24" strokeWidth="3.4" strokeDasharray="5 2" markerEnd="url(#fgAmber)" />
                <rect x="20" y="132" width="180" height="26" rx="7" fill="#451a03" stroke="#fbbf24" strokeOpacity="0.8" />
                <text x="110" y="149" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="800" fontFamily="monospace">
                  Sybils Slip Obliquely!
                </text>
              </>
            ) : isSlowLoop ? (
              <>
                <circle cx="110" cy="64" r="44" fill="#3b0764" fillOpacity="0.55" stroke="#c084fc" strokeWidth="3" strokeDasharray="8 4" />
                <text x="110" y="59" textAnchor="middle" fill="#e9d5ff" fontSize="12.5" fontWeight="800" fontFamily="monospace">
                  1-BY-1 LOOP
                </text>
                <text x="110" y="77" textAnchor="middle" fill="#f5d0fe" fontSize="11" fontFamily="monospace">
                  O(m · N² · d)
                </text>
                <rect x="18" y="126" width="184" height="30" rx="7" fill="#3b0764" stroke="#c084fc" strokeOpacity="0.85" />
                <text x="110" y="145" textAnchor="middle" fill="#faf5ff" fontSize="11.5" fontWeight="800" fontFamily="monospace">
                  STALL: 17.5 s / Round!
                </text>
              </>
            ) : (
              <>
                {/* Geometric Maxwell Demon Crest */}
                <polygon points="110,14 142,50 110,78 78,50" fill="#10b981" fillOpacity="0.24" stroke="#34d399" strokeWidth="2.2" />
                <polygon points="90,26 100,10 107,26" fill="#22d3ee" />
                <polygon points="130,26 120,10 113,26" fill="#22d3ee" />
                <circle cx="102" cy="46" r="3.2" fill="#fbbf24" />
                <circle cx="118" cy="46" r="3.2" fill="#fbbf24" />

                <line x1="10" y1="106" x2="208" y2="106" stroke="#22d3ee" strokeWidth="3.2" markerEnd="url(#fgCyan)" />
                {showAttacks ? (
                  <>
                    <line x1="10" y1="136" x2="102" y2="136" stroke="#fb7185" strokeWidth="3" strokeDasharray="5 3" markerEnd="url(#fgRose)" />
                    <line x1="108" y1="124" x2="108" y2="152" stroke="#34d399" strokeWidth="4" />
                    <text x="162" y="141" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="800" fontFamily="monospace">
                      DEFLECTED!
                    </text>
                  </>
                ) : (
                  <>
                    <line x1="10" y1="138" x2="208" y2="138" stroke="#22d3ee" strokeWidth="3.2" markerEnd="url(#fgCyan)" />
                    <text x="110" y="160" textAnchor="middle" fill="#6ee7b7" fontSize="10.5" fontWeight="700" fontFamily="monospace">
                      Pure Momentum Streams Pass
                    </text>
                  </>
                )}
              </>
            )}
          </svg>
        </div>

        <div className="shrink-0 rounded-lg bg-slate-950/90 border border-slate-800 px-2.5 py-2 text-center font-mono text-xs sm:text-sm font-bold text-slate-200 truncate">
          {stage === 'chambers'
            ? '0 Raw Data Ever Exposed'
            : stage === 'attacks'
              ? '3 MITRE ATLAS Attacks'
              : activeGk.complexity}
        </div>
      </div>

      {/* RIGHT CHAMBER: GLOBAL MODEL EQUILIBRIUM */}
      <div
        className={`col-span-4 rounded-xl bg-gradient-to-br border flex flex-col justify-between min-h-0 ${rightTheme} ${
          compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2'
        }`}
      >
        <div className="shrink-0 text-center">
          <div className="text-xs sm:text-sm xl:text-base font-mono font-extrabold text-white tracking-tight">
            GLOBAL MODEL
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300">
            Cloud Parameter Server
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2">
          <svg viewBox="0 0 180 120" className="w-full h-full max-h-full">
            <circle
              cx="90"
              cy="60"
              r="48"
              fill={
                stage === 'chambers'
                  ? '#065f46'
                  : isBrokenOpen
                    ? '#881337'
                    : isSlits
                      ? '#78350f'
                      : isSlowLoop
                        ? '#4c1d95'
                        : '#0f172a'
              }
              fillOpacity="0.72"
              stroke={
                stage === 'chambers'
                  ? '#34d399'
                  : isBrokenOpen
                    ? '#fb7185'
                    : isSlits
                      ? '#fbbf24'
                      : isSlowLoop
                        ? '#c084fc'
                        : '#22d3ee'
              }
              strokeWidth="3"
            />
            <text x="90" y="56" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="800" fontFamily="monospace">
              {stage === 'chambers'
                ? '79.1%'
                : stage === 'attacks'
                  ? 'AT RISK'
                  : activeGk.orbValue}
            </text>
            <text x="90" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="monospace">
              {stage === 'chambers'
                ? 'Clean Equilibrium'
                : stage === 'attacks'
                  ? 'Entropy Surge!'
                  : activeGk.orbSub}
            </text>
          </svg>

          {!compact && (
            <p className="text-xs text-center text-slate-200 leading-snug px-1">
              {stage === 'chambers'
                ? 'Honest directional vectors cool into high-accuracy convergence privately.'
                : stage === 'attacks'
                  ? 'Without an intelligent Demon, rogue entropy shatters global convergence.'
                  : activeGk.shortWhy}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-lg bg-slate-950/90 border border-emerald-500/35 px-2.5 py-2 text-center font-mono text-xs sm:text-sm font-extrabold text-emerald-300 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {stage === 'chambers' ? 'Privacy Preserved ✓' : 'Next → Evolve with AlphaEvolve!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const EvoFedAggMaxwellStoryWidget: React.FC<{ staticPrint?: boolean }> = ({
  staticPrint = false,
}) => {
  const [stage, setStage] = useState<StoryStage>('gatekeepers');
  const [gatekeeper, setGatekeeper] = useState<GatekeeperKind>('fedavg');

  if (staticPrint) {
    return (
      <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-cyan-500/35 p-4 gap-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 shrink-0">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" /> Maxwell’s Demon at the Fog Gateway — Setup &amp; Failure Modes
          </span>
          <a
            href="https://ccnc2027.ieee-ccnc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40 inline-flex items-center gap-1"
          >
            IEEE CCNC 2027 • DOI after conference <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <FogGatewayDiagram stage="attacks" gatekeeper="fedavg" compact />

        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          <div className="rounded-xl bg-rose-950/30 border border-rose-500/35 p-2.5">
            <div className="text-xs font-mono font-bold text-rose-300 uppercase">1. FedAvg (Wide-Open)</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              No gatekeeper: Gaussian noise collapses accuracy <strong>79.1% → 19.1%</strong> (<strong>9.6%</strong> @ 40%).
            </p>
          </div>
          <div className="rounded-xl bg-amber-950/30 border border-amber-500/35 p-2.5">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase">2. Median / Trim (1D Slits)</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              Fast 1D axis filters, blind to multi-D geometry — <strong>Colluding Sybils</strong> &amp; <strong>ALIE</strong> slip in.
            </p>
          </div>
          <div className="rounded-xl bg-purple-950/30 border border-purple-500/35 p-2.5">
            <div className="text-xs font-mono font-bold text-purple-300 uppercase">3. Multi-Krum (Slow Loop)</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              Greedy 1-by-1 spatial loop freezes the edge gateway for <strong>17.5 seconds</strong> at <strong>N=200</strong>!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeGk = GATEKEEPERS[gatekeeper];

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/80 border border-cyan-500/35 p-4 xl:p-5 shadow-xl gap-2.5">
      {/* Top 3-Act Story Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'chambers', label: '1. Sealed FL Chambers', icon: Lock, pulse: 1 },
              { id: 'attacks', label: '2. Byzantine Entropy', icon: Flame, pulse: 2 },
              { id: 'gatekeepers', label: '3. Why Demons Fail', icon: ShieldAlert, pulse: 3 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = stage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStage(tab.id);
                  soundEngine.playEvolutionPulse(tab.pulse);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition border ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400/60 shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <a
          href="https://ccnc2027.ieee-ccnc.org/"
          target="_blank"
          rel="noopener noreferrer"
          title="IEEE CCNC 2027 — DOI will be obtained after the conference"
          className="text-xs font-mono text-emerald-300 hover:text-emerald-200 font-semibold hidden sm:inline-flex items-center gap-1 underline decoration-emerald-400/45 underline-offset-2 transition"
        >
          IEEE CCNC 2027 (DOI after conference) <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Sub-control bar when on Tab 3 (Choose which Broken Gatekeeper to inspect) */}
      {stage === 'gatekeepers' && (
        <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 flex-wrap">
            {(
              [
                { id: 'fedavg', label: 'FedAvg (Open Door)', icon: DoorOpen },
                { id: 'slits', label: 'Median/Trim (1D Slits)', icon: AlertTriangle },
                { id: 'multikrum', label: 'Multi-Krum (17.5s Loop)', icon: Clock },
              ] as const
            ).map((btn) => {
              const Icon = btn.icon;
              const selected = gatekeeper === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => {
                    setGatekeeper(btn.id);
                    soundEngine.playEvolutionPulse(2);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-mono font-bold transition ${
                    selected
                      ? btn.id === 'fedavg'
                        ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50'
                        : btn.id === 'slits'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50'
                          : 'bg-purple-500/25 text-purple-200 border border-purple-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {btn.label}
                </button>
              );
            })}
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${activeGk.verdictColor}`}>
            {activeGk.verdictBadge}
          </span>
        </div>
      )}

      {/* Full-Bleed Visual Fog Gateway Diagram Filling 100% of Remaining Box */}
      <div className="flex-1 min-h-0 w-full flex flex-col">
        <FogGatewayDiagram stage={stage} gatekeeper={gatekeeper} />
      </div>
    </div>
  );
};
