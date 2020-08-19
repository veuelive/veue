import { Controller } from "stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets = [
    "chatMessages",
    "chatForm",
    "messageInput"
  ]

  readonly chatMessagesTarget!: HTMLElement
  readonly chatFormTarget!: HTMLElement
  readonly messageInputTarget!: HTMLInputElement
  private videoId: string

  connect() {
    this.videoId = this.data.get("video-id");
    this.createChatSubscription();
  }

  createChatSubscription() {
    consumer.subscriptions.create({
        channel: "LiveVideoChannel",
        roomId: this.videoId
    }, {
      received(data) {
        // Called when there's incoming data on the websocket for this channel
        const newMessageHtml = `
            <div class="web--message">
              <p class="web--message__name">
                ${data.user_name}
              </p>
              <label class="web--message__label">
                ${data.text}
              </label>
            </div>
        `
        const chatId = `live-chat-${data.video_id}`;
        const chatArea = document.getElementById(chatId)
        chatArea.insertAdjacentHTML('beforeend', newMessageHtml)
      }
    })
  }

  formSubmissionHandler() {
    this.chatFormTarget.addEventListener("ajax:success", (event) => {
      this.messageInputTarget.value = ""
    })
  }
}
