import React, { useState } from 'react';
import { Check, Copy, Cpu, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { TPU_EVAL_ARCHITECTURES } from '../../data/demoTraces';
import { FormattedText } from '../FormattedText';

export const TpuEvalArchitecturesWidget: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(1); // Default Option B: Spot TPU VM
  const current = TPU_EVAL_ARCHITECTURES[selectedIdx];

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-purple-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {TPU_EVAL_ARCHITECTURES.map((opt, idx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition border ${
                  selectedIdx === idx
                    ? 'bg-purple-500/25 text-purple-200 border-purple-400/60'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {opt.tierLabel}
              </button>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-mono font-semibold text-emerald-300">{current.costProfile}</span>
        </div>

        <div className="mt-3 flex-1 flex flex-col justify-between rounded-xl bg-slate-950/90 border border-purple-500/25 p-4 gap-3 min-h-0">
          <div>
            <h4 className="text-base sm:text-lg xl:text-xl font-bold text-white leading-snug">
              <FormattedText text={current.title} />
            </h4>
            <p className="text-sm sm:text-base text-cyan-200/95 mt-0.5 leading-snug">
              <FormattedText text={current.subtitle} />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2.5">
              <div className="text-xs sm:text-sm text-slate-400">Parallelism</div>
              <div className="text-sm sm:text-base text-emerald-300 font-bold mt-0.5">
                <FormattedText text={current.concurrency} />
              </div>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2.5">
              <div className="text-xs sm:text-sm text-slate-400">JAX / PyTorch Stack</div>
              <div className="text-sm sm:text-base text-purple-200 font-bold mt-0.5">
                <FormattedText text={current.frameworkStack} />
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base xl:text-[1.04rem] text-slate-200 leading-snug">
            <FormattedText text={current.whenToUse} />
          </p>

          <div className="space-y-2">
            {current.flowSteps.map((step, i) => (
              <div
                key={step}
                className="rounded-xl bg-slate-900/75 border border-slate-800/90 px-3.5 py-2 text-xs sm:text-sm xl:text-[15px] font-mono text-slate-100 flex items-start gap-2.5 leading-snug"
              >
                <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                <span>
                  <FormattedText text={step} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official 3-Tier Evaluator Cascade Bar */}
      <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/35 p-3 shrink-0">
        <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-4 h-4" /> Official 3-Tier Evaluator Cascade (alpha_evolve_consultant)
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm xl:text-[15px] font-mono font-semibold">
          <div className="rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 text-cyan-300 text-center">
            1. Validate (AST/Shape)
          </div>
          <div className="rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 text-amber-300 text-center">
            2. Verify (CPU Gate)
          </div>
          <div className="rounded-lg bg-slate-950 px-3 py-1.5 border border-emerald-500/45 text-emerald-300 text-center">
            3. Profile (tpu:0 MXU)
          </div>
        </div>
      </div>
    </div>
  );
};

const AUTOMATION_SNIPPETS = {
  install: `# 1. Install Official Google Cloud plugin in Antigravity CLI
agy plugin install google-cloud-developer

# 2. Install official 'ae' CLI + all 6 AlphaEvolve skills
uv tool install \\
  "git+https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud.git#subdirectory=skills"
ae version
ae skills install --tool Antigravity
# -> orchestrator, experiment_design, runner, monitor,
#    post_experiment, consultant`,

  rule: `# File: .agents/rules/tpu-lifecycle.md (Auto-loaded by AGY 2.0)
1. Pre-flight: run 'gcloud compute tpus tpu-vm list'
   and confirm 0 orphaned TPUs exist before provisioning.
2. Provision with '--spot' (~60-70% savings) + Trillium runtime:
   '--accelerator-type=v6e-1 --version=v2-alpha-tpuv6e'
   (NOT tpu-ubuntu2204-base).
3. Wrap execution in 'trap cleanup EXIT ERR INT TERM' to SCP
   './local_outputs' BEFORE 'tpu-vm delete --quiet || true'.
4. Re-run 'tpu-vm list' after exit -> verify 0 active items.`,

  wrapper: `#!/usr/bin/env bash
set -euo pipefail
TPU_NAME="alphaevolve-tpu"; ZONE="europe-west4-a"

cleanup() {
  gcloud compute tpus tpu-vm scp \${TPU_NAME}:~/ae/outputs ./local_outputs \\
    --project="\${GCP_PROJECT_ID}" --zone="\${ZONE}" --recurse --quiet || true
  gcloud compute tpus tpu-vm delete "\${TPU_NAME}" \\
    --project="\${GCP_PROJECT_ID}" --zone="\${ZONE}" --quiet || true
}
trap cleanup EXIT ERR INT TERM

gcloud compute tpus tpu-vm create "\${TPU_NAME}" --project="\${GCP_PROJECT_ID}" \\
  --zone="\${ZONE}" --accelerator-type=v6e-1 --version=v2-alpha-tpuv6e --spot
gcloud compute tpus tpu-vm scp ./demos \${TPU_NAME}:~/ae/ --zone="\${ZONE}" --recurse
gcloud compute tpus tpu-vm ssh "\${TPU_NAME}" --zone="\${ZONE}" \\
  --command="python3 ~/ae/demos/04_jax_torchtpu_evaluator_demo.py --output-dir ~/ae/outputs"`,
};

export const ZeroLeakTpuAutomationWidget: React.FC = () => {
  const [tab, setTab] = useState<'install' | 'rule' | 'wrapper'>('wrapper');
  const [copied, setCopied] = useState<boolean>(false);

  const code = AUTOMATION_SNIPPETS[tab];

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-emerald-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setTab('install')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold border transition ${
                tab === 'install'
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              1. Install Plugin &amp; 6 Skills
            </button>
            <button
              type="button"
              onClick={() => setTab('rule')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold border transition ${
                tab === 'rule'
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/60'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              2. tpu-lifecycle.md
            </button>
            <button
              type="button"
              onClick={() => setTab('wrapper')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold border transition ${
                tab === 'wrapper'
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/60'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              3. Spot TPU trap Wrapper
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-semibold bg-slate-950 hover:bg-slate-800 text-slate-100 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="mt-3 flex-1 flex flex-col rounded-xl bg-slate-950 border border-slate-800 p-4 min-h-0">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300 mb-2.5 shrink-0">
            <span className="flex items-center gap-2 text-emerald-300 font-bold">
              <Terminal className="w-4 h-4" />
              {tab === 'install'
                ? 'Antigravity CLI + ae Skills Setup'
                : tab === 'rule'
                  ? '.agents/rules/tpu-lifecycle.md'
                  : 'scripts/run_alphaevolve_spot_tpu.sh'}
            </span>
            <span className="text-cyan-300 font-semibold">Verified on AGY + gcloud</span>
          </div>
          <pre className="flex-1 text-xs sm:text-[13.5px] xl:text-[14.5px] 2xl:text-[15.5px] leading-relaxed font-mono text-slate-100 whitespace-pre-wrap break-words">
            {code}
          </pre>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-950/35 border border-emerald-500/35 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm xl:text-[15px] font-mono text-emerald-200 shrink-0">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <FormattedText text="Post-Exit Audit: `gcloud compute tpus tpu-vm list` → `Listed 0 items.`" />
        </span>
        <span className="text-cyan-300 font-bold flex items-center gap-1.5 shrink-0">
          <Cpu className="w-4 h-4" /> Zero Billing Leak
        </span>
      </div>
    </div>
  );
};
