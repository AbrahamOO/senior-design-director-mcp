/**
 * Content Architecture Tool
 * Creates narrative-driven content structures and clinical user flow maps
 */

import { ContentArchitecture, ProjectBrief } from '../types/index.js';
import { briefStorage } from '../utils/storage.js';

export function generateContentArchitecture(projectName: string): {
  success: boolean;
  message: string;
  architecture?: ContentArchitecture;
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Complete project discovery first.`
    };
  }

  const photographyStyle = brief.IMAGERY.PHOTOGRAPHY_STYLE || 'brand';
  const treatment = brief.IMAGERY.TREATMENT || 'professional';
  const primaryTone = brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE[0] || 'Interest and curiosity';
  const secondaryCTAs = brief.CTA_STRATEGY.SECONDARY_CTAS ?? [];
  const proofCategories = brief.CONTENT.PROOF_POINTS
    ? Object.keys(brief.CONTENT.PROOF_POINTS).join(', ')
    : 'testimonials, case studies';

  const narrative = {
    actOne: {
      title: 'Act I: Exposition (First Viewport)',
      scrollRange: '0-300px scroll',
      purpose: `Answer "Who is ${brief.PROJECT_NAME} and what do they do?"`,
      visualStrategy: `Bold typography dominates, ${photographyStyle} photography creates personality`,
      emotionalTone: primaryTone,
      sections: [
        `Hero headline: Transform visitor state from "${brief.NARRATIVE.BEFORE_STATE || 'problem'}" to possibility`,
        `Subheadline: ${brief.PROJECT_DESCRIPTION}`,
        `Visual element: ${treatment} imagery establishing brand`,
        `Implied CTA: Scroll to discover more`
      ]
    },

    actTwo: {
      title: 'Act II: Transformation (Mid-page)',
      scrollRange: '300-1500px scroll',
      purpose: `Answer "Why should I believe ${brief.PROJECT_NAME} can help me?"`,
      visualStrategy: `Proof points (${proofCategories}), demonstrate transformation`,
      emotionalTone: 'Trust, confidence, alignment with values',
      sections: generateActTwoSections(brief)
    },

    actThree: {
      title: 'Act III: Resolution (Final Viewport)',
      scrollRange: '1500px to bottom',
      purpose: 'Answer "What\'s the next step? How do I engage?"',
      visualStrategy: `Clear CTA hierarchy, ${brief.CTA_STRATEGY.PRIMARY_CTA} prominently featured`,
      emotionalTone: 'Inspiration, possibility, agency, excitement',
      sections: [
        `Primary CTA section: "${brief.CTA_STRATEGY.PRIMARY_CTA}" with outcome "${brief.CTA_STRATEGY.PRIMARY_CTA_OUTCOME || 'next step'}"`,
        secondaryCTAs.length > 0
          ? `Secondary options: ${secondaryCTAs.join(', ')}`
          : 'Secondary options: Learn more, View work',
        `Final reinforcement: After state - "${brief.NARRATIVE.AFTER_STATE || 'transformed outcome'}"`,
        `Footer with navigation, social proof, contact info`
      ]
    }
  };

  const pageStructure = (brief.CONTENT.PAGE_STRUCTURE ?? []).map((page, index) => {
    const keyMessage = brief.CONTENT.KEY_MESSAGES[index] ?? brief.CONTENT.KEY_MESSAGES[0] ?? '';
    return {
      pageName: page,
      priority: index + 1,
      keyMessage,
      sections: generatePageSections(page, brief),
      primaryCTA: determinePrimaryCTAForPage(page, brief)
    };
  });

  const architecture: ContentArchitecture = {
    narrative,
    pageStructure
  };

  return {
    success: true,
    message: `Content architecture generated for "${projectName}" using three-act story structure.`,
    architecture
  };
}

function generateActTwoSections(brief: ProjectBrief): string[] {
  const sections: string[] = [];
  const secondaryCTAs = brief.CTA_STRATEGY.SECONDARY_CTAS ?? [];

  if (brief.NARRATIVE.TRANSFORMATION_MOMENT) {
    sections.push(`Inflection point: "${brief.NARRATIVE.TRANSFORMATION_MOMENT}"`);
  }

  if (brief.CONTENT.KEY_MESSAGES.length > 0) {
    sections.push('Key messages section:');
    brief.CONTENT.KEY_MESSAGES.forEach((msg, i) => {
      sections.push(`  ${i + 1}. ${msg}`);
    });
  }

  if (brief.CONTENT.PROOF_POINTS && Object.keys(brief.CONTENT.PROOF_POINTS).length > 0) {
    sections.push('Proof points:');
    Object.entries(brief.CONTENT.PROOF_POINTS).forEach(([category, points]) => {
      sections.push(`  ${category}: ${points.join(', ')}`);
    });
  }

  if (brief.BRAND_POSITIONING.UNIQUE_POSITION) {
    sections.push(`Differentiation: "${brief.BRAND_POSITIONING.UNIQUE_POSITION}"`);
  }

  if (brief.BRAND_POSITIONING.PHILOSOPHY) {
    sections.push(`Philosophy: "${brief.BRAND_POSITIONING.PHILOSOPHY}"`);
  }

  sections.push(
    secondaryCTAs.length > 0
      ? `Secondary CTA: ${secondaryCTAs[0]}`
      : 'Secondary CTA: Learn more about our approach'
  );

  return sections;
}

function generatePageSections(pageName: string, brief: ProjectBrief): string[] {
  const lowerPage = pageName.toLowerCase();

  if (lowerPage.includes('hero') || lowerPage.includes('home')) {
    return [
      `Hero: ${brief.NARRATIVE.BEFORE_STATE || 'visitor pain point'} → transformation possibility`,
      brief.BRAND_POSITIONING.UNIQUE_POSITION
        ? `Value proposition: ${brief.BRAND_POSITIONING.UNIQUE_POSITION}`
        : 'Value proposition: your unique advantage',
      `Social proof preview: Featured testimonials/logos`,
      `Primary CTA: ${brief.CTA_STRATEGY.PRIMARY_CTA}`
    ];
  }

  if (lowerPage.includes('about') || lowerPage.includes('story')) {
    return [
      brief.NARRATIVE.TRANSFORMATION_MOMENT
        ? `Personal/brand story: ${brief.NARRATIVE.TRANSFORMATION_MOMENT}`
        : 'Personal/brand story: founding moment and mission',
      brief.BRAND_POSITIONING.PHILOSOPHY
        ? `Philosophy: ${brief.BRAND_POSITIONING.PHILOSOPHY}`
        : 'Philosophy: what you believe about your industry',
      `Team/founder imagery: ${brief.IMAGERY.PHOTOGRAPHY_STYLE || 'authentic brand photography'}`,
      `Mission alignment with visitor values`
    ];
  }

  if (lowerPage.includes('service') || lowerPage.includes('offering')) {
    return [
      brief.PRIMARY_AUDIENCE.PAIN_POINTS
        ? `Service overview aligned to visitor pain points: ${brief.PRIMARY_AUDIENCE.PAIN_POINTS}`
        : 'Service overview aligned to visitor pain points',
      brief.PRIMARY_AUDIENCE.OBJECTIONS
        ? `Address objections: ${brief.PRIMARY_AUDIENCE.OBJECTIONS}`
        : 'Address common objections',
      brief.NARRATIVE.AFTER_STATE
        ? `Transformation promise: ${brief.NARRATIVE.AFTER_STATE}`
        : 'Transformation promise: the result they can expect',
      `Process/methodology explanation`,
      `CTA: ${brief.CTA_STRATEGY.PRIMARY_CTA}`
    ];
  }

  if (lowerPage.includes('work') || lowerPage.includes('case') || lowerPage.includes('portfolio')) {
    return [
      `Case study showcases with measurable results`,
      brief.NARRATIVE.SUCCESS_METRIC
        ? `Success metric: ${brief.NARRATIVE.SUCCESS_METRIC}`
        : 'Success metrics: measurable outcomes achieved',
      `Before/after transformations`,
      `Client testimonials in context`,
      `CTA: See how we can help you`
    ];
  }

  if (lowerPage.includes('testimonial')) {
    return [
      brief.PRIMARY_AUDIENCE.FEAR
        ? `Customer testimonials addressing ${brief.PRIMARY_AUDIENCE.FEAR}`
        : 'Customer testimonials addressing common fears',
      `Diverse proof points from different customer types`,
      `Specific outcomes achieved`,
      `Video testimonials if available`
    ];
  }

  if (lowerPage.includes('faq')) {
    return [
      brief.PRIMARY_AUDIENCE.OBJECTIONS
        ? `Address common objections: ${brief.PRIMARY_AUDIENCE.OBJECTIONS}`
        : 'Address common objections and questions',
      `Process questions`,
      `Pricing/value questions`,
      `Timeline and expectations`
    ];
  }

  if (lowerPage.includes('contact') || lowerPage.includes('cta')) {
    return [
      `Primary CTA: ${brief.CTA_STRATEGY.PRIMARY_CTA}`,
      brief.CTA_STRATEGY.PRIMARY_CTA_OUTCOME
        ? `Expected outcome: ${brief.CTA_STRATEGY.PRIMARY_CTA_OUTCOME}`
        : 'Expected outcome: clearly stated next step',
      `Final objection handling`,
      `Multiple contact options`,
      `Trust indicators (privacy, security, response time)`
    ];
  }

  return [
    `Section content based on: ${pageName}`,
    `Aligned with brand positioning`,
    `Clear CTA path`
  ];
}

function determinePrimaryCTAForPage(pageName: string, brief: ProjectBrief): string {
  const lowerPage = pageName.toLowerCase();
  const secondaryCTAs = brief.CTA_STRATEGY.SECONDARY_CTAS ?? [];

  if (lowerPage.includes('contact') || lowerPage.includes('cta')) {
    return brief.CTA_STRATEGY.PRIMARY_CTA;
  }

  if (lowerPage.includes('service') || lowerPage.includes('offering')) {
    return brief.CTA_STRATEGY.PRIMARY_CTA;
  }

  if (lowerPage.includes('work') || lowerPage.includes('case')) {
    return secondaryCTAs[0] ?? 'View more work';
  }

  if (lowerPage.includes('about')) {
    return secondaryCTAs[1] ?? secondaryCTAs[0] ?? 'Learn about our approach';
  }

  return brief.CTA_STRATEGY.PRIMARY_CTA;
}

export function generateCopyGuidelines(projectName: string): {
  success: boolean;
  message: string;
  guidelines?: {
    tone: string[];
    principles: string[];
    examples: { wrong: string; right: string; reason: string }[];
  };
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}".`
    };
  }

  const visualPersonality = brief.EMOTIONAL_DIRECTION.VISUAL_PERSONALITY || 'Confident and intentional';
  const desiredPerception = brief.BRAND_POSITIONING.DESIRED_PERCEPTION || 'trusted expert';
  const objections = brief.PRIMARY_AUDIENCE.OBJECTIONS || 'common doubts';
  const audienceRole = brief.PRIMARY_AUDIENCE.ROLE || 'your ideal customer';
  const beforeState = brief.NARRATIVE.BEFORE_STATE || 'their current struggle';
  const afterState = brief.NARRATIVE.AFTER_STATE || 'their desired outcome';
  const philosophy = brief.BRAND_POSITIONING.PHILOSOPHY || 'your core belief';
  const primaryCTA = brief.CTA_STRATEGY.PRIMARY_CTA;
  const experienceProof = brief.CONTENT.PROOF_POINTS?.experience?.[0] ?? '20+ years transforming Fortune 500s and game-changing startups';

  const guidelines = {
    tone: [
      visualPersonality,
      ...brief.EMOTIONAL_DIRECTION.EMOTIONAL_TONE,
      `Aligned with: ${desiredPerception}`
    ],

    principles: [
      'Lead with transformation, not features',
      'Use active voice and power verbs (Disrupt, Challenge, Create, Transform)',
      'Show, don\'t tell - use specific proof points',
      `Address implicit objections: ${objections}`,
      'Create narrative tension then provide resolution',
      'Balance 40% proof, 40% emotional, 20% inspiration',
      'Use specificity over generality',
      'Conversational tone with contractions (don\'t, won\'t, can\'t)',
      `Reference target audience directly: ${audienceRole}`
    ],

    examples: [
      {
        wrong: 'We offer great design services',
        right: `We transform ${audienceRole} from ${beforeState} to ${afterState}`,
        reason: 'Focus on outcome and transformation, not generic features'
      },
      {
        wrong: 'We have a lot of experience',
        right: experienceProof,
        reason: 'Use specific, verifiable proof instead of vague claims'
      },
      {
        wrong: 'Learn more',
        right: primaryCTA,
        reason: 'Action-oriented, specific CTAs perform better'
      },
      {
        wrong: 'Our philosophy is important to us',
        right: philosophy,
        reason: 'State your philosophy directly and confidently'
      }
    ]
  };

  return {
    success: true,
    message: `Copy guidelines generated for "${projectName}" based on brand positioning and audience.`,
    guidelines
  };
}

export function generateUserFlow(
  projectName: string,
  journeyGoal?: string
): { success: boolean; message: string; flow?: string } {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Complete project discovery first.`
    };
  }

  const platform = brief.TECHNICAL.PLATFORM;
  const isMobile = platform === 'mobile-ios' || platform === 'mobile-android' || platform === 'mobile-cross-platform';
  const isBoth = platform === 'both';
  const isIOS = platform === 'mobile-ios';
  const isAndroid = platform === 'mobile-android';

  const goal = journeyGoal ?? brief.CTA_STRATEGY.PRIMARY_CTA;
  const successCondition = brief.CTA_STRATEGY.PRIMARY_CTA_OUTCOME || 'User completes primary conversion action';
  const beforeState = brief.NARRATIVE.BEFORE_STATE || 'Unaware of solution';
  const afterState = brief.NARRATIVE.AFTER_STATE || 'Problem resolved';
  const objections = brief.PRIMARY_AUDIENCE.OBJECTIONS || 'none specified';
  const fears = brief.PRIMARY_AUDIENCE.FEAR || 'none specified';
  const painPoints = brief.PRIMARY_AUDIENCE.PAIN_POINTS || 'none specified';
  const industry = brief.INDUSTRY_CATEGORY;
  const audienceRole = brief.PRIMARY_AUDIENCE.ROLE;
  const successMetrics = brief.BUSINESS.SUCCESS_METRICS.join(', ') || 'conversion rate, engagement depth';

  const entryPoints = buildEntryPoints(brief, isMobile);
  const primaryJourney = buildPrimaryJourney(brief, isMobile, isIOS, isAndroid);
  const decisionForks = buildDecisionForks(brief, isMobile);
  const frictionInventory = buildFrictionInventory(brief, isMobile);
  const errorStates = buildErrorStates(brief, isMobile);
  const conversionCheckpoints = buildConversionCheckpoints(brief, isMobile);
  const navPattern = isMobile || isBoth ? buildMobileNavPattern(brief, isIOS, isAndroid) : '';
  const webNavPattern = !isMobile || isBoth ? buildWebNavPattern(brief) : '';

  const flow = `# User Flow — ${brief.PROJECT_NAME}
**Platform:** ${platform} | **Journey Goal:** ${goal}
**Success Condition:** ${successCondition}
**Audience:** ${audienceRole} | **Industry:** ${industry}

---

## 1. Entry Points

${entryPoints}

---

## 2. Primary Journey: "${beforeState}" → "${afterState}"

**Goal:** ${goal}
**Trigger:** User arrives with intent to solve: ${painPoints}
**Exit definition:** ${successCondition}

${primaryJourney}

---

## 3. Decision Forks

${decisionForks}

---

## 4. Friction Inventory

Every friction point reduces conversion probability. Address in order of severity.

${frictionInventory}

---

## 5. Error & Empty States

${errorStates}

---

## 6. Conversion Checkpoints

Measurement is not optional. Attach analytics events to every checkpoint.

${conversionCheckpoints}

**Business success metrics:** ${successMetrics}

---
${buildNavSections(navPattern, webNavPattern)}
## Design Directives

1. **Reduce steps, never add them** — Every additional state loses ~20% of users. Justify each step.
2. **Objection interception** — ${objections}. Address this before step 3.
3. **Fear neutralisation** — ${fears}. This must be resolved before the conversion step.
4. **Error prevention over error recovery** — Validate inline, never post-submission.
5. **Mobile-first tap targets** — All interactive elements ≥44pt iOS / 48dp Android regardless of visual size.
6. **Progress visibility** — Multi-step flows must show position (e.g. "Step 2 of 4").
7. **Zero dead ends** — Every error state has a clear recovery path. Every empty state has a fallback action.
`;

  return {
    success: true,
    message: `User flow generated for "${projectName}" — ${platform} platform, goal: "${goal}".`,
    flow
  };
}

function buildNavSections(mobileNav: string, webNav: string): string {
  const mobileSection = mobileNav ? `\n## 7. Mobile Navigation Pattern\n\n${mobileNav}\n\n---\n` : '';
  const webSectionNum = mobileNav ? '8' : '7';
  const webSection = webNav ? `\n## ${webSectionNum}. Web Navigation & URL Structure\n\n${webNav}\n\n---\n` : '';
  return mobileSection + webSection;
}

function buildEntryPoints(brief: ProjectBrief, isMobile: boolean): string {
  const rows: string[] = [];

  if (isMobile) {
    rows.push(
      '| # | Entry Channel | User Intent | Landing Screen | Cognitive State |',
      '|---|---|---|---|---|',
      `| 1 | App Store organic search | High intent — searching for ${brief.INDUSTRY_CATEGORY} solution | Onboarding S0 | Goal-directed |`,
      `| 2 | App Store featured / editorial | Discovery | Onboarding S0 | Exploratory |`,
      `| 3 | Social ad (paid) | Awareness — "${brief.NARRATIVE.BEFORE_STATE || 'problem-aware'}" | Onboarding S0 | Interrupted |`,
      `| 4 | Friend referral / share link | Socially motivated | Deep link → Core screen | Trusting |`,
      `| 5 | Push notification (re-engagement) | Lapsed user, specific prompt | Target screen | Habitual or lost |`,
      `| 6 | Email campaign | Warm lead, specific offer | Offer screen | Receptive |`
    );
  } else {
    const seoPriority = brief.TECHNICAL.SEO_PRIORITY;
    rows.push(
      '| # | Entry Channel | Traffic Type | Landing Page | User Intent Signal |',
      '|---|---|---|---|---|',
      seoPriority && seoPriority !== 'low'
        ? `| 1 | Organic search | High intent | Service/Product page | Searching "${brief.PRIMARY_AUDIENCE.PAIN_POINTS || 'solution keyword'}" |`
        : `| 1 | Organic search | Discovery | Home | Brand keyword search |`,
      `| 2 | Direct / type-in | Known brand | Home | Returning or referred |`,
      `| 3 | Social organic | Awareness | Blog / Story page | Content-first |`,
      `| 4 | Paid social (retargeting) | High intent | Landing page | Previously visited |`,
      `| 5 | Email campaign | Warm lead | Specific offer / CTA | Already engaged |`,
      `| 6 | Referral / partner link | Trusted handoff | Home or service | Pre-validated |`
    );
  }

  return rows.filter(Boolean).join('\n');
}

function buildPrimaryJourney(
  brief: ProjectBrief,
  isMobile: boolean,
  isIOS: boolean,
  isAndroid: boolean
): string {
  const primaryCTA = brief.CTA_STRATEGY.PRIMARY_CTA;
  const painPoints = brief.PRIMARY_AUDIENCE.PAIN_POINTS || 'their core problem';
  const uniquePos = brief.BRAND_POSITIONING.UNIQUE_POSITION || 'unique value proposition';
  const transformation = brief.NARRATIVE.TRANSFORMATION_MOMENT || 'value realisation moment';
  const afterState = brief.NARRATIVE.AFTER_STATE || 'goal achieved';
  const proofCategories = brief.CONTENT.PROOF_POINTS ? Object.keys(brief.CONTENT.PROOF_POINTS) : ['testimonials', 'results'];
  const proof = proofCategories.slice(0, 2).join(' + ');

  if (isMobile) {
    const unit = isIOS ? 'pt' : 'dp';
    return `| Step | State ID | Screen Name | User Question | Content / Interaction | Cognitive Load | Exit Trigger |
|---|---|---|---|---|---|---|
| 0 | S0 | Splash / Launch | "What is this?" | App icon, brand mark, loading indicator | Minimal | Auto-advance (1.5s) or tap |
| 1 | S1 | Onboarding 1 — Problem | "Is this for me?" | Pain point headline: "${painPoints}" | Low | Swipe / Next tap |
| 2 | S2 | Onboarding 2 — Solution | "How does it work?" | Solution statement + key differentiator: "${uniquePos}" | Low | Swipe / Next tap |
| 3 | S3 | Onboarding 3 — Proof | "Can I trust this?" | Social proof: ${proof} | Low | Swipe / Next tap |
| 4 | S4 | Sign Up / Account | "What do I need to give?" | Minimal form (email + password or OAuth) | Medium | Submit CTA |
| 5 | S5 | Permissions | "Why does it need access?" | Permission rationale (one per screen) | Medium | Allow / Skip |
| 6 | S6 | First Value Moment | "${transformation}" | Core feature revealed, immediate value | Low | Engage or explore |
| 7 | S7 | Core Loop | "Does this solve ${painPoints}?" | Primary feature, key interaction surface | Variable | Completion / save / share |
| 8 | S8 | ${primaryCTA} | "Am I ready to commit?" | Conversion screen — paywall / sign-up / purchase | High | ${primaryCTA} confirm |
| 9 | S9 | Post-Conversion | "${afterState}" | Confirmation, next steps, onboarding complete | Minimal | Home / core screen |

**Critical path:** S0 → S1 → S4 → S6 → S8 (minimum viable journey — 5 steps)
**Full onboarding path:** S0 → S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S9
**Minimum touch target across all screens:** 44${unit} (iOS HIG / WCAG 2.5.5)`;
  }

  return `| Step | State ID | Page / Section | User Question | Content Shown | Cognitive Load | Exit Trigger |
|---|---|---|---|---|---|---|
| 0 | S0 | Entry — Above Fold | "What is this? Is it for me?" | Hero headline addressing "${painPoints}", sub-headline, primary CTA visible | Low | Scroll or CTA click |
| 1 | S1 | Problem Validation | "Do they understand my situation?" | Pain point articulation — mirror "${painPoints}" precisely | Low | Scroll |
| 2 | S2 | Solution Introduction | "How does this work?" | Solution mechanism + differentiator: "${uniquePos}" | Medium | Scroll |
| 3 | S3 | Proof — Trust Layer | "Can I trust this?" | ${proof}, logos, results with specifics | Medium | Scroll |
| 4 | S4 | Transformation Moment | "${transformation}" | Before/after, case study hook, visual evidence | Low | Scroll |
| 5 | S5 | Philosophy / Why | "Do I align with their values?" | Brand belief, why this matters, deeper narrative | Low | Scroll or secondary CTA |
| 6 | S6 | Objection Handling | "But what about…?" | FAQ, objection-first copy, de-risking language | Medium | Scroll |
| 7 | S7 | Primary CTA | "Am I ready to act?" | ${primaryCTA} — clear, outcome-led, low-friction | High | CTA click |
| 8 | S8 | Conversion / Form | "What do I need to fill in?" | Minimal form — max 3 fields for first conversion | High | Submit |
| 9 | S9 | Confirmation | "${afterState}" | Success state, next step, expectation-setting | Minimal | Exit or next action |

**Critical path:** S0 → S7 → S8 → S9 (high-intent visitor — 4 states)
**Full journey:** S0 → S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S9
**Scroll depth target to reach S7:** approximately 1,800–2,200px (benchmark, adjust to content)`;
}

function buildDecisionForks(brief: ProjectBrief, isMobile: boolean): string {
  const objections = brief.PRIMARY_AUDIENCE.OBJECTIONS || 'price, trust, timing';
  const fears = brief.PRIMARY_AUDIENCE.FEAR || 'commitment, complexity';
  const secondaryCTAs = brief.CTA_STRATEGY.SECONDARY_CTAS ?? [];
  const secondaryCTA = secondaryCTAs[0] ?? 'Learn more';

  if (isMobile) {
    return `### Fork A — Onboarding completion vs. skip (S1–S3)
- **Swipe through all 3 screens** → Full context, higher conversion at S8
- **Tap "Skip" (if offered)** → Jump directly to S4 (sign-up). Risk: lower perceived value. Mitigation: do not offer Skip on screen S2 (solution).

### Fork B — Social auth vs. email sign-up (S4)
- **Social auth (Apple/Google)** → Fastest path, fewer fields. Preferred. Route to S5.
- **Email + password** → Slower path, higher intent signal. Route to S5 with email verification.
- **"Continue as guest" (if applicable)** → Deferred account creation. Route to S6, prompt account at S8 conversion.

### Fork C — Permission grant vs. deny (S5)
- **Permission granted** → Full feature set available at S6.
- **Permission denied** → Degrade gracefully. Never block core loop. Log denial for contextual re-prompt at high-value moment in S7.

### Fork D — Paywall / conversion (S8)
- **Converts** → S9 confirmation + onboarding complete.
- **Declines** → Free tier / trial (if available) or exit. Do not dead-end. Route to limited S7 with paywall surface present but not blocking.

**Rule:** Never show Fork A (skip) and Fork D (decline → exit) as the two primary options. The flow must always have a "yes-lite" path.`;
  }

  return `### Fork A — Intent level at S0 (Hero)
- **High intent (scrolls past 300px within 10s)** → Full journey S0→S9.
- **Low intent (bounces in <10s)** → Exit. Mitigation: exit-intent capture (email or content offer). Do not use popup before 30s dwell.
- **Direct CTA click at S0** → Skip S1–S6, route directly to S7. This user is pre-sold — honour it.

### Fork B — Objection trigger at S3 (Proof) or S6 (FAQ)
- **Objection: "${objections}"** → Route through S6 (objection-handling section). CTA at S6 re-introduces S7.
- **No objection** → S3 flows directly to S4 (transformation).

### Fork C — Fear trigger at S7 (CTA)
- **Fear: "${fears}"** → Micro-copy beneath the CTA must directly address this fear in ≤8 words. E.g., "No commitment. Cancel any time." Do not add a modal — address it inline.
- **No fear visible** → Direct conversion at S8.

### Fork D — Conversion form behaviour (S8)
- **Form completed + submitted** → S9 confirmation.
- **Form started but abandoned** → Trigger email recovery sequence within 1h (if email captured). Re-entry to S8 via email link.
- **Form not started** → Secondary CTA: "${secondaryCTA}". Route to lower-commitment path.

### Fork E — Return visitor (re-entry)
- **Previously visited, did not convert** → Land at S7 directly (skip S0–S6 re-read). Use persistent scroll position or session memory.
- **Previously converted** → Route to post-conversion state (account, dashboard, or content). Never show conversion CTA to existing customers.`;
}

function buildFrictionInventory(brief: ProjectBrief, isMobile: boolean): string {
  const objections = brief.PRIMARY_AUDIENCE.OBJECTIONS || 'trust, price';
  const fears = brief.PRIMARY_AUDIENCE.FEAR || 'commitment';

  const header = `| # | Location | Friction Type | Severity (1–5) | Root Cause | Mitigation |
|---|---|---|---|---|---|`;

  const rows: string[] = [];

  if (isMobile) {
    rows.push(
      `| 1 | S4 — Sign Up | Form fields | 4 | Every field is a reason to quit | Reduce to email + OAuth only. Password on second visit. |`,
      `| 2 | S5 — Permissions | Permission dialog | 3 | System dialog with no context | Always precede system dialog with in-app rationale screen |`,
      `| 3 | S8 — Paywall | Price visibility | 5 | Price without established value = rejection | Show value metrics (saves X time / costs Y less) immediately before price |`,
      `| 4 | S6 — Core loop | Feature discovery | 3 | Feature not obvious without instruction | Use contextual coach marks on first launch only. Remove after use. |`,
      `| 5 | S5 — Permissions | Permission denied UX | 4 | Dead end if permission is critical | Never block core loop. Degrade, re-prompt at high-value moment. |`,
      `| 6 | All | Load time | 4 | Slow launch = uninstall | Cold launch ≤400ms iOS / ≤500ms Android. Skeleton screens mandatory. |`,
      `| 7 | S4 | Trust | 3 | No social proof at sign-up decision | Add 1 social proof indicator (star rating, user count) to S4 screen |`
    );
  } else {
    rows.push(
      `| 1 | S8 — Form | Form length | 5 | Every additional field reduces completion ~10% | Maximum 3 fields. Use progressive disclosure for additional info. |`,
      `| 2 | S7 — CTA | Vague CTA copy | 4 | Generic CTA ("Submit") creates uncertainty | CTA must state outcome: "${brief.CTA_STRATEGY.PRIMARY_CTA}" |`,
      `| 3 | S0 — Hero | Load time | 5 | >3s LCP causes 40% abandonment | LCP ≤2.5s mandatory. Defer non-critical scripts. |`,
      `| 4 | S6 — FAQ | Objection not addressed | 4 | "${objections}" left unanswered creates doubt | Each objection gets a dedicated FAQ entry with specific, credible answer |`,
      `| 5 | S7 — CTA | Fear copy missing | 4 | "${fears}" not de-risked at point of decision | Add micro-copy ≤8 words beneath CTA addressing primary fear |`,
      `| 6 | S3 — Proof | Vague proof points | 3 | "Great results" without specifics is unconvincing | All proof points must include a number, a name, or both |`,
      `| 7 | S8 — Form | Trust gap at conversion | 4 | User ready to convert but no trust indicators visible | Add security badge, privacy statement, or testimonial adjacent to form |`,
      `| 8 | Mobile S0 | Hero not readable | 3 | Hero text too small or contrast insufficient | Min 16px body / 28px headline. Contrast ratio ≥4.5:1. |`
    );
  }

  return [header, ...rows].join('\n');
}

function buildErrorStates(brief: ProjectBrief, isMobile: boolean): string {
  const header = `| State | Trigger | Screen / Location | Empty State Treatment | Recovery Path |
|---|---|---|---|---|`;

  const rows: string[] = [];

  if (isMobile) {
    rows.push(
      `| No results | Search returns zero matches | Search screen | "No results for [query]. Try: [suggestion 1], [suggestion 2]" | Show related categories or trending content |`,
      `| Network error | API call fails | Any screen | Skeleton → "Couldn't load. Check connection." + Retry button | Retry (with exponential backoff). Cache last successful state offline. |`,
      `| Empty state — new user | User arrives at list/feed with no data | Core list screen | Illustration + "Get started by [first action]" with CTA button | Guided action to generate first content item |`,
      `| Auth failure | Sign-in credentials rejected | S4 — Sign Up/Login | Specific inline error: "Password incorrect — try again or reset" | Link to password reset (not generic error) |`,
      `| Permission denied | Critical permission blocked | S5 | "To use [feature], enable [permission] in Settings" + Settings deep-link button | Deep-link to Settings → App → Permissions |`,
      `| Paywall failure | Payment declined | S8 — Paywall | "Payment not completed. Check card details." | Retry payment / use different card / contact support |`,
      `| App crash recovery | App re-opens after crash | Any | Restore to exact last screen state. No "Something went wrong" without specifics. | Continue from last valid state |`
    );
  } else {
    rows.push(
      `| 404 Page | URL not found | /404 | Brand-consistent page: "Page not found." + search bar + 3 popular links | Offer site search + homepage link. No default browser 404. |`,
      `| Form validation | Required field empty or invalid | S8 — Form | Inline error beneath field: "[Field] is required" / "[Field] must be a valid email" | Auto-focus first error field. Never scroll to top. |`,
      `| Form submission failure | Server error on submit | S8 — Form | "Something went wrong. Your details are saved — try again." | Preserve form data. Retry button. No data loss. |`,
      `| No search results | Search returns zero matches | Site search | "No results for '[query]'. Try: [suggestion 1], [suggestion 2]" or show all content | Show popular/recommended content as fallback |`,
      `| Slow page load | LCP >4s | Any | Progressive skeleton screens. Content appears in priority order (headline → image → body). | Ensure LCP element is server-rendered, not JS-dependent |`,
      `| Empty CMS content | Page with no dynamic content | Blog/Cases index | "More coming soon. Sign up to be notified." + email capture | Email capture for waitlist / notification |`,
      `| Cookie/session expiry | Return visitor, session lost | Any | Restore scroll position if possible. For auth-gated pages: redirect to login with return URL. | Login → redirect to original destination |`
    );
  }

  return [header, ...rows].join('\n');
}

function buildConversionCheckpoints(brief: ProjectBrief, isMobile: boolean): string {
  const primaryCTA = brief.CTA_STRATEGY.PRIMARY_CTA;
  const conversionGoal = brief.BUSINESS.CONVERSION_GOAL || 'primary CTA completion';

  const header = `| # | Checkpoint | Metric | Target | Measurement Tool | Action if Below Target |
|---|---|---|---|---|---|`;

  const rows: string[] = [];

  if (isMobile) {
    rows.push(
      `| 1 | Install → Onboarding start (S0) | % users begin onboarding | ≥80% | Firebase Analytics / Amplitude | A/B test first screen messaging |`,
      `| 2 | Onboarding completion (S3 → S4) | Onboarding completion rate | ≥60% | Same | Shorten onboarding or add skip option |`,
      `| 3 | Sign-up completion (S4 → S6) | Sign-up rate | ≥40% | Same | Reduce form fields, add OAuth |`,
      `| 4 | First value moment reached (S6) | % users reach core loop | ≥70% of signed-up | Same | Shorten path to first value |`,
      `| 5 | D1 retention | % users return next day | ≥30% | Firebase / Mixpanel | Improve first session value + push notification |`,
      `| 6 | ${primaryCTA} (S8) | Conversion rate | ≥${brief.INDUSTRY_CATEGORY.toLowerCase().includes('saas') ? '5%' : '3%'} of installs | RevenueCat / StoreKit | A/B test paywall layout, price, and social proof |`,
      `| 7 | D7 retention | % users active at day 7 | ≥15% | Firebase | Improve core loop engagement |`,
      `| 8 | NPS / review prompt | % who rate 4+ stars | ≥70% | Native review API | Prompt only after clear success moment (not time-based) |`
    );
  } else {
    rows.push(
      `| 1 | Entry → Scroll past hero (S0 → S1) | Scroll depth >300px | ≥60% of sessions | GA4 scroll depth event | Test hero headline, visual, CTA placement |`,
      `| 2 | Scroll to proof section (S3) | Scroll depth >800px | ≥40% of sessions | GA4 | Shorten Act I, increase proof visibility |`,
      `| 3 | Scroll to CTA section (S7) | Scroll depth >1,500px | ≥25% of sessions | GA4 | Tighten Act II, test content order |`,
      `| 4 | CTA click (S7 → S8) | CTA click rate | ≥3% of sessions | GA4 click event | A/B test CTA copy, colour, placement |`,
      `| 5 | Form start (S8) | % who begin form | ≥70% of CTA clickers | GA4 form interaction | Reduce form fields, add trust indicators |`,
      `| 6 | ${primaryCTA} — form submit (S8 → S9) | Form completion rate | ≥60% of form starters | GA4 form submit | Shorten form, improve validation UX |`,
      `| 7 | ${conversionGoal} | Overall conversion rate | ≥1.5–3% of sessions | GA4 goal conversion | Run full funnel analysis, prioritise highest drop-off step |`,
      `| 8 | Return visit | % sessions from return visitors | ≥20% within 30 days | GA4 user cohort | Implement email / retargeting sequence |`
    );
  }

  return [header, ...rows].join('\n');
}

function buildMobileNavPattern(brief: ProjectBrief, isIOS: boolean, isAndroid: boolean): string {
  const platform = brief.TECHNICAL.PLATFORM;
  const isCrossPlatform = platform === 'mobile-cross-platform' || platform === 'both';

  if (isIOS) {
    return `**Pattern:** UINavigationController (push/pop) for hierarchical content + UITabBarController for top-level sections.

| Transition | Use Case | Native API | Gesture |
|---|---|---|---|
| Push | Drill into detail (list → item) | NavigationStack / NavigationLink | Swipe-back (leading edge) |
| Modal (sheet) | Self-contained task (e.g., form, camera) | .sheet() / .fullScreenCover() | Swipe down to dismiss |
| Tab switch | Top-level section change | TabView | Tap tab icon |
| Popover (iPad) | Contextual info without leaving screen | Popover | Tap anchor |

**Nav bar:** Standard UINavigationBar. Large title on root screens, inline title on detail screens.
**Tab bar:** Max 5 items. Most critical flow always tab index 0. Badge count only for actionable notifications.
**Bottom sheet:** Use for non-modal overlays (quick actions, filters). Native UISheetPresentationController with .medium and .large detents.`;
  }

  if (isAndroid) {
    return `**Pattern:** Navigation Component (Jetpack Compose / Fragments) with Bottom Navigation Bar for top-level destinations.

| Transition | Use Case | Native API | Gesture |
|---|---|---|---|
| Fragment replace | Drill into detail | NavController.navigate() | Back gesture (predictive back) |
| Bottom sheet | Quick task / filter | ModalBottomSheet (M3) | Swipe down |
| Shared element | Visual continuity list→detail | sharedElement() / AnimatedContent | Tap |
| Dialog | Confirmation / destructive action | AlertDialog (M3) | Tap outside / back |

**Nav bar:** Top app bar (M3 TopAppBar). Large on root, CenterAligned on detail.
**Bottom nav:** Max 5 items. NavigationBar (M3). Ripple on tap. Always visible — do not hide on scroll.
**FAB:** One FAB per screen maximum. Always bottom-right. Extend to text on empty states.`;
  }

  if (isCrossPlatform) {
    return `**Pattern:** React Native Navigation (react-navigation v7) or Flutter Navigator 2.0 with platform-adaptive transitions.

| Concern | iOS Behaviour | Android Behaviour |
|---|---|---|
| Stack push | Slide in from right + back gesture | Slide in from right + predictive back |
| Modal | Slide up from bottom | Slide up from bottom |
| Tab bar | UITabBar (bottom, always visible) | NavigationBar (bottom, always visible) |
| Nav header | Large → inline on scroll | TopAppBar (M3) with back chevron |
| Haptics | UIImpactFeedbackGenerator | HapticFeedback.vibrate() |

**Rule:** Never invert native patterns for visual consistency. Users detect platform violations as "broken". Use Platform.select() or conditional imports for platform-specific components.`;
  }

  return '';
}

function buildWebNavPattern(brief: ProjectBrief): string {
  const pageStructure = brief.CONTENT.PAGE_STRUCTURE;
  const primaryCTA = brief.CTA_STRATEGY.PRIMARY_CTA;

  const pages = pageStructure.length > 0
    ? pageStructure.map((p, i) => {
      const slug = p.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '');
      return `| ${i + 1} | /${i === 0 ? '' : slug} | ${p} | ${i === 0 ? primaryCTA : 'Contextual CTA'} |`;
    }).join('\n')
    : `| 1 | / | Home | ${primaryCTA} |
| 2 | /about | About | Learn more |
| 3 | /services | Services | ${primaryCTA} |
| 4 | /contact | Contact | ${primaryCTA} |`;

  return `**Primary nav:** Persistent top navigation. Max 6 items. CTA button always rightmost, visually distinct.

| Priority | URL | Page | Primary CTA |
|---|---|---|---|
${pages}

**Scroll behaviour:** Smooth scroll to sections on single-page layouts. Update URL hash on section entry (Intersection Observer).
**Mobile nav:** Hamburger menu < 768px. Full-screen overlay, not sidebar. Close on route change.
**Sticky CTA:** For long-form pages (>2,000px content), a sticky CTA bar appears after scroll depth >600px. Disappears if user reaches footer CTA.
**Focus management:** On page navigation, focus moves to page h1 or main landmark. Required for keyboard and screen-reader users.`;
}
