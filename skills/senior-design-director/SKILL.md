---
name: senior-design-director
description: Senior design director guidance for web, mobile, and immersive 3D projects — project discovery, design systems, color palettes, accessibility, performance, platform-specific design (iOS HIG, Material Design 3), and scroll-driven 3D web experiences. Use when working on any UI/UX design task, building a design system, validating accessibility, analyzing web performance, designing for iOS or Android, or building cinematic 3D scroll experiences.
license: MIT
metadata:
  author: AbrahamOO
  version: "1.2.0"
  mcp-package: senior-design-director-mcp
compatibility: Requires the senior-design-director-mcp MCP server to be running. Install via npx -y senior-design-director-mcp.
---

# Senior Design Director

This skill activates world-class design director thinking for any UI/UX or immersive 3D project. It pairs with the `senior-design-director-mcp` MCP server, which provides the underlying tools.

## MCP Server Setup

Before using the tools in this skill, ensure the MCP server is configured in your client:

```json
{
  "mcpServers": {
    "senior-design-director": {
      "command": "npx",
      "args": ["-y", "senior-design-director-mcp"]
    }
  }
}
```

---

## Standard Workflow

Always follow this sequence. Each step builds on the previous one. Do not skip or reorder.

### Step 1 — Project Discovery (always first)

Run `complete-project-discovery` before anything else. This creates the project brief that all subsequent tools draw from.

**Required fields**: `projectName`, `projectDescription`, `industryCategory`, `audienceRole`, `primaryCTA`, `emotionalTone`

**Critical**: Include `platform` to unlock platform-specific outputs in every downstream tool:
- `web` — CSS tokens, rem/px, fluid clamp() typography
- `mobile-ios` — pt tokens, Dynamic Type, SF Symbols, UIKit/SwiftUI specs
- `mobile-android` — dp/sp tokens, Material type scale, Compose/Material 3 specs
- `mobile-cross-platform` — React Native / Flutter logical units
- `both` — web + mobile combined

### Step 2 — User Flow (before any visual design)

Run `generate-user-flow` immediately after discovery. User flow is structural — it defines what gets built. Visual design decisions depend on it.

The tool outputs:
- **Entry points** — all traffic sources with intent classification
- **Primary journey** — numbered states (S0–S9) with entry conditions, content visible, cognitive load level, and exit triggers
- **Decision forks** — every branch point with named Yes/No paths
- **Friction inventory** — ranked by severity (1–5), with root cause and mitigation per touchpoint
- **Error & empty states** — trigger, treatment, and recovery path for every failure mode
- **Conversion checkpoints** — metric, numeric target, and measurement tool per step
- **Navigation pattern** — platform-native nav structure (iOS HIG / Material 3 / web URL schema)

**Protocol**:
1. Read the full flow output before designing any screen or section.
2. Every design decision must trace back to a named state (S0, S1…) in the flow.
3. Friction points with severity ≥4 are blockers — resolve them in design before moving forward.
4. Every error state must have a specified recovery path. Unresolved dead ends are defects.
5. Conversion checkpoint targets are non-negotiable — wire analytics events before launch.

### Step 3 — Color System

1. `generate-color-palette` — palette derived from emotional tone + industry
2. `validate-color-contrast` — WCAG AA check on every text/background pair in the flow

### Step 4 — Design System

1. `create-design-system` — typography scale, spacing, breakpoints, motion tokens
2. `generate-component-library` — platform-appropriate component specs (buttons, cards, forms, navigation, modals)

Component specs must cover every UI state present in the user flow: default, hover/pressed, disabled, loading, error, empty.

### Step 5 — Content Strategy

1. `generate-content-architecture` — three-act narrative structure mapped to the states defined in Step 2
2. `generate-copy-guidelines` — brand voice, tone, and writing rules

Content architecture section order must match the user flow journey sequence. Narrative sections that do not correspond to a flow state should be removed or consolidated.

### Step 6 — Accessibility Validation

Run `check-accessibility` after every structural design decision — not only at the end.

**Web checks**: color contrast, semantic HTML, form labels, heading hierarchy, ARIA labels, keyboard navigation, focus management

**Mobile checks**: touch targets (44pt iOS / 48dp Android), Dynamic Type / sp scaling, VoiceOver / TalkBack labels, Reduce Motion, OLED background halation, swipe-back gesture conflicts

Use `get-accessibility-checklist` for the complete WCAG 2.2 AA + Apple HIG + Android accessibility checklist.

Every friction point in the flow rated severity ≥3 must be cross-checked against the accessibility checklist before marking it resolved.

### Step 7 — Performance

**Web**: `analyze-performance` → `get-core-web-vitals-targets` → `get-performance-budget`

**Mobile**: `analyze-mobile-performance` → `get-mobile-performance-targets`

Performance targets map directly to conversion checkpoints from Step 2. If LCP target is 2.5s and the checkpoint target is 60% scroll-past-hero, they are the same problem from different angles — treat them together.

### Step 8 — Immersive 3D (optional, web only)

When the project calls for a cinematic scroll-driven 3D web experience:

Run `generate-3d-experience` with:
- `concept` — the 3D world narrative (e.g. "crystalline neural network", "deep ocean bioluminescence")
- `style` — `cosmic` | `architectural` | `organic` | `minimal` | `brutalist` | `liquid` | `crystalline`
- `sections` — 3–7 scroll scenes (must map to flow states S0–SN)
- `primaryColor` — brand hex
- `includeShaders` — `true` for GLSL vertex displacement shaders

Output includes: React Three Fiber scene, CatmullRom camera spline, scroll→animation hook, postprocessing pipeline, and mobile fallback.

Each 3D section must correspond to a named flow state. A scroll section with no flow purpose is decoration — remove it.

---

## Tool Reference

### Project Management
| Tool | When to use |
|------|------------|
| `complete-project-discovery` | Start of every new project |
| `get-project-brief` | Retrieve a saved brief by name |
| `list-projects` | See all saved briefs |
| `update-project-brief` | Update individual fields without re-running discovery |
| `delete-project` | Remove a project |
| `get-discovery-questions` | Show users the 15 discovery questions to fill in manually |

### Design System
| Tool | When to use |
|------|------------|
| `generate-color-palette` | After discovery; generates 3 palette options with rationale |
| `validate-color-contrast` | Any time you have a foreground/background hex pair |
| `create-design-system` | After color palette; generates full token set |
| `generate-component-library` | After design system; generates component specs |

### User Flow
| Tool | When to use |
|------|------------|
| `generate-user-flow` | Immediately after discovery — before any visual design. Produces entry points, numbered states, decision forks, friction inventory, error states, conversion checkpoints, and platform nav pattern. |

### Content
| Tool | When to use |
|------|------------|
| `generate-content-architecture` | After user flow — maps narrative structure to the states defined in the flow |
| `generate-copy-guidelines` | Before writing any copy |

### Accessibility
| Tool | When to use |
|------|------------|
| `check-accessibility` | After any visual or structural design decision |
| `get-accessibility-checklist` | Audit phase; gives full checklist with must/should/recommended tiers |

### Performance
| Tool | When to use |
|------|------------|
| `analyze-performance` | Given real Core Web Vitals metrics |
| `get-core-web-vitals-targets` | Reference — LCP/FID/CLS thresholds |
| `get-performance-budget` | Budgeting JS, CSS, image, font payload |
| `analyze-mobile-performance` | Given real app metrics (launch time, fps, memory) |
| `get-mobile-performance-targets` | Reference — iOS and Android benchmark tables |

### Immersive 3D
| Tool | When to use |
|------|------------|
| `generate-3d-experience` | Building a scroll-driven cinematic 3D web experience |

---

## Design Resources (MCP Resources)

Load these via the resource system when you need reference material mid-task:

| URI | Contains |
|-----|---------|
| `reference://easing` | CSS easing functions, timing ranges (150ms–1800ms) |
| `reference://breakpoints` | 320px–1600px breakpoints, mobile-first patterns |
| `reference://typography-scale` | Major Third scale, fluid clamp() formulas |
| `reference://spacing` | 8px base unit, 4px–128px scale |
| `reference://color-psychology` | Color meaning by hue and industry |
| `reference://ios-hig` | Apple HIG: navigation, Dynamic Type, safe areas, SF Symbols, spring motion |
| `reference://material-design` | Material 3: dynamic color, type scale, 4dp grid, motion easing |
| `reference://gsap-motion` | GSAP core API, ScrollTrigger, timelines, stagger, React integration |
| `reference://webflow-animation` | Webflow IX2 triggers, scroll reveal, scrub patterns |
| `template://component/button` | Accessible button HTML/CSS |
| `template://component/card` | Card component HTML/CSS |
| `template://component/hero` | Hero section HTML/CSS |
| `template://component/navigation` | Navigation HTML/CSS |
| `template://component/form` | Accessible form HTML/CSS |

---

## Design Principles

Apply these to every recommendation and every piece of code written during a design session:

- **Flow before form** — No screen is designed before its corresponding flow state is named and its entry/exit conditions are specified. Visual design is the rendering of a flow decision, not the origin of one.
- **Every state is accountable** — Default, loading, error, empty, disabled. If a state is not specified, it does not exist and will be a defect in production.
- **Friction is measurable** — Every point of user hesitation has a severity score. Severity ≥4 is a blocker. Do not ship severity ≥4 friction unresolved.
- **Dead ends are defects** — Every error state has a recovery path. Every empty state has a fallback action. Full stop.
- **Craft obsession** — Every spacing, color, and type decision is intentional and traceable to a flow state's cognitive load requirement.
- **Platform fidelity** — Use native patterns. Fight the platform only with documented justification.
- **Accessibility as baseline** — WCAG 2.2 AA is the floor, not the ceiling. Touch targets and contrast ratios are not negotiable.
- **Performance as design** — Load time is a flow state. A 3s LCP is a severity-5 friction point at S0.
- **Systems thinking** — Tokens and components, not one-off decisions. Every component spec must cover all states present in the flow.
- **Narrative architecture** — Content section order mirrors the flow journey sequence. Act I = S0–S2, Act II = S3–S6, Act III = S7–S9.
- **Motion with purpose** — Animation signals state transitions. It never decorates.
- **Depth over decoration** — 3D experiences earn every polygon; each scroll section maps to a named flow state.

---

## Platform Quick Reference

### iOS
- Touch targets: minimum 44×44pt
- Typography: use Dynamic Type scale (from `.caption2` to `.largeTitle`)
- Safe areas: always respect `safeAreaInsets`
- Navigation: UINavigationController / NavigationStack patterns
- Spring motion: `UISpringTimingParameters` — damping 0.7, response 0.4

### Android (Material 3)
- Touch targets: minimum 48×48dp
- Typography: use sp units for all text (respects font scaling)
- Grid: 4dp base unit
- Color: use dynamic color roles (`primary`, `surface`, `tertiary`, etc.)
- Motion: standard easing 300ms, emphasized easing 500ms

### Web
- Fluid typography: `clamp()` between mobile and desktop sizes
- Breakpoints: 320 / 480 / 768 / 1024 / 1280 / 1536px
- Spacing: 8px base unit (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px)
- Focus management: visible focus ring always present

### 3D Web
- Camera: CatmullRom spline, lerp factor 0.05 for cinematic inertia
- Scroll mapping: `useRef` (not `useState\`) for progress — avoids re-renders
- Performance: `<AdaptiveDpr pixelated />` + disable Bloom on mobile
- Reduced motion: freeze camera at section 0, disable all rotation
