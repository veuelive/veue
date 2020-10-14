import BaseController from "./base_controller";
import { VideoEventProcessor } from "controllers/event/event_processor";
import { currentUserId } from "controllers/authentication_controller";
import userSvg from "images/user.svg";

export default class ChatMessagesController extends BaseController {
  private myUserId: string;
  private lastMessageFromUserId: string;

  connect(): void {
    VideoEventProcessor.subscribeTo("ChatMessage", (event) => {
      this.displayMessage(event.detail.data);
    });

    // After we scrub, we will call this in the future
    VideoEventProcessor.subscribeTo(
      "clear",
      () => (this.element.innerHTML = "")
    );

    this.myUserId = currentUserId();
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
