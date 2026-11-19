"""
Demo 01: Google Antigravity 2.0 Multi-Agent Bridge Crew Orchestration
DevFest Stuttgart 2026 — From Agents to Evolution

Demonstrates how three parallel Antigravity subagents collaborate via MCP tools
and SKILL.md runbooks to diagnose Edge-Cloud Federated Learning vulnerabilities
and automatically construct an `# EVOLVE-BLOCK` specification for AlphaEvolve
(grounding our IEEE CCNC 2027 Evo-FedAgg workflow).

Supports two modes controlled by `.env` (`DEMO_EXECUTION_MODE`):
  - `prerecorded` (default): Zero-credential deterministic trace for attendees & stage backup.
  - `live`: Spawns real parallel subagents via the `google-antigravity` Python SDK.
"""

from __future__ import annotations

import asyncio
import os
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]


def load_simple_env(env_path: Path) -> None:
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())


PRERECORDED_SWARM_EVENTS = [
    {
        "step": 1,
        "agent": "architect-agent",
        "station": "Bridge Station 1 • Lead Systems Architect",
        "kind": "thought",
        "message": (
            "Profiling Edge-Cloud FL gateway bottleneck (N=200 clients, d=7,850): "
            "naive FedAvg collapses under 30% Byzantine corruption (S=0.61), while "
            "sequential Multi-Krum stalls edge gateways for 17,524.5 ms (17.52 s) per round."
        ),
    },
    {
        "step": 2,
        "agent": "redteam-auditor-agent",
        "station": "Bridge Station 2 • MITRE ATLAS Red-Team",
        "kind": "tool_call",
        "tool": "mcp_atlas_byzantine_stress_probe",
        "message": (
            "Probed Coordinate Trimmed-Mean (20%) across K=3 MITRE ATLAS threats "
            "(AML.T0031 Gaussian, AML.T0018 Omniscient Sign-Flip, AML.T0031 Coordinated Sybil): "
            "mitigation stalls at M=48.71% (S=25.55) because tightly clustered Sybils shift coordinate quantiles!"
        ),
    },
    {
        "step": 3,
        "agent": "architect-agent",
        "station": "Bridge Station 1 • Lead Systems Architect",
        "kind": "tool_call",
        "tool": "alpha_evolve_orchestrator",
        "message": (
            "Hand-written single-pass heuristics hit a resilience-vs-latency ceiling. "
            "Packaging unhardened `# EVOLVE-BLOCK-START` seed + latency-penalized fitness "
            "verifier S = 100/(1+E_bar) + 50*M - min(20, 2.0*T_lat) for AlphaEvolve (`ae experiment run`)."
        ),
    },
    {
        "step": 4,
        "agent": "tpu-kernel-agent",
        "station": "Bridge Station 3 • Zero-Leak TPU & Pallas Engineer",
        "kind": "artifact",
        "tool": "skill_zero_leak_spot_tpu",
        "message": (
            "Enforcing `.agents/rules/tpu-lifecycle.md`: prepared Spot TPU v6e-1 (`v2-alpha-tpuv6e`) "
            "self-cleaning trap wrapper + TorchTPU `.to('tpu')` / Pallas VMEM tile evaluator."
        ),
    },
]


async def run_live_antigravity_sdk() -> list[dict]:
    from google.antigravity import Agent, CapabilitiesConfig, LocalAgentConfig  # type: ignore

    events: list[dict] = []
    config = LocalAgentConfig(
        system_instructions=(
            "You are the Lead Systems Architect on a 3-agent DevFest Stuttgart crew. "
            "Diagnose why FedAvg and sequential O(N^2 d) Multi-Krum struggle under "
            "Coordinated Sybil and Gaussian Byzantine attacks on Edge-Cloud gateways, "
            "and specify an AlphaEvolve `# EVOLVE-BLOCK` fitness harness in 4 crisp bullet points."
        ),
        capabilities=CapabilitiesConfig(),
    )
    async with Agent(config) as agent:
        response = await agent.chat(
            "Analyze our unhardened execute_aggregation seed and formulate the AlphaEvolve evaluator."
        )
        chunks: list[str] = []
        async for token in response:
            chunks.append(token)
        events.append(
            {
                "step": 1,
                "agent": "architect-agent (LIVE SDK)",
                "station": "Live Antigravity 2.0 Runtime",
                "kind": "response",
                "message": "".join(chunks).strip(),
            }
        )
    return events


async def main() -> None:
    load_simple_env(ROOT_DIR / ".env")
    mode = os.getenv("DEMO_EXECUTION_MODE", "prerecorded").lower()
    print("=" * 78)
    print(" DevFest Stuttgart 2026 • Demo 01: Antigravity 2.0 Multi-Agent Bridge Crew")
    print(f" Execution Mode : {mode.upper()}")
    print("=" * 78)

    if mode == "live":
        try:
            events = await run_live_antigravity_sdk()
        except Exception as exc:
            print(f"[WARN] Live SDK unavailable ({exc}); falling back to prerecorded trace.")
            events = PRERECORDED_SWARM_EVENTS
    else:
        events = PRERECORDED_SWARM_EVENTS

    for ev in events:
        time.sleep(0.20)
        badge = f"[{ev['kind'].upper()}]"
        print(f"\nStep {ev['step']} • {ev['station']} {badge}")
        if "tool" in ev:
            print(f"  Tool -> {ev['tool']}()")
        print(f"  {ev['message']}")

    print("\n[OK] Swarm orchestration & AlphaEvolve handoff trace complete.")


if __name__ == "__main__":
    asyncio.run(main())
