# 🧬 From Agents to Evolution: Scaling Antigravity & AlphaEvolve toward AGI on Google Cloud TPUs

> **DevFest Stuttgart 2026** (`https://devfest.gdg-stuttgart.dev/`) • Saturday, November 21, 2026  
> **Companion Repository:** [`https://github.com/Unisvet/devfest-agents-evolution`](https://github.com/Unisvet/devfest-agents-evolution)

Humans shaped civilization through **conversation** (*Homo Loquens*) and **tools** (*Homo Faber*). Today we build systems that converse, wield tools, and cross Ada Lovelace's 1843 *Note G* barrier via **verified algorithmic evolution** (*Homo Evolvens*) — echoing Stanisław Lem's ***Golem XIV*** (whose fictional foreword is dated **2027**!) while avoiding ***Solaris***'s inscrutable black box.

---

## 📂 Project Architecture

```text
devfest-agents-evolution/
├── web/                                       # Unified Interactive 18-Slide Deck, Demos Lab, Video Hub & PDF
│   ├── src/
│   │   ├── components/                        # React 19 + TypeScript + Tailwind + 2D/3D Visualizers + Audio
│   │   └── data/
│   │       ├── circle_packing_n26.json        # Verified n=26 Circle Packing coordinates (0 overlaps!)
│   │       └── evofedagg_ccnc2027.json        # IEEE CCNC 2027 Evo-FedAgg evolutionary trajectory
│   ├── public/
│   │   ├── media/                             # Bespoke 16:9 widescreen slide illustrations
│   │   └── audio/                             # Optional custom ambient transition stems
│   └── .env.example                           # Optional browser live API config template
├── .agents/                                   # Google Antigravity 2.0 Workspace Customizations
│   ├── skills/                                # Project SKILL.md bundles (complementing 6 official `ae` skills)
│   ├── agents/                                # Parallel Bridge Crew subagent specifications
│   └── rules/                                 # Project standards + `tpu-lifecycle.md` zero-leak Spot TPU rule
├── demos/                                     # Runnable Python Scripts (`uv run --with numpy ...`)
│   ├── 01_antigravity_swarm_demo.py           # google-antigravity SDK parallel subagent trace
│   ├── 02_circle_packing_codelab_demo.py      # Visual n=26 Circle Packing (`# EVOLVE-BLOCK-START`, +171.2%)
│   ├── 03_ccnc2027_evofedagg_demo.py          # IEEE CCNC 2027 Evo-FedAgg trajectory & BLAS speedup benchmark
│   └── 04_jax_torchtpu_evaluator_demo.py      # 3-Tier JAX (`vmap`) / `TorchTPU` (`.to("tpu")`) evaluator
├── scripts/
│   └── run_alphaevolve_spot_tpu.sh            # Self-cleaning `trap` Spot TPU (`v6e-1`) execution wrapper
├── .env.example                               # Clean attendee & speaker GCP / AlphaEvolve / TPU template
└── AGENTS.md                                  # Root workspace instructions for Antigravity 2.0
```

---

## 🚀 Quickstart (Zero Credentials Required Out of the Box!)

### 1. Launch the Unified Interactive Presentation & Demos Site (`web/`)

```bash
cd web
npm install
npm run dev
```

- **Keyboard Shortcuts in Deck Mode:** `→` / `Space` (Next), `←` (Prev), `I` (Toggle Illustration / Interactive View), `O` (Overview Grid), `M` (Harmonic Web Audio Transition Chimes), `C` (Cinema Mode), `F` (Fullscreen), `P` (16:9 Organizer PDF Export).
- **Exporting the 18-Slide Organizer PDF Backup:** Click **`Organizer PDF`** in the top bar → **`Save as 16:9 PDF`** (*Background graphics: Enabled*, *Margins: None*).

### 2. Run the Python Companion Demos (`demos/`)

```bash
uv run --with numpy python demos/01_antigravity_swarm_demo.py
uv run --with numpy python demos/02_circle_packing_codelab_demo.py
uv run --with numpy python demos/03_ccnc2027_evofedagg_demo.py
uv run --with numpy python demos/04_jax_torchtpu_evaluator_demo.py
```

### 3. Install Antigravity Zero-Leak Cloud TPU & AlphaEvolve Skills

```bash
agy plugin install google-cloud-developer
uv tool install "git+https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud.git#subdirectory=skills"
ae skills install --tool Antigravity
```

---

## 🔗 Core Codelab, Keynote & Research References

- **Official Codelab:** [Getting Started with AlphaEvolve on Google Cloud (`n=26` Circle Packing)](https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0)
- **Official Google Cloud AI Repo:** [`Google-Cloud-AI/alphaevolve-on-googlecloud`](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud)
- **Google Cloud Tech Keynote:** [The Future of AI Infrastructure (Ironwood TPU v7, Bifurcated TPU-8t/8i & AI Hypercomputer)](https://www.youtube.com/live/pabDkNR7jIs)
- **Research Case Study:** S. Meissner & P. Langendoerfer, *"Automated Evolutionary Discovery of Byzantine-Resilient Aggregators for Edge-Cloud FL"* (**Evo-FedAgg**, [IEEE CCNC 2027](https://ccnc2027.ieee-ccnc.org/) — DOI will be obtained after the conference)
- **Philosophical Horizon:** Stanisław Lem, *Golem XIV* (1981 — Foreword dated **2027**) & *Solaris* (1961)
