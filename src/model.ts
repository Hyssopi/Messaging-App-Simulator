export enum MessageSpeed {
  INSTANT = 0,
  FAST = 500,
  NORMAL = 1000,
  SLOW = 2000,
  SLOWEST = 4000,
}

export const INSTANT = MessageSpeed.INSTANT;
export const FAST = MessageSpeed.FAST;
export const NORMAL = MessageSpeed.NORMAL;
export const SLOW = MessageSpeed.SLOW;
export const SLOWEST = MessageSpeed.SLOWEST;

export enum Month {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2,
  APRIL = 3,
  MAY = 4,
  JUNE = 5,
  JULY = 6,
  AUGUST = 7,
  SEPTEMBER = 8,
  OCTOBER = 9,
  NOVEMBER = 10,
  DECEMBER = 11,
}

export const JANUARY = Month.JANUARY;
export const FEBRUARY = Month.FEBRUARY;
export const MARCH = Month.MARCH;
export const APRIL = Month.APRIL;
export const MAY = Month.MAY;
export const JUNE = Month.JUNE;
export const JULY = Month.JULY;
export const AUGUST = Month.AUGUST;
export const SEPTEMBER = Month.SEPTEMBER;
export const OCTOBER = Month.OCTOBER;
export const NOVEMBER = Month.NOVEMBER;
export const DECEMBER = Month.DECEMBER;

export const DEFAULT_TYPING_SPEED_DELAY = 10;

const sides = ['received', 'sent'] as const;
export type Side = (typeof sides)[number];

export const BATTERY_PERCENT_PER_STAGE = 100 / 7;

export interface Choice {
  displayText?: string;
  fullText: string;
  typingSpeedDelay?: number;
  callback: () => object;
}

interface CurrentChoice {
  choices: Choice[];
  index: number;
}

export interface Player {
  messageSpeed: MessageSpeed;
  accessibility: boolean;
  relativeTimestamp: boolean;
  showTutorial: boolean;
  showUnitTests: boolean;
  date: Date;
  flags: string[];
  batteryPercent: number;
  skipMode: boolean;
  pause: string[];
  currentChoiceMap: Map<string, CurrentChoice>;
}
