"""
Deterministic Verifier (`evaluate.py`) for Google Cloud AlphaEvolve (`ae` CLI)
n=26 Unit-Square Circle Packing — DevFest Stuttgart 2026

Runs inside YOUR secure environment (laptop, Cloud Batch, or Spot TPU).
Returns a numeric fitness score (`sum_of_radii`) for valid zero-overlap packings, or
`-inf` plus an actionable diagnostic `insight` string so AlphaEvolve self-repairs
broken candidates on the next generation.

Usage:
    uv run --project demos python demos/alphaevolve_circle_packing/evaluate.py
"""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path
import numpy as np

N_CIRCLES = 26
HUMAN_RECORD_2011 = 2.6340   # David Cantrell (2011), held for 14 years
ALPHAEVOLVE_SOTA = 2.63586   # Google DeepMind AlphaEvolve (May 2025)


def verify_circle_packing(centers: np.ndarray, radii: np.ndarray, tol: float = 1e-6) -> dict:
    """Strictly verifies shape, finiteness, unit-square containment, and zero pairwise overlap."""
    centers = np.asarray(centers, dtype=np.float64)
    radii = np.asarray(radii, dtype=np.float64)

    if centers.shape != (N_CIRCLES, 2) or radii.shape != (N_CIRCLES,):
        return {
            "valid": False,
            "score": float("-inf"),
            "insight": f"Shape mismatch: got centers={centers.shape}, radii={radii.shape}; expected (26, 2) and (26,).",
        }

    if not np.all(np.isfinite(centers)) or not np.all(np.isfinite(radii)) or np.any(radii < 0):
        return {
            "valid": False,
            "score": float("-inf"),
            "insight": "Invalid NaN, Inf, or negative radius detected.",
        }

    for i in range(N_CIRCLES):
        x, y = centers[i]
        r = radii[i]
        if x - r < -tol or x + r > 1.0 + tol or y - r < -tol or y + r > 1.0 + tol:
            return {
                "valid": False,
                "score": float("-inf"),
                "insight": f"Boundary violation at circle {i}: center=({x:.4f}, {y:.4f}), r={r:.4f} exceeds [0, 1]^2.",
            }

    max_overlap = 0.0
    for i in range(N_CIRCLES):
        for j in range(i + 1, N_CIRCLES):
            dist = float(np.linalg.norm(centers[i] - centers[j]))
            overlap = float((radii[i] + radii[j]) - dist)
            if overlap > max_overlap:
                max_overlap = overlap
            if overlap > tol:
                return {
                    "valid": False,
                    "score": float("-inf"),
                    "insight": f"Overlap violation ({overlap:.2e}) between circles {i} and {j}.",
                }

    total_radii = float(np.sum(radii))
    area_coverage_pct = float(np.sum(np.pi * (radii ** 2)) * 100.0)
    return {
        "valid": True,
        "score": round(total_radii, 5),
        "area_coverage_pct": round(area_coverage_pct, 2),
        "max_overlap": max(0.0, max_overlap),
        "pct_of_sota": round((total_radii / ALPHAEVOLVE_SOTA) * 100.0, 2),
        "insight": (
            f"Valid n=26 packing: sum_of_radii={total_radii:.5f} "
            f"(area={area_coverage_pct:.1f}%, prior human record={HUMAN_RECORD_2011:.4f}, "
            f"AlphaEvolve SOTA={ALPHAEVOLVE_SOTA:.5f})."
        ),
    }


def evaluate(program_path: str | Path) -> dict:
    """Loads a candidate `program.py`, runs `construct_packing()`, and returns the verdict."""
    path = Path(program_path).resolve()
    spec = importlib.util.spec_from_file_location("candidate_program", path)
    if spec is None or spec.loader is None:
        return {"valid": False, "score": float("-inf"), "insight": f"Unable to import {path}."}

    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
        if not hasattr(module, "construct_packing"):
            return {"valid": False, "score": float("-inf"), "insight": "Missing `construct_packing()` entrypoint."}
        centers, radii = module.construct_packing()
    except Exception as exc:
        return {
            "valid": False,
            "score": float("-inf"),
            "insight": f"Runtime exception during construct_packing(): {type(exc).__name__}: {exc}",
        }

    return verify_circle_packing(centers, radii)


if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "program.py"
    verdict = evaluate(target)
    print(json.dumps(verdict, indent=2))
    sys.exit(0 if verdict["valid"] else 1)
