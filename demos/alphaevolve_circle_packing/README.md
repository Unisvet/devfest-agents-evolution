# AlphaEvolve Cloud Experiment Starter — `n = 26` Circle Packing

This folder contains the **exact two files** you author to launch a real **Google Cloud AlphaEvolve (`ae`)** discovery experiment:

1. **`program.py`** — Naive Gen 0 concentric-ring seed (`sum_of_radii = 0.9598`) wrapped in `# EVOLVE-BLOCK-START ... # EVOLVE-BLOCK-END`.
2. **`evaluate.py`** — Strict deterministic geometric verifier (`verify_circle_packing`) checking zero overlaps and `[0, 1]^2` containment, returning `sum_of_radii` or `-inf` + an actionable error insight.

## 1. Verify the Seed Locally (< 1 second)

```powershell
uv run --project demos python demos/alphaevolve_circle_packing/evaluate.py
```

Expected output: `"valid": true, "score": 0.9598`.

## 2. Launch Real Evolutionary Discovery on Google Cloud (`ae` CLI)

Follow the official [Google Cloud AlphaEvolve Codelab](https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0) with `program.py` and `evaluate.py`:

- **Cloud LLM Mutation (`acquire_programs`):** Google Cloud Discovery Engine mutates *only* inside `# EVOLVE-BLOCK-START ... # EVOLVE-BLOCK-END` using `gemini-4-argon` (Cloud default) / `gemini-3.8-flash` / `gemini-3.1-pro-preview`.
- **User-Controlled Evaluation (`submit_program_evaluations`):** Your laptop, Cloud Batch worker, or Spot TPU executes `evaluate.py` and submits numeric scores + textual failure insights back to the MAP-Elites islands.
- **Typical Cloud Discovery Time:** ~15–30 minutes over 50–100+ generations to evolve hybrid staggered-hex + SciPy `SLSQP` packings approaching/beating David Cantrell's 2011 human record (`2.6340`) toward AlphaEvolve's `2.63586` SOTA.

## 3. Fast Stage Time-Lapse (~1 second)

To verify 4 evolutionary checkpoints (`Gen 0 → Gen 5 → Gen 16 → Gen 40 = 2.6307`) with ANSI bar charts & Braille 2D plots in your terminal:

```powershell
uv run --project demos python demos/02_circle_packing_codelab_demo.py
```
