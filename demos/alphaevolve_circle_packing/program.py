"""
Seed Program for Google Cloud AlphaEvolve (`ae` CLI) — n=26 Unit-Square Circle Packing
DevFest Stuttgart 2026 — Companion to the Official Google Cloud AlphaEvolve Codelab:
  https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0

In a real Google Cloud AlphaEvolve experiment, this naive Gen 0 seed (~0.9598) is the
ONLY algorithm you write. AlphaEvolve's Cloud LLM ensemble (`gemini-4-argon`,
`gemini-3.8-flash`, `gemini-3.1-pro-preview`) mutates ONLY the code inside
`# EVOLVE-BLOCK-START ... # EVOLVE-BLOCK-END` while `evaluate.py` grades every candidate.
"""

from __future__ import annotations

import numpy as np


# EVOLVE-BLOCK-START
def construct_packing() -> tuple[np.ndarray, np.ndarray]:
    """Constructs a packing of n=26 disjoint circles inside the unit square [0, 1]^2.

    Returns:
        centers: np.ndarray of shape (26, 2) with (x, y) coordinates in [0, 1]^2
        radii:   np.ndarray of shape (26,) with non-negative circle radii
    """
    n = 26
    centers = np.zeros((n, 2), dtype=np.float64)
    centers[0] = [0.5, 0.5]

    for i in range(8):
        angle = 2.0 * np.pi * i / 8
        centers[i + 1] = [0.5 + 0.3 * np.cos(angle), 0.5 + 0.3 * np.sin(angle)]

    for i in range(16):
        angle = 2.0 * np.pi * i / 16
        centers[i + 9] = [0.5 + 0.7 * np.cos(angle), 0.5 + 0.7 * np.sin(angle)]

    centers = np.clip(centers, 0.01, 0.99)

    radii = np.ones(n, dtype=np.float64) * 0.1
    for i in range(n):
        x, y = centers[i]
        radii[i] = min(x, y, 1.0 - x, 1.0 - y)

    for i in range(n):
        for j in range(i + 1, n):
            dist = float(np.sqrt(np.sum((centers[i] - centers[j]) ** 2)))
            if radii[i] + radii[j] > dist:
                scale = 0.999999 * (dist / (radii[i] + radii[j]))
                radii[i] *= scale
                radii[j] *= scale

    return centers, radii
# EVOLVE-BLOCK-END


if __name__ == "__main__":
    c, r = construct_packing()
    print(f"Seed construct_packing(): n={len(r)}, sum_of_radii={float(np.sum(r)):.5f}")
