import Hls from "hls.js";
import playSvg from "images/play.svg";
import pauseSvg from "images/pause.svg";
import mutedSvg from "images/muted.svg";
import unmutedSvg from "images/speaker.svg";
import { displayTime } from "util/time";
import TimecodeSynchronizer from "helpers/audience/timecode_synchronizer";
import VideoDemixer from "helpers/audience/video_demixer";
import { VideoEventProcessor } from "helpers/event/event_processor";
import EventManagerInterface from "types/event_manager_interface";
import VodEventManager from "helpers/event/vod_event_manager";
import LiveEventManager from "helpers/event/live_event_manager";
import BaseController from "controllers/base_controller";
import { startMuxData } from "controllers/audience/mux_integration";
import { isProduction } from "util/environment";
import { post } from "util/fetch";
import { BroadcastVideoLayout } from "types/video_layout";
import { DefaultVideoLayout } from "types/sizes";

type StreamType = "upcoming" | "live" | "vod";
export default class extends BaseController {
  static targets = [
    "video",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "toggle",
    "audio",
    "timeDisplay",
    "timeDuration",
    "progressBar",
    "progressBarBackground",
    "progressBarButton",
  ];
  readonly toggleTarget!: HTMLElement;
  readonly audioTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly fixedSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly pipSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly progressBarTarget!: HTMLSpanElement;
  readonly progressBarBackgroundTarget!: HTMLSpanElement;
  readonly progressBarButtonTarget!: HTMLButtonElement;
  readonly timeDurationTarget!: HTMLElement;

  private broadcastLayout: BroadcastVideoLayout;
  private timecodeSynchronizer: TimecodeSynchronizer;
  private streamType: StreamType;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;
  private mouseIsDown: boolean;

  connect(): void {
    this.broadcastLayout = DefaultVideoLayout;
    this.streamType = this.data.get("stream-type") as StreamType;

    this.data.set("timecode", "-1");

    if (isProduction()) {
      startMuxData();
    }

    this.timecodeSynchronizer = new TimecodeSynchronizer(
      this.broadcastLayout.timecode,
      () => {
        this.timecodeChanged();
      }
    );

    if (this.streamType !== "upcoming") {
      this.videoDemixer = new VideoDemixer(
        this.videoTarget,
        [
          [this.primaryCanvasTarget],
          [this.pipSecondaryCanvasTarget, this.fixedSecondaryCanvasTarget],
        ],
        this.timecodeSynchronizer,
        this.broadcastLayout
      );
    }

    if (this.streamType === "vod") {
      this.eventManager = new VodEventManager(0);
    } else {
      this.eventManager = new LiveEventManager(true);

      setInterval(() => {
        this.sendViewedMessage();
      }, 60 * 1000);
    }

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      this.state = "ready";
      const params = new URLSearchParams(window.location.search);
      if (params.has("t")) {
        this.videoTarget.currentTime = parseInt(params.get("t"));
      }

      this.progressBarTarget.dataset.duration = this.videoTarget.duration.toString();
      this.timeDurationTarget.innerHTML = displayTime(
        this.videoTarget.duration
      );
      this.togglePlay();
    });

    this.subscribeToAuthChange();

    if (!this.videoTarget.canPlayType("application/vnd.apple.mpegurl")) {
      const hlsSource = this.videoTarget.getAttribute("src");
      if (hlsSource) {
        // HLS.js-specific setup code
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(this.videoTarget);
      }
    }

    this.addProgressBarListeners();
  }

  authChanged(): void {
    this.sendViewedMessage();
  }

  sendViewedMessage(): void {
    post("./viewed").then(() => console.log("Updated Viewer Count"));
  }

  disconnect(): void {
    this.eventManager?.disconnect();
    this.removeProgressBarListeners();
  }

  togglePlay(): void {
    if (this.state !== "playing") {
      this.videoTarget
        .play()
        .then(() => (this.state = "playing"))
        .catch(() => {
          this.state = "paused";
          this.audioState = "muted";
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

  toggleAudio(): void {
    this.audioState = this.audioState === "muted" ? "unmuted" : "muted";
  }

  timecodeChanged(): void {
    if (this.streamType !== "upcoming") {
      this.data.set(
        "timecode",
        this.timecodeSynchronizer.timecodeMs.toString()
      );
      VideoEventProcessor.syncTime(this.timecodeSynchronizer.timecodeMs);
      this.timeDisplayTarget.innerHTML = displayTime(
        this.timecodeSynchronizer.timecodeSeconds
      );
    }
  }

  showChat(): void {
    this.element.className += " show-chat";
  }

  hideChat(): void {
    this.element.className = "content-area";
  }

  addProgressBarListeners(): void {
    this.videoTarget.addEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );

    this.progressBarBackgroundTarget.addEventListener(
      "mousedown",
      this.handleProgressBarMouseDown.bind(this),
      false
    );
    this.progressBarBackgroundTarget.addEventListener(
      "mouseup",
      this.handleProgressBarMouseUp.bind(this),
      false
    );
    this.progressBarBackgroundTarget.addEventListener(
      "mousemove",
      this.handleProgressBarMouseMove.bind(this),
      false
    );
  }

  removeProgressBarListeners(): void {
    this.videoTarget.removeEventListener(
      "timeupdate",
      this.handleTimeUpdate.bind(this)
    );

    this.progressBarBackgroundTarget.addEventListener(
      "mousedown",
      this.handleProgressBarMouseDown.bind(this),
      false
    );
    this.progressBarBackgroundTarget.addEventListener(
      "mouseup",
      this.handleProgressBarMouseUp.bind(this),
      false
    );
    this.progressBarBackgroundTarget.addEventListener(
      "mousemove",
      this.handleProgressBarMouseMove.bind(this),
      false
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

    if (this.timecodeSynchronizer.timecodeSeconds >= 0) {
      progress.dataset.currentTime = this.timecodeSynchronizer.timecodeSeconds.toString();
    }

    const width = Math.floor((video.currentTime / video.duration) * 100);
    this.progressBarButtonTarget.style.width = `${width + 3}%`;
    progress.style.width = `${width}%`;
  }

  handleProgressBarMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.mouseIsDown = true;

    if (this.state != "paused") {
      this.state = "paused";
      this.videoTarget.pause();
      return;
    }
  }

  handleProgressBarMouseMove(event: MouseEvent): void {
    event.preventDefault();
    if (this.mouseIsDown !== true) {
      return;
    }

    console.log("mouseMoving");
    const frameRect = this.progressBarBackgroundTarget.getBoundingClientRect();
    const x = event.clientX - frameRect.left;
    const pos = x / frameRect.width;
    console.log(pos);
    this.videoTarget.currentTime = pos * this.videoTarget.duration;
    this.progressBarTarget.dataset.currentTime = (
      pos * this.videoTarget.duration
    ).toString();
    this.handleTimeUpdate();
  }

  handleProgressBarMouseUp(event: MouseEvent): void {
    this.mouseIsDown = false;
    this.state = "playing";
    this.videoTarget.play();
  }

  set state(state: string) {
    this.data.set("state", state);

    const imagePath = this.state === "paused" ? playSvg : pauseSvg;
    this.toggleTarget.innerHTML = `<img src="${imagePath}"  alt="${this.state}"/>`;
  }

  get state(): string {
    return this.data.get("state");
  }

  set audioState(audioState: string) {
    this.data.set("audioState", audioState);
    this.videoTarget.muted = this.audioState === "muted";

    const imagePath = this.audioState === "muted" ? mutedSvg : unmutedSvg;
    this.audioTarget.innerHTML = `<img src="${imagePath}"  alt="${this.audioState}"/>`;
  }

  get audioState(): string {
    return this.data.get("audioState");
  }
}
