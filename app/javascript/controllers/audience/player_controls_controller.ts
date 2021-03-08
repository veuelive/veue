import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";

export default class extends BaseController {
  static targets = [
    "video",
    "audienceView",
    "progressBar",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
  ];

  readonly videoTarget!: HTMLVideoElement;
  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;

  private pointerIsDown: boolean;
  element!: HTMLElement;

  connect(): void {
    this.videoTarget.addEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata.bind(this)
    );

    this.videoTarget.addEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );
  }

  disconnect(): void {
    this.videoTarget.removeEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );

    this.videoTarget.removeEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata.bind(this)
    );
  }

  handleLoadedMetadata(): void {
    this.timeDurationTarget.dataset.duration = this.duration.toString();
    this.timeDurationTarget.innerHTML = displayTime(this.duration);
  }

  handleTimeUpdate(): void {
    const progress = this.progressBarTarget;
    const video = this.videoTarget;

    const width = Math.floor((video.currentTime / this.duration) * 100) + 1;
    progress.style.width = `${width}%`;

    if (video.currentTime >= this.duration) {
      video.dispatchEvent(new Event("ended"));
    }
  }

  handlePointerDown(event: PointerEvent): void {
    event.preventDefault();

    this.pointerIsDown = true;
    this.handlePointerLocation(event);
  }

  handlePointerMove(event: PointerEvent): void {
    event.preventDefault();

    // The pointer has to be down for us to register a pointermove
    if (this.pointerIsDown !== true) {
      return;
    }

    this.handlePointerLocation(event);
  }

  handlePointerUp(): void {
    this.pointerIsDown = false;

    if (this.videoState === "paused" || this.videoState == undefined) {
      return;
    }

    // Play the video
    this.videoTarget
      .play()
      .then(() => (this.videoState = "playing"))
      .catch(() => {
        this.videoState = "paused";
        this.videoTarget
          .play()
          .then(() => (this.videoState = "playing"))
          .catch((e) => {
            console.error(e);
          });
      });
  }

  handlePointerLocation(event: PointerEvent): void {
    const frameRect = this.progressBarContainerTarget.getBoundingClientRect();

    // find the offset of the progressbar and the actual X location of the event
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;

    const currentTime = pos * this.duration;

    this.timeDisplayTarget.innerHTML = displayTime(currentTime);
    this.videoTarget.currentTime = currentTime;
    this.handleTimeUpdate();
  }

  set videoState(state: string) {
    this.element.dataset.audienceViewState = state;
  }

  get videoState(): string {
    return this.element.dataset.audienceViewState;
  }

  get endOffset(): number {
    return parseInt(this.element.dataset.endOffset);
  }

  get duration(): number {
    return this.videoTarget.duration - this.endOffset;
  }
}
