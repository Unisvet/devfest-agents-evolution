import { SwarmTraceEvent, TpuEvalArchOption, TpuGenerationSpec } from '../types/presentation';

export const SWARM_TRACE_EVENTS: SwarmTraceEvent[] = [
  {
    step: 1,
    agentId: 'architect-agent',
    station: 'Station 1 • Lead Systems Architect',
    kind: 'thought',
    latencyMs: 295,
    message:
      'Profiling Edge-Cloud FL gateway bottleneck (N=200 clients, d=7,850): unhardened FedAvg collapses under 30% Byzantine corruption (S=0.61), while sequential Multi-Krum stalls edge gateways for 17.52 s per round.',
  },
  {
    step: 2,
    agentId: 'redteam-auditor-agent',
    station: 'Station 2 • MITRE ATLAS Red-Team',
    kind: 'tool_call',
    toolName: 'mcp_atlas_byzantine_stress_probe',
    latencyMs: 440,
    message:
      'Probed Coordinate Trimmed-Mean (20%) across K=3 MITRE ATLAS attacks (Gaussian AML.T0031, Sign-Flip AML.T0018, Coordinated Sybil AML.T0031): mitigation stalls at M=48.71% (S=25.55) on tight Sybil clusters!',
  },
  {
    step: 3,
    agentId: 'architect-agent',
    station: 'Station 1 • Lead Systems Architect',
    kind: 'tool_call',
    toolName: 'alpha_evolve_orchestrator',
    latencyMs: 250,
    message:
      'Manual heuristics plateau. Generating unhardened `# EVOLVE-BLOCK-START` seed + latency-penalized fitness harness S = 100/(1+E_bar) + 50*M - min(20, 2.0*T_lat) for AlphaEvolve (`ae experiment run`).',
  },
  {
    step: 4,
    agentId: 'tpu-kernel-agent',
    station: 'Station 3 • Zero-Leak TPU & Pallas Engineer',
    kind: 'artifact',
    toolName: 'skill_zero_leak_spot_tpu',
    latencyMs: 365,
    message:
      'Enforcing `.agents/rules/tpu-lifecycle.md`: armed self-cleaning Spot TPU v6e-1 (`v2-alpha-tpuv6e`) trap wrapper + TorchTPU `.to("tpu")` / Pallas VMEM evaluator.',
  },
];

export const TPU_EVAL_ARCHITECTURES: TpuEvalArchOption[] = [
  {
    id: 'local-cpu',
    tierLabel: 'Option A • Local Subprocess',
    title: 'Laptop / Workstation + Cloud Discovery Engine',
    subtitle: 'Zero Cloud Infra — Ideal for Codelab Circle Packing, TSP & Rapid Prototyping',
    concurrency: '4 – 16 local workers',
    costProfile: '$0 evaluator compute',
    frameworkStack: 'Python / NumPy / SciPy (`ae experiment run`)',
    whenToUse: 'Fast pure-math or algorithmic problems (<2s per candidate) like Codelab n=26 Circle Packing or Evo-FedAgg small-d exploration.',
    flowSteps: [
      '`ae` CLI calls `acquire_programs()` on Gemini Enterprise Discovery Engine',
      'Spawns isolated local subprocesses with strict timeout & memory guards',
      'Returns `AlphaEvolveProgramEvaluation` (`scores` + `-inf` diagnostic `insights`)',
    ],
  },
  {
    id: 'spot-tpu-vm',
    tierLabel: 'Option B • Ephemeral Spot TPU VM',
    title: 'Single-Host Spot Cloud TPU (`v6e-1` / Ironwood) via Antigravity Trap',
    subtitle: '60–70% Spot Savings + Zero-Leak Guaranteed Teardown (`run_alphaevolve_spot_tpu.sh`)',
    concurrency: 'Batched `jax.vmap` / `TorchTPU`',
    costProfile: '~65% cheaper (--spot)',
    frameworkStack: 'JAX `jit`/`vmap` or `TorchTPU` `.to("tpu")` + `@pallas_call`',
    whenToUse: 'Evaluating custom Pallas VMEM kernels, matrix/Gram operators, or ML training loops where real systolic MXU & HBM bandwidth decide fitness.',
    flowSteps: [
      'Antigravity checks `tpu-vm list` = 0, provisions `v6e-1` (`v2-alpha-tpuv6e --spot`)',
      'Tier 1 (AST) & Tier 2 (CPU correctness) filter out broken code BEFORE touching TPU!',
      'Tier 3 benchmarks valid kernels on `tpu:0`; `trap EXIT ERR` SCPs `best_program.py` & deletes VM',
    ],
  },
  {
    id: 'cloud-run-pool',
    tierLabel: 'Option C • Serverless Burst',
    title: 'Cloud Run Hermetic Worker Pool',
    subtitle: 'High-Concurrency Sandboxed CPU/GPU Containers Scaling to Zero Between Generations',
    concurrency: '50 – 500+ containers',
    costProfile: 'Per-millisecond burst',
    frameworkStack: 'Docker + gVisor sandbox + Discovery Engine REST workers',
    whenToUse: 'Untrusted LLM-synthesized C++/Rust/Python simulations requiring strong container isolation and burst parallelism.',
    flowSteps: [
      'Controller fans out `acquire_programs()` batch across stateless Cloud Run jobs',
      'Each candidate executes in an isolated gVisor container with zero host state',
      'Scales automatically down to 0 instances the instant the generation finishes',
    ],
  },
  {
    id: 'gke-ray-tpu',
    tierLabel: 'Option D • Pod-Scale TPU Fleet',
    title: 'Agent-Native GKE + KubeRay Multi-Slice TPU Cluster',
    subtitle: 'Production Continuous Evolution on Ironwood v7 & TPU-8i Inference Gateways',
    concurrency: 'Multi-slice TPU Pods',
    costProfile: 'Reserved / Spot GKE Pools',
    frameworkStack: 'KubeRay `@ray.remote(resources={"TPU": 1})` + `vLLM-TorchTPU`',
    whenToUse: 'Enterprise-scale co-evolution of LLM fine-tuning schedules (`llm_fine_tuning` example), Verilog circuits, or multi-host distributed algorithms.',
    flowSteps: [
      'CPU Ray actors run fast Tier 1/2 compile & unit-test gates asynchronously',
      'Only verified candidates schedule onto warm TPU Ray actors (amortizing XLA compile)',
      'Feeds Pareto archive metrics live into Gemini Enterprise observability dashboards',
    ],
  },
];

export const TPU_GENERATIONS_DATA: TpuGenerationSpec[] = [
  {
    id: 'v6e-trillium',
    name: 'Cloud TPU v6e (Trillium)',
    badge: 'Gen 6 • Spot AlphaEvolve Workhorse',
    computeHeadline: '918 BF16 TFLOPS / chip',
    memoryHeadline: '32 GB HBM • 1.6 TB/s',
    scaleHeadline: 'Up to 256 chips (`v2-alpha-tpuv6e`)',
    sweetSpot: 'Cost-efficient `--spot` AlphaEvolve kernel evaluation & LoRA fine-tuning',
    baseKernelMs: 1.35,
    perfPerDollarBoost: '60–70% Spot Savings',
  },
  {
    id: 'v7-ironwood',
    name: 'Cloud TPU v7 (Ironwood)',
    badge: 'Gen 7 • Age of Inference (GA Apr 2026)',
    computeHeadline: '4,614 FP8 TFLOPS / chip',
    memoryHeadline: '192 GB HBM3E • 7.4 TB/s',
    scaleHeadline: '9,216 chips • 42.5 ExaFLOPS OCS Pod',
    sweetSpot: 'Massive multi-agent KV caches, TorchTPU & population-wide AlphaEvolve rollouts',
    baseKernelMs: 0.58,
    perfPerDollarBoost: '2.0x Perf/Watt vs v6e',
  },
  {
    id: 'v8t-training',
    name: 'Cloud TPU-8t / 8tx (Training)',
    badge: 'Gen 8 Bifurcated • Frontier Training',
    computeHeadline: '2 PB Pod Memory + Confidential 8tx',
    memoryHeadline: '10 TB/s Managed Lustre Feed',
    scaleHeadline: '9,600/pod → 134,000 chips via Virgo',
    sweetSpot: 'Compressing frontier Gemini pre-training from months to weeks',
    baseKernelMs: 0.44,
    perfPerDollarBoost: '134k Global Cluster Scale',
  },
  {
    id: 'v8i-inference',
    name: 'Cloud TPU-8i (Inference & Agents)',
    badge: 'Gen 8 Bifurcated • Agentic Era Silicon',
    computeHeadline: 'Inference-Specialized FP8/Sub-Byte MXUs',
    memoryHeadline: 'Ultra-Low-Latency KV & VMEM Hierarchy',
    scaleHeadline: 'Agent-Native GKE Inference Gateway',
    sweetSpot: '20x–50x token multi-agent reasoning & continuous AlphaEvolve loops',
    baseKernelMs: 0.39,
    perfPerDollarBoost: '+80% Perf/$ for Agents',
  },
];

export const AGI_MATRIX_CELLS = [
  {
    level: 'L1 • Emerging',
    percentile: 'Unskilled Human Baseline',
    narrowExample: 'ELIZA (1966), SHRDLU (1972)',
    generalSystem: 'Early Static LLMs (Conversation Only)',
    autonomyTier: 'Autonomy L1: Passive Tool',
    missingForNext: 'Hallucinates without external tools, persistent state, or verifiers.',
  },
  {
    level: 'L2 • Competent',
    percentile: '≥ 50th Percentile Skilled Adults',
    narrowExample: 'Smart Assistants, Domain Classifiers',
    generalSystem: 'Single-Agent ReAct + Basic RAG',
    autonomyTier: 'Autonomy L2: Consultant',
    missingForNext: 'Single-thread context drift; lacks multi-role adversarial critique.',
  },
  {
    level: 'L3 • Expert',
    percentile: '≥ 90th Percentile Skilled Adults',
    narrowExample: 'CodeMender, Specialized Coding Copilots',
    generalSystem: 'Antigravity 2.0 Swarms + MCP + SKILL.md',
    autonomyTier: 'Autonomy L3: Co-Equal Collaborator',
    missingForNext: 'Bound by human-authored heuristics; hits Ada Lovelace’s Note G barrier.',
  },
  {
    level: 'L4–L5 • Virtuoso → Superhuman',
    percentile: '99th – >100% Human Frontier',
    narrowExample: 'AlphaFold, AlphaChip, Evo-FedAgg (99.71% Mitigation)',
    generalSystem: 'Antigravity + AlphaEvolve on TPU-8i / Ironwood',
    autonomyTier: 'Autonomy L4 (Sandboxed + HITL Governed)',
    missingForNext: 'Expands into every domain where we can construct high-fidelity verifiers!',
  },
];
