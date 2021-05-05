import { Controller } from "stimulus";
import { UploadIconEvent } from "./crop/channel_icon_controller";
import EventBus from "event_bus";

export default class extends Controller {
  private channelIconUpdateHandler: (payload) => void;

  connect(): void {
    this.channelIconUpdateHandler = (payload) => {
      if (payload.id === this.data.get("id")) {
        this.element.outerHTML = payload.html;
      }
    };

    EventBus.subscribe(UploadIconEvent, this.channelIconUpdateHandler);
  }

  disconnect(): void {
    EventBus.unsubscribe(UploadIconEvent, this.channelIconUpdateHandler);
  }
}
