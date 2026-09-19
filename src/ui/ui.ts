import { BATTERY_PERCENT_PER_STAGE, DEFAULT_TYPING_SPEED_DELAY, MESSAGE_SPEED_OPTIONS } from '../common/constants';
import type { Side, Choice } from '../common/types';
import { clockFormatter, timeTooltipFormatter } from '../date/constants';
import { formatRelativeTime, formatSpecificRelativeDate } from '../date/utils';
import { state } from '../state/state';
import { consoleLogColor } from '../utils/debug';
import { isImageMedia, isMobile } from '../utils/helper';
import { getDomElement, queryDom } from '../utils/ui';

const clock = getDomElement<HTMLSpanElement>('clock');
const batteryIcon = getDomElement<HTMLSpanElement>('battery');
const settingsScreen = getDomElement<HTMLDivElement>('settings-screen');
export const messageSpeedSetting = getDomElement<HTMLSpanElement>('setting-message-speed');
const accessibilityCheckbox = getDomElement<HTMLInputElement>('setting-accessibility-checkbox');
const darkModeCheckbox = getDomElement<HTMLInputElement>('setting-dark-mode-checkbox');
const relativeTimestampCheckbox = getDomElement<HTMLInputElement>('setting-relative-timestamp-checkbox');
const tutorialCheckbox = getDomElement<HTMLInputElement>('setting-tutorial-checkbox');
const unitTestsCheckbox = getDomElement<HTMLInputElement>('setting-unit-test-checkbox');
const settingsBackButton = getDomElement<HTMLButtonElement>('settings-back-button');
const chatBackButton = getDomElement<HTMLButtonElement>('chat-back-button');
const mainScreen = getDomElement<HTMLDivElement>('main-screen');
const editLabel = getDomElement<HTMLLabelElement>('main-header-edit');
const contactList = getDomElement<HTMLDivElement>('contact-list');
const chatScreen = getDomElement<HTMLDivElement>('chat-screen');
const unreadBadge = getDomElement<HTMLSpanElement>('unread-badge');
const chatContactAvatar = getDomElement<HTMLImageElement>('chat-header-contact-avatar');
export const chatContactName = getDomElement<HTMLDivElement>('chat-header-contact-name');
const accessibilityControls = getDomElement<HTMLDivElement>('accessibility-controls');
const accessibilityChoiceUp = getDomElement<HTMLButtonElement>('accessibility-choice-up');
const accessibilityChoiceDown = getDomElement<HTMLButtonElement>('accessibility-choice-down');
const accessibilitySkip = getDomElement<HTMLButtonElement>('accessibility-skip-button');
const messageLists = getDomElement<HTMLDivElement>('message-lists');
const messageForms = getDomElement<HTMLDivElement>('message-forms');
const imageOverlayContainer = getDomElement<HTMLDivElement>('image-overlay-container');
const imageOverlayImage = getDomElement<HTMLImageElement>('image-overlay-image');
const videoOverlayContainer = getDomElement<HTMLDivElement>('video-overlay-container');
const videoOverlayVideo = getDomElement<HTMLVideoElement>('video-overlay-video');
const notificationContainer = getDomElement<HTMLDivElement>('notification-container');

function updateTimestamps(): void {
  const contactTimeElements = document.querySelectorAll('time.timestamp');
  contactTimeElements.forEach((element) => {
    const datetime = element.getAttribute('datetime');
    if (datetime) {
      element.textContent = formatRelativeTime(state.gameState.date, datetime);
    }
  });

  const chatTimeElements = document.querySelectorAll('time.chat-timestamp');
  chatTimeElements.forEach((element) => {
    const datetime = element.getAttribute('datetime');
    if (datetime) {
      if (state.settingsState.relativeTimestamp) {
        element.textContent = formatSpecificRelativeDate(state.gameState.date, datetime);
      } else {
        element.textContent = (element as HTMLTimeElement).title;
      }
    }
  });
}

export function updateClock(): void {
  clock.textContent = clockFormatter.format(state.gameState.date);
  updateTimestamps();
}

export function updateBatteryLevel(percent: number): void {
  state.gameState.batteryPercent = percent;

  if (percent >= BATTERY_PERCENT_PER_STAGE * 7) {
    batteryIcon.textContent = 'battery_android_full';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 6)) {
    batteryIcon.textContent = 'battery_android_6';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 5)) {
    batteryIcon.textContent = 'battery_android_5';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 4)) {
    batteryIcon.textContent = 'battery_android_4';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 3)) {
    batteryIcon.textContent = 'battery_android_3';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 2)) {
    batteryIcon.textContent = 'battery_android_2';
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE)) {
    batteryIcon.textContent = 'battery_android_1';
  } else {
    batteryIcon.textContent = 'battery_android_0';
  }

  if (batteryIcon.classList.contains('low')) {
    if (percent >= Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
      batteryIcon.classList.remove('low');
    }
  } else {
    if (percent < Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
      batteryIcon.classList.add('low');
    }
  }
}

export function navigateSettingsBack(): void {
  mainScreen.classList.add('active');
  settingsScreen.classList.remove('active');
  mainScreen.classList.add('visible');
  settingsScreen.classList.remove('visible');
}

function updateUnreadBadge(): void {
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
    } else {
      unreadBadge.classList.remove('wide');
    }
  } else {
    unreadBadge.classList.add('hidden');
  }
}

function refreshChatContact(contactItem: HTMLDivElement): void {
  const avatar = queryDom<HTMLImageElement>(contactItem, '.avatar');
  const name = queryDom<HTMLSpanElement>(contactItem, '.contact-name').textContent;

  chatContactAvatar.src = avatar.src;
  chatContactAvatar.alt = avatar.alt;
  chatContactName.textContent = name;
}

function getMessageBubble(name: string, lastMessageAgo: number): Element | undefined {
  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  const messageBubbles = Array.from(messageList.children).filter((element) => {
    return element.classList.contains('message-bubble') && !element.classList.contains('typing-indicator');
  });
  return messageBubbles[messageBubbles.length - 1 - lastMessageAgo];
}

function showImageOverlay(image: string): void {
  imageOverlayContainer.classList.add('active');
  imageOverlayImage.src = image;
}

function hideImageOverlay(): void {
  imageOverlayContainer.classList.remove('active');
  imageOverlayImage.removeAttribute('src');
}

function showVideoOverlay(video: string): void {
  videoOverlayContainer.classList.add('active');
  const sources = videoOverlayVideo.getElementsByTagName('source');
  for (const source of sources) {
    source.src = video;
  }
  videoOverlayVideo.load();
}

function hideVideoOverlay(): void {
  videoOverlayContainer.classList.remove('active');
  const sources = videoOverlayVideo.getElementsByTagName('source');
  for (const source of sources) {
    source.removeAttribute('src');
  }
}

function isMessageListActive(name: string): boolean {
  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  return messageList.classList.contains('active');
}

function atBottom(): boolean {
  return Math.ceil(messageLists.scrollTop) >= messageLists.scrollHeight - messageLists.offsetHeight;
}

function messageListScrollToBottom(name?: string, previouslyAtBottom?: boolean): void {
  const nameCondition = !name || isMessageListActive(name);
  const atBottomCondition = previouslyAtBottom === undefined || previouslyAtBottom;

  if (nameCondition && atBottomCondition) {
    messageLists.scrollTop = messageLists.scrollHeight;
  }
}

export function createNotification(app: string, name: string, body: string, datetime: string | Date): void {
  const notification = document.createElement('div');
  notification.classList.add('notification');

  const avatarImage = getDomElement<HTMLImageElement>(`${name}-contact-avatar`, false);
  notification.innerHTML = `
    <img class="avatar" alt="${avatarImage?.alt ?? '?'}" src="${avatarImage?.src ?? ''}">
    <div class="notification-content">
      <div class="notification-header">
        <span>${app}</span>
        <span>${formatRelativeTime(state.gameState.date, datetime)}</span>
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
    notification.addEventListener(
      'transitionend',
      () => {
        notificationContainer.removeChild(notification);
      },
      { once: true },
    );
  }, 3000);
}

export function addMessage(name: string, side: Side, date: Date, text?: string, media?: string): void {
  if (!text && !media) {
    return;
  }
  if (text && media) {
    addMessage(name, side, date, undefined, media);
  }

  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble', side);

  if (text) {
    messageBubble.innerHTML = text.replace(/\p{Extended_Pictographic}/gu, (match) => {
      return `<span class='emoji-text'>${match}</span>`;
    });
  } else if (media) {
    if (isImageMedia(media)) {
      const imageElement = document.createElement('img');

      imageElement.classList.add('message-media');
      imageElement.alt = `${media}`;

      imageElement.addEventListener('click', (): void => {
        showImageOverlay(imageElement.src);
      });

      imageElement.onload = (): void => {
        messageListScrollToBottom(name);
      };

      imageElement.onerror = (): void => {
        imageElement.onerror = null;
        imageElement.classList.add('invalid-media');
        imageElement.src = 'resources/missing-preview.png';
      };

      imageElement.src = media;

      messageBubble.appendChild(imageElement);
    } else if (media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.webm')) {
      const videoElement = document.createElement('video');
      videoElement.classList.add('message-media');
      videoElement.classList.add('message-video');
      videoElement.controls = true;
      videoElement.preload = 'metadata';
      videoElement.muted = true;
      const videoType = media.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      videoElement.innerHTML = `
        <source src="${media}" type="${videoType}">
        Your browser does not support HTML video.
      `;
      videoElement.addEventListener('loadedmetadata', () => {
        messageListScrollToBottom(name);
      });
      videoElement.addEventListener(
        'error',
        () => {
          messageBubble.classList.add('invalid-media');
          videoElement.poster = 'resources/missing-preview.png';
          messageListScrollToBottom(name);
        },
        true,
      );

      messageBubble.addEventListener('click', () => {
        showVideoOverlay(media);
      });
      messageBubble.appendChild(videoElement);
    } else {
      console.error(`Error: Unsupported file type for file: ${media}`);
      return;
    }
  }

  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  messageList.appendChild(messageBubble);

  const lastMessage = getMessageBubble(name, 0);
  const secondLastMessage = getMessageBubble(name, 1);
  if (secondLastMessage && secondLastMessage.classList.contains(side)) {
    secondLastMessage.classList.remove('last-message');
  }
  lastMessage?.classList.add('last-message');

  messageListScrollToBottom(name);

  const unread =
    side === 'received' && (!chatScreen.classList.contains('active') || !messageList.classList.contains('active'));

  for (const contactItem of contactList.children) {
    const contactName = queryDom<HTMLSpanElement>(contactItem, '.contact-name').textContent;
    if (contactName === name) {
      if (unread && !contactItem.classList.contains('unread')) {
        contactItem.classList.add('unread');
      }

      const preview = queryDom<HTMLDivElement>(contactItem, '.preview');
      if (unread) {
        preview.innerHTML = '<span class="unread-indicator"></span>';
      } else {
        preview.innerHTML = '';
      }
      if (text) {
        preview.innerHTML += ` <div class="preview-text">${text}</div>`;
      } else if (media) {
        preview.innerHTML += ' (Media sent)';
      }

      const timestamp = queryDom<HTMLTimeElement>(contactItem, '.timestamp');
      timestamp.textContent = 'now';
      timestamp.title = timeTooltipFormatter.format(date);
      timestamp.setAttribute('datetime', date.toISOString());
      updateTimestamps();

      contactList.prepend(contactItem);
    }
  }

  updateUnreadBadge();

  if (unread) {
    createNotification('Messages', name, text ?? (media ? '(Media sent)' : '-'), date.toISOString());
  }
}

export function showTypingIndicator(name: string): void {
  const currentAtBottom = atBottom();

  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  const typingIndicator = queryDom<HTMLDivElement>(messageList, '.typing-indicator.received');
  messageList.appendChild(typingIndicator);
  typingIndicator.classList.add('visible');

  messageListScrollToBottom(name, currentAtBottom);
}

export function hideTypingIndicator(name: string): void {
  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  const typingIndicator = queryDom<HTMLDivElement>(messageList, '.typing-indicator.received');
  typingIndicator.classList.remove('visible');
}

export function addChatTimestamp(name: string, date: Date, fixedText?: string): void {
  const currentAtBottom = atBottom();

  const timestamp = document.createElement('time') as HTMLTimeElement;
  timestamp.classList.add('chat-timestamp');
  timestamp.title = timeTooltipFormatter.format(date);
  timestamp.textContent = fixedText ?? 'now';
  if (!fixedText) {
    timestamp.setAttribute('datetime', date.toISOString());
  }

  const messageList = getDomElement<HTMLDivElement>(`${name}-message-list`);
  messageList.appendChild(timestamp);

  updateTimestamps();

  messageListScrollToBottom(name, currentAtBottom);
}

export function addReaction(name: string, emoji: string, lastMessageAgo: number = 0): void {
  const messageBubble = getMessageBubble(name, lastMessageAgo);
  if (messageBubble) {
    const currentAtBottom = atBottom();

    const existingReaction = queryDom<HTMLDivElement>(messageBubble, '.emoji-reaction', false);
    if (existingReaction) {
      if (existingReaction.textContent === emoji) {
        existingReaction.remove();
      } else {
        existingReaction.textContent = emoji;
      }
    } else {
      const newReaction = document.createElement('div');
      newReaction.classList.add('emoji-reaction');
      newReaction.textContent = emoji;

      messageBubble.appendChild(newReaction);
    }

    messageListScrollToBottom(name, currentAtBottom);
  }
}

function refreshChoices(name: string): void {
  const currentChoiceData = state.gameState.currentChoiceMap.get(name);
  if (currentChoiceData && currentChoiceData.choices.length > 0) {
    const currentChoice = currentChoiceData.choices[currentChoiceData.index];

    const messageInput = getDomElement<HTMLInputElement>(`${name}-message-input`);
    messageInput.value = currentChoice?.displayText ?? currentChoice?.fullText ?? '';
  }
}

export function enableChoices(name: string, choices: Choice[]): void {
  if (choices.length > 0) {
    state.gameState.currentChoiceMap.set(name, {
      choices: choices,
      index: 0,
    });
    refreshChoices(name);

    const messageInput = getDomElement<HTMLInputElement>(`${name}-message-input`);
    messageInput.focus();
    messageInput.classList.add('choice');
  }
}

function disableChoices(name: string): void {
  state.gameState.currentChoiceMap.delete(name);

  const messageInput = getDomElement<HTMLInputElement>(`${name}-message-input`);
  messageInput.classList.remove('choice');
}

function updateChoiceInput(name: string, down: boolean): void {
  const currentChoiceData = state.gameState.currentChoiceMap.get(name);
  if (currentChoiceData && currentChoiceData.choices.length > 0) {
    if (down) {
      state.gameState.currentChoiceMap.set(name, {
        ...currentChoiceData,
        index: Math.min(currentChoiceData.index + 1, currentChoiceData.choices.length - 1),
      });
    } else {
      state.gameState.currentChoiceMap.set(name, {
        ...currentChoiceData,
        index: Math.max(0, currentChoiceData.index - 1),
      });
    }
    refreshChoices(name);

    const messageInput = getDomElement<HTMLInputElement>(`${name}-message-input`);
    messageInput.focus();
  }
}

function choiceChange(down: boolean): void {
  const activeContactName = chatContactName.textContent;
  if (activeContactName) {
    updateChoiceInput(activeContactName, down);
  }
}

export function startTypeWriter(
  name: string,
  text: string,
  typingSpeedDelay: number = DEFAULT_TYPING_SPEED_DELAY,
): Promise<boolean> {
  return new Promise((resolve) => {
    const messageInput = getDomElement<HTMLInputElement>(`${name}-message-input`);
    const messageSend = getDomElement<HTMLButtonElement>(`${name}-message-send`);

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
        } else {
          clearInterval(typing);
          messageSend.disabled = false;
          resolve(true);
        }
      }, typingSpeedDelay);
    }
  });
}

export async function startTypeWriterWithSubmit(
  name: string,
  text: string,
  typingSpeedDelay: number = DEFAULT_TYPING_SPEED_DELAY,
): Promise<void> {
  await startTypeWriter(name, text, typingSpeedDelay);
  const messageSend = getDomElement<HTMLButtonElement>(`${name}-message-send`);
  messageSend.click();
}

function addMessageForm(name: string): void {
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

  messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let choiceCallback;
    const currentChoiceData = state.gameState.currentChoiceMap.get(name);
    if (currentChoiceData && currentChoiceData.choices.length > 0 && messageInput.value.trim()) {
      const currentChoice = currentChoiceData.choices[currentChoiceData.index];

      if (!currentChoice) {
        throw new Error(`Message Form Submit`);
      }

      const text = currentChoice.fullText;
      const typingSpeedDelay = currentChoice.typingSpeedDelay;
      choiceCallback = currentChoice.callback;
      disableChoices(name);
      await startTypeWriter(name, text, typingSpeedDelay);
    }

    const messageText = messageInput.value.trim();
    if (messageText) {
      disableChoices(name);

      if (chatContactName.textContent) {
        addMessage(chatContactName.textContent, 'sent', state.gameState.date, messageText, undefined);
        if (choiceCallback) {
          choiceCallback();
        }
      }

      messageInput.value = '';
      messageInput.focus();

      state.gameState.pause = state.gameState.pause.filter((n) => n !== name);
    }
  });

  messageForms.appendChild(messageForm);
}

function getActiveMessageSend(): HTMLButtonElement | undefined {
  const activeMessageForm = queryDom<HTMLFormElement>(messageForms, '.message-form.active');
  const messageSend = queryDom<HTMLButtonElement>(activeMessageForm, '.message-send');
  return messageSend;
}

function switchMessageList(name: string): void {
  const messageListId = `${name}-message-list`;
  for (const messageList of messageLists.children) {
    if (messageList.id === messageListId) {
      messageList.classList.add('active');
    } else {
      messageList.classList.remove('active');
    }
  }

  const messageFormId = `${name}-message-form`;
  for (const messageForm of messageForms.children) {
    if (messageForm.id === messageFormId) {
      messageForm.classList.add('active');
    } else {
      messageForm.classList.remove('active');
    }
  }
}

function addMessageList(name: string): void {
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
}

function getFullName(firstname?: string, lastname?: string): string {
  if (firstname || lastname) {
    return `${firstname ?? ''} ${lastname ?? ''}`.trim();
  } else {
    return 'Unknown Contact';
  }
}

function getNameInitials(firstname?: string, lastname?: string): string {
  if (firstname && lastname) {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`;
  } else if (firstname && !lastname) {
    return firstname.substring(0, 2);
  } else if (!firstname && lastname) {
    return lastname.substring(0, 2);
  } else {
    return '?';
  }
}

export function addContact(firstname: string, lastname: string, avatar: string): string {
  const name = getFullName(firstname, lastname);
  const avatarImage = getDomElement<HTMLImageElement>(`${name}-contact-avatar`, false);
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
      const unreadIndicator = queryDom(item, '.unread-indicator');
      if (unreadIndicator) {
        unreadIndicator.remove();
      }
    }
    updateUnreadBadge();

    mainScreen.classList.remove('active');
    chatScreen.classList.add('active');
    chatScreen.classList.add('visible');

    refreshChatContact(item);
    const contactName = queryDom<HTMLSpanElement>(item, '.contact-name').textContent as string;
    switchMessageList(contactName);

    setTimeout(() => {
      mainScreen.classList.remove('visible');
      messageListScrollToBottom();
    }, 100);
  });

  contactList.prepend(item);

  addMessageList(name);

  return name;
}

export function renameContact(oldName: string, firstname: string, lastname: string, avatar?: string): string {
  const newName = getFullName(firstname, lastname);

  const avatarImage = getDomElement<HTMLImageElement>(`${oldName}-contact-avatar`);
  avatarImage.id = `${newName}-contact-avatar`;
  avatarImage.alt = `${getNameInitials(firstname, lastname)}`;
  avatarImage.src = avatar ?? '';

  const oldMessageForm = getDomElement<HTMLFormElement>(`${oldName}-message-form`);
  oldMessageForm.remove();
  addMessageForm(newName);

  for (const contactItem of contactList.children) {
    const contactName = queryDom<HTMLSpanElement>(contactItem, '.contact-name');
    if (contactName.textContent === oldName) {
      contactName.textContent = newName;
      contactList.prepend(contactItem);

      if (chatContactName.textContent === oldName) {
        refreshChatContact(contactItem as HTMLDivElement);

        const messageForm = getDomElement<HTMLFormElement>(`${newName}-message-form`);
        messageForm.classList.add('active');
      }
    }
  }

  const messageList = getDomElement<HTMLDivElement>(`${oldName}-message-list`);
  messageList.id = `${newName}-message-list`;

  return newName;
}

export function navigateChatBack(): void {
  mainScreen.classList.add('active');
  chatScreen.classList.remove('active');
  mainScreen.classList.add('visible');

  setTimeout(() => {
    chatScreen.classList.remove('visible');
    chatContactName.textContent = null;
  }, 100);
}

function setSkipMode(skip: boolean): void {
  state.gameState.skipMode = skip;

  if (skip) {
    accessibilitySkip.classList.add('on');
  } else {
    accessibilitySkip.classList.remove('on');
  }
}

export function toggleSkipMode(): void {
  setSkipMode(!state.gameState.skipMode);
}

function toggleContactVisibility(name: string, show: boolean): void {
  for (const contactItem of contactList.children) {
    const contactName = queryDom<HTMLSpanElement>(contactItem, '.contact-name').textContent;
    if (contactName === name) {
      if (show) {
        contactItem.classList.remove('hidden');
      } else {
        contactItem.classList.add('hidden');
      }
    }
  }
}

export function refreshMessageSpeedSettingText(): void {
  const option = MESSAGE_SPEED_OPTIONS.find((option) => option.value === state.settingsState.messageSpeed);

  messageSpeedSetting.textContent = option?.label ?? 'Unknown';
}

function setupListeners(): void {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideImageOverlay();
      hideVideoOverlay();
    }
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
      event.preventDefault();
      getActiveMessageSend()?.click();
    }
    if (event.key === 'Control') {
      setSkipMode(true);

      const activeContactName = chatContactName.textContent;
      if (activeContactName) {
        const currentChoiceData = state.gameState.currentChoiceMap.get(activeContactName);
        if (!currentChoiceData) {
          getActiveMessageSend()?.click();
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

  messageSpeedSetting.addEventListener('click', () => {
    const currentIndex = MESSAGE_SPEED_OPTIONS.findIndex((option) => option.value === state.settingsState.messageSpeed);

    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % MESSAGE_SPEED_OPTIONS.length;
    const nextOption = MESSAGE_SPEED_OPTIONS[nextIndex];

    if (!nextOption) {
      throw new Error(`Invalid message speed index: ${nextIndex}`);
    }

    state.settingsState.messageSpeed = nextOption.value;

    refreshMessageSpeedSettingText();
  });

  darkModeCheckbox.addEventListener('change', () => {
    state.settingsState.darkMode = darkModeCheckbox.checked;
    document.documentElement.dataset.theme = state.settingsState.darkMode ? 'dark' : 'light';
  });

  accessibilityCheckbox.addEventListener('change', () => {
    state.settingsState.accessibility = accessibilityCheckbox.checked;

    if (state.settingsState.accessibility) {
      accessibilityControls.classList.add('visible');
    } else {
      accessibilityControls.classList.remove('visible');
    }
  });

  relativeTimestampCheckbox.addEventListener('change', () => {
    state.settingsState.relativeTimestamp = relativeTimestampCheckbox.checked;
    updateTimestamps();
  });

  tutorialCheckbox.addEventListener('change', () => {
    state.settingsState.showTutorial = tutorialCheckbox.checked;
    toggleContactVisibility('Tutorial Guide', state.settingsState.showTutorial);
  });

  unitTestsCheckbox.addEventListener('change', () => {
    state.settingsState.showUnitTests = unitTestsCheckbox.checked;
    toggleContactVisibility('Jane Doe', state.settingsState.showUnitTests);
    toggleContactVisibility('Sarah Smith', state.settingsState.showUnitTests);
  });

  settingsBackButton.addEventListener('click', navigateSettingsBack);
  chatBackButton.addEventListener('click', navigateChatBack);

  accessibilityChoiceUp.addEventListener('click', () => {
    choiceChange(false);
  });

  accessibilityChoiceDown.addEventListener('click', () => {
    choiceChange(true);
  });

  accessibilitySkip.addEventListener('click', () => {
    toggleSkipMode();
  });

  imageOverlayContainer.addEventListener('click', hideImageOverlay);

  const videoCloseButton = queryDom<HTMLButtonElement>(document, '#video-overlay-container .close-button');

  videoCloseButton.addEventListener('click', hideVideoOverlay);

  darkModeCheckbox.checked = state.settingsState.darkMode;
  darkModeCheckbox.dispatchEvent(new Event('change'));

  accessibilityCheckbox.checked = isMobile();
  relativeTimestampCheckbox.checked = state.settingsState.relativeTimestamp;
  tutorialCheckbox.checked = state.settingsState.showTutorial;
  unitTestsCheckbox.checked = state.settingsState.showUnitTests;
  accessibilityCheckbox.dispatchEvent(new Event('change'));
  relativeTimestampCheckbox.dispatchEvent(new Event('change'));
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

  const statusBar = queryDom<HTMLDivElement>(document, '.status-bar');
  statusBar.addEventListener('click', () => {
    consoleLogColor(state);
  });
}

export function initialize(): void {
  addContact('System', 'Messages', 'resources/system-messages.png');
  addMessage('System Messages', 'received', state.gameState.date, `Hello!`);
  addMessage(
    'System Messages',
    'received',
    state.gameState.date,
    `Don't forget to check out the tutorial if you're new!`,
  );

  document.addEventListener('DOMContentLoaded', setupListeners);

  refreshMessageSpeedSettingText();
}
