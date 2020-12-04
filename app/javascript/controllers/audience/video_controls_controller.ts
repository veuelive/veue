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
  ];

  readonly timeDurationTarget!: HTMLElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;

  private mouseIsDown: boolean;

  connect(): void {
    this.videoTarget.addEventListener("loadedmetadata", async () => {
      this.progressBarTarget.dataset.duration = this.videoTarget.duration.toString();
    });

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
  }

  handleTimeUpdate(): void {
    const progress = this.progressBarTarget;
    const video = this.videoTarget;

    if (!progress.dataset.duration) {
      progress.dataset.duration = video.duration.toString();
    }

    if (!this.timeDurationTarget.dataset.duration) {
      this.timeDurationTarget.innerHTML = displayTime(video.duration);
    }

    const timecode = this.data.get("timecode");

    if (parseInt(timecode) >= 0) {
      progress.dataset.currentTime = timecode;
    }

    const width = Math.floor((video.currentTime / video.duration) * 100) + 1;
    progress.style.width = `${width}%`;
  }

  handleMouseDown(event: MouseEvent): void {
    event.preventDefault();

    this.mouseIsDown = true;

    if (this.videoState !== "paused") {
      this.videoTarget.pause();
    }

    this.handleMouseLocation(event);
  }

  handleMouseMove(event: MouseEvent): void {
    event.preventDefault();

    // The mouse has to be down for us to register a mousemove
    if (this.mouseIsDown !== true) {
      return;
    }

    this.handleMouseLocation(event);
    this.handleTimeUpdate();
  }

  handleMouseLocation(event: MouseEvent) {
    const frameRect = this.progressBarContainerTarget.getBoundingClientRect();
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;
    this.videoTarget.currentTime = pos * this.videoTarget.duration;
    this.progressBarTarget.dataset.currentTime = (
      pos * this.videoTarget.duration
    ).toString();
  }

  handleMouseUp(): void {
    this.mouseIsDown = false;

    if (this.videoState === "paused") {
      this.videoTarget.play();
    }
  }

  get videoState(): string {
    return this.data.get("state");
  }
}
