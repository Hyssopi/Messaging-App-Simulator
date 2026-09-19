export const DEFAULT_TYPING_SPEED_DELAY = 10;

export const BATTERY_PERCENT_PER_STAGE = 100 / 7;

export const MessageSpeed = {
  INSTANT: 0,
  FAST: 250,
  NORMAL: 500,
  SLOW: 1000,
  SLOWEST: 2000,
} as const;

export const { INSTANT, FAST, NORMAL, SLOW, SLOWEST } = MessageSpeed;

export type MessageSpeed = (typeof MessageSpeed)[keyof typeof MessageSpeed];

export const MESSAGE_SPEED_OPTIONS = [
  {
    value: MessageSpeed.INSTANT,
    label: 'Instant',
    multiplier: 0,
  },
  {
    value: MessageSpeed.FAST,
    label: 'Fast',
    multiplier: 0.5,
  },
  {
    value: MessageSpeed.NORMAL,
    label: 'Normal',
    multiplier: 1,
  },
  {
    value: MessageSpeed.SLOW,
    label: 'Slow',
    multiplier: 1.5,
  },
  {
    value: MessageSpeed.SLOWEST,
    label: 'Slowest',
    multiplier: 2,
  },
] as const;
