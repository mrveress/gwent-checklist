import { useState, type CSSProperties } from 'react';
import type { Filters, GameData, GatheredStatusFilter, TranslationPack } from '../types';
import { EMPTY_FILTERS } from '../types';
import type { UiStrings } from '../types';
import { groupTone } from '../filterVisuals';
import { MultiSelect } from './MultiSelect';

interface FilterBarProps {
  catalog: GameData;
  allTags: string[];
  filters: Filters;
  onChange: (next: Filters) => void;
  translation: TranslationPack;
  ui: UiStrings;
}

function attrOptions(
  catalog: GameData,
  key: 'faction' | 'type' | 'expansion' | 'row' | 'ability',
  translation: TranslationPack,
) {
  return catalog.attributes[key].map((value) => ({
    value,
    label: translation.attributes[key]?.[value]?.name ?? value,
  }));
}

const STATUS_OPTIONS: { value: GatheredStatusFilter; icon: string }[] = [
  { value: 'all', icon: '◎' },
  { value: 'gathered', icon: '✓' },
  { value: 'missing', icon: '○' },
];

export function FilterBar({
  catalog,
  allTags,
  filters,
  onChange,
  translation,
  ui,
}: FilterBarProps) {
  const [attributesOpen, setAttributesOpen] = useState(false);

  const patch = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const attributeFilterCount =
    filters.factions.length +
    filters.types.length +
    filters.expansions.length +
    filters.rows.length +
    filters.abilities.length +
    filters.tags.length;

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    attributeFilterCount > 0 ||
    filters.gathered !== 'all';

  const tagOptions = allTags.map((tag) => {
    const abilityLabel = translation.attributes.ability?.[tag]?.name;
    const typeLabel = translation.attributes.type?.[tag]?.name;
    const expansionLabel = translation.attributes.expansion?.[tag]?.name;
    return {
      value: tag,
      label: abilityLabel ?? typeLabel ?? expansionLabel ?? tag.replace(/_/g, ' '),
    };
  });

  const statusTone = groupTone('status');

  return (
    <section className="filters" aria-label={ui.filters}>
      <div className="filters__search">
        <label className="field field--search" htmlFor="card-search">
          <span className="visually-hidden">{ui.searchPlaceholder}</span>
          <span className="filters__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            id="card-search"
            className="field__control field__control--search"
            type="search"
            placeholder={ui.searchPlaceholder}
            value={filters.search}
            onChange={(event) => patch('search', event.target.value)}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="filters__attrs">
        <button
          type="button"
          className={`filters__toggle${attributesOpen ? ' filters__toggle--open' : ''}`}
          aria-expanded={attributesOpen}
          aria-controls="attribute-filters"
          onClick={() => setAttributesOpen((value) => !value)}
        >
          <span className="filters__toggle-label">
            <span aria-hidden="true">{attributesOpen ? '▾' : '▸'}</span>
            {attributesOpen ? ui.hideFilters : ui.showFilters}
          </span>
          {attributeFilterCount > 0 ? (
            <span className="filters__toggle-badge">
              {attributeFilterCount} {ui.activeFilters}
            </span>
          ) : null}
        </button>

        {attributesOpen ? (
          <div id="attribute-filters" className="filters__stack">
            <MultiSelect
              id="filter-faction"
              label={translation.attributeLabels.faction ?? ui.faction}
              group="faction"
              options={attrOptions(catalog, 'faction', translation)}
              values={filters.factions}
              onChange={(values) => patch('factions', values)}
            />
            <MultiSelect
              id="filter-type"
              label={translation.attributeLabels.type ?? ui.type}
              group="type"
              options={attrOptions(catalog, 'type', translation)}
              values={filters.types}
              onChange={(values) => patch('types', values)}
            />
            <MultiSelect
              id="filter-expansion"
              label={translation.attributeLabels.expansion ?? ui.expansion}
              group="expansion"
              options={attrOptions(catalog, 'expansion', translation)}
              values={filters.expansions}
              onChange={(values) => patch('expansions', values)}
            />
            <MultiSelect
              id="filter-row"
              label={translation.attributeLabels.row ?? ui.row}
              group="row"
              options={attrOptions(catalog, 'row', translation)}
              values={filters.rows}
              onChange={(values) => patch('rows', values)}
            />
            <MultiSelect
              id="filter-ability"
              label={translation.attributeLabels.ability ?? ui.ability}
              group="ability"
              options={attrOptions(catalog, 'ability', translation)}
              values={filters.abilities}
              onChange={(values) => patch('abilities', values)}
            />
            <MultiSelect
              id="filter-tags"
              label={translation.attributeLabels.tags ?? ui.tags}
              group="tags"
              options={tagOptions}
              values={filters.tags}
              onChange={(values) => patch('tags', values)}
            />

            {attributeFilterCount > 0 ? (
              <div className="filters__actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--tiny"
                  onClick={() =>
                    onChange({
                      ...filters,
                      factions: [],
                      types: [],
                      expansions: [],
                      rows: [],
                      abilities: [],
                      tags: [],
                    })
                  }
                >
                  {ui.clearFilters}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <fieldset className="filter-row filter-row--status filters__status">
        <legend className="filter-row__legend">{ui.status}</legend>
        <div
          className="status-seg"
          role="radiogroup"
          aria-label={ui.status}
          style={{ '--chip-color': statusTone.color } as CSSProperties}
        >
          {STATUS_OPTIONS.map((option) => {
            const active = filters.gathered === option.value;
            const label =
              option.value === 'all'
                ? ui.all
                : option.value === 'gathered'
                  ? ui.gathered
                  : ui.missing;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={`status-seg__btn${active ? ' status-seg__btn--on' : ''}`}
                onClick={() => patch('gathered', option.value)}
              >
                <span aria-hidden="true">{option.icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {hasActiveFilters && (filters.search.trim() !== '' || filters.gathered !== 'all') ? (
        <div className="filters__actions filters__actions--footer">
          <button type="button" className="btn btn--ghost btn--tiny" onClick={() => onChange(EMPTY_FILTERS)}>
            {ui.clearFilters}
          </button>
        </div>
      ) : null}
    </section>
  );
}
