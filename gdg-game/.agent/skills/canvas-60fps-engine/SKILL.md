
---
name: canvas-60fps-engine
description: Standards for Vanilla JS HTML5 2D Canvas rendering, delta-time math, coordinate normalization, and zero-allocation object pooling. Trigger when writing or modifying the game loop, input handlers, target movement, or particle systems.
---
# 60-144Hz Vanilla JS Canvas Engine Rules

## 1. Logical Resolution & Aspect Ratio Lock

- **Internal Logical Space:** Always compute game math against a fixed `1920x1080` logical coordinate space.
- **DPI & Resize Handling:** Scale the canvas visually via CSS (`aspect-ratio: 16/9`), and map pointer input (`e.clientX`, `e.clientY`) to logical coordinates using:
  ```js
  const rect = canvas.getBoundingClientRect();
  const scaleX = 1920 / rect.width;
  const scaleY = 1080 / rect.height;
  const logicalX = (e.clientX - rect.left) * scaleX;
  const logicalY = (e.clientY - rect.top) * scaleY;
  ```
