/**
 * One-command installer for senior-design-director-mcp
 * Detects installed MCP clients and writes the server config automatically.
 *
 * Usage: npx senior-design-director-mcp install
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const { version: SKILL_VERSION } = createRequire(import.meta.url)('../package.json') as { version: string };

const SERVER_CONFIG = {
  command: 'npx',
  args: ['-y', 'senior-design-director-mcp'],
} as const;

const SERVER_KEY = 'senior-design-director';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function home(...parts: string[]): string {
  return join(homedir(), ...parts);
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function readJson(filePath: string): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeJson(filePath: string, data: Record<string, unknown>): void {
  ensureDir(filePath);
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function mergeServerConfig(existing: Record<string, unknown>): Record<string, unknown> {
  const servers =
    (existing['mcpServers'] as Record<string, unknown> | undefined) ?? {};
  return {
    ...existing,
    mcpServers: {
      ...servers,
      [SERVER_KEY]: SERVER_CONFIG,
    },
  };
}

// ─── Client installers ───────────────────────────────────────────────────────

function installClaudeDesktop(): { installed: boolean; path: string; note?: string } {
  const configPath =
    process.platform === 'win32'
      ? join(process.env['APPDATA'] ?? home('AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json')
      : home('Library', 'Application Support', 'Claude', 'claude_desktop_config.json');

  if (!existsSync(dirname(configPath))) {
    return { installed: false, path: configPath, note: 'Claude Desktop not found — skipping.' };
  }

  const updated = mergeServerConfig(readJson(configPath));
  writeJson(configPath, updated);
  return { installed: true, path: configPath };
}

function installClaudeCode(): { installed: boolean; path: string; note?: string } {
  const configPath = home('.claude.json');

  const existing = existsSync(configPath) ? readJson(configPath) : {};
  const updated = mergeServerConfig(existing);
  writeJson(configPath, updated);
  return { installed: true, path: configPath };
}

function installCursor(): { installed: boolean; path: string; note?: string } {
  // Cursor stores MCP config at ~/.cursor/mcp.json
  const configPath = home('.cursor', 'mcp.json');

  if (!existsSync(home('.cursor'))) {
    return { installed: false, path: configPath, note: 'Cursor not found — skipping.' };
  }

  const updated = mergeServerConfig(readJson(configPath));
  writeJson(configPath, updated);
  return { installed: true, path: configPath };
}

function installWindsurf(): { installed: boolean; path: string; note?: string } {
  const configPath =
    process.platform === 'win32'
      ? join(process.env['USERPROFILE'] ?? homedir(), '.codeium', 'windsurf', 'mcp_config.json')
      : home('.codeium', 'windsurf', 'mcp_config.json');

  if (!existsSync(dirname(configPath))) {
    return { installed: false, path: configPath, note: 'Windsurf not found — skipping.' };
  }

  const updated = mergeServerConfig(readJson(configPath));
  writeJson(configPath, updated);
  return { installed: true, path: configPath };
}

function installCodex(): { installed: boolean; path: string; note?: string } {
  // Codex uses TOML — we append the stanza if not already present
  const configPath = home('.codex', 'config.toml');

  if (!existsSync(home('.codex'))) {
    return { installed: false, path: configPath, note: 'Codex not found — skipping.' };
  }

  const tomlStanza = `\n[mcp_servers.${SERVER_KEY}]\ncommand = "npx"\nargs = ["-y", "senior-design-director-mcp"]\n`;

  let existing = '';
  if (existsSync(configPath)) {
    existing = readFileSync(configPath, 'utf8');
  }

  if (existing.includes(`[mcp_servers.${SERVER_KEY}]`)) {
    return { installed: true, path: configPath, note: 'Already configured — no changes made.' };
  }

  ensureDir(configPath);
  writeFileSync(configPath, existing + tomlStanza, 'utf8');
  return { installed: true, path: configPath };
}

// ─── Skill content (embedded so direct-write works without cloning the repo) ──

function buildSkillContent(): string {
  return `---
name: senior-design-director
description: Senior design director guidance for web, mobile, and immersive 3D projects — project discovery, design systems, color palettes, accessibility, performance, platform-specific design (iOS HIG, Material Design 3), and scroll-driven 3D web experiences. Use when working on any UI/UX design task, building a design system, validating accessibility, analyzing web performance, designing for iOS or Android, or building cinematic 3D scroll experiences.
license: MIT
metadata:
  author: AbrahamOO
  version: "${SKILL_VERSION}"
  mcp-package: senior-design-director-mcp
compatibility: Requires the senior-design-director-mcp MCP server to be running. Install via npx -y senior-design-director-mcp.
---

# Senior Design Director

This skill activates world-class design director thinking for any UI/UX or immersive 3D project. It pairs with the \`senior-design-director-mcp\` MCP server, which provides the underlying tools.

## MCP Server Setup

Before using the tools in this skill, ensure the MCP server is configured in your client:

\`\`\`json
{
  "mcpServers": {
    "senior-design-director": {
      "command": "npx",
      "args": ["-y", "senior-design-director-mcp"]
    }
  }
}
\`\`\`

---

## Standard Workflow

Always follow this sequence. Each step builds on the previous one.

### Step 1 — Project Discovery (always first)

Run \`complete-project-discovery\` before anything else. This creates the project brief that all subsequent tools draw from.

**Required fields**: \`projectName\`, \`projectDescription\`, \`industryCategory\`, \`audienceRole\`, \`primaryCTA\`, \`emotionalTone\`

**Critical**: Include \`platform\` to unlock platform-specific outputs in every downstream tool:
- \`web\` — CSS tokens, rem/px, fluid clamp() typography
- \`mobile-ios\` — pt tokens, Dynamic Type, SF Symbols, UIKit/SwiftUI specs
- \`mobile-android\` — dp/sp tokens, Material type scale, Compose/Material 3 specs
- \`mobile-cross-platform\` — React Native / Flutter logical units
- \`both\` — web + mobile combined

### Step 2 — Color System

1. \`generate-color-palette\` — AI-driven palette based on emotional tone + industry
2. \`validate-color-contrast\` — WCAG AA check on all text/background pairs

### Step 3 — Design System

1. \`create-design-system\` — Typography scale, spacing, breakpoints, motion tokens
2. \`generate-component-library\` — Platform-appropriate component specs (buttons, cards, forms, navigation, modals)

### Step 4 — Content Strategy

1. \`generate-content-architecture\` — Three-act narrative structure mapped to page/screen sections
2. \`generate-copy-guidelines\` — Brand voice, tone, and writing rules

### Step 5 — Accessibility Validation

Use \`check-accessibility\` continuously, not just at the end.

**Web checks**: colors, semantic HTML, form labels, heading hierarchy, ARIA labels, keyboard nav

**Mobile checks**: touch targets (44pt iOS / 48dp Android), Dynamic Type / sp scaling, VoiceOver / TalkBack labels, Reduce Motion, OLED background halation

Use \`get-accessibility-checklist\` for the full WCAG 2.2 AA + Apple + Android checklist.

### Step 6 — Performance

**Web**: \`analyze-performance\` → \`get-core-web-vitals-targets\` → \`get-performance-budget\`

**Mobile**: \`analyze-mobile-performance\` → \`get-mobile-performance-targets\`

### Step 7 — Immersive 3D (optional)

When the project calls for a cinematic scroll-driven 3D web experience:

Run \`generate-3d-experience\` with:
- \`concept\` — the 3D world narrative (e.g. "crystalline neural network", "deep ocean bioluminescence")
- \`style\` — \`cosmic\` | \`architectural\` | \`organic\` | \`minimal\` | \`brutalist\` | \`liquid\` | \`crystalline\`
- \`sections\` — 3–7 scroll scenes
- \`primaryColor\` — brand hex
- \`includeShaders\` — \`true\` for GLSL vertex displacement shaders

Output includes: React Three Fiber scene, CatmullRom camera spline, scroll→animation hook, postprocessing pipeline, and mobile fallback.

---

## Tool Reference

### Project Management
| Tool | When to use |
|------|------------|
| \`complete-project-discovery\` | Start of every new project |
| \`get-project-brief\` | Retrieve a saved brief by name |
| \`list-projects\` | See all saved briefs |
| \`update-project-brief\` | Update individual fields without re-running discovery |
| \`delete-project\` | Remove a project |
| \`get-discovery-questions\` | Show users the 15 discovery questions to fill in manually |

### Design System
| Tool | When to use |
|------|------------|
| \`generate-color-palette\` | After discovery; generates 3 palette options with rationale |
| \`validate-color-contrast\` | Any time you have a foreground/background hex pair |
| \`create-design-system\` | After color palette; generates full token set |
| \`generate-component-library\` | After design system; generates component specs |

### Content
| Tool | When to use |
|------|------------|
| \`generate-content-architecture\` | Planning page/screen structure |
| \`generate-copy-guidelines\` | Before writing any copy |

### Accessibility
| Tool | When to use |
|------|------------|
| \`check-accessibility\` | After any visual or structural design decision |
| \`get-accessibility-checklist\` | Audit phase; gives full checklist with must/should/recommended tiers |

### Performance
| Tool | When to use |
|------|------------|
| \`analyze-performance\` | Given real Core Web Vitals metrics |
| \`get-core-web-vitals-targets\` | Reference — LCP/FID/CLS thresholds |
| \`get-performance-budget\` | Budgeting JS, CSS, image, font payload |
| \`analyze-mobile-performance\` | Given real app metrics (launch time, fps, memory) |
| \`get-mobile-performance-targets\` | Reference — iOS and Android benchmark tables |

### Immersive 3D
| Tool | When to use |
|------|------------|
| \`generate-3d-experience\` | Building a scroll-driven cinematic 3D web experience |

---

## Design Resources (MCP Resources)

Load these via the resource system when you need reference material mid-task:

| URI | Contains |
|-----|---------|
| \`reference://easing\` | CSS easing functions, timing ranges (150ms–1800ms) |
| \`reference://breakpoints\` | 320px–1600px breakpoints, mobile-first patterns |
| \`reference://typography-scale\` | Major Third scale, fluid clamp() formulas |
| \`reference://spacing\` | 8px base unit, 4px–128px scale |
| \`reference://color-psychology\` | Color meaning by hue and industry |
| \`reference://ios-hig\` | Apple HIG: navigation, Dynamic Type, safe areas, SF Symbols, spring motion |
| \`reference://material-design\` | Material 3: dynamic color, type scale, 4dp grid, motion easing |
| \`reference://gsap-motion\` | GSAP core API, ScrollTrigger, timelines, stagger, React integration |
| \`reference://webflow-animation\` | Webflow IX2 triggers, scroll reveal, scrub patterns |
| \`template://component/button\` | Accessible button HTML/CSS |
| \`template://component/card\` | Card component HTML/CSS |
| \`template://component/hero\` | Hero section HTML/CSS |
| \`template://component/navigation\` | Navigation HTML/CSS |
| \`template://component/form\` | Accessible form HTML/CSS |

---

## Design Principles

Apply these to every recommendation and every piece of code written during a design session:

- **Craft obsession** — Every spacing, color, and type decision is intentional
- **Platform fidelity** — Use native patterns. Fight the platform only with strong reason
- **Accessibility as baseline** — WCAG 2.2 AA is the floor, not the ceiling
- **Performance as design** — Speed is a feature; load time is part of UX
- **Systems thinking** — Tokens and components, not one-off decisions
- **Narrative architecture** — Page/screen structure follows story arc, not layout convention
- **Motion with purpose** — Animation guides, clarifies, or delights — never decorates
- **Depth over decoration** — 3D experiences earn every polygon; geometry serves the narrative

---

## Platform Quick Reference

### iOS
- Touch targets: minimum 44×44pt
- Typography: use Dynamic Type scale (from \`.caption2\` to \`.largeTitle\`)
- Safe areas: always respect \`safeAreaInsets\`
- Navigation: UINavigationController / NavigationStack patterns
- Spring motion: \`UISpringTimingParameters\` — damping 0.7, response 0.4

### Android (Material 3)
- Touch targets: minimum 48×48dp
- Typography: use sp units for all text (respects font scaling)
- Grid: 4dp base unit
- Color: use dynamic color roles (\`primary\`, \`surface\`, \`tertiary\`, etc.)
- Motion: standard easing 300ms, emphasized easing 500ms

### Web
- Fluid typography: \`clamp()\` between mobile and desktop sizes
- Breakpoints: 320 / 480 / 768 / 1024 / 1280 / 1536px
- Spacing: 8px base unit (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px)
- Focus management: visible focus ring always present

### 3D Web
- Camera: CatmullRom spline, lerp factor 0.05 for cinematic inertia
- Scroll mapping: \`useRef\` (not \`useState\`) for progress — avoids re-renders
- Performance: \`<AdaptiveDpr pixelated />\` + disable Bloom on mobile
- Reduced motion: freeze camera at section 0, disable all rotation
`;
}

// ─── Direct skill write (fallback when skills CLI is unavailable) ─────────────

function writeSkillDirectly(): { installed: boolean; path: string; note?: string } {
  // Claude Code reads skills from ~/.claude/skills/<name>/SKILL.md
  const skillDir = home('.claude', 'skills', 'senior-design-director');
  const skillPath = join(skillDir, 'SKILL.md');

  try {
    if (!existsSync(skillDir)) {
      mkdirSync(skillDir, { recursive: true });
    }
    writeFileSync(skillPath, buildSkillContent(), 'utf8');
    return { installed: true, path: skillPath };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { installed: false, path: skillPath, note: `Could not write skill file: ${msg}` };
  }
}

// ─── Skill installer ─────────────────────────────────────────────────────────

function installSkill(): { installed: boolean; note?: string } {
  // First attempt: use the skills CLI (supports Cursor, Windsurf, etc. in addition to Claude Code)
  const result = spawnSync(
    'npx',
    ['skills', 'add', 'https://github.com/AbrahamOO/senior-design-director-mcp', '--skill', 'senior-design-director', '--yes', '--global'],
    { stdio: 'pipe', encoding: 'utf8', timeout: 60_000 },
  );

  const timedOut = result.signal === 'SIGTERM' || (result.error as NodeJS.ErrnoException | undefined)?.code === 'ETIMEDOUT';
  const failed = result.error != null || result.status !== 0;

  if (!timedOut && !failed) {
    return { installed: true };
  }

  // Fallback: write the skill file directly to ~/.claude/skills/
  const direct = writeSkillDirectly();
  if (direct.installed) {
    return { installed: true, note: `skills CLI unavailable — wrote skill directly to ${direct.path}` };
  }

  const reason = timedOut
    ? 'skills CLI timed out'
    : (result.error?.message ?? result.stderr?.trim() ?? 'unknown error');
  return {
    installed: false,
    note: `Could not install skill automatically (${reason}). Run manually:\n     npx skills add https://github.com/AbrahamOO/senior-design-director-mcp --skill senior-design-director --yes --global`,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function runInstaller(): Promise<void> {
  console.log('\n  Senior Design Director MCP — Installer\n');
  console.log('  Detecting MCP clients on this machine...\n');

  const clients: Array<{ name: string; fn: () => { installed: boolean; path: string; note?: string } }> = [
    { name: 'Claude Desktop', fn: installClaudeDesktop },
    { name: 'Claude Code', fn: installClaudeCode },
    { name: 'Cursor', fn: installCursor },
    { name: 'Windsurf', fn: installWindsurf },
    { name: 'Codex (OpenAI)', fn: installCodex },
  ];

  let successCount = 0;
  let skipCount = 0;

  for (const client of clients) {
    const result = client.fn();
    if (result.installed) {
      console.log(`  ✓  ${client.name}`);
      if (result.note) {
        console.log(`     ${result.note}`);
      } else {
        console.log(`     Written to: ${result.path}`);
      }
      successCount++;
    } else {
      console.log(`  –  ${client.name}  ${result.note ?? ''}`);
      skipCount++;
    }
  }

  console.log(`\n  Done. ${successCount} client(s) configured, ${skipCount} skipped.\n`);

  // ─── Install Agent Skill ────────────────────────────────────────────────
  console.log('  Installing agent skill...\n');
  const skillResult = installSkill();
  if (skillResult.installed) {
    console.log('  ✓  Agent Skill (senior-design-director)\n');
  } else {
    console.log(`  –  Agent Skill  ${skillResult.note ?? ''}\n`);
  }

  if (successCount > 0) {
    console.log('  Next steps:');
    console.log('  • Restart any running MCP clients to pick up the new config.');
    console.log('  • In Claude Code: run  claude mcp list  to confirm the server is registered.');
    console.log('  • Start a new conversation and ask your agent to run get-discovery-questions.\n');
  } else {
    console.log('  No supported MCP clients detected.');
    console.log('  Add the config manually — see: https://github.com/AbrahamOO/senior-design-director-mcp#quick-start\n');
  }
}
