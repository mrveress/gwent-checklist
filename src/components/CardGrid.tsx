import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Card, TranslationPack } from '../types';
import type { UiStrings } from '../types';
import { readCardIdFromQuery, writeCardIdQuery } from '../navigation/cardQuery';
import { CardItem } from './CardItem';
import { CardDetailModal } from './CardDetailModal';

interface CardGridProps {
  cards: Card[];
  allCards: Card[];
  totalCount: number;
  gatheredSet: Set<string>;
  translation: TranslationPack;
  ui: UiStrings;
  language: string;
  availableLocales: string[];
  onLanguageChange: (locale: string) => void;
  onToggle: (cardId: string) => void;
}

export function CardGrid({
  cards,
  allCards,
  totalCount,
  gatheredSet,
  translation,
  ui,
  language,
  availableLocales,
  onLanguageChange,
  onToggle,
}: CardGridProps) {
  const [detailId, setDetailId] = useState<string | null>(() => readCardIdFromQuery());

  const cardsById = useMemo(() => {
    const map = new Map<string, Card>();
    for (const card of allCards) map.set(card.id, card);
    return map;
  }, [allCards]);

  const activeCard = detailId ? cardsById.get(detailId) ?? null : null;

  const openDetails = useCallback((cardId: string) => {
    if (!cardsById.has(cardId)) return;
    setDetailId(cardId);
    writeCardIdQuery(cardId);
  }, [cardsById]);

  const closeDetails = useCallback(() => {
    setDetailId(null);
    writeCardIdQuery(null);
  }, []);

  useEffect(() => {
    const syncFromUrl = () => {
      const id = readCardIdFromQuery();
      if (id && cardsById.has(id)) {
        setDetailId(id);
        return;
      }
      if (id && !cardsById.has(id)) {
        writeCardIdQuery(null);
      }
      setDetailId(null);
    };

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [cardsById]);

  useEffect(() => {
    if (detailId && !cardsById.has(detailId)) {
      setDetailId(null);
      writeCardIdQuery(null);
      return;
    }
    if (detailId) {
      writeCardIdQuery(detailId);
    }
  }, [detailId, cardsById]);

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

      {activeCard ? (
        <CardDetailModal
          card={activeCard}
          gathered={gatheredSet.has(activeCard.id)}
          translation={translation}
          ui={ui}
          language={language}
          availableLocales={availableLocales}
          onLanguageChange={onLanguageChange}
          onClose={closeDetails}
          onToggle={onToggle}
        />
      ) : null}
    </section>
  );
}
