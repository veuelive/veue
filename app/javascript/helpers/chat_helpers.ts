import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { currentUserId } from "helpers/authentication_helpers";
import logoCircular from "images/logo-circular.svg";

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
  isThread: boolean
): void {
  if (document.querySelector(`#message-${message.id}`)) {
    return;
  }

  const html = renderChatMessageToString({
    message,
    isThread,
    currentUserId: currentUserId(),
  });

  appendToChat(document.querySelector(".messages"), html);
}

export function renderChatMessageToString({
  message,
  isThread,
  currentUserId,
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

  return renderMessage(message, modifiers, !isThread, isMyMessage);
}

function renderMessage(
  message: ChatMessage,
  modifiers: ChatMessageRenderType[],
  showName: boolean,
  isMyMessage: boolean
) {
  const messageClasses = ["message"];
  modifiers.forEach((modifier) => messageClasses.push(`message--${modifier}`));

  return `
    <div id="${message.id}" class="${messageClasses.join(" ")}">
      <div class="message__content">
        ${showName && !isMyMessage ? renderAvatar(message, "left") : ""}
        ${userMessage(message, showName)}
        ${showName && isMyMessage ? renderAvatar(message, "right") : ""}
      </div>
    </div>`;
}

function userMessage(message: ChatMessage, showName: boolean) {
  return `
    <div class="message__content__user">
      ${showName ? renderName(message) : ""}
      <div class="message__content__text ${!showName ? "text--margin" : ""}">
        ${message.message}
      </div>
    </div>`;
}

function renderName(message: ChatMessage) {
  return `<div class="message__content__user__name">${message.name}</div>`;
}

function renderAvatar(message: ChatMessage, position: string) {
  console.log("render avatar:", message);
  const imageUrl = message.avatarAttached
    ? `/users/${message.userId}/images/thumbnail.png`
    : logoCircular;
  return `
    <div class="message__content__avatar message__content__avatar--${position}">
      <img src="${imageUrl}" />
    </div>`;
}
