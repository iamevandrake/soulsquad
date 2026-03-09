import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_INSTANCE_ID = "default";
const INSTANCE_ID_RE = /^[a-zA-Z0-9_-]+$/;
const PATH_SEGMENT_RE = /^[a-zA-Z0-9_-]+$/;

function expandHomePrefix(value: string): string {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.resolve(os.homedir(), value.slice(2));
  return value;
}

/**
 * Migrate legacy ~/.paperclip data to ~/.opensoul on first run after rebrand.
 * Moves instance data (db, config, secrets, workspaces) so existing installs
 * keep working without data loss.
 */
function migrateLegacyHomeDir(newHome: string): void {
  const legacyHome = path.resolve(os.homedir(), ".paperclip");
  if (!fs.existsSync(legacyHome)) return;

  const legacyInstances = path.join(legacyHome, "instances");
  if (!fs.existsSync(legacyInstances)) return;

  const newInstances = path.join(newHome, "instances");

  // Only migrate if the new instances dir doesn't have a db yet
  // (i.e., no successful init has happened at the new path)
  const defaultInstance = path.join(newInstances, "default");
  const defaultDb = path.join(defaultInstance, "db", "PG_VERSION");
  if (fs.existsSync(defaultDb)) return;

  // Move each instance dir from legacy to new home
  for (const entry of fs.readdirSync(legacyInstances)) {
    const src = path.join(legacyInstances, entry);
    const dst = path.join(newInstances, entry);
    if (!fs.statSync(src).isDirectory()) continue;

    // Remove empty destination if it exists (e.g. mkdir'd but no data)
    if (fs.existsSync(dst)) {
      try {
        fs.rmSync(dst, { recursive: true });
      } catch {
        continue; // skip if we can't remove, don't overwrite
      }
    }

    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
  }
}

export function resolvePaperclipHomeDir(): string {
  const envHome = (process.env.OPENSOUL_HOME ?? process.env.PAPERCLIP_HOME)?.trim();
  if (envHome) return path.resolve(expandHomePrefix(envHome));
  const home = path.resolve(os.homedir(), ".opensoul");
  migrateLegacyHomeDir(home);
  return home;
}

export function resolvePaperclipInstanceId(): string {
  const raw = (process.env.OPENSOUL_INSTANCE_ID ?? process.env.PAPERCLIP_INSTANCE_ID)?.trim() || DEFAULT_INSTANCE_ID;
  if (!INSTANCE_ID_RE.test(raw)) {
    throw new Error(`Invalid PAPERCLIP_INSTANCE_ID '${raw}'.`);
  }
  return raw;
}

export function resolvePaperclipInstanceRoot(): string {
  return path.resolve(resolvePaperclipHomeDir(), "instances", resolvePaperclipInstanceId());
}

export function resolveDefaultConfigPath(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "config.json");
}

export function resolveDefaultEmbeddedPostgresDir(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "db");
}

export function resolveDefaultLogsDir(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "logs");
}

export function resolveDefaultSecretsKeyFilePath(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "secrets", "master.key");
}

export function resolveDefaultStorageDir(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "data", "storage");
}

export function resolveDefaultBackupDir(): string {
  return path.resolve(resolvePaperclipInstanceRoot(), "data", "backups");
}

export function resolveDefaultAgentWorkspaceDir(agentId: string): string {
  const trimmed = agentId.trim();
  if (!PATH_SEGMENT_RE.test(trimmed)) {
    throw new Error(`Invalid agent id for workspace path '${agentId}'.`);
  }
  return path.resolve(resolvePaperclipInstanceRoot(), "workspaces", trimmed);
}

export function resolveHomeAwarePath(value: string): string {
  return path.resolve(expandHomePrefix(value));
}
