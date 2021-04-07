import BaseController from "controllers/base_controller";
import VodEventManager from "helpers/event/vod_event_manager";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { VideoSeekEvent } from "helpers/video_helpers";
<<<<<<< HEAD
=======
import Hls from "hls.js";
>>>>>>> Got VOD videos working again
import { VideoReadyEvent } from "controllers/audience/player_controls_controller";

export default class extends BaseController {
  static targets = ["chat", "video", "likeNotification"];
  readonly chatTarget!: HTMLElement;
  readonly likeNotificationTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  private eventManager: VodEventManager;

  element!: HTMLElement;

  connect(): void {
    this.videoTarget.addEventListener(VideoSeekEvent, this.seekTo.bind(this));
    this.eventManager = new VodEventManager(0);

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      const params = new URLSearchParams(window.location.search);

      let startTime: number;

      const requestedStartTime = parseInt(params.get("t"));

      if (requestedStartTime && requestedStartTime < this.duration) {
        startTime = requestedStartTime;
      } else {
        startTime = parseInt(this.element.dataset.startOffset);
      }

      this.videoTarget.currentTime = startTime;

      this.videoTarget.dispatchEvent(new CustomEvent(VideoReadyEvent));
    });

    if (!this.videoTarget.canPlayType("application/vnd.apple.mpegurl")) {
      const hlsSource = this.videoTarget.getAttribute("src");
      if (hlsSource) {
        // HLS.js-specific setup code
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(this.videoTarget);
      }
    }
  }

  disconnect(): void {
    this.videoTarget.removeEventListener(
      VideoSeekEvent,
      this.seekTo.bind(this)
    );
  }

  seekTo(event: CustomEvent): Promise<void> {
    return this.resetToTimecode(event.detail.timecodeMs);
  }

  resetToTimecode(timecodeMs: number): Promise<void> {
    this.resetChat();
    VideoEventProcessor.clear();
    return this.eventManager.seekTo(timecodeMs);
  }

  resetChat(): void {
    this.chatTarget.innerHTML = "";
    this.likeNotificationTarget.innerHTML = "";
  }

  get endOffset(): number {
    return parseInt(this.element.dataset.endOffset);
  }

  get duration(): number {
    return this.videoTarget.duration - this.endOffset;
  }
}
