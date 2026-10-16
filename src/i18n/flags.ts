/** Flag SVGs live next to translation packs: ./data/translations/flags/{locale}.svg */
export function localeFlagUrl(locale: string): string {
  return `./data/translations/flags/${locale}.svg`;
}
