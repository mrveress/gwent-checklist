/** Shareable card deep-link: `?card=<cardId>` (works on static GitHub Pages). */

const PARAM = 'card';

export function readCardIdFromQuery(search = window.location.search): string | null {
  const fromQuery = new URLSearchParams(search).get(PARAM)?.trim();
  if (fromQuery) return fromQuery;

  // One-time compatibility with earlier `#<cardId>` links
  const fromHash = decodeURIComponent(window.location.hash.replace(/^#/, '').trim());
  return fromHash.length > 0 ? fromHash : null;
}

export function writeCardIdQuery(cardId: string | null): void {
  const url = new URL(window.location.href);
  if (cardId) {
    url.searchParams.set(PARAM, cardId);
  } else {
    url.searchParams.delete(PARAM);
  }
  url.hash = '';

  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (next === current && window.location.hash === '') return;
  window.history.replaceState(null, '', next);
}
