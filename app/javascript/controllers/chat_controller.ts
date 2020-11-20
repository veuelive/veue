import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { currentUserId } from "helpers/authentication_helpers";
import { getCurrentVideoId } from "helpers/event/live_event_manager";

export default class extends Controller {
  static targets = ["messageInput"];
  private messageInputTarget!: HTMLTextAreaElement;

  connect(): void {
    const bodyDataset = document.body.dataset;
    this.messageInputTarget.addEventListener(
      "focusin",
      () => (bodyDataset["keyboard"] = "visible")
    );
    this.messageInputTarget.addEventListener(
      "focusout",
      () => (bodyDataset["keyboard"] = "hidden")
    );
  }

  private showOrHideBasedOnLogin() {
    (this.element as HTMLElement).hidden = currentUserId() === undefined;
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      const textAreaElement = event.target as HTMLTextAreaElement;
      const message = textAreaElement.value;
      textAreaElement.value = "";
      const videoId = getCurrentVideoId();
      if (message.length > 0) {
        postForm(`/videos/${videoId}/chat_messages`, { message }).then(() => {
          console.log("Chat Sent!");
        });
      }
    }
  }
}
