import { Controller } from "stimulus";
import { ShowNotificationEvent } from "util/notifications";

export default class extends Controller {
  static targets = ["message"];
  element!: HTMLElement;
  readonly messageTarget!: HTMLElement;

  private notificationHandler: (event) => void;

  connect(): void {
    this.notificationHandler = (event) => {
      this.messageTarget.innerText = event.detail.message;
      this.element.style.display = "block";

      setTimeout(() => {
        this.messageTarget.innerText = "";
        this.element.style.display = "none";
      }, 1500);
    };

    document.addEventListener(ShowNotificationEvent, this.notificationHandler);
  }

  disconnect(): void {
    document.removeEventListener(
      ShowNotificationEvent,
      this.notificationHandler
    );
  }
}
