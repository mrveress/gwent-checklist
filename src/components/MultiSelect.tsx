import type { CSSProperties } from 'react';
import type { FilterGroup } from '../filterVisuals';
import { optionTone } from '../filterVisuals';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  label: string;
  group: FilterGroup;
  options: Option[];
  values: string[];
  onChange: (next: string[]) => void;
}

export function MultiSelect({
  id,
  label,
  group,
  options,
  values,
  onChange,
}: MultiSelectProps) {
  const selected = new Set(values);

  const toggle = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(Array.from(next));
  };

  return (
    <fieldset className={`filter-row filter-row--${group}`} id={id}>
      <legend className="filter-row__legend">{label}</legend>
      <div className="filter-row__options" role="group" aria-label={label}>
        {options.map((option) => {
          const checked = selected.has(option.value);
          const optionId = `${id}-${option.value}`;
          const tone = optionTone(group, option.value);
          return (
            <label
              key={option.value}
              className={`chip${checked ? ' chip--on' : ''}`}
              htmlFor={optionId}
              style={{ '--chip-color': tone.color } as CSSProperties}
              data-value={option.value}
            >
              <input
                id={optionId}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option.value)}
              />
              <span className="chip__icon" aria-hidden="true">
                {tone.icon}
              </span>
              <span className="chip__label">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
