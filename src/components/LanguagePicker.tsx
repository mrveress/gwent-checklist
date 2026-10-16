import { useState } from 'react';
import { localeFlagUrl } from '../i18n/flags';
import { localeDisplayName } from '../i18n/localeDisplay';

interface LanguagePickerProps {
  language: string;
  availableLocales: string[];
  label: string;
  onChange: (locale: string) => void;
}

function LocaleFlag({ locale }: { locale: string }) {
  const [failed, setFailed] = useState(false);
  const short = locale.split('-')[0] ?? locale;

  if (failed) {
    return (
      <span className="lang-picker__fallback" aria-hidden="true">
        {short.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="lang-picker__svg"
      src={localeFlagUrl(locale)}
      alt=""
      width={60}
      height={40}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function LanguagePicker({
  language,
  availableLocales,
  label,
  onChange,
}: LanguagePickerProps) {
  return (
    <div className="lang-picker" role="group" aria-label={label}>
      <span className="lang-picker__label">{label}</span>
      <div className="lang-picker__flags">
        {availableLocales.map((locale) => {
          const active = locale === language;
          const name = localeDisplayName(locale);
          return (
            <button
              key={locale}
              type="button"
              className={`lang-picker__flag${active ? ' lang-picker__flag--on' : ''}`}
              aria-pressed={active}
              aria-label={`${name} (${locale})`}
              title={`${name} (${locale})`}
              onClick={() => onChange(locale)}
            >
              <LocaleFlag locale={locale} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
