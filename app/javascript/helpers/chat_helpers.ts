import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { currentUserId } from "helpers/authentication_helpers";
import { displayMessageTime } from "util/time";

type ChatMessageRenderType = "left" | "right" | "grouped";

export function appendToChat(element: HTMLElement, html: string): void {
  element.insertAdjacentHTML("beforeend", html);
  element.lastElementChild.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}

export function displayChatMessage(
  message: ChatMessage,
  isThread: boolean,
  timecodeMs = 0
): void {
  if (document.querySelector(`#message-${message.id}`)) {
    return;
  }

  const html = renderChatMessageToString({
    message,
    isThread,
    currentUserId: currentUserId(),
    timecodeMs,
  });

  appendToChat(document.querySelector(".messages"), html);
}

export function renderChatMessageToString({
  message,
  isThread,
  currentUserId,
  timecodeMs,
}: RenderChatMessageToString): string {
  // Prepend message because document.querySelector("#1") will return an error
  message.id = `message-${message.id}`;

  const isMyMessage = message.userId == currentUserId;

  const modifiers = [];

  if (isThread) {
    modifiers.push("grouped");
  }

  if (message.byStreamer) {
    modifiers.push("announcement");
  }

  if (isMyMessage) {
    modifiers.push("right");
    modifiers.push("highlighted");
  } else {
    modifiers.push("left");
  }

  return renderMessage(message, modifiers, !isThread, isMyMessage, timecodeMs);
}

function renderMessage(
  message: ChatMessage,
  modifiers: ChatMessageRenderType[],
  firstMessage: boolean,
  isMyMessage: boolean,
  timecodeMs: number
) {
  const messageClasses = ["message"];
  modifiers.forEach((modifier) => messageClasses.push(`message--${modifier}`));

  return `
    <div id="${message.id}" class="${messageClasses.join(" ")}">
      ${firstMessage ? renderAvatar(message) : ""}
      ${renderMessageContent(message, firstMessage, timecodeMs)}
    </div>`;
}

function renderMessageContent(
  message: ChatMessage,
  isTop: boolean,
  timecodeMs: number
) {
  return `
    <div class="message__content">
      ${isTop ? renderTop(message, timecodeMs) : ""}
      <div class="message__content__text ${!isTop ? "text--margin" : ""}">
        ${message.message}
      </div>
    </div>`;
}

function renderTop(message: ChatMessage, timecodeMs: number) {
  const time = renderTime(message.time, timecodeMs);
  return `<div class="message__content__top">
    <div class="message__content__top__name">${message.name}</div>
    <div class="message__content__top__time">${time}</div>
  </div>`;
}

function renderAvatar(message: ChatMessage) {
  return `
    <div class="message__avatar">
      <img src="/users/${message.userId}/images/thumbnail.png" />
    </div>`;
}

function renderTime(messageTime: string, timecodeMs: number): string {
  if (isVOD()) {
    return displayMessageTime(timecodeMs);
  }
  const date = new Date(messageTime);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });
}

function isVOD(): boolean {
  return !!document.querySelector('*[data-audience-view-stream-type="vod"]');
}
