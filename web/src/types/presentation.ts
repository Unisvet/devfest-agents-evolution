export type NavView = 'deck' | 'demos' | 'resources' | 'pdf';

export type DemoExecutionMode = 'prerecorded' | 'live';

export type SlideWidgetType =
  | 'hero-3d'
  | 'history-tools'
  | 'history-communication'
  | 'triad-comparison'
  | 'lem-agi-matrix'
  | 'agi-levels-grid'
  | 'antigravity-architecture'
  | 'demo-antigravity-swarm'
  | 'alphaevolve-architecture'
  | 'demo-circle-packing'
  | 'demo-evofedagg-story'
  | 'demo-evofedagg-ccnc'
  | 'tpu-bifurcation-roadmap'
  | 'tpu-eval-architectures'
  | 'demo-tpu-pallas'
  | 'zero-leak-tpu-automation'
  | 'golem-governance'
  | 'closing-blueprint';

export interface SlideMetric {
  label: string;
  value: string;
  accent: 'cyan' | 'emerald' | 'purple' | 'amber';
  href?: string;
}

export interface SlideIllustration {
  src: string;
  alt: string;
  caption?: string;
  fit?: 'cover' | 'contain';
}

export interface SlideBulletImage {
  src: string;
  alt: string;
}

export interface SlidePanoramaEpoch {
  step: string;
  label: string;
  era: string;
  insight: string;
  accent: 'amber' | 'cyan' | 'purple' | 'emerald';
}

export interface SlideDefinition {
  id: string;
  number: number;
  act: string;
  timeRange: string;
  title: string;
  subtitle: string;
  layout?: 'split' | 'visual-panorama';
  keyTakeaway: string;
  bullets: string[];
  bulletImages?: Record<number, SlideBulletImage>;
  panoramaEpochs?: SlidePanoramaEpoch[];
  metrics?: SlideMetric[];
  widget: SlideWidgetType;
  illustration?: SlideIllustration;
}

export interface SwarmTraceEvent {
  step: number;
  agentId: string;
  station: string;
  kind: 'thought' | 'tool_call' | 'artifact';
  toolName?: string;
  latencyMs: number;
  message: string;
}

export interface CircleSpec {
  id: number;
  x: number;
  y: number;
  r: number;
}

export interface CirclePackingMilestone {
  generation: number;
  label: string;
  sumOfRadii: number;
  gainPct: number;
  areaCoveragePct: number;
  summary: string;
  code: string;
  circles: CircleSpec[];
}

export interface EvoFedAggGeneration {
  gen: string;
  generation: number;
  status: 'seed' | 'improved' | 'champion' | 'rejected';
  name: string;
  meanError: number;
  mitigationPct: number;
  latencyMs: number;
  fitnessScore: number;
  mnistSignFlipAccPct: number;
  mnistGaussAccPct: number;
  mnistSybilAccPct: number;
  summary: string;
  code: string;
}

export interface TpuGenerationSpec {
  id: 'v6e-trillium' | 'v7-ironwood' | 'v8t-training' | 'v8i-inference';
  name: string;
  badge: string;
  computeHeadline: string;
  memoryHeadline: string;
  scaleHeadline: string;
  sweetSpot: string;
  baseKernelMs: number;
  perfPerDollarBoost: string;
}

export interface TpuEvalArchOption {
  id: string;
  tierLabel: string;
  title: string;
  subtitle: string;
  concurrency: string;
  costProfile: string;
  frameworkStack: string;
  whenToUse: string;
  flowSteps: string[];
}

export interface LearningResource {
  id: string;
  category: 'Keynote & Silicon' | 'Antigravity & Agents' | 'AlphaEvolve & AGI' | 'Philosophy & Research';
  title: string;
  provider: string;
  url: string;
  description: string;
  featuredVideoId?: string;
  badge: string;
}
