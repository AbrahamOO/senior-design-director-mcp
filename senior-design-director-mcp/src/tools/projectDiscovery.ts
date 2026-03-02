/**
 * Project Discovery Tool
 * Implements the 15-question discovery process from the design director prompt
 */

import { ProjectBrief } from '../types/index.js';
import { briefStorage } from '../utils/storage.js';

export const DISCOVERY_QUESTIONS = {
  PROJECT_IDENTITY: `What is your project/company name and what do you do in 2-3 sentences?
Example: "We're Acme Design, a boutique design studio helping SaaS startups build beautiful, conversion-focused web products."`,

  PRIMARY_AUDIENCE: `Who is your ideal customer/visitor? Describe them:
- Job title or role?
- What problem are they trying to solve?
- What's their experience level with your category?
- What objection or fear might they have?

Example: "Startup founders (25-40 years old) with $500k+ funding, frustrated with expensive traditional agencies, skeptical of design-only studios, need partners who understand business impact."`,

  UNIQUE_POSITION: `What makes you different from competitors?
- What's your unfair advantage or unique methodology?
- What do you believe strongly about (your philosophy)?
- How do you want to be perceived?

Example: "We believe design must be business-driven, not art-driven. We're the only studio that uses behavioral economics + design psychology to increase conversions."`,

  TRANSFORMATION: `What transformation does your customer experience working with you?
- What's their starting state (before you)?
- What's the turning point or "aha" moment?
- What's their ending state (after you)?
- How do you measure success?

Example: "Before: They're paralyzed by design options, burning cash on failed redesigns. After: They have a conversion-optimized product, confident roadmap, and 40% revenue increase."`,

  PRIMARY_CTA: `What's the single most important action you want visitors to take?
- Schedule a consultation call?
- Sign up for a course?
- Download a resource?
- Book a demo?
- Make a purchase?
- Fill out a form to get started?

Also list 2-3 secondary actions.`,

  EMOTIONAL_TONE: `How should visitors FEEL when they experience your site? Pick 3-5 and explain:
- Energetic & Inspiring
- Calm & Trustworthy
- Sophisticated & Premium
- Playful & Approachable
- Bold & Rebellious
- Warm & Human
- Professional & Authoritative
- Innovative & Futuristic
- Grounded & Authentic

Example: "Sophisticated & Premium (we're not cheap), Warm & Human (we're collaborators, not distant experts), Bold & Rebellious (we challenge the status quo)."`,

  VISUAL_PERSONALITY: `If your brand were a person, how would they dress and present themselves?
- Professional suit? Casual startup hoodie? Artistic/bohemian? Minimalist? Bold and colorful?
- Serious and focused? Playful and expressive?
- Classic and timeless? Cutting-edge and trendy?

Also mention any visual references (design styles, brands, or websites) that inspire you aesthetically.

Example: "Like a confident creative director in tailored black blazer with an unexpected bold accessory. Minimalist but with confident color choices. References: Stripe, Figma, Apple—polished but human."`,

  IMAGERY_STYLE: `How should photography/imagery look on your site?
- Professional headshots or candid team moments?
- Product-focused or people-focused?
- Warm film photography or clean digital photography?
- Diverse and inclusive, or specific demographic?
- Styled and art-directed, or naturally authentic?
- Minimalist white backgrounds or richly colored?

Example: "Candid team moments in natural light (authentic), diverse team, minimalist desaturated backgrounds, people laughing and collaborating (human warmth)."`,

  KEY_MESSAGES: `What are your 3-5 most important messages visitors need to understand?
List them in order of priority.

Also list your proof points (credentials, testimonials, case results, statistics):
- Years of experience?
- Clients/companies worked with?
- Results/outcomes achieved?
- Certifications or awards?
- Team size/expertise?
- Testimonial quotes from customers?`,

  CONTENT_INVENTORY: `What content/assets do you already have? What do you need to create?

Have:
- Brand copy (tagline, mission statement)?
- About section/bio?
- Service/product descriptions?
- Customer testimonials?
- Case studies?
- Team bios?
- High-quality photography?
- Logo and brand assets?

Need to create:
- [List items you'll need to write or shoot]`,

  PAGE_STRUCTURE: `What pages/sections should your site have? List in order of importance:

Example:
1. Hero/Home
2. About/Story
3. Services/Offerings (with 3-4 subsections)
4. Work/Case Studies
5. Testimonials
6. FAQ
7. Contact/CTA`,

  TECHNICAL_REQUIREMENTS: `Do you have any technical constraints or requirements?
- Specific technology stack required? (WordPress, Webflow, custom React, etc.)
- Integration needs? (CRM, email marketing, booking system, payment processor?)
- Content Management System needed? (Headless CMS, traditional CMS, static?)
- Budget for development? (This informs tech stack and complexity)
- Timeline for launch?
- SEO critical for your business?`,

  COMPETITIVE_LANDSCAPE: `Who are your top 3-5 competitors or brands in your space?
- What are they doing well?
- Where are they missing the mark?
- How do you want to differentiate visually?

Also, are there any brands OUTSIDE your industry that inspire you visually?`,

  SUCCESS_METRICS: `How will you measure if this website is successful?
- More qualified leads?
- Higher conversion rate on primary CTA?
- Increased brand awareness/credibility?
- Specific traffic/revenue goal?
- Customer feedback metric (NPS, testimonials)?`,

  COLOR_PREFERENCES: `Do you have any color preferences or constraints?
(You can skip this if you want design recommendations—we can suggest a palette based on your emotional tone and industry)

- Do you have existing brand colors you must use?
- Are there colors you hate or want to avoid?
- Do you prefer warm (reds, oranges, golds) or cool (blues, purples, greens) tones?
- Do you prefer saturated/vibrant colors or muted/pastel colors?
- Playful multicolor or sophisticated minimal palette?`
};

export function completeProjectDiscovery(answers: {
  projectName: string;
  projectDescription: string;
  industryCategory: string;
  audienceRole: string;
  painPoints?: string;
  objections?: string;
  fear?: string;
  uniquePosition?: string;
  philosophy?: string;
  desiredPerception?: string;
  beforeState?: string;
  transformationMoment?: string;
  afterState?: string;
  successMetric?: string;
  primaryCTA: string;
  primaryCTAOutcome?: string;
  secondaryCTAs?: string[];
  emotionalTone: string[];
  visualPersonality?: string;
  aestheticReferences?: string[];
  photographyStyle?: string;
  mood?: string;
  treatment?: string;
  keyMessages?: string[];
  proofPoints?: Record<string, string[]>;
  contentInventory?: string[];
  contentGaps?: string[];
  pageStructure?: string[];
  techStackPreference?: string;
  integrations?: string[];
  cmsStrategy?: string;
  timeline?: string;
  seoPriority?: string;
  competitors?: string[];
  competitiveAdvantages?: string[];
  visualInspiration?: string[];
  successMetrics?: string[];
  conversionGoal?: string;
  businessObjective?: string;
  existingColors?: string;
  colorPreferences?: string;
  colorConstraints?: string;
}): { success: boolean; message: string; projectBrief?: ProjectBrief } {
  const brief: ProjectBrief = {
    PROJECT_NAME: answers.projectName,
    PROJECT_DESCRIPTION: answers.projectDescription,
    INDUSTRY_CATEGORY: answers.industryCategory,
    PRIMARY_AUDIENCE: {
      ROLE: answers.audienceRole,
      PAIN_POINTS: answers.painPoints ?? '',
      OBJECTIONS: answers.objections ?? '',
      FEAR: answers.fear ?? ''
    },
    BRAND_POSITIONING: {
      UNIQUE_POSITION: answers.uniquePosition ?? '',
      PHILOSOPHY: answers.philosophy ?? '',
      DESIRED_PERCEPTION: answers.desiredPerception ?? ''
    },
    NARRATIVE: {
      BEFORE_STATE: answers.beforeState ?? '',
      TRANSFORMATION_MOMENT: answers.transformationMoment ?? '',
      AFTER_STATE: answers.afterState ?? '',
      SUCCESS_METRIC: answers.successMetric ?? ''
    },
    CTA_STRATEGY: {
      PRIMARY_CTA: answers.primaryCTA,
      PRIMARY_CTA_OUTCOME: answers.primaryCTAOutcome ?? '',
      SECONDARY_CTAS: answers.secondaryCTAs ?? []
    },
    EMOTIONAL_DIRECTION: {
      EMOTIONAL_TONE: answers.emotionalTone,
      VISUAL_PERSONALITY: answers.visualPersonality ?? '',
      AESTHETIC_REFERENCES: answers.aestheticReferences ?? []
    },
    IMAGERY: {
      PHOTOGRAPHY_STYLE: answers.photographyStyle ?? '',
      MOOD: answers.mood ?? '',
      TREATMENT: answers.treatment ?? ''
    },
    CONTENT: {
      KEY_MESSAGES: answers.keyMessages ?? [],
      PROOF_POINTS: answers.proofPoints ?? {},
      CONTENT_INVENTORY: answers.contentInventory ?? [],
      CONTENT_GAPS: answers.contentGaps ?? [],
      PAGE_STRUCTURE: answers.pageStructure ?? []
    },
    TECHNICAL: {
      TECH_STACK_PREFERENCE: answers.techStackPreference ?? '',
      INTEGRATIONS: answers.integrations ?? [],
      CMS_STRATEGY: answers.cmsStrategy ?? '',
      TIMELINE: answers.timeline ?? '',
      SEO_PRIORITY: answers.seoPriority ?? ''
    },
    COMPETITIVE: {
      COMPETITORS: answers.competitors ?? [],
      COMPETITIVE_ADVANTAGES: answers.competitiveAdvantages ?? [],
      VISUAL_INSPIRATION: answers.visualInspiration ?? []
    },
    BUSINESS: {
      SUCCESS_METRICS: answers.successMetrics ?? [],
      CONVERSION_GOAL: answers.conversionGoal ?? '',
      BUSINESS_OBJECTIVE: answers.businessObjective ?? ''
    },
    COLOR_STRATEGY: {
      EXISTING_COLORS: answers.existingColors ?? 'None',
      PREFERENCES: answers.colorPreferences ?? 'Open to recommendation',
      CONSTRAINTS: answers.colorConstraints ?? 'None'
    }
  };

  briefStorage.save(answers.projectName, brief);

  return {
    success: true,
    message: `Project brief for "${answers.projectName}" has been saved successfully. You can now use other tools like generate-color-palette or create-design-system.`,
    projectBrief: brief
  };
}

export function getProjectBrief(projectName: string): {
  success: boolean;
  message: string;
  projectBrief?: ProjectBrief;
} {
  const brief = briefStorage.get(projectName);

  if (!brief) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Use complete-project-discovery to create one.`
    };
  }

  return {
    success: true,
    message: `Project brief retrieved for "${projectName}".`,
    projectBrief: brief
  };
}

export function listProjects(): { success: boolean; projects: string[] } {
  return {
    success: true,
    projects: briefStorage.list()
  };
}

export function deleteProject(projectName: string): { success: boolean; message: string } {
  const deleted = briefStorage.delete(projectName);
  if (!deleted) {
    return {
      success: false,
      message: `No project brief found for "${projectName}".`
    };
  }
  return {
    success: true,
    message: `Project brief for "${projectName}" has been deleted.`
  };
}

export function updateProjectBrief(
  projectName: string,
  updates: Partial<ProjectBrief>
): { success: boolean; message: string; projectBrief?: ProjectBrief } {
  const updated = briefStorage.update(projectName, updates);
  if (!updated) {
    return {
      success: false,
      message: `No project brief found for "${projectName}". Use complete-project-discovery to create one first.`
    };
  }
  const brief = briefStorage.get(projectName);
  return {
    success: true,
    message: `Project brief for "${projectName}" has been updated.`,
    projectBrief: brief
  };
}
