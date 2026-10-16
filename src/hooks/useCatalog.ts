import { useEffect, useState } from 'react';
import { loadCatalog, loadTranslation, type LoadedCatalog } from '../data/loadCatalog';
import type { TranslationPack } from '../types';
import { DEFAULT_LOCALE } from '../types';
import { loadStateFromCookie } from '../persistence/cookies';

export type CatalogBootstrap =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | {
      status: 'ready';
      data: LoadedCatalog;
      initialLanguage: string;
      initialGathered: string[];
      initialTranslation: TranslationPack;
    };

export function useCatalogBootstrap(): CatalogBootstrap {
  const [state, setState] = useState<CatalogBootstrap>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await loadCatalog();
        const saved = loadStateFromCookie(data.availableLocales, data.cardIdOrder);
        const initialLanguage =
          saved?.language ??
          (data.availableLocales.includes(DEFAULT_LOCALE)
            ? DEFAULT_LOCALE
            : data.availableLocales[0]!);
        const initialTranslation = await loadTranslation(
          data.availableLocales,
          initialLanguage,
        );

        // First visit (no cookie): pre-select base-deck / starter cards.
        const initialGathered = saved ? saved.gathered : data.baseDeckIds;

        if (!cancelled) {
          setState({
            status: 'ready',
            data,
            initialLanguage,
            initialGathered,
            initialTranslation,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to load catalog',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Loads/caches a translation pack when the language changes. Keeps the last good pack while fetching. */
export function useActiveTranslation(
  availableLocales: string[],
  language: string,
  seed: TranslationPack,
): TranslationPack {
  const [translation, setTranslation] = useState(seed);

  useEffect(() => {
    let cancelled = false;

    loadTranslation(availableLocales, language).then((pack) => {
      if (!cancelled) setTranslation(pack);
    });

    return () => {
      cancelled = true;
    };
  }, [availableLocales, language]);

  return translation;
}
