import { Controller } from "stimulus";
import { UploadImageEvent } from "./crop_image_controller";

export default class extends Controller {
  element!: HTMLElement;

  private profileImageUpdateHandler: (event) => void;

  connect(): void {
    this.profileImageUpdateHandler = (event) => {
      this.element.outerHTML = event.detail.html;
    };

    document.addEventListener(UploadImageEvent, this.profileImageUpdateHandler);
  }

  disconnect(): void {
    document.removeEventListener(
      UploadImageEvent,
      this.profileImageUpdateHandler
    );
  }
}
