---
name: tpu-pallas-optimizer
description: >-
  Use this skill when porting PyTorch workloads to TorchTPU (.to("tpu")), designing or
  auto-tuning fused Pallas VMEM kernels (@torch.tpu.pallas.jax_op), or modeling hardware
  rooflines for Google Cloud TPU v6e Trillium, v7 Ironwood, TPU-8t, and TPU-8i.
---

# Google Cloud TPU, TorchTPU & Pallas Optimizer Skill

Teaches the agent how to accelerate agentic and evolutionary inner loops on modern Google Cloud TPUs (based on **Google Cloud Tech's *The Future of AI Infrastructure***, **JAX `jit`/`vmap`**, **TorchTPU**, and **Pallas**).

## 1. Hardware Reference Profiles (2026 Roadmap)

| Accelerator | Precision & Peak Compute | On-Chip HBM & Bandwidth | Pod Scale & Interconnect | Primary Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Trillium (v6e)** | `918 BF16 TFLOPS` | `32 GB HBM` (`1.6 TB/s`) | `256 chips` ICI | Cost-efficient Spot TPU AlphaEvolve evaluation & serving (`--version=v2-alpha-tpuv6e`) |
| **Ironwood (TPU v7)** | **`4,614 FP8 TFLOPS`** (`2,307 BF16`) | **`192 GB HBM3E`** (`7.4 TB/s`) | **`9,216 chips`** (`42.5 ExaFLOPS` OCS) | Massive KV-cache inference & multi-agent swarms |
| **`TPU-8t` / `8tx`** | 8th-Gen Training Bifurcation | **`2 PB`** pod memory + `10 TB/s` Lustre | **`9,600 chips/pod`**, `134k` global Virgo | Frontier pre-training + AMD EPYC confidential compute |
| **`TPU-8i`** | 8th-Gen Inference Bifurcation | Agent-optimized SRAM/HBM hierarchy | Agent-native GKE Inference Gateway | Continuous reasoning & evolutionary loops (`+80%` perf/\$) |

## 2. Three-Step Optimization Workflow

1. **Step 1 — Native Eager Port (`TorchTPU` or `JAX vmap`):**
   Replace legacy `torch_xla` boilerplate with standard PyTorch eager backend (`google-pytorch/torch_tpu`) or vectorized `jax.vmap(jax.jit(eval_fn))`:
   ```python
   device = torch.device("tpu:0" if hasattr(torch, "tpu") else "cpu")
   U = U.to(device)
   ```
2. **Step 2 — VMEM Scratchpad Fusion (`Pallas`):**
   Eliminate HBM round-trips (`O(N^2)` intermediate pairwise distance matrix materialization in `Evo-FedAgg` Gram filtering) by fusing `sq + sq.T - 2*(U @ U.T)` and Top-$K$ nearest-neighbor reductions inside on-chip **VMEM** tiles aligned to `128x128` or `256x256` systolic MXU boundaries.
3. **Step 3 — Zero-Leak Spot TPU Evaluation:**
   Always run remote TPU benchmarks via `scripts/run_alphaevolve_spot_tpu.sh` in compliance with `.agents/rules/tpu-lifecycle.md`.
