import { Controller } from "stimulus";
import consumer from "../channels/consumer";
import Rails from "@rails/ujs";

export default class extends Controller {
  static targets = ["chatMessages", "chatForm", "messageInput"];

  readonly chatMessagesTarget!: HTMLElement;
  readonly chatFormTarget!: HTMLFormElement;
  readonly messageInputTarget!: HTMLInputElement;
  private videoId: string;
  private userId: string;
  private lastUserId: string;

  connect() {
    this.videoId = this.data.get("video-id");
    this.userId = this.data.get("user");
    this.createChatSubscription();
    this.submitFormEvent();
  }

  createChatSubscription() {
    // messageHtml variable will be having reference to createHtml function of chat controller
    const messageHtml = this.createHtml;
    const currentUserId = this.userId;
    const dataMap = this.data;

    consumer.subscriptions.create(
      {
        channel: "LiveVideoChannel",
        roomId: this.videoId,
      },
      {
        async received(data) {
          // Called when there's incoming data on the websocket for this channel
          const chatId = `live-chat-${data.video_id}`;
          const chatArea = document.getElementById(chatId);
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

  submitFormEvent() {
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

  createHtml(id, uid, name, message, sameUser) {
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
        <div class="chat-message-grouped">
          <div class="message-display border-left message-grouped__text">
            ${message}
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="message-left">
          <div class="message-left__name">
            ${name}
          </div>
          <div class="message-display border-left message-left__text">
            ${message}
          </div>
        </div>
      `;
    }
    return html;
  }
}
