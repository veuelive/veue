import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { getChannelId } from "helpers/channel_helpers";
import { currentUserId } from "helpers/authentication_helpers";
import { displayChatMessage } from "helpers/chat_helpers";

export default class extends Controller {
  static targets = ["messageInput", "messageSend", "messageReaction"];
  element: HTMLElement;
  private messageInputTarget!: HTMLElement;
  private messageSendTarget!: HTMLDivElement;
  private messageReactionTarget!: HTMLDivElement;
  private lastMessageFromUserId: string;
  private userId: string;

  connect(): void {
    const bodyDataset = document.body.dataset;
    this.messageInputTarget.addEventListener("focus", () => {
      bodyDataset["keyboard"] = "visible";
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 200);
    });
    this.fallBackContentEditable();
    this.messageInputTarget.addEventListener(
      "blur",
      () => (bodyDataset["keyboard"] = "hidden")
    );

    this.userId = currentUserId();
  }

  fallBackContentEditable(): void {
    if (!this.messageInputTarget.isContentEditable) {
      this.messageInputTarget.contentEditable = "true";
    }
  }
  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      this.sendMessage();
    }
  }
  sendMessage(): void {
    const textAreaElement = this.messageInputTarget;
    const message = textAreaElement.innerText;
    textAreaElement.innerHTML = "";
    const isSameUser = this.userId === this.lastMessageFromUserId;

    if (message.length > 0) {
      postForm(`/${getChannelId()}/chat_messages`, {
        message,
      }).then((response: Response) => {
        response.json().then((data: JSON) => {
          const messageData = data["message"]["data"];
          displayChatMessage(messageData, isSameUser);
          this.lastMessageFromUserId = messageData.userId;
          this.toggleIcon();
        });
        console.log("CHAT Sent!");
      });
    }
  }
  toggleIcon(): void {
    const textAreaElement = this.messageInputTarget;
    const message = textAreaElement.innerText;
    if (message.trim() === "") {
      this.showReactionIcon();
    } else {
      this.showSendIcon();
    }
  }
  showSendIcon(): void {
    this.messageSendTarget.style.display = "block";
    this.messageReactionTarget.style.display = "none";
  }
  showReactionIcon(): void {
    this.messageSendTarget.style.display = "none";
    this.messageReactionTarget.style.display = "block";
  }
}
