/**
 * One-command installer for senior-design-director-mcp
 * Detects installed MCP clients and writes the server config automatically.
 *
 * Usage: npx senior-design-director-mcp install
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';

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
