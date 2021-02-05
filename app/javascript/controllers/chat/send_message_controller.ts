import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { getChannelId } from "helpers/channel_helpers";
import { currentUserId } from "helpers/authentication_helpers";
import { displayChatMessage } from "helpers/chat_helpers";
import { showHideWhenLive } from "helpers/video_helpers";
import { StreamTypeChangedEvent } from "../audience_view_controller";

export default class extends Controller {
  static targets = ["messageInput"];

  element: HTMLElement;
  private messageInputTarget!: HTMLElement;
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

    showHideWhenLive();
    document.addEventListener(StreamTypeChangedEvent, () => {
      showHideWhenLive();
    });
  }

  fallBackContentEditable(): void {
    if (!this.messageInputTarget.isContentEditable) {
      this.messageInputTarget.contentEditable = "true";
    }
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      const textAreaElement = event.target as HTMLElement;
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
          });
          console.log("CHAT Sent!");
        });
      }
    }
  }
}
