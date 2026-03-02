/**
 * Design System Generator Tool
 * Creates comprehensive design systems based on project brief
 */

import { DesignSystem, ProjectBrief } from '../types/index.js';
import { briefStorage } from '../utils/storage.js';
import { generateColorPalette } from './colorPalette.js';

export function createDesignSystem(projectName: string): {
  success: boolean;
  message: string;
  designSystem?: DesignSystem;
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Complete project discovery first.`
    };
  }

  // Get color palette
  const paletteResult = generateColorPalette(projectName);
  if (!paletteResult.palette) {
    return {
      success: false,
      message: 'Failed to generate color palette for design system.'
    };
  }

  // Generate typography system based on emotional tone
  const typography = generateTypographySystem(brief);

  // Generate spacing system
  const spacing = generateSpacingSystem();

  // Generate breakpoints
  const breakpoints = generateBreakpoints();

  // Generate motion system
  const motion = generateMotionSystem(brief);

  const designSystem: DesignSystem = {
    typography,
    spacing,
    breakpoints,
    motion,
    colors: paletteResult.palette
  };

  return {
    success: true,
    message: `Design system created for "${projectName}". This includes typography, spacing, breakpoints, motion guidelines, and color palette.`,
    designSystem
  };
}

function generateTypographySystem(brief: ProjectBrief) {
  const tones = brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase());

  // Determine font pairings based on emotional tone
  let displayFont = {
    family: 'Inter, system-ui, sans-serif',
    weights: [700, 800, 900],
    usage: 'Hero headlines, section titles, major headings'
  };

  let bodyFont = {
    family: 'Inter, system-ui, sans-serif',
    weights: [400, 500, 600],
    usage: 'Body text, paragraphs, descriptions, general content'
  };

  let accentFont = undefined;

  if (tones.includes('sophisticated & premium') || tones.includes('professional & authoritative')) {
    displayFont = {
      family: 'Playfair Display, Georgia, serif',
      weights: [700, 800, 900],
      usage: 'Hero headlines, elegant section titles'
    };
    bodyFont = {
      family: 'Inter, system-ui, sans-serif',
      weights: [400, 500, 600],
      usage: 'All body content for maximum readability'
    };
  } else if (tones.includes('bold & rebellious') || tones.includes('playful & approachable')) {
    displayFont = {
      family: 'Space Grotesk, sans-serif',
      weights: [700, 800],
      usage: 'Bold, geometric headlines with personality'
    };
    accentFont = {
      family: 'Caveat, cursive',
      weights: [400, 700],
      usage: 'Sparingly for emotional moments, handwritten feel'
    };
  } else if (tones.includes('innovative & futuristic')) {
    displayFont = {
      family: 'Outfit, sans-serif',
      weights: [600, 700, 800],
      usage: 'Modern, clean headlines'
    };
  }

  // Typography scale following 1.25 ratio (Major Third)
  const scale = [
    { size: '0.75rem', lineHeight: '1.2', useCase: 'Caption, metadata, fine print (12px)' },
    { size: '0.875rem', lineHeight: '1.4', useCase: 'Small text, labels, secondary info (14px)' },
    { size: '1rem', lineHeight: '1.6', useCase: 'Body text, paragraphs (16px)' },
    { size: '1.125rem', lineHeight: '1.6', useCase: 'Large body text, lead paragraphs (18px)' },
    { size: '1.5rem', lineHeight: '1.4', useCase: 'H3, subsection titles (24px)' },
    { size: '2rem', lineHeight: '1.3', useCase: 'H2, section anchors (32px)' },
    { size: '3rem', lineHeight: '1.2', useCase: 'H1 (tablet), major headings (48px)' },
    { size: '4rem', lineHeight: '1.1', useCase: 'Hero headlines (desktop) (64px)' },
    { size: 'clamp(3rem, 8vw, 6rem)', lineHeight: '1.1', useCase: 'Responsive hero (48-96px)' }
  ];

  return {
    displayFont,
    bodyFont,
    accentFont,
    scale
  };
}

function generateSpacingSystem() {
  // 8px base unit system
  return {
    baseUnit: 8,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256]
  };
}

function generateBreakpoints() {
  return [
    { name: 'mobile-small', minWidth: 320, maxWidth: 479, columns: 1 },
    { name: 'mobile', minWidth: 480, maxWidth: 767, columns: 1 },
    { name: 'tablet', minWidth: 768, maxWidth: 1023, columns: 2 },
    { name: 'desktop', minWidth: 1024, maxWidth: 1199, columns: 3 },
    { name: 'desktop-large', minWidth: 1200, maxWidth: 1599, columns: 4 },
    { name: 'ultra-wide', minWidth: 1600, columns: 4 }
  ];
}

function generateMotionSystem(brief: ProjectBrief) {
  const tones = brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase());

  let easings: Record<string, string> = {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
    'ease-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  };

  let durations: Record<string, string> = {
    micro: '150ms',
    short: '300ms',
    medium: '600ms',
    long: '1200ms'
  };

  // Adjust based on emotional tone
  if (tones.includes('calm & trustworthy') || tones.includes('sophisticated & premium')) {
    // Slower, more deliberate animations
    durations = {
      micro: '200ms',
      short: '400ms',
      medium: '800ms',
      long: '1500ms'
    };
  } else if (tones.includes('energetic & inspiring') || tones.includes('playful & approachable')) {
    // Snappier, more energetic
    durations = {
      micro: '120ms',
      short: '250ms',
      medium: '500ms',
      long: '1000ms'
    };
    // Add bouncy easing for playful
    easings['ease-out-back'] = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  return {
    easings,
    durations
  };
}

export function generateComponentLibrary(projectName: string): {
  success: boolean;
  message: string;
  components?: {
    name: string;
    description: string;
    variants: string[];
    states: string[];
    specifications: Record<string, string>;
  }[];
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}".`
    };
  }

  const components: {
    name: string;
    description: string;
    variants: string[];
    states: string[];
    specifications: Record<string, string>;
  }[] = [
    {
      name: 'Button',
      description: 'Primary interactive element for CTAs',
      variants: ['primary', 'secondary', 'tertiary', 'ghost'],
      states: ['default', 'hover', 'active', 'disabled', 'loading', 'focus'],
      specifications: {
        'padding': '12px 24px (mobile) | 16px 32px (desktop)',
        'border-radius': '8px',
        'font-weight': '600',
        'transition': 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'min-height': '44px (touch-friendly)',
        'hover-transform': 'scale(1.02)',
        'primary-bg': 'secondary color from palette',
        'primary-text': 'white or high-contrast'
      }
    },
    {
      name: 'Card',
      description: 'Content container for testimonials, case studies, features',
      variants: ['elevated', 'outlined', 'flat', 'image-header'],
      states: ['default', 'hover', 'active', 'focus'],
      specifications: {
        'padding': '24px (mobile) | 32px (desktop)',
        'border-radius': '12px',
        'background': 'white',
        'box-shadow': '0 1px 3px rgba(0,0,0,0.1)',
        'hover-shadow': '0 8px 24px rgba(0,0,0,0.12)',
        'transition': 'box-shadow 300ms, transform 300ms'
      }
    },
    {
      name: 'Hero Section',
      description: `Primary landing section with ${brief.CTA_STRATEGY.PRIMARY_CTA}`,
      variants: ['image-left', 'image-right', 'centered', 'full-bleed'],
      states: ['default', 'loading'],
      specifications: {
        'min-height': '600px (mobile) | 80vh (desktop)',
        'padding': '48px 24px (mobile) | 96px 48px (desktop)',
        'headline-size': 'clamp(2.5rem, 8vw, 4.5rem)',
        'max-width': '1400px',
        'cta-prominence': 'Secondary brand color, 48px min-height'
      }
    },
    {
      name: 'Navigation',
      description: 'Main site navigation',
      variants: ['hamburger-mobile', 'horizontal-desktop', 'sticky'],
      states: ['default', 'scrolled', 'menu-open', 'menu-closed'],
      specifications: {
        'height': '64px (mobile) | 80px (desktop)',
        'background': 'white with backdrop-blur on scroll',
        'box-shadow-scrolled': '0 2px 8px rgba(0,0,0,0.08)',
        'transition': 'all 300ms',
        'z-index': '100'
      }
    },
    {
      name: 'Form Input',
      description: 'Text input fields for contact forms',
      variants: ['text', 'email', 'textarea', 'select'],
      states: ['default', 'focus', 'error', 'disabled', 'success'],
      specifications: {
        'height': '48px',
        'padding': '12px 16px',
        'border': '1px solid #e5e7eb',
        'border-radius': '8px',
        'focus-border': 'secondary color',
        'focus-ring': '0 0 0 3px rgba(secondary, 0.1)',
        'error-border': '#ef4444',
        'font-size': '16px (prevents zoom on iOS)'
      }
    },
    {
      name: 'Testimonial',
      description: 'Customer testimonial display',
      variants: ['card', 'quote-large', 'carousel-item'],
      states: ['default', 'hover'],
      specifications: {
        'padding': '32px',
        'quote-size': '1.125rem',
        'quote-style': 'italic',
        'author-image': '48px circle',
        'accent-color': 'accent color from palette',
        'background': 'neutral background'
      }
    }
  ];

  return {
    success: true,
    message: `Component library generated for "${projectName}" with ${components.length} core components.`,
    components
  };
}
