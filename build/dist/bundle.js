// src/common/constants.ts
var DEFAULT_TYPING_SPEED_DELAY = 10;
var BATTERY_PERCENT_PER_STAGE = 100 / 7;
var MessageSpeed = {
  INSTANT: 0,
  FAST: 250,
  NORMAL: 500,
  SLOW: 1e3,
  SLOWEST: 2e3
};
var { INSTANT, FAST, NORMAL, SLOW, SLOWEST } = MessageSpeed;
var MESSAGE_SPEED_OPTIONS = [
  {
    value: MessageSpeed.INSTANT,
    label: "Instant",
    multiplier: 0
  },
  {
    value: MessageSpeed.FAST,
    label: "Fast",
    multiplier: 0.5
  },
  {
    value: MessageSpeed.NORMAL,
    label: "Normal",
    multiplier: 1
  },
  {
    value: MessageSpeed.SLOW,
    label: "Slow",
    multiplier: 1.5
  },
  {
    value: MessageSpeed.SLOWEST,
    label: "Slowest",
    multiplier: 2
  }
];

// src/date/constants.ts
var Month = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11
};
var { JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER } = Month;
var RELATIVE_TIME_UNITS = [
  ["year", 86400 * 365],
  ["month", 86400 * 30],
  ["week", 86400 * 7],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1]
];
var DEFAULT_LOCALE = typeof navigator === "undefined" ? "en-US" : navigator.language;
var clockFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZone: "UTC"
});
var timeTooltipFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZone: "UTC"
});

// src/state/state.ts
var state = {
  settingsState: {
    messageSpeed: MessageSpeed.NORMAL,
    accessibility: false,
    darkMode: false,
    relativeTimestamp: false,
    showTutorial: true,
    showUnitTests: false
  },
  gameState: {
    date: new Date(Date.UTC(2025, Month.OCTOBER, 1, 17, 0)),
    flags: /* @__PURE__ */ new Set(),
    batteryPercent: 100,
    skipMode: false,
    pause: [],
    currentChoiceMap: /* @__PURE__ */ new Map()
  }
};

// src/date/utils.ts
function formatRelativeTime(fromDate, toDate, locale = DEFAULT_LOCALE) {
  const targetDate = new Date(toDate);
  const targetTime = targetDate.getTime();
  if (Number.isNaN(targetTime)) {
    throw new Error(`Invalid date: ${toDate}`);
  }
  const deltaSeconds = Math.round((targetTime - fromDate.getTime()) / 1e3);
  const absoluteSeconds = Math.abs(deltaSeconds);
  const [unit, seconds] = RELATIVE_TIME_UNITS.find(([, seconds2]) => absoluteSeconds >= seconds2) ?? RELATIVE_TIME_UNITS.at(-1);
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto"
  }).format(Math.round(deltaSeconds / seconds), unit);
}
function getUtcDay(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
function formatSpecificRelativeDate(now, toDate, locale = DEFAULT_LOCALE) {
  const date = new Date(toDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${toDate}`);
  }
  const difference = (getUtcDay(date) - getUtcDay(now)) / 864e5;
  const time = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
  if (difference === 0) {
    return `Today ${time}`;
  }
  if (difference === 1) {
    return `Tomorrow ${time}`;
  }
  if (difference === -1) {
    return `Yesterday ${time}`;
  }
  return date.toLocaleString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
}

// src/utils/debug.ts
function consoleLogColor(value) {
  const json = JSON.stringify(value, null, 2);
  if (json === void 0) {
    console.log(value);
    return;
  }
  const styles = [];
  const coloredJson = json.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?=\s*:)|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\b(?:true|false|null)\b|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let style = "color: #b5cea8;";
      if (match.startsWith('"')) {
        style = match.endsWith(":") ? "color: #9cdcfe;" : "color: #ce9178;";
      } else if (match === "true" || match === "false" || match === "null") {
        style = "color: #569cd6;";
      }
      styles.push(style, "color: inherit;");
      return `%c${match}%c`;
    }
  );
  console.log(coloredJson, ...styles);
}

// src/utils/helper.ts
function isMobile() {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function isImageMedia(src) {
  const srcPath = src.split("?")[0] ?? "";
  return /\.(?:jpg|jpeg|png|gif|webp)$/i.test(srcPath);
}

// src/utils/ui.ts
function getDomElement(id, required = true) {
  const element = document.getElementById(id);
  if (element === null) {
    if (required) {
      throw new Error(`Element with ID "#${id}" not found`);
    }
    return null;
  }
  return element;
}
function queryDom(parent, selector, required = true) {
  const element = parent.querySelector(selector);
  if (element === null) {
    if (required) {
      throw new Error(`Element not found for selector: "${selector}"`);
    }
    return null;
  }
  return element;
}

// src/ui/ui.ts
var clock = getDomElement("clock");
var batteryIcon = getDomElement("battery");
var settingsScreen = getDomElement("settings-screen");
var messageSpeedSetting = getDomElement("setting-message-speed");
var accessibilityCheckbox = getDomElement("setting-accessibility-checkbox");
var darkModeCheckbox = getDomElement("setting-dark-mode-checkbox");
var relativeTimestampCheckbox = getDomElement("setting-relative-timestamp-checkbox");
var tutorialCheckbox = getDomElement("setting-tutorial-checkbox");
var unitTestsCheckbox = getDomElement("setting-unit-test-checkbox");
var settingsBackButton = getDomElement("settings-back-button");
var chatBackButton = getDomElement("chat-back-button");
var mainScreen = getDomElement("main-screen");
var editLabel = getDomElement("main-header-edit");
var contactList = getDomElement("contact-list");
var chatScreen = getDomElement("chat-screen");
var unreadBadge = getDomElement("unread-badge");
var chatContactAvatar = getDomElement("chat-header-contact-avatar");
var chatContactName = getDomElement("chat-header-contact-name");
var accessibilityControls = getDomElement("accessibility-controls");
var accessibilityChoiceUp = getDomElement("accessibility-choice-up");
var accessibilityChoiceDown = getDomElement("accessibility-choice-down");
var accessibilitySkip = getDomElement("accessibility-skip-button");
var messageLists = getDomElement("message-lists");
var messageForms = getDomElement("message-forms");
var imageOverlayContainer = getDomElement("image-overlay-container");
var imageOverlayImage = getDomElement("image-overlay-image");
var videoOverlayContainer = getDomElement("video-overlay-container");
var videoOverlayVideo = getDomElement("video-overlay-video");
var notificationContainer = getDomElement("notification-container");
function updateTimestamps() {
  const contactTimeElements = document.querySelectorAll("time.timestamp");
  contactTimeElements.forEach((element) => {
    const datetime = element.getAttribute("datetime");
    if (datetime) {
      element.textContent = formatRelativeTime(state.gameState.date, datetime);
    }
  });
  const chatTimeElements = document.querySelectorAll("time.chat-timestamp");
  chatTimeElements.forEach((element) => {
    const datetime = element.getAttribute("datetime");
    if (datetime) {
      if (state.settingsState.relativeTimestamp) {
        element.textContent = formatSpecificRelativeDate(state.gameState.date, datetime);
      } else {
        element.textContent = element.title;
      }
    }
  });
}
function updateClock() {
  clock.textContent = clockFormatter.format(state.gameState.date);
  updateTimestamps();
}
function updateBatteryLevel(percent) {
  state.gameState.batteryPercent = percent;
  if (percent >= BATTERY_PERCENT_PER_STAGE * 7) {
    batteryIcon.textContent = "battery_android_full";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 6)) {
    batteryIcon.textContent = "battery_android_6";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 5)) {
    batteryIcon.textContent = "battery_android_5";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 4)) {
    batteryIcon.textContent = "battery_android_4";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 3)) {
    batteryIcon.textContent = "battery_android_3";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE * 2)) {
    batteryIcon.textContent = "battery_android_2";
  } else if (percent >= Math.floor(BATTERY_PERCENT_PER_STAGE)) {
    batteryIcon.textContent = "battery_android_1";
  } else {
    batteryIcon.textContent = "battery_android_0";
  }
  if (batteryIcon.classList.contains("low")) {
    if (percent >= Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
      batteryIcon.classList.remove("low");
    }
  } else {
    if (percent < Math.ceil(BATTERY_PERCENT_PER_STAGE * 2)) {
      batteryIcon.classList.add("low");
    }
  }
}
function navigateSettingsBack() {
  mainScreen.classList.add("active");
  settingsScreen.classList.remove("active");
  mainScreen.classList.add("visible");
  settingsScreen.classList.remove("visible");
}
function updateUnreadBadge() {
  let unreadCount = 0;
  for (const contactItem of contactList.children) {
    if (contactItem.classList.contains("unread")) {
      ++unreadCount;
    }
  }
  unreadBadge.textContent = unreadCount.toString();
  if (unreadCount > 0) {
    unreadBadge.classList.remove("hidden");
    if (unreadCount >= 10) {
      unreadBadge.classList.add("wide");
    } else {
      unreadBadge.classList.remove("wide");
    }
  } else {
    unreadBadge.classList.add("hidden");
  }
}
function refreshChatContact(contactItem) {
  const avatar = queryDom(contactItem, ".avatar");
  const name = queryDom(contactItem, ".contact-name").textContent;
  chatContactAvatar.src = avatar.src;
  chatContactAvatar.alt = avatar.alt;
  chatContactName.textContent = name;
}
function getMessageBubble(name, lastMessageAgo) {
  const messageList = getDomElement(`${name}-message-list`);
  const messageBubbles = Array.from(messageList.children).filter((element) => {
    return element.classList.contains("message-bubble") && !element.classList.contains("typing-indicator");
  });
  return messageBubbles[messageBubbles.length - 1 - lastMessageAgo];
}
function showImageOverlay(image) {
  imageOverlayContainer.classList.add("active");
  imageOverlayImage.src = image;
}
function hideImageOverlay() {
  imageOverlayContainer.classList.remove("active");
  imageOverlayImage.removeAttribute("src");
}
function showVideoOverlay(video) {
  videoOverlayContainer.classList.add("active");
  const sources = videoOverlayVideo.getElementsByTagName("source");
  for (const source of sources) {
    source.src = video;
  }
  videoOverlayVideo.load();
}
function hideVideoOverlay() {
  videoOverlayContainer.classList.remove("active");
  const sources = videoOverlayVideo.getElementsByTagName("source");
  for (const source of sources) {
    source.removeAttribute("src");
  }
}
function isMessageListActive(name) {
  const messageList = getDomElement(`${name}-message-list`);
  return messageList.classList.contains("active");
}
function atBottom() {
  return Math.ceil(messageLists.scrollTop) >= messageLists.scrollHeight - messageLists.offsetHeight;
}
function messageListScrollToBottom(name, previouslyAtBottom) {
  const nameCondition = !name || isMessageListActive(name);
  const atBottomCondition = previouslyAtBottom === void 0 || previouslyAtBottom;
  if (nameCondition && atBottomCondition) {
    messageLists.scrollTop = messageLists.scrollHeight;
  }
}
function createNotification(app, name, body, datetime) {
  const notification2 = document.createElement("div");
  notification2.classList.add("notification");
  const avatarImage = getDomElement(`${name}-contact-avatar`, false);
  notification2.innerHTML = `
    <img class="avatar" alt="${avatarImage?.alt ?? "?"}" src="${avatarImage?.src ?? ""}">
    <div class="notification-content">
      <div class="notification-header">
        <span>${app}</span>
        <span>${formatRelativeTime(state.gameState.date, datetime)}</span>
      </div>
      <div class="notification-name">${name}</div>
      <div class="notification-message">${body}</div>
    </div>
  `;
  notificationContainer.prepend(notification2);
  setTimeout(() => {
    notification2.classList.add("show");
  }, 10);
  setTimeout(() => {
    notification2.classList.remove("show");
    notification2.classList.add("hide");
    notification2.addEventListener(
      "transitionend",
      () => {
        notificationContainer.removeChild(notification2);
      },
      { once: true }
    );
  }, 3e3);
}
function addMessage(name, side, date, text, media) {
  if (!text && !media) {
    return;
  }
  if (text && media) {
    addMessage(name, side, date, void 0, media);
  }
  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", side);
  if (text) {
    messageBubble.innerHTML = text.replace(/\p{Extended_Pictographic}/gu, (match) => {
      return `<span class='emoji-text'>${match}</span>`;
    });
  } else if (media) {
    if (isImageMedia(media)) {
      const imageElement = document.createElement("img");
      imageElement.classList.add("message-media");
      imageElement.alt = `${media}`;
      imageElement.addEventListener("click", () => {
        showImageOverlay(imageElement.src);
      });
      imageElement.onload = () => {
        messageListScrollToBottom(name);
      };
      imageElement.onerror = () => {
        imageElement.onerror = null;
        imageElement.classList.add("invalid-media");
        imageElement.src = "resources/missing-preview.png";
      };
      imageElement.src = media;
      messageBubble.appendChild(imageElement);
    } else if (media.toLowerCase().endsWith(".mp4") || media.toLowerCase().endsWith(".webm")) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("message-media");
      videoElement.classList.add("message-video");
      videoElement.controls = true;
      videoElement.preload = "metadata";
      videoElement.muted = true;
      const videoType = media.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
      videoElement.innerHTML = `
        <source src="${media}" type="${videoType}">
        Your browser does not support HTML video.
      `;
      videoElement.addEventListener("loadedmetadata", () => {
        messageListScrollToBottom(name);
      });
      videoElement.addEventListener(
        "error",
        () => {
          messageBubble.classList.add("invalid-media");
          videoElement.poster = "resources/missing-preview.png";
          messageListScrollToBottom(name);
        },
        true
      );
      messageBubble.addEventListener("click", () => {
        showVideoOverlay(media);
      });
      messageBubble.appendChild(videoElement);
    } else {
      console.error(`Error: Unsupported file type for file: ${media}`);
      return;
    }
  }
  const messageList = getDomElement(`${name}-message-list`);
  messageList.appendChild(messageBubble);
  const lastMessage = getMessageBubble(name, 0);
  const secondLastMessage = getMessageBubble(name, 1);
  if (secondLastMessage && secondLastMessage.classList.contains(side)) {
    secondLastMessage.classList.remove("last-message");
  }
  lastMessage?.classList.add("last-message");
  messageListScrollToBottom(name);
  const unread = side === "received" && (!chatScreen.classList.contains("active") || !messageList.classList.contains("active"));
  for (const contactItem of contactList.children) {
    const contactName = queryDom(contactItem, ".contact-name").textContent;
    if (contactName === name) {
      if (unread && !contactItem.classList.contains("unread")) {
        contactItem.classList.add("unread");
      }
      const preview = queryDom(contactItem, ".preview");
      if (unread) {
        preview.innerHTML = '<span class="unread-indicator"></span>';
      } else {
        preview.innerHTML = "";
      }
      if (text) {
        preview.innerHTML += ` <div class="preview-text">${text}</div>`;
      } else if (media) {
        preview.innerHTML += " (Media sent)";
      }
      const timestamp2 = queryDom(contactItem, ".timestamp");
      timestamp2.textContent = "now";
      timestamp2.title = timeTooltipFormatter.format(date);
      timestamp2.setAttribute("datetime", date.toISOString());
      updateTimestamps();
      contactList.prepend(contactItem);
    }
  }
  updateUnreadBadge();
  if (unread) {
    createNotification("Messages", name, text ?? (media ? "(Media sent)" : "-"), date.toISOString());
  }
}
function showTypingIndicator(name) {
  const currentAtBottom = atBottom();
  const messageList = getDomElement(`${name}-message-list`);
  const typingIndicator = queryDom(messageList, ".typing-indicator.received");
  messageList.appendChild(typingIndicator);
  typingIndicator.classList.add("visible");
  messageListScrollToBottom(name, currentAtBottom);
}
function hideTypingIndicator(name) {
  const messageList = getDomElement(`${name}-message-list`);
  const typingIndicator = queryDom(messageList, ".typing-indicator.received");
  typingIndicator.classList.remove("visible");
}
function addChatTimestamp(name, date, fixedText) {
  const currentAtBottom = atBottom();
  const timestamp2 = document.createElement("time");
  timestamp2.classList.add("chat-timestamp");
  timestamp2.title = timeTooltipFormatter.format(date);
  timestamp2.textContent = fixedText ?? "now";
  if (!fixedText) {
    timestamp2.setAttribute("datetime", date.toISOString());
  }
  const messageList = getDomElement(`${name}-message-list`);
  messageList.appendChild(timestamp2);
  updateTimestamps();
  messageListScrollToBottom(name, currentAtBottom);
}
function addReaction(name, emoji, lastMessageAgo = 0) {
  const messageBubble = getMessageBubble(name, lastMessageAgo);
  if (messageBubble) {
    const currentAtBottom = atBottom();
    const existingReaction = queryDom(messageBubble, ".emoji-reaction", false);
    if (existingReaction) {
      if (existingReaction.textContent === emoji) {
        existingReaction.remove();
      } else {
        existingReaction.textContent = emoji;
      }
    } else {
      const newReaction = document.createElement("div");
      newReaction.classList.add("emoji-reaction");
      newReaction.textContent = emoji;
      messageBubble.appendChild(newReaction);
    }
    messageListScrollToBottom(name, currentAtBottom);
  }
}
function refreshChoices(name) {
  const currentChoiceData = state.gameState.currentChoiceMap.get(name);
  if (currentChoiceData && currentChoiceData.choices.length > 0) {
    const currentChoice = currentChoiceData.choices[currentChoiceData.index];
    const messageInput = getDomElement(`${name}-message-input`);
    messageInput.value = currentChoice?.displayText ?? currentChoice?.fullText ?? "";
  }
}
function enableChoices(name, choices2) {
  if (choices2.length > 0) {
    state.gameState.currentChoiceMap.set(name, {
      choices: choices2,
      index: 0
    });
    refreshChoices(name);
    const messageInput = getDomElement(`${name}-message-input`);
    messageInput.focus();
    messageInput.classList.add("choice");
  }
}
function disableChoices(name) {
  state.gameState.currentChoiceMap.delete(name);
  const messageInput = getDomElement(`${name}-message-input`);
  messageInput.classList.remove("choice");
}
function updateChoiceInput(name, down) {
  const currentChoiceData = state.gameState.currentChoiceMap.get(name);
  if (currentChoiceData && currentChoiceData.choices.length > 0) {
    if (down) {
      state.gameState.currentChoiceMap.set(name, {
        ...currentChoiceData,
        index: Math.min(currentChoiceData.index + 1, currentChoiceData.choices.length - 1)
      });
    } else {
      state.gameState.currentChoiceMap.set(name, {
        ...currentChoiceData,
        index: Math.max(0, currentChoiceData.index - 1)
      });
    }
    refreshChoices(name);
    const messageInput = getDomElement(`${name}-message-input`);
    messageInput.focus();
  }
}
function choiceChange(down) {
  const activeContactName2 = chatContactName.textContent;
  if (activeContactName2) {
    updateChoiceInput(activeContactName2, down);
  }
}
function startTypeWriter(name, text, typingSpeedDelay = DEFAULT_TYPING_SPEED_DELAY) {
  return new Promise((resolve) => {
    const messageInput = getDomElement(`${name}-message-input`);
    const messageSend = getDomElement(`${name}-message-send`);
    messageInput.value = "";
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
async function startTypeWriterWithSubmit(name, text, typingSpeedDelay = DEFAULT_TYPING_SPEED_DELAY) {
  await startTypeWriter(name, text, typingSpeedDelay);
  const messageSend = getDomElement(`${name}-message-send`);
  messageSend.click();
}
function addMessageForm(name) {
  const messageInput = document.createElement("input");
  messageInput.classList.add("message-input");
  messageInput.id = `${name}-message-input`;
  messageInput.type = "text";
  messageInput.placeholder = "Message";
  messageInput.readOnly = true;
  const messageSend = document.createElement("button");
  messageSend.classList.add("message-send");
  messageSend.id = `${name}-message-send`;
  messageSend.type = "submit";
  messageSend.innerHTML = `<span class="material-symbols-outlined">arrow_upward</span>`;
  const messageForm = document.createElement("form");
  messageForm.classList.add("message-form");
  messageForm.id = `${name}-message-form`;
  messageForm.appendChild(messageInput);
  messageForm.appendChild(messageSend);
  messageForm.addEventListener("wheel", (event) => {
    updateChoiceInput(name, event.deltaY > 0);
  });
  messageForm.addEventListener("submit", async (event) => {
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
        addMessage(chatContactName.textContent, "sent", state.gameState.date, messageText, void 0);
        if (choiceCallback) {
          choiceCallback();
        }
      }
      messageInput.value = "";
      messageInput.focus();
      state.gameState.pause = state.gameState.pause.filter((n) => n !== name);
    }
  });
  messageForms.appendChild(messageForm);
}
function getActiveMessageSend() {
  const activeMessageForm = queryDom(messageForms, ".message-form.active");
  const messageSend = queryDom(activeMessageForm, ".message-send");
  return messageSend;
}
function switchMessageList(name) {
  const messageListId = `${name}-message-list`;
  for (const messageList of messageLists.children) {
    if (messageList.id === messageListId) {
      messageList.classList.add("active");
    } else {
      messageList.classList.remove("active");
    }
  }
  const messageFormId = `${name}-message-form`;
  for (const messageForm of messageForms.children) {
    if (messageForm.id === messageFormId) {
      messageForm.classList.add("active");
    } else {
      messageForm.classList.remove("active");
    }
  }
}
function addMessageList(name) {
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.classList.add("message-bubble");
  typingIndicator.classList.add("received");
  typingIndicator.innerHTML = `<div class="typing-bubble">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>`;
  const messageList = document.createElement("div");
  messageList.classList.add("message-list");
  messageList.id = `${name}-message-list`;
  messageList.appendChild(typingIndicator);
  messageLists.appendChild(messageList);
  addMessageForm(name);
}
function getFullName(firstname, lastname) {
  if (firstname || lastname) {
    return `${firstname ?? ""} ${lastname ?? ""}`.trim();
  } else {
    return "Unknown Contact";
  }
}
function getNameInitials(firstname, lastname) {
  if (firstname && lastname) {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`;
  } else if (firstname && !lastname) {
    return firstname.substring(0, 2);
  } else if (!firstname && lastname) {
    return lastname.substring(0, 2);
  } else {
    return "?";
  }
}
function addContact(firstname, lastname, avatar) {
  const name = getFullName(firstname, lastname);
  const avatarImage = getDomElement(`${name}-contact-avatar`, false);
  if (avatarImage) {
    avatarImage.src = avatar;
    return name;
  }
  const item = document.createElement("div");
  item.classList.add("contact-item");
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
  item.addEventListener("click", () => {
    if (item.classList.contains("unread")) {
      item.classList.remove("unread");
      const unreadIndicator = queryDom(item, ".unread-indicator");
      if (unreadIndicator) {
        unreadIndicator.remove();
      }
    }
    updateUnreadBadge();
    mainScreen.classList.remove("active");
    chatScreen.classList.add("active");
    chatScreen.classList.add("visible");
    refreshChatContact(item);
    const contactName = queryDom(item, ".contact-name").textContent;
    switchMessageList(contactName);
    setTimeout(() => {
      mainScreen.classList.remove("visible");
      messageListScrollToBottom();
    }, 100);
  });
  contactList.prepend(item);
  addMessageList(name);
  return name;
}
function renameContact(oldName, firstname, lastname, avatar) {
  const newName = getFullName(firstname, lastname);
  const avatarImage = getDomElement(`${oldName}-contact-avatar`);
  avatarImage.id = `${newName}-contact-avatar`;
  avatarImage.alt = `${getNameInitials(firstname, lastname)}`;
  avatarImage.src = avatar ?? "";
  const oldMessageForm = getDomElement(`${oldName}-message-form`);
  oldMessageForm.remove();
  addMessageForm(newName);
  for (const contactItem of contactList.children) {
    const contactName = queryDom(contactItem, ".contact-name");
    if (contactName.textContent === oldName) {
      contactName.textContent = newName;
      contactList.prepend(contactItem);
      if (chatContactName.textContent === oldName) {
        refreshChatContact(contactItem);
        const messageForm = getDomElement(`${newName}-message-form`);
        messageForm.classList.add("active");
      }
    }
  }
  const messageList = getDomElement(`${oldName}-message-list`);
  messageList.id = `${newName}-message-list`;
  return newName;
}
function navigateChatBack() {
  mainScreen.classList.add("active");
  chatScreen.classList.remove("active");
  mainScreen.classList.add("visible");
  setTimeout(() => {
    chatScreen.classList.remove("visible");
    chatContactName.textContent = null;
  }, 100);
}
function setSkipMode(skip) {
  state.gameState.skipMode = skip;
  if (skip) {
    accessibilitySkip.classList.add("on");
  } else {
    accessibilitySkip.classList.remove("on");
  }
}
function toggleSkipMode() {
  setSkipMode(!state.gameState.skipMode);
}
function toggleContactVisibility(name, show) {
  for (const contactItem of contactList.children) {
    const contactName = queryDom(contactItem, ".contact-name").textContent;
    if (contactName === name) {
      if (show) {
        contactItem.classList.remove("hidden");
      } else {
        contactItem.classList.add("hidden");
      }
    }
  }
}
function refreshMessageSpeedSettingText() {
  const option = MESSAGE_SPEED_OPTIONS.find((option2) => option2.value === state.settingsState.messageSpeed);
  messageSpeedSetting.textContent = option?.label ?? "Unknown";
}
function setupListeners() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideImageOverlay();
      hideVideoOverlay();
    }
    if (event.code === "Enter" || event.code === "NumpadEnter" || event.code === "Space") {
      event.preventDefault();
      getActiveMessageSend()?.click();
    }
    if (event.key === "Control") {
      setSkipMode(true);
      const activeContactName2 = chatContactName.textContent;
      if (activeContactName2) {
        const currentChoiceData = state.gameState.currentChoiceMap.get(activeContactName2);
        if (!currentChoiceData) {
          getActiveMessageSend()?.click();
        }
      }
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      choiceChange(false);
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      choiceChange(true);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "Control") {
      setSkipMode(false);
    }
  });
  messageSpeedSetting.addEventListener("click", () => {
    const currentIndex = MESSAGE_SPEED_OPTIONS.findIndex((option) => option.value === state.settingsState.messageSpeed);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % MESSAGE_SPEED_OPTIONS.length;
    const nextOption = MESSAGE_SPEED_OPTIONS[nextIndex];
    if (!nextOption) {
      throw new Error(`Invalid message speed index: ${nextIndex}`);
    }
    state.settingsState.messageSpeed = nextOption.value;
    refreshMessageSpeedSettingText();
  });
  darkModeCheckbox.addEventListener("change", () => {
    state.settingsState.darkMode = darkModeCheckbox.checked;
    document.documentElement.dataset.theme = state.settingsState.darkMode ? "dark" : "light";
  });
  accessibilityCheckbox.addEventListener("change", () => {
    state.settingsState.accessibility = accessibilityCheckbox.checked;
    if (state.settingsState.accessibility) {
      accessibilityControls.classList.add("visible");
    } else {
      accessibilityControls.classList.remove("visible");
    }
  });
  relativeTimestampCheckbox.addEventListener("change", () => {
    state.settingsState.relativeTimestamp = relativeTimestampCheckbox.checked;
    updateTimestamps();
  });
  tutorialCheckbox.addEventListener("change", () => {
    state.settingsState.showTutorial = tutorialCheckbox.checked;
    toggleContactVisibility("Tutorial Guide", state.settingsState.showTutorial);
  });
  unitTestsCheckbox.addEventListener("change", () => {
    state.settingsState.showUnitTests = unitTestsCheckbox.checked;
    toggleContactVisibility("Jane Doe", state.settingsState.showUnitTests);
    toggleContactVisibility("Sarah Smith", state.settingsState.showUnitTests);
  });
  settingsBackButton.addEventListener("click", navigateSettingsBack);
  chatBackButton.addEventListener("click", navigateChatBack);
  accessibilityChoiceUp.addEventListener("click", () => {
    choiceChange(false);
  });
  accessibilityChoiceDown.addEventListener("click", () => {
    choiceChange(true);
  });
  accessibilitySkip.addEventListener("click", () => {
    toggleSkipMode();
  });
  imageOverlayContainer.addEventListener("click", hideImageOverlay);
  const videoCloseButton = queryDom(document, "#video-overlay-container .close-button");
  videoCloseButton.addEventListener("click", hideVideoOverlay);
  darkModeCheckbox.checked = state.settingsState.darkMode;
  darkModeCheckbox.dispatchEvent(new Event("change"));
  accessibilityCheckbox.checked = isMobile();
  relativeTimestampCheckbox.checked = state.settingsState.relativeTimestamp;
  tutorialCheckbox.checked = state.settingsState.showTutorial;
  unitTestsCheckbox.checked = state.settingsState.showUnitTests;
  accessibilityCheckbox.dispatchEvent(new Event("change"));
  relativeTimestampCheckbox.dispatchEvent(new Event("change"));
  tutorialCheckbox.dispatchEvent(new Event("change"));
  unitTestsCheckbox.dispatchEvent(new Event("change"));
  editLabel.addEventListener("click", () => {
    mainScreen.classList.remove("active");
    settingsScreen.classList.add("active");
    settingsScreen.classList.add("visible");
    setTimeout(() => {
      mainScreen.classList.remove("visible");
    }, 100);
  });
  const statusBar = queryDom(document, ".status-bar");
  statusBar.addEventListener("click", () => {
    consoleLogColor(state);
  });
}
function initialize() {
  addContact("System", "Messages", "resources/system-messages.png");
  addMessage("System Messages", "received", state.gameState.date, `Hello!`);
  addMessage(
    "System Messages",
    "received",
    state.gameState.date,
    `Don't forget to check out the tutorial if you're new!`
  );
  document.addEventListener("DOMContentLoaded", setupListeners);
  refreshMessageSpeedSettingText();
}

// src/api/constants.ts
var MILLISECONDS_PER_CHAR = 25;
var DURATION_TO_MINUTE_MULTIPLIER = 1e-3;

// src/api/api.ts
function waitFor(predicate, timeout, interval = 500) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = async () => {
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
function setGlobalMessageSpeed(messageSpeed = NORMAL) {
  state.settingsState.messageSpeed = messageSpeed;
  refreshMessageSpeedSettingText();
}
function getGlobalMessageSpeedMultiplier() {
  if (state.gameState.skipMode) {
    return 0;
  }
  return MESSAGE_SPEED_OPTIONS.find((option) => option.value === state.settingsState.messageSpeed)?.multiplier ?? 1;
}
function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration * getGlobalMessageSpeedMultiplier()));
}
function setClock(year, month, day, hours, minutes = 0) {
  state.gameState.date = new Date(Date.UTC(year, month, day, hours, minutes));
  updateClock();
}
function addMinutes(minutes) {
  state.gameState.date.setTime(state.gameState.date.getTime() + minutes * 60 * 1e3);
  updateClock();
}
function battery(stages) {
  const modifyPercent = stages * BATTERY_PERCENT_PER_STAGE;
  updateBatteryLevel(Math.max(0, Math.min(state.gameState.batteryPercent + modifyPercent, 100)));
}
function contact(firstname, lastname, avatar) {
  return addContact(firstname, lastname, avatar ?? "");
}
function rename(oldName, firstname, lastname, avatar) {
  return renameContact(oldName, firstname, lastname, avatar);
}
function activeContactName() {
  return chatContactName.textContent;
}
async function textLeft(text, name, duration) {
  if (text) {
    showTypingIndicator(name);
    const computedDuration = duration ?? text.length * MILLISECONDS_PER_CHAR;
    await sleep(computedDuration);
    addMinutes(computedDuration * DURATION_TO_MINUTE_MULTIPLIER);
    hideTypingIndicator(name);
    addMessage(name, "received", state.gameState.date, text, void 0);
  }
}
async function mediaLeft(media, name, duration = SLOWEST) {
  if (media) {
    await sleep(duration);
    addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
    addMessage(name, "received", state.gameState.date, void 0, media);
  }
}
function pause(name) {
  state.gameState.pause.push(name);
}
function unpaused(name) {
  return !state.gameState.pause.includes(name);
}
async function textRight(text, name, duration, delay) {
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
async function mediaRight(media, name, duration = SLOW, delay = SLOW) {
  if (media) {
    await waitFor(() => activeContactName() === name);
    await sleep(duration);
    addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
    addMessage(name, "sent", state.gameState.date, void 0, media);
    await sleep(delay);
    addMinutes(delay * DURATION_TO_MINUTE_MULTIPLIER);
  }
}
async function reaction(emoji, name, lastMessageAgo = 0, duration = NORMAL) {
  await sleep(duration);
  addMinutes(duration * DURATION_TO_MINUTE_MULTIPLIER);
  addReaction(name, emoji, lastMessageAgo);
}
function timestamp(name, fixedText) {
  addChatTimestamp(name, state.gameState.date, fixedText);
}
async function choices(options, name) {
  if (options.length > 0) {
    await waitFor(() => activeContactName() === name);
    enableChoices(name, options);
    pause(name);
    await waitFor(() => unpaused(name));
  }
}
function hasFlag(flag) {
  return state.gameState.flags.has(flag);
}
function hasFlags(flags) {
  return flags.every((f) => state.gameState.flags.has(f));
}
function addFlag(flag) {
  state.gameState.flags.add(flag);
}
function removeFlag(flag) {
  state.gameState.flags.delete(flag);
}
function notification(message, name, app = "Messages", datetime = state.gameState.date) {
  createNotification(app, name, message, datetime);
}

// src/story/debug/unit-tests.ts
var unitTest = async () => {
  const JaneDoe = contact("Jane", "Doe", "src/story/debug/images/sample-contact-01.png");
  const SarahSmith = contact("Sarah", "Smith", "src/story/debug/images/sample-contact-02.png");
  await waitFor(() => activeContactName() === JaneDoe);
  timestamp(JaneDoe);
  const enableWaitForTest = true;
  const enableMessageSpeedTest = true;
  const enableSleepTest = true;
  const enableClockTest = true;
  const enableBatteryTest = true;
  const enableContactTest = true;
  const enableRenameTest = true;
  const enableActiveContactNameTest = true;
  const enableReceivedTextTest = true;
  const enableReceivedMediaTest = true;
  const enableSentTextTest = true;
  const enableSentMediaTest = true;
  const enableReactionTest = true;
  const enableChoiceTest = true;
  const enableFlagTest = true;
  const enableNotificationTest = true;
  if (enableWaitForTest) {
    await textLeft(`=====[START] Wait For=====`, JaneDoe, INSTANT);
    await textLeft(`Adding 'Debug_Test_A' flag after 5 second delay...`, JaneDoe, INSTANT);
    setTimeout(() => {
      addFlag("Debug_Test_A");
    }, 5e3);
    await textLeft(`TEST: Wait for 'Debug_Test_A' flag...`, JaneDoe, INSTANT);
    await waitFor(() => hasFlag("Debug_Test_A"));
    await textLeft(`OK: 'Debug_Test_A' flag checked.`, JaneDoe, INSTANT);
    removeFlag("Debug_Test_A");
    await textLeft(`TEST: Wait for a never true condition with a 5 second timeout...`, JaneDoe, INSTANT);
    try {
      await waitFor(() => hasFlag("Debug_Test_Never_True"), 5e3);
    } catch (e) {
      await textLeft(`OK: Wait for never true condition timed out. ${e}`, JaneDoe, INSTANT);
    }
    await textRight(`=====[END] Wait For=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Wait For=====`, JaneDoe, INSTANT);
  }
  if (enableMessageSpeedTest) {
    await textLeft(`=====[START] Message Speed=====`, JaneDoe, INSTANT);
    await textLeft(`Message Speed set to SLOWEST...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(SLOWEST);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Slowest'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Slowest") {
      await textLeft(`OK: Message Speed text is 'Slowest'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message Speed set to SLOW...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(SLOW);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Slow'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Slow") {
      await textLeft(`OK: Message Speed text is 'Slow'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message Speed set to NORMAL...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(NORMAL);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Normal'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Normal") {
      await textLeft(`OK: Message Speed text is 'Normal'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message Speed set to FAST...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(FAST);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Fast'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Fast") {
      await textLeft(`OK: Message Speed text is 'Fast'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message Speed set to INSTANT...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(INSTANT);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Instant'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Instant") {
      await textLeft(`OK: Message Speed text is 'Instant'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message Speed set to default...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed();
    await textLeft(`TEST: The Message Speed text in the settings should be 'Normal'...`, JaneDoe);
    if (messageSpeedSetting.textContent === "Normal") {
      await textLeft(`OK: Message Speed text is 'Normal'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textRight(`=====[END] Message Speed=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Message Speed=====`, JaneDoe, INSTANT);
  }
  if (enableSleepTest) {
    await textLeft(`=====[START] Sleep=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Sleep for 5 seconds...`, JaneDoe, INSTANT);
    await sleep(5e3);
    await textLeft(`TEST: Sleep for 2 seconds...`, JaneDoe, INSTANT);
    await sleep(2e3);
    await textLeft(`TEST: Sleep for 0 seconds...`, JaneDoe, INSTANT);
    await sleep(0);
    await textLeft(`TEST: Sleep for negative seconds...`, JaneDoe, INSTANT);
    await sleep(-1e3);
    await textRight(`=====[END] Sleep=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sleep=====`, JaneDoe, INSTANT);
  }
  if (enableClockTest) {
    await textLeft(`=====[START] Clock=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Clock set to: Wednesday, October 1 at 12:00 AM`, JaneDoe, INSTANT);
    setClock(2025, OCTOBER, 1, 0);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 60 minutes...`, JaneDoe, SLOWEST);
    addMinutes(60);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 330 minutes...`, JaneDoe, SLOWEST);
    addMinutes(330);
    timestamp(JaneDoe);
    await textLeft(`TEST: Subtracting 30 minutes...`, JaneDoe, SLOWEST);
    addMinutes(-30);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 0 minutes...`, JaneDoe, SLOWEST);
    addMinutes(0);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Thursday, October 2 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, OCTOBER, 2, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Friday, October 3 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, OCTOBER, 3, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Saturday, October 4 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, OCTOBER, 4, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Sunday, October 5 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, OCTOBER, 5, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Wednesday, October 8 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, OCTOBER, 8, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Multiple timestamps`, JaneDoe, SLOWEST);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Saturday, November 1 at 1:30 PM`, JaneDoe, SLOWEST);
    setClock(2025, NOVEMBER, 1, 13, 30);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Saturday, November 1 at 6:00 PM`, JaneDoe, SLOWEST);
    setClock(2025, NOVEMBER, 1, 18, 0);
    timestamp(JaneDoe, "A few hours later, at night...");
    timestamp(JaneDoe, "");
    await textLeft(`TEST: Adding timestamp for Sarah Smith`, JaneDoe, INSTANT);
    timestamp(SarahSmith);
    timestamp(SarahSmith, "Custom text timestamp...");
    await textRight(`=====[END] Clock=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Clock=====`, JaneDoe, INSTANT);
  }
  if (enableBatteryTest) {
    await textLeft(`=====[START] Battery=====`, JaneDoe, INSTANT);
    battery(99);
    await textLeft(`TEST: Battery at [7/7]`, JaneDoe);
    await textLeft(`TEST: Battery -1 at [6/7]`, JaneDoe, SLOW);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [5/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [4/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [3/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [2/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [1/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    await textLeft(`TEST: Battery +1 at [1/7]`, JaneDoe, SLOW);
    battery(1);
    await textLeft(`TEST: Battery +1 at [2/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [3/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [4/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [5/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [6/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [7/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [7/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery -5 at [2/7]`, JaneDoe, SLOW);
    battery(-5);
    await textRight(`=====[END] Battery=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Battery=====`, JaneDoe, INSTANT);
  }
  if (enableContactTest) {
    await textLeft(`=====[START] Contact=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Adding contacts...`, JaneDoe, INSTANT);
    contact("Repeatedly", "Added", "src/story/debug/images/sample-contact-01.png");
    contact("Repeatedly", "Added", "src/story/debug/images/sample-contact-02.png");
    contact("Repeatedly", "Added", "src/story/debug/images/sample-contact-03.png");
    const RepeatedlyAdded = contact("Repeatedly", "Added", "src/story/debug/images/sample-contact-04.png");
    if (RepeatedlyAdded === "Repeatedly Added") {
      await textLeft(`OK: 'Repeatedly Added' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: RepeatedlyAdded is '${RepeatedlyAdded}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    const DefaultContact = contact("Default", "Contact", "src/story/debug/images/default-contact.png");
    if (DefaultContact === "Default Contact") {
      await textLeft(`OK: 'Default Contact' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: DefaultContact is '${DefaultContact}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    const InvalidAvatar = contact("Invalid", "Avatar", "src/story/debug/images/invalid-avatar.png");
    if (InvalidAvatar === "Invalid Avatar") {
      await textLeft(`OK: 'Invalid Avatar' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: InvalidAvatar is '${InvalidAvatar}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    const NoAvatar = contact("No", "Avatar");
    if (NoAvatar === "No Avatar") {
      await textLeft(`OK: 'No Avatar' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: NoAvatar is '${NoAvatar}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    const Sample1 = contact("Sample", "1", "src/story/debug/images/sample-contact-01.png");
    if (Sample1 === "Sample 1") {
      await textLeft(`OK: 'Sample 1' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: Sample1 is '${Sample1}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    contact("Sample", "2", "src/story/debug/images/sample-contact-02.png");
    contact("Sample", "3", "src/story/debug/images/sample-contact-03.png");
    contact("Sample", "4", "src/story/debug/images/sample-contact-04.png");
    contact("Valid Avatar", "To Invalid Avatar", "src/story/debug/images/sample-contact-01.png");
    contact("Valid Avatar", "To Invalid Avatar", "src/story/debug/images/invalid-avatar.png");
    contact("Valid Avatar", "To No Avatar", "src/story/debug/images/sample-contact-01.png");
    contact("Valid Avatar", "To No Avatar");
    contact("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    contact("Test", "1", "src/story/debug/images/sample-contact-01.png");
    contact("Test", "2", "src/story/debug/images/sample-contact-02.png");
    contact("Test", "3", "src/story/debug/images/sample-contact-03.png");
    contact("Test", "4", "src/story/debug/images/sample-contact-04.png");
    contact("Test", "5", "src/story/debug/images/sample-contact-01.png");
    contact("Test", "6", "src/story/debug/images/sample-contact-02.png");
    contact("Test", "7", "src/story/debug/images/sample-contact-03.png");
    contact("Test", "8", "src/story/debug/images/sample-contact-04.png");
    contact("Test", "9", "src/story/debug/images/sample-contact-01.png");
    contact("Test", "10", "src/story/debug/images/sample-contact-02.png");
    contact("Test", "11", "src/story/debug/images/sample-contact-03.png");
    contact("Test", "12", "src/story/debug/images/sample-contact-04.png");
    contact("123", "456");
    contact("", "");
    await textRight(`=====[END] Contact=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Contact=====`, JaneDoe, INSTANT);
  }
  if (enableRenameTest) {
    await textLeft(`=====[START] Rename=====`, JaneDoe, INSTANT);
    await textLeft(`Adding 'Before Name'...`, JaneDoe, INSTANT);
    const BeforeName = contact("Before", "Name");
    await textLeft(`Message from 'Before Name'`, BeforeName, INSTANT);
    await textRight(`Message to 'Before Name'`, BeforeName, INSTANT, INSTANT);
    await textLeft(`Renaming 'Before Name' to 'After Rename'...`, BeforeName, INSTANT);
    await reaction("\u{1F44D}", BeforeName, 0, SLOWEST);
    const AfterRename = rename(BeforeName, "After", "Rename");
    if (AfterRename === "After Rename") {
      await textLeft(`OK: 'After Rename' name is correct.`, AfterRename, INSTANT);
    } else {
      await textLeft(`ERROR: AfterRename name is '${AfterRename}'.`, AfterRename, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Message from 'After Rename'`, AfterRename, INSTANT);
    await textRight(`Message to 'After Rename'`, AfterRename, INSTANT, INSTANT);
    await textLeft(`Renaming 'After Rename' to 'After Rename' (same name)...`, AfterRename, INSTANT);
    await reaction("\u{1F44D}", AfterRename, 0, SLOWEST);
    rename(AfterRename, "After", "Rename");
    await textLeft(`Message from 'After Rename'`, AfterRename, INSTANT);
    await textRight(`Message to 'After Rename'`, AfterRename, INSTANT, INSTANT);
    await textLeft(`Renaming 'After Rename' to 'After Rename With Avatar'...`, AfterRename, INSTANT);
    await reaction("\u{1F44D}", AfterRename, 0, SLOWEST);
    const AfterRenameWithAvatar = rename(
      AfterRename,
      "After",
      "Rename With Avatar",
      "src/story/debug/images/sample-contact-01.png"
    );
    await textLeft(`Message from 'After Rename With Avatar'`, AfterRenameWithAvatar, INSTANT);
    await textRight(`Message to 'After Rename With Avatar'`, AfterRenameWithAvatar, INSTANT, INSTANT);
    await textLeft(
      `Renaming 'After Rename With Avatar' to 'After Rename With Invalid Avatar'...`,
      AfterRenameWithAvatar,
      INSTANT
    );
    await reaction("\u{1F44D}", AfterRenameWithAvatar, 0, SLOWEST);
    const AfterRenameWithInvalidAvatar = rename(
      AfterRenameWithAvatar,
      "After",
      "Rename With Invalid Avatar",
      "src/story/debug/images/invalid-avatar.png"
    );
    await textLeft(`Message from 'After Rename With Invalid Avatar'`, AfterRenameWithInvalidAvatar, INSTANT);
    await textRight(`Message to 'After Rename With Invalid Avatar'`, AfterRenameWithInvalidAvatar, INSTANT, INSTANT);
    await textRight(`=====[END] Rename=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Rename=====`, JaneDoe, INSTANT);
  }
  if (enableActiveContactNameTest) {
    await textLeft(`=====[START] Active Contact Name=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: The active contact name should be 'Jane Doe'...`, JaneDoe, INSTANT);
    if (activeContactName() === "Jane Doe") {
      await textLeft(`OK: Active contact name is 'Jane Doe'.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: Active contact name is '${activeContactName()}'.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textRight(`=====[END] Active Contact Name=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Active Contact Name=====`, JaneDoe, INSTANT);
  }
  if (enableReceivedTextTest) {
    await textLeft(`=====[START] Received Text=====`, JaneDoe, INSTANT);
    await textLeft(`Received message.`, JaneDoe);
    await textLeft("Short", JaneDoe);
    await textLeft("Sh", JaneDoe);
    await textLeft("S", JaneDoe);
    await textLeft("", JaneDoe);
    await textLeft(
      `Received message.
With new line.`,
      JaneDoe
    );
    await textLeft(
      `Received message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe
    );
    await textLeft("\u{1F603}", JaneDoe);
    await textLeft(`Received message with SLOWEST duration.`, JaneDoe, SLOWEST);
    await textLeft(`Received message with SLOW duration.`, JaneDoe, SLOW);
    await textLeft(`Received message with default duration.`, JaneDoe);
    await textLeft(`Received message with NORMAL duration.`, JaneDoe, NORMAL);
    await textLeft(`Received message with FAST duration.`, JaneDoe, FAST);
    await textLeft(`Received message with INSTANT duration.`, JaneDoe, INSTANT);
    await textLeft(`Received message from Sarah Smith.`, SarahSmith);
    await textRight(`=====[END] Received Text=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Received Text=====`, JaneDoe, INSTANT);
  }
  if (enableReceivedMediaTest) {
    await textLeft(`=====[START] Received Media=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Received images...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Dog.jpg", JaneDoe);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe);
    await mediaLeft("src/story/debug/images/Newtons_Cradle.gif", JaneDoe);
    await mediaLeft("src/story/debug/images/invalid-image.png", JaneDoe);
    await mediaLeft("src/story/debug/images/Dog.JPG", JaneDoe);
    await mediaLeft("src/story/debug/images/Cat.PNG", JaneDoe);
    await mediaLeft("src/story/debug/images/Newtons_Cradle.GIF", JaneDoe);
    await mediaLeft("src/story/debug/images/invalid-image.PNG", JaneDoe);
    await textLeft(`TEST: Received videos...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/videos/mov_bbb.mp4", JaneDoe);
    await mediaLeft("src/story/debug/videos/Schlossbergbahn.webm", JaneDoe);
    await mediaLeft("src/story/debug/videos/invalid-video.mp4", JaneDoe);
    await mediaLeft("src/story/debug/videos/mov_bbb.MP4", JaneDoe);
    await mediaLeft("src/story/debug/videos/Schlossbergbahn.WEBM", JaneDoe);
    await mediaLeft("src/story/debug/videos/invalid-video.MP4", JaneDoe);
    await textLeft(
      `TEST: Received invalid media: '.txt' file type.
Should print an error in console...`,
      JaneDoe,
      INSTANT
    );
    await mediaLeft("src/story/debug/images/invalid-file-type.txt", JaneDoe);
    await textLeft(`TEST: Received media with default duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe);
    await textLeft(`TEST: Received media with SLOWEST duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe, SLOWEST);
    await textLeft(`TEST: Received media with SLOW duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe, SLOW);
    await textLeft(`TEST: Received media with NORMAL duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe, NORMAL);
    await textLeft(`TEST: Received media with FAST duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe, FAST);
    await textLeft(`TEST: Received media with INSTANT duration...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", JaneDoe, INSTANT);
    await textLeft(`TEST: Received media from Sarah Smith...`, JaneDoe, INSTANT);
    await mediaLeft("src/story/debug/images/Cat.png", SarahSmith, INSTANT);
    await mediaLeft("src/story/debug/videos/mov_bbb.mp4", SarahSmith, INSTANT);
    await textRight(`=====[END] Received Media=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Received Media=====`, JaneDoe, INSTANT);
  }
  if (enableSentTextTest) {
    await textLeft(`=====[START] Sent Text=====`, JaneDoe, INSTANT);
    await textRight(`Sent message.`, JaneDoe);
    await textRight("Short", JaneDoe);
    await textRight("Sh", JaneDoe);
    await textRight("S", JaneDoe);
    await textRight("", JaneDoe);
    await textRight(
      `Sent message.
With new line.`,
      JaneDoe
    );
    await textRight(
      `Sent message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe
    );
    await textRight("\u{1F603}", JaneDoe);
    await textLeft(`Received message.`, JaneDoe, INSTANT);
    await textRight(`Sent message with SLOWEST duration.`, JaneDoe, SLOWEST);
    await textRight(`Sent message with SLOW duration.`, JaneDoe, SLOW);
    await textRight(`Sent message with default duration.`, JaneDoe);
    await textRight(`Sent message with NORMAL duration.`, JaneDoe, NORMAL);
    await textRight(`Sent message with FAST duration.`, JaneDoe, FAST);
    await textRight(`Sent message with INSTANT duration.`, JaneDoe, INSTANT);
    await textRight(`Sent message with SLOWEST delay.`, JaneDoe, void 0, SLOWEST);
    await textRight(`Sent message with SLOW delay.`, JaneDoe, void 0, SLOW);
    await textRight(`Sent message with default delay.`, JaneDoe);
    await textRight(`Sent message with NORMAL delay.`, JaneDoe, void 0, NORMAL);
    await textRight(`Sent message with FAST delay.`, JaneDoe, void 0, FAST);
    await textRight(`Sent message with INSTANT delay.`, JaneDoe, void 0, INSTANT);
    await textRight(`=====[END] Sent Text=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sent Text=====`, JaneDoe, INSTANT);
  }
  if (enableSentMediaTest) {
    await textLeft(`=====[START] Sent Media=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Sent images...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Dog.jpg", JaneDoe);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe);
    await mediaRight("src/story/debug/images/Newtons_Cradle.gif", JaneDoe);
    await mediaRight("src/story/debug/images/invalid-image.png", JaneDoe);
    await mediaRight("src/story/debug/images/Dog.JPG", JaneDoe);
    await mediaRight("src/story/debug/images/Cat.PNG", JaneDoe);
    await mediaRight("src/story/debug/images/Newtons_Cradle.GIF", JaneDoe);
    await mediaRight("src/story/debug/images/invalid-image.PNG", JaneDoe);
    await textLeft(`TEST: Sent videos...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/videos/mov_bbb.mp4", JaneDoe);
    await mediaRight("src/story/debug/videos/Schlossbergbahn.webm", JaneDoe);
    await mediaRight("src/story/debug/videos/invalid-video.mp4", JaneDoe);
    await mediaRight("src/story/debug/videos/mov_bbb.MP4", JaneDoe);
    await mediaRight("src/story/debug/videos/Schlossbergbahn.WEBM", JaneDoe);
    await mediaRight("src/story/debug/videos/invalid-video.MP4", JaneDoe);
    await textLeft(
      `TEST: Sent invalid media: '.txt' file type.
Should print an error in console...`,
      JaneDoe,
      INSTANT
    );
    await mediaRight("src/story/debug/images/invalid-file-type.txt", JaneDoe);
    await textLeft(`TEST: Sent media with SLOWEST duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, SLOWEST);
    await textLeft(`TEST: Sent media with default duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe);
    await textLeft(`TEST: Sent media with SLOW duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, SLOW);
    await textLeft(`TEST: Sent media with NORMAL duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, NORMAL);
    await textLeft(`TEST: Sent media with FAST duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, FAST);
    await textLeft(`TEST: Sent media with INSTANT duration...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, INSTANT);
    await textLeft(`TEST: Sent media with SLOWEST delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, void 0, SLOWEST);
    await textLeft(`TEST: Sent media with default delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe);
    await textLeft(`TEST: Sent media with SLOW delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, void 0, SLOW);
    await textLeft(`TEST: Sent media with NORMAL delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, void 0, NORMAL);
    await textLeft(`TEST: Sent media with FAST delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, void 0, FAST);
    await textLeft(`TEST: Sent media with INSTANT delay...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", JaneDoe, void 0, INSTANT);
    await textLeft(`TEST: Sending media to Sarah Smith...`, JaneDoe, INSTANT);
    await mediaRight("src/story/debug/images/Cat.png", SarahSmith, INSTANT, INSTANT);
    await mediaRight("src/story/debug/videos/mov_bbb.mp4", SarahSmith, INSTANT, INSTANT);
    await textRight(`=====[END] Sent Media=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sent Media=====`, JaneDoe, INSTANT);
  }
  if (enableReactionTest) {
    await textLeft(`=====[START] Reaction=====`, JaneDoe, INSTANT);
    await textLeft(`Received message as filler.`, JaneDoe, INSTANT);
    await textRight(`TEST: Should have thumbs up emoji...`, JaneDoe, INSTANT, INSTANT);
    await reaction("\u{1F44D}", JaneDoe);
    await textLeft("A", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textLeft("Ab", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textLeft("Abc", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textLeft("Abcd", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textRight("A", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textRight("Ab", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textRight("Abc", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textRight("Abcd", JaneDoe);
    await reaction("\u2764\uFE0F", JaneDoe);
    await textLeft(`TEST: Should have smile emoji...`, JaneDoe, INSTANT);
    await textRight(`Sent message: Will react with emoji.`, JaneDoe, INSTANT, INSTANT);
    await reaction("\u{1F603}", JaneDoe, 1);
    await textLeft(`TEST: Negative 'lastMessageAgo', should NOT have any emojis...`, JaneDoe, INSTANT);
    await reaction("\u{1F608}", JaneDoe, -1);
    await textLeft(`TEST: 9999 'lastMessageAgo', should NOT have any emojis...`, JaneDoe, INSTANT);
    await reaction("\u26D4\uFE0F", JaneDoe, 9999);
    await textRight(
      `Sent message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text. TEST: Should have embarrassed emoji...`,
      JaneDoe,
      INSTANT,
      INSTANT
    );
    await textLeft(
      `Received message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.
TEST: Should have throwing kiss emoji...`,
      JaneDoe,
      INSTANT
    );
    await textRight(`Sent message as filler.`, JaneDoe, INSTANT, INSTANT);
    await reaction("\u{1F605}", JaneDoe, 2);
    await reaction("\u{1F618}", JaneDoe, 1);
    await textLeft(`TEST: Should have heart-shaped eyes emoji with SLOWEST duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F60D}", JaneDoe, 0, SLOWEST);
    await textLeft(`TEST: Should have scream emoji with SLOW duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F631}", JaneDoe, 0, SLOW);
    await textLeft(`TEST: Should have no mouth emoji with default duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F636}", JaneDoe, 0);
    await textLeft(`TEST: Should have medical mask emoji with NORMAL duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F637}", JaneDoe, 0, NORMAL);
    await textLeft(`TEST: Should have cold sweat emoji with FAST duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F613}", JaneDoe, 0, FAST);
    await textLeft(`TEST: Should have sleepy emoji with INSTANT duration...`, JaneDoe, INSTANT);
    await reaction("\u{1F62A}", JaneDoe, 0, INSTANT);
    await textLeft(`TEST: Should have overwritten emojis from 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8...`, JaneDoe, INSTANT);
    await reaction("1\uFE0F", JaneDoe, 0, FAST);
    await reaction("2\uFE0F", JaneDoe, 0, FAST);
    await reaction("3\uFE0F", JaneDoe, 0, FAST);
    await reaction("4\uFE0F", JaneDoe, 0, FAST);
    await reaction("5\uFE0F", JaneDoe, void 0, FAST);
    await reaction("6\uFE0F", JaneDoe, void 0, FAST);
    await reaction("7\uFE0F", JaneDoe, void 0, FAST);
    await reaction("8\uFE0F", JaneDoe, void 0, FAST);
    await textLeft(`TEST: Should have fearful emoji...`, JaneDoe, INSTANT);
    await reaction("\u{1F628}", JaneDoe, 0);
    await textLeft(`TEST: Removing fearful emoji...`, JaneDoe, SLOWEST);
    await reaction("\u{1F628}", JaneDoe, 1);
    await textLeft(`TEST: Should have neutral face expression emoji...`, SarahSmith, INSTANT);
    await textLeft(`TEST: Filler, should have no emojis...`, SarahSmith, INSTANT);
    await textLeft(`TEST: Should have wink emoji...`, SarahSmith, INSTANT);
    await reaction("\u{1F610}", SarahSmith, 2);
    await reaction("\u{1F609}", SarahSmith);
    await textRight(`=====[END] Reaction=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Reaction=====`, JaneDoe, INSTANT);
  }
  if (enableChoiceTest) {
    await textLeft(`=====[START] Choice=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Choice with default typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option A_1.",
          fullText: `I am choosing Option A_1 with default typing speed.`,
          callback: () => {
            notification("Option A_1 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option A_2.",
          fullText: `I am choosing Option A_2 with default typing speed.`,
          callback: () => {
            notification("Option A_2 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with slow typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option B_1.",
          fullText: `I am choosing Option B_1 with slow typing speed.`,
          typingSpeedDelay: 30,
          callback: () => {
            notification("Option B_1 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option B_2.",
          fullText: `I am choosing Option B_2 with slow typing speed.`,
          typingSpeedDelay: 30,
          callback: () => {
            notification("Option B_2 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with no delay typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option C_1.",
          fullText: `I am choosing Option C_1 with no delay typing speed.`,
          typingSpeedDelay: 0,
          callback: () => {
            notification("Option C_1 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option C_2.",
          fullText: `I am choosing Option C_2 with no delay typing speed.`,
          typingSpeedDelay: 0,
          callback: () => {
            notification("Option C_2 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with no display text...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          fullText: `I am choosing Option D_1 with no display text.`,
          callback: () => {
            notification("Option D_1 Callback", JaneDoe);
          }
        },
        {
          fullText: `I am choosing Option D_2 with no display text.`,
          callback: () => {
            notification("Option D_2 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with no callback...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option E_1.",
          fullText: `I am choosing Option E_1 with no callback.`
        },
        {
          displayText: "Option E_2.",
          fullText: `I am choosing Option E_2 with no callback.`
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with four options...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option F_1.",
          fullText: `I am choosing Option F_1 out of four options.`,
          callback: () => {
            notification("Option F_1 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option F_2.",
          fullText: `I am choosing Option F_2 out of four options.`,
          callback: () => {
            notification("Option F_2 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option F_3.",
          fullText: `I am choosing Option F_3 out of four options.`,
          callback: () => {
            notification("Option F_3 Callback", JaneDoe);
          }
        },
        {
          displayText: "Option F_4.",
          fullText: `I am choosing Option F_4 out of four options.`,
          callback: () => {
            notification("Option F_4 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with one option...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: "Option G_1.",
          fullText: `I am choosing Option G_1 with one option.`,
          callback: () => {
            notification("Option G_1 Callback", JaneDoe);
          }
        }
      ],
      JaneDoe
    );
    await textLeft(`TEST: Choice with no options...`, JaneDoe, INSTANT);
    await choices([], JaneDoe);
    await textRight(`=====[END] Choice=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Choice=====`, JaneDoe, INSTANT);
  }
  if (enableFlagTest) {
    await textLeft(`=====[START] Flag=====`, JaneDoe, INSTANT);
    await textLeft(`Adding 'Debug_Test_A' flag...`, JaneDoe);
    addFlag("Debug_Test_A");
    await textLeft(`TEST: Should have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlag("Debug_Test_A")) {
      await textLeft(`OK: Found 'Debug_Test_A' flag.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`TEST: Again, should have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlags(["Debug_Test_A"])) {
      await textLeft(`OK: Found 'Debug_Test_A' flag.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(`Adding 'Debug_Test_A' flag again...`, JaneDoe);
    addFlag("Debug_Test_A");
    await textLeft(`Adding 'Debug_Test_B' flag...`, JaneDoe);
    addFlag("Debug_Test_B");
    await textLeft(`TEST: Should have both 'Debug_Test_A' and 'Debug_Test_B' flags...`, JaneDoe);
    if (hasFlags(["Debug_Test_A", "Debug_Test_B"])) {
      await textLeft(`OK: Found 'Debug_Test_A' and 'Debug_Test_B' flags.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' and/or 'Debug_Test_B' flags.`, JaneDoe, INSTANT);
      await sleep(2e4);
    }
    await textLeft(
      `Removing 'Debug_Test_A' flag.
TEST: Should not have 'Debug_Test_A' flag...`,
      JaneDoe
    );
    removeFlag("Debug_Test_A");
    if (hasFlag("Debug_Test_A")) {
      await textLeft(`ERROR: Found 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(2e4);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_A' flag.`, JaneDoe);
    }
    await textLeft(`Removing 'Debug_Test_B' flag...`, JaneDoe);
    removeFlag("Debug_Test_B");
    await textLeft(`Removing 'Debug_Test_B' flag again...`, JaneDoe);
    removeFlag("Debug_Test_B");
    await textLeft(`TEST: Should not have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlag("Debug_Test_A")) {
      await textLeft(`ERROR: Found 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(2e4);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_A' flag.`, JaneDoe);
    }
    await textLeft(`TEST: Should not have 'Debug_Test_B' flag...`, JaneDoe);
    if (hasFlag("Debug_Test_B")) {
      await textLeft(`ERROR: Found 'Debug_Test_B' flag.`, JaneDoe, INSTANT);
      await sleep(2e4);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_B' flag.`, JaneDoe);
    }
    await textRight(`=====[END] Flag=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Flag=====`, JaneDoe, INSTANT);
  }
  if (enableNotificationTest) {
    await textLeft(`=====[START] Notification=====`, JaneDoe, INSTANT);
    await textLeft(`TEST: Notification from Sarah Smith...`, JaneDoe, SLOWEST);
    await textLeft(`Received new message from Sarah Smith.`, SarahSmith);
    await textLeft(`TEST: Notification with regular message...`, JaneDoe, SLOWEST);
    notification("Notification Test 1", JaneDoe);
    await textLeft(`TEST: Notification with 'S' message...`, JaneDoe, SLOWEST);
    notification("S", JaneDoe);
    await textLeft(`TEST: Notification with empty message...`, JaneDoe, SLOWEST);
    notification("", JaneDoe);
    await textLeft(`TEST: Notification with undefined message...`, JaneDoe, SLOWEST);
    await textLeft(`TEST: Notification with new line...`, JaneDoe, SLOWEST);
    notification(
      `Notification Test 2.
With new line.`,
      JaneDoe
    );
    await textLeft(`TEST: Notification with a long message...`, JaneDoe, SLOWEST);
    notification(
      `Notification Test 3 with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe
    );
    await textLeft(`TEST: Notification with an emoji message...`, JaneDoe, SLOWEST);
    notification("\u{1F603}", JaneDoe);
    await textLeft(`TEST: Notification with name as 'Test Name'...`, JaneDoe, SLOWEST);
    notification("Notification Test 4", "Test Name");
    await textLeft(`TEST: Notification with an empty name...`, JaneDoe, SLOWEST);
    notification("Notification Test 5", "");
    await textLeft(`TEST: Notification with an undefined name...`, JaneDoe, SLOWEST);
    await textLeft(`TEST: Notification with a new line name...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 7",
      `Test Name.
With new line.`
    );
    await textLeft(`TEST: Notification with a very long name...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 8",
      "A very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long name."
    );
    await textLeft(`TEST: Notification with an emoji name...`, JaneDoe, SLOWEST);
    notification("Notification Test 9", "\u{1F603}");
    await textLeft(`TEST: Notification with app name as 'Test App'...`, JaneDoe, SLOWEST);
    notification("Notification Test 10", JaneDoe, "Test App");
    await textLeft(`TEST: Notification with an empty app name...`, JaneDoe, SLOWEST);
    notification("Notification Test 11", JaneDoe, "");
    await textLeft(`TEST: Notification with a new line app name...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 12",
      JaneDoe,
      `App name.
With new line.`
    );
    await textLeft(`TEST: Notification with a very long app name...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 13",
      JaneDoe,
      "A very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long app name."
    );
    await textLeft(`TEST: Notification with an emoji app name...`, JaneDoe, SLOWEST);
    notification("Notification Test 14", JaneDoe, "\u{1F603}");
    await textLeft(`TEST: Notification with time now...`, JaneDoe, SLOWEST);
    notification("Notification Test 15", JaneDoe);
    await textLeft(`TEST: Notification with time 1 second ago...`, JaneDoe, SLOWEST);
    notification("Notification Test 16", JaneDoe, void 0, new Date(state.gameState.date.getTime() - 1 * 1e3));
    await textLeft(`TEST: Notification with time 30 seconds ago...`, JaneDoe, SLOWEST);
    notification("Notification Test 17", JaneDoe, void 0, new Date(state.gameState.date.getTime() - 30 * 1e3));
    await textLeft(`TEST: Notification with time 30 minutes ago...`, JaneDoe, SLOWEST);
    notification("Notification Test 18", JaneDoe, void 0, new Date(state.gameState.date.getTime() - 30 * 60 * 1e3));
    await textLeft(`TEST: Notification with time 1 hour ago...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 19",
      JaneDoe,
      void 0,
      new Date(state.gameState.date.getTime() - 1 * 60 * 60 * 1e3)
    );
    await textLeft(`TEST: Notification with time 1 day ago...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 20",
      JaneDoe,
      void 0,
      new Date(state.gameState.date.getTime() - 1 * 24 * 60 * 60 * 1e3)
    );
    await textLeft(`TEST: Notification with time 1 week ago...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 21",
      JaneDoe,
      void 0,
      new Date(state.gameState.date.getTime() - 1 * 7 * 24 * 60 * 60 * 1e3)
    );
    await textLeft(`TEST: Notification with time 1 month ago...`, JaneDoe, SLOWEST);
    notification(
      "Notification Test 22",
      JaneDoe,
      void 0,
      new Date(state.gameState.date.getTime() - 1 * 31 * 24 * 60 * 60 * 1e3)
    );
    await textLeft(`TEST: Notification with time 30 minutes from now...`, JaneDoe, SLOWEST);
    notification("Notification Test 23", JaneDoe, void 0, new Date(state.gameState.date.getTime() + 30 * 60 * 1e3));
    await textLeft(`TEST: Three notifications at once...`, JaneDoe, SLOWEST);
    notification("Notification Test 24", JaneDoe);
    notification("Notification Test 25", JaneDoe);
    notification("Notification Test 26", JaneDoe);
    await textLeft(`TEST: Many notifications at once...`, JaneDoe, SLOWEST);
    notification("Notification Test 27", JaneDoe);
    notification("Notification Test 28", JaneDoe);
    notification("Notification Test 29", JaneDoe);
    notification("Notification Test 30", JaneDoe);
    notification("Notification Test 31", JaneDoe);
    notification("Notification Test 32", JaneDoe);
    notification("Notification Test 33", JaneDoe);
    notification("Notification Test 34", JaneDoe);
    notification("Notification Test 35", JaneDoe);
    notification("Notification Test 36", JaneDoe);
    notification("Notification Test 37", JaneDoe);
    notification("Notification Test 38", JaneDoe);
    notification("Notification Test 39", JaneDoe);
    notification("Notification Test 40", JaneDoe);
    await textRight(`=====[END] Notification=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Notification=====`, JaneDoe, INSTANT);
  }
  await textLeft(`=====[END] Unit Tests Done=====`, JaneDoe, INSTANT);
};

// src/story/template/template.ts
var template = async () => {
  const TemplateStarter = contact("Template", "Starter", "src/story/template/images/sample.png");
  await waitFor(() => activeContactName() === TemplateStarter);
  timestamp(TemplateStarter);
  await textLeft(`Hello! You can start adding stuff here.`, TemplateStarter);
};

// src/story/tutorial/tutorial.ts
var tutorial = async () => {
  const TutorialGuide = contact("Tutorial", "Guide", "src/story/tutorial/images/tutorial-guide.png");
  await waitFor(() => activeContactName() === TutorialGuide);
  timestamp(TutorialGuide);
  await textLeft(`Welcome!`, TutorialGuide);
  await textLeft(`I'm here to explain how to play... as quickly as possible!`, TutorialGuide);
  await textLeft(
    `To continue, you can:
\u2022 Click on the 'Send' button
\u2022 Press 'Enter' on the keyboard
\u2022 Press 'Space bar' on the keyboard`,
    TutorialGuide
  );
  await textRight(`How can I fast forward?`, TutorialGuide);
  await reaction("\u{1F44D}", TutorialGuide, 1);
  await textLeft(
    `To fast forward, you can:
\u2022 Hold down 'Ctrl' on the keyboard to temporarily fast forward. Release the key to stop.
\u2022 (Accessibility enabled) Click the fast forward button on the chat header at the top-right to toggle on/off`,
    TutorialGuide
  );
  await textRight(`How can I view images?`, TutorialGuide);
  await textLeft(`Here is an example of an image:`, TutorialGuide);
  await mediaLeft("src/story/debug/images/Cat.png", TutorialGuide, NORMAL);
  await textLeft(
    `Click on the image to get a better look at it.
Then click anywhere or press the 'Esc' key to exit.`,
    TutorialGuide
  );
  await textRight(`How can I play videos?`, TutorialGuide);
  await textLeft(`Here is an example of a video:`, TutorialGuide);
  await mediaLeft("src/story/debug/videos/mov_bbb.mp4", TutorialGuide, NORMAL);
  await textLeft(
    `Click on the video to play it.
Then click on the 'X' button at the top-right or press the 'Esc' key to exit.`,
    TutorialGuide
  );
  await textRight(`Are there branching paths?`, TutorialGuide);
  await textLeft(`Yes. The author can ask the player to make a decision.`, TutorialGuide);
  await textLeft(`For example: which do you like more? Pizza or burger?`, TutorialGuide);
  await textLeft(
    `The text input will turn yellow and you can choose between the choices using:
\u2022 Up/down arrow keys on the keyboard
\u2022 Mouse scroll wheel up/down
\u2022 (Accessibility enabled) Click the up/down buttons on the chat header at the top-right`,
    TutorialGuide
  );
  await choices(
    [
      {
        displayText: `Pizza.`,
        fullText: `Pizza! It's delicious.`,
        callback: () => {
          addFlag("pizza");
        }
      },
      {
        displayText: `Burger.`,
        fullText: `Burger! You can't go wrong with burgers.`,
        callback: () => {
          addFlag("burger");
        }
      }
    ],
    TutorialGuide
  );
  if (hasFlag("pizza")) {
    await reaction("\u{1F355}", TutorialGuide);
    await textLeft(`I love mine with extra pepperoni!`, TutorialGuide);
  } else if (hasFlag("burger")) {
    await reaction("\u{1F354}", TutorialGuide);
    await textLeft(`That's right, I've never had a bad burger before!`, TutorialGuide);
  }
  await textRight(`How can I find the in-game time?`, TutorialGuide);
  await textLeft(`Look for a timestamp like this:`, TutorialGuide);
  timestamp(TutorialGuide);
  await textLeft(`Hover your mouse on top of it to get the exact time at that moment.`, TutorialGuide);
  await textRight(`Can I save or load the game?`, TutorialGuide);
  await textLeft(`No, saving and loading are currently not supported.`, TutorialGuide);
  await textRight(`I understand. Thanks for explaining.`, TutorialGuide);
  await reaction("\u{1F44D}", TutorialGuide);
  await textLeft(`Great! No problem!`, TutorialGuide);
  await textLeft(
    `By the way: you can change the settings by going back to the main screen and clicking on 'Edit'.`,
    TutorialGuide
  );
};

// src/main.ts
initialize();
template();
unitTest();
tutorial();
