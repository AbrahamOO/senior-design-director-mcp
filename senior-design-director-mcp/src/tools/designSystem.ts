/**
 * Design System Generator Tool
 * Creates comprehensive design systems for web and premium mobile app projects
 */

import { DesignSystem, MobileTokens, Platform, ProjectBrief } from '../types/index.js';
import { briefStorage } from '../utils/storage.js';
import { generateColorPalette } from './colorPalette.js';

function isMobilePlatform(p: Platform) {
  return p === 'mobile-ios' || p === 'mobile-android' || p === 'mobile-cross-platform';
}

function pickByPlatform<T>(platform: Platform, ios: T, android: T, cross: T): T {
  if (platform === 'mobile-ios' || platform === 'both') return ios;
  if (platform === 'mobile-android') return android;
  return cross;
}

export function createDesignSystem(projectName: string): {
  success: boolean;
  message: string;
  designSystem?: DesignSystem;
} {
  const brief = briefStorage.get(projectName);
  if (!brief) {
    return { success: false, message: `No project brief found for "${projectName}". Complete project discovery first.` };
  }

  const paletteResult = generateColorPalette(projectName);
  if (!paletteResult.palette) {
    return { success: false, message: 'Failed to generate color palette for design system.' };
  }

  const platform: Platform = brief.TECHNICAL?.PLATFORM ?? 'web';
  const mobile = isMobilePlatform(platform);
  const both = platform === 'both';

  const designSystem: DesignSystem = {
    platform,
    typography: generateTypographySystem(brief, platform),
    spacing: generateSpacingSystem(platform),
    motion: generateMotionSystem(brief, platform),
    colors: paletteResult.palette,
    ...(!mobile || both ? { breakpoints: generateBreakpoints() } : {}),
    ...(mobile || both ? { mobileTokens: generateMobileTokens(platform, brief) } : {}),
  };

  const platformLabel = platform === 'both' ? 'web + mobile' : platform.replace('mobile-', '');
  return {
    success: true,
    message: `Design system created for "${projectName}" (${platformLabel}). Includes typography, spacing, ${mobile ? 'safe area tokens, native motion,' : 'breakpoints,'} and color palette.`,
    designSystem,
  };
}

export function generateComponentLibrary(projectName: string): {
  success: boolean;
  message: string;
  components?: { name: string; description: string; variants: string[]; states: string[]; specifications: Record<string, string> }[];
} {
  const brief = briefStorage.get(projectName);
  if (!brief) {
    return { success: false, message: `No project brief found for "${projectName}".` };
  }

  const platform: Platform = brief.TECHNICAL?.PLATFORM ?? 'web';
  const mobileOnly = isMobilePlatform(platform);
  const web = buildWebComponents(brief);
  const mob = buildMobileComponents(platform);

  let components: ComponentSpec[];
  if (mobileOnly) {
    components = mob;
  } else if (platform === 'both') {
    components = [...web, ...mob];
  } else {
    components = web;
  }

  return {
    success: true,
    message: `Component library generated for "${projectName}" (${platform}) with ${components.length} components.`,
    components,
  };
}


function generateTypographySystem(brief: ProjectBrief, platform: Platform) {
  const tones = new Set(brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase()));
  const isIOS = platform === 'mobile-ios';
  const isAndroid = platform === 'mobile-android';
  const isCross = platform === 'mobile-cross-platform';

  let displayFont = { family: 'Inter, system-ui, sans-serif', weights: [700, 800, 900], usage: 'Hero headlines, section titles, major headings' };
  let bodyFont = { family: 'Inter, system-ui, sans-serif', weights: [400, 500, 600], usage: 'Body text, paragraphs, descriptions' };
  let accentFont: { family: string; weights: number[]; usage: string } | undefined;

  if (isIOS) {
    displayFont = { family: '-apple-system, "SF Pro Display", "SF Pro Text", sans-serif', weights: [700, 800], usage: 'Large titles, navigation bar titles, prominent headings' };
    bodyFont = { family: '-apple-system, "SF Pro Text", sans-serif', weights: [400, 500, 600], usage: 'Body, footnotes, captions — all body copy' };
  } else if (isAndroid) {
    displayFont = { family: '"Google Sans", Roboto, sans-serif', weights: [500, 700], usage: 'Headlines, display styles, prominent text' };
    bodyFont = { family: 'Roboto, sans-serif', weights: [400, 500], usage: 'Body, label, overline styles' };
  } else if (isCross) {
    displayFont = { family: 'System (SF Pro on iOS, Roboto on Android), Inter fallback', weights: [700, 800], usage: 'Headings and prominent display text' };
    bodyFont = { family: 'System (SF Pro on iOS, Roboto on Android), Inter fallback', weights: [400, 500, 600], usage: 'All body copy, labels, captions' };
  } else if (tones.has('sophisticated & premium') || tones.has('professional & authoritative')) {
    displayFont = { family: 'Playfair Display, Georgia, serif', weights: [700, 800, 900], usage: 'Hero headlines, elegant section titles' };
    bodyFont = { family: 'Inter, system-ui, sans-serif', weights: [400, 500, 600], usage: 'All body content for maximum readability' };
  } else if (tones.has('bold & rebellious') || tones.has('playful & approachable')) {
    displayFont = { family: 'Space Grotesk, sans-serif', weights: [700, 800], usage: 'Bold, geometric headlines with personality' };
    accentFont = { family: 'Caveat, cursive', weights: [400, 700], usage: 'Sparingly for emotional moments, handwritten feel' };
  } else if (tones.has('innovative & futuristic')) {
    displayFont = { family: 'Outfit, sans-serif', weights: [600, 700, 800], usage: 'Modern, clean headlines' };
  }

  const scale = buildTypeScale(platform);
  return { displayFont, bodyFont, accentFont, scale };
}

function buildTypeScale(platform: Platform) {
  if (platform === 'mobile-ios') {
    return [
      { size: '11pt', lineHeight: '1.36', useCase: 'Caption 2 — timestamps, secondary metadata' },
      { size: '12pt', lineHeight: '1.33', useCase: 'Caption 1 — labels, minor annotations' },
      { size: '13pt', lineHeight: '1.38', useCase: 'Footnote — supporting context, legal copy' },
      { size: '15pt', lineHeight: '1.33', useCase: 'Subheadline — secondary titles, subtitles' },
      { size: '17pt', lineHeight: '1.29', useCase: 'Body — default reading text (UIFont.preferredFont)' },
      { size: '20pt', lineHeight: '1.25', useCase: 'Title 3 — section headings in lists' },
      { size: '22pt', lineHeight: '1.27', useCase: 'Title 2 — secondary screen titles' },
      { size: '28pt', lineHeight: '1.21', useCase: 'Title 1 — primary screen titles' },
      { size: '34pt', lineHeight: '1.20', useCase: 'Large Title — navigation bar large title' },
    ];
  }
  if (platform === 'mobile-android') {
    return [
      { size: '11sp', lineHeight: '1.45', useCase: 'Label Small — compact captions, overlines' },
      { size: '12sp', lineHeight: '1.33', useCase: 'Label Medium — chip text, button labels (compact)' },
      { size: '14sp', lineHeight: '1.43', useCase: 'Label Large / Body Small — action labels, annotations' },
      { size: '16sp', lineHeight: '1.50', useCase: 'Body Medium — default reading text' },
      { size: '16sp', lineHeight: '1.50', useCase: 'Body Large — prominent body, descriptions' },
      { size: '24sp', lineHeight: '1.33', useCase: 'Headline Small — card headers' },
      { size: '28sp', lineHeight: '1.28', useCase: 'Headline Medium — screen section headers' },
      { size: '32sp', lineHeight: '1.25', useCase: 'Headline Large — major section titles' },
      { size: '45sp', lineHeight: '1.15', useCase: 'Display Small — hero or feature text' },
      { size: '57sp', lineHeight: '1.12', useCase: 'Display Large — marketing hero, splash screens' },
    ];
  }
  if (platform === 'mobile-cross-platform') {
    return [
      { size: '11px', lineHeight: '1.36', useCase: 'Caption — timestamps, minor labels' },
      { size: '13px', lineHeight: '1.38', useCase: 'Footnote / Label Small' },
      { size: '15px', lineHeight: '1.40', useCase: 'Subheadline / Body Small' },
      { size: '17px', lineHeight: '1.47', useCase: 'Body — primary reading text' },
      { size: '20px', lineHeight: '1.30', useCase: 'Title 3 / Headline Small — card/section titles' },
      { size: '24px', lineHeight: '1.25', useCase: 'Title 2 / Headline Medium — screen subtitles' },
      { size: '28px', lineHeight: '1.21', useCase: 'Title 1 / Headline Large — primary screen titles' },
      { size: '34px', lineHeight: '1.20', useCase: 'Large Title / Display Small — hero and feature headings' },
    ];
  }
  // Web — Major Third scale, rem units
  return [
    { size: '0.75rem', lineHeight: '1.2', useCase: 'Caption, metadata, fine print (12px)' },
    { size: '0.875rem', lineHeight: '1.4', useCase: 'Small text, labels, secondary info (14px)' },
    { size: '1rem', lineHeight: '1.6', useCase: 'Body text, paragraphs (16px)' },
    { size: '1.125rem', lineHeight: '1.6', useCase: 'Large body text, lead paragraphs (18px)' },
    { size: '1.5rem', lineHeight: '1.4', useCase: 'H3, subsection titles (24px)' },
    { size: '2rem', lineHeight: '1.3', useCase: 'H2, section anchors (32px)' },
    { size: '3rem', lineHeight: '1.2', useCase: 'H1 tablet, major headings (48px)' },
    { size: '4rem', lineHeight: '1.1', useCase: 'Hero headlines desktop (64px)' },
    { size: 'clamp(3rem, 8vw, 6rem)', lineHeight: '1.1', useCase: 'Responsive hero (48–96px)' },
  ];
}


function generateSpacingSystem(platform: Platform) {
  if (platform === 'mobile-ios') {
    return { baseUnit: 8, unit: 'pt', scale: [4, 8, 12, 16, 20, 24, 32, 44, 48, 64, 88, 96] };
  }
  if (platform === 'mobile-android') {
    return { baseUnit: 8, unit: 'dp', scale: [4, 8, 12, 16, 24, 32, 48, 56, 64, 72, 96, 128] };
  }
  if (platform === 'mobile-cross-platform') {
    return { baseUnit: 8, unit: 'px (logical)', scale: [4, 8, 12, 16, 20, 24, 32, 44, 48, 64, 88, 96] };
  }
  return { baseUnit: 8, unit: 'px', scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256] };
}


function generateBreakpoints() {
  return [
    { name: 'mobile-small', minWidth: 320, maxWidth: 479, columns: 1 },
    { name: 'mobile', minWidth: 480, maxWidth: 767, columns: 1 },
    { name: 'tablet', minWidth: 768, maxWidth: 1023, columns: 2 },
    { name: 'desktop', minWidth: 1024, maxWidth: 1199, columns: 3 },
    { name: 'desktop-large', minWidth: 1200, maxWidth: 1599, columns: 4 },
    { name: 'ultra-wide', minWidth: 1600, columns: 4 },
  ];
}


function generateMobileTokens(platform: Platform, brief: ProjectBrief): MobileTokens {
  const tones = new Set(brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase()));

  if (platform === 'mobile-ios' || platform === 'both') {
    return buildIOSTokens(tones);
  }
  if (platform === 'mobile-android') {
    return buildAndroidTokens(tones);
  }
  return buildCrossPlatformTokens();
}

function buildIOSTokens(tones: Set<string>): MobileTokens {
  const isCalmOrPremium = tones.has('calm & trustworthy') || tones.has('sophisticated & premium');
  const isPlayfulOrEnergetic = tones.has('playful & approachable') || tones.has('energetic & inspiring');
  let springDamping = 0.75;
  if (isCalmOrPremium) springDamping = 0.85;
  else if (isPlayfulOrEnergetic) springDamping = 0.6;
  const springStiffness = tones.has('energetic & inspiring') ? 300 : 200;

  return {
    unitSystem: 'pt',
    safeAreas: { statusBar: 59, homeIndicator: 34, navigationBar: 44, tabBar: 83 },
    touchTarget: { minimum: 44, recommended: 48, unit: 'pt' },
    screenSizes: [
      { name: 'iPhone SE (3rd gen)', width: 375, height: 667, scale: 2 },
      { name: 'iPhone 14 / 15', width: 390, height: 844, scale: 3 },
      { name: 'iPhone 14 Plus / 15 Plus', width: 428, height: 926, scale: 3 },
      { name: 'iPhone 14 Pro / 15 Pro', width: 393, height: 852, scale: 3 },
      { name: 'iPhone 14 Pro Max / 15 Pro Max', width: 430, height: 932, scale: 3 },
      { name: 'iPad mini (6th gen)', width: 744, height: 1133, scale: 2 },
      { name: 'iPad (10th gen)', width: 820, height: 1180, scale: 2 },
      { name: 'iPad Pro 11"', width: 834, height: 1194, scale: 2 },
      { name: 'iPad Pro 12.9"', width: 1024, height: 1366, scale: 2 },
    ],
    nativeMotion: {
      springDamping,
      springStiffness,
      springMass: 1,
      standardDuration: '0.35s',
      emphasizedDuration: '0.5s',
      decelerateEasing: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
      accelerateEasing: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    },
  };
}

function buildAndroidTokens(tones: Set<string>): MobileTokens {
  const emphasizedDuration = (tones.has('calm & trustworthy') || tones.has('sophisticated & premium')) ? '500ms' : '400ms';
  return {
    unitSystem: 'dp',
    safeAreas: { statusBar: 24, homeIndicator: 0, navigationBar: 56, tabBar: 80 },
    touchTarget: { minimum: 48, recommended: 56, unit: 'dp' },
    screenSizes: [
      { name: 'Compact (small phones)', width: 360, height: 640, scale: 2 },
      { name: 'Standard Android', width: 390, height: 844, scale: 2.75 },
      { name: 'Pixel 7', width: 412, height: 915, scale: 2.625 },
      { name: 'Samsung Galaxy S23', width: 360, height: 780, scale: 3 },
      { name: 'Large phone (>6.5")', width: 480, height: 1040, scale: 2.75 },
      { name: 'Android tablet (medium)', width: 600, height: 960, scale: 2 },
      { name: 'Android tablet (large)', width: 840, height: 1280, scale: 2 },
    ],
    nativeMotion: {
      standardDuration: '300ms',
      emphasizedDuration,
      decelerateEasing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
      accelerateEasing: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    },
  };
}

function buildCrossPlatformTokens(): MobileTokens {
  return {
    unitSystem: 'px',
    safeAreas: { statusBar: 44, homeIndicator: 34, navigationBar: 44, tabBar: 83 },
    touchTarget: { minimum: 44, recommended: 48, unit: 'px (logical)' },
    screenSizes: [
      { name: 'Small iPhone (SE)', width: 375, height: 667, scale: 2 },
      { name: 'Standard iPhone', width: 390, height: 844, scale: 3 },
      { name: 'Large iPhone', width: 430, height: 932, scale: 3 },
      { name: 'Compact Android', width: 360, height: 800, scale: 2.75 },
      { name: 'Standard Android', width: 412, height: 915, scale: 2.625 },
    ],
    nativeMotion: {
      springDamping: 0.75,
      springStiffness: 200,
      springMass: 1,
      standardDuration: '350ms',
      emphasizedDuration: '500ms',
      decelerateEasing: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
      accelerateEasing: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    },
  };
}


function generateMotionSystem(brief: ProjectBrief, platform: Platform) {
  const tones = new Set(brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE.map(t => t.toLowerCase()));

  if (platform === 'mobile-ios' || platform === 'both') {
    return {
      easings: {
        'spring-default': 'spring(damping: 0.75, stiffness: 200, mass: 1) — use UISpringTimingParameters',
        'spring-snappy': 'spring(damping: 0.65, stiffness: 280, mass: 1) — energetic interactions',
        'spring-gentle': 'spring(damping: 0.9, stiffness: 150, mass: 1) — content reveals',
        'ease-out-ios': 'cubic-bezier(0.0, 0.0, 0.2, 1.0) — decelerate (standard screen transitions)',
        'ease-in-ios': 'cubic-bezier(0.4, 0.0, 1.0, 1.0) — accelerate (dismissals)',
      },
      durations: { micro: '0.15s', short: '0.25s', standard: '0.35s', emphasized: '0.5s' },
    };
  }

  if (platform === 'mobile-android') {
    return {
      easings: {
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1.0)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
        'standard': 'cubic-bezier(0.2, 0, 0, 1.0)',
        'standard-decelerate': 'cubic-bezier(0, 0, 0, 1)',
        'standard-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
      },
      durations: { 'short-1': '50ms', 'short-2': '100ms', 'medium-1': '200ms', 'medium-2': '300ms', 'long-1': '450ms', 'long-2': '600ms' },
    };
  }

  // Web / cross-platform — tone-adjusted CSS easings
  const easings: Record<string, string> = {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
    'ease-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  };

  let durations: Record<string, string> = { micro: '150ms', short: '300ms', medium: '600ms', long: '1200ms' };

  if (tones.has('calm & trustworthy') || tones.has('sophisticated & premium')) {
    durations = { micro: '200ms', short: '400ms', medium: '800ms', long: '1500ms' };
  } else if (tones.has('energetic & inspiring') || tones.has('playful & approachable')) {
    durations = { micro: '120ms', short: '250ms', medium: '500ms', long: '1000ms' };
    easings['ease-out-back'] = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  return { easings, durations };
}


function buildWebComponents(brief: ProjectBrief): ComponentSpec[] {
  return [
    {
      name: 'Button',
      description: 'Primary interactive element for CTAs',
      variants: ['primary', 'secondary', 'tertiary', 'ghost'],
      states: ['default', 'hover', 'active', 'disabled', 'loading', 'focus'],
      specifications: {
        padding: '12px 24px (mobile) | 16px 32px (desktop)',
        'border-radius': '8px',
        'font-weight': '600',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'min-height': '44px (touch-friendly)',
        'hover-transform': 'scale(1.02)',
        'primary-bg': 'secondary color from palette',
        'primary-text': 'white or high-contrast',
      },
    },
    {
      name: 'Card',
      description: 'Content container for testimonials, case studies, features',
      variants: ['elevated', 'outlined', 'flat', 'image-header'],
      states: ['default', 'hover', 'active', 'focus'],
      specifications: {
        padding: '24px (mobile) | 32px (desktop)',
        'border-radius': '12px',
        background: 'white',
        'box-shadow': '0 1px 3px rgba(0,0,0,0.1)',
        'hover-shadow': '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'box-shadow 300ms, transform 300ms',
      },
    },
    {
      name: 'Hero Section',
      description: `Primary landing section with ${brief.CTA_STRATEGY.PRIMARY_CTA}`,
      variants: ['image-left', 'image-right', 'centered', 'full-bleed'],
      states: ['default', 'loading'],
      specifications: {
        'min-height': '600px (mobile) | 80vh (desktop)',
        padding: '48px 24px (mobile) | 96px 48px (desktop)',
        'headline-size': 'clamp(2.5rem, 8vw, 4.5rem)',
        'max-width': '1400px',
        'cta-prominence': 'Secondary brand color, 48px min-height',
      },
    },
    {
      name: 'Navigation',
      description: 'Main site navigation',
      variants: ['hamburger-mobile', 'horizontal-desktop', 'sticky'],
      states: ['default', 'scrolled', 'menu-open', 'menu-closed'],
      specifications: {
        height: '64px (mobile) | 80px (desktop)',
        background: 'white with backdrop-blur on scroll',
        'box-shadow-scrolled': '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 300ms',
        'z-index': '100',
      },
    },
    {
      name: 'Form Input',
      description: 'Text input fields for contact forms',
      variants: ['text', 'email', 'textarea', 'select'],
      states: ['default', 'focus', 'error', 'disabled', 'success'],
      specifications: {
        height: '48px',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        'border-radius': '8px',
        'focus-border': 'secondary color',
        'focus-ring': '0 0 0 3px rgba(secondary, 0.1)',
        'error-border': '#ef4444',
        'font-size': '16px (prevents zoom on iOS)',
      },
    },
    {
      name: 'Testimonial',
      description: 'Customer testimonial display',
      variants: ['card', 'quote-large', 'carousel-item'],
      states: ['default', 'hover'],
      specifications: {
        padding: '32px',
        'quote-size': '1.125rem',
        'quote-style': 'italic',
        'author-image': '48px circle',
        'accent-color': 'accent color from palette',
        background: 'neutral background',
      },
    },
  ];
}


type ComponentSpec = { name: string; description: string; variants: string[]; states: string[]; specifications: Record<string, string> };

function buildMobileComponents(platform: Platform): ComponentSpec[] {
  return [
    mobileButton(platform),
    mobileTabBar(platform),
    mobileNavigationBar(platform),
    mobileBottomSheet(platform),
    mobileListRow(platform),
    mobileTextField(platform),
    mobileToast(platform),
    mobileFAB(platform),
    mobileImage(platform),
  ];
}

function mobileButton(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'UIButton / SwiftUI Button', 'Material Button', 'Pressable / TouchableOpacity');
  const haptic = isIOS ? 'UIImpactFeedbackGenerator (.medium) on tap' : 'HapticFeedbackManager.CONFIRM on tap';
  const loader = isIOS ? 'UIActivityIndicatorView (.medium)' : 'CircularProgressIndicator (20dp)';
  const radius = isAndroid ? '20dp (fully rounded for filled)' : '10pt (iOS default)';
  return {
    name,
    description: 'Native touch button — primary, secondary, and destructive variants',
    variants: ['filled', 'tonal', 'outlined', 'text', 'destructive'],
    states: ['default', 'pressed', 'disabled', 'loading'],
    specifications: {
      'min-height': `44${unit} (Apple HIG) / 48${isAndroid ? 'dp' : 'pt'} (Material)`,
      'min-width': `44${unit}`,
      'border-radius': radius,
      'haptic-feedback': haptic,
      'pressed-opacity': '0.6 (iOS) / scale(0.97) (Android)',
      'loading-indicator': loader,
      'disabled-opacity': '0.38 — matches platform convention',
    },
  };
}

function mobileTabBar(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'UITabBar', 'Material Navigation Bar', 'Bottom Tab Navigator');
  const height = isAndroid ? '80dp (including 8dp bottom padding)' : '49pt + 34pt home indicator = 83pt total';
  const activeIndicator = isAndroid
    ? 'Pill shape, 64dp × 32dp, filled with secondaryContainer color'
    : 'Selected tab tinted with primary brand color';
  const badge = isIOS ? 'UIBadgeValue — red circle, 8pt min size' : 'Material badge — 6dp dot or 16dp with count';
  const haptic = isIOS ? 'UISelectionFeedbackGenerator on tab switch' : 'None (Android default)';
  return {
    name,
    description: 'Primary app navigation — bottom of screen',
    variants: ['icon-only', 'icon-and-label', 'badge'],
    states: ['default', 'active', 'badge-count'],
    specifications: {
      height,
      'icon-size': `24${unit}`,
      'active-indicator': activeIndicator,
      badge,
      haptic,
      'safe-area': 'Must respect bottomInset from safeAreaInsets — never overlap home indicator',
    },
  };
}

function mobileNavigationBar(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'UINavigationBar / NavigationStack', 'Top App Bar', 'Stack Navigator Header');
  const height = isAndroid ? '64dp (prominent) | 56dp (standard)' : '44pt (standard) | 96pt (large title)';
  const largeTitleScroll = isIOS
    ? 'Collapses from 96pt to 44pt on scroll; use .navigationBarTitleDisplayMode(.large)'
    : 'N/A — use CollapsingToolbarLayout for similar effect';
  const backButton = isIOS
    ? 'SF Symbol chevron.backward + previous screen title (truncated to 12 chars)'
    : 'NavigateUp icon (←), no title';
  const blur = isIOS
    ? '.ultraThinMaterial vibrancy on scroll (iOS 15+)'
    : 'surfaceContainer color with elevation overlay';
  return {
    name,
    description: 'Screen-level navigation bar — back button, title, actions',
    variants: ['standard', 'large-title (iOS)', 'center-aligned', 'compact'],
    states: ['default', 'scrolled (large title collapses)', 'modal'],
    specifications: {
      height,
      'large-title-scroll': largeTitleScroll,
      'back-button': backButton,
      actions: `Max 2 icon buttons (right side), 44${unit} touch target each`,
      'blur-background': blur,
      'safe-area': 'Must account for statusBar height (44pt / 24dp) — already handled by NavigationBar/AppBar in native',
    },
  };
}

function mobileBottomSheet(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'Bottom Sheet / UISheetPresentationController', 'Modal Bottom Sheet', 'Bottom Sheet Modal');
  const radius = isAndroid ? '28dp top corners (Material spec)' : '10pt (system default, matches detent presentation)';
  const detents = isIOS
    ? 'Use .medium and .large presentationDetents — available iOS 15+'
    : '50% and 90% peekHeight for BottomSheetDialogFragment';
  return {
    name,
    description: 'Contextual overlay from screen bottom — settings, filters, pickers',
    variants: ['small (25% height)', 'medium (50%)', 'large (90%)', 'full-screen'],
    states: ['hidden', 'partial', 'expanded', 'dismissing'],
    specifications: {
      'drag-handle': `36${unit} × 4${unit} pill, centered, 8${unit} from top edge`,
      'corner-radius': radius,
      detents,
      backdrop: 'scrimColor at 32–50% opacity, tap to dismiss',
      'dismiss-gesture': 'Drag down past 30% velocity threshold OR tap backdrop',
      'keyboard-avoid': 'Sheet must shift up when soft keyboard appears — KeyboardAvoidingView (RN) or windowSoftInputMode=adjustResize (Android)',
      'safe-area': 'Content must respect bottomInset (home indicator) — add padding inside sheet',
    },
  };
}

function mobileListRow(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'UITableView / List Row', 'List Item / LazyColumn', 'FlatList Row');
  const separator = isIOS ? '0.5pt line at 16pt inset (UITableView separator style)' : '1dp divider at 16dp inset (optional in M3)';
  const swipe = isIOS ? 'UISwipeActionsConfiguration — max 3 actions, destructive in red' : 'SwipeToDismiss in Jetpack Compose or ItemTouchHelper';
  const pressed = isIOS ? 'UIColor.systemGray5 highlight' : 'ripple effect, bounded to row';
  return {
    name,
    description: 'Standard list cell for content-dense screens',
    variants: ['simple (icon + label)', 'two-line', 'three-line', 'trailing-action'],
    states: ['default', 'pressed', 'swipe-actions (iOS)', 'selected'],
    specifications: {
      height: `44${unit} minimum, 56${unit} for two-line, 72${unit} for three-line + image`,
      'leading-icon': `40${unit} × 40${unit} image or 24${unit} icon with 16${unit} padding`,
      separator,
      'swipe-actions': swipe,
      'pressed-state': pressed,
      selection: 'Checkmark (iOS) or filled checkbox (Android) at trailing edge',
    },
  };
}

function mobileTextField(platform: Platform): ComponentSpec {
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'UITextField / UITextView', 'Material TextField', 'TextInput');
  const radius = isAndroid ? '4dp (outlined) | 4dp top only (filled)' : '10pt rounded rect border';
  const label = isAndroid
    ? 'Floating label — 16sp resting, 12sp floating (Material spec)'
    : 'Static label above field (HIG standard)';
  return {
    name,
    description: 'Text entry field — single-line and multiline',
    variants: ['outlined', 'filled (Android)', 'underlined', 'search'],
    states: ['default', 'focused', 'error', 'disabled', 'filled'],
    specifications: {
      height: `48${unit} (single line) | dynamic (multiline)`,
      'border-radius': radius,
      label,
      'font-size': `17${isAndroid ? 'sp' : 'pt'} — matches system body text, prevents zoom`,
      'error-state': 'Red border/underline + error message below at 12sp/pt',
      'return-key': 'Set returnKeyType/imeOptions to match context (done, next, search, go)',
      'keyboard-type': 'Always use specific keyboardType (.emailAddress, .phonePad, .numberPad) — reduces friction',
      'secure-entry': 'isSecureTextEntry / inputType=textPassword — never roll your own',
    },
  };
}

function mobileToast(platform: Platform): ComponentSpec {
  const isAndroid = platform === 'mobile-android';
  const unit = isAndroid ? 'dp' : 'pt';
  const name = pickByPlatform(platform, 'Toast / UIAlertController', 'Snackbar / Toast', 'Toast / Alert');
  const position = isAndroid
    ? 'Bottom of screen, 16dp from edge and bottom navigation'
    : 'Top of screen below navigation bar (iOS 16+) or bottom';
  const a11y = isAndroid
    ? 'Set accessibilityLiveRegion=polite on Android'
    : 'Use UIAccessibility.post(.announcement) on iOS';
  return {
    name,
    description: 'Transient non-blocking feedback messages',
    variants: ['success', 'error', 'warning', 'info', 'action (with button)'],
    states: ['appearing', 'visible', 'dismissing'],
    specifications: {
      position,
      height: `48–68${unit}`,
      'corner-radius': `8${unit}`,
      'auto-dismiss': '3s (info/success) | 5s (error with action) | user dismiss only (critical error)',
      'safe-area': 'Offset by bottomInset (home indicator) on floating versions',
      'max-width': 'Full width on phones; max 400dp on tablets',
      'action-button': 'Text button, right-aligned, same height as bar, max 1 action',
      accessibility: a11y,
    },
  };
}

function mobileFAB(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  let name: string;
  if (isAndroid) {
    name = 'FloatingActionButton (FAB)';
  } else if (isIOS) {
    name = 'N/A — use prominent UIButton in toolbar';
  } else {
    name = 'FAB / Primary Action Button';
  }
  return {
    name,
    description: 'Primary screen-level action — used sparingly, one per screen maximum',
    variants: ['small (40dp)', 'standard (56dp)', 'large (96dp)', 'extended (with label)'],
    states: ['default', 'pressed', 'hidden (scroll down)', 'visible (scroll up)'],
    specifications: {
      size: '56dp (standard) — do not use small FAB for primary actions',
      'corner-radius': '16dp (standard) | 28dp (large)',
      'icon-size': '24dp centered',
      position: '16dp from bottom, 16dp from right — above navigation bar',
      'safe-area': 'Must clear bottom navigation bar height (80dp) + 16dp margin',
      'scroll-behavior': 'Hide on scroll down (translateY animation), show on scroll up',
      'extended-fab': 'Use when action label aids discoverability — collapses to icon on scroll',
      elevation: '6dp default, 12dp pressed',
    },
  };
}

function mobileImage(platform: Platform): ComponentSpec {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const isAndroid = platform === 'mobile-android';
  const name = pickByPlatform(platform, 'UIImage / AsyncImage', 'AsyncImage / Coil', 'Image / FastImage');
  let loading: string;
  if (isIOS) {
    loading = 'Use AsyncImage (SwiftUI) or SDWebImage/Kingfisher (UIKit)';
  } else if (isAndroid) {
    loading = 'Use Coil with placeholder/error drawables';
  } else {
    loading = 'Use react-native-fast-image with priority and cache settings';
  }
  return {
    name,
    description: 'Remote image loading with loading and error states',
    variants: ['thumbnail', 'hero', 'avatar', 'gallery-grid'],
    states: ['loading (shimmer)', 'loaded', 'error (fallback icon)', 'empty'],
    specifications: {
      placeholder: 'Shimmer skeleton at exact final dimensions — prevents layout shift',
      loading,
      'aspect-ratio': 'Always set explicit width × height to prevent reflow on load',
      'error-fallback': 'Brand-consistent placeholder icon, same size as image slot',
      'image-densities': 'Provide @1x, @2x, @3x assets (iOS) | mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi (Android)',
      webp: 'Use WebP for all non-transparent assets — 25–35% smaller than PNG/JPEG',
      animation: 'Fade-in on load: 150ms opacity 0→1, do not scale/translate (too busy)',
    },
  };
}
