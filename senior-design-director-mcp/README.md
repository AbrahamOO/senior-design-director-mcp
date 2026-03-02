# Senior Design Director MCP Server

A Model Context Protocol (MCP) server that provides professional web design guidance, project discovery workflows, design system generation, and accessibility/performance best practices based on world-class design studio standards.

## Features

### 🎯 Project Discovery
- 15-question discovery process to capture project requirements
- Structured project briefs with audience analysis, brand positioning, and narrative structure
- Saves project context for consistent design decisions

### 🎨 Color & Design Systems
- AI-powered color palette generation based on emotional tone, industry, and audience
- Complete design system generation (typography, spacing, breakpoints, motion)
- Component library specifications (buttons, cards, forms, navigation, etc.)
- WCAG color contrast validation

### 📝 Content Architecture
- Three-act storytelling framework for narrative-driven content
- Page structure recommendations based on business objectives
- Copywriting guidelines aligned with brand voice

### ♿ Accessibility
- WCAG 2.1 AA compliance checking
- Comprehensive accessibility checklist
- Semantic HTML validation
- Keyboard navigation and ARIA label guidance

### ⚡ Performance
- Core Web Vitals analysis and recommendations
- Performance budget guidelines
- Optimization strategies for LCP, FID, CLS
- Bundle size and caching recommendations

### 📚 Design Resources
- Animation easing reference with timing guidelines
- Responsive breakpoint systems
- Typography scale systems
- Component templates (HTML/CSS)
- Color psychology reference

## Installation

```bash
# Clone or navigate to the directory
cd senior-design-director-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## Usage with Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

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

After updating the config, restart Claude Desktop.

## Available Tools

### Project Discovery

#### `complete-project-discovery`
Complete the full 15-question discovery process and create a project brief.

**Example:**
```javascript
{
  "projectName": "Acme Design Studio",
  "projectDescription": "Boutique design studio helping SaaS startups build conversion-focused products",
  "industryCategory": "Design Agency",
  "audienceRole": "Startup founders",
  "emotionalTone": ["Sophisticated & Premium", "Warm & Human", "Bold & Rebellious"],
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
Generate complete design system with typography, spacing, breakpoints, motion, and colors.

#### `generate-component-library`
Generate component specifications based on design system.

### Content Architecture

#### `generate-content-architecture`
Create narrative-driven content structure using three-act storytelling.

#### `generate-copy-guidelines`
Generate copywriting guidelines based on brand voice and positioning.

### Accessibility

#### `check-accessibility`
Check accessibility compliance for colors, HTML, forms, etc.

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

#### `get-accessibility-checklist`
Get comprehensive WCAG 2.1 AA accessibility checklist.

### Performance

#### `analyze-performance`
Analyze performance metrics and get optimization recommendations.

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
Get Core Web Vitals targets and thresholds.

#### `get-performance-budget`
Get recommended performance budget.

## Available Resources

Access design templates and references via the resource system:

### Templates
- `template://project-brief` - Project brief template
- `template://component/button` - Button component HTML/CSS
- `template://component/card` - Card component HTML/CSS
- `template://component/hero` - Hero section HTML/CSS
- `template://component/navigation` - Navigation HTML/CSS
- `template://component/form` - Form component HTML/CSS

### References
- `reference://easing` - Animation easing functions
- `reference://breakpoints` - Responsive breakpoints
- `reference://typography-scale` - Typography systems
- `reference://spacing` - 8px spacing system
- `reference://color-psychology` - Color psychology guide

## Example Workflow

1. **Start with Project Discovery**
```
Use complete-project-discovery to create a comprehensive project brief
```

2. **Generate Design System**
```
Use generate-color-palette to get color recommendations
Use create-design-system to get full design system
Use generate-component-library for component specs
```

3. **Create Content Strategy**
```
Use generate-content-architecture for page structure
Use generate-copy-guidelines for writing guidance
```

4. **Validate Accessibility & Performance**
```
Use check-accessibility to validate WCAG compliance
Use analyze-performance for optimization recommendations
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

```
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
    └── storage.ts           # In-memory project brief storage
```

## Design Principles

This MCP server embodies world-class design studio standards:

- **Craft Obsession**: Every decision is intentional and systematic
- **User-Centered Narrative**: Design solves problems, doesn't just decorate
- **Performance as Design**: Fast experiences are better UX
- **Accessibility as Baseline**: Inclusive design is non-negotiable
- **Motion with Purpose**: Animation guides, clarifies, or delights
- **Systems Thinking**: Create reusable patterns, not one-offs

## Based On

This server implements the workflows and best practices from the Senior Design Director Agent Prompt, which encapsulates:

- Strategic visual hierarchy
- Sophisticated motion design
- Narrative-driven content architecture
- WCAG 2.1 AA accessibility standards
- Core Web Vitals performance optimization
- Three-act storytelling framework
- Design system methodology

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
