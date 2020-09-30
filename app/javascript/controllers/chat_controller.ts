import consumer from "../channels/consumer";
import { postForm } from "util/fetch";
import userSvg from "../images/user.svg";
import BaseController from "./base_controller";

export default class extends BaseController {
  static targets = ["lastMessage", "messageInput"];

  readonly lastMessageTarget: HTMLElement;
  readonly messageInputTarget: HTMLInputElement;
  readonly hasMessageInputTarget: boolean;
  private chatMessagesUrl: string;
  private userId: string;
  private lastUserId: string;
  private videoId: string;

  connect(): void {
    this.videoId = this.data.get("videoId");
    this.chatMessagesUrl = `/videos/${this.videoId}/chat_messages`;
    this.userId = this.data.get("user");
    this.createChatSubscription();
    this.subscribeToAuthChange();
  }

  disconnect(): void {
    this.unsubscribeFromAll();
  }

  createChatSubscription(): void {
    // messageHtml variable will be having reference to createHtml function of chat controller
    const messageHtml = this.createHtml;
    const currentUserId = this.userId;
    const dataMap = this.data;
    const lastMessage = this.lastMessageTarget;

    consumer.subscriptions.create(
      {
        channel: "LiveVideoChannel",
        videoId: this.videoId,
      },
      {
        async received(data) {
          // Called when there's incoming data on the websocket for this channel
          const lastUser = parseInt(dataMap.get("last-user"));

          const payload = data.payload;
          lastMessage.insertAdjacentHTML(
            "beforebegin",
            messageHtml(
              payload.user_id,
              currentUserId,
              payload.name,
              payload.message,
              payload.user_id === lastUser
            )
          );
          lastMessage.scrollIntoView({ behavior: "smooth" });
          dataMap.set("last-user", data.user_id);
        },
      }
    );
  }

  authChanged(): void {
    fetch(this.chatMessagesUrl).then((response) =>
      response
        .text()
        .then((html) => (document.getElementById("live-chat").innerHTML = html))
    );
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.code === "Enter") {
      event.preventDefault();
      const textAreaElement = event.target as HTMLTextAreaElement;
      const message = textAreaElement.value;
      textAreaElement.value = "";

      if (message.length > 0) {
        postForm(this.chatMessagesUrl, { message }).then(() =>
          console.log("Sent!")
        );
      }
    }
  }

  createHtml(
    user_id: string,
    my_user_id: string,
    name: string,
    message: string,
    sameUser: boolean
  ): string {
    let html = "";
    if (user_id === my_user_id) {
      html = `
        <div class="message-right">
          <div class="message-display message-right__text">
            ${message}
          </div>
        </div>
      `;
    } else if (sameUser) {
      html = `
        <div class="message-grouped">
          <div class="message-display border-left message-grouped__text">
            ${message}
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
              ${name}
            </div>
            <div class="message-display border-left message-content__text">
              ${message}
            </div>
          </div>
        </div>
      `;
    }
    return html;
  }
}
