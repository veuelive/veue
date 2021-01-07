import { Controller } from "stimulus";
import LiveEventManager from "helpers/event/live_event_manager";
import EventManagerInterface from "types/event_manager_interface";

export default class extends Controller {
  private eventManager: EventManagerInterface;

  connect(): void {
    this.eventManager = new LiveEventManager(true);
  }

  disconnect(): void {
    this.eventManager?.disconnect();
  }
}
