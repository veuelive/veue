import { Controller } from "stimulus";
import consumer from "../channels/consumer";
import Rails from "@rails/ujs";

export default class extends Controller {
  static targets = ["chatMessages", "chatForm", "messageInput"];

  readonly chatMessagesTarget!: HTMLElement;
  readonly chatFormTarget!: HTMLFormElement;
  readonly messageInputTarget: HTMLInputElement;
  readonly hasMessageInputTarget: boolean;
  private videoId: string;
  private userId: string;
  private lastUserId: string;

  connect(): void {
    this.videoId = this.data.get("video-id");
    this.userId = this.data.get("user");
    this.createChatSubscription();
    if (this.hasMessageInputTarget) {
      this.submitFormEvent();
    }
  }

  createChatSubscription(): void {
    // messageHtml variable will be having reference to createHtml function of chat controller
    const messageHtml = this.createHtml;
    const currentUserId = this.userId;
    const dataMap = this.data;
    const chatArea = this.chatMessagesTarget;

    consumer.subscriptions.create(
      {
        channel: "LiveVideoChannel",
        roomId: this.videoId,
      },
      {
        async received(data) {
          // Called when there's incoming data on the websocket for this channel
          const lastUser = parseInt(dataMap.get("last-user"));

          chatArea.insertAdjacentHTML(
            "beforeend",
            messageHtml(
              data.user_id,
              currentUserId,
              data.user_name,
              data.text,
              parseInt(data.user_id) === lastUser
            )
          );
          dataMap.set("last-user", data.user_id);
        },
      }
    );
  }

  submitFormEvent(): void {
    this.messageInputTarget.addEventListener("keydown", async (event) => {
      if (!event.shiftKey && event.keyCode === 13) {
        event.preventDefault();
        const formData = new FormData(this.chatFormTarget);
        await Rails.ajax({
          type: "post",
          url: "/chat_messages",
          data: formData,
        });
        this.messageInputTarget.value = "";
      }
    });
  }

  createHtml(
    id: number,
    uid: string,
    name: string,
    message: string,
    sameUser: boolean
  ): string {
    let html = "";
    if (id === parseInt(uid)) {
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
            <img src="/assets/avatar-placeholder.png" class="rounded h-2 w-2"/>
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
