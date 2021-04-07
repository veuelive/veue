import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";
import { VideoSeekEvent } from "helpers/video_helpers";
import playSvg from "images/play.svg";
import pauseSvg from "images/pause.svg";
import mutedSvg from "images/volume-mute.svg";
import unmutedSvg from "images/volume-max.svg";

export const VideoReadyEvent = "videoReadyEvent";

export default class extends BaseController {
  static targets = [
    "video",
    "audienceView",
    "progressBar",
    "videoTarget",
    "muteBanner",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
    "toggleAudio",
    "togglePlay",
  ];

  readonly videoTarget!: HTMLVideoElement;
  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly muteBannerTarget!: HTMLElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;
  readonly togglePlayTargets!: HTMLElement[];
  readonly toggleAudioTargets!: HTMLElement[];

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

    this.videoTarget.addEventListener(
      VideoReadyEvent,
      this.togglePlay.bind(this)
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

    this.videoTarget.removeEventListener(
      VideoReadyEvent,
      this.togglePlay.bind(this)
    );
  }

  toggleAudio(): void {
    this.audioState = this.audioState === "muted" ? "unmuted" : "muted";
  }

  togglePlay(): void {
    if (this.state === "ended") {
      this.videoTarget.currentTime = 0;
    }

    if (this.state !== "playing") {
      this.videoTarget
        .play()
        .then(() => (this.state = "playing"))
        .catch(() => {
          this.state = "paused";
          this.audioState = "muted";
          this.showMuteBanner();
          this.videoTarget
            .play()
            .then(() => (this.state = "playing"))
            .catch((e) => {
              console.error(e);
            });
        });
    } else {
      this.videoTarget.pause();
      this.state = "paused";
    }
  }

  showMuteBanner(): void {
    this.muteBannerTarget.style.display = "flex";
  }

  hideMuteBanner(): void {
    this.muteBannerTarget.style.display = "none";
  }

  set state(state: string) {
    this.data.set("state", state);

    const pausedStates = ["paused", "ended"];

    const toggleTo = pausedStates.includes(this.state) ? "play" : "pause";
    const imagePath = pausedStates.includes(this.state) ? playSvg : pauseSvg;

    this.togglePlayTargets.forEach((playElement) => {
      // Allows for styling of the play button due to appearing off-center
      if (toggleTo === "play") {
        playElement.classList.add("play");
      } else {
        playElement.classList.remove("play");
      }
      playElement.innerHTML = `<img src="${imagePath}" alt="${toggleTo}" />`;
    });
  }

  get state(): string {
    return this.data.get("state");
  }

  set audioState(audioState: string) {
    this.data.set("audioState", audioState);

    let imagePath: string;
    let toggleTo: "mute" | "unmute";

    if (this.audioState === "muted") {
      imagePath = mutedSvg;
      toggleTo = "unmute";
      this.videoTarget.muted = true;
    } else {
      imagePath = unmutedSvg;
      toggleTo = "mute";
      this.videoTarget.muted = false;
    }

    this.toggleAudioTargets.forEach((audioElement) => {
      audioElement.innerHTML = `<img src="${imagePath}"  alt="${toggleTo}" />`;
    });
  }

  get audioState(): string {
    return this.data.get("audioState");
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
    const evt = new CustomEvent(VideoSeekEvent, {
      bubbles: true,
      detail: { timecodeMs: currentTime },
    });
    this.videoTarget.dispatchEvent(evt);
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
