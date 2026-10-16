import { useEffect, useRef, type CSSProperties } from 'react';
import type { Card, TranslationPack } from '../types';
import { cardImageUrl } from '../data/loadCatalog';
import type { UiStrings } from '../types';
import { optionTone } from '../filterVisuals';

interface CardDetailModalProps {
  card: Card;
  gathered: boolean;
  translation: TranslationPack;
  ui: UiStrings;
  onClose: () => void;
  onToggle: (cardId: string) => void;
}

export function CardDetailModal({
  card,
  gathered,
  translation,
  ui,
  onClose,
  onToggle,
}: CardDetailModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = translation.cards[card.id];
  const name = t?.name ?? card.slug;
  const factionName =
    translation.attributes.faction?.[card.faction]?.name ?? card.faction;
  const typeName = translation.attributes.type?.[card.type]?.name ?? card.type;
  const expansionName =
    translation.attributes.expansion?.[card.expansion]?.name ?? card.expansion;
  const rowName = card.row
    ? (translation.attributes.row?.[card.row]?.name ?? card.row)
    : null;
  const factionTone = optionTone('faction', card.faction);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-title"
        style={{ '--faction-color': factionTone.color } as CSSProperties}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label={ui.close}
        >
          ✕
        </button>

        <div className="modal__layout">
          <div className="modal__art">
            <img
              src={cardImageUrl(card.imageId)}
              alt=""
              width={220}
              height={318}
            />
          </div>

          <div className="modal__content">
            <p className="modal__eyebrow">{factionName}</p>
            <h2 id="card-detail-title" className="modal__title">
              {name}
            </h2>

            <p className="modal__meta">
              <span>{typeName}</span>
              {card.strength != null ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {ui.strength} {card.strength}
                  </span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{expansionName}</span>
              {rowName ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{rowName}</span>
                </>
              ) : null}
            </p>

            {t?.description ? (
              <section className="modal__section">
                <h3>{ui.description}</h3>
                <p>{t.description}</p>
              </section>
            ) : null}

            {card.abilities.length > 0 ? (
              <section className="modal__section">
                <h3>{translation.attributeLabels.ability ?? ui.ability}</h3>
                <p>
                  {card.abilities
                    .map((ability) => translation.attributes.ability?.[ability]?.name ?? ability)
                    .join(', ')}
                </p>
              </section>
            ) : null}

            {t?.effect ? (
              <section className="modal__section">
                <h3>{translation.attributeLabels.effect ?? ui.effect}</h3>
                <p>{t.effect}</p>
              </section>
            ) : null}

            {t?.howToGet ? (
              <section className="modal__section">
                <h3>{translation.attributeLabels.howToGet ?? ui.howToGet}</h3>
                <p>{t.howToGet}</p>
              </section>
            ) : null}

            <div className="modal__actions">
              <button
                type="button"
                className={`btn ${gathered ? 'btn--ghost' : 'btn--primary'}`}
                onClick={() => onToggle(card.id)}
              >
                {gathered ? ui.markMissing : ui.markGathered}
              </button>
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                {ui.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
