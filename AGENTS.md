# AGENTS.md — Workspace Instructions for Google Antigravity 2.0

Welcome to **`devfest-agents-evolution`** — the companion repository, interactive presentation deck, multi-agent skill library, and evolutionary benchmark suite for **DevFest Stuttgart 2026**:
> *"From Agents to Evolution: Scaling Antigravity & AlphaEvolve toward AGI on Google Cloud TPUs"*

## Repository Map

- `web/` — Unified React 19 + TypeScript + Vite + Tailwind CSS interactive 18-slide presentation deck, live visual sandboxes (`n=26` Circle Packing Codelab, IEEE CCNC 2027 `Evo-FedAgg`, `TorchTPU`/`Pallas` Maxwell's Demon VMEM simulator, TPU Evaluator Architectures & Zero-Leak Automation), learning hub, and 16:9 organizer PDF print view.
- `.agents/` — Workspace-scoped **Antigravity 2.0** customizations:
  - `.agents/skills/` — Project `SKILL.md` packages (`alphaevolve-experiment-runner`, `tpu-pallas-optimizer`, `devfest-slide-architect`, `lem-agi-dialectic`), complementing the 6 official `alpha_evolve_*` skills installed via `ae skills install --tool Antigravity`.
  - `.agents/agents/` — Specialized subagent role specifications (*Systems Architect*, *Evo-RedTeam Auditor*, *TPU & Pallas Kernel Engineer*, *3D & Audio Media Director*).
  - `.agents/rules/` — Project architectural, security, and **Zero-Leak Spot Cloud TPU Lifecycle** (`tpu-lifecycle.md`) guardrails.
- `demos/` — Runnable Python scripts for the `google-antigravity` SDK, visual `n=26` Circle Packing (`# EVOLVE-BLOCK-START`), IEEE CCNC 2027 `Evo-FedAgg` Byzantine-resilient aggregation, and 3-tier `JAX` / `TorchTPU` + `Pallas` evaluators.
- `scripts/` — Self-cleaning `trap` shell wrapper (`run_alphaevolve_spot_tpu.sh`) for zero-leak ephemeral Spot TPU execution.
- `doc/` *(gitignored, local-only)* — Private local notes, speaker runbooks, and manuscript drafts; never committed or pushed to GitHub.

## Core Engineering Rules

1. **Zero Secret Leakage & Public Hygiene:** Never hardcode real GCP project IDs, service-account emails, or API keys in tracked source files. Never commit `doc/`, unpublished paper PDFs, or speaker notes to GitHub. Always read secrets from `.env` and keep `.env.example` clean for conference attendees.
2. **Research Case-Study Scope:** For our own practical research usage of AlphaEvolve, reference **only** our [IEEE CCNC 2027](https://ccnc2027.ieee-ccnc.org/) research case study (**Evo-FedAgg**: *Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL*; DOI will be obtained after the conference).
3. **Dual-Mode Stage Safety:** Every demo in `web/` and `demos/` MUST support both `prerecorded` (deterministic zero-latency stage/offline replay) and `live` (real GCP / `ae` CLI / Antigravity SDK execution) modes.
4. **PDF Backup Parity:** Whenever adding or modifying a slide in `web/src/data/slidesData.ts` or `web/src/components/`, ensure `PrintPdfDeckView.tsx` and `@media print` styles render cleanly in 16:9 landscape without scrollbars or clipped text.
5. **Python & TPU Environments:** Never run global `pip install` (always use `uv` or `.venv`), and always follow `.agents/rules/tpu-lifecycle.md` when provisioning Cloud TPUs.
