# Senior Design Director MCP

[![npm version](https://img.shields.io/npm/v/senior-design-director-mcp)](https://www.npmjs.com/package/senior-design-director-mcp)
[![npm downloads](https://img.shields.io/npm/dm/senior-design-director-mcp)](https://www.npmjs.com/package/senior-design-director-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

Professional design intelligence for any AI coding agent, works with **Claude Code**, **Cursor**, **Windsurf**, **OpenAI Codex**, **Claude Desktop**, and any MCP-compatible client.

**Senior Design Director MCP** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives your AI agent the capabilities of a senior creative director. It runs a structured 15-question project discovery process, generates complete design systems for **web and premium mobile apps** (iOS, Android, React Native, Flutter), validates WCAG accessibility, analyzes Core Web Vitals and native app performance, delivers production-ready component templates, and generates **fully immersive scroll-driven 3D web experiences** using React Three Fiber and WebGL — all grounded in a persistent project brief so every design decision stays consistent.

---

## Why Senior Design Director MCP?

Most AI design tools give you generic answers. This server works differently: it starts by deeply understanding your project, your audience, brand positioning, competitive landscape, and narrative arc, and then derives every color, typographic, and content decision from that context.

The result is design direction that's specific to your project, not recycled from a template.

- **Brief-driven**: every recommendation traces back to who the site is for and what it must accomplish
- **Systematic**: color palettes, type scales, spacing, motion, and components are all connected to one design system
- **Standards-compliant**: WCAG 2.1 AA accessibility and Core Web Vitals are built into the workflow, not added at the end
- **Persistent**: project briefs are saved to disk and survive server restarts, so context carries across every conversation
- **Cinematic**: when the project calls for it, generate scroll-driven 3D experiences — real depth on the Z-axis, not parallax

---

## Quick Start

### One-command setup (recommended)

Run this once to configure all your MCP clients (Claude Code, Claude Desktop, Cursor, Windsurf, Codex) and install the agent skill:

```bash
npx senior-design-director-mcp install
```

Detects which clients are installed, writes the correct config for each, and installs the agent skill. Restart any open clients after running.

---

### Manual setup

Use the sections below if you prefer to configure a specific client yourself. Note: manual setup only registers the MCP server. To also install the agent skill, run:

```bash
npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director
```

---

### Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

**macOS/Linux:** `~/.codeium/windsurf/mcp_config.json`
**Windows:** `%USERPROFILE%\.codeium\windsurf\mcp_config.json`

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

Use the same pattern, run `npx -y senior-design-director-mcp` as the server command. The `-y` flag auto-confirms the package download on first run.

---

### Global install (optional)

If you prefer a permanent install instead of `npx`:

```bash
npm install -g senior-design-director-mcp
```

Then use `senior-design-director-mcp` as the command (no `npx` or `args` needed).

---

## What It Does

Rather than answering generic design questions, this MCP server operates like a senior creative director onboarding a new project. It:

1. **Runs a 15-question discovery session** to capture your audience, brand positioning, narrative arc, CTA strategy, and visual direction
2. **Saves the project brief** to disk so context persists across every conversation and tool call
3. **Derives all design decisions from that brief**: color palettes, type systems, content structure, and copy voice all connect back to who the site is for and what it needs to accomplish

---

## Features

### Project Discovery & Brief Management

- 15-question structured brief covering audience psychology, brand positioning, narrative arc, CTAs, visual personality, content inventory, technical requirements, and competitive landscape
- Persistent file-based storage (`~/.senior-design-director-mcp/projects/`), briefs survive server restarts and new conversations
- Full CRUD operations: create, retrieve, update, and delete project briefs
- Standalone `get-discovery-questions` tool for preparing answers before running discovery

### What Kinds of Designs Can It Direct?

| Project Type | Platform | Key Outputs |
| --- | --- | --- |
| SaaS / startup websites | Web | Design system, responsive breakpoints, copy guidelines, GSAP animations |
| Agency / portfolio sites | Web | Three-act narrative structure, type-forward layouts, premium motion system |
| E-commerce / product sites | Web | Conversion-focused CTA strategy, trust-building content architecture |
| iOS apps | Native iOS | SF Pro typography with Dynamic Type, pt spacing, UITabBar/UINavigationBar specs, spring motion tokens, safe area system, VoiceOver compliance |
| Android apps | Native Android | Material Design 3 components, sp/dp system, Google Sans/Roboto scale, Material motion system, TalkBack compliance |
| React Native apps | Cross-platform | Platform-branched fonts, logical px spacing, shared motion tokens, safe area inset values |
| Flutter apps | Cross-platform | Platform-aware type scale, Material/Cupertino hybrid patterns, shared spacing system |
| Web + Mobile | Both | Full web breakpoints AND native mobile tokens, single design brief drives both surfaces |
| Immersive 3D website | Web | Scroll-driven 3D scene, CatmullRom camera spline, R3F + postprocessing, WebGL shaders |

### AI-Powered Color & Design System Generation

- Color palette generation derived from emotional tone, industry category, and audience psychology, returns a primary palette plus two alternatives, each with hex values, RGB, usage rationale, and application guidelines
- WCAG contrast ratio validation with AA/AAA pass/fail for normal and large text
- **Platform-aware design system**: web (rem + breakpoints), iOS (pt + Dynamic Type + safe areas), Android (dp/sp + Material type scale), cross-platform (logical px + shared tokens)
- **Mobile tokens**: UISpringTimingParameters / Material motion curves, touch target minimums (44pt iOS / 48dp Android), safe area insets (Dynamic Island-aware), screen size reference for iPhone SE through iPad Pro 12.9" and Android compact through large tablet
- Component library specifications: web (buttons, cards, nav, forms, hero) + mobile native (UITabBar, UINavigationBar, Bottom Sheet, List Row, TextField, Toast/Snackbar, FAB, AsyncImage) with platform-specific states, haptic feedback, and edge cases

### Content Architecture & Copywriting

- Three-act narrative structure mapping scroll position to emotional journey (Problem → Transformation → Outcome)
- Page structure recommendations tied to business objectives and conversion goals
- Brand voice and copywriting guidelines, headline formulas, vocabulary, CTA copy patterns, and before/after examples, all derived from brand positioning

### Immersive 3D Web Experience Generation

- Generates a complete scroll-driven cinematic 3D experience using **React Three Fiber**, **Three.js**, and **@react-three/postprocessing**
- Seven visual styles: `cosmic`, `architectural`, `organic`, `minimal`, `brutalist`, `liquid`, `crystalline` — each with its own geometry, lighting choreography, and camera language
- Camera follows a **CatmullRom spline** with per-section waypoints; scroll progress (0→1) drives the `t` parameter via a ref-based hook (zero re-renders)
- Smooth cinematic camera via `lerp` at factor 0.05; look-ahead targeting for natural orientation
- Per-scene: object interactions (scale, rotation, morph, particle bursts), lighting directives (spotlights, point lights, hemi), postprocessing (Bloom + ChromaticAberration)
- Optional **GLSL vertex displacement shaders** for scroll-reactive geometry deformation
- Performance-first: `<AdaptiveDpr>`, instancing guidance, LOD strategy, and zero-`useState` scroll tracking
- `prefers-reduced-motion` fallback: camera frozen at section 0, all rotation disabled

### WCAG Accessibility & Mobile Accessibility Compliance

- WCAG 2.2 AA compliance checking across color combinations, semantic HTML structure, form labels, heading hierarchy, ARIA attributes, and keyboard navigation
- **Mobile accessibility**: touch target validation (44pt iOS HIG / 48dp Material), Dynamic Type support check, VoiceOver/TalkBack label completeness, Reduce Motion support, OLED pure-black contrast
- Scored report (0–100) with severity-ranked issues (critical / serious / moderate / minor) and specific fix recommendations
- Complete checklist covering WCAG 2.2 + Apple Accessibility + Android Accessibility standards, organized by category

### Core Web Vitals & Mobile App Performance Analysis

- Core Web Vitals analysis: LCP, FID, CLS with scored recommendations and specific optimization actions
- Additional web metrics: FCP, TTI, TBT with good/needs improvement/poor thresholds
- **Mobile performance**: app launch time (cold/warm), frame rate analysis, memory usage, battery impact, and asset density coverage, each with platform-specific recommendations citing the right profiling tool (Xcode Instruments, Android Studio Profiler, MetricKit, Android Vitals)
- Performance budget guidelines for JS, CSS, images, fonts, and third-party scripts

### Design Reference Library

- Animation easing functions with timing guidance for micro (150ms), short (300ms), medium (500ms), and long (800ms+) durations
- Responsive breakpoint system (320px–1600px) with mobile-first implementation patterns
- Fluid typography scale with `clamp()` formulas and line-height rules
- 8px spacing system with usage guidelines for components, sections, and page layout
- Color psychology reference by emotion and industry category
- Webflow Interactions (IX2), trigger types, action types, scroll reveal, stagger, and scrub patterns
- GSAP complete reference, core API, timelines, ScrollTrigger, stagger, `matchMedia` for reduced motion, and React `useGSAP` integration
- **iOS HIG reference**: navigation patterns, Dynamic Type scale, SF Symbols, safe areas, touch targets, spring motion, and common edge cases
- **Material Design 3 reference**: dynamic color system, Material type scale (sp), component specs (FAB, Bottom Sheet, Navigation Bar), motion easing curves, and edge cases

---

## Tools Reference

### Project Discovery Tools

#### `complete-project-discovery`

Runs the full 15-question discovery process and saves a structured project brief. This is the entry point, all downstream tools read from this brief.

**Required parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `projectName` | string | Project or company name |
| `projectDescription` | string | What the project does (2–3 sentences) |
| `industryCategory` | string | Industry category (e.g. SaaS, Wellness, E-commerce) |
| `audienceRole` | string | Primary audience job title or role |
| `primaryCTA` | string | The single most important action visitors should take |
| `emotionalTone` | string[] | 3–5 tones from the list below |

**Optional parameters (fill in as many as possible for best results):**

| Parameter | Type | Description |
| --- | --- | --- |
| `painPoints` | string | Problems the audience is trying to solve |
| `objections` | string | Skepticism or objections they might have |
| `fear` | string | Fears or concerns they have |
| `uniquePosition` | string | What makes you different from competitors |
| `philosophy` | string | What you believe strongly about |
| `desiredPerception` | string | How you want to be perceived |
| `beforeState` | string | Customer state before working with you |
| `transformationMoment` | string | The "aha" turning point |
| `afterState` | string | Customer state after working with you |
| `successMetric` | string | How you measure success |
| `primaryCTAOutcome` | string | Desired outcome of the primary CTA |
| `secondaryCTAs` | string[] | 2–3 secondary actions |
| `visualPersonality` | string | How the brand would dress/present |
| `aestheticReferences` | string[] | Websites or brands that inspire you visually |
| `photographyStyle` | string | Photography/imagery style |
| `mood` | string | Photography mood |
| `treatment` | string | Photography treatment (color grading, etc.) |
| `keyMessages` | string[] | 3–5 key messages in priority order |
| `proofPoints` | object | Proof by category: `{ experience, clients, results, awards }` |
| `contentInventory` | string[] | Content/assets already available |
| `contentGaps` | string[] | Content that needs to be created |
| `pageStructure` | string[] | Pages/sections in priority order |
| `platform` | string | `"web"` · `"mobile-ios"` · `"mobile-android"` · `"mobile-cross-platform"` · `"both"` (defaults to `"web"`) |
| `techStackPreference` | string | Preferred technology stack |
| `integrations` | string[] | Required integrations (CRM, payments, etc.) |
| `cmsStrategy` | string | CMS approach |
| `timeline` | string | Target launch timeline |
| `seoPriority` | string | SEO priority level |
| `competitors` | string[] | Top 3–5 competitors |
| `competitiveAdvantages` | string[] | How to differentiate visually and strategically |
| `visualInspiration` | string[] | Brands outside your industry that inspire you |
| `successMetrics` | string[] | How to measure website success |
| `conversionGoal` | string | Primary conversion goal |
| `businessObjective` | string | Overarching business objective |
| `existingColors` | string | Existing brand colors or "None" |
| `colorPreferences` | string | Color direction or "Open to recommendation" |
| `colorConstraints` | string | Colors to avoid or "None" |

**Emotional tone options:** Energetic & Inspiring · Calm & Trustworthy · Sophisticated & Premium · Playful & Approachable · Bold & Rebellious · Warm & Human · Professional & Authoritative · Innovative & Futuristic · Grounded & Authentic

---

#### `get-project-brief`

Retrieve a saved project brief.

```json
{ "projectName": "TechFlow" }
```

#### `list-projects`

List all saved project briefs.

#### `delete-project`

Delete a saved project brief.

```json
{ "projectName": "TechFlow" }
```

#### `update-project-brief`

Update specific fields without replacing the entire brief.

```json
{
  "projectName": "TechFlow",
  "updates": {
    "CTA_STRATEGY": {
      "PRIMARY_CTA": "Book a demo",
      "PRIMARY_CTA_OUTCOME": "Schedule 30-minute demo call",
      "SECONDARY_CTAS": ["Start free trial", "Read case studies"]
    }
  }
}
```

#### `get-discovery-questions`

Returns all 15 discovery questions formatted for manual use or pre-brief preparation.

---

### Color & Design System Tools

#### `generate-color-palette`

Generates a color palette derived from the project brief, emotional tone, industry category, brand positioning, and color constraints. Returns a primary palette plus two alternatives, each with hex values, RGB, usage guidance, psychological rationale, and application guidelines.

```json
{ "projectName": "TechFlow" }
```

#### `validate-color-contrast`

Checks WCAG contrast ratio between any two hex colors. Returns the ratio, AA pass/fail for normal and large text, AAA pass/fail, and a recommendation.

```json
{
  "foreground": "#1a1a2e",
  "background": "#ffffff"
}
```

**Returns:**

```json
{
  "ratio": 18.6,
  "passesAA": true,
  "passesAAA": true,
  "largeTextAA": true,
  "recommendation": "Excellent contrast. Meets WCAG AAA for all text sizes."
}
```

#### `create-design-system`

Generates a complete, platform-aware design system from the project brief:

- **Typography**: platform-appropriate fonts (SF Pro for iOS, Google Sans/Roboto for Android, system fonts for cross-platform, custom fonts for web); full type scale in the correct unit (pt / sp / px / rem) with line heights and use cases; Dynamic Type support for iOS
- **Spacing**: 8pt (iOS) / 8dp (Android) / 8px (cross-platform/web) base unit with full scale
- **Breakpoints**: (web/both only) mobile small through ultra-wide with column counts
- **Mobile tokens**: (mobile/both only) safe area insets (Dynamic Island-aware), touch target minimums, screen size reference for all iPhone models and Android phones/tablets, native spring/motion parameters
- **Motion**: iOS spring physics (UISpringTimingParameters), Material motion tokens, or CSS easing curves, derived from emotional tone
- **Colors**: full palette derived from the project brief

```json
{ "projectName": "TechFlow" }
```

#### `generate-component-library`

Generates specifications for UI components appropriate for the project's platform. **Web:** primary/secondary/ghost buttons with states and sizing, card variants, navigation with mobile menu, contact forms, hero sections, and feature grids. **Mobile:** UIButton/Material Button, UITabBar/Navigation Bar, Bottom Sheet (UISheetPresentationController/BottomSheetDialogFragment), List Row (UITableView/LazyColumn), TextField with keyboard type guidance, Toast/Snackbar, FAB with scroll-hide behavior, and AsyncImage with shimmer loading, each with platform-specific states, haptic feedback guidance, safe area notes, and edge cases.

```json
{ "projectName": "TechFlow" }
```

---

### Content Architecture Tools

#### `generate-content-architecture`

Maps the project brief's narrative arc to a three-act scroll structure:

- **Act I**: Problem space and emotional resonance (above the fold through ~33% scroll)
- **Act II**: Solution, proof, and trust building (33–66% scroll)
- **Act III**: Transformation, social proof, and conversion (66–100% scroll)

Returns section assignments, visual strategy, and emotional tone for each act, plus a prioritized page structure with sections and primary CTAs.

```json
{ "projectName": "TechFlow" }
```

#### `generate-copy-guidelines`

Returns brand-specific copywriting guidelines derived from the project brief: headline formulas aligned with emotional tone, body copy voice and vocabulary, CTA copy patterns, things to always say and never say, and before/after copy examples.

```json
{ "projectName": "TechFlow" }
```

---

### Accessibility Tools

#### `check-accessibility`

Analyzes accessibility compliance for web and mobile. Pass `platform` to enable mobile-specific checks.

**Web example:**

```json
{
  "colors": [
    { "foreground": "#4F46E5", "background": "#ffffff" },
    { "foreground": "#ffffff", "background": "#4F46E5" }
  ],
  "semanticHTML": "<main><nav><a href='/'>Home</a></nav><section><h1>Welcome</h1></section></main>",
  "formLabels": true,
  "headingHierarchy": ["h1", "h2", "h3", "h2", "h3"],
  "ariaLabels": true,
  "keyboardNav": true
}
```

**Mobile example:**

```json
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

**Returns:** Score out of 100, severity-ranked issues with platform-specific fix recommendations, and WCAG 2.2 compliance summary.

#### `get-accessibility-checklist`

Returns a comprehensive checklist covering WCAG 2.2 AA + Apple Accessibility (VoiceOver, Dynamic Type, Reduce Motion, Large Content Viewer) + Android Accessibility (TalkBack, font scaling, animation scale), organized by category with `must` / `should` / `recommended` priority levels.

---

### Performance Tools

#### `analyze-performance`

Analyzes Core Web Vitals and supporting metrics. Returns an overall score out of 100 plus prioritized optimization recommendations for each metric that needs attention.

```json
{
  "lcp": 2800,
  "fid": 120,
  "cls": 0.15,
  "bundleSize": 180,
  "imageOptimization": "partial",
  "lazyLoading": false,
  "caching": "none",
  "fontLoading": "blocking"
}
```

| Parameter | Type | Values |
| --- | --- | --- |
| `lcp` | number | Largest Contentful Paint in ms |
| `fid` | number | First Input Delay in ms |
| `cls` | number | Cumulative Layout Shift score |
| `bundleSize` | number | Total JS bundle size in KB |
| `imageOptimization` | string | `"none"` · `"partial"` · `"full"` |
| `lazyLoading` | boolean | Whether lazy loading is implemented |
| `caching` | string | `"none"` · `"partial"` · `"full"` |
| `fontLoading` | string | `"blocking"` · `"swap"` · `"optional"` |

#### `get-core-web-vitals-targets`

Returns good/needs improvement/poor thresholds for LCP, FID, CLS, FCP, TTI, and TBT with descriptions and user impact explanations.

#### `get-performance-budget`

Returns recommended budgets for JS, CSS, images, fonts, third-party scripts, total page weight, HTTP requests, and LCP element, each with reasoning.

#### `analyze-mobile-performance`

Analyzes mobile app performance metrics against platform benchmarks. Pass measured values and receive severity-ranked issues with fix recommendations.

```json
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

| Parameter | Type | Description |
| --- | --- | --- |
| `platform` | string | **Required.** `"mobile-ios"` · `"mobile-android"` · `"mobile-cross-platform"` |
| `coldLaunchMs` | number | Cold launch time in ms (iOS target ≤400ms, Android ≤500ms) |
| `warmLaunchMs` | number | Warm launch time in ms (iOS target ≤200ms, Android ≤300ms) |
| `frameRate` | number | Measured frame rate in fps (target 60fps; ProMotion 120fps) |
| `memoryUsageMb` | number | Active memory usage in MB |
| `batteryImpact` | string | `"low"` · `"medium"` · `"high"` |
| `assetDensities` | string[] | Provided asset densities, e.g. `["@1x","@2x","@3x"]` |

**Returns:** Severity-ranked issues for each metric with platform-specific recommendations.

#### `get-mobile-performance-targets`

Returns the full benchmark table for iOS and Android: cold/warm launch targets, frame rate targets, memory budgets, and asset density requirements, each with good/needs improvement/poor thresholds.

---

### Immersive 3D Tools

#### `generate-3d-experience`

Generates a production-ready scroll-driven 3D web experience. Outputs a complete React Three Fiber implementation: camera spline, scene components, scroll hook, postprocessing pipeline, CSS layout, and optional GLSL shaders.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `concept` | string | required | Theme/narrative of the 3D world (e.g. `"crystalline neural network"`, `"brutalist concrete city"`) |
| `sections` | number (3–7) | `5` | Number of scroll scenes; each maps to a camera waypoint |
| `style` | string | `"cosmic"` | `cosmic` · `architectural` · `organic` · `minimal` · `brutalist` · `liquid` · `crystalline` |
| `primaryColor` | string | `"#6c63ff"` | Brand hex used for geometry, particles, and emissive lighting |
| `framework` | string | `"react-three-fiber"` | `react-three-fiber` · `vanilla-threejs` |
| `includeShaders` | boolean | `false` | Include custom GLSL vertex/fragment displacement shaders |

**Example:**

```json
{
  "concept": "deep ocean bioluminescence",
  "style": "liquid",
  "sections": 5,
  "primaryColor": "#00d4ff",
  "includeShaders": true
}
```

**Returns:**

- Concept summary and tech stack with install command
- Section-by-section scene breakdown with camera movement, object interactions, and lighting directives per scroll range
- `use-scroll-progress.ts` — ref-based scroll hook (no re-renders)
- `camera-path.ts` — CatmullRom spline with `CameraRig` R3F component
- `Scene.tsx` — full Canvas with hero geometry, particle field, lights, environment, and postprocessing
- `page.tsx` — scroll container + overlay structure
- `experience.css` — fixed canvas, transparent scroll driver, reduced-motion and mobile rules
- GLSL displacement shader pair (if `includeShaders: true`)
- Performance strategy table and mobile fallback code

---

## Resources Reference

Resources are accessed via the MCP resource system and return ready-to-use content.

### Component Templates

| URI | Description |
| --- | --- |
| `template://project-brief` | Markdown template for manual brief completion |
| `template://component/button` | Accessible button HTML/CSS with variants and states |
| `template://component/card` | Card component with hover animation |
| `template://component/hero` | Two-column hero section with responsive layout |
| `template://component/navigation` | Sticky nav with mobile menu and scroll behavior |
| `template://component/form` | Accessible contact form with validation styles |

All component templates use CSS custom properties (`--color-primary`, `--color-secondary`, etc.) that map directly to the generated design system.

### Design Reference Resources

| URI | Description |
| --- | --- |
| `reference://easing` | CSS easing functions with timing ranges (micro 150ms → long 1800ms) and GPU performance rules |
| `reference://breakpoints` | Standard breakpoints 320px–1600px with mobile-first implementation patterns |
| `reference://typography-scale` | Major Third scale in CSS custom properties, fluid `clamp()` formulas, line-height and letter-spacing rules |
| `reference://spacing` | 8px base unit scale from 4px to 128px with component, section, and layout usage guidelines |
| `reference://color-psychology` | Color psychology by hue family and industry, saturation rules, WCAG contrast requirements |
| `reference://webflow-animation` | Webflow IX2 trigger types, action types, scroll reveal patterns, stagger patterns, scrub patterns, performance rules, and timing by element type |
| `reference://gsap-motion` | GSAP core API (to/from/fromTo/set), easing reference, timeline sequencing, ScrollTrigger (reveal, scrub, pin), stagger, `matchMedia` for reduced motion, React `useGSAP` integration, and design token mapping |
| `reference://ios-hig` | Apple Human Interface Guidelines: NavigationStack/TabBar/Sheet patterns, Dynamic Type scale (11pt–34pt), safe area table (Dynamic Island-aware), SF Symbols usage, spring motion parameters, semantic color tokens, and 8 edge cases |
| `reference://material-design` | Material Design 3: dynamic color roles, type scale (11sp–57sp), component specs (buttons, Top App Bar, Navigation Bar, Bottom Sheet, Cards), 4dp spacing grid, motion easing curves + duration scale, and 10 edge cases |

---

## End-to-End Workflow

### Phase 1: Discovery

Run `complete-project-discovery` with all answers. Include `"platform": "mobile-ios"` (or `"mobile-android"`, `"mobile-cross-platform"`, `"both"`) to unlock platform-specific outputs in every subsequent tool.

Use `get-discovery-questions` first if you want to prepare answers in advance. After discovery, use `get-project-brief` to review the saved brief and `update-project-brief` to refine any field without re-running the full discovery.

### Phase 2: Design System

```text
generate-color-palette       → Review primary palette and two alternatives
validate-color-contrast      → Check every text/background combination
create-design-system         → Full design tokens (pt/dp for mobile, rem for web)
generate-component-library   → Platform-native component specs for implementation
```

For mobile, `create-design-system` emits pt (iOS) or dp (Android) tokens, Dynamic Type / sp scales, and UISpringTimingParameters / Material motion tokens. `generate-component-library` returns SwiftUI/UIKit or Compose/Material 3 component specs.

### Phase 3: Content Strategy

```text
generate-content-architecture  → Three-act scroll narrative and page structure
generate-copy-guidelines       → Voice, vocabulary, headline formulas, CTA copy
```

### Phase 4: Quality Assurance

**Web:**

```text
check-accessibility          → WCAG 2.2 AA compliance report
get-accessibility-checklist  → Complete checklist for implementation review
analyze-performance          → Core Web Vitals analysis
get-core-web-vitals-targets  → Good/needs improvement/poor thresholds
get-performance-budget       → Resource budgets for JS, CSS, images, fonts
```

**Mobile:**

```text
check-accessibility          → WCAG 2.2 + VoiceOver/TalkBack + touch targets
get-accessibility-checklist  → 17-item mobile checklist (Dynamic Type, Reduce Motion…)
analyze-mobile-performance   → Cold/warm launch, frame rate, memory, battery analysis
get-mobile-performance-targets → iOS and Android benchmark tables
```

### Phase 5: Implementation

**Web:**

```text
template://component/*        → Ready-to-use HTML/CSS components
reference://easing            → Animation easing functions and timing
reference://gsap-motion       → Full GSAP reference for scroll animations
reference://webflow-animation → Webflow IX2 patterns and performance rules
```

**Mobile:**

```text
reference://ios-hig           → Apple HIG: navigation, Dynamic Type, safe areas, SF Symbols
reference://material-design   → Material Design 3: dynamic color, type scale, motion
```

### Phase 6: Immersive 3D (optional)

When the project calls for a cinematic scroll experience rather than a traditional page:

```text
generate-3d-experience        → Full R3F scene, camera spline, scroll hook, shaders, CSS layout
```

Pick the style that matches the brand and emotional tone established in the project brief. The output is drop-in ready: copy the files, run `npm install`, and the scene runs.

---

## Project Storage

Project briefs are saved to disk at:

```text
~/.senior-design-director-mcp/projects/{project-name}.json
```

Briefs are loaded into memory on server startup and written to disk on every save:

- Briefs **persist across server restarts** and new conversations
- Multiple projects can be stored simultaneously
- Briefs can be inspected or backed up directly from the filesystem

---

## Frequently Asked Questions

**Does this work with Claude Desktop and Claude Code?**
Yes. Run `npx senior-design-director-mcp install` and it configures both automatically. For manual setup, see the Quick Start sections above.

**Do I need to install anything permanently?**
No. Run `npx senior-design-director-mcp install` once to configure your clients. After that, the server starts automatically via npx each time your client connects — nothing is permanently installed. Node.js 18 or later is the only prerequisite.

**Does it work with MCP clients other than Claude?**
Yes. The server uses the standard Model Context Protocol and works with any MCP-compatible client.

**Where are project briefs stored?**
Briefs are saved as JSON files at `~/.senior-design-director-mcp/projects/`. They persist across server restarts and can be backed up or inspected directly.

**Can I update a brief without re-running the full discovery?**
Yes. Use `update-project-brief` to change specific fields. The server merges the updates into the existing brief without requiring a full re-run.

**Does it generate actual code or just specs?**
Both. Design system tools return structured specifications that Claude uses to write implementation code. The `template://component/*` resources provide ready-to-use HTML/CSS components you can copy directly. The `generate-3d-experience` tool outputs complete, copy-paste-ready TypeScript files.

**The agent skill didn't appear after running the install command — what do I do?**
The installer first tries the `skills` CLI. If that fails or isn't available, it automatically writes the skill file directly to `~/.claude/skills/senior-design-director/SKILL.md`. Restart your client and the skill should appear. If it still doesn't, run the manual fallback: `npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director --yes --global`

**What design stack does it target?**
The server is stack-agnostic. It outputs design tokens as CSS custom properties, component HTML/CSS, and structured JSON specs that Claude can adapt to React, Vue, Svelte, Webflow, or any other stack.

**How is this different from asking Claude design questions directly?**
Without this server, Claude has no memory of your project between conversations and gives generic answers. This server saves a detailed project brief to disk so every response is grounded in your specific audience, positioning, and goals, and context carries across sessions automatically.

---

## Architecture

```text
src/
├── index.ts                   # MCP server, tool/resource registration, request handlers
├── install.ts                 # One-command installer: detects clients, writes configs, installs skill
├── types/
│   └── index.ts               # ProjectBrief, ColorPalette, DesignSystem, AccessibilityReport, etc.
├── tools/
│   ├── projectDiscovery.ts    # Discovery questions, brief builder, storage CRUD
│   ├── colorPalette.ts        # Palette generation, contrast validation
│   ├── designSystem.ts        # Typography, spacing, breakpoints, motion, component specs
│   ├── contentArchitecture.ts # Three-act structure, page architecture, copy guidelines
│   ├── accessibility.ts       # WCAG compliance checker, checklist
│   ├── performance.ts         # Core Web Vitals analysis, budget guidelines
│   └── immersive3d.ts         # Scroll-driven 3D experience generator (R3F, camera spline, shaders)
├── resources/
│   └── templates.ts           # Component templates and design references
└── utils/
    └── storage.ts             # File-based persistent storage for project briefs
```

All tools are pure functions that accept plain arguments and return structured JSON. The server registers each function as an MCP tool with a full JSON Schema for parameter validation.

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (rebuilds on file changes)
npm run watch

# Run directly without building
npm run dev
```

To test the server manually, pipe an MCP JSON-RPC message to it:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node dist/index.js
```

---

## Design Principles

- **Systems over one-offs**: every color, type choice, and spacing value connects to a system
- **Narrative before decoration**: content architecture comes from story, not layout preference
- **Performance is design**: slow experiences are broken experiences
- **Accessibility as baseline**: WCAG AA compliance is the floor, not the ceiling
- **Motion with purpose**: animation guides attention, signals state, and reinforces brand, not decoration
- **Brief-driven decisions**: every recommendation traces back to who the site is for and what it must accomplish
- **Depth over decoration**: 3D experiences earn every polygon; geometry serves the narrative

---

## Contributing

Contributions welcome. Please ensure:

- TypeScript types are properly defined
- Tools return structured JSON responses
- Resources use appropriate MIME types
- Code follows existing patterns

---

## License

MIT
