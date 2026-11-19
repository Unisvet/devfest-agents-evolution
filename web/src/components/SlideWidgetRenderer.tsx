import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DemoExecutionMode, SlideWidgetType } from '../types/presentation';
import { FormattedText } from './FormattedText';
import { HeroCanvas3D } from './HeroCanvas3D';
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
import { TriadAndVirgoExplorer } from './demos/TriadAndVirgoExplorer';

export const SlideWidgetRenderer: React.FC<{
  widget: SlideWidgetType;
  mode: DemoExecutionMode;
  onToggleMode?: () => void;
  staticPrint?: boolean;
}> = ({ widget, mode, onToggleMode, staticPrint = false }) => {
  switch (widget) {
    case 'hero-3d':
      return <HeroCanvas3D staticMode={staticPrint} />;

    case 'history-tools':
    case 'history-communication':
      return null;

    case 'triad-comparison':
      return <TriadAndVirgoExplorer staticPrint={staticPrint} />;

    case 'lem-agi-matrix':
      return <LemArchetypeExplorer />;

    case 'agi-levels-grid':
      return <AgiLevelsMatrixWidget />;

    case 'antigravity-architecture':
      return (
        <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-cyan-500/30 p-5 xl:p-6 gap-3">
          <div className="text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-cyan-300">
            Antigravity 2.0 × AlphaEvolve Skills × Gemini Enterprise
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3.5 items-stretch">
            <div className="rounded-xl bg-slate-950/85 border border-cyan-500/30 p-4 flex flex-col justify-center">
              <div className="text-base xl:text-lg font-bold text-cyan-300 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 shrink-0" /> Antigravity Surfaces &amp; CLI
              </div>
              <ul className="text-sm xl:text-[15.5px] 2xl:text-base text-slate-200 space-y-2 font-mono leading-snug">
                <li>• Antigravity 2.0 Desktop &amp; IDE</li>
                <li>• agy plugin install google-cloud-developer</li>
                <li>• google-antigravity Python SDK</li>
                <li>• .agents/rules/tpu-lifecycle.md</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-950/85 border border-emerald-500/30 p-4 flex flex-col justify-center">
              <div className="text-base xl:text-lg font-bold text-emerald-300 mb-2 flex items-center gap-2">
                <Code2 className="w-5 h-5 shrink-0" /> 6 Official <code className="font-mono">ae</code> Skills
              </div>
              <ul className="text-sm xl:text-[15.5px] 2xl:text-base text-slate-200 space-y-2 font-mono leading-snug">
                <li>• alpha_evolve_orchestrator</li>
                <li>• alpha_evolve_experiment_design</li>
                <li>• runner &amp; monitor (--dashboard)</li>
                <li>• post_experiment &amp; consultant</li>
              </ul>
            </div>
            <div className="col-span-2 rounded-xl bg-purple-950/25 border border-purple-500/35 p-4 flex flex-col justify-center">
              <div className="text-base xl:text-lg font-bold text-purple-300 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 shrink-0" /> Gemini Enterprise Governance Pillars
              </div>
              <div className="grid grid-cols-4 gap-2.5 text-sm xl:text-base font-mono font-bold text-slate-100 mt-1">
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-center">1. Build (ADK)</div>
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-center">2. Scale (A2A)</div>
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-center">3. Govern (Armor)</div>
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-center">4. Evolve (AE)</div>
              </div>
            </div>
          </div>
          <div className="text-sm xl:text-base font-mono text-slate-300 pt-1">
            Installed via <code className="text-emerald-300 font-bold">ae skills install --tool Antigravity</code>
          </div>
        </div>
      );

    case 'demo-antigravity-swarm':
      return <AntigravitySwarmDemo mode={mode} onToggleMode={onToggleMode} />;

    case 'alphaevolve-architecture':
      return (
        <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-emerald-500/30 p-5 xl:p-6 gap-3">
          <div className="flex items-center justify-between text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-emerald-300">
            <span>Decoupled Cloud Mutation × Local/TPU Evaluation</span>
            <a
              href="https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline inline-flex items-center gap-1.5 normal-case"
            >
              GitHub Repo <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-2.5">
            {[
              {
                step: '01 • Surgical `# EVOLVE-BLOCK-START ... END`',
                desc: 'Isolates mutable algorithm body inside `program.py` while locking function signatures & imports.',
                color: 'border-cyan-500/35 text-cyan-300',
              },
              {
                step: '02 • Discovery Engine Ensemble (`acquire_programs`)',
                desc: '`gemini-4-argon` (Cloud default) + `gemini-3.8-flash` / `gemini-3.1-pro-preview` across MAP-Elites islands.',
                color: 'border-purple-500/35 text-purple-300',
              },
              {
                step: '03 • User-Controlled Evaluator (`submit_program_evaluations`)',
                desc: 'Runs in YOUR sandbox/TPU! Even `-inf` crashes attach `AlphaEvolveEvaluationInsight` text so Gemini self-repairs.',
                color: 'border-amber-500/35 text-amber-300',
              },
              {
                step: '04 • 6 Official Google Cloud Reference Benchmarks',
                desc: '`circle_packing` (n=26) • `tsp` (N=50) • `signal_processing` • `adaptive_sort` • `llm_fine_tuning`',
                color: 'border-emerald-500/45 text-emerald-300',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex-1 flex flex-col justify-center rounded-xl bg-slate-950/85 border ${item.color} px-4 py-3`}
              >
                <div className="text-sm sm:text-base xl:text-lg font-mono font-bold">
                  <FormattedText text={item.step} />
                </div>
                <div className="text-sm xl:text-[15.5px] 2xl:text-base text-slate-200 mt-1 leading-snug">
                  <FormattedText text={item.desc} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs sm:text-sm xl:text-base font-mono text-emerald-300 flex items-center justify-between pt-1">
            <span>Zero Proprietary Data Leaves Your Evaluator</span>
            <span className="font-bold">ae experiment run --dashboard</span>
          </div>
        </div>
      );

    case 'demo-circle-packing':
      return <CirclePackingCodelabDemo />;

    case 'demo-evofedagg-story':
      return <EvoFedAggMaxwellStoryWidget staticPrint={staticPrint} />;

    case 'demo-evofedagg-ccnc':
      return <EvoFedAggCcncDemo staticPrint={staticPrint} />;

    case 'tpu-bifurcation-roadmap':
      return <TpuBifurcationRoadmapWidget />;

    case 'tpu-eval-architectures':
      return <TpuEvalArchitecturesWidget />;

    case 'demo-tpu-pallas':
      return <MaxwellDemonPallasDemo staticPrint={staticPrint} />;

    case 'zero-leak-tpu-automation':
      return <ZeroLeakTpuAutomationWidget />;

    case 'golem-governance':
      return (
        <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/75 border border-emerald-500/35 p-5 xl:p-6 gap-3">
          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm xl:text-base font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" /> Design-Time Evolution → Auditable Zero-LLM Edge Code
              </span>
              <span className="text-xs sm:text-sm font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/35 shrink-0">
                Anti-Solaris Pattern
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 xl:p-5 font-mono space-y-2.5">
              <div className="text-xs sm:text-sm xl:text-[15px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>// Discovered offline by AlphaEvolve (Evo-FedAgg G3):</span>
                <a
                  href="https://ccnc2027.ieee-ccnc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 underline decoration-cyan-400/45 underline-offset-2"
                >
                  IEEE CCNC 2027 (DOI after conference) <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="text-emerald-300 text-base sm:text-lg xl:text-xl 2xl:text-[1.35rem] font-bold">
                D2 = np.maximum(0.0, sq + sq.T - 2.0 * (U @ U.T))
              </div>
              <div className="text-cyan-300 text-sm xl:text-base leading-snug">
                → Provably (α, Δ_H)-Byzantine-resilient &amp; Sybil-immune • 8.4 ms on Raspberry Pi 4 • $0 runtime LLM!
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-center">
                <div className="text-base xl:text-lg font-bold text-cyan-300">Antigravity Diff &amp; Sandbox Gate</div>
                <p className="text-sm xl:text-[15.5px] 2xl:text-base text-slate-200 mt-1.5 leading-snug">
                  <FormattedText text="Human engineers inspect exact `# EVOLVE-BLOCK` diffs, mathematical proofs, and unit tests before merge." />
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-center">
                <div className="text-base xl:text-lg font-bold text-purple-300">Gemini Model Armor + TPU Trap</div>
                <p className="text-sm xl:text-[15.5px] 2xl:text-base text-slate-200 mt-1.5 leading-snug">
                  Enforces Agent Identity, prompt-injection shields, and zero-leak Spot TPU teardown.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-950/35 border border-emerald-500/35 px-4 py-3 text-sm sm:text-base xl:text-[1.05rem] font-mono text-emerald-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
            Zero-shot generalizes to unseen ALIE (71.8%) &amp; 40% Sign-Flip (68.2% vs 9.6% FedAvg)!
          </div>
        </div>
      );

    case 'closing-blueprint':
      return (
        <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/80 border border-cyan-500/40 p-4 xl:p-5 overflow-hidden gap-3">
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-3">
            <div className="relative h-44 xl:h-52 w-full rounded-xl overflow-hidden border border-white/15 bg-[#060911] shrink-0">
              <img
                src="media/slides/slide-15-blueprint.png"
                alt="Stuttgart Fernsehturm Futuristic AI Dawn"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-transparent px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm xl:text-base font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4" /> Companion Repository, Codelab &amp; Quickstart
                </span>
                <span className="text-xs sm:text-sm font-mono text-emerald-300 font-semibold">
                  Stuttgart • Open-Source Kit
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 font-mono text-xs sm:text-sm xl:text-[15.5px] 2xl:text-base space-y-1.5 text-slate-200 overflow-x-auto">
              <div className="text-slate-400"># Clone deck, Zero-Leak Spot TPU script &amp; Python demos:</div>
              <div className="text-cyan-300">git clone https://github.com/Unisvet/devfest-agents-evolution</div>
              <div className="text-emerald-300">uv run --with numpy python demos/02_circle_packing_codelab_demo.py</div>
              <div className="text-purple-300">uv run --with numpy python demos/03_ccnc2027_evofedagg_demo.py</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 p-3.5 transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm sm:text-base xl:text-lg font-bold text-emerald-200">Official Codelab</div>
                  <div className="text-xs sm:text-sm text-slate-200 font-mono truncate">alphaevolve-on-google-cloud-1</div>
                </div>
                <ExternalLink className="w-5 h-5 text-emerald-300 shrink-0" />
              </a>

              <a
                href="https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 p-3.5 transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm sm:text-base xl:text-lg font-bold text-cyan-200">Google Cloud AI Repo</div>
                  <div className="text-xs sm:text-sm text-slate-200 font-mono truncate">alphaevolve-on-googlecloud</div>
                </div>
                <ExternalLink className="w-5 h-5 text-cyan-300 shrink-0" />
              </a>

              <a
                href="https://github.com/Unisvet/devfest-agents-evolution"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 p-3.5 transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm sm:text-base xl:text-lg font-bold text-white">Session GitHub Repo</div>
                  <div className="text-xs sm:text-sm text-slate-200 font-mono truncate">Unisvet/devfest-agents-evolution</div>
                </div>
                <ExternalLink className="w-5 h-5 text-cyan-300 shrink-0" />
              </a>

              <a
                href="https://ccnc2027.ieee-ccnc.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 p-3.5 transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm sm:text-base xl:text-lg font-bold text-purple-200">IEEE CCNC 2027</div>
                  <div className="text-xs sm:text-sm text-slate-200 font-mono truncate">Evo-FedAgg • DOI after conference</div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-300 shrink-0" />
              </a>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-sm xl:text-base text-slate-200">
            <span className="flex items-center gap-2 font-semibold">
              <Cpu className="w-5 h-5 text-cyan-400" /> Vielen Dank, DevFest Stuttgart 2026!
            </span>
            <span className="font-mono font-semibold text-emerald-300">Questions &amp; Live Exploration →</span>
          </div>
        </div>
      );
  }
};
