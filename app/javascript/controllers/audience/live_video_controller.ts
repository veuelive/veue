import LiveEventManager from "helpers/event/live_event_manager";
import BaseController from "controllers/base_controller";

export default class extends BaseController {
  private eventManager: LiveEventManager;

  connect(): void {
    this.eventManager = new LiveEventManager(true);
  }

  disconnect() {}
}
