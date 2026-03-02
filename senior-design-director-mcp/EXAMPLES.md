# Senior Design Director MCP Server - Usage Examples

This document provides practical examples of using the MCP server tools.

## Example 1: Complete Project Discovery Flow

### Step 1: Complete Discovery
```javascript
// Use the complete-project-discovery tool with all answers:

{
  "projectName": "TechFlow",
  "projectDescription": "A SaaS platform helping startups automate their customer onboarding workflows",
  "industryCategory": "SaaS",
  "audienceRole": "Startup founders and product managers",
  "painPoints": "Manual onboarding processes, customer churn during setup, lack of analytics",
  "objections": "Too complex to implement, expensive, difficult to customize",
  "fear": "Wasting time and money on another tool that doesn't deliver",
  "uniquePosition": "Only platform with AI-powered onboarding optimization and built-in analytics",
  "philosophy": "Onboarding should be invisible - customers shouldn't think about it",
  "desiredPerception": "Modern, reliable, indispensable partner",
  "beforeState": "Manual, time-consuming onboarding with high churn",
  "transformationMoment": "Realizing automated onboarding can 3x conversion rates",
  "afterState": "Seamless, automated onboarding with data-driven optimization",
  "successMetric": "40% reduction in time-to-value, 3x improvement in activation",
  "primaryCTA": "Start free trial",
  "primaryCTAOutcome": "Sign up and complete first onboarding flow",
  "secondaryCTAs": ["Watch demo", "See case studies", "Talk to sales"],
  "emotionalTone": [
    "Sophisticated & Premium",
    "Professional & Authoritative",
    "Innovative & Futuristic"
  ],
  "visualPersonality": "Like a tech executive in minimalist designer clothing - clean, confident, approachable but premium. References: Stripe, Linear, Vercel",
  "aestheticReferences": ["Stripe.com", "Linear.app", "Vercel.com"],
  "photographyStyle": "Clean product screenshots, minimal UI mockups",
  "mood": "Professional, focused, modern",
  "treatment": "High contrast, desaturated, clean backgrounds",
  "keyMessages": [
    "Automate onboarding in minutes, not months",
    "AI-powered optimization increases conversions by 3x",
    "Built for startups who move fast"
  ],
  "proofPoints": {
    "experience": ["5 years building onboarding tools"],
    "clients": ["500+ SaaS companies", "Used by Y Combinator startups"],
    "results": ["3x average conversion improvement", "40% reduction in time-to-value"],
    "awards": ["Product Hunt #1 Product of the Day"]
  },
  "contentInventory": ["Product screenshots", "Logo", "Brand colors"],
  "contentGaps": ["Customer testimonials", "Video demo", "Case study writeups"],
  "pageStructure": [
    "Hero/Home",
    "How it Works",
    "Features",
    "Case Studies",
    "Pricing",
    "FAQ",
    "Contact/CTA"
  ],
  "techStackPreference": "Next.js, React, Tailwind CSS",
  "integrations": ["Stripe for billing", "PostHog for analytics"],
  "cmsStrategy": "Headless CMS (Sanity or Contentful)",
  "timeline": "8 weeks to launch",
  "seoPriority": "High - main acquisition channel",
  "competitors": ["Appcues", "Pendo", "WalkMe", "Userpilot"],
  "competitiveAdvantages": [
    "Faster implementation",
    "AI-powered optimization",
    "More affordable for startups"
  ],
  "visualInspiration": ["Apple.com for minimalism", "Notion for clean UI"],
  "successMetrics": [
    "1000+ free trial signups in first 3 months",
    "20% trial-to-paid conversion",
    "Top 3 Google ranking for 'onboarding automation'"
  ],
  "conversionGoal": "Free trial signups",
  "businessObjective": "500 paying customers by end of year",
  "existingColors": "#4F46E5 (indigo)",
  "colorPreferences": "Modern, tech-forward, not too playful",
  "colorConstraints": "Avoid red (competitors use it heavily)"
}
```

### Step 2: Generate Color Palette
```javascript
// Use generate-color-palette tool:
{
  "projectName": "TechFlow"
}

// Returns primary palette + 2 alternatives
```

### Step 3: Create Design System
```javascript
// Use create-design-system tool:
{
  "projectName": "TechFlow"
}

// Returns complete design system with typography, colors, spacing, motion
```

### Step 4: Generate Content Architecture
```javascript
// Use generate-content-architecture tool:
{
  "projectName": "TechFlow"
}

// Returns three-act narrative structure and page recommendations
```

## Example 2: Accessibility Check

```javascript
// Use check-accessibility tool:
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

// Returns accessibility report with score and recommendations
```

## Example 3: Performance Analysis

```javascript
// Use analyze-performance tool:
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

// Returns performance score and optimization recommendations
```

## Example 4: Color Contrast Validation

```javascript
// Use validate-color-contrast tool:
{
  "foreground": "#4F46E5",
  "background": "#ffffff"
}

// Returns:
// {
//   "ratio": 8.59,
//   "passesAA": true,
//   "passesAAA": true,
//   "recommendation": "Meets WCAG AA standards for normal text"
// }
```

## Example 5: Get Copy Guidelines

```javascript
// Use generate-copy-guidelines tool:
{
  "projectName": "TechFlow"
}

// Returns brand-specific copywriting guidelines with examples
```

## Example 6: Component Library Generation

```javascript
// Use generate-component-library tool:
{
  "projectName": "TechFlow"
}

// Returns specifications for buttons, cards, forms, navigation, etc.
```

## Accessing Resources

You can access templates and references directly:

### Get Project Brief Template
```
Read resource: template://project-brief
```

### Get Button Component Template
```
Read resource: template://component/button
```

### Get Animation Easing Reference
```
Read resource: reference://easing
```

### Get Color Psychology Guide
```
Read resource: reference://color-psychology
```

## Complete Workflow Example

1. **Discovery Phase**
   - Use `complete-project-discovery` with all 15 answers
   - Use `get-project-brief` to review saved brief

2. **Design Phase**
   - Use `generate-color-palette` to get color recommendations
   - Use `validate-color-contrast` to check all color combinations
   - Use `create-design-system` for complete design system
   - Use `generate-component-library` for component specs

3. **Content Phase**
   - Use `generate-content-architecture` for page structure
   - Use `generate-copy-guidelines` for writing guidance

4. **Quality Assurance Phase**
   - Use `check-accessibility` to validate WCAG compliance
   - Use `get-accessibility-checklist` for complete checklist
   - Use `analyze-performance` for optimization recommendations
   - Use `get-core-web-vitals-targets` for performance targets

5. **Implementation Phase**
   - Access component templates via resources
   - Reference design system specifications
   - Follow accessibility and performance guidelines

## Tips

- **Always start with project discovery** - All other tools rely on the project brief
- **Save your project brief** - It's stored in memory and used across all tools
- **Check multiple color combinations** - Use validate-color-contrast for all text/background pairs
- **Use resources for implementation** - Component templates provide ready-to-use HTML/CSS
- **Follow the checklist** - get-accessibility-checklist ensures WCAG compliance

## Common Patterns

### Pattern 1: Quick Color Check
```javascript
// Validate your existing brand colors
validate-color-contrast({
  foreground: "#yourBrandColor",
  background: "#ffffff"
})
```

### Pattern 2: Get Performance Baseline
```javascript
// Start with current metrics
analyze-performance({
  lcp: 3200,
  fid: 150,
  cls: 0.2,
  bundleSize: 250,
  imageOptimization: "none",
  lazyLoading: false,
  caching: "none",
  fontLoading: "blocking"
})
// Follow the high-priority recommendations first
```

### Pattern 3: Design System First
```javascript
// If you already have a brief, go straight to design system
create-design-system({ projectName: "YourProject" })
// Then get component specs
generate-component-library({ projectName: "YourProject" })
```
