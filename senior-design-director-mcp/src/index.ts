#!/usr/bin/env node

/**
 * Senior Design Director MCP Server
 * Provides tools for project discovery, design systems, accessibility, and performance
 * for web and premium mobile app design (iOS, Android, React Native, Flutter)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('../package.json') as { version: string };

import {
  completeProjectDiscovery,
  getProjectBrief,
  listProjects,
  deleteProject,
  updateProjectBrief,
  DISCOVERY_QUESTIONS,
} from './tools/projectDiscovery.js';
import { generateColorPalette, validateColorContrast } from './tools/colorPalette.js';
import { createDesignSystem, generateComponentLibrary } from './tools/designSystem.js';
import {
  generateContentArchitecture,
  generateCopyGuidelines,
  generateUserFlow,
} from './tools/contentArchitecture.js';
import { checkAccessibility, getAccessibilityChecklist } from './tools/accessibility.js';
import {
  analyzePerformance,
  analyzeMobilePerformance,
  getCoreWebVitalsTargets,
  getPerformanceBudget,
  getMobilePerformanceTargets,
} from './tools/performance.js';
import {
  getDesignReference,
  getProjectBriefTemplate,
  getComponentTemplate,
} from './resources/templates.js';
import { generateImmersive3DExperience } from './tools/immersive3d.js';
import { runInstaller } from './install.js';

// When invoked as `npx senior-design-director-mcp install`, run the installer
// instead of starting the MCP server.
if (process.argv[2] === 'install') {
  await runInstaller();
  process.exit(0);
}

const server = new McpServer(
  {
    name: 'senior-design-director-mcp',
    version,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

const platformEnum = z.enum([
  'web',
  'mobile-ios',
  'mobile-android',
  'mobile-cross-platform',
  'both',
]);

const mobilePlatformEnum = z.enum([
  'mobile-ios',
  'mobile-android',
  'mobile-cross-platform',
  'both',
]);

server.registerTool(
  'complete-project-discovery',
  {
    description:
      'Complete project discovery by answering all 15 questions. Creates a comprehensive project brief for design decisions.',
    inputSchema: {
      projectName: z.string().describe('Project or company name'),
      projectDescription: z.string().describe('What the project does (2-3 sentences)'),
      industryCategory: z.string().describe('Industry category'),
      audienceRole: z.string().describe('Primary audience job title/role'),
      painPoints: z.string().optional().describe('Problems they are trying to solve'),
      objections: z.string().optional().describe('Objections or skepticism they have'),
      fear: z.string().optional().describe('Fears or concerns they have'),
      uniquePosition: z.string().optional().describe('What makes you different from competitors'),
      philosophy: z.string().optional().describe('What you believe strongly about'),
      desiredPerception: z.string().optional().describe('How you want to be perceived'),
      beforeState: z.string().optional().describe('Customer starting state (before you)'),
      transformationMoment: z.string().optional().describe('The "aha" turning point'),
      afterState: z.string().optional().describe('Customer ending state (after you)'),
      successMetric: z.string().optional().describe('How you measure success'),
      primaryCTA: z.string().describe('Primary call-to-action'),
      primaryCTAOutcome: z.string().optional().describe('Desired outcome of primary CTA'),
      secondaryCTAs: z.array(z.string()).optional().describe('2-3 secondary actions'),
      emotionalTone: z.array(z.string()).describe('3-5 emotional tones from the list'),
      visualPersonality: z.string().optional().describe('How the brand would dress/present'),
      aestheticReferences: z.array(z.string()).optional().describe('Visual inspiration (websites, brands)'),
      photographyStyle: z.string().optional().describe('Photography/imagery style'),
      mood: z.string().optional().describe('Photography mood'),
      treatment: z.string().optional().describe('Photography treatment'),
      keyMessages: z.array(z.string()).optional().describe('3-5 key messages (prioritized)'),
      proofPoints: z
        .record(z.string(), z.array(z.string()))
        .optional()
        .describe('Proof points by category (experience, clients, results, etc)'),
      contentInventory: z.array(z.string()).optional().describe('Content/assets already available'),
      contentGaps: z.array(z.string()).optional().describe('Content that needs to be created'),
      pageStructure: z
        .array(z.string())
        .optional()
        .describe('Pages/sections for the site (in priority order)'),
      platform: platformEnum
        .optional()
        .describe(
          'Target platform: web, mobile-ios, mobile-android, mobile-cross-platform, or both'
        ),
      techStackPreference: z.string().optional().describe('Preferred technology stack'),
      integrations: z.array(z.string()).optional().describe('Required integrations'),
      cmsStrategy: z.string().optional().describe('CMS strategy'),
      timeline: z.string().optional().describe('Timeline for launch'),
      seoPriority: z.string().optional().describe('SEO priority level'),
      competitors: z.array(z.string()).optional().describe('Top 3-5 competitors'),
      competitiveAdvantages: z.array(z.string()).optional().describe('How to differentiate'),
      visualInspiration: z.array(z.string()).optional().describe('Visual inspiration outside industry'),
      successMetrics: z.array(z.string()).optional().describe('How to measure website success'),
      conversionGoal: z.string().optional().describe('Conversion goal'),
      businessObjective: z.string().optional().describe('Business objective'),
      existingColors: z.string().optional().describe('Existing brand colors (or "None")'),
      colorPreferences: z
        .string()
        .optional()
        .describe('Color preferences (or "Open to recommendation")'),
      colorConstraints: z.string().optional().describe('Color constraints (or "None")'),
    },
  },
  (args) => {
    const result = completeProjectDiscovery(args as any);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-project-brief',
  {
    description: 'Retrieve a saved project brief by project name',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = getProjectBrief(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'list-projects',
  {
    description: 'List all saved project briefs',
  },
  () => {
    const result = listProjects();
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'delete-project',
  {
    description: 'Delete a saved project brief by project name',
    inputSchema: {
      projectName: z.string().describe('Project name to delete'),
    },
  },
  (args) => {
    const result = deleteProject(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'update-project-brief',
  {
    description: 'Update specific fields of an existing project brief without replacing the whole brief',
    inputSchema: {
      projectName: z.string().describe('Project name to update'),
      updates: z.record(z.string(), z.unknown()).describe('Partial ProjectBrief object with only the fields to update'),
    },
  },
  (args) => {
    const result = updateProjectBrief(args.projectName, args.updates);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'generate-color-palette',
  {
    description:
      'Generate color palette recommendations based on project brief analysis (emotional tone, industry, audience)',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = generateColorPalette(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'validate-color-contrast',
  {
    description: 'Check WCAG color contrast ratio between foreground and background colors',
    inputSchema: {
      foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/).describe('Foreground color (hex, e.g. #1a1a2e)'),
      background: z.string().regex(/^#[0-9a-fA-F]{6}$/).describe('Background color (hex, e.g. #ffffff)'),
    },
  },
  (args) => {
    const result = validateColorContrast(args.foreground, args.background);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'create-design-system',
  {
    description:
      'Generate complete design system with typography, spacing, breakpoints, motion, and colors',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = createDesignSystem(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'generate-component-library',
  {
    description: 'Generate component specifications (buttons, cards, forms, etc) based on design system',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = generateComponentLibrary(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'generate-content-architecture',
  {
    description:
      'Create narrative-driven content structure using three-act storytelling framework',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = generateContentArchitecture(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'generate-copy-guidelines',
  {
    description: 'Generate copywriting guidelines based on brand voice and positioning',
    inputSchema: {
      projectName: z.string().describe('Project name'),
    },
  },
  (args) => {
    const result = generateCopyGuidelines(args.projectName);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'generate-user-flow',
  {
    description:
      'Generate a clinical, structured user flow map — entry points, numbered task states, decision forks, friction inventory, error/empty states, and conversion checkpoints. Platform-aware: produces screen-by-screen mobile flows (iOS HIG / Material 3 navigation patterns) or page-by-page web flows with scroll depth targets. Run after project discovery, before design system. Required before any UI work begins.',
    inputSchema: {
      projectName: z.string().describe('Project name (must match a saved project brief)'),
      journeyGoal: z
        .string()
        .optional()
        .describe('Override the primary journey goal. Defaults to the primary CTA from the project brief.'),
    },
  },
  (args) => {
    const result = generateUserFlow(args.projectName, args.journeyGoal);
    return { content: [{ type: 'text', text: result.flow ?? result.message }] };
  }
);

server.registerTool(
  'check-accessibility',
  {
    description:
      'Check accessibility compliance (WCAG 2.2 AA) for web and mobile apps — colors, HTML, forms, touch targets, VoiceOver/TalkBack, Dynamic Type, Reduce Motion',
    inputSchema: {
      platform: platformEnum
        .optional()
        .describe('Platform to check — enables mobile-specific checks when set to a mobile value'),
      colors: z
        .array(
          z.object({
            foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
            background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
          })
        )
        .optional()
        .describe('Color combinations to check — hex format required, e.g. { foreground: "#1a1a2e", background: "#ffffff" }'),
      semanticHTML: z.string().optional().describe('HTML to check for semantic structure (web only)'),
      formLabels: z.boolean().optional().describe('Are form labels properly associated? (web only)'),
      headingHierarchy: z
        .array(z.string())
        .optional()
        .describe('Heading sequence e.g. ["h1", "h2", "h3"] (web only)'),
      ariaLabels: z
        .boolean()
        .optional()
        .describe('Are ARIA labels present on interactive elements? (web only)'),
      keyboardNav: z.boolean().optional().describe('Is keyboard navigation supported? (web only)'),
      touchTargetSize: z
        .number()
        .optional()
        .describe('Touch target size in pt (iOS) or dp (Android) — minimum 44pt / 48dp'),
      minimumTapSpacing: z
        .number()
        .optional()
        .describe('Gap between adjacent touch targets in pt/dp — minimum 8'),
      dynamicTypeSupport: z
        .boolean()
        .optional()
        .describe('iOS: Does app support Dynamic Type scaling? Android: Are sp units used for all text?'),
      screenReaderLabels: z
        .boolean()
        .optional()
        .describe('Do all interactive elements have VoiceOver (iOS) or TalkBack (Android) labels?'),
      reduceMotionSupport: z
        .boolean()
        .optional()
        .describe('Does the app respond to iOS Reduce Motion / Android Disable Animations setting?'),
      oledBackground: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional()
        .describe('Dark background hex color (e.g. #000000) to check for OLED pure-black halation issues'),
    },
  },
  (args) => {
    const result = checkAccessibility(args as any);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-accessibility-checklist',
  {
    description: 'Get comprehensive WCAG 2.1 AA accessibility checklist',
  },
  () => {
    const result = getAccessibilityChecklist();
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'analyze-performance',
  {
    description: 'Analyze performance metrics and get optimization recommendations',
    inputSchema: {
      lcp: z.number().optional().describe('Largest Contentful Paint (ms)'),
      fid: z.number().optional().describe('First Input Delay (ms)'),
      cls: z.number().optional().describe('Cumulative Layout Shift'),
      bundleSize: z.number().optional().describe('JS bundle size (KB)'),
      imageOptimization: z
        .enum(['none', 'partial', 'full'])
        .optional()
        .describe('Image optimization level'),
      lazyLoading: z.boolean().optional().describe('Is lazy loading implemented?'),
      caching: z.enum(['none', 'partial', 'full']).optional().describe('Caching strategy'),
      fontLoading: z
        .enum(['blocking', 'swap', 'optional'])
        .optional()
        .describe('Font loading strategy'),
    },
  },
  (args) => {
    const result = analyzePerformance(args as any);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-core-web-vitals-targets',
  {
    description: 'Get Core Web Vitals targets and thresholds',
  },
  () => {
    const result = getCoreWebVitalsTargets();
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-performance-budget',
  {
    description: 'Get recommended performance budget for web projects',
  },
  () => {
    const result = getPerformanceBudget();
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'analyze-mobile-performance',
  {
    description:
      'Analyze mobile app performance metrics — app launch time, frame rate, memory usage, battery impact, and asset densities for iOS and Android',
    inputSchema: {
      platform: mobilePlatformEnum.describe('Target mobile platform'),
      coldLaunchMs: z
        .number()
        .optional()
        .describe('Cold app launch time in milliseconds (good: <400ms iOS / <500ms Android)'),
      warmLaunchMs: z
        .number()
        .optional()
        .describe('Warm app launch time in milliseconds (good: <200ms)'),
      frameRate: z
        .number()
        .optional()
        .describe('Typical frame rate in fps during scrolling/animation (target: 60fps)'),
      memoryUsageMb: z
        .number()
        .optional()
        .describe('Peak memory usage in MB (good: <150MB iOS / <200MB Android)'),
      batteryImpact: z
        .enum(['low', 'moderate', 'high'])
        .optional()
        .describe('Qualitative battery impact level'),
      assetDensities: z
        .boolean()
        .optional()
        .describe(
          'Are all required asset densities provided? (@1x/@2x/@3x for iOS, mdpi–xxxhdpi for Android)'
        ),
    },
  },
  (args) => {
    const result = analyzeMobilePerformance(args as any);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-mobile-performance-targets',
  {
    description:
      'Get reference performance targets for iOS and Android apps — launch time, frame rate, memory, battery, and asset thresholds',
  },
  () => {
    const result = getMobilePerformanceTargets();
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'get-discovery-questions',
  {
    description: 'Get the full list of 15 discovery questions for manual project setup',
  },
  () => {
    return { content: [{ type: 'text', text: JSON.stringify(DISCOVERY_QUESTIONS, null, 2) }] };
  }
);

server.registerTool(
  'generate-3d-experience',
  {
    description:
      'Generate a fully immersive, scroll-driven 3D web experience using React Three Fiber, GSAP ScrollTrigger, and WebGL shaders. Outputs production-ready code: scene architecture, CatmullRom camera spline, scroll→animation mapping, postprocessing pipeline, and mobile fallback.',
    inputSchema: {
      concept: z.string().describe('Theme or narrative of the 3D world (e.g. "deep ocean bioluminescence", "brutalist concrete city", "crystalline neural network")'),
      sections: z.number().min(3).max(7).optional().default(5).describe('Number of scroll scenes (3–7). Each section maps to a camera waypoint on the spline.'),
      style: z
        .enum(['cosmic', 'architectural', 'organic', 'minimal', 'brutalist', 'liquid', 'crystalline'])
        .optional()
        .default('cosmic')
        .describe('Visual style — drives geometry choice, lighting mood, and camera choreography'),
      primaryColor: z.string().optional().default('#6c63ff').describe('Brand hex color used for geometry, particles, and emissive lighting'),
      framework: z
        .enum(['react-three-fiber', 'vanilla-threejs'])
        .optional()
        .default('react-three-fiber')
        .describe('Output framework'),
      includeShaders: z.boolean().optional().default(false).describe('Include custom GLSL vertex/fragment displacement shaders'),
    },
  },
  (args) => {
    const result = generateImmersive3DExperience(
      args.concept,
      args.sections ?? 5,
      (args.style ?? 'cosmic') as any,
      args.primaryColor ?? '#6c63ff',
      (args.framework ?? 'react-three-fiber') as any,
      args.includeShaders ?? false,
    );
    return { content: [{ type: 'text', text: result }] };
  }
);

server.registerResource(
  'Project Brief Template',
  'template://project-brief',
  { description: 'YAML template for project brief', mimeType: 'text/markdown' },
  () => ({
    contents: [{ uri: 'template://project-brief', mimeType: 'text/markdown', text: getProjectBriefTemplate() }],
  })
);

const componentTypes = ['button', 'card', 'hero', 'navigation', 'form'] as const;
const componentNames: Record<string, string> = {
  button: 'Button Component Template',
  card: 'Card Component Template',
  hero: 'Hero Section Template',
  navigation: 'Navigation Template',
  form: 'Form Template',
};

for (const comp of componentTypes) {
  server.registerResource(
    componentNames[comp],
    `template://component/${comp}`,
    { description: `HTML/CSS template for ${comp} component`, mimeType: 'text/html' },
    (_uri) => ({
      contents: [{ uri: `template://component/${comp}`, mimeType: 'text/html', text: getComponentTemplate(comp as any) }],
    })
  );
}

const references: Array<{ key: string; name: string; description: string }> = [
  { key: 'easing', name: 'Animation Easing Reference', description: 'CSS easing functions and timing guidelines' },
  { key: 'breakpoints', name: 'Responsive Breakpoints Reference', description: 'Standard responsive breakpoints' },
  { key: 'typography-scale', name: 'Typography Scale Reference', description: 'Typography scale systems and fluid typography' },
  { key: 'spacing', name: 'Spacing System Reference', description: '8px base unit spacing system' },
  { key: 'color-psychology', name: 'Color Psychology Reference', description: 'Color psychology by emotion and industry' },
  { key: 'webflow-animation', name: 'Webflow Animation Reference', description: 'Webflow Interactions (IX2) — triggers, actions, scroll patterns, performance rules' },
  { key: 'gsap-motion', name: 'GSAP Motion Reference', description: 'GSAP core API, ScrollTrigger, timelines, stagger, React integration, and design token mapping' },
  { key: 'ios-hig', name: 'iOS Human Interface Guidelines Reference', description: 'iOS HIG patterns — navigation, Dynamic Type, SF Symbols, safe areas, touch targets, motion, and edge cases' },
  { key: 'material-design', name: 'Material Design 3 Reference', description: 'Material You patterns — dynamic color, type scale, components, motion system, spacing, and edge cases' },
];

for (const ref of references) {
  server.registerResource(
    ref.name,
    `reference://${ref.key}`,
    { description: ref.description, mimeType: 'text/markdown' },
    (_uri) => ({
      contents: [{ uri: `reference://${ref.key}`, mimeType: 'text/markdown', text: getDesignReference(ref.key as any) }],
    })
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Senior Design Director MCP Server running on stdio');
