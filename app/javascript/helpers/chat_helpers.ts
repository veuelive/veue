import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { getChannelUserId } from "helpers/channel_helpers";
import { currentUserId } from "helpers/authentication_helpers";

export function appendToChat(element: HTMLElement, html: string): void {
  element.insertAdjacentHTML("beforeend", html);
  element.lastElementChild.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}

export function renderChatMessageToString({
  message,
  isSameUser,
  currentUserId,
}: RenderChatMessageToString): string {
  // Prepend message because document.querySelector("#1") will return an error
  message.id = `message-${message.id}`;

  if (message.byStreamer) {
    return renderMessageByStreamer(message);
  }

  if (message.userId === currentUserId) {
    return renderMessageBySelf(message);
  }

  if (isSameUser) {
    return renderMessageBySameUser(message);
  }

  return renderRegularMessage(message);
}

export function displayChatMessage(
  message: ChatMessage,
  isSameUser: boolean
): void {
  if (document.querySelector(`#message-${message.id}`)) {
    return;
  }

  const html = renderChatMessageToString({
    message,
    isSameUser,
    currentUserId: currentUserId(),
  });

  appendToChat(document.querySelector(".messages"), html);
}

export function byStreamer(): boolean {
  return this.myUserId === getChannelUserId();
}

function renderMessageByStreamer(message: ChatMessage) {
  return `
    <div id="${message.id}" class="message-left">
      <div class="highlighted-message">
        <div class="highlighted-message__name">
          ${message.name}
        </div>
        <div class="message-display border-left highlighted-message__text">
          ${message.message}
        </div>
      </div>
    </div>
  `;
}

function renderMessageBySelf(message: ChatMessage) {
  return `
    <div id="${message.id}" class="message-right">
      <div class="message-display message-right__text">
        ${message.message}
      </div>
    </div>`;
}

function renderMessageBySameUser(message: ChatMessage) {
  return `
    <div id="${message.id}" class="message-grouped">
      <div class="message-display border-left message-grouped__text">
        ${message.message}
      </div>
    </div>`;
}

function renderRegularMessage(message: ChatMessage) {
  return `
    <div id="${message.id}" class="message-left">
      <div class="message-content">
        <div class="message-content__name">
          ${message.name}
        </div>
        <div class="message-display border-left message-content__text">
          ${message.message}
        </div>
      </div>
    </div>`;
}
