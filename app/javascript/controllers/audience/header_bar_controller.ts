import { Controller } from "stimulus";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { showHideWhenLive } from "helpers/video_helpers";
import { StreamTypeChangedEvent } from "../audience_view_controller";

export default class HeaderBarController extends Controller {
  static targets = ["addressInput"];
  private addressInputTarget!: HTMLElement;

  connect(): void {
    VideoEventProcessor.subscribeTo("BrowserNavigation", (event) => {
      this.processNavigationEvent(event.detail.data);
    });

    showHideWhenLive();
    document.addEventListener(StreamTypeChangedEvent, () => {
      showHideWhenLive();
    });
  }

  private processNavigationEvent(navigationUpdate: NavigationUpdate) {
    this.addressInputTarget.innerText = navigationUpdate.url;
  }
}
