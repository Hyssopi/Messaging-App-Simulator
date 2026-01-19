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
