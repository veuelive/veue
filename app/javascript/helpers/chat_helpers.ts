import { ChatMessage, RenderChatMessageToString } from "types/chat";
import { currentUserId } from "helpers/authentication_helpers";
import { displayMessageTime } from "util/time";
import ellipseGray from "images/ellipse-gray.svg";
import ellipseHighlighted from "images/ellipse-highlighted.svg";
import ellipseAnnouncement from "images/ellipse-announcement.svg";

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
  let ellipse = ellipseGray;

  if (isThread) {
    modifiers.push("grouped");
  }

  if (message.byStreamer) {
    modifiers.push("announcement");
    ellipse = ellipseAnnouncement;
  }

  if (isMyMessage) {
    modifiers.push("right");
    modifiers.push("highlighted");
    ellipseHighlighted;
  } else {
    modifiers.push("left");
  }

  return renderMessage(
    message,
    modifiers,
    !isThread,
    isMyMessage,
    timecodeMs,
    ellipse
  );
}

function renderMessage(
  message: ChatMessage,
  modifiers: ChatMessageRenderType[],
  showName: boolean,
  isMyMessage: boolean,
  timecodeMs: number,
  ellipse: string
) {
  const messageClasses = ["message"];
  modifiers.forEach((modifier) => messageClasses.push(`message--${modifier}`));

  return `
    <div id="${message.id}" class="${messageClasses.join(" ")}">
      <div class="message__content">
        ${showName && !isMyMessage ? renderAvatar(message, "left") : ""}
        ${userMessage(message, showName, timecodeMs, ellipse)}
        ${showName && isMyMessage ? renderAvatar(message, "right") : ""}
      </div>
    </div>`;
}

function userMessage(
  message: ChatMessage,
  showName: boolean,
  timecodeMs: number,
  ellipse: string
) {
  return `
    <div class="message__content__user">
      ${showName ? renderName(message, timecodeMs, ellipse) : ""}
      <div class="message__content__text ${!showName ? "text--margin" : ""}">
        ${message.message}
      </div>
    </div>`;
}

function renderName(message: ChatMessage, timecodeMs: number, ellipse: string) {
  const timeStamp = todayTimestamp(message.time, timecodeMs);
  return `<div class="message__content__user__name">${message.name} <img src="${ellipse}"/> ${timeStamp}</div>`;
}

function renderAvatar(message: ChatMessage, position: string) {
  return `
    <div class="message__content__avatar message__content__avatar--${position}">
      <img src="/users/${message.userId}/images/thumbnail.png" />
    </div>`;
}

function todayTimestamp(messageTime: string, timecodeMs: number): string {
  const videoState = getStreamType();
  const statesValid = ["live", "upcoming", "pending", "scheduled", "starting"];

  if (statesValid.includes(videoState)) {
    const date = new Date(messageTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return displayMessageTime(timecodeMs);
  }
}

function getStreamType(): string {
  const element = document.querySelector("*[data-video-id]") as HTMLElement;
  return element.dataset.audienceViewStreamType
    ? element.dataset.audienceViewStreamType
    : element.dataset.broadcastVideoState;
}
