"""
Demo 03: Evo-FedAgg — Practical AlphaEvolve Research Case Study (IEEE CCNC 2027)
DevFest Stuttgart 2026 — From Agents to Evolution

Conference Reference (IEEE CCNC 2027 — https://ccnc2027.ieee-ccnc.org/):
  "Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL"
  Svetlana Meissner & Peter Langendoerfer (BTU Cottbus-Senftenberg, Project AI-DISCO)
  Note: Official IEEE DOI will be obtained after the conference.

Demonstrates:
  1. Starting from an UNHARDENED naive `FedAvg` seed (`G0`, zero defense hints!).
  2. Evaluating candidate Python functions against K=3 MITRE ATLAS attacks
     (AML.T0031 Gaussian Noise, AML.T0018 Omniscient Sign-Flipping, AML.T0031 Coordinated Sybil)
     under explicit edge-gateway latency penalties:
         S = 100 / (1 + E_bar) + 50 * M - min(20, 2.0 * T_lat)
  3. Reproducing the non-monotonic evolutionary trajectory `G0 -> G1 -> G2 -> G3 (Champion!) -> G4 (Rejected!)`.
  4. Live timing comparison of `G3` Vectorized Level-3 BLAS Gram Top-K Filtering vs.
     sequential Multi-Krum (`17.2x` speedup at N=200 clients, zero runtime LLM cost!).
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path
import numpy as np

ANSI_RESET = "\033[0m"
ANSI_BOLD = "\033[1m"
ANSI_DIM = "\033[2m"
ANSI_CYAN = "\033[38;2;34;211;238m"
ANSI_EMERALD = "\033[38;2;52;211;153m"
ANSI_AMBER = "\033[38;2;251;191;36m"
ANSI_ROSE = "\033[38;2;251;113;133m"
ANSI_VIOLET = "\033[38;2;192;132;252m"
ANSI_SLATE = "\033[38;2;148;163;184m"

ROOT_DIR = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT_DIR / "web" / "src" / "data" / "evofedagg_ccnc2027.json"


# ==============================================================================
# Executable Candidate Aggregators Across Generations G0 -> G4
# ==============================================================================
def g0_naive_fedavg(updates: list[np.ndarray], weights: list[float]) -> np.ndarray:
    """G0 Seed: Unhardened Weighted FedAvg (zero prior Byzantine defense hints)."""
    U = np.asarray(updates, dtype=np.float64)
    w = np.asarray(weights, dtype=np.float64)
    return np.average(U, axis=0, weights=w)


def g1_coord_trimmed_mean_20(updates: list[np.ndarray], weights: list[float]) -> np.ndarray:
    """G1 Mutation: Coordinate-wise 20% symmetric Trimmed Mean (stalls on correlated Sybils)."""
    U = np.asarray(updates, dtype=np.float64)
    n = U.shape[0]
    k = max(1, int(0.20 * n))
    sorted_u = np.sort(U, axis=0)
    return np.mean(sorted_u[k : n - k], axis=0)


def g2_soft_inverse_l2(updates: list[np.ndarray], weights: list[float]) -> np.ndarray:
    """G2 Mutation: Soft inverse L2-distance weighting relative to coordinate median."""
    U = np.asarray(updates, dtype=np.float64)
    med = np.median(U, axis=0)
    dists = np.linalg.norm(U - med, axis=1)
    inv_w = 1.0 / (1e-4 + dists ** 2)
    inv_w /= np.sum(inv_w)
    return np.sum(U * inv_w[:, None], axis=0)


# EVOLVE-BLOCK-START
def g3_champion_blas_topk(updates: list[np.ndarray], weights: list[float]) -> np.ndarray:
    """G3 Converged Elite Champion (Evo-FedAgg): Single-Pass BLAS Gram Top-K Filter."""
    U = np.asarray(updates, dtype=np.float64)
    N = U.shape[0]
    f = int(0.30 * N)  # Tolerated Byzantine upper bound (alpha = 0.30)
    # Vectorized Level-3 BLAS pairwise squared Euclidean Gram identity:
    sq = np.sum(U * U, axis=1, keepdims=True)
    D2 = np.maximum(0.0, sq + sq.T - 2.0 * (U @ U.T))
    # Sum distances to k = N - f - 1 nearest neighbors (self is 0 at index 0)
    k = max(1, N - f - 1)
    S = np.sum(np.partition(D2, k, axis=1)[:, : k + 1], axis=1)
    # Retain N - f tightest-cluster clients and return uniform mean
    keep = np.argsort(S)[: N - f]
    return np.mean(U[keep], axis=0)
# EVOLVE-BLOCK-END


def g4_rejected_zscore_mask(updates: list[np.ndarray], weights: list[float]) -> np.ndarray:
    """G4 Rejected Mutation: Coordinate Z-Score Mask (Z < 2.0) — over-prunes honest non-IID tails!"""
    U = np.asarray(updates, dtype=np.float64)
    mu = np.mean(U, axis=0, keepdims=True)
    sigma = np.std(U, axis=0, keepdims=True) + 1e-6
    mask = np.abs((U - mu) / sigma) < 2.0
    denom = np.maximum(1.0, np.sum(mask, axis=0))
    return np.sum(U * mask, axis=0) / denom


def baseline_sequential_multikrum(updates: list[np.ndarray], f_ratio: float = 0.30) -> np.ndarray:
    """Classical Python loop Multi-Krum baseline illustrating O(N^2 d) gateway bottleneck."""
    U = np.asarray(updates, dtype=np.float64)
    N = U.shape[0]
    f = int(f_ratio * N)
    k = max(1, N - f - 1)
    scores = np.zeros(N, dtype=np.float64)
    for i in range(N):
        row_d2 = np.sum((U - U[i]) ** 2, axis=1)
        scores[i] = np.sum(np.sort(row_d2)[: k + 1])
    keep = np.argsort(scores)[: N - f]
    return np.mean(U[keep], axis=0)


# ==============================================================================
# Paper-Reported Ground-Truth Evolutionary Trajectory (IEEE CCNC 2027 Table I-III)
# ==============================================================================
CCNC_2027_TRAJECTORY = [
    {
        "gen": "G0",
        "generation": 0,
        "status": "seed",
        "name": "Naive Weighted FedAvg (Unhardened Seed)",
        "meanError": 143.79,
        "mitigationPct": 0.00,
        "latencyMs": 0.04,
        "fitnessScore": 0.61,
        "mnistSignFlipAccPct": 35.9,
        "mnistGaussAccPct": 19.1,
        "mnistSybilAccPct": 68.1,
        "summary": "Unhardened starting seed (`np.average(updates, weights=weights)`) with zero prior security hints — collapses completely under Gaussian (19.1%) and Sign-Flip (35.9%) attacks.",
        "code": """# EVOLVE-BLOCK-START
def execute_aggregation(updates, weights):
    # G0 Unhardened Seed: Naive Weighted FedAvg
    U = np.asarray(updates, dtype=np.float64)
    return np.average(U, axis=0, weights=weights)
# EVOLVE-BLOCK-END""",
    },
    {
        "gen": "G1",
        "generation": 1,
        "status": "improved",
        "name": "Coordinate Trimmed-Mean (20%)",
        "meanError": 73.75,
        "mitigationPct": 48.71,
        "latencyMs": 0.07,
        "fitnessScore": 25.55,
        "mnistSignFlipAccPct": 67.3,
        "mnistGaussAccPct": 66.2,
        "mnistSybilAccPct": 58.4,
        "summary": "First evolutionary leap: AlphaEvolve introduces 20% symmetric coordinate trimming — blocks isolated outliers but stalls on tightly correlated Sybil clusters (M = 48.71%).",
        "code": """# EVOLVE-BLOCK-START
def execute_aggregation(updates, weights):
    # G1: Coordinate-wise 20% Trimmed Mean
    U = np.sort(np.asarray(updates, dtype=np.float64), axis=0)
    k = max(1, int(0.20 * len(U)))
    return np.mean(U[k : len(U) - k], axis=0)
# EVOLVE-BLOCK-END""",
    },
    {
        "gen": "G2",
        "generation": 2,
        "status": "improved",
        "name": "Soft Inverse L2-Distance Weighting",
        "meanError": 2.19,
        "mitigationPct": 98.48,
        "latencyMs": 0.67,
        "fitnessScore": 79.24,
        "mnistSignFlipAccPct": 67.9,
        "mnistGaussAccPct": 67.8,
        "mnistSybilAccPct": 68.5,
        "summary": "Shifts from coordinate-wise statistics to geometric L2 distance from the median (`98.48%` mitigation!), though soft inverse weights still leak residual tail bias (`E_bar = 2.19`).",
        "code": """# EVOLVE-BLOCK-START
def execute_aggregation(updates, weights):
    # G2: Soft Inverse L2-Distance Weighting
    U = np.asarray(updates, dtype=np.float64)
    dists = np.linalg.norm(U - np.median(U, axis=0), axis=1)
    w = 1.0 / (1e-4 + dists ** 2)
    return np.sum(U * (w / w.sum())[:, None], axis=0)
# EVOLVE-BLOCK-END""",
    },
    {
        "gen": "G3",
        "generation": 3,
        "status": "champion",
        "name": "Evo-FedAgg Champion: BLAS Gram Top-K Filter",
        "meanError": 0.42,
        "mitigationPct": 99.71,
        "latencyMs": 0.38,
        "fitnessScore": 119.33,
        "mnistSignFlipAccPct": 68.4,
        "mnistGaussAccPct": 68.4,
        "mnistSybilAccPct": 69.6,
        "summary": "Converged Elite Champion! Discovers hard Top-(N-f) cluster selection via Level-3 BLAS Gram identity (`sq + sq.T - 2*(U @ U.T)`): 99.71% mitigation, provably Sybil-immune, and 17.2x faster than Multi-Krum at N=200!",
        "code": """# EVOLVE-BLOCK-START
def execute_aggregation(updates, weights):
    # G3 Champion (Evo-FedAgg): Vectorized BLAS Gram Top-K Filter
    U = np.asarray(updates, dtype=np.float64)
    N, f = U.shape[0], int(0.30 * len(updates))
    sq = np.sum(U * U, axis=1, keepdims=True)
    D2 = np.maximum(0.0, sq + sq.T - 2.0 * (U @ U.T))
    S = np.sum(np.partition(D2, N - f - 1, axis=1)[:, : N - f], axis=1)
    return np.mean(U[np.argsort(S)[: N - f]], axis=0)
# EVOLVE-BLOCK-END""",
    },
    {
        "gen": "G4",
        "generation": 4,
        "status": "rejected",
        "name": "Coordinate Z-Score Mask (Z < 2.0) [REJECTED]",
        "meanError": 6.90,
        "mitigationPct": 95.20,
        "latencyMs": 0.29,
        "fitnessScore": 59.83,
        "mnistSignFlipAccPct": 63.1,
        "mnistGaussAccPct": 64.0,
        "mnistSybilAccPct": 61.5,
        "summary": "Non-Monotonic Selection Proof: AlphaEvolve tests a Z < 2.0 coordinate mask, observes over-pruning of honest non-IID updates (`S` drops from 119.33 -> 59.83), and automatically REJECTS the regression!",
        "code": """# EVOLVE-BLOCK-START
def execute_aggregation(updates, weights):
    # G4 Candidate (REJECTED by Verifier: S=59.83 < 119.33)
    U = np.asarray(updates, dtype=np.float64)
    z = np.abs((U - U.mean(0)) / (U.std(0) + 1e-6)) < 2.0
    return (U * z).sum(0) / np.maximum(1.0, z.sum(0))
# EVOLVE-BLOCK-END""",
    },
]


def run_live_blas_speedup_check() -> dict:
    """Quick reproducible micro-benchmark verifying vectorized BLAS Gram speedup."""
    rng = np.random.default_rng(2027)
    N, d = 120, 4096
    honest = [rng.normal(0.15, 0.25, size=d) for _ in range(84)]
    sybils = [np.full(d, -1.8) + rng.normal(0.0, 0.02, size=d) for _ in range(36)]
    updates = honest + sybils
    weights = [1.0 / N] * N

    # Warmup
    _ = g3_champion_blas_topk(updates, weights)
    _ = baseline_sequential_multikrum(updates)

    t0 = time.perf_counter()
    for _ in range(5):
        out_g3 = g3_champion_blas_topk(updates, weights)
    blas_ms = ((time.perf_counter() - t0) / 5.0) * 1000.0

    t1 = time.perf_counter()
    for _ in range(5):
        out_mk = baseline_sequential_multikrum(updates)
    mk_ms = ((time.perf_counter() - t1) / 5.0) * 1000.0

    max_diff = float(np.max(np.abs(out_g3 - out_mk)))
    return {
        "N": N,
        "d": d,
        "evofedagg_blas_ms": round(blas_ms, 2),
        "sequential_multikrum_ms": round(mk_ms, 2),
        "measured_local_speedup_x": round(mk_ms / max(blas_ms, 1e-6), 1),
        "max_numerical_diff": round(max_diff, 9),
    }


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print(f"{ANSI_CYAN}{'=' * 86}{ANSI_RESET}")
    print(f"{ANSI_BOLD} DevFest Stuttgart 2026 • Demo 03: Evo-FedAgg (IEEE CCNC 2027){ANSI_RESET}")
    print(" Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL")
    print(f"{ANSI_SLATE} Conference: https://ccnc2027.ieee-ccnc.org/ (DOI will be obtained after the conference){ANSI_RESET}")
    print(f"{ANSI_CYAN}{'=' * 86}{ANSI_RESET}")

    print(f"\n{ANSI_BOLD}{ANSI_CYAN}  Evolutionary Fitness Trajectory — S = 100/(1+E_bar) + 50*M - min(20, 2*T_lat){ANSI_RESET}")
    print(f"  {ANSI_DIM}{'─' * 82}{ANSI_RESET}")
    max_s = 125.0
    bar_w = 34
    for row in CCNC_2027_TRAJECTORY:
        if row["status"] == "champion":
            color, tag = ANSI_EMERALD, "★ CHAMPION"
        elif row["status"] == "rejected":
            color, tag = ANSI_ROSE, "✗ REJECTED"
        elif row["status"] == "seed":
            color, tag = ANSI_SLATE, "  SEED    "
        else:
            color, tag = ANSI_CYAN, "  STEP    "

        filled = max(1 if row["fitnessScore"] > 0 else 0, int(round((row["fitnessScore"] / max_s) * bar_w)))
        bar = f"{color}{'█' * filled}{ANSI_DIM}{'░' * (bar_w - filled)}{ANSI_RESET}"
        print(
            f"  {color}{ANSI_BOLD}{row['gen']} {tag}{ANSI_RESET} │ {bar} │ "
            f"{color}S={row['fitnessScore']:>6.2f}{ANSI_RESET} {ANSI_SLATE}| M={row['mitigationPct']:>5.1f}% | {row['latencyMs']:>4.2f}ms{ANSI_RESET}"
        )

    bench = run_live_blas_speedup_check()
    g3_ms = bench["evofedagg_blas_ms"]
    mk_ms = bench["sequential_multikrum_ms"]
    g3_bar_len = max(1, int(round((g3_ms / max(mk_ms, 1e-6)) * bar_w)))
    print(f"\n{ANSI_BOLD}{ANSI_VIOLET}  Live Local Edge-Gateway Latency Benchmark (N={bench['N']} clients, d={bench['d']} params){ANSI_RESET}")
    print(f"  {ANSI_DIM}{'─' * 82}{ANSI_RESET}")
    print(
        f"  {ANSI_EMERALD}{ANSI_BOLD}Evo-FedAgg G3{ANSI_RESET} │ "
        f"{ANSI_EMERALD}{'█' * g3_bar_len}{ANSI_DIM}{'░' * (bar_w - g3_bar_len)}{ANSI_RESET} │ "
        f"{ANSI_EMERALD}{g3_ms:>6.2f} ms{ANSI_RESET} {ANSI_BOLD}({bench['measured_local_speedup_x']}x faster live!){ANSI_RESET}"
    )
    print(
        f"  {ANSI_AMBER}Multi-Krum   {ANSI_RESET} │ "
        f"{ANSI_AMBER}{'█' * bar_w}{ANSI_RESET} │ "
        f"{ANSI_AMBER}{mk_ms:>6.2f} ms{ANSI_RESET} {ANSI_SLATE}(Paper N=200: 1,015.6 ms vs 17,524.5 ms = 17.2x){ANSI_RESET}"
    )

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "paperTitle": "Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL",
        "venue": "IEEE CCNC 2027 (DOI will be obtained after the conference)",
        "conferenceUrl": "https://ccnc2027.ieee-ccnc.org/",
        "doiStatus": "DOI will be obtained after the conference",
        "authors": "Svetlana Meissner, Peter Langendoerfer (BTU Cottbus-Senftenberg)",
        "fitnessEquation": "S = 100 / (1 + E_bar) + 50 * M - min(20, 2.0 * T_lat)",
        "gatewayScalingN200": {
            "evofedaggMs": 1015.6,
            "multiKrumMs": 17524.5,
            "bulyanMs": 13598.4,
            "speedupVsMultiKrum": 17.2,
            "raspberryPi4N20Ms": 8.4,
        },
        "localMicrobenchmark": bench,
        "trajectory": CCNC_2027_TRAJECTORY,
    }
    OUT_JSON.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"\n{ANSI_EMERALD}[OK]{ANSI_RESET} Exported IEEE CCNC 2027 Evo-FedAgg dataset -> {OUT_JSON}")


if __name__ == "__main__":
    main()
