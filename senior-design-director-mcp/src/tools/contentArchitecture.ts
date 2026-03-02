/**
 * Content Architecture Tool
 * Creates narrative-driven content structures based on three-act storytelling
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
