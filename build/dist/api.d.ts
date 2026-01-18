import { Choice, MessageSpeed } from './model';
/**
 * Pause execution and wait for some time.
 *
 * @param {number} duration - The duration to pause, in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(5000);
 */
export declare const sleep: (duration: number) => Promise<void>;
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
 * await waitFor(() => unpaused('Jane Doe'));
 */
export declare const waitFor: (predicate: () => boolean, timeout?: number, interval?: number) => Promise<boolean>;
/**
 * Set the global message speed.
 *
 * @param {MessageSpeed} messageSpeed - Message speed to set.
 * @returns {void}
 * @example
 * setGlobalMessageSpeed(FAST);
 * setGlobalMessageSpeed();
 */
export declare const setGlobalMessageSpeed: (messageSpeed?: MessageSpeed) => void;
/**
 * Set date and time.
 *
 * @param {number} year - The year, for example: 2025.
 * @param {number} monthIndex - The month index, for example: 0 for January and 11 for December.
 * @param {number} day - The day, for example: 1.
 * @param {number} hours - The hour, for example: from 0 to 23.
 * @param {number} minutes - The minute, for example: 30.
 * @returns {void}
 * @example
 * setClock(2025, 9, 1, 17, 30);
 * setClock(2025, 9, 1, 17);
 */
export declare const setClock: (year: number, monthIndex: number, day: number, hours: number, minutes?: number) => void;
/**
 * Add minutes to the time.
 *
 * @param {number} minutes - The amount of minutes to add.
 * @returns {void}
 * @example
 * addMinutes(70);
 */
export declare const addMinutes: (minutes: number) => void;
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
export declare const battery: (stages: number) => void;
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
export declare const contact: (firstname: string, lastname: string, avatar?: string) => string;
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
export declare const rename: (oldName: string, firstname: string, lastname: string, avatar?: string) => string;
/**
 * Get the active contact name that the player is currently chatting to.
 *
 * @returns {string | null}
 * @example
 * await waitFor(() => activeContactName() === JaneDoe);
 */
export declare const activeContactName: () => string | null;
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
export declare const textLeft: (text: string, name: string, duration?: MessageSpeed) => Promise<void>;
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
export declare const mediaLeft: (media: string, name: string, duration?: MessageSpeed) => Promise<void>;
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
export declare const textRight: (text: string, name: string, duration?: MessageSpeed, delay?: MessageSpeed) => Promise<void>;
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
export declare const mediaRight: (media: string, name: string, duration?: MessageSpeed, delay?: MessageSpeed) => Promise<void>;
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
export declare const reaction: (emoji: string, name: string, lastMessageAgo?: number, duration?: MessageSpeed) => Promise<void>;
/**
 * Add a timestamp to the chat.
 *
 * @param {string} name - Full name of the chat to insert the timestamp to.
 * @returns {void}
 * @example
 * timestamp(JaneDoe);
 */
export declare const timestamp: (name: string) => void;
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
export declare const choices: (options: Choice[], name: string) => Promise<void>;
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
export declare const hasFlag: (flag: string) => boolean;
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
export declare const hasFlags: (flags: string[]) => boolean;
/**
 * Add flag.
 *
 * @param {string} flag - The flag to add.
 * @returns {void}
 * @example
 * addFlag('pizza');
 */
export declare const addFlag: (flag: string) => void;
/**
 * Remove flag.
 *
 * @param {string} flag - The flag to remove.
 * @returns {void}
 * @example
 * removeFlag('pizza');
 */
export declare const removeFlag: (flag: string) => void;
/**
 * Show a toast notification.
 *
 * @param {string} message - The message.
 * @param {string} name - The full name from who the notification is from.
 * @param {string} app - The app name. If undefined, then defaults to 'Messages'.
 * @param {string} datetime - The date and time from when the notification is. If undefined, then defaults to the current time.
 * @returns {void}
 * @example
 * notification('Hello!', JaneDoe);
 */
export declare const notification: (message: string, name: string, app?: string, datetime?: string) => void;
