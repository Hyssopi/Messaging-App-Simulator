export const Month = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
} as const;

export const { JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER } =
  Month;

export type Month = (typeof Month)[keyof typeof Month];

export const RELATIVE_TIME_UNITS = [
  ['year', 86400 * 365],
  ['month', 86400 * 30],
  ['week', 86400 * 7],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
] as const;

export const DEFAULT_LOCALE = typeof navigator === 'undefined' ? 'en-US' : navigator.language;

export const clockFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'UTC',
});

export const timeTooltipFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'UTC',
});
