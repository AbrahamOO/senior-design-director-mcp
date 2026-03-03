/**
 * Resource providers for design templates, references, and guidelines
 */

export function getDesignReference(type: 'easing' | 'breakpoints' | 'typography-scale' | 'spacing' | 'color-psychology' | 'webflow-animation' | 'gsap-motion' | 'ios-hig' | 'material-design'): string {
  switch (type) {
    case 'easing':
      return `
# Animation Easing Reference

## Professional Easing Functions

\`\`\`css
/* iOS Standard - Professional, polished */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth acceleration/deceleration */
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);

/* Spring-like, energetic (use sparingly) */
--ease-out: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Professional, confident exit */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);

/* Anticipatory entrance */
--ease-in-back: cubic-bezier(0.6, -0.28, 0.735, 0.045);

/* Exit with slight overshoot */
--ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
\`\`\`

## Timing Ranges

- **Micro (150-300ms)**: Hover states, micro interactions
- **Short (300-600ms)**: Entrance animations, page transitions
- **Medium (600-1200ms)**: Complex scroll-driven sequences
- **Long (1200-1800ms)**: Full-page hero reveals, cinematic opens

## Performance Rules

✓ Only animate \`transform\` and \`opacity\` (GPU accelerated)
✗ Never animate \`width\`, \`height\`, \`padding\`, \`margin\` (CPU intensive)
✗ Avoid animating \`box-shadow\`, \`filter\`, \`blur\` (tanks performance)
`;

    case 'breakpoints':
      return `
# Responsive Breakpoints

## Standard Breakpoints

\`\`\`css
/* Mobile Small - 320px+ */
@media (min-width: 320px) { }

/* Mobile - 480px+ */
@media (min-width: 480px) { }

/* Tablet - 768px+ */
@media (min-width: 768px) { }

/* Desktop - 1024px+ */
@media (min-width: 1024px) { }

/* Desktop Large - 1200px+ */
@media (min-width: 1200px) { }

/* Ultra-wide - 1600px+ */
@media (min-width: 1600px) { }
\`\`\`

## Mobile-First Approach

Start with mobile base styles, enhance upward:

\`\`\`css
/* Base: Mobile */
.container {
  padding: 24px;
  font-size: 16px;
}

/* Enhance: Tablet */
@media (min-width: 768px) {
  .container {
    padding: 32px;
    font-size: 18px;
  }
}

/* Enhance: Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
\`\`\`
`;

    case 'typography-scale':
      return `
# Typography Scale Systems

## Major Third Scale (1.25 ratio)

\`\`\`css
--text-xs: 0.75rem;    /* 12px - Caption, fine print */
--text-sm: 0.875rem;   /* 14px - Small text, labels */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body, leads */
--text-xl: 1.5rem;     /* 24px - H3, subsections */
--text-2xl: 2rem;      /* 32px - H2, section anchors */
--text-3xl: 3rem;      /* 48px - H1 (tablet) */
--text-4xl: 4rem;      /* 64px - Hero headlines */
--text-5xl: 6rem;      /* 96px - Large hero */
\`\`\`

## Fluid Typography (Responsive)

\`\`\`css
/* Scales smoothly from 2.5rem to 4rem based on viewport */
--text-hero: clamp(2.5rem, 6vw + 1rem, 4rem);

/* Body text: 16px mobile, 18px desktop */
--text-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
\`\`\`

## Line Height Rules

- **Headings**: 1.1 - 1.3 (tighter for impact)
- **Body**: 1.6 - 1.8 (open for readability)
- **Captions**: 1.2 - 1.4 (compact)

## Letter Spacing

- **All-caps**: 0.05em - 0.15em (more open)
- **Large headings**: -0.02em (slightly tighter)
- **Body**: 0 (default)
`;

    case 'spacing':
      return `
# Spacing System (8px base unit)

## Scale

\`\`\`css
--space-1: 4px;    /* 0.5 units - Tight spacing */
--space-2: 8px;    /* 1 unit - Base unit */
--space-3: 12px;   /* 1.5 units */
--space-4: 16px;   /* 2 units - Common padding */
--space-6: 24px;   /* 3 units - Section spacing */
--space-8: 32px;   /* 4 units - Large gaps */
--space-12: 48px;  /* 6 units - Major sections */
--space-16: 64px;  /* 8 units - Hero padding */
--space-24: 96px;  /* 12 units - Section dividers */
--space-32: 128px; /* 16 units - Major breaks */
\`\`\`

## Usage Guidelines

**Component Padding**
- Buttons: 12px 24px (mobile), 16px 32px (desktop)
- Cards: 24px (mobile), 32px (desktop)
- Sections: 48px (mobile), 96px (desktop)

**Vertical Rhythm**
- Paragraph margin: 1.5-2x line-height
- Section spacing: 64px - 128px
- Hero sections: 96px+ padding

**Horizontal Spacing**
- Mobile margins: 24px
- Tablet margins: 32px - 48px
- Desktop margins: 48px - 64px
- Max content width: 1200px - 1400px
`;

    case 'color-psychology':
      return `
# Color Psychology Guide

## By Emotion/Industry

### Blue/Teal
**Psychology**: Trust, professionalism, calmness, technology
**Industries**: SaaS, Tech, Finance, Healthcare
**Examples**: #1e3a8a (deep blue), #3b82f6 (bright blue), #06b6d4 (cyan)

### Red/Orange
**Psychology**: Energy, urgency, action, passion
**Industries**: Startups, E-commerce, Food, Entertainment
**Examples**: #dc2626 (red), #f97316 (orange), #ff6b56 (coral)

### Green
**Psychology**: Growth, health, sustainability, balance
**Industries**: Wellness, Fintech, Environment, Education
**Examples**: #059669 (emerald), #10b981 (green), #14b8a6 (teal)

### Purple
**Psychology**: Creativity, luxury, innovation, transformation
**Industries**: Design, Premium brands, Beauty, Creative services
**Examples**: #7c3aed (purple), #8b5cf6 (violet), #a855f7 (fuchsia)

### Gold/Warm Tones
**Psychology**: Achievement, warmth, luxury, human connection
**Usage**: Accent colors, testimonials, success moments
**Examples**: #f59e0b (amber), #eab308 (yellow), #f97316 (orange)

### Black/Navy/Charcoal
**Psychology**: Sophistication, power, premium, trustworthy
**Usage**: Primary backgrounds, typography, luxury brands
**Examples**: #1a1a2e (navy), #18181b (rich black), #0f172a (slate)

## Saturation Rules

**Vibrant/Saturated**: Playful, energetic, youthful, optimistic
**Muted/Desaturated**: Sophisticated, premium, calm, mature
**Pastels**: Approachable, friendly, soft, non-threatening

## Contrast Requirements (WCAG)

- Normal text: 4.5:1 minimum (AA)
- Large text (18px+): 3:1 minimum (AA)
- Enhanced: 7:1 (AAA)
`;

    case 'webflow-animation':
      return `
# Webflow Animation Reference (Interactions 2.0 / IX2)

## Trigger Types

| Trigger | Use Case |
|---------|----------|
| Page Load | Hero reveal, staggered entrance of above-fold content |
| Page Scroll | Parallax, sticky elements, progress indicators |
| Scroll Into View | Section reveals, counter animations, image fades |
| While Scrolling In View | Scrub-based animations tied to scroll position |
| Mouse Move | Parallax cursor effects, magnetic hover |
| Mouse Enter / Leave | Hover state transitions, tooltip reveals |
| Click / Tap | Toggle menus, accordions, modal opens |

## IX2 Action Types

\`\`\`
Move        → translate X/Y/Z — use for reveals (slide in from bottom/left)
Fade        → opacity 0→1     — essential for all entrance animations
Scale       → transform scale — cards on hover, logos on load
Rotate      → transform rotate — decorative elements, loaders
Skew        → transform skew  — bold typographic effects
Size        → width/height    — progress bars, reveals (use sparingly, repaints)
Text Color  → color transition — headline color shifts on scroll
Background  → bg-color        — section color transitions on scroll
Filter      → blur/brightness — image reveals, glass effects
\`\`\`

## Scroll-Triggered Reveal Pattern (Most Common)

\`\`\`
Trigger: Scroll Into View
When scrolled into view:
  1. Start: opacity 0, Move Y: 40px
  2. End:   opacity 1, Move Y: 0px
  Easing: Ease Out (0.215, 0.61, 0.355, 1)
  Duration: 600ms
  Offset: 10% from bottom (trigger before fully visible)

When scrolled out of view (optional):
  1. Start: opacity 1
  2. End:   opacity 0
  Duration: 300ms
\`\`\`

## Stagger Pattern (Cards / List Items)

\`\`\`
Target: .card (all children)
Trigger: Scroll Into View on parent container
  Children stagger delay: 100ms each
  Start: opacity 0, Move Y: 30px
  End:   opacity 1, Move Y: 0
  Easing: Ease Out Cubic
  Duration: 500ms
\`\`\`

## While Scrolling (Scrub) Pattern

\`\`\`
Trigger: While scrolling in view
  Start (element enters viewport):
    Opacity: 0.3, Scale: 0.95
  End (element exits viewport):
    Opacity: 1, Scale: 1

Use for: parallax images, hero sections, sticky progress bars
\`\`\`

## Performance Rules

✓ Animate only opacity and transform (GPU-composited, no repaints)
✓ Set will-change: transform on animated elements in Custom Code
✗ Never animate width, height, top, left (triggers layout)
✗ Avoid animating background-color on scroll (expensive)
✗ Limit simultaneous animations to <10 elements

## Accessibility — prefers-reduced-motion

In Webflow Site Settings → Custom Code → \`<head>\`:
\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
\`\`\`
This overrides all IX2 animations for users who prefer reduced motion.

## Lottie / JSON Animations

- Trigger with "While Scrolling in View" for scroll-scrubbed Lottie
- Keep Lottie files < 100KB for performance
- Use \`loop: false\` for entrance animations
- Pair with scroll offset to control playback timing

## Recommended Timing by Element Type

| Element | Duration | Easing |
|---------|----------|--------|
| Hero headline | 800ms | Ease Out Cubic |
| Section subheading | 600ms | Ease Out |
| Body text block | 500ms | Ease Out |
| Card grid (stagger) | 400ms + 80ms delay | Ease Out |
| Button hover | 200ms | Ease Standard |
| Nav on scroll | 300ms | Ease Standard |
| Modal open | 350ms | Ease Out Back |
`;

    case 'gsap-motion':
      return `
# GSAP Motion Reference
GreenSock Animation Platform — industry standard for web animation

## Installation

\`\`\`bash
npm install gsap
\`\`\`
\`\`\`js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
\`\`\`

## Core API

\`\`\`js
// Animate TO final values
gsap.to('.hero-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

// Animate FROM starting values (element starts here, animates to current CSS)
gsap.from('.hero-title', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' });

// Define both start AND end explicitly
gsap.fromTo('.card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 });

// Set immediately (no animation — good for initial state)
gsap.set('.modal', { opacity: 0, display: 'none' });
\`\`\`

## Easing Reference

\`\`\`js
// Smooth exits — use for elements leaving the screen
ease: 'power2.in'

// Smooth entrances — use for elements entering (most common)
ease: 'power2.out'
ease: 'power3.out'   // slightly more dramatic
ease: 'expo.out'     // very snappy entrance, professional feel

// Symmetric — use for state changes (hover, toggle)
ease: 'power2.inOut'
ease: 'sine.inOut'   // very smooth, premium feel

// Elastic / spring — use sparingly for playful moments
ease: 'back.out(1.7)'   // slight overshoot on arrival
ease: 'elastic.out(1, 0.3)'  // bouncy (use only for icons/micro)

// Linear — use for progress bars, continuous scrollers
ease: 'none'
\`\`\`

## Timeline — Sequenced Animations

\`\`\`js
const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });

tl.from('.nav',       { opacity: 0, y: -20 })
  .from('.hero-tag',  { opacity: 0, y: 20 }, '-=0.4')   // overlap by 400ms
  .from('.hero-h1',   { opacity: 0, y: 40 }, '-=0.5')
  .from('.hero-sub',  { opacity: 0, y: 30 }, '-=0.4')
  .from('.hero-cta',  { opacity: 0, y: 20, scale: 0.9 }, '-=0.3');
\`\`\`

## ScrollTrigger — Scroll-Driven Animations

\`\`\`js
// Basic scroll reveal
gsap.from('.section-title', {
  scrollTrigger: {
    trigger: '.section-title',
    start: 'top 80%',      // when top of element hits 80% down viewport
    end: 'top 40%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 50,
  duration: 0.8,
  ease: 'power3.out',
});

// Scrub — tied to scroll position (parallax)
gsap.to('.hero-bg', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,            // 1 = 1 second lag behind scroll (smooth)
  },
  y: 150,                // parallax distance
});

// Pin element while scrolling
ScrollTrigger.create({
  trigger: '.sticky-section',
  start: 'top top',
  end: '+=600',          // pin for 600px of scroll
  pin: true,
  scrub: true,
});
\`\`\`

## Stagger — Animate Groups of Elements

\`\`\`js
gsap.from('.card', {
  scrollTrigger: { trigger: '.cards-grid', start: 'top 75%' },
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: 'power2.out',
  stagger: {
    amount: 0.5,         // total stagger spread (500ms across all cards)
    from: 'start',       // 'start' | 'end' | 'center' | 'random'
  },
});
\`\`\`

## matchMedia — Responsive + Reduced Motion

\`\`\`js
const mm = gsap.matchMedia();

// Only run animations if user has NOT requested reduced motion
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-title', { opacity: 0, y: 60, duration: 0.8, ease: 'expo.out' });

  ScrollTrigger.create({
    trigger: '.features',
    start: 'top 80%',
    onEnter: () => gsap.from('.feature-card', { opacity: 0, y: 30, stagger: 0.1 }),
  });
});
\`\`\`

## Performance Best Practices

✓ Animate transform (x, y, scale, rotation) and opacity only
✓ Use \`will-change: transform\` on elements that animate continuously
✓ Wrap all ScrollTrigger code in \`gsap.matchMedia()\` for reduced-motion support
✓ Use \`gsap.context()\` in React/components for proper cleanup
✗ Never animate top/left/width/height (triggers reflow)
✗ Avoid animating box-shadow on scroll (use pseudo-elements instead)
✗ Don't create ScrollTrigger instances inside scroll handlers

## React Integration

\`\`\`js
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

function HeroSection() {
  const container = useRef(null);

  useGSAP(() => {
    // All GSAP code here is auto-cleaned up on unmount
    gsap.from('.hero-title', { opacity: 0, y: 60, duration: 0.8, ease: 'expo.out' });
  }, { scope: container });

  return <section ref={container}>...</section>;
}
\`\`\`

## Design System Token Mapping

\`\`\`js
// Map your design system motion tokens to GSAP
const motion = {
  micro:  { duration: 0.15, ease: 'power2.inOut' },
  short:  { duration: 0.3,  ease: 'power3.out' },
  medium: { duration: 0.6,  ease: 'power3.out' },
  long:   { duration: 1.2,  ease: 'expo.out' },
};

gsap.from('.card', { opacity: 0, y: 30, ...motion.medium });
\`\`\`
`;

    case 'ios-hig':
      return `
# iOS Human Interface Guidelines — Design Patterns Reference

## Navigation Patterns

### NavigationStack (push/pop)
- Use for hierarchical content: list → detail → sub-detail
- Back button always shows previous screen title (truncated to 12 chars)
- Large title on root screen collapses to inline on scroll
- \`navigationBarTitleDisplayMode(.large)\` for root, \`.inline\` for detail

### Tab Bar (UITabBar)
- Use for peer-level destinations (max 5 tabs)
- Tab bar height: 49pt + 34pt home indicator = 83pt total safe zone
- Icons: 25pt SF Symbols, filled variant for selected state
- Always visible — never hide tab bar on navigation push
- Badge: red circle (UIBadgeValue), 8pt minimum, auto-positions top-right of icon

### Modal / Sheet Presentation
- UISheetPresentationController detents: .medium (50%) and .large (90%)
- Drag handle: 36pt × 4pt, centered, 8pt from top edge
- Sheet dismiss: drag down OR tap scrim — always both options
- Full-screen modal: use only for immersive tasks (camera, video)

### Split View (iPad)
- UISplitViewController for iPad — sidebar + content layout
- Adapt to compact width with single-column layout on iPhone
- .adaptivePresentationStyle for automatic iPhone/iPad transitions

---

## Typography — Dynamic Type Scale

| Style         | Default | xxxLarge |
|---------------|---------|----------|
| Caption 2     | 11pt    | 19pt     |
| Caption 1     | 12pt    | 20pt     |
| Footnote      | 13pt    | 21pt     |
| Subheadline   | 15pt    | 23pt     |
| Body          | 17pt    | 25pt     |
| Title 3       | 20pt    | 28pt     |
| Title 2       | 22pt    | 30pt     |
| Title 1       | 28pt    | 38pt     |
| Large Title   | 34pt    | 46pt     |

**Implementation:**
\`\`\`swift
// SwiftUI
Text("Hello").font(.body)  // auto-scales with Dynamic Type
Text("Title").font(.largeTitle).bold()

// UIKit
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true
\`\`\`

---

## Touch Targets & Spacing

- **Minimum touch target**: 44×44pt (Apple HIG requirement)
- **Recommended**: 48×48pt for primary actions
- **Spacing between targets**: 8pt minimum (16pt for destructive actions)
- **Edge margins**: 16–20pt from screen edges for primary content
- **List row height**: 44pt minimum, 56pt for two-line, 72pt for image rows

---

## Safe Areas

| Area              | iPhone with Dynamic Island | iPhone without notch |
|-------------------|---------------------------|----------------------|
| Status bar        | 59pt                      | 44pt                 |
| Navigation bar    | 44pt                      | 44pt                 |
| Tab bar           | 83pt (incl. home indicator) | 49pt               |
| Home indicator    | 34pt                      | 0pt                  |

**Always use safeAreaInsets / safeAreaLayoutGuide — never hard-code these values.**

---

## SF Symbols

- Use SF Symbols for all icons — 4,000+ symbols, automatically match system weight
- Sizes: .caption2, .caption, .footnote, .subheadline, .body, .callout, .headline, .title3, .title2, .title, .largeTitle
- Rendering: .monochrome (default), .hierarchical, .palette, .multicolor
- Never use UIImage.systemImage for decorative purposes without accessibilityLabel

\`\`\`swift
Image(systemName: "heart.fill")
  .symbolRenderingMode(.hierarchical)
  .foregroundStyle(.red)
  .font(.title2)
  .accessibilityLabel("Liked")
\`\`\`

---

## Motion — iOS Native Patterns

- **Spring physics**: UISpringTimingParameters or SwiftUI .spring()
  - Calm/Premium: damping 0.85, stiffness 150
  - Default: damping 0.75, stiffness 200
  - Energetic: damping 0.6, stiffness 280
- **Screen transitions**: push (0.35s ease-out), modal (0.3s ease-out upward)
- **Reduce Motion**: always check UIAccessibility.isReduceMotionEnabled
  - Replace translate/scale → fade (opacity only)
  - Use @Environment(\\.accessibilityReduceMotion) in SwiftUI

---

## Color System

- **Semantic colors** (auto-adapt to light/dark mode):
  - .systemBackground, .secondarySystemBackground, .tertiarySystemBackground
  - .label, .secondaryLabel, .tertiaryLabel, .quaternaryLabel
  - .systemBlue, .systemRed, .systemGreen (use tinted variants, never raw hex)
- **Dark mode**: Always test in dark mode — use Asset Catalog color sets
- **Tint color**: accentColor in SwiftUI / tintColor in UIKit drives interactive element color

---

## Edge Cases & Common Mistakes

- ❌ Never hide the status bar in a non-game app
- ❌ Never disable bounce scrolling (it signals to users where the list ends)
- ❌ Never use modal sheets for confirmation dialogs — use UIAlertController instead
- ❌ Never intercept the swipe-back gesture — always support it
- ✅ Use .contextMenu for long-press secondary actions (not custom gesture recognizers)
- ✅ Support both portrait and landscape on iPad
- ✅ Keyboard avoidance: use .ignoresSafeArea(.keyboard) carefully — inputs must always be visible
- ✅ Handle state restoration — save scroll position, form text, expanded states across app launches
`;

    case 'material-design':
      return `
# Material Design 3 (Material You) — Design Patterns Reference

## Color System — Dynamic Color

### Tonal Palette Roles
| Token               | Light                     | Dark                      |
|---------------------|---------------------------|---------------------------|
| primary             | Key brand color           | Lighter tint of brand     |
| onPrimary           | Text/icons on primary     | Text/icons on primary     |
| primaryContainer    | Background for filled btn | Background for filled btn |
| onPrimaryContainer  | Text on primaryContainer  | Text on primaryContainer  |
| secondary           | Complementary accent      | Complementary accent      |
| surface             | Card/screen background    | Dark surface              |
| surfaceVariant      | Input field backgrounds   | Slightly lighter surface  |
| outline             | Border/divider color      | Border color              |
| error / onError     | Red tone + white          | Light red + dark          |

**Dynamic Color (Android 12+):** Material You extracts colors from the user's wallpaper.
Always provide a fallback palette for older devices.

---

## Typography — Material Type Scale (sp units)

| Style           | Size  | Weight | Usage                         |
|-----------------|-------|--------|-------------------------------|
| Display Large   | 57sp  | 400    | Hero, splash screens          |
| Display Medium  | 45sp  | 400    | Feature sections              |
| Display Small   | 36sp  | 400    | Section headers               |
| Headline Large  | 32sp  | 400    | Major screen titles           |
| Headline Medium | 28sp  | 400    | Screen section headers        |
| Headline Small  | 24sp  | 400    | Card headers                  |
| Title Large     | 22sp  | 400    | App bar titles                |
| Title Medium    | 16sp  | 500    | Dialog titles, list headers   |
| Title Small     | 14sp  | 500    | Overlines, section labels     |
| Body Large      | 16sp  | 400    | Primary reading text          |
| Body Medium     | 14sp  | 400    | Secondary text                |
| Body Small      | 12sp  | 400    | Captions, helper text         |
| Label Large     | 14sp  | 500    | Button labels, tabs           |
| Label Medium    | 12sp  | 500    | Chip labels                   |
| Label Small     | 11sp  | 500    | Overlines, badge labels       |

**Always use sp for text — never dp or px for font sizes.**

---

## Component Specifications

### Buttons
- **Filled**: Primary action, primaryContainer bg, 20dp corner radius
- **Tonal**: Secondary action, secondaryContainer, 20dp radius
- **Outlined**: Less prominent, outline border, 20dp radius
- **Text**: Lowest emphasis, no background
- **FAB**: 56dp standard, 40dp small, 96dp large, 16dp corner radius
- Min height: 40dp, min touch target: 48dp, 24dp horizontal padding

### Top App Bar
- Small: 64dp height, centered or start-aligned title
- Medium: 112dp with large title below
- Large: 152dp with prominent large title
- Scrolling behavior: collapse (reduce height) or elevate (add shadow)
- Actions: max 3 icon buttons right, overflow menu for more

### Navigation Bar (Bottom)
- Height: 80dp (includes 8dp bottom padding for gesture nav)
- 3–5 destinations (mandatory — no fewer, no more)
- Active indicator: pill shape, 64dp × 32dp, secondaryContainer color
- Icon size: 24dp, label: Label Medium (12sp)
- Must clear gesture navigation bar — use WindowInsetsCompat

### Bottom Sheet
- Modal: scrim dimmed, tap to dismiss, drag handle required
- Standard: no scrim, coexists with screen content
- Corner radius: 28dp top corners (Material spec)
- Peek height: 50% of screen (half-expanded) → 90% (expanded)
- Drag handle: 32dp × 4dp, centered, 22dp from top edge

### Cards
- **Elevated**: shadow 1dp default, 4dp hover, surface color
- **Filled**: surfaceVariant background, no shadow
- **Outlined**: outline color border, no shadow
- Corner radius: 12dp (standard), 16dp (large)

---

## Spacing & Layout

- Base grid: 4dp
- Touch targets: 48×48dp minimum (all interactive elements)
- Horizontal margins: 16dp (compact), 24dp (medium), 24dp (expanded)
- Content max-width: 840dp (medium window), 1240dp (expanded)
- Between cards/list items: 8dp vertical spacing

---

## Motion — Material Motion System

### Easing Curves
\`\`\`
Emphasized:          cubic-bezier(0.2, 0, 0, 1)       — spatial transitions
Emphasized Decelerate: cubic-bezier(0.05, 0.7, 0.1, 1) — elements entering screen
Emphasized Accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15) — elements leaving screen
Standard:            cubic-bezier(0.2, 0, 0, 1)       — non-spatial transitions
Standard Decelerate: cubic-bezier(0, 0, 0, 1)         — entering without origin
Standard Accelerate: cubic-bezier(0.3, 0, 1, 1)       — exiting without destination
\`\`\`

### Duration Scale
\`\`\`
Short 1: 50ms    — micro (color changes, checkbox toggle)
Short 2: 100ms   — icon morphs, tooltip
Short 3: 150ms   — FAB icon switch
Short 4: 200ms   — chip appear, snackbar fade
Medium 1: 250ms  — list item expand
Medium 2: 300ms  — dialog enter, bottom sheet peek
Medium 3: 350ms  — nav drawer open
Medium 4: 400ms  — full-screen modal
Long 1: 450ms    — page transition
Long 2: 500ms    — emphasized, large container transform
\`\`\`

---

## Edge Cases & Common Mistakes

- ❌ Never use px for font sizes — sp required for font accessibility scaling
- ❌ Never block the back gesture/button — always handle onBackPressedDispatcher
- ❌ Never hardcode status bar height (24dp) — use WindowInsets for actual value
- ❌ FAB should never be used for destructive actions (delete, remove)
- ✅ Support predictive back gesture (Android 14+) with OnBackPressedCallback
- ✅ Handle all window size classes: compact (<600dp), medium (600–840dp), expanded (>840dp)
- ✅ Test with TalkBack enabled — every interactive element needs contentDescription or role
- ✅ Use \`Modifier.semantics\` in Compose for custom accessibility actions
- ✅ Provide night/dark mode variants in all color slots — test in both light and dark
- ✅ Respect "Remove Animations" developer setting via ValueAnimator.areAnimatorsEnabled()
`;

    default:
      return 'Reference type not found.';
  }
}

export function getProjectBriefTemplate(): string {
  return `
# Project Brief Template

## Project Fundamentals
- **Project Name**:
- **Description**:
- **Industry Category**:

## Primary Audience
- **Role/Title**:
- **Pain Points**:
- **Objections**:
- **Fears**:

## Brand Positioning
- **Unique Position**:
- **Philosophy**:
- **Desired Perception**:

## Narrative/Transformation
- **Before State**:
- **Transformation Moment**:
- **After State**:
- **Success Metric**:

## CTA Strategy
- **Primary CTA**:
- **Primary CTA Outcome**:
- **Secondary CTAs**:

## Emotional Direction
- **Emotional Tone** (pick 3-5):
  - [ ] Energetic & Inspiring
  - [ ] Calm & Trustworthy
  - [ ] Sophisticated & Premium
  - [ ] Playful & Approachable
  - [ ] Bold & Rebellious
  - [ ] Warm & Human
  - [ ] Professional & Authoritative
  - [ ] Innovative & Futuristic
  - [ ] Grounded & Authentic

- **Visual Personality**:
- **Aesthetic References**:

## Content Strategy
- **Key Messages** (prioritized):
  1.
  2.
  3.

- **Proof Points**:
  - Experience:
  - Clients:
  - Results:
  - Awards:

- **Page Structure**:
  1. Hero/Home
  2.
  3.

## Technical
- **Tech Stack Preference**:
- **Required Integrations**:
- **CMS Strategy**:
- **Timeline**:
- **SEO Priority**: (High/Medium/Low)

## Competitive
- **Competitors**:
- **Competitive Advantages**:
- **Visual Inspiration** (outside industry):

## Success Metrics
- **Primary Metric**:
- **Conversion Goal**:
- **Business Objective**:
`;
}

export function getComponentTemplate(component: 'button' | 'card' | 'hero' | 'navigation' | 'form'): string {
  switch (component) {
    case 'button':
      return `
<!-- Primary Button Component -->
<button class="btn btn-primary" type="button">
  Button Text
</button>

<style>
.btn {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px; /* Touch-friendly */

  /* Accessibility */
  outline-offset: 2px;
}

.btn:hover {
  transform: scale(1.02);
}

.btn:active {
  transform: scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.btn-primary {
  background: var(--color-secondary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-secondary-dark);
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-secondary);
  color: var(--color-secondary);
}

/* Mobile responsive */
@media (max-width: 767px) {
  .btn {
    padding: 14px 28px;
    width: 100%; /* Full width on mobile */
  }
}
</style>
`;

    case 'card':
      return `
<!-- Card Component -->
<article class="card">
  <div class="card__image">
    <img src="" alt="" loading="lazy" width="400" height="300">
  </div>
  <div class="card__content">
    <h3 class="card__title">Card Title</h3>
    <p class="card__description">Card description text</p>
    <a href="#" class="card__link">Learn more →</a>
  </div>
</article>

<style>
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 300ms, transform 300ms;
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card__image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms;
}

.card:hover .card__image img {
  transform: scale(1.05);
}

.card__content {
  padding: 24px;
}

.card__title {
  font-size: 1.5rem;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.card__description {
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.card__link {
  color: var(--color-secondary);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (min-width: 1024px) {
  .card__content {
    padding: 32px;
  }
}
</style>
`;

    case 'hero':
      return `
<!-- Hero Section -->
<section class="hero">
  <div class="hero__container">
    <div class="hero__content">
      <h1 class="hero__title">Transform Your [Audience Pain Point]</h1>
      <p class="hero__subtitle">
        [Value proposition that addresses before state → after state]
      </p>
      <div class="hero__actions">
        <button class="btn btn-primary">[Primary CTA]</button>
        <button class="btn btn-secondary">[Secondary CTA]</button>
      </div>
    </div>
    <div class="hero__visual">
      <img src="" alt="" width="600" height="600">
    </div>
  </div>
</section>

<style>
.hero {
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 48px 24px;
  background: var(--color-background);
}

.hero__container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

.hero__title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  line-height: 1.1;
  margin: 0 0 24px 0;
  font-weight: 800;
}

.hero__subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 32px 0;
  max-width: 600px;
}

.hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero__visual img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

@media (min-width: 1024px) {
  .hero {
    min-height: 80vh;
    padding: 96px 48px;
  }

  .hero__container {
    grid-template-columns: 1fr 1fr;
    gap: 64px;
  }
}
</style>
`;

    case 'navigation':
      return `
<!-- Navigation Component -->
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav__container">
    <a href="/" class="nav__logo">
      <img src="logo.svg" alt="Company Name" width="120" height="40">
    </a>

    <button class="nav__toggle" aria-expanded="false" aria-controls="nav-menu">
      <span class="sr-only">Toggle menu</span>
      <span class="nav__toggle-icon"></span>
    </button>

    <ul class="nav__menu" id="nav-menu">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#work">Work</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <a href="#cta" class="btn btn-primary nav__cta">[Primary CTA]</a>
  </div>
</nav>

<style>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid transparent;
  transition: all 300ms;
}

.nav.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav__logo img {
  display: block;
}

.nav__menu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 32px;
}

.nav__menu a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: color 200ms;
}

.nav__menu a:hover {
  color: var(--color-secondary);
}

.nav__toggle {
  display: block;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.nav__cta {
  display: none;
}

/* Desktop */
@media (min-width: 1024px) {
  .nav__container {
    padding: 20px 48px;
  }

  .nav__menu {
    display: flex;
  }

  .nav__toggle {
    display: none;
  }

  .nav__cta {
    display: inline-flex;
  }
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
`;

    case 'form':
      return `
<!-- Contact Form -->
<form class="form" aria-labelledby="form-title">
  <h2 id="form-title">[Primary CTA]</h2>

  <div class="form__group">
    <label for="name" class="form__label">Name *</label>
    <input
      type="text"
      id="name"
      name="name"
      class="form__input"
      required
      aria-required="true"
    >
  </div>

  <div class="form__group">
    <label for="email" class="form__label">Email *</label>
    <input
      type="email"
      id="email"
      name="email"
      class="form__input"
      required
      aria-required="true"
      autocomplete="email"
    >
  </div>

  <div class="form__group">
    <label for="message" class="form__label">Message *</label>
    <textarea
      id="message"
      name="message"
      class="form__input form__textarea"
      rows="5"
      required
      aria-required="true"
    ></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Send Message</button>
</form>

<style>
.form {
  max-width: 600px;
  margin: 0 auto;
}

.form h2 {
  margin: 0 0 32px 0;
}

.form__group {
  margin-bottom: 24px;
}

.form__label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-text);
}

.form__input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px; /* Prevents iOS zoom */
  font-family: inherit;
  transition: border-color 200ms, box-shadow 200ms;
}

.form__input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(var(--color-secondary-rgb), 0.1);
}

.form__input:invalid:not(:focus):not(:placeholder-shown) {
  border-color: var(--color-error);
}

.form__textarea {
  resize: vertical;
  min-height: 120px;
}

.form button[type="submit"] {
  width: 100%;
}

@media (min-width: 768px) {
  .form button[type="submit"] {
    width: auto;
    min-width: 200px;
  }
}
</style>
`;

    default:
      return 'Component template not found.';
  }
}
