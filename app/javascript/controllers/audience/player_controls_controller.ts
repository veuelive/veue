import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";

export default class extends BaseController {
  static targets = [
    "audienceView",
    "video",
    "progressBar",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
  ];

  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;

  private mouseIsDown: boolean;

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
    this.timeDurationTarget.innerHTML = displayTime(this.videoTarget.duration);
  }

  handleTimeUpdate(): void {
    const progress = this.progressBarTarget;
    const video = this.videoTarget;

    const width = Math.floor((video.currentTime / video.duration) * 100) + 1;
    progress.style.width = `${width}%`;
  }

  handleMouseDown(event: MouseEvent): void {
    event.preventDefault();

    this.mouseIsDown = true;
    this.handleMouseLocation(event);
  }

  handleMouseMove(event: MouseEvent): void {
    event.preventDefault();

    // The mouse has to be down for us to register a mousemove
    if (this.mouseIsDown !== true) {
      return;
    }

    this.handleMouseLocation(event);
  }

  handleMouseUp(): void {
    this.mouseIsDown = false;

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

  handleMouseLocation(event: MouseEvent): void {
    const frameRect = this.progressBarContainerTarget.getBoundingClientRect();

    // find the offset of the progressbar and the actual X location of the event
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;

    const currentTime = pos * this.videoTarget.duration;

    this.timeDisplayTarget.innerHTML = displayTime(currentTime);
    this.videoTarget.currentTime = currentTime;
    this.handleTimeUpdate();
  }

  set videoState(state: string) {
    this.data.set("state", state);
  }

  get videoState(): string {
    return this.data.get("state");
  }
}
