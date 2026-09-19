import {
  MessageSpeed,
  NORMAL,
  MESSAGE_SPEED_OPTIONS,
  BATTERY_PERCENT_PER_STAGE,
  SLOWEST,
  DEFAULT_TYPING_SPEED_DELAY,
  SLOW,
} from '../common/constants';
import type { Choice } from '../common/types';
import type { Month } from '../date/constants';
import { state } from '../state/state';
import {
  refreshMessageSpeedSettingText,
  updateClock,
  updateBatteryLevel,
  addContact,
  renameContact,
  chatContactName,
  showTypingIndicator,
  hideTypingIndicator,
  addMessage,
  startTypeWriterWithSubmit,
  startTypeWriter,
  addReaction,
  addChatTimestamp,
  enableChoices,
  createNotification,
} from '../ui/ui';
import { MILLISECONDS_PER_CHAR, DURATION_TO_MINUTE_MULTIPLIER } from './constants';

/**
 * Pause execution and wait until a specific condition is true.
 *
 * @param {function(): boolean} predicate - The specific condition that must be true for the execution to continue.
 * @param {number | undefined} timeout - Wait for how long until giving up, in milliseconds. Will not timeout if undefined.
 * @param {number} interval - How often to check the condition, in milliseconds.
 * @returns {Promise<boolean>}
 * @example
 * await waitFor(() => activeContactName() === 'Jane Doe');
 * await waitFor(() => hasFlag('test-flag'));
 */
export function waitFor(predicate: () => boolean, timeout?: number, interval: number = 500): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = async (): Promise<void> => {
      try {
        const result = predicate();
        if (result) {
          resolve(result);
        } else if (timeout && Date.now() - startTime > timeout) {
          reject(new Error(`Condition was not met within ${timeout}ms.`));
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        reject(error);
      }
    };
    check();
  });
}

/**
 * Set the global message speed.
 *
 * @param {MessageSpeed} messageSpeed - Message speed to set.
 * @returns {void}
 * @example
 * setGlobalMessageSpeed(FAST);
 * setGlobalMessageSpeed();
 */
export function setGlobalMessageSpeed(messageSpeed: MessageSpeed = NORMAL): void {
  state.settingsState.messageSpeed = messageSpeed;
  refreshMessageSpeedSettingText();
}

function getGlobalMessageSpeedMultiplier(): number {
  if (state.gameState.skipMode) {
    return 0;
  }

  return MESSAGE_SPEED_OPTIONS.find((option) => option.value === state.settingsState.messageSpeed)?.multiplier ?? 1;
}

/**
 * Pause execution and wait for some time. Adjusted with Global Message Speed.
 *
 * @param {number} duration - The duration to pause, in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(5000);
 */
export function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration * getGlobalMessageSpeedMultiplier()));
}

/**
 * Set date and time.
 *
 * @param {number} year - The year, for example: 2025.
 * @param {number} month - The month, for example: OCTOBER or Month.OCTOBER.
 * @param {number} day - The day, for example: 1.
 * @param {number} hours - The hour, for example: from 0 to 23.
 * @param {number} minutes - The minute, for example: 30.
 * @returns {void}
 * @example
 * setClock(2025, OCTOBER, 1, 17, 30);
 * setClock(2025, OCTOBER, 1, 17);
 */
export function setClock(year: number, month: Month, day: number, hours: number, minutes: number = 0): void {
  state.gameState.date = new Date(Date.UTC(year, month, day, hours, minutes));
  updateClock();
}

/**
 * Add minutes to the time.
 *
 * @param {number} minutes - The amount of minutes to add.
 * @returns {void}
 * @example
 * addMinutes(70);
 */
export function addMinutes(minutes: number): void {
  state.gameState.date.setTime(state.gameState.date.getTime() + minutes * 60 * 1000);
  updateClock();
}

/**
 * Increment or decrement the battery stages.
 * Stage 0 = 0% battery level.
 * Stage 7 = 100% battery level.
 *
 * @param {number} stages - The amount of stages to increment, negative number to decrement.
 * @returns {void}
 * @example
 * battery(-1);
 * battery(2);
 */
export function battery(stages: number): void {
  const modifyPercent = stages * BATTERY_PERCENT_PER_STAGE;
  updateBatteryLevel(Math.max(0, Math.min(state.gameState.batteryPercent + modifyPercent, 100)));
}

/**
 * Add contact.
 * Then return the full name of the contact.
 *
 * @param {string} firstname - First name.
 * @param {string} lastname - Last name.
 * @param {string | undefined} avatar - Avatar icon src. Default to using initials icon if undefined.
 * @returns {string}
 * @example
 * const JaneDoe = contact('Jane', 'Doe', 'story/debug/images/sample-contact-01.png');
 */
export function contact(firstname: string, lastname: string, avatar?: string): string {
  return addContact(firstname, lastname, avatar ?? '');
}

/**
 * Rename contact.
 * Then return the new full name of the contact.
 *
 * @param {string} oldName - Old full name to rename.
 * @param {string} firstname - First name.
 * @param {string} lastname - Last name.
 * @param {string | undefined} avatar - Avatar icon src. Default to using initials icon if undefined.
 * @returns {string}
 * @example
 * const BriannaBrown = rename(
 *   'Unknown Contact',
 *   'Brianna',
 *   'Brown',
 *   'story/debug/images/sample-contact-02.png',
 * );
 */
export function rename(oldName: string, firstname: string, lastname: string, avatar?: string): string {
  return renameContact(oldName, firstname, lastname, avatar);
}

/**
 * Get the active contact name that the player is currently chatting to.
 *
 * @returns {string | null}
 * @example
 * await waitFor(() => activeContactName() === JaneDoe);
 */
export function activeContactName(): string | null {
  return chatContactName.textContent;
}

/**
 * Received text message.
 *
 * @param {string} text - Text.
 * @param {string} name - Full name of the chat to insert the message to.
 * @param {MessageSpeed | undefined} duration - Simulate how long they are typing for. If undefined, then it calculates based on the text length.
 * @returns {Promise<void>}
 * @example
 * await textLeft(`Received message.`, JaneDoe);
 * await textLeft(`Received message with INSTANT duration.`, JaneDoe, INSTANT);
 */
export async function textLeft(text: string, name: string, duration?: MessageSpeed): Promise<void> {
  if (text) {
    showTypingIndicator(name);
    const computedDuration = duration ?? text.length * MILLISECONDS_PER_CHAR;
    await sleep(computedDuration);

    addMinutes(computedDuration * DURATION_TO_MINUTE_MULTIPLIER);
    hideTypingIndicator(name);
    addMessage(name, 'received', state.gameState.date, text, undefined);
  }
}

/**
 * Received image/video message.
 *
 * @param {string} media - Image or video src.
 * @param {string} name - Full name of the chat to insert the message to.
 * @param {MessageSpeed} duration - Simulate how long it takes to find/take the image/video. If undefined, then defaults to a fixed value.
 * @returns {Promise<void>}
 * @example
 * await mediaLeft('story/debug/images/Dog.jpg', JaneDoe);
 * await mediaLeft('story/debug/images/Cat.png', JaneDoe, INSTANT);
 */
export async function mediaLeft(media: string, name: string, duration: MessageSpeed = SLOWEST): Promise<void> {
  if (media) {
    await sleep(duration);

    addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
    addMessage(name, 'received', state.gameState.date, undefined, media);
  }
}

function pause(name: string): void {
  state.gameState.pause.push(name);
}

function unpaused(name: string): boolean {
  return !state.gameState.pause.includes(name);
}

/**
 * Sent text message.
 *
 * @param {string} text - Text.
 * @param {string} name - Full name of the chat to insert the message to.
 * @param {MessageSpeed | undefined} duration - Simulate how long it takes to type the message which will be used to calculate how much time to add to the clock. If undefined, then it calculates based on the text length.
 * @param {MessageSpeed | undefined} delay - Simulate how long it takes for the receiver to read this message. If undefined, then it calculates based on the text length.
 * @returns {Promise<void>}
 * @example
 * await textRight(`Sent message.`, JaneDoe);
 * await textRight(`Sent message with INSTANT duration.`, JaneDoe, INSTANT);
 * await textRight(`Sent message with INSTANT delay.`, JaneDoe, undefined, INSTANT);
 */
export async function textRight(
  text: string,
  name: string,
  duration?: MessageSpeed,
  delay?: MessageSpeed,
): Promise<void> {
  if (text) {
    await waitFor(() => activeContactName() === name);

    const currentChoiceData = state.gameState.currentChoiceMap.get(name);
    if (state.gameState.skipMode && !currentChoiceData) {
      await startTypeWriterWithSubmit(name, text, DEFAULT_TYPING_SPEED_DELAY * getGlobalMessageSpeedMultiplier());
    } else {
      await startTypeWriter(name, text, DEFAULT_TYPING_SPEED_DELAY * getGlobalMessageSpeedMultiplier());

      pause(name);
      await waitFor(() => unpaused(name));
    }

    const computedDuration = duration ?? text.length * MILLISECONDS_PER_CHAR;
    addMinutes(computedDuration * DURATION_TO_MINUTE_MULTIPLIER);
    const computedDelay = delay ?? text.length * 15;
    await sleep(computedDelay);

    addMinutes(computedDelay * DURATION_TO_MINUTE_MULTIPLIER);
  }
}

/**
 * Sent image/video message.
 *
 * @param {string} media - Image or video src.
 * @param {string} name - Full name of the chat to insert the message to.
 * @param {MessageSpeed} duration - Simulate how long it takes to find/take the image/video. If undefined, then defaults to a fixed value.
 * @param {MessageSpeed} delay - Simulate how long it takes for the receiver to read this message. If undefined, then defaults to a fixed value.
 * @returns {Promise<void>}
 * @example
 * await mediaRight('story/debug/images/Dog.jpg', JaneDoe);
 * await mediaRight('story/debug/images/Cat.png', JaneDoe, INSTANT);
 * await mediaRight('story/debug/images/Cat.png', JaneDoe, undefined, INSTANT);
 */
export async function mediaRight(
  media: string,
  name: string,
  duration: MessageSpeed = SLOW,
  delay: MessageSpeed = SLOW,
): Promise<void> {
  if (media) {
    await waitFor(() => activeContactName() === name);

    await sleep(duration);

    addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
    addMessage(name, 'sent', state.gameState.date, undefined, media);
    await sleep(delay);

    addMinutes(delay * DURATION_TO_MINUTE_MULTIPLIER);
  }
}

/**
 * Attach an emoji reaction to a message.
 * Only one emoji per message.
 *
 * @param {string} emoji - The emoji.
 * @param {string} name - Full name of the chat to insert the emoji/message to.
 * @param {number} lastMessageAgo - How many messages ago to attach the emoji to. For example, 0 = the last message.
 * @param {MessageSpeed} duration - Simulate how long it takes to find and select the emoji. If undefined, then defaults to a fixed value.
 * @returns {Promise<void>}
 * @example
 * await reaction('👍', JaneDoe);
 * await reaction('😅', JaneDoe, 2);
 * await reaction('😓', JaneDoe, 0, INSTANT);
 */
export async function reaction(
  emoji: string,
  name: string,
  lastMessageAgo: number = 0,
  duration: MessageSpeed = NORMAL,
): Promise<void> {
  await sleep(duration);

  addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
  addReaction(name, emoji, lastMessageAgo);
}

/**
 * Add a timestamp to the chat.
 *
 * @param {string} name - Full name of the chat to insert the timestamp to.
 * @param {string | undefined} fixedText - The custom text to put in the timestamp instead of the default datetime.
 * @returns {void}
 * @example
 * timestamp(JaneDoe);
 * timestamp(JaneDoe, 'A few hours later, at night...');
 */
export function timestamp(name: string, fixedText?: string): void {
  addChatTimestamp(name, state.gameState.date, fixedText);
}

/**
 * Set the list of choices for the player to choose.
 *
 * @param {Choice[]} options - The choice options.
 * @param {string} name - Full name of the chat to enable the choices for.
 * @returns {Promise<void>}
 * @example
 * await choices(
 *   [
 *     {
 *       displayText: `Pizza.`,
 *       fullText: `Pizza! It's delicious.`,
 *       typingSpeedDelay: 0,
 *       callback: () => {
 *         addFlag('pizza');
 *       },
 *     },
 *     {
 *       displayText: `Burger.`,
 *       fullText: `Burger! You can't go wrong with burgers.`,
 *       typingSpeedDelay: 0,
 *       callback: () => {
 *         addFlag('burger');
 *       },
 *     },
 *   ],
 *   JaneDoe,
 * );
 */
export async function choices(options: Choice[], name: string): Promise<void> {
  if (options.length > 0) {
    await waitFor(() => activeContactName() === name);

    enableChoices(name, options);
    pause(name);
    await waitFor(() => unpaused(name));
  }
}

/**
 * Check if the player has a flag.
 *
 * @param {string} flag - The flag to check.
 * @returns {boolean}
 * @example
 * if (hasFlag('pizza')) {
 *   await reaction('🍕', JaneDoe);
 * }
 */
export function hasFlag(flag: string): boolean {
  return state.gameState.flags.has(flag);
}

/**
 * Check if the player has all the flags.
 *
 * @param {string[]} flags - The flags to check.
 * @returns {boolean}
 * @example
 * if (hasFlags(['pizza', 'room1'])) {
 *   await reaction('👍', JaneDoe);
 * }
 */
export function hasFlags(flags: string[]): boolean {
  return flags.every((f) => state.gameState.flags.has(f));
}

/**
 * Add flag.
 *
 * @param {string} flag - The flag to add.
 * @returns {void}
 * @example
 * addFlag('pizza');
 */
export function addFlag(flag: string): void {
  state.gameState.flags.add(flag);
}

/**
 * Remove flag.
 *
 * @param {string} flag - The flag to remove.
 * @returns {void}
 * @example
 * removeFlag('pizza');
 */
export function removeFlag(flag: string): void {
  state.gameState.flags.delete(flag);
}

/**
 * Show a toast notification.
 *
 * @param {string} message - The message.
 * @param {string} name - The full name from who the notification is from.
 * @param {string} app - The app name. If undefined, then defaults to 'Messages'.
 * @param {string | Date} datetime - The date and time from when the notification is. If undefined, then defaults to the current time.
 * @returns {void}
 * @example
 * notification('Hello!', JaneDoe);
 */
export function notification(
  message: string,
  name: string,
  app: string = 'Messages',
  datetime: string | Date = state.gameState.date,
): void {
  createNotification(app, name, message, datetime);
}
