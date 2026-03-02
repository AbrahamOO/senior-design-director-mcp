/**
 * Accessibility Checker Tool
 * Provides WCAG 2.2 AA compliance guidance and validation
 * WCAG 2.2 published October 2023 — supersedes WCAG 2.1
 */

import { AccessibilityReport } from '../types/index.js';

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

export function checkAccessibility(options: {
  colors?: { foreground: string; background: string }[];
  semanticHTML?: string;
  formLabels?: boolean;
  headingHierarchy?: string[];
  ariaLabels?: boolean;
  keyboardNav?: boolean;
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
      }
    ]
  };
}
