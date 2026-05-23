export declare enum MessageSpeed {
    INSTANT = 0,
    FAST = 500,
    NORMAL = 1000,
    SLOW = 2000,
    SLOWEST = 4000
}
export declare const INSTANT = MessageSpeed.INSTANT;
export declare const FAST = MessageSpeed.FAST;
export declare const NORMAL = MessageSpeed.NORMAL;
export declare const SLOW = MessageSpeed.SLOW;
export declare const SLOWEST = MessageSpeed.SLOWEST;
export declare enum Month {
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
    DECEMBER = 11
}
export declare const JANUARY = Month.JANUARY;
export declare const FEBRUARY = Month.FEBRUARY;
export declare const MARCH = Month.MARCH;
export declare const APRIL = Month.APRIL;
export declare const MAY = Month.MAY;
export declare const JUNE = Month.JUNE;
export declare const JULY = Month.JULY;
export declare const AUGUST = Month.AUGUST;
export declare const SEPTEMBER = Month.SEPTEMBER;
export declare const OCTOBER = Month.OCTOBER;
export declare const NOVEMBER = Month.NOVEMBER;
export declare const DECEMBER = Month.DECEMBER;
export declare const DEFAULT_TYPING_SPEED_DELAY = 10;
declare const sides: readonly ["received", "sent"];
export type Side = (typeof sides)[number];
export declare const BATTERY_PERCENT_PER_STAGE: number;
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
export {};
