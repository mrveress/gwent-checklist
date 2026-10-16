import { useDeferredValue, useMemo } from 'react';
import type { Card, Filters, GameData, TranslationPack } from '../types';

function matchesMulti(selected: string[], value: string | null | undefined): boolean {
  if (selected.length === 0) return true;
  if (!value) return false;
  return selected.includes(value);
}

function matchesAny(selected: string[], values: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((item) => values.includes(item));
}

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase();
}

export function useFilteredCards(
  catalog: GameData,
  filters: Filters,
  translation: TranslationPack,
  gatheredSet: Set<string>,
): Card[] {
  const deferredSearch = useDeferredValue(filters.search);

  return useMemo(() => {
    const query = normalize(deferredSearch);

    return catalog.cards.filter((card) => {
      if (!matchesMulti(filters.factions, card.faction)) return false;
      if (!matchesMulti(filters.types, card.type)) return false;
      if (!matchesMulti(filters.expansions, card.expansion)) return false;
      if (!matchesMulti(filters.rows, card.row)) return false;
      if (!matchesAny(filters.abilities, card.abilities)) return false;
      if (!matchesAny(filters.tags, card.tags)) return false;

      const isGathered = gatheredSet.has(card.id);
      if (filters.gathered === 'gathered' && !isGathered) return false;
      if (filters.gathered === 'missing' && isGathered) return false;

      if (!query) return true;

      const t = translation.cards[card.id];
      const haystack = [
        card.slug,
        card.faction,
        card.type,
        card.expansion,
        card.row ?? '',
        ...card.abilities,
        ...card.tags,
        t?.name ?? '',
        t?.description ?? '',
        t?.howToGet ?? '',
        t?.effect ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase();

      return haystack.includes(query);
    });
  }, [catalog, deferredSearch, filters, translation, gatheredSet]);
}
