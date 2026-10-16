import type { AppState } from '../types';
import { normalizeAppState } from './cookies';

export function serializeState(state: AppState): string {
  return JSON.stringify(
    {
      language: state.language,
      gathered: [...state.gathered].sort(),
    },
    null,
    2,
  );
}

export function parseStateJson(text: string): Partial<AppState> {
  const parsed = JSON.parse(text) as Partial<AppState>;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid checklist JSON');
  }
  return parsed;
}

export function downloadStateJson(state: AppState, filename = 'gwent-checklist.json'): void {
  const blob = new Blob([serializeState(state)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function readStateFromFile(
  file: File,
  availableLocales: string[],
): Promise<AppState> {
  const text = await file.text();
  return normalizeAppState(parseStateJson(text), availableLocales);
}
