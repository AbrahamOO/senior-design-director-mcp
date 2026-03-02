/**
 * File-based persistent storage for project briefs.
 * Briefs are stored as JSON files in ~/.senior-design-director-mcp/projects/
 * and loaded into memory on startup so they survive server restarts.
 */

import { ProjectBrief } from '../types/index.js';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const STORAGE_DIR = join(homedir(), '.senior-design-director-mcp', 'projects');

class BriefStorage {
  private briefs: Map<string, ProjectBrief> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private ensureDir(): void {
    if (!existsSync(STORAGE_DIR)) {
      mkdirSync(STORAGE_DIR, { recursive: true });
    }
  }

  private filePath(projectName: string): string {
    const safe = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return join(STORAGE_DIR, `${safe}.json`);
  }

  private loadFromDisk(): void {
    try {
      this.ensureDir();
      const files = readdirSync(STORAGE_DIR).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = readFileSync(join(STORAGE_DIR, file), 'utf-8');
          const brief: ProjectBrief = JSON.parse(content);
          if (brief.PROJECT_NAME) {
            this.briefs.set(brief.PROJECT_NAME.toLowerCase(), brief);
          }
        } catch {
          // Skip malformed files
        }
      }
    } catch {
      // If storage dir doesn't exist yet, start empty
    }
  }

  save(projectName: string, brief: ProjectBrief): void {
    this.ensureDir();
    this.briefs.set(projectName.toLowerCase(), brief);
    writeFileSync(this.filePath(projectName), JSON.stringify(brief, null, 2), 'utf-8');
  }

  get(projectName: string): ProjectBrief | undefined {
    return this.briefs.get(projectName.toLowerCase());
  }

  exists(projectName: string): boolean {
    return this.briefs.has(projectName.toLowerCase());
  }

  list(): string[] {
    return Array.from(this.briefs.keys());
  }

  delete(projectName: string): boolean {
    const key = projectName.toLowerCase();
    if (!this.briefs.has(key)) return false;
    this.briefs.delete(key);
    const fp = this.filePath(projectName);
    if (existsSync(fp)) {
      unlinkSync(fp);
    }
    return true;
  }

  update(projectName: string, updates: Partial<ProjectBrief>): boolean {
    const existing = this.get(projectName);
    if (!existing) return false;
    const updated = { ...existing, ...updates };
    this.save(projectName, updated);
    return true;
  }
}

export const briefStorage = new BriefStorage();
