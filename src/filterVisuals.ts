export type FilterGroup =
  | 'faction'
  | 'type'
  | 'expansion'
  | 'row'
  | 'ability'
  | 'tags'
  | 'status';

export interface FilterTone {
  /** CSS color used for chip accent */
  color: string;
  /** Short glyph / emoji shown before the label */
  icon: string;
}

const GROUP_DEFAULTS: Record<FilterGroup, FilterTone> = {
  faction: { color: '#4a5d4c', icon: '⬡' },
  type: { color: '#6b5344', icon: '▣' },
  expansion: { color: '#8a6a2f', icon: '◆' },
  row: { color: '#3f5f7a', icon: '▤' },
  ability: { color: '#7a4e3a', icon: '✦' },
  tags: { color: '#5a4a6a', icon: '#' },
  status: { color: '#2f6b4f', icon: '◎' },
};

const VALUE_TONES: Record<string, Partial<FilterTone>> = {
  // factions
  neutral: { color: '#6e7368', icon: '○' },
  northern: { color: '#2f5f9a', icon: '🛡' },
  nilfgaard: { color: '#2a2a28', icon: '⚜' },
  scoiatael: { color: '#3d6b3a', icon: '➳' },
  monsters: { color: '#6b2f3a', icon: '☠' },
  skellige: { color: '#2f6b6b', icon: '⚓' },

  // types
  leader: { color: '#8a6a2f', icon: '♛' },
  hero: { color: '#9a6b2f', icon: '★' },
  unit: { color: '#4a5d4c', icon: '♟' },
  special: { color: '#6b5344', icon: '❖' },
  weather: { color: '#3f5f7a', icon: '☁' },

  // expansions
  base: { color: '#5a6a4a', icon: '■' },
  'hearts-of-stone': { color: '#8a4a3a', icon: '♥' },
  'blood-and-wine': { color: '#6b2f4a', icon: '🍷' },

  // rows
  close: { color: '#8a4a2f', icon: '⚔' },
  ranged: { color: '#3f5f7a', icon: '🏹' },
  siege: { color: '#5a4a3a', icon: '🏰' },
  agile: { color: '#4a6b5a', icon: '⇄' },

  // abilities / tags (shared keys)
  spy: { color: '#5a4a6a', icon: '👁' },
  medic: { color: '#3a6b5a', icon: '+' },
  muster: { color: '#6b5a3a', icon: '☰' },
  tight_bond: { color: '#6b3a4a', icon: '⚭' },
  morale_boost: { color: '#8a6a2f', icon: '▲' },
  scorch: { color: '#9a3a2f', icon: '🔥' },
  berserker: { color: '#7a2f2f', icon: '🪓' },
  mardroeme: { color: '#5a6b3a', icon: '🍄' },
  commanders_horn: { color: '#8a6a2f', icon: '📯' },
  decoy: { color: '#5a5a6a', icon: '🎭' },
  summon_avenger: { color: '#4a3a6a', icon: '↻' },
  weather_frost: { color: '#5a7a9a', icon: '❄' },
  weather_fog: { color: '#6a7a7a', icon: '🌫' },
  weather_rain: { color: '#3f5f7a', icon: '🌧' },
  weather_storm: { color: '#3a4a6a', icon: '⛈' },
  clear_weather: { color: '#8a8a3a', icon: '☀' },
  'gog-reward': { color: '#6b5a2f', icon: '🎁' },
};

export function groupTone(group: FilterGroup): FilterTone {
  return GROUP_DEFAULTS[group];
}

export function optionTone(group: FilterGroup, value: string): FilterTone {
  const base = GROUP_DEFAULTS[group];
  const override = VALUE_TONES[value] ?? {};
  return {
    color: override.color ?? base.color,
    icon: override.icon ?? base.icon,
  };
}
