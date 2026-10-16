import { memo, type CSSProperties } from 'react';
import type { Card, TranslationPack } from '../types';
import { cardImageUrl } from '../data/loadCatalog';
import type { UiStrings } from '../types';
import { optionTone } from '../filterVisuals';

interface CardItemProps {
  card: Card;
  gathered: boolean;
  translation: TranslationPack;
  ui: UiStrings;
  onToggle: (cardId: string) => void;
  onOpenDetails: (cardId: string) => void;
}

function CardItemComponent({
  card,
  gathered,
  translation,
  ui,
  onToggle,
  onOpenDetails,
}: CardItemProps) {
  const t = translation.cards[card.id];
  const name = t?.name ?? card.slug;
  const factionName =
    translation.attributes.faction?.[card.faction]?.name ?? card.faction;
  const typeName = translation.attributes.type?.[card.type]?.name ?? card.type;
  const factionTone = optionTone('faction', card.faction);

  return (
    <article
      className={`card${gathered ? ' card--gathered' : ''}`}
      data-faction={card.faction}
      style={{ '--faction-color': factionTone.color } as CSSProperties}
    >
      <div className="card__media-wrap">
        <button
          type="button"
          className="card__media"
          onClick={() => onToggle(card.id)}
          aria-pressed={gathered}
          aria-label={gathered ? `${ui.markMissing}: ${name}` : `${ui.markGathered}: ${name}`}
        >
          <img
            className="card__image"
            src={cardImageUrl(card.imageId)}
            alt=""
            loading="lazy"
            decoding="async"
            width={180}
            height={260}
          />
          <span className={`card__badge${gathered ? ' card__badge--on' : ''}`}>
            {gathered ? '✓' : '+'}
          </span>
          <span className="card__faction-dot" aria-hidden="true" title={factionName} />
        </button>

        <button
          type="button"
          className="card__glass"
          onClick={() => onOpenDetails(card.id)}
          aria-label={`${ui.details}: ${name}`}
          title={ui.details}
        >
          <span className="card__glass-icon" aria-hidden="true">
            ⌕
          </span>
          <span className="card__glass-label">{ui.details}</span>
        </button>
      </div>

      <div className="card__body">
        <header className="card__header">
          <h2 className="card__title">{name}</h2>
          <p className="card__meta">
            <span className="card__pill" data-kind="faction">
              {factionTone.icon} {factionName}
            </span>
            <span className="card__pill" data-kind="type">
              {optionTone('type', card.type).icon} {typeName}
            </span>
            {card.strength != null ? (
              <span className="card__pill" data-kind="strength">
                {ui.strength} {card.strength}
              </span>
            ) : null}
          </p>
        </header>

        {t?.howToGet ? (
          <p className="card__howto">
            <span className="card__howto-label">
              {translation.attributeLabels.howToGet ?? ui.howToGet}
            </span>
            {t.howToGet}
          </p>
        ) : null}

        <button
          type="button"
          className={`btn btn--tiny ${gathered ? 'btn--ghost' : 'btn--primary'} card__toggle`}
          onClick={() => onToggle(card.id)}
        >
          {gathered ? ui.markMissing : ui.markGathered}
        </button>
      </div>
    </article>
  );
}

export const CardItem = memo(CardItemComponent);
