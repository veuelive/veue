import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { currentUserId } from "helpers/authentication_helpers";
import { displayMessageTime } from "util/time";
import ellipse from "images/ellipse-2.svg";

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
  timecodeMs: number
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
  showName: boolean,
  isMyMessage: boolean,
  timecodeMs: number
) {
  const messageClasses = ["message"];
  modifiers.forEach((modifier) => messageClasses.push(`message--${modifier}`));

  return `
    <div id="${message.id}" class="${messageClasses.join(" ")}">
      <div class="message__content">
        ${showName && !isMyMessage ? renderAvatar(message, "left") : ""}
        ${userMessage(message, showName, timecodeMs)}
        ${showName && isMyMessage ? renderAvatar(message, "right") : ""}
      </div>
    </div>`;
}

function userMessage(
  message: ChatMessage,
  showName: boolean,
  timecodeMs: number
) {
  return `
    <div class="message__content__user">
      ${showName ? renderName(message, timecodeMs) : ""}
      <div class="message__content__text ${!showName ? "text--margin" : ""}">
        ${message.message}
      </div>
    </div>`;
}

function renderName(message: ChatMessage, timecodeMs: number) {
  var date;
  var today;
  if (timecodeMs > 0) {
    today = displayMessageTime(timecodeMs);
  } else {
    date =
      message.time !== undefined ? new Date(message.time) : (date = new Date());
    today = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return `<div class="message__content__user__name">${message.name} <img src="${ellipse}" />  ${today}</div>`;
}

function renderAvatar(message: ChatMessage, position: string) {
  return `
    <div class="message__content__avatar message__content__avatar--${position}">
      <img src="/users/${message.userId}/images/thumbnail.png" />
    </div>`;
}
