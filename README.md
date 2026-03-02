# Senior Design Director MCP

A Model Context Protocol (MCP) server that brings world-class design direction into your AI workflow. It runs a structured project discovery process, generates complete design systems, validates accessibility and performance, and provides production-ready component templates — all grounded in a saved project brief so every decision stays consistent.

---

## What It Does

Rather than answering generic design questions, this server operates like a senior creative director onboarding a new project. It:

1. **Runs a 15-question discovery session** to capture your audience, brand positioning, narrative arc, CTA strategy, and visual direction
2. **Saves the project brief** to disk so context persists across every conversation and tool call
3. **Derives all design decisions from that brief** — color palettes, type systems, content structure, and copy voice all connect back to who the site is for and what it needs to accomplish

---

## Features

### Project Discovery & Management
- 15-question structured brief covering audience, positioning, narrative, CTAs, visual personality, content, technical requirements, and competitive landscape
- Persistent file-based storage (`~/.senior-design-director-mcp/projects/`) — briefs survive server restarts
- Full CRUD: create, retrieve, update, and delete project briefs
- Standalone `get-discovery-questions` tool for manual brief preparation

### Color & Design Systems
- Color palette generation derived from emotional tone, industry category, and audience psychology — returns primary palette plus two alternatives with full rationale
- WCAG contrast ratio validation with AA/AAA pass/fail results
- Complete design system output: display/body/accent typography, modular scale, 8px spacing system, responsive breakpoints, and motion tokens
- Component library specifications (buttons, cards, navigation, forms, modals, and more)

### Content Architecture
- Three-act narrative structure mapping scroll position to emotional journey (Problem → Transformation → Outcome)
- Page structure recommendations tied to business objectives and conversion goals
- Brand voice and copywriting guidelines derived from positioning and desired perception

### Accessibility
- WCAG 2.1 AA compliance checking across color combinations, semantic HTML structure, form labels, heading hierarchy, ARIA attributes, and keyboard navigation
- Scored report with severity-ranked issues (critical / serious / moderate / minor) and specific recommendations
- Complete WCAG 2.1 AA checklist for implementation review

### Performance
- Core Web Vitals analysis: LCP, FID, CLS with scored recommendations
- Additional metrics: FCP, TTI, TBT
- Performance budget guidelines for JS, CSS, images, fonts, and third-party scripts
- Specific optimization actions ranked by priority (high / medium / low)

### Design References (Resources)
- Animation easing functions with timing guidance for micro, short, medium, and long durations
- Responsive breakpoint system with mobile-first implementation patterns
- Fluid typography scale with clamp() formulas and line-height rules
- 8px spacing system with usage guidelines for components, sections, and layout
- Color psychology reference by emotion and industry
- Webflow Interactions (IX2) — triggers, actions, scroll patterns, stagger, and performance rules
- GSAP complete reference — core API, timelines, ScrollTrigger, stagger, matchMedia, and React integration

---

## Installation

### Prerequisites
- Node.js 18+
- npm

### Build

```bash
cd senior-design-director-mcp
npm install
npm run build
```

This compiles TypeScript to `dist/` and makes the server ready to run.

---

## Connect to Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "senior-design-director": {
      "command": "node",
      "args": ["/absolute/path/to/senior-design-director-mcp/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop after saving.

A pre-filled config for this machine is included at [`Support/Claude/claude_desktop_config.json`](Support/Claude/claude_desktop_config.json).

## Connect to Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "senior-design-director": {
      "command": "node",
      "args": ["/absolute/path/to/senior-design-director-mcp/dist/index.js"]
    }
  }
}
```

---

## Tools Reference

### Project Discovery

#### `complete-project-discovery`
Runs the full 15-question discovery process and saves a structured project brief. This is the entry point — all downstream tools read from this brief.

**Required parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectName` | string | Project or company name |
| `projectDescription` | string | What the project does (2–3 sentences) |
| `industryCategory` | string | Industry category (e.g. SaaS, Wellness, E-commerce) |
| `audienceRole` | string | Primary audience job title or role |
| `primaryCTA` | string | The single most important action visitors should take |
| `emotionalTone` | string[] | 3–5 tones from the list below |

**Optional parameters (fill in as many as possible for best results):**

| Parameter | Type | Description |
|-----------|------|-------------|
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

```json
{}
```

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

### Color & Design Systems

#### `generate-color-palette`
Generates a color palette derived from the project brief — emotional tone, industry category, brand positioning, and any color constraints. Returns a primary palette plus two alternatives, each with hex values, RGB, usage guidance, psychological rationale, and usage guidelines.

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
Generates a complete design system from the project brief:

- **Typography** — display font, body font, optional accent font with weights and usage rules; full modular scale from xs to 5xl with line heights and use cases
- **Spacing** — 8px base unit with full scale
- **Breakpoints** — mobile small through ultra-wide with column counts
- **Motion** — easing curves and duration tokens (micro through long)
- **Colors** — full palette derived from project brief

```json
{ "projectName": "TechFlow" }
```

#### `generate-component-library`
Generates specifications for UI components styled to the design system: primary/secondary/ghost buttons with states and sizing, card variants, navigation with mobile menu, contact forms, hero sections, and feature grids.

```json
{ "projectName": "TechFlow" }
```

---

### Content Architecture

#### `generate-content-architecture`
Maps the project brief's narrative arc to a three-act scroll structure:

- **Act I** — Problem space and emotional resonance (above the fold through ~33% scroll)
- **Act II** — Solution, proof, and trust building (33–66% scroll)
- **Act III** — Transformation, social proof, and conversion (66–100% scroll)

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

### Accessibility

#### `check-accessibility`
Analyzes a combination of color pairs, HTML structure, forms, heading hierarchy, ARIA usage, and keyboard navigation. Returns a scored report with severity-ranked issues and specific recommendations.

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

**Returns:** Score out of 100, issue list with severity, and WCAG 2.1 AA compliance summary (passes and failures).

#### `get-accessibility-checklist`
Returns a comprehensive WCAG 2.1 AA checklist organized by category: perceivable, operable, understandable, robust — with pass/fail criteria for each item.

```json
{}
```

---

### Performance

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
|-----------|------|--------|
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
Returns recommended budgets for JS, CSS, images, fonts, third-party scripts, total page weight, HTTP requests, and LCP element — each with reasoning.

---

## Resources Reference

Resources are accessed via the MCP resource system and return ready-to-use content.

### Component Templates

| URI | Description |
|-----|-------------|
| `template://project-brief` | Markdown template for manual brief completion |
| `template://component/button` | Accessible button HTML/CSS with variants and states |
| `template://component/card` | Card component with hover animation |
| `template://component/hero` | Two-column hero section with responsive layout |
| `template://component/navigation` | Sticky nav with mobile menu and scroll behavior |
| `template://component/form` | Accessible contact form with validation styles |

All component templates use CSS custom properties (`--color-primary`, `--color-secondary`, etc.) that map to the generated design system.

### Design References

| URI | Description |
|-----|-------------|
| `reference://easing` | CSS easing functions with timing ranges (micro 150ms → long 1800ms) and GPU performance rules |
| `reference://breakpoints` | Standard breakpoints 320px–1600px with mobile-first implementation patterns |
| `reference://typography-scale` | Major Third scale in CSS custom properties, fluid clamp() formulas, line-height and letter-spacing rules |
| `reference://spacing` | 8px base unit scale from 4px to 128px with component, section, and layout usage guidelines |
| `reference://color-psychology` | Color psychology by hue family and industry, saturation rules, WCAG contrast requirements |
| `reference://webflow-animation` | Webflow IX2 trigger types, action types, scroll reveal patterns, stagger patterns, scrub patterns, performance rules, and timing by element type |
| `reference://gsap-motion` | GSAP core API (to/from/fromTo/set), easing reference, timeline sequencing, ScrollTrigger (reveal, scrub, pin), stagger, matchMedia for reduced motion, React useGSAP integration, and design token mapping |

---

## End-to-End Workflow

### Phase 1 — Discovery

Run `complete-project-discovery` with all answers. Use `get-discovery-questions` first if you want to prepare answers in advance.

After discovery, use `get-project-brief` to review the saved brief. Use `update-project-brief` to refine any field without re-running the full discovery.

### Phase 2 — Design System

```
generate-color-palette       → Review primary palette and two alternatives
validate-color-contrast      → Check every text/background combination
create-design-system         → Full typography, spacing, breakpoints, motion
generate-component-library   → Component specs for implementation
```

### Phase 3 — Content Strategy

```
generate-content-architecture  → Three-act scroll narrative and page structure
generate-copy-guidelines       → Voice, vocabulary, headline formulas, CTA copy
```

### Phase 4 — Quality Assurance

```
check-accessibility          → WCAG 2.1 AA compliance report
get-accessibility-checklist  → Complete checklist for implementation review
analyze-performance          → Core Web Vitals analysis
get-core-web-vitals-targets  → Good/needs improvement/poor thresholds
get-performance-budget       → Resource budgets for JS, CSS, images, fonts
```

### Phase 5 — Implementation

```
template://component/*       → Ready-to-use HTML/CSS components
reference://easing           → Animation easing functions and timing
reference://gsap-motion      → Full GSAP reference for scroll animations
reference://webflow-animation → Webflow IX2 patterns and performance rules
```

---

## Project Storage

Project briefs are stored as JSON files at:

```
~/.senior-design-director-mcp/projects/{project-name}.json
```

Briefs are loaded into memory on server startup and written to disk on every save. This means:

- Briefs **persist across server restarts** and new conversations
- Multiple projects can be stored simultaneously
- Briefs can be inspected or backed up directly from the filesystem

---

## Architecture

```
senior-design-director-mcp/
├── src/
│   ├── index.ts                  # MCP server, tool/resource registration, request handlers
│   ├── types/
│   │   └── index.ts              # ProjectBrief, ColorPalette, DesignSystem, AccessibilityReport, etc.
│   ├── tools/
│   │   ├── projectDiscovery.ts   # Discovery questions, brief builder, storage CRUD
│   │   ├── colorPalette.ts       # Palette generation, contrast validation
│   │   ├── designSystem.ts       # Typography, spacing, breakpoints, motion, component specs
│   │   ├── contentArchitecture.ts # Three-act structure, page architecture, copy guidelines
│   │   ├── accessibility.ts      # WCAG compliance checker, checklist
│   │   └── performance.ts        # Core Web Vitals analysis, budget guidelines
│   ├── resources/
│   │   └── templates.ts          # Component templates and design references
│   └── utils/
│       └── storage.ts            # File-based persistent storage for project briefs
├── dist/                         # Compiled output (built from src/)
├── package.json
└── tsconfig.json
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

To test the server manually, pipe MCP JSON-RPC messages to it:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node dist/index.js
```

---

## Design Principles

This server implements the workflows from the Senior Design Director Agent Prompt (`senior-web-design-director.md`):

- **Systems over one-offs** — every color, type choice, and spacing value connects to a system
- **Narrative before decoration** — content architecture comes from story, not layout preference
- **Performance is design** — slow experiences are broken experiences
- **Accessibility as baseline** — WCAG AA compliance is the floor, not the ceiling
- **Motion with purpose** — animation guides attention, signals state, and reinforces brand — not decoration
- **Brief-driven decisions** — every recommendation traces back to who the site is for and what it must accomplish

---

## License

MIT
