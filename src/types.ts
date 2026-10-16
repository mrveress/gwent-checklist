export type AttributeKey = 'faction' | 'type' | 'expansion' | 'row' | 'ability';

export interface Card {
  id: string;
  slug: string;
  faction: string;
  type: string;
  expansion: string;
  strength: number | null;
  row: string | null;
  abilities: string[];
  tags: string[];
  imageId: string;
  /** True for cards given in a starter / base deck at game start. */
  preselected: boolean;
}

export interface GameData {
  attributes: Record<AttributeKey, string[]>;
  cards: Card[];
}

export interface AttributeValueLabel {
  name: string;
  description: string;
}

export interface CardTranslation {
  name: string;
  description: string;
  howToGet: string;
  effect?: string;
}

export interface UiStrings {
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  language: string;
  progress: string;
  gathered: string;
  missing: string;
  all: string;
  filters: string;
  clearFilters: string;
  faction: string;
  type: string;
  expansion: string;
  row: string;
  ability: string;
  tags: string;
  status: string;
  exportJson: string;
  importJson: string;
  markGathered: string;
  markMissing: string;
  howToGet: string;
  effect: string;
  strength: string;
  noResults: string;
  showing: string;
  of: string;
  cards: string;
  importSuccess: string;
  importError: string;
  exportSuccess: string;
  any: string;
  loading: string;
  loadError: string;
  showFilters: string;
  hideFilters: string;
  activeFilters: string;
  details: string;
  close: string;
  description: string;
  reset: string;
  resetConfirm: string;
  resetSuccess: string;
}

export interface TranslationPack {
  locale: string;
  ui: UiStrings;
  attributeLabels: Record<string, string>;
  attributes: Record<string, Record<string, AttributeValueLabel>>;
  cards: Record<string, CardTranslation>;
}

export type GatheredStatusFilter = 'all' | 'gathered' | 'missing';

export interface Filters {
  search: string;
  factions: string[];
  types: string[];
  expansions: string[];
  rows: string[];
  abilities: string[];
  tags: string[];
  gathered: GatheredStatusFilter;
}

export interface AppState {
  language: string;
  gathered: string[];
}

export const DEFAULT_LOCALE = 'en-US';

export const EMPTY_FILTERS: Filters = {
  search: '',
  factions: [],
  types: [],
  expansions: [],
  rows: [],
  abilities: [],
  tags: [],
  gathered: 'all',
};
