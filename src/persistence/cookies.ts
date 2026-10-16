import type { AppState } from '../types';
import { DEFAULT_LOCALE } from '../types';
import { resolveLocale } from '../data/loadCatalog';

const COOKIE_NAME = 'gwent_checklist';
/** ~10 years */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeGathered(cardIdOrder: string[], gathered: Iterable<string>): string {
  const idIndex = new Map(cardIdOrder.map((id, index) => [id, index]));
  const bytes = new Uint8Array(Math.ceil(cardIdOrder.length / 8));

  for (const id of gathered) {
    const index = idIndex.get(id);
    if (index === undefined) continue;
    bytes[index >> 3]! |= 1 << (index & 7);
  }

  return bytesToBase64Url(bytes);
}

function decodeGathered(cardIdOrder: string[], encoded: string): string[] {
  try {
    const bytes = base64UrlToBytes(encoded);
    const gathered: string[] = [];
    for (let index = 0; index < cardIdOrder.length; index += 1) {
      const byte = bytes[index >> 3];
      if (byte === undefined) break;
      if (byte & (1 << (index & 7))) {
        gathered.push(cardIdOrder[index]!);
      }
    }
    return gathered;
  } catch {
    return [];
  }
}

function readRawCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function saveStateToCookie(
  state: AppState,
  availableLocales: string[],
  cardIdOrder: string[],
): void {
  const language = resolveLocale(availableLocales, state.language);
  const payload = `v1|${language}|${encodeGathered(cardIdOrder, state.gathered)}`;
  writeCookie(COOKIE_NAME, payload);
}

export function loadStateFromCookie(
  availableLocales: string[],
  cardIdOrder: string[],
): AppState | null {
  const raw = readRawCookie(COOKIE_NAME);
  if (!raw) return null;

  if (raw.startsWith('v1|')) {
    const [, language = DEFAULT_LOCALE, bits = ''] = raw.split('|');
    return {
      language: resolveLocale(availableLocales, language),
      gathered: decodeGathered(cardIdOrder, bits),
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return normalizeAppState(parsed, availableLocales);
  } catch {
    return null;
  }
}

export function normalizeAppState(
  input: Partial<AppState> | null | undefined,
  availableLocales: string[],
): AppState {
  const gathered = Array.isArray(input?.gathered)
    ? Array.from(new Set(input.gathered.filter((id): id is string => typeof id === 'string')))
    : [];

  return {
    language: resolveLocale(
      availableLocales,
      typeof input?.language === 'string' ? input.language : DEFAULT_LOCALE,
    ),
    gathered,
  };
}
