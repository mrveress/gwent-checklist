import { useCallback, useMemo, useState } from 'react';
import type { Card, TranslationPack } from '../types';
import type { UiStrings } from '../types';
import { CardItem } from './CardItem';
import { CardDetailModal } from './CardDetailModal';

interface CardGridProps {
  cards: Card[];
  totalCount: number;
  gatheredSet: Set<string>;
  translation: TranslationPack;
  ui: UiStrings;
  onToggle: (cardId: string) => void;
}

export function CardGrid({
  cards,
  totalCount,
  gatheredSet,
  translation,
  ui,
  onToggle,
}: CardGridProps) {
  const [detailId, setDetailId] = useState<string | null>(null);

  const detailCard = useMemo(
    () => (detailId ? cards.find((card) => card.id === detailId) ?? null : null),
    [cards, detailId],
  );

  // Keep modal open even if filters hide the card from the current list
  const [pinnedCard, setPinnedCard] = useState<Card | null>(null);
  const activeCard = detailCard ?? pinnedCard;

  const openDetails = useCallback((cardId: string) => {
    const card = cards.find((item) => item.id === cardId) ?? null;
    setPinnedCard(card);
    setDetailId(cardId);
  }, [cards]);

  const closeDetails = useCallback(() => {
    setDetailId(null);
    setPinnedCard(null);
  }, []);

  return (
    <section className="results" aria-live="polite">
      <p className="results__count">
        {ui.showing} <strong>{cards.length}</strong> {ui.of} {totalCount} {ui.cards}
      </p>

      {cards.length === 0 ? (
        <p className="results__empty">{ui.noResults}</p>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              gathered={gatheredSet.has(card.id)}
              translation={translation}
              ui={ui}
              onToggle={onToggle}
              onOpenDetails={openDetails}
            />
          ))}
        </div>
      )}

      {activeCard && detailId ? (
        <CardDetailModal
          card={activeCard}
          gathered={gatheredSet.has(activeCard.id)}
          translation={translation}
          ui={ui}
          onClose={closeDetails}
          onToggle={onToggle}
        />
      ) : null}
    </section>
  );
}
