import { Controller } from "stimulus";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { showHideWhenLive } from "helpers/video_helpers";
import { VideoState } from "types/video_state";

export default class HeaderBarController extends Controller {
  static targets = ["addressInput"];
  private addressInputTarget!: HTMLElement;

  connect(): void {
    VideoEventProcessor.subscribeTo("BrowserNavigation", (event) => {
      this.processNavigationEvent(event.detail.data);
    });
    showHideWhenLive();
    document.addEventListener("BroadcastFinished", (event: CustomEvent) => {
      this.processStateChange(event.detail);
    });
  }

  private processNavigationEvent(navigationUpdate: NavigationUpdate) {
    this.addressInputTarget.innerText = navigationUpdate.url;
  }

  private processStateChange(videoState: VideoState) {
    if (videoState?.state === "finished") {
      showHideWhenLive();
    }
  }
}
