import BaseController from "controllers/base_controller";
import { displayTime } from "util/time";
import { VideoSeekEvent } from "helpers/video_helpers";
import playSvg from "images/play.svg";
import pauseSvg from "images/pause.svg";
import mutedSvg from "images/volume-mute.svg";
import unmutedSvg from "images/volume-max.svg";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { trackEvent } from "helpers/event_tracking";

export default class extends BaseController {
  static targets = [
    "video",
    "videoPreviewContainer",
    "videoPreviewImage",
    "audienceView",
    "progressBar",
    "videoTarget",
    "muteBanner",
    "progressBarContainer",
    "progressBarButton",
    "timeDuration",
    "timeDisplay",
    "timePreview",
    "toggleAudio",
    "togglePlay",
    "badgeContainer",
    "videoContainer",
  ];

  readonly videoTarget!: HTMLVideoElement;
  readonly videoPreviewImageTarget!: HTMLImageElement;
  readonly videoPreviewContainerTarget!: HTMLDivElement;
  readonly timeDurationTarget!: HTMLElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly timePreviewTarget!: HTMLDivElement;
  readonly audienceViewTarget!: HTMLElement;
  readonly muteBannerTarget!: HTMLElement;
  readonly progressBarTarget!: HTMLElement;
  readonly progressBarContainerTarget!: HTMLElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;
  readonly togglePlayTargets!: HTMLElement[];
  readonly toggleAudioTargets!: HTMLElement[];
  readonly badgeContainerTarget!: HTMLElement;
  readonly videoContainerTarget!: HTMLElement;

  private pointerIsDown: boolean;
  private badgeTimeoutId: number;
  private videoTimeLastUpdatedAt: number;
  private tickTimeoutId: number;

  connect(): void {
    this.videoPlayerState = "not ready";
    this.badgeTimeoutId = -1;

    this.videoTarget.addEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata.bind(this)
    );

    this.videoTarget.addEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );

    this.tick();
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

    clearTimeout(this.tickTimeoutId);
  }

  toggleAudio(): void {
    this.audioState = this.audioState === "muted" ? "unmuted" : "muted";
  }

  togglePlay(): void {
    window.event.stopImmediatePropagation();

    if (this.state === "ended") {
      this.videoTarget.currentTime = 0;
    }

    if (this.state !== "playing") {
      this.videoTarget
        .play()
        .then(() => {
          this.state = "playing";
          if (
            this.videoPlayerState === "not ready" &&
            this.audioState !== "muted"
          ) {
            this.setBadgeState();
          }
        })
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

  setBadgeState(): void {
    this.videoPlayerState = "focused";
    this.setBadgeTimer();
  }

  showMuteBanner(): void {
    this.muteBannerTarget.style.display = "flex";
  }

  hideMuteBanner(): void {
    this.muteBannerTarget.style.display = "none";
    this.videoPlayerState = "unfocused";
  }

  setBadgeTimer(): void {
    if (this.videoPlayerState === "focused") {
      this.videoPlayerState = "unfocused";
      this.videoContainerTarget.classList.add("hide-controls");
      this.toggleStreamerProfile(false);

      this.badgeTimeoutId = window.setTimeout(
        this.hideBadges.bind(this),
        120000
      );
    } else if (this.videoPlayerState === "unfocused") {
      this.videoPlayerState = "focused";

      if (this.badgeTimeoutId > -1) {
        clearTimeout(this.badgeTimeoutId);
      }
      this.showBadges();
    }
  }

  hideBadges(): void {
    this.badgeContainerTarget.classList.add("hide-badges");
    this.badgeTimeoutId = -1;
  }

  showBadges(): void {
    this.badgeContainerTarget.classList.remove("hide-badges");
    this.videoContainerTarget.classList.remove("hide-controls");
    this.toggleStreamerProfile(true);
  }

  toggleStreamerProfile(display: boolean): void {
    document
      .querySelectorAll("*[data-show-when-video-focused]")
      .forEach((element: HTMLElement) => {
        display
          ? element.classList.remove("hide-element")
          : element.classList.add("hide-element");
      });
  }

  set state(state: string) {
    this.data.set("state", state);

    trackEvent("Player", "State Changed", state);

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

  set videoPlayerState(playerState: string) {
    this.data.set("videoPlayerState", playerState);
  }
  get videoPlayerState(): string {
    return this.data.get("videoPlayerState");
  }

  handleLoadedMetadata(): void {
    this.timeDurationTarget.dataset.duration = this.duration.toString();
    this.timeDurationTarget.innerHTML = displayTime(this.duration);

    if (this.element.dataset.audienceViewStreamType === "vod") {
      this.preloadPreviews();
    }

    this.togglePlay();
  }

  handleTimeUpdate(): void {
    const progress = this.progressBarTarget;
    const video = this.videoTarget;

    const width = Math.floor((video.currentTime / this.duration) * 100) + 1;
    progress.style.width = `${width}%`;
    this.videoTimeLastUpdatedAt = Date.now();

    if (video.currentTime >= this.duration) {
      video.dispatchEvent(new Event("ended"));
    }
  }

  async preloadPreviews(): Promise<void> {
    const urlPrefix = `${window.location.pathname}/snapshots`;
    const duration = Math.floor(this.duration / 30);

    for (let i = 0; i < duration; i++) {
      const img = new Image();
      img.src = `${urlPrefix}/${i}.jpg`;
      img.style.display = "none";
    }
  }

  handlePointerDown(event: PointerEvent): void {
    event.preventDefault();

    this.pointerIsDown = true;
    this.handlePointerLocation(event);
  }

  handlePointerMove(event: PointerEvent): void {
    event.preventDefault();

    this.displayPreview(event);

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

  handlePointerEnter(event: PointerEvent): void {
    event.preventDefault();

    this.displayPreview(event);
  }

  handlePointerLeave(event: PointerEvent): void {
    event.preventDefault();

    this.timePreviewTarget.style.display = "none";
    this.videoPreviewContainerTarget.style.display = "none";
  }

  displayPreview(event: PointerEvent): void {
    event.preventDefault();

    const currentTime = this.getPointerLocationTime(event);

    if (currentTime == null || currentTime < -1 || isNaN(currentTime)) {
      return;
    }

    this.displayTimeAndVideoPreviews(event, currentTime);

    const timecode = Math.floor(currentTime / 30);

    if (timecode >= 0) {
      this.videoPreviewImageTarget.src = `${window.location.pathname}/snapshots/${timecode}.jpg`;
    }

    this.videoPreviewImageTarget.style.display = "block";
  }

  handlePointerLocation(event: PointerEvent): void {
    const frameRect = this.progressBarContainerTarget.getBoundingClientRect();

    // find the offset of the progressbar and the actual X location of the event
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;

    const currentTime = pos * this.duration;

    this.updateVideoTime(event);
    const evt = new CustomEvent(VideoSeekEvent, {
      bubbles: true,
      detail: { timecodeMs: currentTime },
    });
    document.dispatchEvent(evt);
  }

  tick(): void {
    if (this.state === "playing") {
      const timeSinceLastUpdate = Date.now() - this.videoTimeLastUpdatedAt;
      if (timeSinceLastUpdate < 1000) {
        const timecodeMs = Math.floor(
          timeSinceLastUpdate + this.videoTarget.currentTime * 1000
        );
        globalThis.timecodeMs = timecodeMs;
        VideoEventProcessor.syncTime(timecodeMs);
        this.timeDisplayTarget.innerHTML = displayTime(timecodeMs / 1000);
        this.element.dataset.timecode = `${timecodeMs}`;
      }
    }
    this.tickTimeoutId = window.setTimeout(this.tick.bind(this), 200);
  }

  updateVideoTime(event: PointerEvent): void {
    const currentTime = this.getPointerLocationTime(event) || 0;
    this.timeDisplayTarget.innerHTML = displayTime(currentTime);
    this.videoTarget.currentTime = currentTime;
    this.videoTimeLastUpdatedAt = Date.now();
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
    const containerOffset =
      this.progressBarContainerTarget.getBoundingClientRect().x;
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
