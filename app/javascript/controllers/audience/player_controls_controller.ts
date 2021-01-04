import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";

export default class extends BaseController {
  static targets = [
    "audienceView",
    "progressBar",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
  ];

  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;

  private pointerIsDown: boolean;
  private videoElement: HTMLVideoElement;

  connect(): void {
    // Access hidden video element
    this.videoElement = document.querySelector(".player__video");

    this.videoElement.addEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata.bind(this)
    );

    this.videoElement.addEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );
  }

  disconnect(): void {
    this.videoElement.removeEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );

    this.videoElement.removeEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata.bind(this)
    );
  }

  handleLoadedMetadata(): void {
    this.timeDurationTarget.innerHTML = displayTime(this.videoElement.duration);
  }

  handleTimeUpdate(): void {
    const progress = this.progressBarTarget;
    const video = this.videoElement;

    const width = Math.floor((video.currentTime / video.duration) * 100) + 1;
    progress.style.width = `${width}%`;
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
    this.videoElement
      .play()
      .then(() => (this.videoState = "playing"))
      .catch(() => {
        this.videoState = "paused";
        this.videoElement
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

    const currentTime = pos * this.videoElement.duration;

    this.timeDisplayTarget.innerHTML = displayTime(currentTime);
    this.videoElement.currentTime = currentTime;
    this.handleTimeUpdate();
  }

  set videoState(state: string) {
    this.data.set("state", state);
  }

  get videoState(): string {
    return this.data.get("state");
  }
}
