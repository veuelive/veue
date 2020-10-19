import { postForm } from "util/fetch";
import BaseController from "./base_controller";
import { currentUserId } from "controllers/authentication_controller";

export default class extends BaseController {
  static targets = ["lastMessage", "messageInput"];

  connect(): void {
    this.showOrHideBasedOnLogin();
    this.subscribeToAuthChange();
  }

  authChanged(): void {
    this.showOrHideBasedOnLogin();
  }

  private showOrHideBasedOnLogin() {
    if (currentUserId() === undefined) {
      this.element.setAttribute("style", "display: none;");
    } else {
      this.element.setAttribute("style", "display: block;");
    }
  }

  chatBoxKeyDown(event: KeyboardEvent): void {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      const textAreaElement = event.target as HTMLTextAreaElement;
      const message = textAreaElement.value;
      textAreaElement.value = "";

      if (message.length > 0) {
        postForm("./chat_messages", { message }).then(() =>
          console.log("Sent!")
        );
      }
    }
  }
}
