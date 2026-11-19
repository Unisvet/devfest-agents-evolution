"""
Demo 01: Google Antigravity 2.0 Multi-Agent Bridge Crew Orchestration
DevFest Stuttgart 2026 — From Agents to Evolution

Demonstrates how three parallel Antigravity subagents collaborate via MCP tools
and SKILL.md runbooks to diagnose Edge-Cloud Federated Learning vulnerabilities
and automatically construct an `# EVOLVE-BLOCK` specification for AlphaEvolve
(grounding our IEEE CCNC 2027 Evo-FedAgg workflow).

Execution modes (CLI flag `--live` or `.env` `DEMO_EXECUTION_MODE`):
  - `prerecorded` (default): Zero-credential deterministic trace for attendees & stage backup.
  - `--live` / `live`: Tries `google-antigravity` SDK first, then spawns 3 parallel live
    Gemini API Bridge Crew agents via `google-genai` (`GEMINI_API_KEY`), with automatic
    stage-safe fallback to prerecorded if offline.
"""

from __future__ import annotations

import asyncio
import os
import sys
import textwrap
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]

# Stage-Ready ANSI Palette (matches DevFest deck: Cyan / Amber / Emerald / Violet)
ANSI_RESET = "\033[0m"
ANSI_BOLD = "\033[1m"
ANSI_DIM = "\033[2m"
ANSI_CYAN = "\033[38;2;34;211;238m"
ANSI_EMERALD = "\033[38;2;52;211;153m"
ANSI_VIOLET = "\033[38;2;192;132;252m"
ANSI_AMBER = "\033[38;2;251;191;36m"
ANSI_ROSE = "\033[38;2;251;113;133m"
ANSI_SLATE = "\033[38;2;148;163;184m"


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
        "color": ANSI_CYAN,
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
        "color": ANSI_ROSE,
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
        "color": ANSI_EMERALD,
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
        "color": ANSI_VIOLET,
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
                "color": ANSI_CYAN,
                "kind": "response",
                "message": "".join(chunks).strip(),
            }
        )
    return events


async def run_live_gemini_bridge_crew() -> tuple[list[dict], str, float]:
    """Spawns 3 parallel Bridge Crew specialist agents live via the Gemini API (`google-genai`)."""
    from google import genai

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set in environment or .env")

    model_name = os.getenv("GEMINI_SWARM_MODEL", "gemini-2.5-flash")
    client = genai.Client(api_key=api_key, http_options={"api_version": "v1beta"})

    crew_prompts = [
        (
            1,
            "architect-agent",
            "Bridge Station 1 • Lead Systems Architect (LIVE)",
            ANSI_CYAN,
            "thought",
            "alpha_evolve_orchestrator",
            (
                "You are Bridge Station 1 (Lead Systems Architect) at DevFest Stuttgart 2026. "
                "In 2 crisp sentences (max 45 words, plain text, no markdown bullets), explain why "
                "Edge-Cloud Federated Learning (N=200 clients) needs an AlphaEvolve `# EVOLVE-BLOCK` "
                "when FedAvg collapses under 30% Byzantine attacks and O(N^2 d) Multi-Krum stalls at 17.5s."
            ),
        ),
        (
            2,
            "redteam-auditor-agent",
            "Bridge Station 2 • MITRE ATLAS Red-Team (LIVE)",
            ANSI_ROSE,
            "tool_call",
            "mcp_atlas_byzantine_stress_probe",
            (
                "You are Bridge Station 2 (MITRE ATLAS Red-Team Auditor). "
                "In 2 crisp sentences (max 45 words, plain text, no markdown bullets), explain why "
                "20% Coordinate Trimmed-Mean stalls at ~48.7% mitigation against Coordinated Sybils "
                "and Sign-Flipping, and what geometric signal the verifier must reward."
            ),
        ),
        (
            3,
            "tpu-kernel-agent",
            "Bridge Station 3 • Zero-Leak TPU & Pallas Engineer (LIVE)",
            ANSI_VIOLET,
            "artifact",
            "skill_zero_leak_spot_tpu",
            (
                "You are Bridge Station 3 (Cloud TPU & Pallas Kernel Engineer). "
                "In 2 crisp sentences (max 45 words, plain text, no markdown bullets), explain how "
                "a fused BLAS/Pallas VMEM evaluator + Bash `trap` zero-leak Spot TPU wrapper keeps "
                "AlphaEvolve candidate scoring sub-millisecond and prevents idle Cloud TPU billing."
            ),
        ),
    ]

    t0 = time.perf_counter()

    async def call_station(spec: tuple[int, str, str, str, str, str, str]) -> dict:
        from google.genai import types

        step, agent_name, station, color, kind, tool_name, prompt = spec
        resp = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        text = (resp.text or "").strip().replace("\n", " ")
        return {
            "step": step,
            "agent": agent_name,
            "station": station,
            "color": color,
            "kind": kind,
            "tool": tool_name,
            "message": text,
        }

    events = list(await asyncio.gather(*(call_station(s) for s in crew_prompts)))
    events.sort(key=lambda e: e["step"])
    return events, model_name, time.perf_counter() - t0


def print_station_card(ev: dict, width: int = 86) -> None:
    color = ev.get("color", ANSI_CYAN)
    badge = f"[{ev['kind'].upper()}]"
    header = f" Step {ev['step']} • {ev['station']} {badge} "
    card_w = max(width, len(header) + 4)
    inner_w = card_w - 4
    pad = max(0, card_w - 3 - len(header))
    print(f"\n{color}┌─{ANSI_BOLD}{header}{ANSI_RESET}{color}{'─' * pad}┐{ANSI_RESET}")
    if "tool" in ev:
        tool_line = f"Tool -> {ev['tool']}()"
        print(f"{color}│{ANSI_RESET} {ANSI_AMBER}{tool_line:<{inner_w}}{ANSI_RESET} {color}│{ANSI_RESET}")
    for line in textwrap.wrap(ev["message"], width=inner_w):
        print(f"{color}│{ANSI_RESET} {line:<{inner_w}} {color}│{ANSI_RESET}")
    print(f"{color}└{'─' * (card_w - 2)}┘{ANSI_RESET}")


async def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    load_simple_env(ROOT_DIR / ".env")
    cli_live = "--live" in sys.argv
    mode = "live" if cli_live else os.getenv("DEMO_EXECUTION_MODE", "prerecorded").lower()

    print(f"{ANSI_CYAN}{'=' * 78}{ANSI_RESET}")
    print(f"{ANSI_BOLD} DevFest Stuttgart 2026 • Demo 01: Antigravity 2.0 Multi-Agent Bridge Crew{ANSI_RESET}")
    mode_badge = f"{ANSI_EMERALD}● LIVE{ANSI_RESET}" if mode == "live" else f"{ANSI_CYAN}◉ PRERECORDED{ANSI_RESET}"
    print(f" Execution Mode : {mode_badge}  {ANSI_SLATE}(pass --live to run 3 parallel Gemini agents){ANSI_RESET}")
    print(f"{ANSI_CYAN}{'=' * 78}{ANSI_RESET}")

    live_source = None
    elapsed_s = 0.0

    if mode == "live":
        try:
            events = await run_live_antigravity_sdk()
            live_source = "google-antigravity SDK"
        except Exception:
            try:
                print(f"{ANSI_AMBER}[LIVE]{ANSI_RESET} Spawning 3 parallel Bridge Crew agents via Gemini API...")
                events, model_name, elapsed_s = await run_live_gemini_bridge_crew()
                live_source = f"Gemini API ({model_name}, 3 parallel agents in {elapsed_s:.2f}s)"
            except Exception as exc:
                print(f"{ANSI_AMBER}[WARN]{ANSI_RESET} Live mode unavailable ({exc}); falling back to prerecorded trace.")
                events = PRERECORDED_SWARM_EVENTS
    else:
        events = PRERECORDED_SWARM_EVENTS

    for ev in events:
        if not live_source:
            time.sleep(0.18)
        print_station_card(ev)

    if live_source:
        print(f"\n{ANSI_EMERALD}[OK]{ANSI_RESET} Live Bridge Crew synthesis complete via {ANSI_BOLD}{live_source}{ANSI_RESET}.")
    else:
        print(f"\n{ANSI_EMERALD}[OK]{ANSI_RESET} Swarm orchestration & AlphaEvolve handoff trace complete.")


if __name__ == "__main__":
    asyncio.run(main())
