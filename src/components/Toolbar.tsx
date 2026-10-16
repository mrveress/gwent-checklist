import { useRef, useState } from 'react';
import type { UiStrings } from '../types';
import { LanguagePicker } from './LanguagePicker';

interface ToolbarProps {
  language: string;
  availableLocales: string[];
  ui: UiStrings;
  gatheredCount: number;
  totalCount: number;
  onLanguageChange: (locale: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<unknown>;
  onReset: () => void;
}

export function Toolbar({
  language,
  availableLocales,
  ui,
  gatheredCount,
  totalCount,
  onLanguageChange,
  onExport,
  onImport,
  onReset,
}: ToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const percent =
    totalCount === 0
      ? 0
      : gatheredCount === 0
        ? 0
        : Number(((gatheredCount / totalCount) * 100).toFixed(1));

  return (
    <header className="toolbar">
      <div className="toolbar__top">
        <div className="toolbar__brand">
          <p className="toolbar__eyebrow">The Witcher 3</p>
          <h1 className="toolbar__title">{ui.appTitle}</h1>
          <p className="toolbar__subtitle">{ui.appSubtitle}</p>
        </div>

        <div className="toolbar__controls">
          <LanguagePicker
            language={language}
            availableLocales={availableLocales}
            label={ui.language}
            onChange={onLanguageChange}
          />

          <div className="toolbar__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                if (!window.confirm(ui.resetConfirm)) return;
                onReset();
                setMessage(ui.resetSuccess);
              }}
            >
              {ui.reset}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                onExport();
                setMessage(ui.exportSuccess);
              }}
            >
              {ui.exportJson}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => fileRef.current?.click()}
            >
              {ui.importJson}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                try {
                  await onImport(file);
                  setMessage(ui.importSuccess);
                } catch {
                  setMessage(ui.importError);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="toolbar__progress" aria-label={ui.progress}>
        <div className="toolbar__progress-text">
          <span>{ui.progress}</span>
          <strong>
            {gatheredCount}/{totalCount} ({percent}%)
          </strong>
        </div>
        <div
          className="toolbar__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-valuenow={gatheredCount}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      {message ? (
        <p className="toolbar__toast" role="status">
          {message}
        </p>
      ) : null}
    </header>
  );
}
