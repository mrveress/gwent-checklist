export function localeDisplayName(locale: string): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: 'language' }).of(locale.split('-')[0]!) ?? locale
    );
  } catch {
    return locale;
  }
}
