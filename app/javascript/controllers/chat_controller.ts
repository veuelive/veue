import { postForm } from "util/fetch";
import { Controller } from "stimulus";
import { currentUserId } from "controllers/authentication_controller";
import { getCurrentVideoId } from "helpers/event/live_event_manager";

export default class extends Controller {
  static targets = ["lastMessage", "messageInput"];

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
        postForm(`/videos/${videoId}/chat_messages`, { message }).then(() =>
          console.log("Sent!")
        );
      }
    }
  }
}
