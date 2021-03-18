import { Controller } from "stimulus";
// import LiveEventManager from "helpers/event/live_event_manager";
import EventManagerInterface from "types/event_manager_interface";
import { postForm } from "util/fetch";

export default class extends Controller {
  private eventManager: EventManagerInterface;

  connect(): void {
    // this.eventManager = new LiveEventManager(true);
    postForm("./viewed", { minute: -1 });
  }

  disconnect(): void {
    // this.eventManager?.disconnect();
  }
}
