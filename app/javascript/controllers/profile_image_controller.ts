import { Controller } from "stimulus";
import { UploadImageEvent } from "./crop_image_controller";
import EventBus from "event_bus";

export default class extends Controller {
  declare element: HTMLElement;

  private profileImageUpdateHandler: (event) => void;

  connect(): void {
    this.profileImageUpdateHandler = (payload) => {
      this.element.outerHTML = payload.html;
    };

    EventBus.subscribe(UploadImageEvent, this.profileImageUpdateHandler);
  }

  disconnect(): void {
    document.removeEventListener(
      UploadImageEvent,
      this.profileImageUpdateHandler
    );
  }
}
