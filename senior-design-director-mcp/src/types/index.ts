/**
 * Type definitions for the Senior Design Director MCP Server
 */

export type Platform = 'web' | 'mobile-ios' | 'mobile-android' | 'mobile-cross-platform' | 'both';

export interface ProjectBrief {
  PROJECT_NAME: string;
  PROJECT_DESCRIPTION: string;
  INDUSTRY_CATEGORY: string;

  PRIMARY_AUDIENCE: {
    ROLE: string;
    PAIN_POINTS: string;
    OBJECTIONS: string;
    FEAR: string;
  };

  BRAND_POSITIONING: {
    UNIQUE_POSITION: string;
    PHILOSOPHY: string;
    DESIRED_PERCEPTION: string;
  };

  NARRATIVE: {
    BEFORE_STATE: string;
    TRANSFORMATION_MOMENT: string;
    AFTER_STATE: string;
    SUCCESS_METRIC: string;
  };

  CTA_STRATEGY: {
    PRIMARY_CTA: string;
    PRIMARY_CTA_OUTCOME: string;
    SECONDARY_CTAS: string[];
  };

  EMOTIONAL_DIRECTION: {
    EMOTIONAL_TONE: string[];
    VISUAL_PERSONALITY: string;
    AESTHETIC_REFERENCES: string[];
  };

  IMAGERY: {
    PHOTOGRAPHY_STYLE: string;
    MOOD: string;
    TREATMENT: string;
  };

  CONTENT: {
    KEY_MESSAGES: string[];
    PROOF_POINTS: Record<string, string[]>;
    CONTENT_INVENTORY: string[];
    CONTENT_GAPS: string[];
    PAGE_STRUCTURE: string[];
  };

  TECHNICAL: {
    PLATFORM: Platform;
    TECH_STACK_PREFERENCE: string;
    INTEGRATIONS: string[];
    CMS_STRATEGY: string;
    TIMELINE: string;
    SEO_PRIORITY: string;
  };

  COMPETITIVE: {
    COMPETITORS: string[];
    COMPETITIVE_ADVANTAGES: string[];
    VISUAL_INSPIRATION: string[];
  };

  BUSINESS: {
    SUCCESS_METRICS: string[];
    CONVERSION_GOAL: string;
    BUSINESS_OBJECTIVE: string;
  };

  COLOR_STRATEGY: {
    EXISTING_COLORS: string;
    PREFERENCES: string;
    CONSTRAINTS: string;
  };
}

export interface ColorPalette {
  name: string;
  rationale: string;

  primary: {
    name: string;
    hex: string;
    rgb: string;
    usage: string;
    psychology: string;
    reasoning: string;
  };

  secondary: {
    name: string;
    hex: string;
    rgb: string;
    usage: string;
    psychology: string;
    reasoning: string;
  };

  accent: {
    name: string;
    hex: string;
    rgb: string;
    usage: string;
    psychology: string;
    reasoning: string;
  };

  neutrals: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    dividers: string;
  };

  usageGuidelines: string;
}

export interface MobileTokens {
  /** Unit system for the platform */
  unitSystem: 'pt' | 'dp' | 'px';
  /** Safe area insets (pt for iOS, dp for Android) */
  safeAreas: {
    statusBar: number;
    homeIndicator: number;
    navigationBar: number;
    tabBar: number;
  };
  /** Platform-specific touch target minimum */
  touchTarget: {
    minimum: number;
    recommended: number;
    unit: string;
  };
  /** Platform-specific screen sizes */
  screenSizes: {
    name: string;
    width: number;
    height: number;
    scale: number;
  }[];
  /** Native motion system */
  nativeMotion: {
    springDamping?: number;
    springStiffness?: number;
    springMass?: number;
    standardDuration: string;
    emphasizedDuration: string;
    decelerateEasing: string;
    accelerateEasing: string;
  };
}

export interface DesignSystem {
  platform: Platform;

  typography: {
    displayFont: {
      family: string;
      weights: number[];
      usage: string;
    };
    bodyFont: {
      family: string;
      weights: number[];
      usage: string;
    };
    accentFont?: {
      family: string;
      weights: number[];
      usage: string;
    };
    scale: {
      size: string;
      lineHeight: string;
      useCase: string;
    }[];
  };

  spacing: {
    baseUnit: number;
    unit: string;
    scale: number[];
  };

  /** Web breakpoints — populated for web and both platforms */
  breakpoints?: {
    name: string;
    minWidth: number;
    maxWidth?: number;
    columns: number;
  }[];

  /** Mobile tokens — populated for mobile and both platforms */
  mobileTokens?: MobileTokens;

  motion: {
    easings: Record<string, string>;
    durations: Record<string, string>;
  };

  colors: ColorPalette;
}

export interface AccessibilityReport {
  score: number;
  issues: {
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    type: string;
    description: string;
    recommendation: string;
  }[];
  wcagCompliance: {
    level: 'A' | 'AA' | 'AAA';
    passes: string[];
    failures: string[];
  };
}

export interface PerformanceRecommendation {
  category: string;
  current: string;
  target: string;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface ContentArchitecture {
  narrative: {
    actOne: {
      title: string;
      scrollRange: string;
      purpose: string;
      visualStrategy: string;
      emotionalTone: string;
      sections: string[];
    };
    actTwo: {
      title: string;
      scrollRange: string;
      purpose: string;
      visualStrategy: string;
      emotionalTone: string;
      sections: string[];
    };
    actThree: {
      title: string;
      scrollRange: string;
      purpose: string;
      visualStrategy: string;
      emotionalTone: string;
      sections: string[];
    };
  };
  pageStructure: {
    pageName: string;
    priority: number;
    sections: string[];
    primaryCTA: string;
  }[];
}
