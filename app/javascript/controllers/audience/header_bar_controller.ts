import { Controller } from "stimulus";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";

export default class HeaderBarController extends Controller {
  static targets = ["addressInput"];
  private addressInputTarget!: HTMLElement;

  connect(): void {
    VideoEventProcessor.subscribeTo("BrowserNavigation", (event) => {
      console.log("HEADER BAR CONTROLLER");
      this.processNavigationEvent(event.detail.data);
    });
  }

  private processNavigationEvent(navigationUpdate: NavigationUpdate) {
    this.addressInputTarget.innerText = navigationUpdate.url;
  }
}
