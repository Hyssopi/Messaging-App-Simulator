import { MessageSpeed } from '../common/constants';
import { Month } from '../date/constants';
import type { State } from './types';

export const state: State = {
  settingsState: {
    messageSpeed: MessageSpeed.NORMAL,
    accessibility: false,
    darkMode: false,
    relativeTimestamp: false,
    showTutorial: true,
    showUnitTests: false,
  },
  gameState: {
    date: new Date(Date.UTC(2025, Month.OCTOBER, 1, 17, 0)),
    flags: new Set(),
    batteryPercent: 100,
    skipMode: false,
    pause: [],
    currentChoiceMap: new Map(),
  },
};
