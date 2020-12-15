import BaseController from "./base_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { currentUserId } from "helpers/authentication_helpers";
import userSvg from "images/user-icon.svg";
import heartSvg from "images/heart-gray.svg";
import {
  renderReactionMarkup,
  UserReactionMessageEvent,
} from "./reaction_notification_controller";

export default class ChatMessagesController extends BaseController {
  private myUserId: string;
  private lastMessageFromUserId: string;
  private chatMessageCallbackHandler: (event) => void;
  private userJoinedCallbackHandler: (event) => void;
  private userReactionListener: (event) => void;

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

    this.subscribeToUserReactions();

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
    document.removeEventListener(
      UserReactionMessageEvent,
      this.userReactionListener
    );
  }

  private subscribeToUserReactions() {
    this.userReactionListener = (event: CustomEvent) => {
      this.displayVideoReactionNotice(event.detail.name);
    };
    document.addEventListener(
      UserReactionMessageEvent,
      this.userReactionListener
    );
  }

  private displayVideoReactionNotice(user) {
    this.lastMessageFromUserId = null;
    this.appendHtml(renderReactionMarkup(user, heartSvg));
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
