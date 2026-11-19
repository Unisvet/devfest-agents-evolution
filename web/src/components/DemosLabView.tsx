import React from 'react';
import { Terminal } from 'lucide-react';
import { DemoExecutionMode } from '../types/presentation';
import { AntigravitySwarmDemo } from './demos/AntigravitySwarmDemo';
import { CirclePackingCodelabDemo } from './demos/CirclePackingCodelabDemo';
import { EvoFedAggCcncDemo } from './demos/EvoFedAggCcncDemo';
import { EvoFedAggMaxwellStoryWidget } from './demos/EvoFedAggMaxwellStory';
import { AgiLevelsMatrixWidget, LemArchetypeExplorer } from './demos/LemAgiExplorer';
import {
  TpuEvalArchitecturesWidget,
  ZeroLeakTpuAutomationWidget,
} from './demos/TpuArchitectureAndZeroLeakWidgets';
import { MaxwellDemonPallasDemo } from './demos/MaxwellDemonPallasDemo';
import { TpuBifurcationRoadmapWidget } from './demos/TpuPallasSimulatorDemo';

export const DemosLabView: React.FC<{
  demoMode: DemoExecutionMode;
  onToggleDemoMode: () => void;
}> = ({ demoMode, onToggleDemoMode }) => {
  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-8 space-y-8">
      <div className="rounded-3xl bg-slate-900/70 border border-cyan-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-mono font-bold uppercase tracking-widest text-cyan-300">
            Interactive Sandbox Suite • Dual-Mode Stage &amp; Attendee Lab
          </span>
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white mt-1">
            Hands-On Demos: Codelab Circle Packing, Evo-FedAgg (CCNC 2027) &amp; Zero-Leak TPUs
          </h2>
          <p className="text-base text-slate-200 mt-1.5 max-w-3xl">
            Experiment with every interactive sandbox directly in your browser, or run the companion Python scripts in{' '}
            <code className="text-cyan-300 font-mono">demos/</code> and Spot TPU wrapper in{' '}
            <code className="text-emerald-300 font-mono">scripts/run_alphaevolve_spot_tpu.sh</code>.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-200 shrink-0 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
            <Terminal className="w-4 h-4" /> Local Python CLI Runner (uv)
          </div>
          <div>uv run --with numpy python demos/01_antigravity_swarm_demo.py</div>
          <div>uv run --with numpy python demos/02_circle_packing_codelab_demo.py</div>
          <div>uv run --with numpy python demos/03_ccnc2027_evofedagg_demo.py</div>
          <div>uv run --with numpy python demos/04_jax_torchtpu_evaluator_demo.py</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvoFedAggMaxwellStoryWidget />
        <EvoFedAggCcncDemo />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CirclePackingCodelabDemo />
        <MaxwellDemonPallasDemo />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TpuEvalArchitecturesWidget />
        <ZeroLeakTpuAutomationWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AntigravitySwarmDemo mode={demoMode} onToggleMode={onToggleDemoMode} />
        <LemArchetypeExplorer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgiLevelsMatrixWidget />
        <TpuBifurcationRoadmapWidget />
      </div>
    </div>
  );
};
