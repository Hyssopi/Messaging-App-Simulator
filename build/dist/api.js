var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { BATTERY_PERCENT_PER_STAGE, DEFAULT_TYPING_SPEED_DELAY, MessageSpeed, NORMAL, SLOW, SLOWEST, } from './model';
//import { player } from './state';
//import { addChatTimestamp, addContact, addMessage, addReaction, chatContactName, createNotification, enableChoices, hideTypingIndicator, renameContact, showTypingIndicator, startTypeWriter, startTypeWriterWithSubmit, updateBatteryLevel, updateClock, } from './ui';
const MILLISECONDS_PER_CHAR = 25;
const DURATION_TO_MINUTE_MULTIPLIER = 0.001;
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
const waitFor = (predicate, timeout, interval = 500) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = predicate();
                if (result) {
                    resolve(result);
                }
                else if (timeout && Date.now() - startTime > timeout) {
                    reject(new Error(`Condition was not met within ${timeout}ms.`));
                }
                else {
                    setTimeout(check, interval);
                }
            }
            catch (error) {
                reject(error);
            }
        });
        check();
    });
};
const messageSpeedSetting = document.getElementById('setting-message-speed');
const refreshMessageSpeedSettingText = () => {
    switch (player.messageSpeed) {
        case MessageSpeed.INSTANT:
            messageSpeedSetting.textContent = 'Instant';
            break;
        case MessageSpeed.FAST:
            messageSpeedSetting.textContent = 'Fast';
            break;
        case MessageSpeed.NORMAL:
            messageSpeedSetting.textContent = 'Normal';
            break;
        case MessageSpeed.SLOW:
            messageSpeedSetting.textContent = 'Slow';
            break;
        case MessageSpeed.SLOWEST:
            messageSpeedSetting.textContent = 'Slowest';
            break;
        default:
            messageSpeedSetting.textContent = 'Unknown';
    }
};
refreshMessageSpeedSettingText();
messageSpeedSetting.addEventListener('click', () => {
    switch (player.messageSpeed) {
        case MessageSpeed.INSTANT:
            player.messageSpeed = MessageSpeed.SLOWEST;
            break;
        case MessageSpeed.FAST:
            player.messageSpeed = MessageSpeed.INSTANT;
            break;
        case MessageSpeed.NORMAL:
            player.messageSpeed = MessageSpeed.FAST;
            break;
        case MessageSpeed.SLOW:
            player.messageSpeed = MessageSpeed.NORMAL;
            break;
        case MessageSpeed.SLOWEST:
            player.messageSpeed = MessageSpeed.SLOW;
            break;
        default:
            player.messageSpeed = MessageSpeed.NORMAL;
    }
    refreshMessageSpeedSettingText();
});
const getGlobalMessageSpeedMultiplier = () => {
    if (player.skipMode) {
        return 0;
    }
    let multiplier;
    switch (player.messageSpeed) {
        case MessageSpeed.INSTANT:
            multiplier = 0;
            break;
        case MessageSpeed.FAST:
            multiplier = 0.5;
            break;
        case MessageSpeed.NORMAL:
            multiplier = 1.0;
            break;
        case MessageSpeed.SLOW:
            multiplier = 1.5;
            break;
        case MessageSpeed.SLOWEST:
            multiplier = 2.0;
            break;
        default:
            multiplier = 1.0;
    }
    return multiplier;
};
/**
 * Set the global message speed.
 *
 * @param {MessageSpeed} messageSpeed - Message speed to set.
 * @returns {void}
 * @example
 * setGlobalMessageSpeed(FAST);
 * setGlobalMessageSpeed();
 */
const setGlobalMessageSpeed = (messageSpeed = NORMAL) => {
    player.messageSpeed = messageSpeed;
    refreshMessageSpeedSettingText();
};
/**
 * Pause execution and wait for some time. Adjusted with Global Message Speed.
 *
 * @param {number} duration - The duration to pause, in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(5000);
 */
const sleep = (duration) => {
    return new Promise((resolve) => setTimeout(resolve, duration * getGlobalMessageSpeedMultiplier()));
};
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
const setClock = (year, monthIndex, day, hours, minutes = 0) => {
    player.date = new Date(Date.UTC(year, monthIndex, day, hours, minutes));
    updateClock();
};
/**
 * Add minutes to the time.
 *
 * @param {number} minutes - The amount of minutes to add.
 * @returns {void}
 * @example
 * addMinutes(70);
 */
const addMinutes = (minutes) => {
    player.date.setTime(player.date.getTime() + minutes * 60 * 1000);
    updateClock();
};
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
const battery = (stages) => {
    const modifyPercent = stages * BATTERY_PERCENT_PER_STAGE;
    updateBatteryLevel(Math.max(0, Math.min(player.batteryPercent + modifyPercent, 100)));
};
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
const contact = (firstname, lastname, avatar) => {
    return addContact(firstname, lastname, avatar !== null && avatar !== void 0 ? avatar : '');
};
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
const rename = (oldName, firstname, lastname, avatar) => {
    return renameContact(oldName, firstname, lastname, avatar);
};
/**
 * Get the active contact name that the player is currently chatting to.
 *
 * @returns {string | null}
 * @example
 * await waitFor(() => activeContactName() === JaneDoe);
 */
const activeContactName = () => {
    return chatContactName.textContent;
};
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
const textLeft = (text, name, duration) => __awaiter(void 0, void 0, void 0, function* () {
    if (text) {
        showTypingIndicator(name);
        const computedDuration = duration !== null && duration !== void 0 ? duration : text.length * MILLISECONDS_PER_CHAR;
        yield sleep(computedDuration);
        addMinutes(computedDuration * DURATION_TO_MINUTE_MULTIPLIER);
        hideTypingIndicator(name);
        addMessage(name, 'received', player.date, text, undefined);
    }
});
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
const mediaLeft = (media_1, name_1, ...args_1) => __awaiter(void 0, [media_1, name_1, ...args_1], void 0, function* (media, name, duration = SLOWEST) {
    if (media) {
        yield sleep(duration);
        addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
        addMessage(name, 'received', player.date, undefined, media);
    }
});
const pause = (name) => {
    player.pause.push(name);
};
const unpaused = (name) => {
    return !player.pause.includes(name);
};
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
const textRight = (text, name, duration, delay) => __awaiter(void 0, void 0, void 0, function* () {
    if (text) {
        yield waitFor(() => activeContactName() === name);
        const currentChoiceData = player.currentChoiceMap.get(name);
        if (player.skipMode && !currentChoiceData) {
            yield startTypeWriterWithSubmit(name, text, DEFAULT_TYPING_SPEED_DELAY * getGlobalMessageSpeedMultiplier());
        }
        else {
            yield startTypeWriter(name, text, DEFAULT_TYPING_SPEED_DELAY * getGlobalMessageSpeedMultiplier());
            pause(name);
            yield waitFor(() => unpaused(name));
        }
        const computedDuration = duration !== null && duration !== void 0 ? duration : text.length * MILLISECONDS_PER_CHAR;
        addMinutes(computedDuration * DURATION_TO_MINUTE_MULTIPLIER);
        const computedDelay = delay !== null && delay !== void 0 ? delay : text.length * 15;
        yield sleep(computedDelay);
        addMinutes(computedDelay * DURATION_TO_MINUTE_MULTIPLIER);
    }
});
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
const mediaRight = (media_2, name_2, ...args_2) => __awaiter(void 0, [media_2, name_2, ...args_2], void 0, function* (media, name, duration = SLOW, delay = SLOW) {
    if (media) {
        yield waitFor(() => activeContactName() === name);
        yield sleep(duration);
        addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
        addMessage(name, 'sent', player.date, undefined, media);
        yield sleep(delay);
        addMinutes(delay * DURATION_TO_MINUTE_MULTIPLIER);
    }
});
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
const reaction = (emoji_1, name_3, ...args_3) => __awaiter(void 0, [emoji_1, name_3, ...args_3], void 0, function* (emoji, name, lastMessageAgo = 0, duration = NORMAL) {
    yield sleep(duration);
    addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
    addReaction(name, emoji, lastMessageAgo);
});
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
const timestamp = (name, fixedText) => {
    addChatTimestamp(name, player.date, fixedText);
};
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
const choices = (options, name) => __awaiter(void 0, void 0, void 0, function* () {
    if (options.length > 0) {
        yield waitFor(() => activeContactName() === name);
        enableChoices(name, options);
        pause(name);
        yield waitFor(() => unpaused(name));
    }
});
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
const hasFlag = (flag) => {
    return player.flags.includes(flag);
};
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
const hasFlags = (flags) => {
    return flags.every((f) => player.flags.includes(f));
};
/**
 * Add flag.
 *
 * @param {string} flag - The flag to add.
 * @returns {void}
 * @example
 * addFlag('pizza');
 */
const addFlag = (flag) => {
    player.flags.push(flag);
};
/**
 * Remove flag.
 *
 * @param {string} flag - The flag to remove.
 * @returns {void}
 * @example
 * removeFlag('pizza');
 */
const removeFlag = (flag) => {
    player.flags = player.flags.filter((f) => f !== flag);
};
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
const notification = (message, name, app = 'Messages', datetime = player.date.toISOString()) => {
    createNotification(app, name, message, datetime);
};
//# sourceMappingURL=api.js.map