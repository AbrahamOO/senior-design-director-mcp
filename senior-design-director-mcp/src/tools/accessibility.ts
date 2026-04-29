/**
 * Accessibility Checker Tool
 * Provides WCAG 2.2 AA compliance guidance and validation for web and mobile
 * WCAG 2.2 published October 2023 — supersedes WCAG 2.1
 * Mobile: Apple Accessibility / Android Accessibility / WCAG 2.2 2.5.8
 */

import { AccessibilityReport, Platform } from '../types/index.js';

type Issue = AccessibilityReport['issues'][number];

function checkColors(colors: { foreground: string; background: string }[]): { issues: Issue[]; penalty: number } {
  const issues: Issue[] = [];
  let penalty = 0;
  for (const { foreground, background } of colors) {
    const contrast = calculateContrast(foreground, background);
    if (contrast < 4.5) {
      issues.push({
        severity: 'critical',
        type: 'Color Contrast',
        description: `Contrast ratio ${contrast.toFixed(2)}:1 between ${foreground} and ${background} fails WCAG 2.2 AA (requires 4.5:1) — criterion 1.4.3`,
        recommendation: 'Increase contrast by darkening text or lightening background. Use WebAIM Contrast Checker for validation.'
      });
      penalty += 15;
    } else if (contrast < 7) {
      issues.push({
        severity: 'moderate',
        type: 'Color Contrast',
        description: `Contrast ratio ${contrast.toFixed(2)}:1 passes AA but fails AAA (requires 7:1)`,
        recommendation: 'Consider increasing contrast for enhanced readability, especially for vision-impaired users.'
      });
      penalty += 5;
    }
  }
  return { issues, penalty };
}

function checkHeadings(headings: string[]): { issues: Issue[]; penalty: number } {
  const issues: Issue[] = [];
  let penalty = 0;
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = Number.parseInt(heading.replace('h', ''), 10);
    if (level > previousLevel + 1 && previousLevel !== 0) {
      issues.push({
        severity: 'serious',
        type: 'Heading Hierarchy',
        description: `Heading jumps from h${previousLevel} to h${level} (position ${index + 1})`,
        recommendation: 'Never skip heading levels. Go from h1→h2→h3 in sequence. Use CSS for visual sizing, not heading levels.'
      });
      penalty += 10;
    }
    if (level === 1 && index > 0) {
      issues.push({
        severity: 'moderate',
        type: 'Heading Hierarchy',
        description: 'Multiple h1 elements detected',
        recommendation: 'Use only one h1 per page (typically the main title). Use h2-h6 for subsections.'
      });
      penalty += 5;
    }
    previousLevel = level;
  });
  return { issues, penalty };
}

function checkSemanticHTML(html: string): { issues: Issue[]; penalty: number } {
  const lower = html.toLowerCase();
  const issues: Issue[] = [];
  let penalty = 0;

  if (!lower.includes('<main')) {
    issues.push({ severity: 'moderate', type: 'Semantic HTML', description: 'Missing <main> landmark element', recommendation: 'Wrap main content in <main> element for screen reader navigation.' });
    penalty += 5;
  }
  if (!lower.includes('<nav')) {
    issues.push({ severity: 'minor', type: 'Semantic HTML', description: 'Missing <nav> landmark element', recommendation: 'Wrap navigation in <nav> element for screen reader users.' });
    penalty += 3;
  }
  if (lower.includes('onclick=') && !lower.includes('role=')) {
    issues.push({ severity: 'serious', type: 'Semantic HTML', description: 'Interactive elements without proper roles — fails WCAG 2.2 criterion 4.1.2', recommendation: 'If using div/span with onclick, add role="button" and ensure keyboard accessibility.' });
    penalty += 10;
  }
  return { issues, penalty };
}

function checkTouchTargets(
  isIOS: boolean, isAndroid: boolean, unit: string, minTarget: number,
  touchTargetSize?: number, minimumTapSpacing?: number
): { issues: Issue[]; penalty: number } {
  const issues: Issue[] = [];
  let penalty = 0;
  const authority = isIOS ? 'Apple HIG' : 'Material Design 3 / WCAG 2.2 2.5.8';

  if (touchTargetSize !== undefined && touchTargetSize < minTarget) {
    issues.push({
      severity: 'critical',
      type: 'Touch Target Size',
      description: `Touch target is ${touchTargetSize}${unit} — below the ${minTarget}${unit} minimum required by ${authority}.`,
      recommendation: `All tappable elements must have a minimum hit area of ${minTarget}×${minTarget}${unit}. Use padding to extend the target beyond the visual boundary without affecting layout.`
    });
    penalty += 20;
  } else if (touchTargetSize !== undefined && touchTargetSize < minTarget + 4) {
    issues.push({
      severity: 'moderate',
      type: 'Touch Target Size',
      description: `Touch target ${touchTargetSize}${unit} meets the minimum but recommended size is ${minTarget + 4}${unit}+ for comfortable use.`,
      recommendation: `Aim for ${minTarget + 4}–56${unit} touch targets, especially for primary actions and navigation items.`
    });
    penalty += 5;
  }

  if (minimumTapSpacing !== undefined && minimumTapSpacing < 8) {
    issues.push({
      severity: 'serious',
      type: 'Touch Target Spacing',
      description: `Gap between touch targets is ${minimumTapSpacing}${unit} — too small, increases accidental activation risk.`,
      recommendation: `Maintain at least 8${unit} between adjacent tappable elements. For destructive actions (delete, log out), use 16${unit}+ of separation.`
    });
    penalty += 10;
  }

  return { issues, penalty };
}

function checkTypographyScaling(isIOS: boolean, isAndroid: boolean, dynamicTypeSupport?: boolean): { issues: Issue[]; penalty: number } {
  const issues: Issue[] = [];
  let penalty = 0;

  if (isIOS && dynamicTypeSupport === false) {
    issues.push({
      severity: 'serious',
      type: 'Dynamic Type Support',
      description: 'App does not support iOS Dynamic Type — fails Apple Accessibility guidelines and excludes users with vision impairments.',
      recommendation: 'Use UIFont.preferredFont(forTextStyle:) and .adjustsFontForContentSizeCategory = true (UIKit), or .font(.body) with dynamic type support (SwiftUI). Never use fixed pt font sizes without Dynamic Type scaling.'
    });
    penalty += 15;
  }

  if (isAndroid && dynamicTypeSupport === false) {
    issues.push({
      severity: 'serious',
      type: 'Font Scale Support',
      description: 'App uses px/dp for font sizes instead of sp — ignores user font scale setting in Android accessibility.',
      recommendation: 'Use sp (scale-independent pixels) for ALL text sizes. Never use dp or px for typography. Test with font scale 0.85×, 1.0×, 1.15×, 1.3×, 2.0×.'
    });
    penalty += 15;
  }

  return { issues, penalty };
}

function checkScreenReaderLabels(isIOS: boolean, screenReaderLabels?: boolean): { issues: Issue[]; penalty: number } {
  if (screenReaderLabels !== false) return { issues: [], penalty: 0 };

  if (isIOS) {
    return {
      issues: [{
        severity: 'critical',
        type: 'VoiceOver Labels',
        description: 'Interactive elements missing VoiceOver accessibility labels — blind users cannot navigate the app.',
        recommendation: 'Every tappable element must have .accessibilityLabel (what it is) and .accessibilityHint (what happens on tap) in SwiftUI/UIKit. Icon-only buttons MUST have labels. Test by enabling VoiceOver (triple-click side button) and navigating the entire screen.'
      }],
      penalty: 20
    };
  }

  return {
    issues: [{
      severity: 'critical',
      type: 'TalkBack Labels',
      description: 'Interactive elements missing TalkBack content descriptions — blind users cannot navigate the app.',
      recommendation: 'Every tappable View needs contentDescription (Compose: semantics { contentDescription = "..." }). ImageButtons must have contentDescription. Test by enabling TalkBack and swiping through all elements on every screen.'
    }],
    penalty: 20
  };
}

function checkReduceMotionSupport(isIOS: boolean, reduceMotionSupport?: boolean): { issues: Issue[]; penalty: number } {
  if (reduceMotionSupport !== false) return { issues: [], penalty: 0 };

  if (isIOS) {
    return {
      issues: [{
        severity: 'serious',
        type: 'Reduce Motion',
        description: 'App ignores iOS Reduce Motion setting — causes vestibular disorder symptoms for motion-sensitive users.',
        recommendation: String.raw`Check UIAccessibility.isReduceMotionEnabled before running animations. In SwiftUI, use @Environment(\.accessibilityReduceMotion). Replace entrance/exit animations with fade (opacity) instead of translate or scale. Never autoplay looping animations without a Reduce Motion alternative.`
      }],
      penalty: 10
    };
  }

  return {
    issues: [{
      severity: 'serious',
      type: 'Reduce Motion',
      description: 'App ignores Android "Remove animations" developer setting and Accessibility > Animation Control.',
      recommendation: 'Check animator duration scale via Settings.Global.ANIMATOR_DURATION_SCALE. Use ValueAnimator.areAnimatorsEnabled() in Jetpack Compose or AnimationUtils. Provide a no-motion code path for all screen transitions and micro-interactions.'
    }],
    penalty: 10
  };
}

function checkOledBackground(oledBackground?: string): { issues: Issue[]; penalty: number } {
  if (!oledBackground) return { issues: [], penalty: 0 };
  const lum = getLuminance(oledBackground);
  if (lum >= 0.005 || lum === 0) return { issues: [], penalty: 0 };

  return {
    issues: [{
      severity: 'minor',
      type: 'OLED Pure Black',
      description: `Background color ${oledBackground} is near-pure black — OLED displays show halation/blooming around bright text on absolute black.`,
      recommendation: 'Use #0A0A0A–#121212 instead of #000000 for dark backgrounds on OLED. This also reduces eye strain in dark environments and matches Material Design 3 dark mode surface color.'
    }],
    penalty: 3
  };
}

function checkMobileAccessibility(options: {
  platform: Platform;
  touchTargetSize?: number;
  dynamicTypeSupport?: boolean;
  reduceMotionSupport?: boolean;
  screenReaderLabels?: boolean;
  oledBackground?: string;
  minimumTapSpacing?: number;
}): { issues: Issue[]; penalty: number } {
  const isIOS = options.platform === 'mobile-ios' || options.platform === 'both';
  const isAndroid = options.platform === 'mobile-android' || options.platform === 'both';
  const unit = isAndroid && !isIOS ? 'dp' : 'pt';
  const minTarget = isAndroid && !isIOS ? 48 : 44;

  const results = [
    checkTouchTargets(isIOS, isAndroid, unit, minTarget, options.touchTargetSize, options.minimumTapSpacing),
    checkTypographyScaling(isIOS, isAndroid, options.dynamicTypeSupport),
    checkScreenReaderLabels(isIOS, options.screenReaderLabels),
    checkReduceMotionSupport(isIOS, options.reduceMotionSupport),
    checkOledBackground(options.oledBackground),
  ];

  return {
    issues: results.flatMap(r => r.issues),
    penalty: results.reduce((sum, r) => sum + r.penalty, 0),
  };
}

export function checkAccessibility(options: {
  platform?: Platform;
  colors?: { foreground: string; background: string }[];
  semanticHTML?: string;
  formLabels?: boolean;
  headingHierarchy?: string[];
  ariaLabels?: boolean;
  keyboardNav?: boolean;
  // Mobile-specific options
  touchTargetSize?: number;
  dynamicTypeSupport?: boolean;
  reduceMotionSupport?: boolean;
  screenReaderLabels?: boolean;
  oledBackground?: string;
  minimumTapSpacing?: number;
}): {
  success: boolean;
  message: string;
  report?: AccessibilityReport;
} {
  const issues: Issue[] = [];
  let score = 100;

  if (options.colors) {
    const r = checkColors(options.colors);
    issues.push(...r.issues);
    score -= r.penalty;
  }

  if (options.headingHierarchy) {
    const r = checkHeadings(options.headingHierarchy);
    issues.push(...r.issues);
    score -= r.penalty;
  }

  if (options.formLabels === false) {
    issues.push({ severity: 'critical', type: 'Form Accessibility', description: 'Form inputs missing associated labels — fails WCAG 2.2 criterion 3.3.2', recommendation: 'Every input must have a <label> element with for="" attribute matching input id. Never rely solely on placeholder text.' });
    score -= 20;
  }

  if (options.ariaLabels === false) {
    issues.push({ severity: 'serious', type: 'ARIA Labels', description: 'Interactive elements missing ARIA labels — fails WCAG 2.2 criterion 4.1.2', recommendation: 'Add aria-label to icon buttons, aria-describedby to form fields with hints, aria-live for dynamic content.' });
    score -= 10;
  }

  if (options.keyboardNav === false) {
    issues.push({ severity: 'critical', type: 'Keyboard Navigation', description: 'Interactive elements not keyboard accessible — fails WCAG 2.2 criterion 2.1.1', recommendation: 'Ensure all interactive elements are focusable with Tab. Use tabindex="0" for custom controls. Never use tabindex > 0.' });
    score -= 20;
  }

  if (options.semanticHTML) {
    const r = checkSemanticHTML(options.semanticHTML);
    issues.push(...r.issues);
    score -= r.penalty;
  }

  const isMobile = options.platform && options.platform !== 'web';
  if (isMobile) {
    const r = checkMobileAccessibility({
      platform: options.platform as Platform,
      touchTargetSize: options.touchTargetSize,
      dynamicTypeSupport: options.dynamicTypeSupport,
      reduceMotionSupport: options.reduceMotionSupport,
      screenReaderLabels: options.screenReaderLabels,
      oledBackground: options.oledBackground,
      minimumTapSpacing: options.minimumTapSpacing,
    });
    issues.push(...r.issues);
    score -= r.penalty;
  }

  const wcagCompliance = {
    level: (score >= 95 ? 'AAA' : score >= 85 ? 'AA' : 'A') as 'A' | 'AA' | 'AAA',
    passes: generatePassList(issues),
    failures: generateFailureList(issues)
  };

  const report: AccessibilityReport = { score: Math.max(0, score), issues, wcagCompliance };

  return {
    success: true,
    message: `Accessibility check complete. Score: ${report.score}/100. WCAG 2.2 ${wcagCompliance.level} compliance.`,
    report
  };
}

function calculateContrast(foreground: string, background: string): number {
  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  return Math.round(ratio * 100) / 100;
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

function generatePassList(issues: AccessibilityReport['issues']): string[] {
  const passes = [
    'Proper semantic HTML structure',
    'Keyboard navigation support',
    'ARIA labels on interactive elements',
    'Color contrast meets WCAG 2.2 AA',
    'Form labels properly associated',
    'Heading hierarchy maintained',
    'Focus indicators visible',
    'Alt text on images'
  ];

  return passes.filter(pass =>
    !issues.some(issue => pass.toLowerCase().includes(issue.type.toLowerCase()))
  );
}

function generateFailureList(issues: AccessibilityReport['issues']): string[] {
  return issues
    .filter(issue => issue.severity === 'critical' || issue.severity === 'serious')
    .map(issue => `${issue.type}: ${issue.description}`);
}

export function getAccessibilityChecklist(): {
  success: boolean;
  wcagVersion: string;
  checklist: {
    category: string;
    items: { check: string; wcagCriterion: string; priority: 'must' | 'should' | 'recommended' }[];
  }[];
} {
  return {
    success: true,
    wcagVersion: '2.2 (October 2023)',
    checklist: [
      {
        category: 'Semantic HTML',
        items: [
          { check: 'Use <nav> for navigation, <main> for main content, <header>, <footer>, <article>, <section>', wcagCriterion: '1.3.1 Info and Relationships', priority: 'must' },
          { check: 'Single h1 per page, proper h1→h2→h3 hierarchy (no skipping)', wcagCriterion: '1.3.1 Info and Relationships', priority: 'must' },
          { check: 'Use <button> for buttons, <a> for links (not interchangeable)', wcagCriterion: '4.1.2 Name, Role, Value', priority: 'must' },
          { check: 'Add lang="en" to <html> element', wcagCriterion: '3.1.1 Language of Page', priority: 'must' }
        ]
      },
      {
        category: 'Color & Contrast',
        items: [
          { check: 'Text has 4.5:1 contrast minimum (normal text)', wcagCriterion: '1.4.3 Contrast (Minimum)', priority: 'must' },
          { check: 'Large text (18px+ or 14px+ bold) has 3:1 contrast minimum', wcagCriterion: '1.4.3 Contrast (Minimum)', priority: 'must' },
          { check: 'Never rely on color alone for meaning (use icons, text, patterns)', wcagCriterion: '1.4.1 Use of Color', priority: 'must' },
          { check: 'UI components and graphics have 3:1 contrast against adjacent colors', wcagCriterion: '1.4.11 Non-text Contrast', priority: 'must' }
        ]
      },
      {
        category: 'Keyboard Navigation',
        items: [
          { check: 'All interactive elements focusable with Tab key', wcagCriterion: '2.1.1 Keyboard', priority: 'must' },
          { check: 'Logical Tab order follows visual flow', wcagCriterion: '2.4.3 Focus Order', priority: 'must' },
          { check: 'Visible focus indicators on all interactive elements (upgraded to AA in 2.2)', wcagCriterion: '2.4.7 Focus Visible', priority: 'must' },
          { check: 'No keyboard traps (can Tab in and out of all elements)', wcagCriterion: '2.1.2 No Keyboard Trap', priority: 'must' },
          { check: 'Skip to main content link for keyboard users', wcagCriterion: '2.4.1 Bypass Blocks', priority: 'should' }
        ]
      },
      {
        category: 'Focus Appearance (WCAG 2.2 New)',
        items: [
          { check: 'Focus indicator area ≥ perimeter of component × 2px (minimum focus ring size)', wcagCriterion: '2.4.11 Focus Appearance (Minimum) — NEW in 2.2', priority: 'must' },
          { check: 'Focus indicator has 3:1 contrast ratio against adjacent unfocused color', wcagCriterion: '2.4.11 Focus Appearance (Minimum) — NEW in 2.2', priority: 'must' },
          { check: 'Focus indicator is not obscured by other content (sticky headers, overlays)', wcagCriterion: '2.4.12 Focus Not Obscured (Minimum) — NEW in 2.2', priority: 'must' },
          { check: 'Enhanced: focus indicator encloses the component and has 4.5:1 contrast', wcagCriterion: '2.4.13 Focus Appearance (Enhanced) — AAA', priority: 'recommended' }
        ]
      },
      {
        category: 'Forms',
        items: [
          { check: 'Every input has associated <label> (not just placeholder)', wcagCriterion: '3.3.2 Labels or Instructions', priority: 'must' },
          { check: 'Error messages clearly identify which field has error', wcagCriterion: '3.3.1 Error Identification', priority: 'must' },
          { check: 'Error messages suggest how to fix the problem', wcagCriterion: '3.3.3 Error Suggestion', priority: 'should' },
          { check: 'Required fields marked with * and aria-required="true"', wcagCriterion: '3.3.2 Labels or Instructions', priority: 'must' },
          { check: 'Use autocomplete attributes for common fields (name, email, etc)', wcagCriterion: '1.3.5 Identify Input Purpose', priority: 'should' },
          { check: 'Info previously entered in same session is auto-populated or selectable (no re-typing)', wcagCriterion: '3.3.7 Redundant Entry — NEW in 2.2', priority: 'must' },
          { check: 'Authentication does not require cognitive function test (CAPTCHA) unless alternative provided', wcagCriterion: '3.3.8 Accessible Authentication (Minimum) — NEW in 2.2', priority: 'must' }
        ]
      },
      {
        category: 'Images & Media',
        items: [
          { check: 'Meaningful images have descriptive alt text', wcagCriterion: '1.1.1 Non-text Content', priority: 'must' },
          { check: 'Decorative images use alt="" or role="presentation"', wcagCriterion: '1.1.1 Non-text Content', priority: 'must' },
          { check: 'Videos have captions for deaf/hard of hearing', wcagCriterion: '1.2.2 Captions (Prerecorded)', priority: 'must' },
          { check: 'Auto-playing media has pause/stop control', wcagCriterion: '1.4.2 Audio Control', priority: 'must' }
        ]
      },
      {
        category: 'ARIA & Dynamic Content',
        items: [
          { check: 'Icon-only buttons have aria-label', wcagCriterion: '4.1.2 Name, Role, Value', priority: 'must' },
          { check: 'Form fields with hints use aria-describedby', wcagCriterion: '1.3.1 Info and Relationships', priority: 'should' },
          { check: 'Dynamic content updates use aria-live for announcements', wcagCriterion: '4.1.3 Status Messages', priority: 'should' },
          { check: 'Modal dialogs trap focus and return focus on close', wcagCriterion: '2.4.3 Focus Order', priority: 'must' },
          { check: 'Expandable sections use aria-expanded', wcagCriterion: '4.1.2 Name, Role, Value', priority: 'should' }
        ]
      },
      {
        category: 'Pointer & Touch (WCAG 2.2 Updated)',
        items: [
          { check: 'Touch targets minimum 24×24px (WCAG 2.2 AA minimum) — aim for 44×44px as best practice', wcagCriterion: '2.5.8 Target Size (Minimum) — NEW in 2.2', priority: 'must' },
          { check: 'All drag-and-drop functionality has a single-pointer alternative (click/tap)', wcagCriterion: '2.5.7 Dragging Movements — NEW in 2.2', priority: 'must' },
          { check: 'Touch targets have sufficient spacing to prevent accidental activation', wcagCriterion: '2.5.8 Target Size (Minimum)', priority: 'should' },
          { check: 'All functionality operable with single pointer (no multi-point gestures required)', wcagCriterion: '2.5.1 Pointer Gestures', priority: 'must' }
        ]
      },
      {
        category: 'Motion & Animation',
        items: [
          { check: 'Respect prefers-reduced-motion media query — stop or reduce all animations', wcagCriterion: '2.3.3 Animation from Interactions', priority: 'must' },
          { check: 'No auto-playing animations that last > 5 seconds without pause control', wcagCriterion: '2.2.2 Pause, Stop, Hide', priority: 'must' },
          { check: 'No flashing content (more than 3 flashes per second)', wcagCriterion: '2.3.1 Three Flashes or Below Threshold', priority: 'must' },
          { check: 'GSAP/Webflow animations wrap in matchMedia("prefers-reduced-motion: no-preference")', wcagCriterion: '2.3.3 Animation from Interactions', priority: 'must' }
        ]
      },
      {
        category: 'Navigation & Consistency (WCAG 2.2 New)',
        items: [
          { check: 'Content reflows without horizontal scrolling at 320px width', wcagCriterion: '1.4.10 Reflow', priority: 'must' },
          { check: 'Text can be zoomed to 200% without loss of functionality', wcagCriterion: '1.4.4 Resize Text', priority: 'must' },
          { check: 'Help mechanisms (chat, contact info) appear in consistent location across pages', wcagCriterion: '3.2.6 Consistent Help — NEW in 2.2', priority: 'must' },
          { check: 'Form inputs use appropriate input types (email, tel, number)', wcagCriterion: '1.3.5 Identify Input Purpose', priority: 'should' }
        ]
      },
      {
        category: 'Mobile App Accessibility (iOS & Android)',
        items: [
          { check: 'Touch targets minimum 44×44pt (iOS HIG) / 48×48dp (Android Material) — never smaller', wcagCriterion: 'WCAG 2.2 2.5.8 Target Size + Apple HIG + Material Design 3', priority: 'must' },
          { check: 'At least 8pt/8dp spacing between adjacent touch targets to prevent accidental taps', wcagCriterion: 'WCAG 2.2 2.5.8 + Material Design 3 spacing guidelines', priority: 'must' },
          { check: 'iOS: Use UIFont.preferredFont(forTextStyle:) / SwiftUI .font(.body) — supports Dynamic Type', wcagCriterion: 'Apple Accessibility — Dynamic Type (WCAG 1.4.4 equivalent)', priority: 'must' },
          { check: 'Android: Use sp units for ALL font sizes — never dp or px for typography', wcagCriterion: 'Android Accessibility — Font Scaling (WCAG 1.4.4 equivalent)', priority: 'must' },
          { check: 'iOS: Every interactive element has .accessibilityLabel + .accessibilityHint in SwiftUI/UIKit', wcagCriterion: 'Apple VoiceOver — WCAG 4.1.2 Name, Role, Value', priority: 'must' },
          { check: 'Android: Every interactive View has contentDescription or semantic role in Compose', wcagCriterion: 'Android TalkBack — WCAG 4.1.2 Name, Role, Value', priority: 'must' },
          { check: 'iOS: Check UIAccessibility.isReduceMotionEnabled — replace translate/scale animations with fade', wcagCriterion: 'Apple Accessibility — Reduce Motion (WCAG 2.3.3 Animation)', priority: 'must' },
          { check: 'Android: Check ValueAnimator.areAnimatorsEnabled() — provide no-motion code path for all transitions', wcagCriterion: 'Android Accessibility — Animation Scale (WCAG 2.3.3 Animation)', priority: 'must' },
          { check: 'Test entire app with VoiceOver (iOS: triple-click side button) — every screen, every state', wcagCriterion: 'Apple VoiceOver end-to-end validation', priority: 'must' },
          { check: 'Test entire app with TalkBack (Android: Volume Up+Down or 3-finger swipe) — every screen, every state', wcagCriterion: 'Android TalkBack end-to-end validation', priority: 'must' },
          { check: 'Use native OS components (UIButton, UITableView, Material Components) — they are accessible by default', wcagCriterion: 'Apple HIG + Material Design 3 — accessibility built-in', priority: 'should' },
          { check: 'Custom drawn controls use .accessibilityActivate() / semantics { onClick() } to expose tap gesture', wcagCriterion: 'Apple + Android custom accessibility action patterns', priority: 'must' },
          { check: 'Dynamic content updates announced via UIAccessibility.post(.announcement) (iOS) / accessibilityLiveRegion (Android)', wcagCriterion: 'WCAG 4.1.3 Status Messages', priority: 'should' },
          { check: 'Large Content Viewer: elements under 44pt support UILargeContentViewerItem (iOS 13+)', wcagCriterion: 'Apple Large Content Viewer — Accessibility Size category support', priority: 'recommended' },
          { check: 'Dark background: use #0A0A0A–#121212 instead of #000000 to prevent OLED halation/blooming', wcagCriterion: 'Material Design 3 dark mode surface + eye strain reduction', priority: 'recommended' },
          { check: 'Safe areas: all interactive content accounts for notch, Dynamic Island, home indicator insets', wcagCriterion: 'Apple HIG — Safe Area Layout Guides', priority: 'must' },
          { check: 'Test with extra-large accessibility font size — ensure no text truncation or layout overflow', wcagCriterion: 'WCAG 1.4.4 Resize Text — mobile equivalent', priority: 'must' }
        ]
      }
    ]
  };
}
