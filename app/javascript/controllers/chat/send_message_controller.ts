import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { getChannelId } from "helpers/channel_helpers";
import { currentUserId } from "helpers/authentication_helpers";
import { displayChatMessage } from "helpers/chat_helpers";

export default class extends Controller {
  static targets = ["messageInput", "messageSend", "messageReaction"];
  element: HTMLElement;
  private messageInputTarget!: HTMLInputElement;
  private messageSendTarget!: HTMLDivElement;
  private messageReactionTarget!: HTMLDivElement;
  private lastMessageFromUserId: string;
  private userId: string;

  connect(): void {
    const bodyDataset = document.body.dataset;
    function updateView() {
      const primaryArea = document.getElementsByClassName(
        "content-area__primary"
      )[0] as HTMLElement;
      primaryArea.style.display = event.type === "focus" ? "none" : "block";
    }

    this.messageInputTarget.addEventListener("focus", updateView);
    this.messageInputTarget.addEventListener("blur", updateView);
    this.fallBackContentEditable();
    this.userId = currentUserId();
  }

  fallBackContentEditable(): void {
    if (!this.messageInputTarget.isContentEditable) {
      this.messageInputTarget.contentEditable = "true";
    }
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (this.chatLimitExceeds()) {
      event.preventDefault();
      return;
    }

    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const textAreaElement = this.messageInputTarget;
    const message = textAreaElement.innerText;
    const isSameUser = this.userId === this.lastMessageFromUserId;

    if (message.length > 0 && !this.chatLimitExceeds()) {
      textAreaElement.innerHTML = "";

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
    this.messageSendTarget.style.display = "flex";
    this.messageReactionTarget.style.display = "none";
  }

  showReactionIcon(): void {
    this.messageSendTarget.style.display = "none";
    if (document.querySelector("#broadcast")) {
      this.messageReactionTarget.style.display = "none";
    } else {
      this.messageReactionTarget.style.display = "flex";
    }
  }

  private chatLimitExceeds(): boolean {
    const charactersLength = this.messageInputTarget.innerHTML.trim().length;
    return charactersLength > 182;
  }
}
