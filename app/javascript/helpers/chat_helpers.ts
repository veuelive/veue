import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { currentUserId } from "helpers/authentication_helpers";

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
  const showName = !isThread && !isMyMessage;

  const modifiers = [];

  if (isThread) {
    modifiers.push("grouped");
  }

  if (message.byStreamer) {
    modifiers.push("highlighted");
  }

  if (isMyMessage) {
    modifiers.push("right");
  } else {
    modifiers.push("left");
  }

  return renderMessage(message, modifiers, showName);
}

function renderMessage(
  message: ChatMessage,
  modifiers: ChatMessageRenderType[],
  showName: boolean
) {
  const messageClasses = ["message"];
  modifiers.forEach((modifier) => messageClasses.push(`message--${modifier}`));
  return `
    <div id="${message.id}" class="${messageClasses.join(" ")}">
      <div class="message__content">
        ${showName ? renderName(message) : ""}
        <div class="message__content__text">
          ${message.message}
        </div>
      </div>
    </div>`;
}

function renderName(message: ChatMessage) {
  return `<div class="message__content__name">${message.name}</div>`;
}
