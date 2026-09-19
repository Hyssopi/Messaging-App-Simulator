import { DEFAULT_LOCALE, RELATIVE_TIME_UNITS } from './constants';

export function formatRelativeTime(fromDate: Date, toDate: string | Date, locale = DEFAULT_LOCALE): string {
  const targetDate = new Date(toDate);
  const targetTime = targetDate.getTime();

  if (Number.isNaN(targetTime)) {
    throw new Error(`Invalid date: ${toDate}`);
  }

  const deltaSeconds = Math.round((targetTime - fromDate.getTime()) / 1000);
  const absoluteSeconds = Math.abs(deltaSeconds);

  const [unit, seconds] =
    RELATIVE_TIME_UNITS.find(([, seconds]) => absoluteSeconds >= seconds) ?? RELATIVE_TIME_UNITS.at(-1)!;

  return new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  }).format(Math.round(deltaSeconds / seconds), unit);
}

function getUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function formatSpecificRelativeDate(now: Date, toDate: string, locale = DEFAULT_LOCALE): string {
  const date = new Date(toDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${toDate}`);
  }

  const difference = (getUtcDay(date) - getUtcDay(now)) / 86_400_000;

  const time = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });

  if (difference === 0) {
    return `Today ${time}`;
  }

  if (difference === 1) {
    return `Tomorrow ${time}`;
  }

  if (difference === -1) {
    return `Yesterday ${time}`;
  }

  return date.toLocaleString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}
