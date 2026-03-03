---
name: senior-design-director
description: Senior design director guidance for web and mobile projects — project discovery, design systems, color palettes, accessibility, performance, and platform-specific design (iOS HIG, Material Design 3). Use when working on any UI/UX design task, building a design system, validating accessibility, analyzing web performance, or designing for iOS or Android.
license: MIT
metadata:
  author: AbrahamOO
  version: "1.1.0"
  mcp-package: senior-design-director-mcp
compatibility: Requires the senior-design-director-mcp MCP server to be running. Install via npx -y senior-design-director-mcp.
---

# Senior Design Director

This skill activates world-class design director thinking for any UI/UX project. It pairs with the `senior-design-director-mcp` MCP server, which provides the underlying tools.

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

Always follow this sequence. Each step builds on the previous one.

### Step 1 — Project Discovery (always first)

Run `complete-project-discovery` before anything else. This creates the project brief that all subsequent tools draw from.

**Required fields**: `projectName`, `projectDescription`, `industryCategory`, `audienceRole`, `primaryCTA`, `emotionalTone`

**Critical**: Include `platform` to unlock platform-specific outputs in every downstream tool:
- `web` — CSS tokens, rem/px, fluid clamp() typography
- `mobile-ios` — pt tokens, Dynamic Type, SF Symbols, UIKit/SwiftUI specs
- `mobile-android` — dp/sp tokens, Material type scale, Compose/Material 3 specs
- `mobile-cross-platform` — React Native / Flutter logical units
- `both` — web + mobile combined

### Step 2 — Color System

1. `generate-color-palette` — AI-driven palette based on emotional tone + industry
2. `validate-color-contrast` — WCAG AA check on all text/background pairs

### Step 3 — Design System

1. `create-design-system` — Typography scale, spacing, breakpoints, motion tokens
2. `generate-component-library` — Platform-appropriate component specs (buttons, cards, forms, navigation, modals)

### Step 4 — Content Strategy

1. `generate-content-architecture` — Three-act narrative structure mapped to page/screen sections
2. `generate-copy-guidelines` — Brand voice, tone, and writing rules

### Step 5 — Accessibility Validation

Use `check-accessibility` continuously, not just at the end.

**Web checks**: colors, semantic HTML, form labels, heading hierarchy, ARIA labels, keyboard nav

**Mobile checks**: touch targets (44pt iOS / 48dp Android), Dynamic Type / sp scaling, VoiceOver / TalkBack labels, Reduce Motion, OLED background halation

Use `get-accessibility-checklist` for the full WCAG 2.2 AA + Apple + Android checklist.

### Step 6 — Performance

**Web**: `analyze-performance` → `get-core-web-vitals-targets` → `get-performance-budget`

**Mobile**: `analyze-mobile-performance` → `get-mobile-performance-targets`

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

### Content
| Tool | When to use |
|------|------------|
| `generate-content-architecture` | Planning page/screen structure |
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

- **Craft obsession** — Every spacing, color, and type decision is intentional
- **Platform fidelity** — Use native patterns. Fight the platform only with strong reason
- **Accessibility as baseline** — WCAG 2.2 AA is the floor, not the ceiling
- **Performance as design** — Speed is a feature; load time is part of UX
- **Systems thinking** — Tokens and components, not one-off decisions
- **Narrative architecture** — Page/screen structure follows story arc, not layout convention
- **Motion with purpose** — Animation guides, clarifies, or delights — never decorates

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
