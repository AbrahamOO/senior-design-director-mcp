# Senior Design Director MCP

[![npm version](https://img.shields.io/npm/v/senior-design-director-mcp)](https://www.npmjs.com/package/senior-design-director-mcp)
[![npm downloads](https://img.shields.io/npm/dm/senior-design-director-mcp)](https://www.npmjs.com/package/senior-design-director-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

**Senior Design Director MCP** gives your AI coding agent the capabilities of a senior creative director. It runs a structured 15-question project discovery process, generates complete design systems for web and mobile (iOS, Android, React Native, Flutter), validates WCAG accessibility, analyzes Core Web Vitals, and delivers production-ready component templates — all grounded in a persistent project brief so every design decision stays consistent.

Works with **Claude Code**, **Cursor**, **Windsurf**, **OpenAI Codex**, **Claude Desktop**, and any MCP-compatible client.

---

## Why This Exists

Most AI design tools give generic answers. This server starts by deeply understanding your project — audience, brand positioning, competitive landscape, narrative arc — and derives every color, typographic, and content decision from that context.

- **Brief-driven** — every recommendation traces back to who the site is for and what it must accomplish
- **Systematic** — color, type, spacing, motion, and components are all connected to one design system
- **Standards-compliant** — WCAG 2.1 AA accessibility and Core Web Vitals built into the workflow, not bolted on at the end
- **Persistent** — project briefs survive server restarts and carry context across every conversation
- **Cinematic** — when the project calls for it, generate scroll-driven 3D experiences with real depth on the Z-axis

---

## Quick Start

### One-command setup (recommended)

Run once to configure all your MCP clients and install the agent skill:

```bash
npx senior-design-director-mcp install
```

Detects which clients are installed, writes the correct config for each, and installs the agent skill. Restart any open clients after running.

### Manual setup — pick your client

#### Claude Desktop

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

#### Claude Code (CLI)

```bash
claude mcp add senior-design-director -- npx -y senior-design-director-mcp
```

Or add to `~/.claude.json` (global) or `.mcp.json` (project-level) using the same JSON format as Claude Desktop.

#### Cursor

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

#### Windsurf

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

#### Codex (OpenAI)

Add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project):

```toml
[mcp_servers.senior-design-director]
command = "npx"
args = ["-y", "senior-design-director-mcp"]
```

Or via CLI:

```bash
codex mcp add senior-design-director -- npx -y senior-design-director-mcp
```

#### Global install (optional)

```bash
npm install -g senior-design-director-mcp
```

Then use `senior-design-director-mcp` as the command — no `npx` or `-y` needed.

### Agent skill (manual)

If you prefer to install only the agent skill without the auto-installer:

```bash
npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director
```

---

## What It Can Design

| Project Type | Platform | Key Outputs |
|---|---|---|
| SaaS / startup websites | Web | Design system, responsive breakpoints, copy guidelines, GSAP animations |
| Agency / portfolio sites | Web | Three-act narrative structure, type-forward layouts, premium motion system |
| E-commerce / product sites | Web | Conversion-focused CTA strategy, trust-building content architecture |
| iOS apps | Native iOS | SF Pro typography with Dynamic Type, pt spacing, UITabBar/UINavigationBar specs, spring motion tokens, safe area system, VoiceOver compliance |
| Android apps | Native Android | Material Design 3 components, sp/dp system, Google Sans/Roboto scale, Material motion system, TalkBack compliance |
| React Native apps | Cross-platform | Platform-branched fonts, logical px spacing, shared motion tokens, safe area inset values |
| Flutter apps | Cross-platform | Platform-aware type scale, Material/Cupertino hybrid patterns, shared spacing system |
| Web + Mobile | Both | Full web breakpoints AND native mobile tokens from a single project brief |
| Immersive 3D website | Web | Scroll-driven 3D scene, CatmullRom camera spline, R3F + postprocessing, WebGL shaders |

---

## Design Workflow

Run the tools in order for best results. Each phase builds on the previous one.

### Phase 1 — Discovery

```
complete-project-discovery   → 15-question brief: audience, brand, CTA, tone, platform
get-discovery-questions      → Fetch all questions to prepare answers in advance
get-project-brief            → Review the saved brief
update-project-brief         → Refine any field without re-running discovery
```

### Phase 2 — User Flow

```
generate-user-flow           → Entry points, task states, decision forks, error/empty states, conversion checkpoints
```

Run this before the design system. Platform-aware — mobile flows follow iOS HIG / Material 3 navigation patterns; web flows include scroll depth targets per page.

### Phase 3 — Design System

```
generate-color-palette       → Primary palette + two alternatives, with hex, RGB, usage rationale
validate-color-contrast      → WCAG contrast ratio check for any two hex colors
create-design-system         → Full design tokens (pt for iOS, dp for Android, rem for web)
generate-component-library   → Platform-native component specs
```

### Phase 4 — Content Strategy

```
generate-content-architecture  → Three-act scroll narrative and page structure
generate-copy-guidelines       → Voice, vocabulary, headline formulas, CTA copy
```

### Phase 5 — Quality Assurance

**Web:**

```
check-accessibility            → WCAG 2.2 AA compliance report
get-accessibility-checklist    → Full checklist for implementation review
analyze-performance            → Core Web Vitals analysis
get-core-web-vitals-targets    → Good / needs improvement / poor thresholds
get-performance-budget         → Resource budgets for JS, CSS, images, fonts
```

**Mobile:**

```
check-accessibility            → WCAG 2.2 + VoiceOver/TalkBack + touch targets
get-accessibility-checklist    → 17-item mobile checklist (Dynamic Type, Reduce Motion…)
analyze-mobile-performance     → Cold/warm launch, frame rate, memory, battery analysis
get-mobile-performance-targets → iOS and Android benchmark tables
```

### Phase 6 — Implementation

**Web:**

```
template://component/*         → Ready-to-use HTML/CSS components
reference://easing             → Animation easing functions and timing
reference://gsap-motion        → Full GSAP reference for scroll animations
reference://webflow-animation  → Webflow IX2 patterns and performance rules
```

**Mobile:**

```
reference://ios-hig            → Apple HIG: navigation, Dynamic Type, safe areas, SF Symbols
reference://material-design    → Material Design 3: dynamic color, type scale, motion
```

### Phase 7 — Immersive 3D (optional)

```
generate-3d-experience         → Full R3F scene, camera spline, scroll hook, shaders, CSS layout
```

---

## Tools Reference

### Project Discovery

| Tool | Description |
|---|---|
| `complete-project-discovery` | Run the full 15-question discovery. Entry point for all downstream tools. |
| `get-discovery-questions` | Fetch all 15 questions to prepare answers before running discovery. |
| `get-project-brief` | Retrieve a saved project brief by name. |
| `list-projects` | List all saved project briefs. |
| `update-project-brief` | Update specific fields without replacing the whole brief. |
| `delete-project` | Delete a saved project brief. |

**`complete-project-discovery` — required parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectName` | string | Project or company name |
| `projectDescription` | string | What the project does (2–3 sentences) |
| `industryCategory` | string | e.g. SaaS, Wellness, E-commerce |
| `audienceRole` | string | Primary audience job title or role |
| `primaryCTA` | string | The single most important action visitors should take |
| `emotionalTone` | string[] | 3–5 tones (see list below) |

**Emotional tone options:** Energetic & Inspiring · Calm & Trustworthy · Sophisticated & Premium · Playful & Approachable · Bold & Rebellious · Warm & Human · Professional & Authoritative · Innovative & Futuristic · Grounded & Authentic

All other `complete-project-discovery` parameters are optional — fill in as many as possible for more precise output. See the [full parameter list](#complete-project-discovery-optional-parameters) below.

---

### Color & Design System

| Tool | Description |
|---|---|
| `generate-color-palette` | Color palette derived from brief — primary + two alternatives with hex, RGB, rationale |
| `validate-color-contrast` | WCAG contrast ratio between two hex colors — AA/AAA pass/fail for normal and large text |
| `create-design-system` | Full design tokens: typography, spacing, breakpoints, motion, colors — platform-aware |
| `generate-component-library` | Platform-native component specs: web (buttons, cards, nav, forms, hero) or mobile native |

---

### Content & Copywriting

| Tool | Description |
|---|---|
| `generate-user-flow` | Clinical user flow map — entry points, task states, forks, friction, errors, conversion checkpoints |
| `generate-content-architecture` | Three-act scroll narrative with section assignments, visual strategy, and emotional tone per act |
| `generate-copy-guidelines` | Brand voice, vocabulary, headline formulas, CTA copy patterns, before/after examples |

---

### Accessibility

| Tool | Description |
|---|---|
| `check-accessibility` | WCAG 2.2 AA compliance — colors, HTML, forms, touch targets, VoiceOver/TalkBack, Dynamic Type |
| `get-accessibility-checklist` | Full WCAG 2.2 + Apple Accessibility + Android Accessibility checklist by category |

---

### Performance

| Tool | Description |
|---|---|
| `analyze-performance` | Core Web Vitals analysis — LCP, FID, CLS, FCP, TTI, TBT with prioritized recommendations |
| `get-core-web-vitals-targets` | Good / needs improvement / poor thresholds for each metric |
| `get-performance-budget` | Budgets for JS, CSS, images, fonts, third-party, total page weight, HTTP requests |
| `analyze-mobile-performance` | iOS/Android launch time, frame rate, memory, battery, asset densities analysis |
| `get-mobile-performance-targets` | iOS and Android benchmark tables |

---

### Immersive 3D

| Tool | Description |
|---|---|
| `generate-3d-experience` | Scroll-driven 3D experience — R3F scene, CatmullRom camera spline, postprocessing, GLSL shaders |

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `concept` | string | required | Theme or narrative (e.g. `"crystalline neural network"`) |
| `sections` | number (3–7) | `5` | Scroll scenes — each maps to a camera waypoint |
| `style` | string | `"cosmic"` | `cosmic` · `architectural` · `organic` · `minimal` · `brutalist` · `liquid` · `crystalline` |
| `primaryColor` | string | `"#6c63ff"` | Brand hex for geometry, particles, and emissive lighting |
| `framework` | string | `"react-three-fiber"` | `react-three-fiber` · `vanilla-threejs` |
| `includeShaders` | boolean | `false` | Include custom GLSL vertex/fragment displacement shaders |

---

## Resources Reference

Resources are accessed via the MCP resource system and return ready-to-use content.

### Component Templates

| URI | Description |
|---|---|
| `template://project-brief` | Markdown template for manual brief completion |
| `template://component/button` | Accessible button HTML/CSS with variants and states |
| `template://component/card` | Card component with hover animation |
| `template://component/hero` | Two-column hero section with responsive layout |
| `template://component/navigation` | Sticky nav with mobile menu and scroll behavior |
| `template://component/form` | Accessible contact form with validation styles |

All component templates use CSS custom properties (`--color-primary`, `--color-secondary`, etc.) that map directly to the generated design system.

### Brand Design Templates

72 real-world brand references covering color systems, typography, spacing, motion, and UI patterns. Use `list-brand-templates` to browse by industry, then load any template as an MCP resource.

```
list-brand-templates   → Lists all 72 brands grouped by industry with their resource URIs
brand://{slug}         → Full design reference for that brand (e.g. brand://stripe, brand://airbnb)
```

| Industry | Brands |
|---|---|
| AI & LLM Platforms | Claude, Cohere, ElevenLabs, Minimax, Mistral AI, OpenCode AI, Together AI, xAI |
| Developer Tools | Cursor, Expo, Raycast, Warp, Ollama, Replicate |
| Backend & Infrastructure | ClickHouse, HashiCorp, MongoDB, Supabase, Sanity, Resend, Vercel, PostHog, Sentry, Zapier, Composio |
| Productivity & SaaS | Airtable, Cal, Intercom, Linear, Notion, Superhuman, Slack, Webflow |
| Design & Creative | Figma, Framer, Lovable, Miro, Runway ML |
| Fintech & Crypto | Stripe, Binance, Coinbase, Kraken, Mastercard, Revolut, Wise |
| E-commerce & Retail | Shopify, Starbucks, Nike |
| Media & Consumer Tech | Apple, Airbnb, Meta, Pinterest, Spotify, The Verge, Wired, Uber |
| Automotive & Luxury | BMW, BMW M, Bugatti, Ferrari, Lamborghini, Renault, Tesla |
| Enterprise & Corporate | IBM, NVIDIA, Semrush, Mintlify, Clay, Vodafone, SpaceX, VoltAgent |
| Gaming & Entertainment | PlayStation |

### Design Reference Resources

| URI | Description |
|---|---|
| `reference://easing` | CSS easing functions with timing ranges and GPU performance rules |
| `reference://breakpoints` | Standard breakpoints 320px–1600px with mobile-first implementation patterns |
| `reference://typography-scale` | Major Third scale in CSS custom properties, fluid `clamp()` formulas, line-height rules |
| `reference://spacing` | 8px base unit scale from 4px to 128px with component, section, and layout usage guidelines |
| `reference://color-psychology` | Color psychology by hue family and industry, saturation rules, WCAG contrast requirements |
| `reference://webflow-animation` | Webflow IX2 trigger types, action types, scroll reveal, stagger, scrub patterns |
| `reference://gsap-motion` | GSAP core API, ScrollTrigger, timelines, stagger, React `useGSAP`, and design token mapping |
| `reference://ios-hig` | Apple HIG: navigation patterns, Dynamic Type scale, SF Symbols, safe areas, spring motion |
| `reference://material-design` | Material Design 3: dynamic color, type scale, component specs, motion easing, spacing grid |

---

## Project Storage

Project briefs are saved to disk and survive server restarts:

```
~/.senior-design-director-mcp/projects/{project-name}.json
```

Multiple projects can be stored simultaneously. Briefs can be inspected or backed up directly from the filesystem.

---

## Frequently Asked Questions

**Does this work with Claude Desktop and Claude Code?**
Yes. Run `npx senior-design-director-mcp install` and it configures both automatically.

**Do I need a permanent install?**
No. Run the one-command installer once. After that the server starts automatically via `npx` whenever your client connects — Node.js 18+ is the only prerequisite.

**Does it work with non-Claude MCP clients?**
Yes. The server uses the standard Model Context Protocol and works with any MCP-compatible client.

**Can I update a brief without re-running the full discovery?**
Yes. Use `update-project-brief` to change specific fields. The server merges updates into the existing brief.

**Does it generate actual code or just specs?**
Both. Design system tools return structured specifications that Claude uses to write implementation code. `template://component/*` resources provide ready-to-use HTML/CSS. `generate-3d-experience` outputs complete, copy-paste-ready TypeScript files.

**The agent skill didn't appear after running the install command.**
The installer tries the `skills` CLI first; if unavailable it writes the skill file directly to `~/.claude/skills/senior-design-director/SKILL.md`. Restart your client. If it still doesn't appear, run the manual fallback: `npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director --yes --global`

**What design stack does it target?**
Stack-agnostic. Outputs design tokens as CSS custom properties, component HTML/CSS, and structured JSON specs that Claude can adapt to React, Vue, Svelte, Webflow, or any other stack.

**How is this different from asking Claude design questions directly?**
Without this server, Claude has no memory of your project between conversations and gives generic answers. This server saves a detailed project brief to disk so every response is grounded in your specific audience, positioning, and goals — and context carries across sessions automatically.

---

## `complete-project-discovery` Optional Parameters

Fill in as many as possible for more precise design output.

| Parameter | Type | Description |
|---|---|---|
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
| `platform` | string | `"web"` · `"mobile-ios"` · `"mobile-android"` · `"mobile-cross-platform"` · `"both"` |
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
| `existingColors` | string | Existing brand colors or `"None"` |
| `colorPreferences` | string | Color direction or `"Open to recommendation"` |
| `colorConstraints` | string | Colors to avoid or `"None"` |

---

## Architecture

```
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
│   ├── templates.ts           # Component templates and design references
│   └── designTemplates.ts     # 72 brand design templates loader
templates/                     # Brand design reference files (airbnb.md, stripe.md, …)
└── utils/
    └── storage.ts             # File-based persistent storage for project briefs
```

All tools are pure functions that accept plain arguments and return structured JSON. The server registers each as an MCP tool with a full JSON Schema for parameter validation.

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

Test the server manually by piping an MCP JSON-RPC initialize message:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node dist/index.js
```

---

## Design Principles

- **Systems over one-offs** — every color, type choice, and spacing value connects to a system
- **Narrative before decoration** — content architecture comes from story, not layout preference
- **Performance is design** — slow experiences are broken experiences
- **Accessibility as baseline** — WCAG AA compliance is the floor, not the ceiling
- **Motion with purpose** — animation guides attention, signals state, and reinforces brand
- **Brief-driven decisions** — every recommendation traces back to who the site is for and what it must accomplish
- **Depth over decoration** — 3D experiences earn every polygon; geometry serves the narrative

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
