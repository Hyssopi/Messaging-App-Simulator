export type Side = 'received' | 'sent';

export interface Choice {
  displayText?: string;
  fullText: string;
  typingSpeedDelay?: number;
  callback?: () => void;
}

export interface CurrentChoice {
  choices: Choice[];
  index: number;
}
