import { LearningResource } from '../types/presentation';

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'codelab-alphaevolve-gcp',
    category: 'AlphaEvolve & AGI',
    title: 'Official Codelab: Getting Started with AlphaEvolve on Google Cloud',
    provider: 'Google Developers Codelabs',
    url: 'https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0',
    badge: 'Hands-On Codelab (#1 Start Here)',
    description:
      'Step-by-step hands-on lab walking through `# EVOLVE-BLOCK-START`, constructor-based circle packing for n=26 circles (`0.96 -> 2.54+`), and Discovery Engine evaluation loops.',
  },
  {
    id: 'github-alphaevolve-on-googlecloud',
    category: 'AlphaEvolve & AGI',
    title: 'Official Repository: Google-Cloud-AI/alphaevolve-on-googlecloud (`ae` CLI & 6 Skills)',
    provider: 'GitHub • Google-Cloud-AI',
    url: 'https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud',
    badge: '6 Reference Demos + ae CLI',
    description:
      'Official Google Cloud AI reference implementations (`circle_packing`, `tsp`, `signal_processing`, `adaptive_sort`, `llm_fine_tuning`), `ae` CLI, and the 6 `alpha_evolve_*` agent skills.',
  },
  {
    id: 'yt-future-ai-infra',
    category: 'Keynote & Silicon',
    title: 'The Future of AI Infrastructure (TPU Ironwood, TPU-8t/8i & AI Hypercomputer)',
    provider: 'Google Cloud Tech (YouTube Live)',
    url: 'https://www.youtube.com/live/pabDkNR7jIs',
    featuredVideoId: 'pabDkNR7jIs',
    badge: 'Featured Keynote',
    description:
      'Deep-dive into how Google Cloud co-designs Ironwood (TPU v7), bifurcated 8th-Gen TPUs (TPU-8t for 134k-chip Virgo training & TPU-8i for +80% perf/$ agentic inference), and Agent-Native GKE.',
  },
  {
    id: 'blog-eighth-gen-tpu-agentic',
    category: 'Keynote & Silicon',
    title: 'Eighth-Generation TPU for the Agentic Era (TPU 8t, 8i, 8tx & 8i Max)',
    provider: 'Google Keyword Blog',
    url: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/eighth-generation-tpu-agentic-era/',
    badge: '8th-Gen TPU Launch',
    description:
      'Official announcement introducing Google’s bifurcated 8th-generation TPU lineup built for continuous multi-step agentic reasoning, low-latency serving, and ExaFLOP-scale training.',
  },
  {
    id: 'blog-tpu-8t-8i-deep-dive',
    category: 'Keynote & Silicon',
    title: 'TPU 8t and TPU 8i Technical Deep Dive (121 EF Training & 11.6 EF Inference)',
    provider: 'Google Cloud Blog',
    url: 'https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive',
    badge: 'Silicon Architecture Deep Dive',
    description:
      'Hardware breakdown of TPU 8t (12.6 FP4 PF/chip, 121 EF 9,600-chip superpod, Virgo 134k-chip fabric) and TPU 8i (10.1 FP4 PF/chip, 288 GB HBM3e @ 8.6 TB/s, 384 MB SRAM, Boardfly & CAE).',
  },
  {
    id: 'devfest-stuttgart',
    category: 'Keynote & Silicon',
    title: 'DevFest Stuttgart 2026 — Official Conference Hub',
    provider: 'GDG Stuttgart',
    url: 'https://devfest.gdg-stuttgart.dev/',
    badge: 'Nov 21, 2026 • Stuttgart',
    description:
      'Flagship single-track GDG Stuttgart conference covering Artificial Intelligence, Cloud-Native Engineering, and Software Security.',
  },
  {
    id: 'torchtpu-pallas',
    category: 'Keynote & Silicon',
    title: 'TorchTPU & JAX Pallas Custom VMEM Kernels',
    provider: 'Google & PyTorch Open Source',
    url: 'https://docs.jax.dev/en/latest/pallas/index.html',
    badge: 'JAX & TorchTPU',
    description:
      'Native eager PyTorch `.to("tpu")` execution alongside JAX `jit`/`vmap` and Pallas block-fused VMEM scratchpad programming for 256×256 systolic MXUs.',
  },
  {
    id: 'antigravity-docs',
    category: 'Antigravity & Agents',
    title: 'Google Antigravity 2.0 Documentation (Desktop, CLI, Plugins, Skills & Rules)',
    provider: 'Google Antigravity',
    url: 'https://antigravity.google/docs',
    badge: 'Platform Docs',
    description:
      'Authoritative guide to Antigravity 2.0 parallel subagents, `agy plugin install google-cloud-developer`, `.agents/rules/`, `SKILL.md` packaging, and Terminal Sandboxes.',
  },
  {
    id: 'antigravity-sdk',
    category: 'Antigravity & Agents',
    title: 'Antigravity Python SDK (`google-antigravity`)',
    provider: 'GitHub • google-antigravity',
    url: 'https://github.com/google-antigravity/antigravity-sdk-python',
    badge: 'Python SDK',
    description:
      'Programmatically spawn, sandbox, and orchestrate parallel agents in Python pipelines while streaming `response.thoughts` and `response.tool_calls` in real time.',
  },
  {
    id: 'gemini-enterprise-agents',
    category: 'Antigravity & Agents',
    title: 'Gemini Enterprise Agent Platform (ADK, A2A & Model Armor)',
    provider: 'Google Cloud',
    url: 'https://cloud.google.com/products/agentspace',
    badge: 'Enterprise Governance',
    description:
      'Build, scale, govern, and optimize production multi-agent topologies using the Agent Development Kit (ADK), Agent2Agent (A2A) protocol, and Model Armor guardrails.',
  },
  {
    id: 'google-adk',
    category: 'Antigravity & Agents',
    title: 'Agent Development Kit (ADK) — Build & Orchestrate Multi-Agent Systems',
    provider: 'Google Open Source',
    url: 'https://adk.dev/',
    badge: 'ADK Framework',
    description:
      'Code-first open-source toolkit for building, evaluating, and deploying composable multi-agent architectures with native tool calling, streaming, and Gemini integration.',
  },
  {
    id: 'a2a-protocol',
    category: 'Antigravity & Agents',
    title: 'Agent2Agent (A2A) Protocol — Open Multi-Agent Interoperability Standard',
    provider: 'Linux Foundation • A2A Project',
    url: 'https://a2a-protocol.org/',
    badge: 'Open Standard',
    description:
      'Open protocol enabling autonomous agents across different frameworks and vendors to discover capabilities, exchange tasks, and collaborate securely.',
  },
  {
    id: 'antigravity-mcp-rules',
    category: 'Antigravity & Agents',
    title: 'Antigravity MCP Servers & Workspace Rules (.agents/rules/)',
    provider: 'Google Antigravity Docs',
    url: 'https://antigravity.google/docs/mcp',
    badge: 'MCP & Guardrails',
    description:
      'Connect external Model Context Protocol (MCP) tool servers and enforce persistent workspace invariants via `.agents/rules/*.md` and terminal sandboxes.',
  },
  {
    id: 'google-cloud-model-armor',
    category: 'Antigravity & Agents',
    title: 'Google Cloud Model Armor — Technical Documentation',
    provider: 'Google Cloud Security',
    url: 'https://cloud.google.com/model-armor/docs',
    badge: 'Runtime Security',
    description:
      'Technical reference for prompt-injection defense, jailbreak screening, sensitive data sanitization, and runtime safety templates protecting AI models and agent pipelines.',
  },
  {
    id: 'google-cloud-developer-plugin',
    category: 'Antigravity & Agents',
    title: 'Google Cloud Developer Plugin (`google/skills`)',
    provider: 'GitHub • google/skills',
    url: 'https://github.com/google/skills/tree/main/plugins/cloud/google-cloud-developer',
    badge: 'Antigravity Plugin',
    description:
      'Official plugin bundle installed via `agy plugin install google-cloud-developer` — provides safe `gcloud` guardrails, IAM/ADC recipes, and live Developer Knowledge MCP grounding.',
  },
  {
    id: 'alphaevolve-deepmind',
    category: 'AlphaEvolve & AGI',
    title: 'AlphaEvolve: A Gemini-Powered Coding Agent for Designing Advanced Algorithms',
    provider: 'Google DeepMind & Google Cloud',
    url: 'https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/',
    badge: 'DeepMind Research',
    description:
      'How ensemble Gemini models + automated verifiers recovered 0.7% of Google Borg fleet compute, accelerated training kernels by 23%, and reached GA on Gemini Enterprise.',
  },
  {
    id: 'levels-of-agi',
    category: 'AlphaEvolve & AGI',
    title: 'Levels of AGI: Operationalizing Progress on the Path to AGI (Morris et al.)',
    provider: 'Google DeepMind (arXiv / ICML)',
    url: 'https://arxiv.org/abs/2311.02462',
    badge: 'AGI Taxonomy',
    description:
      'Foundational two-axis matrix separating Performance × Generality (Emerging → Superhuman) from Deployment Autonomy (Tool → Autonomous Agent).',
  },
  {
    id: 'lem-golem-solaris',
    category: 'Philosophy & Research',
    title: 'Stanisław Lem — Golem XIV (1981 / Foreword 2027) & Solaris (1961)',
    provider: 'Philosophical Literature',
    url: 'https://en.wikipedia.org/wiki/Golem_XIV',
    badge: '2027 Prophecy',
    description:
      'Contrasting Golem XIV’s 2027 autoevolutionary intellect (which converses with humanity in clear symbolic lectures) against Solaris’s inscrutable black-box ocean.',
  },
  {
    id: 'ieee-ccnc-2027-evofedagg',
    category: 'Philosophy & Research',
    title: 'IEEE CCNC 2027 — Evo-FedAgg Research Venue (DOI Available After Conference)',
    provider: 'IEEE Consumer Communications & Networking Conference 2027',
    url: 'https://ccnc2027.ieee-ccnc.org/',
    badge: 'Conference • DOI After Event',
    description:
      'Official conference hub for IEEE CCNC 2027 featuring our Evo-FedAgg case study ("Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL"). The official IEEE DOI will be obtained after the conference.',
  },
  {
    id: 'companion-github-repo',
    category: 'Philosophy & Research',
    title: 'Companion GitHub Repo & Evo-FedAgg Open-Source Demo Suite',
    provider: 'Svetlana Meissner & Peter Langendoerfer • BTU Cottbus-Senftenberg',
    url: 'https://github.com/Unisvet/devfest-agents-evolution',
    badge: 'Open-Source Code & Demos',
    description:
      'Full 18-slide interactive deck, zero-leak Spot TPU wrapper (`scripts/run_alphaevolve_spot_tpu.sh`), Codelab n=26 Circle Packing visualizer, and `Evo-FedAgg` vectorized BLAS benchmark.',
  },
];
