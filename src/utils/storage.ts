import {
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
  BaseDirectory,
} from '@tauri-apps/plugin-fs';

const DATA_DIR = BaseDirectory.AppData;

async function ensureDataDir() {
  try {
    const dirExists = await exists('LlamaCPP-Lab', { baseDir: DATA_DIR });
    if (!dirExists) {
      await mkdir('LlamaCPP-Lab', { baseDir: DATA_DIR, recursive: true });
    }
  } catch {
    await mkdir('LlamaCPP-Lab', { baseDir: DATA_DIR, recursive: true });
  }
}

function dataPath(file: string) {
  return `LlamaCPP-Lab/${file}`;
}

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const path = dataPath(file);
    const fileExists = await exists(path, { baseDir: DATA_DIR });
    if (!fileExists) return fallback;
    const content = await readTextFile(path, { baseDir: DATA_DIR });
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    return fallback;
  }
}

async function writeJSON<T>(file: string, data: T): Promise<void> {
  try {
    await ensureDataDir();
    const path = dataPath(file);
    await writeTextFile(path, JSON.stringify(data, null, 2), { baseDir: DATA_DIR });
  } catch (error) {
    console.error(`Error writing ${file}:`, error);
  }
}

export interface ConversationData {
  id: string;
  title: string;
  messages: any[];
  metrics: any[];
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_SETTINGS = {
  temperature: 0.7,
  max_tokens: 2048,
  top_p: 0.9,
  stop: [],
};

export async function loadConversations(): Promise<ConversationData[]> {
  return readJSON<ConversationData[]>('conversations.json', []);
}

export async function saveConversations(conversations: ConversationData[]): Promise<void> {
  await writeJSON('conversations.json', conversations);
}

export async function loadSettings(): Promise<any> {
  return readJSON('settings.json', DEFAULT_SETTINGS);
}

export async function saveSettings(settings: any): Promise<void> {
  await writeJSON('settings.json', settings);
}

export async function loadBenchmarks(): Promise<any[]> {
  return readJSON<any[]>('benchmarks.json', []);
}

export async function saveBenchmark(record: any): Promise<void> {
  const records = await loadBenchmarks();
  records.push(record);
  await writeJSON('benchmarks.json', records);
}
