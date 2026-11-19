import React, { useState } from 'react';
import { Award, BarChart3, Cpu, ExternalLink, GitBranch, Play, ShieldCheck, XCircle, Zap } from 'lucide-react';
import ccncDataset from '../../data/evofedagg_ccnc2027.json';
import { EvoFedAggGeneration } from '../../types/presentation';
import { soundEngine } from '../../utils/soundEngine';
import { FormattedText } from '../FormattedText';

const TRAJECTORY = ccncDataset.trajectory as EvoFedAggGeneration[];

const DEMON_PERSONA: Record<string, { label: string; style: string }> = {
  G0: {
    label: 'Wide-Open Door',
    style: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
  },
  G1: {
    label: '1D Slit Grating',
    style: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40',
  },
  G2: {
    label: 'Soft Gravity Well',
    style: 'bg-purple-500/15 text-purple-200 border-purple-400/40',
  },
  G3: {
    label: 'Relativistic BLAS Demon',
    style: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50',
  },
  G4: {
    label: 'Over-Eager Gatekeeper',
    style: 'bg-rose-500/20 text-rose-200 border-rose-400/50',
  },
};

const PAPER_ATTACK_ROWS = [
  { attack: 'Clean (No Attack)', fedAvg: '79.1%', mk: '77.8%', evo: '76.7%', note: 'Within 2.4% of FedAvg (+25.9% vs Krum)' },
  { attack: 'Gaussian (Thermal)', fedAvg: '19.1%', mk: '22.8%', evo: '68.4%', note: 'Best — FedAvg & Multi-Krum collapse' },
  { attack: 'Sign-Flip (Antimatter)', fedAvg: '35.9%', mk: '68.4%', evo: '68.4%', note: 'Ties Multi-Krum in 1 vectorized pass' },
  { attack: 'Sybil (Gravity Well)', fedAvg: '69.8%*', mk: '68.6%', evo: '69.6%', note: 'Leads all defenses (Median drops to 53.6%)' },
  { attack: 'ALIE (Unseen 0-Shot)', fedAvg: '71.6%', mk: '72.1%', evo: '71.8%', note: 'Generalizes zero-shot without re-evolving' },
  { attack: 'Label-Flip (Unseen)', fedAvg: '62.2%', mk: '61.2%', evo: '66.2%', note: 'Benchmark-best zero-shot generalization!' },
  { attack: 'Sign-Flip 40% Rogue', fedAvg: '9.6%', mk: '68.2%', evo: '68.2%', note: 'Resists 40% compromised chamber' },
];

export const EvoFedAggCcncDemo: React.FC<{ staticPrint?: boolean }> = ({ staticPrint = false }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(3); // Default to G3 Champion!
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'evolution' | 'paper'>('evolution');

  const current = TRAJECTORY[selectedIdx];
  const persona = DEMON_PERSONA[current.gen] ?? DEMON_PERSONA.G3;
  const activeView = staticPrint ? 'evolution' : viewMode;

  const autoPlay = async () => {
    setViewMode('evolution');
    setIsAutoPlaying(true);
    for (let i = 0; i < TRAJECTORY.length; i++) {
      setSelectedIdx(i);
      soundEngine.playEvolutionPulse(TRAJECTORY[i].status === 'rejected' ? 0.5 : i + 1);
      await new Promise((r) => setTimeout(r, 850));
    }
    setIsAutoPlaying(false);
  };

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-emerald-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {TRAJECTORY.map((item, idx) => {
              const isChamp = item.status === 'champion';
              const isRej = item.status === 'rejected';
              const active = activeView === 'evolution' && selectedIdx === idx;
              return (
                <button
                  key={item.gen}
                  type="button"
                  onClick={() => {
                    setViewMode('evolution');
                    setSelectedIdx(idx);
                    soundEngine.playEvolutionPulse(isRej ? 0.5 : idx + 1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold transition border ${
                    active
                      ? isRej
                        ? 'bg-rose-500/25 text-rose-200 border-rose-400/60'
                        : 'bg-emerald-500/25 text-emerald-200 border-emerald-400/60'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  {item.gen}
                  {isChamp ? ' ★' : isRej ? ' ✗' : ''}
                </button>
              );
            })}

            {!staticPrint && (
              <button
                type="button"
                onClick={() => {
                  setViewMode((m) => (m === 'paper' ? 'evolution' : 'paper'));
                  soundEngine.playEvolutionPulse(3);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold transition border ${
                  activeView === 'paper'
                    ? 'bg-purple-500/25 text-purple-200 border-purple-400/60'
                    : 'bg-slate-950 text-cyan-300 border-cyan-500/35 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {activeView === 'paper' ? 'Back to G0→G4' : '0-Shot & Scale'}
              </button>
            )}
          </div>

          {!staticPrint && (
            <button
              type="button"
              onClick={autoPlay}
              disabled={isAutoPlaying}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isAutoPlaying ? 'Evolving G0→G4...' : 'Replay Evolution'}
            </button>
          )}
        </div>

        {activeView === 'evolution' ? (
          <>
            {/* Metrics Strip (Exact IEEE CCNC 2027 Table I & III) */}
            <div className="grid grid-cols-4 gap-2.5 my-2.5 shrink-0">
              <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
                <div className="text-xs sm:text-[13px] font-mono text-slate-300">Fitness S (Eq. 1)</div>
                <div
                  className={`text-base sm:text-lg xl:text-2xl font-extrabold font-mono mt-0.5 ${
                    current.status === 'champion'
                      ? 'text-emerald-300'
                      : current.status === 'rejected'
                        ? 'text-rose-400'
                        : 'text-cyan-300'
                  }`}
                >
                  {current.fitnessScore.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
                <div className="text-xs sm:text-[13px] font-mono text-slate-300">Entropy Blocked</div>
                <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">
                  {current.mitigationPct.toFixed(2)}%
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
                <div className="text-xs sm:text-[13px] font-mono text-slate-300">Gauss MNIST Acc</div>
                <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-cyan-300 mt-0.5">
                  {current.mnistGaussAccPct.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
                <div className="text-xs sm:text-[13px] font-mono text-slate-300">Snapshot Latency</div>
                <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-purple-300 mt-0.5">
                  {current.latencyMs.toFixed(2)} ms
                </div>
              </div>
            </div>

            {/* Split: Non-Monotonic Fitness Trajectory SVG + Evolved Code */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-0">
              <div className="lg:col-span-5 xl:col-span-4 rounded-xl bg-slate-950/90 border border-slate-800 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono text-slate-200 mb-1">
                  <span className="font-semibold">Trajectory (G0 → G4)</span>
                  <a
                    href="https://ccnc2027.ieee-ccnc.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="IEEE CCNC 2027 — DOI will be obtained after the conference"
                    className="text-emerald-300 hover:text-emerald-200 font-bold inline-flex items-center gap-1 underline decoration-emerald-400/45 underline-offset-2"
                  >
                    CCNC 2027 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <svg viewBox="0 0 245 150" className="w-full h-auto my-auto overflow-visible">
                  <line x1="28" y1="18" x2="28" y2="122" stroke="#475569" strokeWidth="1.2" />
                  <line x1="28" y1="122" x2="232" y2="122" stroke="#475569" strokeWidth="1.2" />
                  <text x="132" y="142" fill="#cbd5e1" fontSize="10.5" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                    Evolutionary Generation →
                  </text>
                  <text
                    x="11"
                    y="70"
                    fill="#cbd5e1"
                    fontSize="10.5"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="monospace"
                    transform="rotate(-90 11 70)"
                  >
                    Fitness S →
                  </text>

                  {/* Accepted climb G0 -> G3 */}
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.4"
                    points={TRAJECTORY.slice(0, 4)
                      .map((g, idx) => {
                        const x = 44 + idx * 45;
                        const y = 116 - (g.fitnessScore / 125) * 86;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {/* Rejected branch G3 -> G4 */}
                  <line
                    x1={44 + 3 * 45}
                    y1={116 - (TRAJECTORY[3].fitnessScore / 125) * 86}
                    x2={44 + 4 * 45}
                    y2={116 - (TRAJECTORY[4].fitnessScore / 125) * 86}
                    stroke="#fb7185"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {TRAJECTORY.map((g, idx) => {
                    const x = 44 + idx * 45;
                    const y = 116 - (g.fitnessScore / 125) * 86;
                    const active = idx === selectedIdx;
                    const dotColor =
                      g.status === 'champion'
                        ? '#34d399'
                        : g.status === 'rejected'
                          ? '#fb7185'
                          : idx === 0
                            ? '#fbbf24'
                            : '#22d3ee';
                    return (
                      <g key={g.gen} className="cursor-pointer" onClick={() => setSelectedIdx(idx)}>
                        {active && <circle cx={x} cy={y} r="10.5" fill="rgba(52, 211, 153, 0.24)" />}
                        <circle cx={x} cy={y} r={active ? 5.8 : 4.4} fill={dotColor} stroke="#0f172a" strokeWidth="1.4" />
                        <text
                          x={x}
                          y={y - 9}
                          textAnchor="middle"
                          fill={active ? '#ffffff' : '#cbd5e1'}
                          fontSize="9.5"
                          fontWeight={active ? '700' : '600'}
                          fontFamily="monospace"
                        >
                          {g.gen} ({g.fitnessScore.toFixed(0)})
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="text-xs font-mono text-slate-300 pt-1.5 flex items-center justify-between gap-1">
                  <span>1.02s vs 17.52s</span>
                  <span className="text-emerald-300 font-bold">17.2× • $0 LLM</span>
                </div>
              </div>

              <div className="lg:col-span-7 xl:col-span-8 rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex flex-col justify-between min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-mono mb-2">
                  <span className="text-emerald-300 flex items-center gap-1.5 font-bold truncate">
                    <GitBranch className="w-4 h-4 shrink-0" /> {current.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] sm:text-xs font-bold ${persona.style}`}>
                      {persona.label}
                    </span>
                    {current.status === 'champion' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] sm:text-xs">
                        <Award className="w-3.5 h-3.5" /> Champion
                      </span>
                    ) : current.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-400/40 text-[11px] sm:text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    ) : null}
                  </div>
                </div>
                <pre className="flex-1 text-xs sm:text-[13px] xl:text-[13.5px] leading-relaxed font-mono text-slate-100 whitespace-pre-wrap break-words">
                  {current.code}
                </pre>
              </div>
            </div>
          </>
        ) : (
          /* Optional Paper Proof View: Table II (Zero-Shot & 40%) + Table III (Gateway Scaling) */
          <div className="flex-1 flex flex-col justify-between gap-2.5 mt-2.5 min-h-0">
            <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 pb-1.5 border-b border-slate-800">
                <span>Table II — Non-IID MNIST Accuracy (Zero-Shot &amp; 40% Rogue)</span>
                <a
                  href="https://ccnc2027.ieee-ccnc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 normal-case underline decoration-emerald-400/45 underline-offset-2"
                >
                  IEEE CCNC 2027 (DOI after conference) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-12 text-[11px] font-mono text-slate-400 pt-1">
                <div className="col-span-4">Attack Scenario</div>
                <div className="col-span-2 text-right">FedAvg</div>
                <div className="col-span-2 text-right">Multi-Krum</div>
                <div className="col-span-2 text-right text-emerald-300 font-bold">Evo Top-K</div>
                <div className="col-span-2 text-right">Verdict</div>
              </div>
              <div className="flex-1 flex flex-col justify-between gap-1 mt-1">
                {PAPER_ATTACK_ROWS.map((row) => (
                  <div
                    key={row.attack}
                    className="grid grid-cols-12 items-center text-xs font-mono rounded-lg bg-slate-900/70 px-2 py-1 border border-slate-800/70"
                  >
                    <div className="col-span-4 text-slate-100 font-semibold truncate">{row.attack}</div>
                    <div className="col-span-2 text-right text-rose-300">{row.fedAvg}</div>
                    <div className="col-span-2 text-right text-slate-300">{row.mk}</div>
                    <div className="col-span-2 text-right text-emerald-300 font-extrabold">{row.evo}</div>
                    <div className="col-span-2 text-right text-[10px] text-cyan-300 truncate">
                      {row.attack.includes('Unseen') ? '0-Shot ✓' : row.attack.includes('40%') ? '40% ✓' : 'Solid ✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <div className="rounded-xl bg-purple-950/30 border border-purple-500/35 p-3">
                <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Table III: N=200 Gateway Scaling
                </div>
                <div className="text-sm sm:text-base font-extrabold font-mono text-white mt-1">
                  1.02 s <span className="text-xs font-normal text-slate-300">vs 17.52 s Multi-Krum</span>{' '}
                  <span className="text-emerald-300">(17.2×)</span>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/35 p-3">
                <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Edge Runtime (Raspberry Pi 4)
                </div>
                <div className="text-sm sm:text-base font-extrabold font-mono text-white mt-1">
                  8.4 ms <span className="text-xs font-normal text-slate-300">(&lt;45 MB RAM •</span>{' '}
                  <span className="text-cyan-300">$0 LLM</span>
                  <span className="text-xs font-normal text-slate-300">)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={`rounded-xl border px-4 py-2.5 text-sm sm:text-[15px] text-slate-100 flex items-start gap-2.5 leading-snug shrink-0 ${
          current.status === 'rejected'
            ? 'bg-rose-950/35 border-rose-500/35'
            : 'bg-emerald-950/35 border-emerald-500/30'
        }`}
      >
        <ShieldCheck
          className={`w-5 h-5 shrink-0 mt-0.5 ${
            current.status === 'rejected' ? 'text-rose-400' : 'text-emerald-400'
          }`}
        />
        <div className="flex-1 min-w-0">
          <FormattedText text={current.summary} />
          <div className="mt-1 text-xs font-mono text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <a
              href="https://ccnc2027.ieee-ccnc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 underline decoration-cyan-400/45 underline-offset-2"
            >
              IEEE CCNC 2027 Conference <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-500">•</span>
            <span>DOI will be obtained after the conference.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
