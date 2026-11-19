import React, { useEffect, useRef, useState } from 'react';
import { Cpu, ExternalLink, GitBranch, Pause, Play, Sparkles, Terminal, Zap } from 'lucide-react';

interface FlopScaleTier {
  id: string;
  exponent: number;
  ringCount: number; // active concentric x1,000 rings (0..6)
  shortLabel: string;
  unitName: string;
  scientific: string;
  hardwareRef: string;
  timeForOneExaSecond: string;
  analogy: string;
  accentColor: string;
  rgbaGlow: string;
  ringRgb: string;
  spinSpeed: number;
  particleDensity: number;
}

const FLOP_TIERS: FlopScaleTier[] = [
  {
    id: 'human',
    exponent: 0,
    ringCount: 0,
    shortLabel: '10⁰',
    unitName: '1 FLOP/s',
    scientific: '1 op / sec',
    hardwareRef: '1 Human Mind',
    timeForOneExaSecond: '31.7B years',
    analogy:
      'One human computing 1 math op/sec would need 31.7 billion years (2.3× the age of the Universe) to match 1 single ExaFLOP second.',
    accentColor: 'text-amber-300',
    rgbaGlow: 'rgba(251, 191, 36, 0.24)',
    ringRgb: '251, 191, 36',
    spinSpeed: 0.004,
    particleDensity: 4,
  },
  {
    id: 'mega',
    exponent: 6,
    ringCount: 2,
    shortLabel: '10⁶',
    unitName: '1 MegaFLOP/s',
    scientific: '1 Million / s',
    hardwareRef: 'Early PC / Apollo',
    timeForOneExaSecond: '31,700 years',
    analogy:
      'Early spacecraft & 1980s computing: 1 million ops/sec — still 1 trillion times (10¹²×) slower than 1 ExaFLOP.',
    accentColor: 'text-amber-200',
    rgbaGlow: 'rgba(245, 158, 11, 0.24)',
    ringRgb: '245, 158, 11',
    spinSpeed: 0.007,
    particleDensity: 10,
  },
  {
    id: 'giga',
    exponent: 9,
    ringCount: 3,
    shortLabel: '10⁹',
    unitName: '1 GigaFLOP/s',
    scientific: '1 Billion / s',
    hardwareRef: '1990s Supercomputer',
    timeForOneExaSecond: '31.7 years',
    analogy:
      '1 billion ops/sec — takes 31.7 years nonstop to complete what an ExaFLOP machine finishes in 1 second.',
    accentColor: 'text-cyan-300',
    rgbaGlow: 'rgba(34, 211, 238, 0.24)',
    ringRgb: '34, 211, 238',
    spinSpeed: 0.01,
    particleDensity: 18,
  },
  {
    id: 'tera',
    exponent: 12,
    ringCount: 4,
    shortLabel: '10¹²',
    unitName: '1 TeraFLOP/s',
    scientific: '1 Trillion / s',
    hardwareRef: 'Modern Laptop',
    timeForOneExaSecond: '11.6 days',
    analogy:
      '1 trillion ops/sec — you would need 1,000,000 laptops working together (or 11.6 days on one laptop) for 1 ExaFLOP second.',
    accentColor: 'text-sky-300',
    rgbaGlow: 'rgba(56, 189, 248, 0.28)',
    ringRgb: '56, 189, 248',
    spinSpeed: 0.014,
    particleDensity: 28,
  },
  {
    id: 'peta',
    exponent: 15,
    ringCount: 5,
    shortLabel: '10¹⁵',
    unitName: '1 PetaFLOP/s',
    scientific: '1 Quadrillion / s',
    hardwareRef: '8th-Gen TPU 8i / 8t Chip',
    timeForOneExaSecond: '16.7 minutes',
    analogy:
      '1 quadrillion ops/s — 8th-gen TPU 8i delivers 10.1 FP4 PFLOPs (288 GB HBM3e @ 8.6 TB/s, 384 MB SRAM) and TPU 8t hits 12.6 FP4 PFLOPs; just ~80 chips cross 1 ExaFLOP!',
    accentColor: 'text-purple-300',
    rgbaGlow: 'rgba(192, 132, 252, 0.30)',
    ringRgb: '192, 132, 252',
    spinSpeed: 0.019,
    particleDensity: 44,
  },
  {
    id: 'exa',
    exponent: 18,
    ringCount: 6,
    shortLabel: '10¹⁸',
    unitName: '1 ExaFLOP/s',
    scientific: '1 Quintillion / s',
    hardwareRef: '8th-Gen TPU 8i & 8t Pods',
    timeForOneExaSecond: '1.00 second',
    analogy:
      'All 8B humans doing 1 op/s nonstop need ~4 yrs (3.96 yrs) for 1 ExaFLOP sec — 8th-gen TPU 8i Pod hits 11.6 FP8 ExaFLOPS (1,152 chips) & TPU 8t Superpod hits 121 FP4 ExaFLOPS (9,600 chips)!',
    accentColor: 'text-emerald-300',
    rgbaGlow: 'rgba(52, 211, 153, 0.32)',
    ringRgb: '52, 211, 153',
    spinSpeed: 0.025,
    particleDensity: 72,
  },
];

const RING_LABELS = ['10³', '10⁶', '10⁹', '10¹²', '10¹⁵', '10¹⁸'];
const RING_COLORS = [
  '251, 191, 36', // 10^3 amber
  '245, 158, 11', // 10^6 warm gold
  '34, 211, 238', // 10^9 cyan
  '56, 189, 248', // 10^12 sky
  '192, 132, 252', // 10^15 purple
  '52, 211, 153', // 10^18 emerald
];
const TRIPLET_CLASSES = [
  'text-amber-300',
  'text-amber-200',
  'text-cyan-300',
  'text-sky-300',
  'text-purple-300',
  'text-emerald-300',
];

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '-': '⁻',
};

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((ch) => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join('');
}

function formatElapsedFlops(elapsedSec: number, exponent: number): string {
  if (exponent === 0) {
    return `${Math.max(1, Math.floor(elapsedSec + 1))} FLOPs`;
  }
  const value = Math.max(0.01, elapsedSec);
  const expShift = Math.floor(Math.log10(value));
  const mantissa = value / Math.pow(10, expShift);
  const totalExp = exponent + expShift;
  return `${mantissa.toFixed(2)} × 10${toSuperscript(totalExp)}`;
}

/**
 * Interactive 4D tesseract projection surrounded by a 6-ring logarithmic
 * ExaFLOP (10^18 FLOP/s = 1 quintillion ops/sec) compute scale simulator.
 */
export const HeroCanvas3D: React.FC<{ staticMode?: boolean }> = ({ staticMode = false }) => {
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tierIdx, setTierIdx] = useState<number>(5); // Default to 10^18 ExaFLOP peak
  const [autoWarp, setAutoWarp] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(1.0);
  const pulseRef = useRef<number>(staticMode ? 0 : 1);
  const tierRef = useRef<FlopScaleTier>(FLOP_TIERS[5]);

  const activeTier = FLOP_TIERS[tierIdx];

  useEffect(() => {
    tierRef.current = activeTier;
    if (!staticMode) {
      pulseRef.current = 1;
      setElapsedSec(0);
    }
  }, [activeTier, staticMode]);

  // Auto-climb 10^0 -> 10^18 logarithmic warp sequence
  useEffect(() => {
    if (!autoWarp || staticMode) return;
    const id = window.setInterval(() => {
      setTierIdx((prev) => {
        if (prev >= FLOP_TIERS.length - 1) {
          setAutoWarp(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2400);
    return () => window.clearInterval(id);
  }, [autoWarp, staticMode]);

  // Real-time simulated FLOPs accumulator for the active tier
  useEffect(() => {
    if (staticMode) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      setElapsedSec((performance.now() - start) / 1000);
    }, 80);
    return () => window.clearInterval(id);
  }, [tierIdx, staticMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let angle = 0.65;
    let orbitPhase = 0.4;
    let cssW = wrap.clientWidth || 760;
    let cssH = wrap.clientHeight || 420;

    const syncCanvasSize = () => {
      const rect = wrap.getBoundingClientRect();
      cssW = Math.max(320, Math.round(rect.width || 760));
      cssH = Math.max(260, Math.round(rect.height || 420));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncCanvasSize();
            if (staticMode) renderFrame();
          })
        : null;
    resizeObserver?.observe(wrap);

    const vertices4D: number[][] = [];
    for (let i = 0; i < 16; i++) {
      vertices4D.push([
        i & 1 ? 1 : -1,
        i & 2 ? 1 : -1,
        i & 4 ? 1 : -1,
        i & 8 ? 1 : -1,
      ]);
    }

    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    const renderFrame = () => {
      const tier = tierRef.current;
      const w = cssW;
      const h = cssH;
      const cx = w * 0.485;
      const cy = h * 0.5;
      const minDim = Math.min(w, h);
      const innerRx = Math.max(minDim * 0.24, w * 0.16);
      const innerRy = minDim * 0.21;
      const outerRx = w * 0.405;
      const outerRy = h * 0.44;

      ctx.clearRect(0, 0, w, h);

      // Dynamic radial glow filling the full container
      const grad = ctx.createRadialGradient(cx, cy, 12, cx, cy, Math.max(outerRx, outerRy) * 1.15);
      grad.addColorStop(0, tier.rgbaGlow);
      grad.addColorStop(0.55, 'rgba(34, 211, 238, 0.09)');
      grad.addColorStop(1, 'rgba(4, 7, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 6 Concentric Logarithmic Rings spanning the full box (each step = x1,000 ops/sec)
      for (let rIdx = 0; rIdx < 6; rIdx++) {
        const frac = (rIdx + 1) / 6;
        const rx = innerRx + frac * (outerRx - innerRx);
        const ry = innerRy + frac * (outerRy - innerRy);
        const isActive = rIdx < tier.ringCount;
        const rgb = RING_COLORS[rIdx];

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (isActive) {
          ctx.strokeStyle = `rgba(${rgb}, ${rIdx === tier.ringCount - 1 ? 0.72 : 0.34})`;
          ctx.lineWidth = rIdx === tier.ringCount - 1 ? 2.4 : 1.4;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
          ctx.lineWidth = 1.1;
          ctx.setLineDash([5, 6]);
        }
        ctx.stroke();
        ctx.restore();

        // Crisp scale power label on the right-side equator of each concentric ring
        const labelPx = Math.max(14, Math.min(18, Math.round(w * 0.022)));
        ctx.font = `700 ${labelPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = isActive ? `rgba(${rgb}, 0.98)` : 'rgba(148, 163, 184, 0.42)';
        ctx.textAlign = 'left';
        ctx.fillText(RING_LABELS[rIdx], cx + rx + 6, cy + 5);

        // Orbiting FLOP photon bursts on active logarithmic rings
        if (isActive) {
          const packetsOnRing = Math.min(20, Math.max(4, Math.floor((rIdx + 2) * (tier.particleDensity / 16))));
          const dir = rIdx % 2 === 0 ? 1 : -1;
          const speed = (0.35 + rIdx * 0.16) * (0.6 + tier.ringCount * 0.22);

          for (let p = 0; p < packetsOnRing; p++) {
            const theta = orbitPhase * speed * dir + (p / packetsOnRing) * Math.PI * 2;
            const px = cx + Math.cos(theta) * rx;
            const py = cy + Math.sin(theta) * ry;

            // Luminous trailing arc
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, theta - 0.15 * dir, theta, dir < 0);
            ctx.strokeStyle = `rgba(${rgb}, 0.62)`;
            ctx.lineWidth = rIdx === 5 ? 3 : 2.2;
            ctx.stroke();

            // Glowing FLOP packet dot
            ctx.beginPath();
            ctx.arc(px, py, rIdx === 5 ? 4.4 : 3.1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, 0.98)`;
            ctx.fill();
          }
        }
      }

      // Single human pulse orbit when at 10^0 FLOP/s
      if (tier.ringCount === 0) {
        const rx = innerRx * 1.18;
        const ry = innerRy * 1.12;
        const theta = orbitPhase * 0.45;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(theta) * rx, cy + Math.sin(theta) * ry, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
      }

      // Radial ExaFLOP shockwave burst when switching tiers or clicking +1s Pulse
      if (pulseRef.current > 0.01 && !staticMode) {
        const progress = 1 - pulseRef.current;
        const shockRx = innerRx + progress * (outerRx - innerRx) * 1.05;
        const shockRy = innerRy + progress * (outerRy - innerRy) * 1.05;
        ctx.beginPath();
        ctx.ellipse(cx, cy, shockRx, shockRy, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${tier.ringRgb}, ${pulseRef.current * 0.8})`;
        ctx.lineWidth = 3.2;
        ctx.stroke();
        pulseRef.current *= 0.93;
      }

      // 4D Tesseract / Hypercube vertices projected to 3D -> 2D (scaled ~2x larger to fill the stage)
      const projected = vertices4D.map(([vx, vy, vz, vw]) => {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const x1 = vx * cosA - vw * sinA;
        const w1 = vx * sinA + vw * cosA;

        const cosB = Math.cos(angle * 0.7);
        const sinB = Math.sin(angle * 0.7);
        const y1 = vy * cosB - vz * sinB;
        const z1 = vy * sinB + vz * cosB;

        const x2 = x1 * Math.cos(angle * 0.45) - z1 * Math.sin(angle * 0.45);
        const z2 = x1 * Math.sin(angle * 0.45) + z1 * Math.cos(angle * 0.45);

        const dist4 = 2.8 / (2.8 - w1 * 0.65);
        const x3 = x2 * dist4;
        const y3 = y1 * dist4;
        const z3 = z2 * dist4;

        const scale = minDim * 0.27;
        const persp = 3.4 / (3.4 - z3 * 0.45);
        return {
          x: cx + x3 * scale * persp,
          y: cy + y3 * scale * persp,
          z: z3,
        };
      });

      // Draw systolic energy beams from core to outer ring at Peta/ExaFLOP scale
      if (tier.ringCount >= 5) {
        for (let b = 0; b < 8; b++) {
          const v = projected[b * 2];
          const rayAngle = orbitPhase * 0.6 + (b / 8) * Math.PI * 2;
          const tx = cx + Math.cos(rayAngle) * outerRx;
          const ty = cy + Math.sin(rayAngle) * outerRy;
          ctx.beginPath();
          ctx.moveTo(v.x, v.y);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle =
            tier.ringCount === 6 ? 'rgba(52, 211, 153, 0.22)' : 'rgba(192, 132, 252, 0.16)';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      // Draw 4D Tesseract edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const inner = vertices4D[i][3] === -1 && vertices4D[j][3] === -1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = inner ? 2.6 : 1.8;
        ctx.strokeStyle = inner ? 'rgba(52, 211, 153, 0.92)' : 'rgba(34, 211, 238, 0.72)';
        ctx.stroke();
      });

      // Draw 4D Tesseract nodes with subtle glow
      projected.forEach((p, idx) => {
        const isInner = idx < 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isInner ? 8.5 : 6.5, 0, Math.PI * 2);
        ctx.fillStyle = isInner ? 'rgba(52, 211, 153, 0.22)' : 'rgba(192, 132, 252, 0.22)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, isInner ? 4.8 : 3.8, 0, Math.PI * 2);
        ctx.fillStyle = isInner ? '#34d399' : '#c084fc';
        ctx.fill();
      });

      if (!staticMode) {
        angle += tier.spinSpeed;
        orbitPhase += 0.015 + tier.ringCount * 0.008;
        animId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver?.disconnect();
    };
  }, [staticMode]);

  const handleToggleWarp = () => {
    if (autoWarp) {
      setAutoWarp(false);
    } else {
      setTierIdx(0);
      setAutoWarp(true);
    }
  };

  const handleTriggerPulse = () => {
    pulseRef.current = 1;
    setElapsedSec((s) => s + 1);
  };

  return (
    <div className="relative flex flex-col justify-between h-full rounded-2xl bg-slate-900/80 border border-cyan-500/35 p-4 xl:p-5 overflow-hidden shadow-2xl gap-2.5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm xl:text-[15px] font-mono font-semibold bg-cyan-500/15 text-cyan-200 border border-cyan-400/35">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          What Is 1 ExaFLOP? • Live 4D Projection
        </span>

        {!staticMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleWarp}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold border transition ${
                autoWarp
                  ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/60'
                  : 'bg-slate-950/90 text-cyan-200 border-cyan-500/40 hover:bg-cyan-500/20'
              }`}
            >
              {autoWarp ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {autoWarp ? 'Climbing 10⁰→10¹⁸' : 'Warp 10⁰ → 10¹⁸'}
            </button>
            <button
              type="button"
              onClick={handleTriggerPulse}
              title="Fire a 1-second compute pulse"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/45 transition"
            >
              <Zap className="w-3.5 h-3.5" /> +1s Pulse
            </button>
          </div>
        )}
      </div>

      {/* Exact 19-Digit Quintillion Readout (Six x1,000 Triplets) */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-2.5 z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-300">
            Floating-Point Operations / Second ({activeTier.unitName} = {activeTier.scientific})
          </div>
          <div className="font-mono text-xl sm:text-2xl xl:text-[1.72rem] 2xl:text-[1.95rem] font-extrabold tracking-wide mt-0.5 flex flex-wrap items-baseline">
            <span className="text-white">1</span>
            {[0, 1, 2, 3, 4, 5].map((tripletIdx) => {
              const unlocked = tripletIdx < activeTier.ringCount;
              return (
                <span
                  key={tripletIdx}
                  className={unlocked ? TRIPLET_CLASSES[tripletIdx] : 'text-slate-700/70'}
                >
                  ,000
                </span>
              );
            })}
            <span className="ml-2 text-sm xl:text-base font-semibold text-slate-300">FLOP/s</span>
          </div>
        </div>

        <div className="text-right font-mono shrink-0">
          <div className="text-xs sm:text-[13px] uppercase tracking-wider text-slate-300">
            Match 1 ExaFLOP Sec
          </div>
          <div className={`text-base sm:text-lg xl:text-2xl font-extrabold ${activeTier.accentColor}`}>
            {activeTier.timeForOneExaSecond}
          </div>
        </div>
      </div>

      {/* Live 4D Tesseract + 6 Concentric Logarithmic Orbital Rings (Full-Box Dynamic Scaling) */}
      <div
        ref={canvasWrapRef}
        className="relative flex-1 w-full min-h-[260px] xl:min-h-[320px] rounded-xl bg-[#050814]/85 border border-white/[0.07] overflow-hidden"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Subtle Live Telemetry Overlays */}
        <div className="pointer-events-none absolute top-2.5 left-3 rounded-lg bg-slate-950/85 border border-slate-700/80 px-3 py-1.5 font-mono text-xs sm:text-sm">
          <span className="text-slate-300">Simulated Ops: </span>
          <strong className={activeTier.accentColor}>
            {formatElapsedFlops(elapsedSec, activeTier.exponent)}
          </strong>
        </div>

        <div className="pointer-events-none absolute top-2.5 right-3 rounded-lg bg-slate-950/85 border border-slate-700/80 px-3 py-1.5 font-mono text-xs sm:text-sm text-slate-200">
          Each ring = <strong className="text-cyan-300">×1,000</strong> ops/s
        </div>

        <div className="pointer-events-none absolute bottom-2.5 left-3 rounded-lg bg-slate-950/80 px-2.5 py-1 font-mono text-xs sm:text-sm text-slate-300">
          Active Scale: <span className={`font-bold ${activeTier.accentColor}`}>{activeTier.hardwareRef}</span>
        </div>

        <div className="pointer-events-none hidden sm:flex items-center gap-2 absolute bottom-2.5 right-3 rounded-lg bg-slate-950/90 border border-purple-500/40 px-3 py-1 font-mono text-xs sm:text-sm text-slate-100">
          <span className="text-purple-300 font-bold">8th-Gen TPU:</span>
          <span>
            <strong className="text-cyan-300">8t</strong> 121 EF (9,600)
          </span>
          <span className="text-slate-500">•</span>
          <span>
            <strong className="text-emerald-300">8i</strong> 11.6 EF (1,152)
          </span>
        </div>
      </div>

      {/* 6-Step Interactive Scale Ladder + Concrete Human-Scale Analogy */}
      <div className="space-y-2 z-10">
        <div className="grid grid-cols-6 gap-1.5">
          {FLOP_TIERS.map((tier, idx) => {
            const selected = idx === tierIdx;
            return (
              <button
                key={tier.id}
                type="button"
                disabled={staticMode}
                onClick={() => {
                  setAutoWarp(false);
                  setTierIdx(idx);
                }}
                className={`rounded-lg px-2 py-1.5 border text-center transition font-mono ${
                  selected
                    ? 'bg-cyan-500/20 border-cyan-400/70 text-white shadow'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                <div className={`text-sm sm:text-base xl:text-lg font-extrabold ${selected ? tier.accentColor : ''}`}>
                  {tier.shortLabel}
                </div>
                <div className="text-xs sm:text-[13px] truncate opacity-90">
                  {tier.id === 'human'
                    ? 'Human'
                    : tier.id === 'mega'
                      ? 'Mega'
                      : tier.id === 'giga'
                        ? 'Giga'
                        : tier.id === 'tera'
                          ? 'Tera'
                          : tier.id === 'peta'
                            ? 'Peta'
                            : 'Exa'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-emerald-950/25 border border-emerald-500/35 px-4 py-2.5 text-sm sm:text-base xl:text-[1.05rem] text-slate-100 leading-snug">
          <span className={`font-mono font-bold uppercase mr-2 ${activeTier.accentColor}`}>
            [{activeTier.shortLabel} Scale]:
          </span>
          {activeTier.analogy}
        </div>
      </div>

      {/* Compact Three-Pillar Convergence Strip + 8th-Gen TPU Deep-Dive Links */}
      <div className="grid grid-cols-3 gap-2 z-10">
        <div className="rounded-xl bg-slate-950/85 border border-cyan-500/30 px-3 py-2">
          <div className="flex items-center gap-1.5 text-cyan-300 text-sm xl:text-base font-bold">
            <Terminal className="w-4 h-4 shrink-0" /> Antigravity
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 truncate">Next-gen agent platform</p>
        </div>
        <div className="rounded-xl bg-slate-950/85 border border-emerald-500/30 px-3 py-2">
          <div className="flex items-center gap-1.5 text-emerald-300 text-sm xl:text-base font-bold">
            <GitBranch className="w-4 h-4 shrink-0" /> AlphaEvolve
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 truncate">On Gemini Enterprise</p>
        </div>
        <div className="rounded-xl bg-slate-950/85 border border-purple-500/35 px-3 py-2">
          <div className="flex items-center justify-between gap-1 text-purple-300 text-sm xl:text-base font-bold">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Cpu className="w-4 h-4 shrink-0" /> 8th-Gen TPUs
            </span>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-xs font-mono">
              <a
                href="https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/eighth-generation-tpu-agentic-era/"
                target="_blank"
                rel="noopener noreferrer"
                title="Eighth-Generation TPU for the Agentic Era (Google Blog)"
                className="inline-flex items-center gap-0.5 text-cyan-300 hover:underline"
              >
                8g <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive"
                target="_blank"
                rel="noopener noreferrer"
                title="TPU 8t and TPU 8i Technical Deep Dive (Google Cloud Blog)"
                className="inline-flex items-center gap-0.5 text-emerald-300 hover:underline"
              >
                8t/8i <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-mono mt-0.5 truncate">
            8t: 121 EF • 8i: 11.6 EF
          </p>
        </div>
      </div>
    </div>
  );
};
