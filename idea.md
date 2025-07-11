#### 🤝 Overall Goals

**PauseOne** must feel ultra-simple, instantly calm, and futuristic. The entire product should be deliverable by a 2–3-person team in ≤ 90 days, so the **design system doubles as the production spec**—every color, size, and motion token goes straight into code.

---

#### 1. Design Principles

1. **KISS** – one action per screen, zero configuration first-run.
2. **Liquid-Glass Aesthetic 2025** – translucent “glass” cards on glowing gradients; soft internal shadows instead of hard borders.
3. **Thumb-Zone First** – primary touch targets ≥ 64 × 64 dp, centered low for single-hand use.
4. **Accessible Zen** – WCAG 2.2 AA, prefers-reduced-motion compliance, large-text readiness.

---

#### 2. Core Brand Tokens

```
/* PauseOne Design Tokens – CSS (can be exported to JSON, iOS, Android) */
:root {
  /* Brand gradients */
  --gradient-primary: linear-gradient(135deg,#4C90FF 0%,#65F9D5 100%);
  --gradient-secondary: linear-gradient(135deg,#C152FF 0%,#FF73B6 100%);

  /* Solid colors */
  --c-bg-dark: #0D0F12;         /* Root background */
  --c-glass: rgba(255,255,255,0.08);   /* Frosted panel */
  --c-white: #FFFFFF;
  --c-text-high: rgba(255,255,255,0.92);
  --c-text-low: rgba(255,255,255,0.60);

  /* Blur & elevation */
  --blur-glass: 16px;
  --elev-glass: 0 8px 20px rgba(0,0,0,0.35);

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --fs-h1: clamp(28px,4vw,40px);
  --fs-body: 18px;
  --fs-small: 16px;
  --fw-bold: 600;
  --fw-regular: 400;

  /* Spacing & radius */
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px;
  --radius-lg: 24px;  /* Glass card corners */

  /* Motion */
  --breath-duration: 8s;       /* inhale + exhale */
  --breath-scale: 1.20;        /* circle scaling */
  --ease-soft: cubic-bezier(.4,0,.2,1);
}
```

---

#### 3. Typography

• **Font:** Plus Jakarta Sans (variable) – geometric yet warm.  
• **Hierarchy**  
 • h1 → `--fs-h1` `--fw-bold`  
 • body → `--fs-body` `--fw-regular`  
 • small → `--fs-small` `--fw-regular`  
• **Line height:** 1.4 for body; 1.1 for headings.  
• **Letter-spacing:** −1 % on h1 for weighty calm.

---

#### 4. Component Library

| Component              | Anatomy (layers)                                                                                                                                | Notes                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Glass Card**         | Frosted background `--c-glass` + backdrop-filter: blur(`--blur-glass`); radius `--radius-lg`; inner shadow inset 0 1px 0 rgba(255,255,255,0.15) | Used for settings sheet & share modal |
| **Primary Button**     | Full-width glass card + gradient overlay on hover/press                                                                                         | Haptics on press; minimum width 56 dp |
| **Breathing Circle**   | SVG circle stroke; keyframe scale `--breath-scale`; subtle glow of `--gradient-primary`                                                         | Represent timer progress              |
| **Streak Ring**        | Concentric progress ring; color animates `--gradient-secondary` when streak > 7                                                                 | Collapses after 24 h idle             |
| **Bottom Sheet**       | 90 % width, drag indicator; springs with 0.5 s `--ease-soft`                                                                                    | All secondary flows                   |
| **Lock-Screen Widget** | Single glass button with embedded countdown digits                                                                                              | Dark/light auto-adapt                 |

---

#### 5. Layout & Grid

• **Mobile viewport:** 4-column fluid grid (16 dp gutters).  
• **Safe-area aware** (iOS Dynamic Island, Android cutouts).  
• **Home screen** vertical stack:

```
[Spacer] 24dp
[Timer Circle] 220×220 dp center
[Spacer] 24dp
[Primary Button] (text: “Start 1-Minute Pause”)
[Spacer] flex
[Streak Ring] 120×120 dp bottom-center
```

---

#### 6. Motion Spec

| Element             | Animation                       | Duration                          | Easing        |
| ------------------- | ------------------------------- | --------------------------------- | ------------- |
| Breathing circle    | `scale(1 → --breath-scale → 1)` | `--breath-duration` (default 8 s) | `--ease-soft` |
| Glass card entrance | `translateY(40px) → 0` + fade   | 320 ms                            | `--ease-soft` |
| Button press        | scale 1 → 0.96 → 1              | 120 ms                            | linear        |
| Sheet drag          | spring (damping 20, mass 1)     | —                                 | —             |

Respect `prefers-reduced-motion: reduce` ⇒ static states only, drop circle scaling.

---

#### 7. Accessibility

• Contrast ratio ≥ 4.5:1 with `--c-text-high` on `--c-bg-dark` and glass card overlay.  
• Dynamic Type: all font sizes respond to OS text-size up to 120 %.  
• VoiceOver/ TalkBack labels: timer announces remaining seconds each 15 s.  
• Haptic pattern mirrors inhale/exhale for deaf-blind synergy.

---

#### 8. Assets & Icons

• **Icon style:** 2 px linear, 24 × 24 dp base, Figma component set.  
• **App icon:** Liquid-glass rounded square, central “pause” bars cutout; animated splash uses same bars morphing into circle.  
• **Export pipeline:** Figma → SVGO (optimize) → `src/assets/icons`.

---

#### 9. Technical Production Spec

**Sample Folder Structure**

```
src/
  components/
    Button.tsx
    GlassCard.tsx
    BreathCircle.tsx
  hooks/
    useBreathTimer.ts
  styles/
    tokens.css   /* generated from Figma variables */
  pages/
    Home.tsx
    Share.tsx
public/
  manifest.webmanifest
```

**Performance Budgets**  
• First interaction ≤ 900 ms on 4G.  
• JS bundle ≤ 160 kB gzipped.  
• CLS < 0.05, LCP < 2 s.

---

#### 11. Haptic Patterns (Capacitor Haptics)

| Pattern    | Inhale (ms) | Exhale (ms) | Pause (ms) |
| ---------- | ----------- | ----------- | ---------- |
| Default    | 400         | 400         | 200        |
| Premium #1 | 600         | 600         | 100        |
| Premium #2 | 250         | 250         | 250        |

---

#### ✅ Summary

This design system codifies every **liquid-glass 2025** visual, motion, and accessibility token into code-ready variables, enabling a lean team to build **PauseOne** with **high quality yet KISS simplicity** in three sprints.
