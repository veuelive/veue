import consumer from "../channels/consumer";
import { post } from "util/fetch";
import BaseController from "./base_controller";

export default class extends BaseController {
  static targets = ["chatMessages", "chatForm", "messageInput"];

  readonly chatMessagesTarget!: HTMLElement;
  readonly chatFormTarget!: HTMLFormElement;
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
    if (this.hasMessageInputTarget) {
      this.submitFormEvent();
    }
  }

  disconnect(): void {
    this.unsubscribeFromAll();
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
        videoId: this.videoId,
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
      const text = textAreaElement.value;
      textAreaElement.value = "";

      if (text.length > 0) {
        const data = new FormData();
        data.append("body", text);
        post(this.chatMessagesUrl, { body: data }).then(() =>
          console.log("Sent!")
        );
      }
    }
  }

  submitFormEvent(): void {
    // this.messageInputTarget.addEventListener("keydown", async (event) => {
    //   if (!event.shiftKey && event.keyCode === 13) {
    //     event.preventDefault();
    //     const body = new FormData(this.chatFormTarget);
    //     await post("/chat_messages", { body });
    //     this.messageInputTarget.value = "";
    //   }
    // });
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
