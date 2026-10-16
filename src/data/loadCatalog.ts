import type { Card, GameData, TranslationPack } from '../types';
import { DEFAULT_LOCALE } from '../types';
import { getBaseDeckCardIds } from './baseDeck';

const DATA_URL = './data/data.json';
const LOCALES_URL = './data/translations/locales.json';

export interface LoadedCatalog {
  catalog: GameData;
  availableLocales: string[];
  cardIdOrder: string[];
  cardById: Map<string, Card>;
  allTags: string[];
  /** Card IDs given at game start (base / starter decks). */
  baseDeckIds: string[];
}

const translationCache = new Map<string, TranslationPack>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status})`);
  }
  return (await response.json()) as T;
}

function sortLocales(locales: string[]): string[] {
  return [...locales].sort((a, b) => {
    if (a === DEFAULT_LOCALE) return -1;
    if (b === DEFAULT_LOCALE) return 1;
    return a.localeCompare(b);
  });
}

export async function loadCatalog(): Promise<LoadedCatalog> {
  const [catalog, localeList] = await Promise.all([
    fetchJson<GameData>(DATA_URL),
    fetchJson<string[]>(LOCALES_URL),
  ]);

  if (!Array.isArray(catalog.cards) || !catalog.attributes) {
    throw new Error('Invalid data.json shape');
  }
  if (!Array.isArray(localeList) || localeList.length === 0) {
    throw new Error('Invalid translations/locales.json');
  }

  const availableLocales = sortLocales(localeList);

  return {
    catalog,
    availableLocales,
    cardIdOrder: catalog.cards.map((card) => card.id),
    cardById: new Map(catalog.cards.map((card) => [card.id, card])),
    allTags: Array.from(new Set(catalog.cards.flatMap((card) => card.tags))).sort((a, b) =>
      a.localeCompare(b),
    ),
    baseDeckIds: getBaseDeckCardIds(catalog.cards),
  };
}

export function resolveLocale(
  availableLocales: string[],
  preferred?: string | null,
): string {
  if (preferred && availableLocales.includes(preferred)) return preferred;
  if (availableLocales.includes(DEFAULT_LOCALE)) return DEFAULT_LOCALE;
  return availableLocales[0] ?? DEFAULT_LOCALE;
}

export async function loadTranslation(
  availableLocales: string[],
  locale: string,
): Promise<TranslationPack> {
  const resolved = resolveLocale(availableLocales, locale);
  const cached = translationCache.get(resolved);
  if (cached) return cached;

  const pack = await fetchJson<TranslationPack>(
    `./data/translations/${resolved}.json`,
  );
  if (!pack.ui || typeof pack.ui !== 'object') {
    throw new Error(`Translation ${resolved} is missing a ui section`);
  }
  translationCache.set(resolved, pack);
  return pack;
}

export function cardImageUrl(imageId: string): string {
  return `./data/images/${imageId}.png`;
}
