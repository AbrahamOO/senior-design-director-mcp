#!/usr/bin/env node

/**
 * Senior Design Director MCP Server
 * Provides tools for project discovery, design systems, accessibility, and performance
 * for web and premium mobile app design (iOS, Android, React Native, Flutter)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

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

const server = new Server(
  {
    name: 'senior-design-director-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'complete-project-discovery',
        description:
          'Complete project discovery by answering all 15 questions. Creates a comprehensive project brief for design decisions.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project or company name' },
            projectDescription: { type: 'string', description: 'What the project does (2-3 sentences)' },
            industryCategory: { type: 'string', description: 'Industry category' },
            audienceRole: { type: 'string', description: 'Primary audience job title/role' },
            painPoints: { type: 'string', description: 'Problems they are trying to solve' },
            objections: { type: 'string', description: 'Objections or skepticism they have' },
            fear: { type: 'string', description: 'Fears or concerns they have' },
            uniquePosition: { type: 'string', description: 'What makes you different from competitors' },
            philosophy: { type: 'string', description: 'What you believe strongly about' },
            desiredPerception: { type: 'string', description: 'How you want to be perceived' },
            beforeState: { type: 'string', description: 'Customer starting state (before you)' },
            transformationMoment: { type: 'string', description: 'The "aha" turning point' },
            afterState: { type: 'string', description: 'Customer ending state (after you)' },
            successMetric: { type: 'string', description: 'How you measure success' },
            primaryCTA: { type: 'string', description: 'Primary call-to-action' },
            primaryCTAOutcome: { type: 'string', description: 'Desired outcome of primary CTA' },
            secondaryCTAs: {
              type: 'array',
              items: { type: 'string' },
              description: '2-3 secondary actions',
            },
            emotionalTone: {
              type: 'array',
              items: { type: 'string' },
              description: '3-5 emotional tones from the list',
            },
            visualPersonality: { type: 'string', description: 'How the brand would dress/present' },
            aestheticReferences: {
              type: 'array',
              items: { type: 'string' },
              description: 'Visual inspiration (websites, brands)',
            },
            photographyStyle: { type: 'string', description: 'Photography/imagery style' },
            mood: { type: 'string', description: 'Photography mood' },
            treatment: { type: 'string', description: 'Photography treatment' },
            keyMessages: {
              type: 'array',
              items: { type: 'string' },
              description: '3-5 key messages (prioritized)',
            },
            proofPoints: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
              description: 'Proof points by category (experience, clients, results, etc)',
            },
            contentInventory: {
              type: 'array',
              items: { type: 'string' },
              description: 'Content/assets already available',
            },
            contentGaps: {
              type: 'array',
              items: { type: 'string' },
              description: 'Content that needs to be created',
            },
            pageStructure: {
              type: 'array',
              items: { type: 'string' },
              description: 'Pages/sections for the site (in priority order)',
            },
            platform: {
              type: 'string',
              enum: ['web', 'mobile-ios', 'mobile-android', 'mobile-cross-platform', 'both'],
              description: 'Target platform: web, mobile-ios, mobile-android, mobile-cross-platform (React Native / Flutter), or both (web + mobile)',
            },
            techStackPreference: { type: 'string', description: 'Preferred technology stack' },
            integrations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Required integrations',
            },
            cmsStrategy: { type: 'string', description: 'CMS strategy' },
            timeline: { type: 'string', description: 'Timeline for launch' },
            seoPriority: { type: 'string', description: 'SEO priority level' },
            competitors: {
              type: 'array',
              items: { type: 'string' },
              description: 'Top 3-5 competitors',
            },
            competitiveAdvantages: {
              type: 'array',
              items: { type: 'string' },
              description: 'How to differentiate',
            },
            visualInspiration: {
              type: 'array',
              items: { type: 'string' },
              description: 'Visual inspiration outside industry',
            },
            successMetrics: {
              type: 'array',
              items: { type: 'string' },
              description: 'How to measure website success',
            },
            conversionGoal: { type: 'string', description: 'Conversion goal' },
            businessObjective: { type: 'string', description: 'Business objective' },
            existingColors: { type: 'string', description: 'Existing brand colors (or "None")' },
            colorPreferences: {
              type: 'string',
              description: 'Color preferences (or "Open to recommendation")',
            },
            colorConstraints: { type: 'string', description: 'Color constraints (or "None")' },
          },
          required: [
            'projectName',
            'projectDescription',
            'industryCategory',
            'audienceRole',
            'primaryCTA',
            'emotionalTone',
          ],
        },
      },
      {
        name: 'get-project-brief',
        description: 'Retrieve a saved project brief by project name',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'list-projects',
        description: 'List all saved project briefs',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'delete-project',
        description: 'Delete a saved project brief by project name',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name to delete' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'update-project-brief',
        description: 'Update specific fields of an existing project brief without replacing the whole brief',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name to update' },
            updates: {
              type: 'object',
              description: 'Partial ProjectBrief object with only the fields to update',
            },
          },
          required: ['projectName', 'updates'],
        },
      },
      {
        name: 'generate-color-palette',
        description:
          'Generate color palette recommendations based on project brief analysis (emotional tone, industry, audience)',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'validate-color-contrast',
        description: 'Check WCAG color contrast ratio between foreground and background colors',
        inputSchema: {
          type: 'object',
          properties: {
            foreground: { type: 'string', description: 'Foreground color (hex)' },
            background: { type: 'string', description: 'Background color (hex)' },
          },
          required: ['foreground', 'background'],
        },
      },
      {
        name: 'create-design-system',
        description:
          'Generate complete design system with typography, spacing, breakpoints, motion, and colors',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'generate-component-library',
        description: 'Generate component specifications (buttons, cards, forms, etc) based on design system',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'generate-content-architecture',
        description:
          'Create narrative-driven content structure using three-act storytelling framework',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'generate-copy-guidelines',
        description: 'Generate copywriting guidelines based on brand voice and positioning',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Project name' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'check-accessibility',
        description: 'Check accessibility compliance (WCAG 2.2 AA) for web and mobile apps — colors, HTML, forms, touch targets, VoiceOver/TalkBack, Dynamic Type, Reduce Motion',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['web', 'mobile-ios', 'mobile-android', 'mobile-cross-platform', 'both'],
              description: 'Platform to check — enables mobile-specific checks when set to a mobile value',
            },
            colors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  foreground: { type: 'string' },
                  background: { type: 'string' },
                },
              },
              description: 'Color combinations to check (works for all platforms)',
            },
            semanticHTML: { type: 'string', description: 'HTML to check for semantic structure (web only)' },
            formLabels: { type: 'boolean', description: 'Are form labels properly associated? (web only)' },
            headingHierarchy: {
              type: 'array',
              items: { type: 'string' },
              description: 'Heading sequence e.g. ["h1", "h2", "h3"] (web only)',
            },
            ariaLabels: { type: 'boolean', description: 'Are ARIA labels present on interactive elements? (web only)' },
            keyboardNav: { type: 'boolean', description: 'Is keyboard navigation supported? (web only)' },
            touchTargetSize: { type: 'number', description: 'Touch target size in pt (iOS) or dp (Android) — minimum 44pt / 48dp' },
            minimumTapSpacing: { type: 'number', description: 'Gap between adjacent touch targets in pt/dp — minimum 8' },
            dynamicTypeSupport: { type: 'boolean', description: 'iOS: Does app support Dynamic Type scaling? Android: Are sp units used for all text?' },
            screenReaderLabels: { type: 'boolean', description: 'Do all interactive elements have VoiceOver (iOS) or TalkBack (Android) labels?' },
            reduceMotionSupport: { type: 'boolean', description: 'Does the app respond to iOS Reduce Motion / Android Disable Animations setting?' },
            oledBackground: { type: 'string', description: 'Dark background hex color to check for OLED pure-black halation issues' },
          },
        },
      },
      {
        name: 'get-accessibility-checklist',
        description: 'Get comprehensive WCAG 2.1 AA accessibility checklist',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'analyze-performance',
        description: 'Analyze performance metrics and get optimization recommendations',
        inputSchema: {
          type: 'object',
          properties: {
            lcp: { type: 'number', description: 'Largest Contentful Paint (ms)' },
            fid: { type: 'number', description: 'First Input Delay (ms)' },
            cls: { type: 'number', description: 'Cumulative Layout Shift' },
            bundleSize: { type: 'number', description: 'JS bundle size (KB)' },
            imageOptimization: {
              type: 'string',
              enum: ['none', 'partial', 'full'],
              description: 'Image optimization level',
            },
            lazyLoading: { type: 'boolean', description: 'Is lazy loading implemented?' },
            caching: {
              type: 'string',
              enum: ['none', 'partial', 'full'],
              description: 'Caching strategy',
            },
            fontLoading: {
              type: 'string',
              enum: ['blocking', 'swap', 'optional'],
              description: 'Font loading strategy',
            },
          },
        },
      },
      {
        name: 'get-core-web-vitals-targets',
        description: 'Get Core Web Vitals targets and thresholds',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get-performance-budget',
        description: 'Get recommended performance budget for web projects',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'analyze-mobile-performance',
        description: 'Analyze mobile app performance metrics — app launch time, frame rate, memory usage, battery impact, and asset densities for iOS and Android',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['mobile-ios', 'mobile-android', 'mobile-cross-platform', 'both'],
              description: 'Target mobile platform',
            },
            coldLaunchMs: { type: 'number', description: 'Cold app launch time in milliseconds (good: <400ms iOS / <500ms Android)' },
            warmLaunchMs: { type: 'number', description: 'Warm app launch time in milliseconds (good: <200ms)' },
            frameRate: { type: 'number', description: 'Typical frame rate in fps during scrolling/animation (target: 60fps)' },
            memoryUsageMb: { type: 'number', description: 'Peak memory usage in MB (good: <150MB iOS / <200MB Android)' },
            batteryImpact: {
              type: 'string',
              enum: ['low', 'moderate', 'high'],
              description: 'Qualitative battery impact level',
            },
            assetDensities: { type: 'boolean', description: 'Are all required asset densities provided? (@1x/@2x/@3x for iOS, mdpi–xxxhdpi for Android)' },
          },
          required: ['platform'],
        },
      },
      {
        name: 'get-mobile-performance-targets',
        description: 'Get reference performance targets for iOS and Android apps — launch time, frame rate, memory, battery, and asset thresholds',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get-discovery-questions',
        description: 'Get the full list of 15 discovery questions for manual project setup',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'template://project-brief',
        name: 'Project Brief Template',
        mimeType: 'text/markdown',
        description: 'YAML template for project brief',
      },
      {
        uri: 'template://component/button',
        name: 'Button Component Template',
        mimeType: 'text/html',
        description: 'HTML/CSS template for button component',
      },
      {
        uri: 'template://component/card',
        name: 'Card Component Template',
        mimeType: 'text/html',
        description: 'HTML/CSS template for card component',
      },
      {
        uri: 'template://component/hero',
        name: 'Hero Section Template',
        mimeType: 'text/html',
        description: 'HTML/CSS template for hero section',
      },
      {
        uri: 'template://component/navigation',
        name: 'Navigation Template',
        mimeType: 'text/html',
        description: 'HTML/CSS template for navigation',
      },
      {
        uri: 'template://component/form',
        name: 'Form Template',
        mimeType: 'text/html',
        description: 'HTML/CSS template for accessible forms',
      },
      {
        uri: 'reference://easing',
        name: 'Animation Easing Reference',
        mimeType: 'text/markdown',
        description: 'CSS easing functions and timing guidelines',
      },
      {
        uri: 'reference://breakpoints',
        name: 'Responsive Breakpoints Reference',
        mimeType: 'text/markdown',
        description: 'Standard responsive breakpoints',
      },
      {
        uri: 'reference://typography-scale',
        name: 'Typography Scale Reference',
        mimeType: 'text/markdown',
        description: 'Typography scale systems and fluid typography',
      },
      {
        uri: 'reference://spacing',
        name: 'Spacing System Reference',
        mimeType: 'text/markdown',
        description: '8px base unit spacing system',
      },
      {
        uri: 'reference://color-psychology',
        name: 'Color Psychology Reference',
        mimeType: 'text/markdown',
        description: 'Color psychology by emotion and industry',
      },
      {
        uri: 'reference://webflow-animation',
        name: 'Webflow Animation Reference',
        mimeType: 'text/markdown',
        description: 'Webflow Interactions (IX2) — triggers, actions, scroll patterns, performance rules',
      },
      {
        uri: 'reference://gsap-motion',
        name: 'GSAP Motion Reference',
        mimeType: 'text/markdown',
        description: 'GSAP core API, ScrollTrigger, timelines, stagger, React integration, and design token mapping',
      },
      {
        uri: 'reference://ios-hig',
        name: 'iOS Human Interface Guidelines Reference',
        mimeType: 'text/markdown',
        description: 'iOS HIG patterns — navigation, Dynamic Type, SF Symbols, safe areas, touch targets, motion, and edge cases',
      },
      {
        uri: 'reference://material-design',
        name: 'Material Design 3 Reference',
        mimeType: 'text/markdown',
        description: 'Material You patterns — dynamic color, type scale, components, motion system, spacing, and edge cases',
      },
    ],
  };
});

// Read resource handler
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'template://project-brief') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: getProjectBriefTemplate(),
        },
      ],
    };
  }

  if (uri.startsWith('template://component/')) {
    const component = uri.replace('template://component/', '') as any;
    return {
      contents: [
        {
          uri,
          mimeType: 'text/html',
          text: getComponentTemplate(component),
        },
      ],
    };
  }

  if (uri.startsWith('reference://')) {
    const type = uri.replace('reference://', '') as any;
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: getDesignReference(type),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'complete-project-discovery': {
        const result = completeProjectDiscovery(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get-project-brief': {
        const result = getProjectBrief((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-projects': {
        const result = listProjects();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'delete-project': {
        const result = deleteProject((args?.projectName as string) || '');
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'update-project-brief': {
        const result = updateProjectBrief(
          (args?.projectName as string) || '',
          (args?.updates as Record<string, unknown>) || {}
        );
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'generate-color-palette': {
        const result = generateColorPalette((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate-color-contrast': {
        const result = validateColorContrast(
          (args?.foreground as string) || '#000000',
          (args?.background as string) || '#ffffff'
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create-design-system': {
        const result = createDesignSystem((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate-component-library': {
        const result = generateComponentLibrary((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate-content-architecture': {
        const result = generateContentArchitecture((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate-copy-guidelines': {
        const result = generateCopyGuidelines((args?.projectName as string) || '');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'check-accessibility': {
        const result = checkAccessibility(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get-accessibility-checklist': {
        const result = getAccessibilityChecklist();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze-performance': {
        const result = analyzePerformance(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get-core-web-vitals-targets': {
        const result = getCoreWebVitalsTargets();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get-performance-budget': {
        const result = getPerformanceBudget();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze-mobile-performance': {
        const result = analyzeMobilePerformance(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'get-mobile-performance-targets': {
        const result = getMobilePerformanceTargets();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'get-discovery-questions': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(DISCOVERY_QUESTIONS, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: false, error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Senior Design Director MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
