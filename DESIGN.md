# Design Brief

**Tone & Purpose**: Premium futuristic chemistry learning dashboard. Retro-futuristic lab aesthetic — cutting-edge tech meets scientific precision. Designed for students and educators exploring chemistry interactively offline.

**Color Palette**:
| Token | OKLCH | Usage |
|-------|-------|-------|
| Neon Cyan | 0.72 0.22 229 | Primary interactions, UI focus |
| Neon Magenta | 0.68 0.25 316 | Secondary accent, highlights |
| Neon Lime | 0.75 0.22 142 | Success, positive feedback |
| Neon Red | 0.63 0.21 25 | Warnings, destructive actions |
| Deep Space (Dark bg) | 0.10 0 0 | Main background |
| Card Base | 0.14 0 0 | Card & panel backgrounds |
| Border Subtle | 0.22 0.08 0 | Borders, dividers |
| Foreground | 0.95 0 0 | Text, primary content |

**Typography**: DM Sans (body + display) for clean modern presence. JetBrains Mono for data, formulas, code.

**Elevation & Depth**: Glassmorphism layers — 80% opacity backgrounds with 20% white borders. Neon glow shadows for primary actions. Inset glass effect for nested cards.

**Structural Zones**:
| Zone | Surface | Treatment |
|------|---------|-----------|
| Navbar | Card 0.14 + glass border | Sticky blur, neon border on scroll |
| Hero | Background 0.10 | Animated particle gradient, floating atoms |
| Content Grid | Alternating card 0.14 / muted 0.18 | Glass cards with cyan borders, 16px radius |
| Sidebar/Tools | Card 0.14 | Glass effect, section dividers with glow |
| Footer | Muted 0.18 + border-t | Subtle background lift |

**Component Patterns**: Glass cards with neon borders. Hover glow states (cyan box-shadow). Smooth transitions (300ms cubic-bezier). Icon accents on buttons. Data tables with alternating row tints.

**Motion**: Entrance animations (fade + slide). Pulse glow on interactive elements. Float animations for accent elements. Spin-slow for loading states. All 300–500ms with consistent easing.

**Signature Detail**: Neon border glow on hover. Glassmorphic card overlays with inset white borders. Atomic/molecular icon accents throughout.

**Constraints**: Dark mode optimized. No RGB hex colors — OKLCH only. All shadows use opacity-based glow. Minimum 16px border radius on cards.
