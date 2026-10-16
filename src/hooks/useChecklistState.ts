import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState } from '../types';
import { resolveLocale } from '../data/loadCatalog';
import { saveStateToCookie } from '../persistence/cookies';
import { downloadStateJson, readStateFromFile } from '../persistence/jsonState';

interface UseChecklistStateOptions {
  availableLocales: string[];
  cardIdOrder: string[];
  baseDeckIds: string[];
  initialLanguage: string;
  initialGathered: string[];
}

export function useChecklistState({
  availableLocales,
  cardIdOrder,
  baseDeckIds,
  initialLanguage,
  initialGathered,
}: UseChecklistStateOptions) {
  const [state, setState] = useState<AppState>(() => ({
    language: initialLanguage,
    gathered: initialGathered,
  }));

  useEffect(() => {
    saveStateToCookie(state, availableLocales, cardIdOrder);
  }, [state, availableLocales, cardIdOrder]);

  const gatheredSet = useMemo(() => new Set(state.gathered), [state.gathered]);

  const setLanguage = useCallback(
    (language: string) => {
      setState((prev) => ({
        ...prev,
        language: resolveLocale(availableLocales, language),
      }));
    },
    [availableLocales],
  );

  const toggleGathered = useCallback((cardId: string) => {
    setState((prev) => {
      const next = new Set(prev.gathered);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return { ...prev, gathered: Array.from(next) };
    });
  }, []);

  const resetToBaseDeck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      gathered: [...baseDeckIds],
    }));
  }, [baseDeckIds]);

  const exportJson = useCallback(() => {
    downloadStateJson(state);
  }, [state]);

  const importJson = useCallback(
    async (file: File) => {
      const loaded = await readStateFromFile(file, availableLocales);
      setState(loaded);
      return loaded;
    },
    [availableLocales],
  );

  return {
    state,
    gatheredSet,
    setLanguage,
    toggleGathered,
    resetToBaseDeck,
    exportJson,
    importJson,
  };
}
