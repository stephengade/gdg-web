# Project: OAU Cadet Training (3D Tactical Marksmanship Simulator)

## Mandatory Agent Workflow
1. Always read `PHASES.md` before writing code. Follow the 3D Three.js WebGL architecture strictly.
2. Load and obey all four skills in `.agents/skills/`:
   - `.agents/skills/3d-ballistics-engine/SKILL.md`
   - `.agents/skills/tactical-design-system/SKILL.md`
   - `.agents/skills/game-feel-and-audio/SKILL.md`
   - `.agents/skills/mission-architecture/SKILL.md`
3. Keep HUD DOM overlays (`index.html` / `style.css`), `missions.js`, and Web Audio modular and cleanly separated from the Three.js `SceneManager` and `BallisticsSolver`.

