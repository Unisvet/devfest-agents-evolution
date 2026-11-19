---
trigger: always_on
---

# DevFest Stuttgart 2026 — Project Guardrails & Standards

1. **Zero Secret Commits:** Never write real API keys, GCP project numbers, or service-account credentials into tracked files. Always reference environment variables defined in `.env.example`.
2. **Stage-Safe Dual Execution:** Every interactive visualization or backend runner must operate smoothly in `prerecorded` offline mode without network connectivity, while allowing optional `live` execution when `.env` credentials are supplied.
3. **16:9 Organizer PDF Fidelity:** Keep all slides in `web/` printable via `PrintPdfDeckView.tsx` so conference organizers always have an up-to-date PDF deck.
4. **Diagram Readability:** Default to top-down `flowchart TD` layouts with high-contrast dark-slate/cyan/emerald styling for conference projector legibility.
