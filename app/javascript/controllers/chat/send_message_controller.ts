import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { getChannelId } from "helpers/channel_helpers";
import { currentUserId } from "helpers/authentication_helpers";
import { displayChatMessage } from "helpers/chat_helpers";

export default class extends Controller {
  static targets = [
    "messageInput",
    "messageSend",
    "messageReaction",
    "linkShare",
  ];
  element: HTMLElement;
  private linkShareTarget!: HTMLElement;
  private messageInputTarget!: HTMLInputElement;
  private messageSendTarget!: HTMLDivElement;
  private messageReactionTarget!: HTMLDivElement;
  private lastMessageFromUserId: string;
  private userId: string;

  connect(): void {
    const bodyDataset = document.body.dataset;

    this.messageInputTarget.addEventListener(
      "focus",
      () => (bodyDataset["keyboard"] = "visible")
    );
    this.messageInputTarget.addEventListener(
      "blur",
      () => (bodyDataset["keyboard"] = "hidden")
    );
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
      this.showLinkShareIcon();
      this.showReactionIcon();
    } else {
      this.hideLinkShareIcon();
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

  hideLinkShareIcon(): void {
    this.linkShareTarget.style.display = "none";
  }

  showLinkShareIcon(): void {
    this.linkShareTarget.style.display = "flex";
  }

  private chatLimitExceeds(): boolean {
    const charactersLength = this.messageInputTarget.innerHTML.trim().length;
    return charactersLength > 182;
  }
}
