import React, { useState } from 'react';
import { Cpu, Gauge, Layers, Zap } from 'lucide-react';
import { TPU_GENERATIONS_DATA } from '../../data/demoTraces';
import { soundEngine } from '../../utils/soundEngine';
import { FormattedText } from '../FormattedText';

export const TpuPallasSimulatorDemo: React.FC = () => {
  const [chipIdx, setChipIdx] = useState<number>(1); // Default Ironwood v7
  const [tileShape, setTileShape] = useState<'64x128' | '128x256'>('128x256');
  const [precision, setPrecision] = useState<'bf16' | 'fp8'>('fp8');

  const chip = TPU_GENERATIONS_DATA[chipIdx];
  const tileAligned = tileShape === '128x256';
  const tilePenalty = tileAligned ? 1.0 : 1.68;
  const precPenalty = precision === 'fp8' ? 1.0 : 1.72;

  const pallasMs = Number((chip.baseKernelMs * tilePenalty * precPenalty).toFixed(2));
  const speedupVsCpu = Math.round(1015.6 / pallasMs);
  const mxuUtil = Math.min(96, Math.round(94 / (tilePenalty * (precision === 'fp8' ? 1.0 : 1.15))));

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/80 border border-purple-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col justify-between gap-3">
        {/* Hardware Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            {TPU_GENERATIONS_DATA.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setChipIdx(idx);
                  soundEngine.playEvolutionPulse(idx + 1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm xl:text-[15px] font-mono font-bold transition border ${
                  chipIdx === idx
                    ? 'bg-purple-500/25 text-purple-200 border-purple-400/60'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {item.id === 'v6e-trillium'
                  ? 'v6e Trillium'
                  : item.id === 'v7-ironwood'
                    ? 'v7 Ironwood'
                    : item.id === 'v8t-training'
                      ? 'TPU-8t'
                      : 'TPU-8i'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="VMEM Tile Shape"
              value={tileShape}
              onChange={(e) => setTileShape(e.target.value as '64x128' | '128x256')}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm xl:text-[15px] font-mono text-cyan-300"
            >
              <option value="128x256">Tile: 128×256 (MXU Aligned)</option>
              <option value="64x128">Tile: 64×128 (Under-Tiled)</option>
            </select>

            <button
              type="button"
              onClick={() => setPrecision((p) => (p === 'fp8' ? 'bf16' : 'fp8'))}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm xl:text-[15px] font-mono font-bold border transition ${
                precision === 'fp8'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/50'
              }`}
            >
              {precision.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Selected Silicon Card */}
        <div className="rounded-xl bg-slate-950/90 border border-purple-500/25 p-4 grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-400">Compute</div>
            <div className="text-sm sm:text-base xl:text-lg font-bold text-purple-200 mt-0.5 leading-snug">{chip.computeHeadline}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-400">Memory Fabric</div>
            <div className="text-sm sm:text-base xl:text-lg font-bold text-cyan-200 mt-0.5 leading-snug">{chip.memoryHeadline}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-400">Pod Topology</div>
            <div className="text-sm sm:text-base xl:text-lg font-bold text-emerald-200 mt-0.5 leading-snug">
              <FormattedText text={chip.scaleHeadline} />
            </div>
          </div>
        </div>

        {/* Latency Comparison Bars */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div>
            <div className="flex flex-wrap justify-between gap-2 text-sm sm:text-[15px] xl:text-base font-mono text-slate-300 mb-1.5">
              <span>Evo-FedAgg BLAS Gram CPU Baseline (N=200, d=7,850)</span>
              <span className="text-rose-400 font-bold">1,015.60 ms (1x • vs 17.52s MKrum)</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div className="h-full bg-rose-500/80 w-full" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-between gap-2 text-sm sm:text-[15px] xl:text-base font-mono text-slate-300 mb-1.5">
              <span>
                <FormattedText text='TorchTPU `.to("tpu")` + OpenXLA `torch.compile`' />
              </span>
              <span className="text-amber-300 font-bold">6.40 ms (159×)</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div className="h-full bg-amber-400 w-[18%]" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-between gap-2 text-sm sm:text-[15px] xl:text-base font-mono text-slate-100 mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <Zap className="w-4 h-4 shrink-0" /> Fused Pallas VMEM Kernel ({tileShape} • {precision.toUpperCase()})
              </span>
              <span className="text-emerald-300 font-extrabold">
                {pallasMs.toFixed(2)} ms ({speedupVsCpu.toLocaleString()}x Speedup!)
              </span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-slate-950 overflow-hidden border border-emerald-500/40">
              <div className="h-full bg-emerald-400 w-[3.5%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Systolic MXU Utilization */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base xl:text-lg font-mono">
        <span className="text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> 256×256 Systolic MXU Utilization:{' '}
          <strong className={mxuUtil > 85 ? 'text-emerald-300' : 'text-amber-300'}>{mxuUtil}%</strong>
        </span>
        <span className="text-cyan-300 font-bold flex items-center gap-1.5">
          <Gauge className="w-4 h-4" /> {chip.perfPerDollarBoost}
        </span>
      </div>
    </div>
  );
};

export const TpuBifurcationRoadmapWidget: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-purple-500/30 p-5 xl:p-6 gap-3">
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Cpu className="w-5 h-5" /> AI Hypercomputer Silicon Roadmap
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold text-cyan-300">Google Cloud Tech • Future of AI Infra</span>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-2.5">
          {TPU_GENERATIONS_DATA.map((tpu) => (
            <div
              key={tpu.id}
              className="flex-1 rounded-xl bg-slate-950/85 border border-slate-800 px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base xl:text-lg font-bold text-white">{tpu.name}</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-200 border border-purple-500/35">
                    {tpu.badge}
                  </span>
                </div>
                <p className="text-sm xl:text-[15px] text-slate-300 mt-1 leading-snug">
                  <FormattedText text={tpu.sweetSpot} />
                </p>
              </div>
              <div className="text-right font-mono shrink-0">
                <div className="text-sm sm:text-base xl:text-lg font-bold text-emerald-300">{tpu.computeHeadline}</div>
                <div className="text-xs sm:text-sm text-cyan-300 mt-0.5">
                  <FormattedText text={tpu.scaleHeadline} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-purple-950/35 border border-purple-500/35 px-4 py-3 text-sm sm:text-base xl:text-[1.04rem] text-slate-100 font-mono leading-snug">
        Recursive Ouroboros: <strong className="text-purple-200">Ironwood &amp; TPU-8i</strong> run Gemini → Gemini powers <strong className="text-emerald-300">AlphaEvolve + AlphaChip</strong> → which optimize the next TPU floorplan &amp; Pallas kernels!
      </div>
    </div>
  );
};
