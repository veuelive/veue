import { Controller } from "stimulus";

export default class extends Controller {
  element!: HTMLElement;

  private channelIconUpdateHandler: (event) => void;

  connect(): void {
    this.channelIconUpdateHandler = (event) => {
      this.element.outerHTML = event.detail.html;
    };

    document.addEventListener(
      this.element.dataset.channelId,
      this.channelIconUpdateHandler
    );
  }

  disconnect(): void {
    document.removeEventListener(
      this.element.dataset.channelId,
      this.channelIconUpdateHandler
    );
  }
}
