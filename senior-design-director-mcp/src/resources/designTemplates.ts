import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

export interface DesignTemplate {
  name: string;
  slug: string;
  content: string;
}

export interface TemplateEntry {
  slug: string;
  name: string;
  industry: string;
}

export type IndustryGroup = Record<string, TemplateEntry[]>;

// Industry mapping — drives both grouping and scope-based filtering
const INDUSTRY_MAP: Record<string, string> = {
  // AI & LLM Platforms
  claude:        'AI & LLM Platforms',
  cohere:        'AI & LLM Platforms',
  elevenlabs:    'AI & LLM Platforms',
  minimax:       'AI & LLM Platforms',
  'mistral.ai':  'AI & LLM Platforms',
  'opencode.ai': 'AI & LLM Platforms',
  'together.ai': 'AI & LLM Platforms',
  'x.ai':        'AI & LLM Platforms',

  // Developer Tools
  cursor:    'Developer Tools',
  expo:      'Developer Tools',
  raycast:   'Developer Tools',
  warp:      'Developer Tools',
  ollama:    'Developer Tools',
  replicate: 'Developer Tools',

  // Backend, Database & Infrastructure
  clickhouse: 'Backend & Infrastructure',
  hashicorp:  'Backend & Infrastructure',
  mongodb:    'Backend & Infrastructure',
  supabase:   'Backend & Infrastructure',
  sanity:     'Backend & Infrastructure',
  resend:     'Backend & Infrastructure',
  vercel:     'Backend & Infrastructure',
  posthog:    'Backend & Infrastructure',
  sentry:     'Backend & Infrastructure',
  zapier:     'Backend & Infrastructure',
  composio:   'Backend & Infrastructure',

  // Productivity & SaaS
  airtable:   'Productivity & SaaS',
  cal:        'Productivity & SaaS',
  intercom:   'Productivity & SaaS',
  'linear.app': 'Productivity & SaaS',
  notion:     'Productivity & SaaS',
  superhuman: 'Productivity & SaaS',
  slack:      'Productivity & SaaS',
  webflow:    'Productivity & SaaS',

  // Design & Creative Tools
  figma:    'Design & Creative',
  framer:   'Design & Creative',
  lovable:  'Design & Creative',
  miro:     'Design & Creative',
  runwayml: 'Design & Creative',

  // E-commerce & Retail
  shopify:   'E-commerce & Retail',
  starbucks: 'E-commerce & Retail',
  nike:      'E-commerce & Retail',

  // Fintech & Crypto
  binance:    'Fintech & Crypto',
  coinbase:   'Fintech & Crypto',
  kraken:     'Fintech & Crypto',
  mastercard: 'Fintech & Crypto',
  revolut:    'Fintech & Crypto',
  wise:       'Fintech & Crypto',
  stripe:     'Fintech & Crypto',

  // Media & Consumer Tech
  apple:      'Media & Consumer Tech',
  airbnb:     'Media & Consumer Tech',
  meta:       'Media & Consumer Tech',
  pinterest:  'Media & Consumer Tech',
  spotify:    'Media & Consumer Tech',
  theverge:   'Media & Consumer Tech',
  wired:      'Media & Consumer Tech',
  uber:       'Media & Consumer Tech',

  // Automotive & Luxury
  bmw:         'Automotive & Luxury',
  'bmw-m':     'Automotive & Luxury',
  bugatti:     'Automotive & Luxury',
  ferrari:     'Automotive & Luxury',
  lamborghini: 'Automotive & Luxury',
  renault:     'Automotive & Luxury',
  tesla:       'Automotive & Luxury',

  // Gaming & Entertainment
  playstation: 'Gaming & Entertainment',

  // Enterprise & Corporate
  ibm:       'Enterprise & Corporate',
  semrush:   'Enterprise & Corporate',
  mintlify:  'Enterprise & Corporate',
  clay:      'Enterprise & Corporate',
  nvidia:    'Enterprise & Corporate',
  vodafone:  'Enterprise & Corporate',
  spacex:    'Enterprise & Corporate',
  voltagent: 'Enterprise & Corporate',
};

function slugToName(slug: string): string {
  const overrides: Record<string, string> = {
    'bmw-m':      'BMW M',
    'x.ai':       'xAI',
    'mistral.ai': 'Mistral AI',
    'together.ai': 'Together AI',
    'opencode.ai': 'OpenCode AI',
    'linear.app':  'Linear',
    runwayml:      'Runway ML',
    posthog:       'PostHog',
    theverge:      'The Verge',
    ibm:           'IBM',
    nvidia:        'NVIDIA',
    spacex:        'SpaceX',
  };
  if (overrides[slug]) return overrides[slug];
  return slug
    .split(/[-.]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function listDesignTemplates(): TemplateEntry[] {
  try {
    return readdirSync(TEMPLATES_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const slug = f.replace(/\.md$/, '');
        return {
          slug,
          name: slugToName(slug),
          industry: INDUSTRY_MAP[slug] ?? 'Other',
        };
      })
      .sort((a, b) => a.industry.localeCompare(b.industry) || a.slug.localeCompare(b.slug));
  } catch {
    return [];
  }
}

export function listDesignTemplatesByIndustry(): IndustryGroup {
  const flat = listDesignTemplates();
  const groups: IndustryGroup = {};
  for (const entry of flat) {
    if (!groups[entry.industry]) groups[entry.industry] = [];
    groups[entry.industry].push(entry);
  }
  return groups;
}

export function listDesignTemplatesForScope(scope: string): IndustryGroup {
  const all = listDesignTemplatesByIndustry();
  const normalized = scope.toLowerCase();

  // Map common scope keywords to industry group keys
  const scopeMap: Array<[string[], string[]]> = [
    [['ecommerce', 'e-commerce', 'retail', 'shop', 'store', 'marketplace'], ['E-commerce & Retail', 'Fintech & Crypto', 'Media & Consumer Tech']],
    [['fintech', 'finance', 'banking', 'payments', 'crypto', 'wallet'], ['Fintech & Crypto', 'Enterprise & Corporate']],
    [['saas', 'productivity', 'b2b', 'dashboard', 'tool', 'platform', 'workspace'], ['Productivity & SaaS', 'Backend & Infrastructure', 'Developer Tools']],
    [['ai', 'llm', 'ml', 'machine learning', 'chatbot', 'assistant'], ['AI & LLM Platforms', 'Developer Tools', 'Backend & Infrastructure']],
    [['developer', 'devtools', 'dev tool', 'ide', 'cli', 'api', 'sdk'], ['Developer Tools', 'Backend & Infrastructure', 'AI & LLM Platforms']],
    [['design', 'creative', 'agency', 'portfolio', 'studio'], ['Design & Creative', 'Media & Consumer Tech']],
    [['automotive', 'car', 'vehicle', 'luxury', 'ev'], ['Automotive & Luxury']],
    [['gaming', 'game', 'entertainment', 'streaming', 'media'], ['Gaming & Entertainment', 'Media & Consumer Tech']],
    [['enterprise', 'corporate', 'b2b', 'business', 'marketing'], ['Enterprise & Corporate', 'Productivity & SaaS']],
    [['mobile', 'app', 'consumer'], ['Media & Consumer Tech', 'Productivity & SaaS', 'Design & Creative']],
  ];

  const matchedIndustries = new Set<string>();
  for (const [keywords, industries] of scopeMap) {
    if (keywords.some((k) => normalized.includes(k))) {
      industries.forEach((i) => matchedIndustries.add(i));
    }
  }

  // Fall back to all groups if no scope keyword matched
  if (matchedIndustries.size === 0) return all;

  return Object.fromEntries(
    Object.entries(all).filter(([industry]) => matchedIndustries.has(industry))
  );
}

export function getDesignTemplate(slug: string): DesignTemplate | null {
  const sanitized = slug.replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = join(TEMPLATES_DIR, `${sanitized}.md`);
  try {
    const content = readFileSync(filePath, 'utf8');
    return { name: slugToName(sanitized), slug: sanitized, content };
  } catch {
    return null;
  }
}
