# Senior Design Director MCP

Professional design intelligence for any AI coding agent — works with **Claude Code**, **Cursor**, **Windsurf**, **OpenAI Codex**, **Claude Desktop**, and any MCP-compatible client.

Project discovery, design systems, color palettes, component libraries, accessibility (WCAG 2.2 AA), Core Web Vitals, and platform-specific guidance for web, iOS, Android, and cross-platform apps.

## Features

### 🎯 Project Discovery

- 15-question discovery process to capture project requirements
- Structured project briefs with audience analysis, brand positioning, and narrative structure
- `platform` field (`web` · `mobile-ios` · `mobile-android` · `mobile-cross-platform` · `both`) unlocks platform-specific outputs in every subsequent tool

### 🎨 Color & Design Systems

- AI-powered color palette generation based on emotional tone, industry, and audience
- Platform-aware design system generation:
  - **Web** — rem/px tokens, CSS custom properties, fluid clamp() typography
  - **iOS** — pt tokens, Dynamic Type scale, safe-area insets, UISpringTimingParameters
  - **Android** — dp/sp tokens, Material type scale, Material motion tokens
  - **Cross-platform** — logical px, system font references
- Component library specifications:
  - **Web** — buttons, cards, forms, modals, navigation
  - **iOS** — SwiftUI/UIKit equivalents respecting 44pt touch targets
  - **Android** — Compose/Material 3 equivalents respecting 48dp touch targets
- WCAG color contrast validation

### 📝 Content Architecture

- Three-act storytelling framework for narrative-driven content
- Page structure recommendations based on business objectives
- Copywriting guidelines aligned with brand voice

### ♿ Accessibility

- WCAG 2.2 AA compliance checking for web
- Mobile-specific checks: 44pt/48dp touch targets, Dynamic Type / sp scaling, VoiceOver / TalkBack labels, Reduce Motion support, OLED background halation detection
- Comprehensive checklist including 17-item mobile category (iOS VoiceOver, Android TalkBack, Dynamic Type, Reduce Motion, Large Content Viewer, Focus Order, Color Independence)

### ⚡ Performance

- Core Web Vitals analysis (LCP, FID, CLS) with optimization recommendations
- Mobile app performance analysis: cold/warm launch times, frame rate, memory usage, battery impact, asset density coverage
- Benchmark tables for iOS and Android (good/needs improvement/poor thresholds)
- Performance budget guidelines and caching recommendations

### 📚 Design Resources

- Animation easing reference with timing guidelines
- Responsive breakpoint systems
- Typography scale systems
- Component templates (HTML/CSS)
- Color psychology reference
- **iOS HIG** — navigation patterns, Dynamic Type scale, safe areas, SF Symbols, spring motion, semantic color tokens
- **Material Design 3** — dynamic color roles, type scale, component specs, 4dp grid, motion easing + duration scale

## Installation

> **Requirements**: Node.js 18 or higher

### Install as an Agent Skill (Claude Code, Cursor, Codex, and more)

Install the companion skill — teaches any compatible agent the full workflow for using this server:

```bash
npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director
```

The skill is installed locally into your agent's skills directory (`.claude/skills/`, `.cursor/skills/`, etc.) alongside the MCP server config below.

---

### MCP Server — One-line install via npx (recommended)

No build step needed — just add the config block to your AI client and it downloads and runs the server automatically on first use.

---

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop after saving.

---

### Claude Code (CLI)

```bash
claude mcp add senior-design-director -- npx -y senior-design-director-mcp
```

Or add manually to `~/.claude.json` (global) or `.mcp.json` (project-level), using the same JSON format as Claude Desktop above.

---

### Cursor

Open **Settings → Cursor Settings → MCP**, click **Add new MCP server**, and paste:

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

### Windsurf

**macOS/Linux**: `~/.codeium/windsurf/mcp_config.json`
**Windows**: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`

Or via **Cascade panel → MCP icon → Add server**:

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

### Codex (OpenAI)

Codex uses TOML format. Add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project):

```toml
[mcp_servers.senior-design-director]
command = "npx"
args = ["-y", "senior-design-director-mcp"]
```

Or via the Codex CLI:

```bash
codex mcp add senior-design-director -- npx -y senior-design-director-mcp
```

---

### Any other MCP-compatible client

Use the same pattern — run `npx -y senior-design-director-mcp` as the server command. The `-y` flag auto-confirms the package download on first run.

---

### Global install (optional)

If you prefer a permanent install instead of `npx`:

```bash
npm install -g senior-design-director-mcp
```

Then use `senior-design-director-mcp` as the command (no `npx` or `args` needed).

## Available Tools

### Project Discovery

#### `complete-project-discovery`

Complete the full 15-question discovery process and create a project brief. Include `platform` to enable mobile-specific outputs in every downstream tool.

**Example:**

```javascript
{
  "projectName": "Acme Design Studio",
  "projectDescription": "Boutique design studio helping SaaS startups build conversion-focused products",
  "industryCategory": "Design Agency",
  "platform": "mobile-ios",
  "audienceRole": "Startup founders",
  "emotionalTone": ["Sophisticated & Premium", "Warm & Human"],
  "primaryCTA": "Schedule a consultation call",
  // ... (see full schema in tool definition)
}
```

#### `get-project-brief`

Retrieve a saved project brief by name.

#### `list-projects`

List all saved project briefs.

#### `get-discovery-questions`

Get the full list of 15 discovery questions for reference.

### Color & Design Systems

#### `generate-color-palette`

Generate color palette recommendations based on project brief analysis.

**Returns:** Primary palette + 2 alternative palettes with rationale

#### `validate-color-contrast`

Check WCAG contrast ratio between foreground and background colors.

```javascript
{
  "foreground": "#1a1a2e",
  "background": "#ffffff"
}
```

#### `create-design-system`

Generate complete design system. When `platform` is set, emits native tokens (pt/dp), platform-appropriate type scale, and platform motion tokens.

#### `generate-component-library`

Generate component specifications based on design system. Returns SwiftUI/UIKit or Compose/Material 3 specs for mobile platforms.

### Content Architecture

#### `generate-content-architecture`

Create narrative-driven content structure using three-act storytelling.

#### `generate-copy-guidelines`

Generate copywriting guidelines based on brand voice and positioning.

### Accessibility

#### `check-accessibility`

Check accessibility compliance for web and mobile. Pass `platform` to enable mobile-specific checks (touch targets, Dynamic Type, VoiceOver/TalkBack labels, Reduce Motion, OLED backgrounds).

**Web example:**

```javascript
{
  "colors": [
    { "foreground": "#1a1a2e", "background": "#ffffff" }
  ],
  "semanticHTML": "<main><nav>...</nav></main>",
  "formLabels": true,
  "headingHierarchy": ["h1", "h2", "h3"],
  "ariaLabels": true,
  "keyboardNav": true
}
```

**Mobile example:**

```javascript
{
  "platform": "mobile-ios",
  "colors": [{ "foreground": "#1C1C1E", "background": "#FFFFFF" }],
  "touchTargetSize": 36,
  "minimumTapSpacing": 4,
  "dynamicTypeSupport": false,
  "screenReaderLabels": true,
  "reduceMotionSupport": false,
  "oledBackground": "#000000"
}
```

#### `get-accessibility-checklist`

Get comprehensive checklist covering WCAG 2.2 AA + Apple Accessibility (VoiceOver, Dynamic Type, Reduce Motion, Large Content Viewer) + Android Accessibility (TalkBack, font scaling, animation scale) — organized by category with `must` / `should` / `recommended` priority levels.

### Performance

#### `analyze-performance`

Analyze Core Web Vitals and get optimization recommendations.

```javascript
{
  "lcp": 2800,
  "fid": 120,
  "cls": 0.15,
  "bundleSize": 180,
  "imageOptimization": "partial",
  "lazyLoading": true,
  "caching": "partial",
  "fontLoading": "swap"
}
```

#### `get-core-web-vitals-targets`

Get Core Web Vitals targets and thresholds (good/needs improvement/poor) for LCP, FID, CLS, FCP, TTI, and TBT.

#### `get-performance-budget`

Get recommended performance budget for JS, CSS, images, fonts, third-party scripts, and total page weight.

#### `analyze-mobile-performance`

Analyze mobile app performance metrics against platform benchmarks.

```javascript
{
  "platform": "mobile-ios",
  "coldLaunchMs": 820,
  "warmLaunchMs": 550,
  "frameRate": 48,
  "memoryUsageMb": 180,
  "batteryImpact": "high",
  "assetDensities": ["@1x", "@2x"]
}
```

**Returns:** Severity-ranked issues for each metric with platform-specific recommendations.

#### `get-mobile-performance-targets`

Get the full iOS and Android benchmark tables: cold/warm launch, frame rate, memory budgets, and asset density requirements.

## Available Resources

Access design templates and references via the resource system:

### Templates

- `template://project-brief` — Project brief template
- `template://component/button` — Button component HTML/CSS
- `template://component/card` — Card component HTML/CSS
- `template://component/hero` — Hero section HTML/CSS
- `template://component/navigation` — Navigation HTML/CSS
- `template://component/form` — Form component HTML/CSS

### References

- `reference://easing` — CSS easing functions with timing ranges (micro 150ms → long 1800ms)
- `reference://breakpoints` — Standard breakpoints 320px–1600px with mobile-first patterns
- `reference://typography-scale` — Major Third scale in CSS custom properties, fluid clamp() formulas
- `reference://spacing` — 8px base unit scale from 4px to 128px
- `reference://color-psychology` — Color psychology by hue family and industry
- `reference://webflow-animation` — Webflow IX2 trigger types, scroll reveal, stagger, scrub patterns
- `reference://gsap-motion` — GSAP core API, timeline sequencing, ScrollTrigger, stagger, React useGSAP
- `reference://ios-hig` — Apple HIG: navigation patterns, Dynamic Type scale, safe areas, SF Symbols, spring motion, semantic color tokens
- `reference://material-design` — Material Design 3: dynamic color roles, type scale, component specs, 4dp grid, motion easing + duration scale

## Example Workflow

### Step 1 — Project Discovery

```text
Use complete-project-discovery (include "platform" for mobile projects)
```

### Step 2 — Generate Design System

```text
Use generate-color-palette to get color recommendations
Use create-design-system to get platform-appropriate tokens
Use generate-component-library for component specs
```

### Step 3 — Create Content Strategy

```text
Use generate-content-architecture for page structure
Use generate-copy-guidelines for writing guidance
```

### Step 4 — Validate Accessibility & Performance

Web:

```text
Use check-accessibility to validate WCAG 2.2 AA compliance
Use analyze-performance for Core Web Vitals recommendations
```

Mobile:

```text
Use check-accessibility with platform field for VoiceOver/TalkBack, touch targets, Dynamic Type
Use analyze-mobile-performance for launch time, frame rate, memory, battery analysis
```

### Step 5 — Reference During Implementation

Web:

```text
template://component/*   → Ready-to-use HTML/CSS components
reference://gsap-motion  → GSAP scroll animations
```

Mobile:

```text
reference://ios-hig          → Apple HIG navigation, typography, safe areas
reference://material-design  → Material 3 color system, motion, component specs
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (rebuild on changes)
npm run watch

# Run in development
npm run dev
```

## Architecture

```text
src/
├── index.ts                 # Main MCP server
├── types/                   # TypeScript type definitions
│   └── index.ts
├── tools/                   # Tool implementations
│   ├── projectDiscovery.ts
│   ├── colorPalette.ts
│   ├── designSystem.ts
│   ├── contentArchitecture.ts
│   ├── accessibility.ts
│   └── performance.ts
├── resources/               # Template and reference providers
│   └── templates.ts
└── utils/                   # Utility functions
    └── storage.ts           # File-based persistent storage (~/.senior-design-director-mcp/)
```

## Design Principles

This MCP server embodies world-class design studio standards:

- **Craft Obsession**: Every decision is intentional and systematic
- **User-Centered Narrative**: Design solves problems, doesn't just decorate
- **Performance as Design**: Fast experiences are better UX
- **Accessibility as Baseline**: Inclusive design is non-negotiable
- **Motion with Purpose**: Animation guides, clarifies, or delights
- **Systems Thinking**: Create reusable patterns, not one-offs
- **Platform Fidelity**: Native patterns feel right — fight the platform at your peril

## Methodology

Every recommendation from this server is grounded in the same principles used at world-class design studios:

- Strategic visual hierarchy — guiding attention deliberately across every viewport
- Sophisticated motion design — animation that signals state, guides flow, and reinforces brand
- Narrative-driven content architecture — page structure derived from story, not layout convention
- WCAG 2.2 AA accessibility standards — inclusive design built in from the start
- Apple HIG and Material Design 3 compliance — platform-native patterns that respect user expectations
- Core Web Vitals performance optimization — speed and stability as design requirements
- Mobile performance benchmarks — cold launch, frame rate, and memory as first-class design constraints
- Three-act storytelling framework — scroll mapped to emotional journey
- Design system methodology — consistent tokens and components rather than one-off decisions

## License

MIT

## Contributing

Contributions welcome! Please ensure:

- TypeScript types are properly defined
- Tools return structured JSON responses
- Resources use appropriate MIME types
- Code follows existing patterns

## Support

For issues, questions, or feature requests, please open an issue in the repository.
