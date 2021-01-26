import BaseController from "../base_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { currentUserId } from "helpers/authentication_helpers";
import userSvg from "images/user-icon-dark.svg";
import heartSvg from "images/heart-gray.svg";
import {
  renderReactionMarkup,
  UserReactionMessageEvent,
} from "./reaction_notification_controller";

import { ChatMessage } from "types/chat";
import { appendToChat, displayChatMessage } from "helpers/chat_helpers";

interface User {
  name: string;
}

export default class MessagesController extends BaseController {
  element!: HTMLElement;

  private myUserId: string;
  private lastMessageFromUserId: string;

  private chatMessageCallbackHandler: (event: CustomEvent) => void;
  private userJoinedCallbackHandler: (event: CustomEvent) => void;
  private userReactionListener: (event: CustomEvent) => void;

  connect(): void {
    this.chatMessageCallbackHandler = (event) => {
      this.showChatMessage(event.detail.data);
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

  private displayVideoReactionNotice(name: string) {
    this.lastMessageFromUserId = null;
    appendToChat(this.element, renderReactionMarkup(name, heartSvg));
  }

  private displayUserJoinedNotice(user: User) {
    this.lastMessageFromUserId = null;

    appendToChat(
      this.element,
      `
      <div class="user-joined">
        <img src=${userSvg} alt="user-icon"/>
        <div>${user.name} joined the chat</div>
      </div>`
    );
  }

  private showChatMessage(message: ChatMessage) {
    const isSameUser = message.userId === this.lastMessageFromUserId;

    displayChatMessage(message, isSameUser);

    this.lastMessageFromUserId = message.userId;
  }
}
