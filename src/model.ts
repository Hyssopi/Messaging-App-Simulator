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
  showTutorial: boolean;
  showUnitTests: boolean;
  date: Date;
  flags: string[];
  batteryPercent: number;
  skipMode: boolean;
  pause: string[];
  currentChoiceMap: Map<string, CurrentChoice>;
}
