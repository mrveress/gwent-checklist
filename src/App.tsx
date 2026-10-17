import { useEffect, useState } from 'react';
import { useCatalogBootstrap, useActiveTranslation } from './hooks/useCatalog';
import { useChecklistState } from './hooks/useChecklistState';
import { useFilteredCards } from './hooks/useFilteredCards';
import { Toolbar } from './components/Toolbar';
import { FilterBar } from './components/FilterBar';
import { CardGrid } from './components/CardGrid';
import { ToastProvider } from './toast/ToastContext';
import { ToastViewport } from './toast/ToastViewport';
import { EMPTY_FILTERS, type Filters, type TranslationPack } from './types';
import type { LoadedCatalog } from './data/loadCatalog';

function StatusScreen({ message }: { message: string }) {
  return (
    <div className="app">
      <div className="app__atmosphere" aria-hidden="true" />
      <div className="app__shell">
        <p className="app__status" role="status">
          {message}
        </p>
      </div>
    </div>
  );
}

interface ChecklistAppProps {
  data: LoadedCatalog;
  initialLanguage: string;
  initialGathered: string[];
  initialTranslation: TranslationPack;
}

function ChecklistApp({
  data,
  initialLanguage,
  initialGathered,
  initialTranslation,
}: ChecklistAppProps) {
  const {
    state,
    gatheredSet,
    setLanguage,
    toggleGathered,
    resetToBaseDeck,
    exportJson,
    importJson,
  } = useChecklistState({
    availableLocales: data.availableLocales,
    cardIdOrder: data.cardIdOrder,
    baseDeckIds: data.baseDeckIds,
    initialLanguage,
    initialGathered,
  });

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const translation = useActiveTranslation(
    data.availableLocales,
    state.language,
    initialTranslation,
  );
  const ui = translation.ui;
  const visibleCards = useFilteredCards(data.catalog, filters, translation, gatheredSet);

  useEffect(() => {
    document.title = ui.appTitle;
    document.documentElement.lang = state.language.split('-')[0] || 'en';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', ui.appSubtitle);
    }
  }, [ui.appTitle, ui.appSubtitle, state.language]);

  return (
    <ToastProvider>
      <div className="app">
        <div className="app__atmosphere" aria-hidden="true" />
        <div className="app__shell">
          <Toolbar
            language={state.language}
            availableLocales={data.availableLocales}
            ui={ui}
            gatheredCount={state.gathered.length}
            totalCount={data.catalog.cards.length}
            onLanguageChange={setLanguage}
            onExport={exportJson}
            onImport={importJson}
            onReset={resetToBaseDeck}
          />
          <FilterBar
            catalog={data.catalog}
            allTags={data.allTags}
            filters={filters}
            onChange={setFilters}
            translation={translation}
            ui={ui}
          />
          <CardGrid
            cards={visibleCards}
            allCards={data.catalog.cards}
            totalCount={data.catalog.cards.length}
            gatheredSet={gatheredSet}
            translation={translation}
            ui={ui}
            language={state.language}
            availableLocales={data.availableLocales}
            onLanguageChange={setLanguage}
            onToggle={toggleGathered}
          />
        </div>
        <ToastViewport closeLabel={ui.close} />
      </div>
    </ToastProvider>
  );
}

export default function App() {
  const bootstrap = useCatalogBootstrap();

  if (bootstrap.status === 'loading') {
    return <StatusScreen message="Loading…" />;
  }

  if (bootstrap.status === 'error') {
    return (
      <StatusScreen
        message={`Could not load card data. (${bootstrap.error})`}
      />
    );
  }

  return (
    <ChecklistApp
      data={bootstrap.data}
      initialLanguage={bootstrap.initialLanguage}
      initialGathered={bootstrap.initialGathered}
      initialTranslation={bootstrap.initialTranslation}
    />
  );
}
