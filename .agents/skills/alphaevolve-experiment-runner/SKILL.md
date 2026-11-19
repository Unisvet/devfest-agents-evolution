---
name: alphaevolve-experiment-runner
description: >-
  Use this skill when designing, running, or exporting Google AlphaEvolve evolutionary
  algorithm discovery loops (# EVOLVE-BLOCK-START seed + Gemini ensemble mutation +
  3-tier deterministic fitness verifier) locally or via Discovery Engine (`ae` CLI).
---

# AlphaEvolve Experiment Runner Skill

Guides the agent in constructing and executing evolutionary code-synthesis experiments compatible with **`Google-Cloud-AI/alphaevolve-on-googlecloud`**, the official **`ae` CLI** (`alpha_evolve_orchestrator`), and our submitted IEEE CCNC 2027 **Evo-FedAgg** benchmark.

## 1. Core Four-Component Contract

Every AlphaEvolve experiment in `demos/` must cleanly separate:
1. **Seed Program (`# EVOLVE-BLOCK-START` ... `# EVOLVE-BLOCK-END`):** Minimal, self-contained baseline Python/JAX/TorchTPU function with explicit type signatures (e.g., Codelab `n=26` circle packing `construct_packing()` or unhardened `FedAvg` `execute_aggregation()`).
2. **Three-Tier Deterministic Evaluator (`evaluate`):**
   - **Tier 1 (Validation):** Does the candidate parse, compile, and return valid tensor shapes without `NaN`? (Return `-inf` + actionable `AlphaEvolveEvaluationInsight` on failure so Gemini self-repairs.)
   - **Tier 2 (Verification):** Does it satisfy hard mathematical/security constraints (zero circle overlaps, or MITRE ATLAS Byzantine resilience across Gaussian, Sign-Flip, and Sybil attacks)?
   - **Tier 3 (Performance Benchmark):** High-precision latency/throughput timer on CPU, `JAX vmap`, or `TorchTPU` + `Pallas`.
3. **Mutation Engine:**
   - **Live Cloud Mode (`ae experiment run` / `DEMO_EXECUTION_MODE=live`):** Connects to Google Cloud Discovery Engine (`gemini-3.5-flash` exploration + `gemini-3.1-pro-preview` deep synthesis).
   - **Stage-Safe Mode (`DEMO_EXECUTION_MODE=prerecorded`):** Executes verified evolutionary generation checkpoints deterministically offline with zero API latency.
4. **Telemetry Exporter:** Writes verified coordinates and fitness trajectories to `web/src/data/` for live visualization in `web/`.

## 2. Execution & Validation Steps

1. Run the visual Codelab Circle Packing (`n=26`) evolution demo:
   ```powershell
   uv run --with numpy python demos/02_circle_packing_codelab_demo.py
   ```
2. Run the IEEE CCNC 2027 **Evo-FedAgg** evolutionary trajectory & BLAS benchmark:
   ```powershell
   uv run --with numpy python demos/03_ccnc2027_evofedagg_demo.py
   ```
3. Run the 3-Tier JAX / TorchTPU evaluator harness:
   ```powershell
   uv run --with numpy python demos/04_jax_torchtpu_evaluator_demo.py
   ```
