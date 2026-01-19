var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { BATTERY_PERCENT_PER_STAGE, DEFAULT_TYPING_SPEED_DELAY } from './model';
//import { player } from './state';
//import { formatRelativeTime, formatSpecificRelativeDate, isMobile } from './utility';
const clock = document.getElementById('clock');
const batteryIcon = document.getElementById('battery');
const settingsScreen = document.getElementById('settings-screen');
const accessibilityCheckbox = document.getElementById('setting-accessibility-checkbox');
const tutorialCheckbox = document.getElementById('setting-tutorial-checkbox');
const unitTestsCheckbox = document.getElementById('setting-unit-test-checkbox');
const mainScreen = document.getElementById('main-screen');
const editLabel = document.getElementById('main-header-edit');
const contactList = document.getElementById('contact-list');
const chatScreen = document.getElementById('chat-screen');
const unreadBadge = document.getElementById('unread-badge');
const chatContactAvatar = document.getElementById('chat-header-contact-avatar');
const chatContactName = document.getElementById('chat-header-contact-name');
const accessibilityControls = document.getElementById('accessibility-controls');
const accessibilitySkip = document.getElementById('accessibility-skip-button');
const messageLists = document.getElementById('message-lists');
const messageForms = document.getElementById('message-forms');
const imageOverlayContainer = document.getElementById('image-overlay-container');
const imageOverlayImage = document.getElementById('image-overlay-image');
const videoOverlayContainer = document.getElementById('video-overlay-container');
const videoOverlayVideo = document.getElementById('video-overlay-video');
const notificationContainer = document.getElementById('notification-container');
const clockFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
});
const timeTooltipFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
});
const updateTimestamps = () => {
    const contactTimeElements = document.querySelectorAll('time.timestamp');
    contactTimeElements.forEach((element) => {
        const datetime = element.getAttribute('datetime');
        if (datetime) {
            element.textContent = formatRelativeTime(player.date, datetime);
        }
    });
    const chatTimeElements = document.querySelectorAll('time.chat-timestamp');
    chatTimeElements.forEach((element) => {
        const datetime = element.getAttribute('datetime');
        if (datetime) {
            element.textContent = formatSpecificRelativeDate(player.date, datetime);
        }
    });
};
const updateClock = () => {
    clock.textContent = clockFormatter.format(player.date);
    updateTimestamps();
};
const updateBatteryLevel = (percent) => {
    player.batteryPercent = percent;
    if (percent >= BATTERY_PERCENT_PER_STAGE * 7) {
        batteryIcon.textContent = 'battery_android_full';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 6)) {
        batteryIcon.textContent = 'battery_android_6';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 5)) {
        batteryIcon.textContent = 'battery_android_5';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 4)) {
        batteryIcon.textContent = 'battery_android_4';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 3)) {
        batteryIcon.textContent = 'battery_android_3';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 2)) {
        batteryIcon.textContent = 'battery_android_2';
    }
    else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE)) {
        batteryIcon.textContent = 'battery_android_1';
    }
    else {
        batteryIcon.textContent = 'battery_android_0';
    }
    if (batteryIcon.classList.contains('low')) {
        if (percent >= Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
            batteryIcon.classList.remove('low');
        }
    }
    else {
        if (percent < Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
            batteryIcon.classList.add('low');
        }
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const navigateSettingsBack = () => {
    mainScreen.classList.add('active');
    settingsScreen.classList.remove('active');
    mainScreen.classList.add('visible');
    settingsScreen.classList.remove('visible');
};
const updateUnreadBadge = () => {
    let unreadCount = 0;
    for (const contactItem of contactList.children) {
        if (contactItem.classList.contains('unread')) {
            ++unreadCount;
        }
    }
    unreadBadge.textContent = unreadCount.toString();
    if (unreadCount > 0) {
        unreadBadge.classList.remove('hidden');
        if (unreadCount >= 10) {
            unreadBadge.classList.add('wide');
        }
        else {
            unreadBadge.classList.remove('wide');
        }
    }
    else {
        unreadBadge.classList.add('hidden');
    }
};
const refreshChatContact = (contactItem) => {
    const avatar = contactItem.querySelector('.avatar');
    const name = contactItem.querySelector('.contact-name').textContent;
    chatContactAvatar.src = avatar.src;
    chatContactAvatar.alt = avatar.alt;
    chatContactName.textContent = name;
};
const getMessageBubble = (name, lastMessageAgo) => {
    const messageList = document.getElementById(`${name}-message-list`);
    const messageBubbles = Array.from(messageList.children).filter((element) => {
        return element.classList.contains('message-bubble') && !element.classList.contains('typing-indicator');
    });
    return messageBubbles[messageBubbles.length - 1 - lastMessageAgo];
};
const showImageOverlay = (image) => {
    imageOverlayContainer.classList.add('active');
    imageOverlayImage.src = image;
};
const hideImageOverlay = () => {
    imageOverlayContainer.classList.remove('active');
    imageOverlayImage.removeAttribute('src');
};
const showVideoOverlay = (video) => {
    videoOverlayContainer.classList.add('active');
    const sources = videoOverlayVideo.getElementsByTagName('source');
    for (const source of sources) {
        source.src = video;
    }
    videoOverlayVideo.load();
};
const hideVideoOverlay = () => {
    videoOverlayContainer.classList.remove('active');
    const sources = videoOverlayVideo.getElementsByTagName('source');
    for (const source of sources) {
        source.removeAttribute('src');
    }
};
const isMessageListActive = (name) => {
    const messageList = document.getElementById(`${name}-message-list`);
    return messageList.classList.contains('active');
};
const atBottom = () => {
    return Math.ceil(messageLists.scrollTop) >= messageLists.scrollHeight - messageLists.offsetHeight;
};
const messageListScrollToBottom = (name, previouslyAtBottom) => {
    const nameCondition = !name || isMessageListActive(name);
    const atBottomCondition = previouslyAtBottom === undefined || previouslyAtBottom;
    if (nameCondition && atBottomCondition) {
        messageLists.scrollTop = messageLists.scrollHeight;
    }
};
const createNotification = (app, name, body, datetime) => {
    var _a;
    const notification = document.createElement('div');
    notification.classList.add('notification');
    const avatarImage = document.getElementById(`${name}-contact-avatar`);
    notification.innerHTML = `
    <img class="avatar" alt="${(_a = avatarImage === null || avatarImage === void 0 ? void 0 : avatarImage.alt) !== null && _a !== void 0 ? _a : '?'}" src="${avatarImage === null || avatarImage === void 0 ? void 0 : avatarImage.src}">
    <div class="notification-content">
      <div class="notification-header">
        <span>${app}</span>
        <span>${formatRelativeTime(player.date, datetime)}</span>
      </div>
      <div class="notification-name">${name}</div>
      <div class="notification-message">${body}</div>
    </div>
  `;
    notificationContainer.prepend(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        notification.addEventListener('transitionend', () => {
            notificationContainer.removeChild(notification);
        }, { once: true });
    }, 3000);
};
const addMessage = (name, side, date, text, media) => {
    if (!text && !media) {
        return;
    }
    if (text && media) {
        addMessage(name, side, date, undefined, media);
    }
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', side);
    if (text) {
        messageBubble.textContent = text;
    }
    else if (media) {
        if (media.toLowerCase().endsWith('.jpg') ||
            media.toLowerCase().endsWith('.png') ||
            media.toLowerCase().endsWith('.gif')) {
            const imageElement = document.createElement('img');
            imageElement.classList.add('message-media');
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            imageElement.onload = () => {
                imageElement.addEventListener('click', () => {
                    showImageOverlay(imageElement.src);
                });
                messageListScrollToBottom(name);
            };
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            imageElement.onerror = () => {
                imageElement.classList.add('invalid-media');
                imageElement.src = 'resources/missing-preview.png';
            };
            imageElement.src = media;
            messageBubble.appendChild(imageElement);
        }
        else if (media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.webm')) {
            const videoElement = document.createElement('video');
            videoElement.classList.add('message-media');
            videoElement.classList.add('message-video');
            videoElement.controls = true;
            videoElement.preload = 'metadata';
            videoElement.muted = true;
            videoElement.innerHTML = `
        <source src="${media}" type="video/mp4">
        <source src="${media}" type="video/webm">
        Your browser does not support HTML video.
      `;
            videoElement.addEventListener('loadedmetadata', () => {
                messageListScrollToBottom(name);
            });
            videoElement.addEventListener('error', () => {
                messageBubble.classList.add('invalid-media');
                videoElement.poster = 'resources/missing-preview.png';
                messageListScrollToBottom(name);
            }, true);
            messageBubble.addEventListener('click', () => {
                showVideoOverlay(media);
            });
            messageBubble.appendChild(videoElement);
        }
        else {
            console.error(`Error: Unsupported file type for file: ${media}`);
            return;
        }
    }
    const messageList = document.getElementById(`${name}-message-list`);
    messageList.appendChild(messageBubble);
    const lastMessage = getMessageBubble(name, 0);
    const secondLastMessage = getMessageBubble(name, 1);
    if (secondLastMessage && secondLastMessage.classList.contains(side)) {
        secondLastMessage.classList.remove('last-message');
    }
    lastMessage.classList.add('last-message');
    messageListScrollToBottom(name);
    const unread = side === 'received' && (!chatScreen.classList.contains('active') || !messageList.classList.contains('active'));
    for (const contactItem of contactList.children) {
        const contactName = contactItem.querySelector('.contact-name').textContent;
        if (contactName === name) {
            if (unread && !contactItem.classList.contains('unread')) {
                contactItem.classList.add('unread');
            }
            const preview = contactItem.querySelector('.preview');
            if (unread) {
                preview.innerHTML = '<span class="unread-indicator"></span>';
            }
            else {
                preview.innerHTML = '';
            }
            if (text) {
                preview.innerHTML += ` <div class="preview-text">${text}</div>`;
            }
            else if (media) {
                preview.innerHTML += ' (Media sent)';
            }
            const timestamp = contactItem.querySelector('.timestamp');
            timestamp.textContent = 'now';
            timestamp.title = timeTooltipFormatter.format(date);
            timestamp.setAttribute('datetime', date.toISOString());
            updateTimestamps();
            contactList.prepend(contactItem);
        }
    }
    updateUnreadBadge();
    if (unread) {
        createNotification('Messages', name, text !== null && text !== void 0 ? text : (media ? '(Media sent)' : '-'), date.toISOString());
    }
};
const showTypingIndicator = (name) => {
    const currentAtBottom = atBottom();
    const messageList = document.getElementById(`${name}-message-list`);
    const typingIndicator = messageList.querySelector('.typing-indicator.received');
    messageList.appendChild(typingIndicator);
    typingIndicator.classList.add('visible');
    messageListScrollToBottom(name, currentAtBottom);
};
const hideTypingIndicator = (name) => {
    const messageList = document.getElementById(`${name}-message-list`);
    const typingIndicator = messageList.querySelector('.typing-indicator.received');
    typingIndicator.classList.remove('visible');
};
const addChatTimestamp = (name, date) => {
    const currentAtBottom = atBottom();
    const timestamp = document.createElement('time');
    timestamp.classList.add('chat-timestamp');
    timestamp.textContent = 'now';
    timestamp.title = timeTooltipFormatter.format(date);
    timestamp.setAttribute('datetime', date.toISOString());
    const messageList = document.getElementById(`${name}-message-list`);
    messageList.appendChild(timestamp);
    updateTimestamps();
    messageListScrollToBottom(name, currentAtBottom);
};
const addReaction = (name, emoji, lastMessageAgo = 0) => {
    const messageBubble = getMessageBubble(name, lastMessageAgo);
    if (messageBubble) {
        const currentAtBottom = atBottom();
        const existingReaction = messageBubble.querySelector('.emoji-reaction');
        if (existingReaction) {
            if (existingReaction.textContent === emoji) {
                existingReaction.remove();
            }
            else {
                existingReaction.textContent = emoji;
            }
        }
        else {
            const newReaction = document.createElement('div');
            newReaction.classList.add('emoji-reaction');
            newReaction.textContent = emoji;
            messageBubble.appendChild(newReaction);
        }
        messageListScrollToBottom(name, currentAtBottom);
    }
};
const refreshChoices = (name) => {
    var _a;
    const currentChoiceData = player.currentChoiceMap.get(name);
    if (currentChoiceData && currentChoiceData.choices.length > 0) {
        const currentChoice = currentChoiceData.choices[currentChoiceData.index];
        const messageInput = document.getElementById(`${name}-message-input`);
        messageInput.value = (_a = currentChoice.displayText) !== null && _a !== void 0 ? _a : currentChoice.fullText;
    }
};
const enableChoices = (name, choices) => {
    if (choices.length > 0) {
        player.currentChoiceMap.set(name, {
            choices: choices,
            index: 0,
        });
        refreshChoices(name);
        const messageInput = document.getElementById(`${name}-message-input`);
        messageInput.focus();
        messageInput.classList.add('choice');
    }
};
const disableChoices = (name) => {
    player.currentChoiceMap.delete(name);
    const messageInput = document.getElementById(`${name}-message-input`);
    messageInput.classList.remove('choice');
};
const updateChoiceInput = (name, down) => {
    const currentChoiceData = player.currentChoiceMap.get(name);
    if (currentChoiceData && currentChoiceData.choices.length > 0) {
        if (down) {
            player.currentChoiceMap.set(name, Object.assign(Object.assign({}, currentChoiceData), { index: Math.min(currentChoiceData.index + 1, currentChoiceData.choices.length - 1) }));
        }
        else {
            player.currentChoiceMap.set(name, Object.assign(Object.assign({}, currentChoiceData), { index: Math.max(0, currentChoiceData.index - 1) }));
        }
        refreshChoices(name);
        const messageInput = document.getElementById(`${name}-message-input`);
        messageInput.focus();
    }
};
const choiceChange = (down) => {
    const activeContactName = chatContactName.textContent;
    if (activeContactName) {
        updateChoiceInput(activeContactName, down);
    }
};
const startTypeWriter = (name, text, typingSpeedDelay = DEFAULT_TYPING_SPEED_DELAY) => {
    return new Promise((resolve) => {
        const messageInput = document.getElementById(`${name}-message-input`);
        const messageSend = document.getElementById(`${name}-message-send`);
        messageInput.value = '';
        messageInput.focus();
        if (text) {
            messageSend.disabled = true;
            let charIndex = 0;
            const typing = setInterval(() => {
                if (charIndex < text.length) {
                    messageInput.value += text.charAt(charIndex);
                    ++charIndex;
                    if (messageInput.selectionStart) {
                        messageInput.selectionStart = messageInput.value.length;
                        messageInput.selectionEnd = messageInput.value.length;
                    }
                }
                else {
                    clearInterval(typing);
                    messageSend.disabled = false;
                    resolve(true);
                }
            }, typingSpeedDelay);
        }
    });
};
const startTypeWriterWithSubmit = (name_1, text_1, ...args_1) => __awaiter(void 0, [name_1, text_1, ...args_1], void 0, function* (name, text, typingSpeedDelay = DEFAULT_TYPING_SPEED_DELAY) {
    yield startTypeWriter(name, text, typingSpeedDelay);
    const messageSend = document.getElementById(`${name}-message-send`);
    messageSend.click();
});
const addMessageForm = (name) => {
    const messageInput = document.createElement('input');
    messageInput.classList.add('message-input');
    messageInput.id = `${name}-message-input`;
    messageInput.type = 'text';
    messageInput.placeholder = 'Message';
    messageInput.readOnly = true;
    const messageSend = document.createElement('button');
    messageSend.classList.add('message-send');
    messageSend.id = `${name}-message-send`;
    messageSend.type = 'submit';
    messageSend.innerHTML = `<span class="material-symbols-outlined">arrow_upward</span>`;
    const messageForm = document.createElement('form');
    messageForm.classList.add('message-form');
    messageForm.id = `${name}-message-form`;
    messageForm.appendChild(messageInput);
    messageForm.appendChild(messageSend);
    messageForm.addEventListener('wheel', (event) => {
        updateChoiceInput(name, event.deltaY > 0);
    });
    messageForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        let choiceCallback;
        const currentChoiceData = player.currentChoiceMap.get(name);
        if (currentChoiceData && currentChoiceData.choices.length > 0 && messageInput.value.trim()) {
            const currentChoice = currentChoiceData.choices[currentChoiceData.index];
            const text = currentChoice.fullText;
            const typingSpeedDelay = currentChoice.typingSpeedDelay;
            choiceCallback = currentChoice.callback;
            disableChoices(name);
            yield startTypeWriter(name, text, typingSpeedDelay);
        }
        const messageText = messageInput.value.trim();
        if (messageText) {
            disableChoices(name);
            if (chatContactName.textContent) {
                addMessage(chatContactName.textContent, 'sent', player.date, messageText, undefined);
                if (choiceCallback) {
                    choiceCallback();
                }
            }
            messageInput.value = '';
            messageInput.focus();
            player.pause = player.pause.filter((n) => n !== name);
        }
    }));
    messageForms.appendChild(messageForm);
};
const getActiveMessageSend = () => {
    const activeMessageForm = messageForms.querySelector('.message-form.active');
    const messageSend = activeMessageForm.querySelector('.message-send');
    return messageSend;
};
const switchMessageList = (name) => {
    const messageListId = `${name}-message-list`;
    for (const messageList of messageLists.children) {
        if (messageList.id === messageListId) {
            messageList.classList.add('active');
        }
        else {
            messageList.classList.remove('active');
        }
    }
    const messageFormId = `${name}-message-form`;
    for (const messageForm of messageForms.children) {
        if (messageForm.id === messageFormId) {
            messageForm.classList.add('active');
        }
        else {
            messageForm.classList.remove('active');
        }
    }
};
const addMessageList = (name) => {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.classList.add('message-bubble');
    typingIndicator.classList.add('received');
    typingIndicator.innerHTML = `<div class="typing-bubble">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>`;
    const messageList = document.createElement('div');
    messageList.classList.add('message-list');
    messageList.id = `${name}-message-list`;
    messageList.appendChild(typingIndicator);
    messageLists.appendChild(messageList);
    addMessageForm(name);
};
const getFullName = (firstname, lastname) => {
    if (firstname || lastname) {
        return `${firstname !== null && firstname !== void 0 ? firstname : ''} ${lastname !== null && lastname !== void 0 ? lastname : ''}`.trim();
    }
    else {
        return 'Unknown Contact';
    }
};
const getNameInitials = (firstname, lastname) => {
    if (firstname && lastname) {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`;
    }
    else if (firstname && !lastname) {
        return firstname.substring(0, 2);
    }
    else if (!firstname && lastname) {
        return lastname.substring(0, 2);
    }
    else {
        return '?';
    }
};
const addContact = (firstname, lastname, avatar) => {
    const name = getFullName(firstname, lastname);
    const avatarImage = document.getElementById(`${name}-contact-avatar`);
    if (avatarImage) {
        avatarImage.src = avatar;
        return name;
    }
    const item = document.createElement('div');
    item.classList.add('contact-item');
    item.innerHTML = `
    <img id="${name}-contact-avatar" class="avatar" alt="${getNameInitials(firstname, lastname)}" src="${avatar}">
    <div class="contact-item-content">
      <div class="contact-item-header">
        <span class="contact-name">${name}</span>
        <time class="timestamp with-right-arrow"></time>
      </div>
      <div class="preview">
      </div>
    </div>
  `;
    item.addEventListener('click', () => {
        if (item.classList.contains('unread')) {
            item.classList.remove('unread');
            const unreadIndicator = item.querySelector('.unread-indicator');
            if (unreadIndicator) {
                unreadIndicator.remove();
            }
        }
        updateUnreadBadge();
        mainScreen.classList.remove('active');
        chatScreen.classList.add('active');
        chatScreen.classList.add('visible');
        refreshChatContact(item);
        const contactName = item.querySelector('.contact-name').textContent;
        switchMessageList(contactName);
        setTimeout(() => {
            mainScreen.classList.remove('visible');
            messageListScrollToBottom();
        }, 100);
    });
    contactList.prepend(item);
    addMessageList(name);
    return name;
};
const renameContact = (oldName, firstname, lastname, avatar) => {
    const newName = getFullName(firstname, lastname);
    const avatarImage = document.getElementById(`${oldName}-contact-avatar`);
    avatarImage.id = `${newName}-contact-avatar`;
    avatarImage.alt = `${getNameInitials(firstname, lastname)}`;
    avatarImage.src = avatar !== null && avatar !== void 0 ? avatar : '';
    const oldMessageForm = document.getElementById(`${oldName}-message-form`);
    oldMessageForm.remove();
    addMessageForm(newName);
    for (const contactItem of contactList.children) {
        const contactName = contactItem.querySelector('.contact-name');
        if (contactName.textContent === oldName) {
            contactName.textContent = newName;
            contactList.prepend(contactItem);
            if (chatContactName.textContent === oldName) {
                refreshChatContact(contactItem);
                const messageForm = document.getElementById(`${newName}-message-form`);
                messageForm.classList.add('active');
            }
        }
    }
    const messageList = document.getElementById(`${oldName}-message-list`);
    messageList.id = `${newName}-message-list`;
    return newName;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const navigateChatBack = () => {
    mainScreen.classList.add('active');
    chatScreen.classList.remove('active');
    mainScreen.classList.add('visible');
    setTimeout(() => {
        chatScreen.classList.remove('visible');
        chatContactName.textContent = null;
    }, 100);
};
const setSkipMode = (skip) => {
    player.skipMode = skip;
    if (skip) {
        accessibilitySkip.classList.add('on');
    }
    else {
        accessibilitySkip.classList.remove('on');
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleSkipMode = () => {
    setSkipMode(!player.skipMode);
};
const toggleContactVisibility = (name, show) => {
    for (const contactItem of contactList.children) {
        const contactName = contactItem.querySelector('.contact-name').textContent;
        if (contactName === name) {
            if (show) {
                contactItem.classList.remove('hidden');
            }
            else {
                contactItem.classList.add('hidden');
            }
        }
    }
};
const setupListeners = () => {
    document.addEventListener('keydown', (event) => {
        var _a, _b;
        if (event.key === 'Escape') {
            hideImageOverlay();
            hideVideoOverlay();
        }
        if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
            event.preventDefault();
            (_a = getActiveMessageSend()) === null || _a === void 0 ? void 0 : _a.click();
        }
        if (event.key === 'Control') {
            setSkipMode(true);
            const activeContactName = chatContactName.textContent;
            if (activeContactName) {
                const currentChoiceData = player.currentChoiceMap.get(activeContactName);
                if (!currentChoiceData) {
                    (_b = getActiveMessageSend()) === null || _b === void 0 ? void 0 : _b.click();
                }
            }
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            choiceChange(false);
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            choiceChange(true);
        }
    });
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Control') {
            setSkipMode(false);
        }
    });
    accessibilityCheckbox.addEventListener('change', () => {
        player.accessibility = accessibilityCheckbox.checked;
        if (player.accessibility) {
            accessibilityControls.classList.add('visible');
        }
        else {
            accessibilityControls.classList.remove('visible');
        }
    });
    tutorialCheckbox.addEventListener('change', () => {
        player.showTutorial = tutorialCheckbox.checked;
        toggleContactVisibility('Tutorial Guide', player.showTutorial);
    });
    unitTestsCheckbox.addEventListener('change', () => {
        player.showUnitTests = unitTestsCheckbox.checked;
        toggleContactVisibility('Jane Doe', player.showUnitTests);
        toggleContactVisibility('Sarah Smith', player.showUnitTests);
    });
    accessibilityCheckbox.checked = isMobile();
    tutorialCheckbox.checked = player.showTutorial;
    unitTestsCheckbox.checked = player.showUnitTests;
    accessibilityCheckbox.dispatchEvent(new Event('change'));
    tutorialCheckbox.dispatchEvent(new Event('change'));
    unitTestsCheckbox.dispatchEvent(new Event('change'));
    editLabel.addEventListener('click', () => {
        mainScreen.classList.remove('active');
        settingsScreen.classList.add('active');
        settingsScreen.classList.add('visible');
        setTimeout(() => {
            mainScreen.classList.remove('visible');
        }, 100);
    });
    const statusBar = document.querySelector('.status-bar');
    statusBar.addEventListener('click', () => {
        console.log(JSON.stringify(player, null, 2));
    });
};
const initialize = () => {
    addContact('System', 'Messages', 'resources/system-messages.png');
    addMessage('System Messages', 'received', player.date, `Hello!`);
    addMessage('System Messages', 'received', player.date, `Don't forget to check out the tutorial if you're new!`);
    document.addEventListener('DOMContentLoaded', setupListeners);
};
initialize();
//# sourceMappingURL=ui.js.map