import { Controller } from "stimulus";
import Hls from "hls.js";
import playSvg from "../images/play.svg";
import pauseSvg from "../images/pause.svg";
import { displayTime } from "util/time";
import TimecodeSynchronizer from "controllers/audience/timecode_synchronizer";
import VideoDemixer from "controllers/audience/video_demixer";
import { VideoEventProcessor } from "controllers/event/event_processor";
import EventManagerInterface from "controllers/event/event_manager_interface";
import VodEventManager from "controllers/event/vod_event_manager";
import LiveEventManager from "controllers/event/live_event_manager";

type StreamType = "live" | "vod";
export default class extends Controller {
  static targets = [
    "video",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "toggle",
    "timeDisplay",
  ];
  readonly toggleTarget!: HTMLElement;
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
    /*
      Due to the complexity of this page, do NOT try and setup anything until turbolinks is done.
     */
    if (document.documentElement.hasAttribute("data-turbolinks-preview")) {
      return;
    }

    this.streamType = this.data.get("stream-type") as StreamType;

    this.data.set("timecode", "-1");

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
      await this.togglePlay();
    });

    if (this.videoTarget.canPlayType("application/vnd.apple.mpegurl")) {
      this.videoTarget.src = this.data.get("url");
    } else if (Hls.isSupported()) {
      // HLS.js-specific setup code
      const hls = new Hls();
      hls.loadSource(this.data.get("url"));
      hls.attachMedia(this.videoTarget);
    }
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
          this.videoTarget.muted = true;
          this.videoTarget.play().then(() => (this.state = "playing"));
        });
    } else {
      this.videoTarget.pause();
      this.state = "paused";
    }
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
}
