---
name: devfest-slide-architect
description: >-
  Use this skill when adding or editing slides, 3D visuals, Web Audio transition cues,
  interactive React demos, or the 16:9 organizer PDF backup in the web/ presentation app.
---

# DevFest Slide, 3D Media & PDF Architect Skill

Maintains visual cohesion, stage reliability, and PDF export fidelity across `web/`.

## 1. Visual & Audio Design Language

- **Palette:** Deep cosmic obsidian (`#050814` / `slate-950`), glassmorphic cards (`bg-slate-900/75 backdrop-blur-md`), glowing semantic accents:
  - **Cyan (`#22d3ee`):** Conversation / *Homo Loquens* / Antigravity Orchestration
  - **Emerald (`#34d399`):** Evolution / *Homo Evolvens* / AlphaEvolve Pareto Gains
  - **Violet / Fuchsia (`#c084fc`):** Silicon Acceleration / Ironwood & `TPU-8t`/`8i` / Pallas
  - **Amber / Rose (`#fbbf24` / `#fb7185`):** Adversarial Red-Team / Lem's *Solaris* Warning
- **3D & Motion Assets:** Place generated 3D hero renders in `web/public/media/` and custom ambient transition stems in `web/public/audio/`. Always keep `HeroCanvas3D.tsx` and `soundEngine.ts` working with zero external file dependencies as fallback.

## 2. Mandatory Verification Checklist

1. Run TypeScript & production build check inside `web/`:
   ```powershell
   cd web; npm run build
   ```
2. Verify both **`Presentation Deck`** view and **`🖨️ PDF Backup`** (`PrintPdfDeckView.tsx`) render every slide in `slidesData.ts` without overflow.
