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

type StreamType = "live" | "vod";
export default class extends BaseController {
  static targets = [
    "video",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "toggle",
    "audio",
    "timeDisplay",
  ];
  readonly toggleTarget!: HTMLElement;
  readonly audioTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly fixedSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly pipSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;

  private timecodeSynchronizer: TimecodeSynchronizer;
  private streamType: StreamType;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;

  connect(): void {
    this.streamType = this.data.get("stream-type") as StreamType;

    this.data.set("timecode", "-1");

    if (isProduction()) {
      startMuxData();
    }

    this.timecodeSynchronizer = new TimecodeSynchronizer(() => {
      this.timecodeChanged();
    });

    this.videoDemixer = new VideoDemixer(
      this.videoTarget,
      this.primaryCanvasTarget,
      [this.pipSecondaryCanvasTarget, this.fixedSecondaryCanvasTarget],
      this.timecodeSynchronizer
    );

    if (this.streamType === "vod") {
      this.eventManager = new VodEventManager(0);
    } else {
      this.eventManager = new LiveEventManager();
    }

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      this.state = "ready";
      const params = new URLSearchParams(window.location.search);
      if (params.has("t")) {
        this.videoTarget.currentTime = parseInt(params.get("t"));
      }
      await this.togglePlay();
    });

    this.subscribeToAuthChange();

    if (!this.videoTarget.canPlayType("application/vnd.apple.mpegurl")) {
      // } else if (Hls.isSupported()) {
      const hlsSource = this.videoTarget.getAttribute("src");
      if (hlsSource) {
        // HLS.js-specific setup code
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(this.videoTarget);
      }
    }
  }

  authChanged(): void {
    post("./viewed").then(() => console.log("Updated Viewer Count"));
  }

  disconnect(): void {
    this.eventManager?.disconnect();
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
    this.data.set("timecode", this.timecodeSynchronizer.timecodeMs.toString());
    VideoEventProcessor.syncTime(this.timecodeSynchronizer.timecodeMs);
    this.timeDisplayTarget.innerHTML = displayTime(
      this.timecodeSynchronizer.timecodeSeconds
    );
  }

  showChat(): void {
    this.element.className += " show-chat";
  }

  hideChat(): void {
    this.element.className = "content-area";
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
