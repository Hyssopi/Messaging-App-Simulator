import type { MessageSpeed } from '../common/constants';
import type { CurrentChoice } from '../common/types';

interface SettingsState {
  messageSpeed: MessageSpeed;
  accessibility: boolean;
  darkMode: boolean;
  relativeTimestamp: boolean;
  showTutorial: boolean;
  showUnitTests: boolean;
}

interface GameState {
  date: Date;
  flags: Set<string>;
  batteryPercent: number;
  skipMode: boolean;
  pause: string[];
  currentChoiceMap: Map<string, CurrentChoice>;
}

export interface State {
  settingsState: SettingsState;
  gameState: GameState;
}
