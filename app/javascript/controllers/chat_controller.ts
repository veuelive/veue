import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { getCurrentVideoId } from "helpers/event/live_event_manager";

export default class extends Controller {
  static targets = ["messageInput"];
  private messageInputTarget!: HTMLElement;

  connect(): void {
    const bodyDataset = document.body.dataset;
    this.messageInputTarget.addEventListener("focus", () => {
      bodyDataset["keyboard"] = "visible";
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 200);
    });
    this.messageInputTarget.addEventListener(
      "blur",
      () => (bodyDataset["keyboard"] = "hidden")
    );
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      const textAreaElement = event.target as HTMLElement;
      const message = textAreaElement.innerHTML;
      textAreaElement.innerHTML = "";
      const videoId = getCurrentVideoId();
      if (message.length > 0) {
        postForm(`/videos/${videoId}/chat_messages`, { message }).then(() => {
          console.log("CHAT Sent!");
        });
      }
    }
  }
}
