import BaseController from "controllers/base_controller";
import VodEventManager from "helpers/event/vod_event_manager";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { VideoSeekEvent } from "helpers/video_helpers";

export default class extends BaseController {
  static targets = ["chat", "video", "likeNotification"];
  readonly chatTarget!: HTMLElement;
  readonly likeNotificationTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  private eventManager: VodEventManager;

  private boundUseStartOffset: EventListener;

  element!: HTMLElement;

  initialize(): void {
    this.boundUseStartOffset = this.useStartOffset.bind(this);
  }

  connect(): void {
    document.addEventListener(VideoSeekEvent, this.seekTo.bind(this));
    this.eventManager = new VodEventManager(0);

    this.videoTarget.addEventListener(
      "durationchange",
      this.boundUseStartOffset
    );
  }

  disconnect(): void {
    document.removeEventListener(VideoSeekEvent, this.seekTo.bind(this));
    this.videoTarget.removeEventListener(
      "durationchange",
      this.boundUseStartOffset
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

  useStartOffset(): void {
    const params = new URLSearchParams(window.location.search);

    let startOffset = parseInt(
      params.get("t") || this.element.dataset.startOffset
    );
    if (startOffset > this.videoTarget.duration) {
      startOffset = 0;
    }

    this.resetToTimecode(startOffset);
    this.videoTarget.currentTime = startOffset;
  }

  get endOffset(): number {
    return parseInt(this.element.dataset.endOffset);
  }

  get duration(): number {
    return this.videoTarget.duration - this.endOffset;
  }
}
