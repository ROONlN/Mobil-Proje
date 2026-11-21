export function relativeDate(value?: string): string {
  if (!value) return 'Tarih bilinmiyor';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tarih bilinmiyor';

  const difference = Math.max(0, Date.now() - date.getTime());
  const days = Math.floor(difference / 86_400_000);

  if (days === 0) return 'bugün';
  if (days === 1) return '1 gün önce';
  return `${days} gün önce`;
}

export function longDate(value?: string): string {
  if (!value) return 'Bilinmiyor';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Bilinmiyor';

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
