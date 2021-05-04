import { Controller } from "stimulus";
import { UploadIconEvent } from "./crop/channel_icon_controller";

export default class extends Controller {
  element!: HTMLElement;

  private channelIconUpdateHandler: (event) => void;

  connect(): void {
    this.channelIconUpdateHandler = (event) => {
      if (event.detail.id === this.data.get("id")) {
        this.element.outerHTML = event.detail.html;
      }
    };

    document.addEventListener(UploadIconEvent, this.channelIconUpdateHandler);
  }

  disconnect(): void {
    document.removeEventListener(
      UploadIconEvent,
      this.channelIconUpdateHandler
    );
  }
}
