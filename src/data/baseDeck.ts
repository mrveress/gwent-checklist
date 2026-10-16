import type { Card } from '../types';

export function getBaseDeckCardIds(cards: Card[]): string[] {
  return cards.filter((card) => card.preselected).map((card) => card.id);
}
