import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Brain,
  Code2,
  Cpu,
  DoorClosed,
  DoorOpen,
  Flame,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

type DemonTab = 'lair' | 'species' | 'tricks' | 'spellbook';
type SpellStep = 'kernel' | 'grid' | 'trapdoor';

interface SpeciesTrait {
  trait: string;
  gpuTitle: string;
  gpuDetail: string;
  tpuTitle: string;
  tpuDetail: string;
}

const SPECIES_TRAITS: SpeciesTrait[] = [
  {
    trait: 'Demon Species',
    gpuTitle: 'Swarm of 10,000 Imps (SIMT)',
    gpuDetail: 'Tiny thread-demons moving single molecules in lockstep 32-thread Warps.',
    tpuTitle: 'One Colossal Arch-Demon (SIMD)',
    tpuDetail: 'Wields an 8×128 pitchfork, skewering whole 2D slabs of molecules at once.',
  },
  {
    trait: 'Inner Sanctum',
    gpuTitle: 'Shared Memory (SMEM / L1)',
    gpuDetail: 'Fast block-level scratchpad shared across GPU thread warps.',
    tpuTitle: 'Vector Memory (pltpu.VMEM)',
    tpuDetail: 'Tiny on-core sanctum (~16–32 MB) + Scalar SMEM for tally marks.',
  },
  {
    trait: 'The Furnace',
    gpuTitle: 'Tensor Cores',
    gpuDetail: 'Warp-level matrix engines distributed across streaming multiprocessors.',
    tpuTitle: 'MXU (Systolic Array) & VPU',
    tpuDetail: '128×128 matrix furnace + Vector Unit wired straight to VMEM.',
  },
  {
    trait: 'Trapdoor Magic',
    gpuTitle: 'Async Copy (cp.async / TMA)',
    gpuDetail: 'Hardware tensor memory accelerator streaming tiles from HBM.',
    tpuTitle: 'DMA Engine + Semaphores',
    tpuDetail: 'Demon telepathy signaling the instant a slab arrives in VMEM.',
  },
];

interface CodeLine {
  num: number;
  text: string;
  section?: SpellStep;
}

const MAXWELL_SPELL_LINES: CodeLine[] = [
  { num: 1, text: 'from jax.experimental import pallas as pl' },
  { num: 2, text: '' },
  { num: 3, text: '# 1. THE DEMON\'S INCANTATION (Runs strictly inside VMEM!)', section: 'kernel' },
  { num: 4, text: 'def maxwell_demon_vmem_kernel(gas_ref, threshold_ref, hot_ref):', section: 'kernel' },
  { num: 5, text: '    molecules = gas_ref[...]          # Pull 128×128 slab into VPU', section: 'kernel' },
  { num: 6, text: '    cutoff    = threshold_ref[0]', section: 'kernel' },
  { num: 7, text: '    is_hot    = molecules > cutoff    # Sort all 16,384 at once!', section: 'kernel' },
  { num: 8, text: '    hot_ref[...] = jnp.where(is_hot, molecules * molecules, 0.0)', section: 'kernel' },
  { num: 9, text: '' },
  { num: 10, text: '# 2. THE SUMMONING CIRCLE (Slice 2048×2048 HBM for 256 Demons)', section: 'grid' },
  { num: 11, text: 'def summon_maxwell_demon(gas_cloud, threshold):', section: 'grid' },
  { num: 12, text: '    slab = (128, 128)                 # Divisible by 8×128 TPU SIMD', section: 'grid' },
  { num: 13, text: '    grid = (2048 // 128, 2048 // 128) # 16 × 16 = 256 Demons!', section: 'grid' },
  { num: 14, text: '    return pl.pallas_call(', section: 'trapdoor' },
  { num: 15, text: '        maxwell_demon_vmem_kernel,', section: 'trapdoor' },
  { num: 16, text: '        out_shape=jax.ShapeDtypeStruct(gas_cloud.shape, gas_cloud.dtype),', section: 'trapdoor' },
  { num: 17, text: '        grid=grid,', section: 'grid' },
  { num: 18, text: '        in_specs=[pl.BlockSpec(slab, lambda i, j: (i, j)),', section: 'trapdoor' },
  { num: 19, text: '                  pl.BlockSpec((1,), lambda i, j: (0,))],', section: 'trapdoor' },
  { num: 20, text: '        out_specs=pl.BlockSpec(slab, lambda i, j: (i, j)),', section: 'trapdoor' },
  { num: 21, text: '    )(gas_cloud, threshold)', section: 'trapdoor' },
];

const SPELL_CALLOUTS: Record<SpellStep, { title: string; detail: string; accent: string }> = {
  kernel: {
    title: '1. VMEM Incantation (Zero HBM Leaks)',
    detail:
      'Every comparison & squaring op executes inside VPU registers fed by VMEM — slow molecules freeze to 0, fast ones superheat, and nothing spills back to HBM mid-spell.',
    accent: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30',
  },
  grid: {
    title: '2. Grid of 256 Demons (16 × 16 Slabs)',
    detail:
      'The 2048×2048 HBM cloud is carved into 128×128 slabs aligned to the TPU Arch-Demon’s 8×128 pitchfork so every MXU/VPU lane stays saturated.',
    accent: 'text-purple-300 border-purple-500/40 bg-purple-950/30',
  },
  trapdoor: {
    title: '3. BlockSpec Trapdoor (DMA Rule)',
    detail:
      'pl.BlockSpec tells the DMA Engine exactly which tile (i, j) to teleport from HBM into VMEM — and where to release the finished golden plasma when the trapdoor opens once.',
    accent: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30',
  },
};

const ChamberDiagram: React.FC<{ kernelMode: 'blind' | 'demon'; compact?: boolean }> = ({
  kernelMode,
  compact = false,
}) => {
  const isDemon = kernelMode === 'demon';

  return (
    <div
      className={`w-full h-full flex-1 min-h-0 rounded-2xl bg-[#050915] border border-slate-700/80 grid grid-cols-12 items-stretch select-none ${
        compact ? 'p-2.5 gap-2.5' : 'p-3 sm:p-4 gap-3 sm:gap-3.5'
      }`}
      role="img"
      aria-label={
        isDemon
          ? 'Pallas VMEM Kernel diagram showing Maxwell Demon pulling one 128x128 tile from HBM through DMA trapdoor into VMEM and MXU furnace'
          : 'Blind JAX or PyTorch execution moving full tensors back and forth across HBM three times'
      }
    >
      {/* LEFT CHAMBER: HBM CHAOS CAVERN */}
      <div
        className={`col-span-4 rounded-xl bg-gradient-to-br from-sky-950/90 via-slate-950 to-slate-950 border border-sky-400/50 flex flex-col justify-between min-h-0 ${
          compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2'
        }`}
      >
        <div className="shrink-0">
          <div className="text-xs sm:text-sm xl:text-base font-mono font-extrabold text-sky-300 tracking-tight">
            HBM • CHAOS CAVERN
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300">
            Up to 192 GB • Cold &amp; Far (~500 cyc)
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <svg viewBox="0 0 220 155" className="w-full h-full max-h-full">
            {/* Subtle copper bus traces */}
            <path d="M 8 36 H 130 M 8 78 H 122 M 8 120 H 130" stroke="#0c4a6e" strokeWidth="2" strokeDasharray="4 4" />
            {[
              { cx: 28, cy: 32, r: 7, fill: '#38bdf8', op: 0.8 },
              { cx: 68, cy: 24, r: 5.5, fill: '#60a5fa', op: 0.7 },
              { cx: 104, cy: 42, r: 8, fill: '#fbbf24', op: 0.92 },
              { cx: 44, cy: 68, r: 6.5, fill: '#38bdf8', op: 0.65 },
              { cx: 84, cy: 82, r: 7.5, fill: '#34d399', op: 0.9 },
              { cx: 26, cy: 108, r: 6, fill: '#60a5fa', op: 0.7 },
              { cx: 66, cy: 126, r: 7, fill: '#38bdf8', op: 0.75 },
              { cx: 108, cy: 118, r: 6.5, fill: '#fbbf24', op: 0.88 },
              { cx: 118, cy: 74, r: 6, fill: '#38bdf8', op: 0.75 },
            ].map((dot, idx) => (
              <circle key={idx} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} fillOpacity={dot.op} />
            ))}

            {/* Sliced 128x128 BlockSpec Tile preview in HBM */}
            <rect
              x="134"
              y="36"
              width="78"
              height="82"
              rx="10"
              fill={isDemon ? '#064e3b' : '#4c0519'}
              fillOpacity="0.85"
              stroke={isDemon ? '#34d399' : '#fb7185'}
              strokeWidth="2.4"
              strokeDasharray={isDemon ? 'none' : '5 3'}
            />
            <text x="173" y="73" textAnchor="middle" fill="#f8fafc" fontSize="13.5" fontWeight="800" fontFamily="monospace">
              {isDemon ? '128×128' : 'WHOLE'}
            </text>
            <text
              x="173"
              y="93"
              textAnchor="middle"
              fill={isDemon ? '#6ee7b7' : '#fda4af'}
              fontSize="11.5"
              fontWeight="700"
              fontFamily="monospace"
            >
              {isDemon ? 'Slab' : 'Tensor'}
            </text>
          </svg>
        </div>

        <div className="shrink-0 rounded-lg bg-slate-950/90 border border-sky-500/30 px-2.5 py-2 flex items-center justify-between gap-1.5 font-mono">
          <span className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1 truncate">
            <Snowflake className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Hallway:
          </span>
          <span
            className={`text-xs sm:text-sm font-extrabold shrink-0 ${
              isDemon ? 'text-emerald-300' : 'text-rose-400'
            }`}
          >
            {isDemon ? '1× Slab Load' : '3× Full Hauls'}
          </span>
        </div>
      </div>

      {/* CENTER BARRIER: DMA TRAPDOOR / MEMORY WALL */}
      <div
        className={`col-span-4 relative rounded-xl bg-[#0b1120] border flex flex-col justify-between min-h-0 ${
          isDemon ? 'border-emerald-400/50' : 'border-rose-400/55'
        } ${compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2'}`}
      >
        {/* Glowing Vertical Trapdoor Strip on Right Edge */}
        <div
          className={`absolute right-0 top-6 bottom-6 w-1.5 rounded-full ${
            isDemon
              ? 'bg-gradient-to-b from-emerald-400 via-cyan-400 to-amber-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]'
              : 'bg-gradient-to-b from-rose-500 via-amber-400 to-rose-500 shadow-[0_0_14px_rgba(251,113,133,0.8)]'
          }`}
        />

        <div className="shrink-0 text-center">
          <div
            className={`text-xs sm:text-sm xl:text-base font-mono font-extrabold tracking-tight ${
              isDemon ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {isDemon ? 'DMA TRAPDOOR' : 'MEMORY WALL'}
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300">
            {isDemon ? 'Guarded by Pallas Demon' : 'Blind Thermodynamics'}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <svg viewBox="0 0 220 165" className="w-full h-full max-h-full">
            <defs>
              <marker id="cdArrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
              </marker>
              <marker id="cdArrowGold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
              </marker>
              <marker id="cdArrowRose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
              </marker>
            </defs>

            {isDemon ? (
              <>
                {/* Stylized Geometric Maxwell Demon Crest */}
                <polygon points="110,12 138,44 110,68 82,44" fill="#10b981" fillOpacity="0.24" stroke="#34d399" strokeWidth="2.2" />
                <polygon points="92,22 101,8 107,22" fill="#c084fc" />
                <polygon points="128,22 119,8 113,22" fill="#c084fc" />
                <circle cx="102" cy="41" r="3.2" fill="#fbbf24" />
                <circle cx="118" cy="41" r="3.2" fill="#fbbf24" />
                <text x="110" y="86" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="800" fontFamily="monospace">
                  LOCKED AFTER 1 SLAB
                </text>

                {/* Single clean IN arrow */}
                <line x1="8" y1="112" x2="210" y2="112" stroke="#34d399" strokeWidth="3.4" markerEnd="url(#cdArrowGreen)" />
                <rect x="34" y="96" width="152" height="20" rx="6" fill="#022c22" stroke="#34d399" strokeOpacity="0.7" />
                <text x="110" y="110" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="800" fontFamily="monospace">
                  1× BlockSpec IN
                </text>

                {/* Single clean OUT golden arrow */}
                <line x1="210" y1="146" x2="12" y2="146" stroke="#fbbf24" strokeWidth="3.4" markerEnd="url(#cdArrowGold)" />
                <rect x="30" y="130" width="160" height="20" rx="6" fill="#451a03" stroke="#fbbf24" strokeOpacity="0.7" />
                <text x="110" y="144" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="800" fontFamily="monospace">
                  1× Finished Gold OUT
                </text>
              </>
            ) : (
              <>
                {[
                  { y: 28, label: 'Trip 1: x * w  ⇄ HBM' },
                  { y: 80, label: 'Trip 2: + b    ⇄ HBM' },
                  { y: 132, label: 'Trip 3: gelu() ⇄ HBM' },
                ].map((trip) => (
                  <g key={trip.label}>
                    <line x1="8" y1={trip.y} x2="210" y2={trip.y} stroke="#fb7185" strokeWidth="2.8" strokeDasharray="5 3" markerEnd="url(#cdArrowRose)" />
                    <line x1="210" y1={trip.y + 16} x2="12" y2={trip.y + 16} stroke="#f59e0b" strokeWidth="2.8" strokeDasharray="5 3" markerEnd="url(#cdArrowGold)" />
                    <rect x="24" y={trip.y - 3} width="172" height="22" rx="6" fill="#4c0519" stroke="#fb7185" strokeOpacity="0.75" />
                    <text x="110" y={trip.y + 12} textAnchor="middle" fill="#ffe4e6" fontSize="11.5" fontWeight="800" fontFamily="monospace">
                      {trip.label}
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>

        <div
          className={`shrink-0 rounded-lg border px-2.5 py-2 text-center font-mono text-xs sm:text-sm font-extrabold ${
            isDemon
              ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-200'
              : 'bg-rose-950/65 border-rose-400/55 text-rose-200'
          }`}
        >
          {isDemon ? '0 Intermediate Leaks!' : '~90% Stalled in Hallway!'}
        </div>
      </div>

      {/* RIGHT CHAMBER: VMEM IGNITION SANCTUM + MXU FURNACE */}
      <div
        className={`col-span-4 rounded-xl bg-gradient-to-br from-purple-950/90 via-violet-950/55 to-amber-950/75 border border-purple-400/55 flex flex-col justify-between min-h-0 ${
          compact ? 'p-2.5 gap-1.5' : 'p-3 sm:p-3.5 gap-2.5'
        }`}
      >
        <div className="shrink-0">
          <div className="text-xs sm:text-sm xl:text-base font-mono font-extrabold text-purple-200 tracking-tight">
            VMEM • IGNITION SANCTUM
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-amber-200">
            ~16–32 MB On-Core • Ultra-Hot
          </div>
        </div>

        {/* Fused Pipeline Strip */}
        <div className="shrink-0 rounded-xl bg-slate-950/90 border border-slate-700/80 p-2.5">
          <div
            className={`text-[10px] sm:text-[11px] font-mono font-bold text-center mb-1.5 ${
              isDemon ? 'text-emerald-300' : 'text-slate-300'
            }`}
          >
            {isDemon ? 'ALL OPS FUSED IN VMEM:' : 'UNFUSED (1 OP AT A TIME):'}
          </div>
          <div className="flex items-center justify-between gap-1 font-mono text-xs sm:text-sm font-extrabold">
            <span
              className={`flex-1 text-center py-1 rounded-md border ${
                isDemon
                  ? 'bg-emerald-950/80 border-emerald-400/60 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              × w
            </span>
            <span className={isDemon ? 'text-emerald-300' : 'text-rose-400'}>{isDemon ? '→' : '✗'}</span>
            <span
              className={`flex-1 text-center py-1 rounded-md border ${
                isDemon
                  ? 'bg-purple-950/80 border-purple-400/60 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              + b
            </span>
            <span className={isDemon ? 'text-emerald-300' : 'text-rose-400'}>{isDemon ? '→' : '✗'}</span>
            <span
              className={`flex-1 text-center py-1 rounded-md border ${
                isDemon
                  ? 'bg-amber-950/80 border-amber-400/60 text-amber-100'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              gelu
            </span>
          </div>
        </div>

        {/* 128x128 MXU Systolic Furnace */}
        <div className="flex-1 min-h-0 rounded-xl bg-indigo-950/85 border-2 border-amber-400/55 p-2.5 flex flex-col justify-between">
          <div className="text-center shrink-0">
            <div className="text-xs sm:text-sm font-mono font-extrabold text-amber-200">
              128×128 MXU FURNACE
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-slate-200">
              {isDemon ? 'Burning at Full Silicon Speed!' : 'Mostly Idle Waiting on HBM...'}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center py-1">
            <svg viewBox="0 0 184 74" className="w-full h-full">
              {Array.from({ length: 32 }).map((_, idx) => {
                const col = idx % 8;
                const row = Math.floor(idx / 8);
                return (
                  <rect
                    key={idx}
                    x={col * 23 + 2}
                    y={row * 18 + 2}
                    width="18"
                    height="13"
                    rx="3"
                    fill={isDemon ? (idx % 2 === 0 ? '#f59e0b' : '#c084fc') : '#334155'}
                    fillOpacity={isDemon ? 0.94 : 0.45}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div className="shrink-0 rounded-lg bg-slate-950/90 border border-amber-500/35 px-2.5 py-2 flex items-center justify-between gap-1.5 font-mono">
          <span className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1 truncate">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Spell:
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white shrink-0">
            {isDemon ? '256-Demon Grid' : 'No Kernel'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const MaxwellDemonPallasDemo: React.FC<{ staticPrint?: boolean }> = ({
  staticPrint = false,
}) => {
  const [activeTab, setActiveTab] = useState<DemonTab>('lair');
  const [kernelMode, setKernelMode] = useState<'blind' | 'demon'>('demon');
  const [altarPhase, setAltarPhase] = useState<0 | 1>(0);
  const [spellStep, setSpellStep] = useState<SpellStep>('kernel');

  const switchTab = (tab: DemonTab, pulse: number) => {
    setActiveTab(tab);
    soundEngine.playEvolutionPulse(pulse);
  };

  if (staticPrint) {
    return (
      <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-purple-500/40 p-4 gap-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Maxwell’s Demon Inside the TPU — Pallas VMEM Kernel
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
            1 Trip vs. 3× HBM Hallway
          </span>
        </div>

        <ChamberDiagram kernelMode="demon" compact />

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-slate-950/90 border border-cyan-500/35 p-3">
            <div className="text-xs font-mono font-bold text-cyan-300 uppercase">GPU vs. TPU Demons</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              <strong>Pallas</strong> unifies GPU <strong>10,000 Imps (SIMT)</strong> &amp; the TPU <strong>Arch-Demon (SIMD 8×128 slabs)</strong> in pure Python.
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/90 border border-amber-500/35 p-3">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase">Two-Headed Double Buffer</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              <strong>Altar A</strong> roasts in the MXU while <strong>Altar B</strong> prefetches the next tile via DMA — <strong>100% furnace heat</strong>.
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/90 border border-emerald-500/35 p-3">
            <div className="text-xs font-mono font-bold text-emerald-300 uppercase">FlashAttention Exorcism</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              Beats Landauer’s VMEM limit: Online Softmax tracks only <strong>(m, ℓ)</strong> — never writing the <strong>10B</strong> matrix to HBM!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/80 border border-purple-500/35 p-4 xl:p-5 shadow-xl gap-3">
      {/* Top 4-Tab Story Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'lair', label: '1. HBM vs VMEM', icon: Flame, pulse: 1 },
              { id: 'species', label: '2. GPU vs TPU', icon: Cpu, pulse: 2 },
              { id: 'tricks', label: '3. Double Buffer & FlashAttn', icon: Brain, pulse: 3 },
              { id: 'spellbook', label: '4. Pallas Spell (Code)', icon: Code2, pulse: 4 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id, tab.pulse)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition border ${
                  active
                    ? 'bg-purple-500/25 text-purple-100 border-purple-400/60 shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: THE DEMON'S LAIR (HBM vs VMEM) */}
      {activeTab === 'lair' && (
        <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-mono text-slate-200">
              Toggle how <code className="text-cyan-300 font-bold">gelu(x * w + b)</code> crosses the Memory Wall:
            </span>
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setKernelMode('blind');
                  soundEngine.playEvolutionPulse(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold transition ${
                  kernelMode === 'blind'
                    ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" /> Blind Code (3× HBM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKernelMode('demon');
                  soundEngine.playEvolutionPulse(3);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold transition ${
                  kernelMode === 'demon'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DoorClosed className="w-3.5 h-3.5" /> Pallas Demon (1 Trip)
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full flex flex-col">
            <ChamberDiagram kernelMode={kernelMode} />
          </div>
        </div>
      )}

      {/* TAB 2: TWIN DEMONS (GPU vs TPU) */}
      {activeTab === 'species' && (
        <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
          <div className="rounded-xl bg-gradient-to-r from-cyan-950/50 via-purple-950/50 to-emerald-950/50 border border-purple-400/35 px-4 py-2.5 flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm xl:text-[15px] font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
              Pallas: One Universal Python Grimoire Binding Both Hardware Species
            </span>
            <span className="text-xs font-mono text-emerald-300 shrink-0 hidden sm:inline">
              No CUDA C++ Required
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="grid grid-cols-12 gap-2 px-2 text-xs font-mono font-bold uppercase tracking-wider">
              <div className="col-span-3 text-slate-400">Demon Trait</div>
              <div className="col-span-4 text-amber-300">NVIDIA GPU (CUDA / Triton)</div>
              <div className="col-span-5 text-emerald-300">Google TPU (Pallas VMEM)</div>
            </div>

            {SPECIES_TRAITS.map((row) => (
              <div
                key={row.trait}
                className="flex-1 grid grid-cols-12 gap-2 items-center rounded-xl bg-slate-950/85 border border-slate-800 px-3 py-2"
              >
                <div className="col-span-3 text-xs sm:text-sm font-mono font-bold text-cyan-300">
                  {row.trait}
                </div>
                <div className="col-span-4 pr-1 border-r border-slate-800/80">
                  <div className="text-xs sm:text-sm font-bold text-amber-200 leading-tight">
                    {row.gpuTitle}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
                    {row.gpuDetail}
                  </div>
                </div>
                <div className="col-span-5 pl-1">
                  <div className="text-xs sm:text-sm font-bold text-emerald-200 leading-tight">
                    {row.tpuTitle}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-200 mt-0.5 leading-snug">
                    {row.tpuDetail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs sm:text-sm font-mono text-slate-200 flex items-center justify-between">
            <span>Same mental model: keep hot tiles close to the furnace.</span>
            <span className="text-purple-300 font-bold">GPU Imps ↔ TPU Arch-Demon</span>
          </div>
        </div>
      )}

      {/* TAB 3: DOUBLE BUFFERING & LANDAUER / FLASHATTENTION */}
      {activeTab === 'tricks' && (
        <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
          {/* Example B: Two-Headed Demon (Double Buffering) */}
          <div className="flex-1 rounded-xl bg-slate-950/90 border border-amber-500/35 p-3.5 flex flex-col justify-between gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                <Flame className="w-4 h-4 shrink-0" /> The Two-Headed Demon: Double Buffering in VMEM
              </div>
              <button
                type="button"
                onClick={() => {
                  setAltarPhase((p) => (p === 0 ? 1 : 0));
                  soundEngine.playEvolutionPulse(2);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 transition"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Altars (Cycle {altarPhase === 0 ? 'T → T+1' : 'T+1 → T'})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-xl p-3 border transition ${
                  altarPhase === 0
                    ? 'bg-amber-950/40 border-amber-400/60 shadow-[0_0_16px_rgba(251,191,36,0.16)]'
                    : 'bg-cyan-950/35 border-cyan-400/45'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-white">VMEM ALTAR A</span>
                  <span className={altarPhase === 0 ? 'text-amber-300' : 'text-cyan-300'}>
                    {altarPhase === 0 ? 'LEFT HEAD • MXU ROASTING' : 'RIGHT HEAD • DMA PREFETCH'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 mt-1.5 leading-snug">
                  {altarPhase === 0
                    ? 'Blasting Slab #k inside the 128×128 MXU furnace at 100% heat.'
                    : 'Silently teleporting Slab #(k+2) from HBM behind the scenes.'}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 border transition ${
                  altarPhase === 1
                    ? 'bg-amber-950/40 border-amber-400/60 shadow-[0_0_16px_rgba(251,191,36,0.16)]'
                    : 'bg-cyan-950/35 border-cyan-400/45'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-white">VMEM ALTAR B</span>
                  <span className={altarPhase === 1 ? 'text-amber-300' : 'text-cyan-300'}>
                    {altarPhase === 1 ? 'LEFT HEAD • MXU ROASTING' : 'RIGHT HEAD • DMA PREFETCH'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 mt-1.5 leading-snug">
                  {altarPhase === 1
                    ? 'Blasting Slab #(k+1) the nanosecond Altar A finishes — 0 idle cycles!'
                    : 'Silently teleporting Slab #(k+1) from HBM while Altar A cooks.'}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-emerald-300 flex items-center justify-between">
              <span>Result: The MXU furnace NEVER cools down waiting 500 cycles for the trapdoor.</span>
              <span className="font-bold">100% Furnace Capacity</span>
            </div>
          </div>

          {/* Example C: Landauer's Exorcism (FlashAttention) */}
          <div className="flex-1 rounded-xl bg-slate-950/90 border border-emerald-500/35 p-3.5 flex flex-col justify-between gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                <Brain className="w-4 h-4 shrink-0" /> Landauer’s Exorcism (1961): Why FlashAttention Needs VMEM
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                100K Context Window
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-rose-950/25 border border-rose-500/35 p-3">
                <div className="text-xs font-mono font-bold text-rose-300 uppercase">
                  Naive Demon Brain Explodes
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-snug">
                  Comparing 100K × 100K words = <strong className="text-rose-200">10 billion numbers</strong>. Overflows tiny ~16–32 MB VMEM → forced to carve stone tablets in slow HBM!
                </p>
              </div>
              <div className="rounded-xl bg-emerald-950/25 border border-emerald-500/35 p-3">
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase">
                  Pallas FlashAttention (Online Softmax)
                </div>
                <p className="text-xs sm:text-sm text-slate-100 mt-1 leading-snug">
                  Tracks just <strong className="text-emerald-200">2 tiny running numbers</strong> in VMEM — max heat <code className="text-amber-300 font-bold">m</code> &amp; sum <code className="text-cyan-300 font-bold">ℓ</code> — streaming tiles without ever writing 10B numbers to HBM!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THE MAXWELL SORTING SPELL (REAL PALLAS CODE) */}
      {activeTab === 'spellbook' && (
        <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
              Real Pallas VMEM Kernel — Click a step to inspect the spell:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  { id: 'kernel', label: '1. VMEM Incantation' },
                  { id: 'grid', label: '2. 256-Demon Grid' },
                  { id: 'trapdoor', label: '3. BlockSpec Trapdoor' },
                ] as const
              ).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setSpellStep(step.id);
                    soundEngine.playEvolutionPulse(2);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                    spellStep === step.id
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-[11px] sm:text-xs xl:text-[12.5px] leading-[1.42] overflow-x-auto">
            {MAXWELL_SPELL_LINES.map((line) => {
              const highlighted = line.section === spellStep;
              return (
                <div
                  key={line.num}
                  className={`flex items-baseline gap-2.5 px-2 rounded transition ${
                    highlighted
                      ? 'bg-emerald-500/15 text-emerald-100 border-l-2 border-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="w-5 text-right text-slate-600 select-none shrink-0">
                    {line.num}
                  </span>
                  <span className="whitespace-pre">{line.text || ' '}</span>
                </div>
              );
            })}
          </div>

          <div className={`rounded-xl border px-3.5 py-2.5 ${SPELL_CALLOUTS[spellStep].accent}`}>
            <div className="text-xs sm:text-sm font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" /> {SPELL_CALLOUTS[spellStep].title}
            </div>
            <p className="text-xs sm:text-sm text-slate-100 mt-0.5 leading-snug">
              {SPELL_CALLOUTS[spellStep].detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
