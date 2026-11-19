# Stage Audio & Transition Stems (`web/public/audio/`)

By default, `src/utils/soundEngine.ts` synthesizes zero-dependency harmonic sci-fi chimes via the browser **Web Audio API** whenever sound mode (`M` shortcut) is enabled.

To drop in custom transition music or ambient soundscapes later:
- Place `transition-chime.mp3` or `ambient-drone.mp3` in this folder (`web/public/audio/`).
- `soundEngine.ts` automatically detects and plays custom audio files if present!
