import { Controller } from "stimulus";
import consumer from "../channels/consumer";

export default class extends Controller {
  static targets = ["chatMessages", "chatForm", "messageInput"];

  readonly chatMessagesTarget!: HTMLElement;
  readonly chatFormTarget!: HTMLElement;
  readonly messageInputTarget!: HTMLInputElement;
  private videoId: string;
  private userId: string;

  connect() {
    this.videoId = this.data.get("video-id");
    this.userId = this.data.get("user");
    console.log(this.userId);
    this.createChatSubscription();
  }

  createChatSubscription() {
    /* 
      messageHtml & sameUser variables will be having reference to
      createHtml & isSameUser function of chat controller respectively
    */
    const messageHtml = this.createHtml;
    const sameUser = this.isSameUser;
    const currentUserId = this.userId;

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
          let sameUserFlag = {};
          if (data.userId !== currentUserId)
            sameUserFlag = JSON.parse(await sameUser(data.id, data.video_id));
          chatArea.insertAdjacentHTML(
            "beforeend",
            messageHtml(
              data.user_id,
              currentUserId,
              data.user_name,
              data.text,
              sameUserFlag
            )
          );
        },
      }
    );
  }

  formSubmissionHandler() {
    this.chatFormTarget.addEventListener("ajax:success", (event) => {
      this.messageInputTarget.value = "";
    });
  }

  async isSameUser(messageId, videoId) {
    const response = await fetch(
      `/chat_messages/${messageId}/grouped_message?video_id=${videoId}`
    );
    return response.text();
  }

  createHtml(id, uid, name, message, sameUser) {
    let html = "";
    console.log("sameUser:", sameUser.grouped);
    if (id === parseInt(uid)) {
      html = `
        <div class="chat-message-right">
          <div class="chat-message-right__label">
            ${message}
          </div>
        </div>
      `;
    } else if (sameUser.grouped) {
      html = `
        <div class="chat-message-grouped">
          <div class="chat-message-grouped__label">
            ${message}
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="chat-message-left">
          <div class="chat-message-left__name">
            ${name}
          </div>
          <div class="chat-message-left__label">
            ${message}
          </div>
        </div>
      `;
    }
    return html;
  }
}
