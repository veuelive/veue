import { Controller } from "stimulus";
import { UploadChannelIconEvent } from "./crop_image_controller";

export default class extends Controller {
  element!: HTMLElement;

  private channelIconUpdateHandler: (event) => void;

  connect(): void {
    this.channelIconUpdateHandler = (event) => {
      this.element.outerHTML = event.detail.html;
    };

    document.addEventListener(
      UploadChannelIconEvent,
      this.channelIconUpdateHandler
    );
  }

  disconnect(): void {
    document.removeEventListener(
      UploadChannelIconEvent,
      this.channelIconUpdateHandler
    );
  }
}
