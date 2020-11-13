import BaseController from "./base_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { currentUserId } from "controllers/authentication_controller";
import userSvg from "images/user-icon.svg";

export default class ChatMessagesController extends BaseController {
  private myUserId: string;
  private lastMessageFromUserId: string;
  private chatMessageCallbackHandler: (event) => void;
  private userJoinedCallbackHandler: (event) => void;

  connect(): void {
    this.chatMessageCallbackHandler = (event) => {
      this.displayChatMessage(event.detail.data);
    };
    VideoEventProcessor.subscribeTo(
      "ChatMessage",
      this.chatMessageCallbackHandler
    );

    this.userJoinedCallbackHandler = (event) => {
      this.displayUserJoinedNotice(event.detail.data);
    };
    VideoEventProcessor.subscribeTo(
      "UserJoinedEvent",
      this.userJoinedCallbackHandler
    );

    this.myUserId = currentUserId();
  }

  disconnect(): void {
    VideoEventProcessor.unsubscribeFrom(
      "ChatMessage",
      this.chatMessageCallbackHandler
    );
    VideoEventProcessor.unsubscribeFrom(
      "UserJoinedEvent",
      this.userJoinedCallbackHandler
    );
  }

  private displayUserJoinedNotice(user) {
    this.lastMessageFromUserId = null;

    this.appendHtml(`
      <div class="user-joined">
        <img src=${userSvg} alt="user-icon"/>
        <div>${user.name} joined the chat</div>
      </div>`);
  }

  private displayChatMessage(message) {
    const sameUser = message.userId === this.lastMessageFromUserId;

    let html = "";
    if (message.userId === this.myUserId) {
      html = `
        <div class="message-right">
          <div class="message-display message-right__text">
            ${message.message}
          </div>
        </div>
      `;
    } else if (sameUser) {
      html = `
        <div class="message-grouped">
          <div class="message-display border-left message-grouped__text">
            ${message.message}
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="message-left">
          <div class="message-content">
            <div class="message-content__name">
              ${message.name}
            </div>
            <div class="message-display border-left message-content__text">
              ${message.message}
            </div>
          </div>
        </div>
      `;
    }

    this.appendHtml(html);
    this.lastMessageFromUserId = message.userId;
  }

  private appendHtml(html: string) {
    this.element.insertAdjacentHTML("beforeend", html);
    this.element.lastElementChild.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }
}
