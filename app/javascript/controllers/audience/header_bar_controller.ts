import { Controller } from "stimulus";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { VideoEventProcessor } from "controllers/event/event_processor";

export default class HeaderBarController extends Controller {
  static targets = ["addressInput"];
  private addressInputTarget!: HTMLInputElement;

  connect(): void {
    VideoEventProcessor.subscribeTo("BrowserNavigation", (event) => {
      this.processNavigationEvent(event.detail.data);
    });
  }

  private processNavigationEvent(navigationUpdate: NavigationUpdate) {
    this.addressInputTarget.value = navigationUpdate.url;
  }
}
