import { MessageSpeed, Month, Player } from './model';

export const player: Player = {
  messageSpeed: MessageSpeed.NORMAL,
  accessibility: false,
  relativeTimestamp: false,
  showTutorial: true,
  showUnitTests: false,
  date: new Date(Date.UTC(2025, Month.OCTOBER, 1, 17, 0)),
  flags: [],
  batteryPercent: 100,
  skipMode: false,
  pause: [],
  currentChoiceMap: new Map(),
};
