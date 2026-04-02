// i18n formatting helpers (N.1.5)
// Tarih, sayi, para birimi formatlama

const defaultLocale = 'tr-TR';

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(defaultLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(defaultLocale, options).format(value);
}

export function formatCurrency(value: number, currency = 'TRY'): string {
  return new Intl.NumberFormat(defaultLocale, { style: 'currency', currency }).format(value);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'az once';
  if (minutes < 60) return `${minutes} dakika once`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat once`;
  const days = Math.floor(hours / 24);
  return `${days} gun once`;
}
