const defaultNumberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return defaultNumberFormatter.format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return percentFormatter.format(value / 100);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return '--';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return dateFormatter.format(date);
}
