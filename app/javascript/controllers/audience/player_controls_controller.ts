import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";
import { VideoSeekEvent } from "helpers/video_helpers";
import { secureFetch } from "util/fetch";

export default class extends BaseController {
  static targets = [
    "video",
    "videoPreviewContainer",
    "videoPreviewImage",
    "audienceView",
    "progressBar",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
    "timePreview",
  ];

  readonly videoTarget!: HTMLVideoElement;
  readonly videoPreviewImageTarget!: HTMLImageElement;
  readonly videoPreviewContainerTarget!: HTMLDivElement;
  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly timePreviewTarget!: HTMLDivElement;
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

  displayPreview(event: PointerEvent): void {
    event.preventDefault();

    const currentTime = this.getPointerLocationTime(event);

    if (currentTime == null || currentTime < -1) {
      return;
    }

    window.requestAnimationFrame(async () => {
      this.displayTimeAndVideoPreviews(event, currentTime);
      await this.displaySnapshot(currentTime);
    });
  }

  handlePointerEnter(event: PointerEvent) {
    event.preventDefault();

    this.displayPreview(event);
  }

  handlePointerLeave(event: PointerEvent) {
    event.preventDefault();

    this.timePreviewTarget.style.display = "none";
    this.videoPreviewContainerTarget.style.display = "none";
  }

  handlePointerDown(event: PointerEvent): void {
    event.preventDefault();

    this.pointerIsDown = true;
    this.updateVideoTime(event);
  }

  handlePointerMove(event: PointerEvent): void {
    event.preventDefault();

    this.displayPreview(event);

    // The pointer has to be held down for us to update the video time
    if (this.pointerIsDown !== true) {
      return;
    }

    this.updateVideoTime(event);
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

  updateVideoTime(event: PointerEvent): void {
    const currentTime = this.getPointerLocationTime(event);
    this.timeDisplayTarget.innerHTML = displayTime(currentTime);
    this.videoTarget.currentTime = currentTime;
    this.handleTimeUpdate();
  }

  getPointerLocationTime(event: PointerEvent): number {
    const frameRect = this.progressBarContainerTarget.getBoundingClientRect();

    // find the offset of the progressbar and the actual X location of the event
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;
    return pos * this.duration;
  }

  private displayTimeAndVideoPreviews(
    event: PointerEvent,
    currentTime: number
  ): void {
    const containerOffset = this.progressBarContainerTarget.getBoundingClientRect()
      .x;
    const timePreviewOffset =
      this.timePreviewTarget.getBoundingClientRect().width / 2;

    const x = event.clientX - containerOffset;
    const timePreviewX = x - timePreviewOffset;
    this.timePreviewTarget.style.transform = `translate(${timePreviewX}px, -100%)`;
    this.timePreviewTarget.innerText = displayTime(currentTime);
    this.timePreviewTarget.style.display = "block";

    const videoPreviewOffset =
      this.videoPreviewContainerTarget.getBoundingClientRect().width / 2;
    const videoPreviewX = x - videoPreviewOffset;

    this.videoPreviewContainerTarget.style.transform = `translate(${videoPreviewX}px, -100%)`;
    this.videoPreviewContainerTarget.style.display = "block";
  }

  private async displaySnapshot(timecode: number) {
    try {
      const response = await secureFetch(
        `${document.location.pathname}/snapshots/find?t=${Math.floor(
          timecode
        )}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.url != null) {
          this.videoPreviewImageTarget.src = data.url;
          this.videoPreviewImageTarget.style.display = "block";
          this.videoPreviewImageTarget.dataset.id = data.id;
        }
      }
    } catch (err) {
      console.warn(err);
    }
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
