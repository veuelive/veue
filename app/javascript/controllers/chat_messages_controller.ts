import BaseController from "./base_controller";
import { VideoEventProcessor } from "controllers/event/event_processor";
import { currentUserId } from "controllers/authentication_controller";
import userSvg from "images/user.svg";

export default class ChatMessagesController extends BaseController {
  private myUserId: string;
  private lastMessageFromUserId: string;
  private chatMessageCallbackHandler: (event) => void;

  connect(): void {
    this.chatMessageCallbackHandler = (event) => {
      this.displayMessage(event.detail.data);
    };
    VideoEventProcessor.subscribeTo(
      "ChatMessage",
      this.chatMessageCallbackHandler
    );

    this.myUserId = currentUserId();
  }

  disconnect(): void {
    VideoEventProcessor.unsubscribeFrom(
      "ChatMessage",
      this.chatMessageCallbackHandler
    );
  }

  private displayMessage(message) {
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
          <div class="user-avatar">
            <img src=${userSvg} class="rounded h-2 w-2"/>
          </div>
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

    this.element.insertAdjacentHTML("beforeend", html);
    this.lastMessageFromUserId = message.userId;
  }
}
