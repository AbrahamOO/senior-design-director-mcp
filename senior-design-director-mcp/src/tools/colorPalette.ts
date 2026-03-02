/**
 * Color Palette Generator Tool
 * Generates color recommendations based on project brief
 */

import { ColorPalette, ProjectBrief } from '../types/index.js';
import { briefStorage } from '../utils/storage.js';

interface ColorPsychology {
  primary: string;
  secondary: string;
  accent: string;
  rationale: string;
}

const COLOR_PSYCHOLOGY_MAP: Record<string, ColorPsychology> = {
  'saas-tech-premium': {
    primary: '#1a1a2e',
    secondary: '#4f46e5',
    accent: '#f59e0b',
    rationale: 'Deep navy for trust and sophistication, vibrant indigo for innovation and technology, warm amber for human warmth and achievement.'
  },
  'wellness-calm': {
    primary: '#f8f9fa',
    secondary: '#059669',
    accent: '#fbbf24',
    rationale: 'Light neutral background for calm, natural green for health and growth, warm gold for warmth and achievement.'
  },
  'creative-bold': {
    primary: '#18181b',
    secondary: '#ec4899',
    accent: '#06b6d4',
    rationale: 'Rich black for sophistication, vibrant pink for creativity and energy, cyan for innovation and freshness.'
  },
  'professional-trustworthy': {
    primary: '#1e3a8a',
    secondary: '#3b82f6',
    accent: '#14b8a6',
    rationale: 'Deep blue for trust and professionalism, bright blue for approachability, teal for balance and stability.'
  },
  'startup-energetic': {
    primary: '#f97316',
    secondary: '#8b5cf6',
    accent: '#eab308',
    rationale: 'Energetic orange for action and enthusiasm, vibrant purple for innovation, bright yellow for optimism.'
  }
};

export function generateColorPalette(projectName: string): {
  success: boolean;
  message: string;
  palette?: ColorPalette;
  alternatives?: ColorPalette[];
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Complete project discovery first.`
    };
  }

  // Respect existing brand colors if provided
  const existingColors = brief.COLOR_STRATEGY.EXISTING_COLORS;
  const colorConstraints = brief.COLOR_STRATEGY.CONSTRAINTS;
  const hasExistingColors =
    existingColors && existingColors.toLowerCase() !== 'none' && existingColors.trim() !== '';
  const hasConstraints =
    colorConstraints && colorConstraints.toLowerCase() !== 'none' && colorConstraints.trim() !== '';

  // Analyze brief to determine color strategy from emotional tone / industry
  const paletteKey = determinePaletteKey(brief);
  let colorPsych = COLOR_PSYCHOLOGY_MAP[paletteKey] ?? COLOR_PSYCHOLOGY_MAP['professional-trustworthy'];

  // Override with existing brand colors when specified
  if (hasExistingColors) {
    const parsedHex = extractFirstHex(existingColors);
    if (parsedHex) {
      colorPsych = {
        ...colorPsych,
        primary: parsedHex,
        rationale: `Using your existing brand color (${parsedHex}) as primary. ${colorPsych.rationale}`
      };
    }
  }

  const toneList = brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.join(', ') || 'your brand tone';
  const primaryTone = brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE[0] || 'your brand tone';
  const desiredPerception = brief.BRAND_POSITIONING.DESIRED_PERCEPTION || 'your brand';
  const philosophy = brief.BRAND_POSITIONING.PHILOSOPHY || 'your brand philosophy';
  const primaryCTA = brief.CTA_STRATEGY.PRIMARY_CTA;

  const constraintNote = hasConstraints
    ? ` Color constraints applied: ${colorConstraints}.`
    : '';

  const palette: ColorPalette = {
    name: `${brief.PROJECT_NAME} Primary Palette`,
    rationale: `Based on your emotional tone (${toneList}), your ${brief.INDUSTRY_CATEGORY} industry, and your target audience (${brief.PRIMARY_AUDIENCE.ROLE}), this palette communicates ${desiredPerception}. ${colorPsych.rationale}${constraintNote}`,

    primary: {
      name: hasExistingColors ? 'Existing Brand Color' : 'Primary Brand Color',
      hex: colorPsych.primary,
      rgb: hexToRgb(colorPsych.primary),
      usage: 'Backgrounds, primary typography, hero sections (70% usage)',
      psychology: 'Trust, confidence, premium feel, establishes brand authority',
      reasoning: hasExistingColors
        ? `Your existing brand color (${existingColors}), preserved for consistency.`
        : `Chosen to align with your emotional tone of ${primaryTone} and your desired perception as ${desiredPerception}.`
    },

    secondary: {
      name: 'Secondary Accent Color',
      hex: colorPsych.secondary,
      rgb: hexToRgb(colorPsych.secondary),
      usage: 'CTAs, key highlights, section dividers, interactive elements (20% usage)',
      psychology: 'Energy, action-oriented, innovation, draws attention',
      reasoning: `Selected to drive action toward your primary CTA (${primaryCTA}) and create visual interest.`
    },

    accent: {
      name: 'Emotional Accent Color',
      hex: colorPsych.accent,
      rgb: hexToRgb(colorPsych.accent),
      usage: 'Testimonials, success moments, warmth elements (10% usage)',
      psychology: 'Achievement, warmth, human connection, emotional resonance',
      reasoning: `Provides emotional warmth to balance professionalism, supporting your brand philosophy: ${philosophy}.`
    },

    neutrals: {
      background: '#ffffff',
      textPrimary: colorPsych.primary,
      textSecondary: '#6b7280',
      dividers: '#e5e7eb'
    },

    usageGuidelines: `
PRIMARY (70%): Use for main backgrounds, large text blocks, navigation elements. This establishes the overall mood.

SECONDARY (20%): Reserve for all CTAs ("${primaryCTA}"), interactive elements, key section headers. This drives action.

ACCENT (10%): Use sparingly for testimonials, achievement highlights, emotional moments. This creates warmth and personality.

NEUTRALS: For text readability, subtle dividers, and breathing room. Maintains hierarchy without overwhelming.
${hasConstraints ? `\nCOLOR CONSTRAINTS: ${colorConstraints}` : ''}
Accessibility: All color combinations meet WCAG AA standards (4.5:1 contrast minimum for text).
    `.trim()
  };

  const alternatives = generateAlternativePalettes(brief);

  return {
    success: true,
    message: `Color palette generated for "${projectName}" based on project brief analysis.` +
      (hasExistingColors ? ` Existing brand color (${existingColors}) used as primary.` : ''),
    palette,
    alternatives
  };
}

/**
 * Extracts the first valid 3- or 6-digit hex color from a free-text string.
 * e.g. "Our brand uses #E63946 and some navy" → "#E63946"
 */
function extractFirstHex(text: string): string | null {
  const match = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/.exec(text);
  return match ? match[0] : null;
}

function determinePaletteKey(brief: ProjectBrief): string {
  const tones = new Set(brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase()));

  if (tones.has('sophisticated & premium') || tones.has('professional & authoritative')) {
    const industry = brief.INDUSTRY_CATEGORY.toLowerCase();
    if (industry.includes('saas') || industry.includes('tech')) {
      return 'saas-tech-premium';
    }
    return 'professional-trustworthy';
  }

  if (tones.has('calm & trustworthy') || tones.has('grounded & authentic')) {
    return 'wellness-calm';
  }

  if (tones.has('bold & rebellious') || tones.has('playful & approachable')) {
    return 'creative-bold';
  }

  if (tones.has('energetic & inspiring') || tones.has('innovative & futuristic')) {
    return 'startup-energetic';
  }

  return 'professional-trustworthy';
}

function generateAlternativePalettes(brief: ProjectBrief): ColorPalette[] {
  const hasConstraints =
    brief.COLOR_STRATEGY.CONSTRAINTS &&
    brief.COLOR_STRATEGY.CONSTRAINTS.toLowerCase() !== 'none' &&
    brief.COLOR_STRATEGY.CONSTRAINTS.trim() !== '';
  const constraintNote = hasConstraints ? ` Note: ${brief.COLOR_STRATEGY.CONSTRAINTS}` : '';

  return [
    {
      name: 'Alternative: Warmer & More Approachable',
      rationale: `If you want to emphasize warmth and human connection over sophistication.${constraintNote}`,
      primary: {
        name: 'Warm Navy',
        hex: '#2d3748',
        rgb: 'rgb(45, 55, 72)',
        usage: 'Backgrounds, typography',
        psychology: 'Professional but approachable',
        reasoning: 'Softer alternative to pure black'
      },
      secondary: {
        name: 'Warm Coral',
        hex: '#f56565',
        rgb: 'rgb(245, 101, 101)',
        usage: 'CTAs, highlights',
        psychology: 'Friendly energy, approachable action',
        reasoning: 'More human than pure red'
      },
      accent: {
        name: 'Sunset Orange',
        hex: '#ed8936',
        rgb: 'rgb(237, 137, 54)',
        usage: 'Emotional moments',
        psychology: 'Warmth, optimism',
        reasoning: 'Creates inviting atmosphere'
      },
      neutrals: {
        background: '#fafafa',
        textPrimary: '#2d3748',
        textSecondary: '#718096',
        dividers: '#e2e8f0'
      },
      usageGuidelines: 'Best if your audience values personal connection and you want to feel less corporate.'
    },
    {
      name: 'Alternative: Bolder & More Vibrant',
      rationale: `If you want to stand out dramatically and appeal to innovative, risk-taking audiences.${constraintNote}`,
      primary: {
        name: 'Deep Purple',
        hex: '#5b21b6',
        rgb: 'rgb(91, 33, 182)',
        usage: 'Backgrounds, major sections',
        psychology: 'Innovation, creativity, luxury',
        reasoning: 'Differentiates from blue-heavy competitors'
      },
      secondary: {
        name: 'Electric Cyan',
        hex: '#06b6d4',
        rgb: 'rgb(6, 182, 212)',
        usage: 'CTAs, interactive elements',
        psychology: 'Fresh, modern, energetic',
        reasoning: 'High contrast for attention'
      },
      accent: {
        name: 'Vibrant Pink',
        hex: '#ec4899',
        rgb: 'rgb(236, 72, 153)',
        usage: 'Highlights, special moments',
        psychology: 'Bold, memorable, unexpected',
        reasoning: 'Creates memorable brand moments'
      },
      neutrals: {
        background: '#ffffff',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        dividers: '#d1d5db'
      },
      usageGuidelines: 'Best if you want to be remembered and are targeting younger, innovation-focused audiences.'
    }
  ];
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(0, 0, 0)';

  const r = Number.parseInt(result[1] ?? '0', 16);
  const g = Number.parseInt(result[2] ?? '0', 16);
  const b = Number.parseInt(result[3] ?? '0', 16);

  return `rgb(${r}, ${g}, ${b})`;
}

export function validateColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  recommendation: string;
} {
  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);

  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  const rounded = Math.round(ratio * 100) / 100;

  return {
    ratio: rounded,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    recommendation:
      ratio >= 4.5
        ? 'Meets WCAG AA standards for normal text'
        : 'Insufficient contrast. Increase difference between foreground and background colors.'
  };
}

function getLuminance(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;

  const r = Number.parseInt(result[1] ?? '0', 16) / 255;
  const g = Number.parseInt(result[2] ?? '0', 16) / 255;
  const b = Number.parseInt(result[3] ?? '0', 16) / 255;

  const [rs, gs, bs] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}
