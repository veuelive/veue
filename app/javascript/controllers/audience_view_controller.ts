import Hls from "hls.js";
import playSvg from "images/play.svg";
import pauseSvg from "images/pause.svg";
import mutedSvg from "images/volume-mute.svg";
import unmutedSvg from "images/volume-max.svg";
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
    "togglePlay",
    "toggleAudio",
    "timeDisplay",
    "timeDuration",
  ];
  readonly togglePlayTargets!: HTMLElement[];
  readonly toggleAudioTargets!: HTMLElement[];
  readonly videoTarget!: HTMLVideoElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly fixedSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly pipSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly timeDurationTarget!: HTMLElement;

  private broadcastLayout: BroadcastVideoLayout;
  private timecodeSynchronizer: TimecodeSynchronizer;
  private streamType: StreamType;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;

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
  }

  authChanged(): void {
    this.sendViewedMessage();
  }

  sendViewedMessage(): void {
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
    if (this.streamType !== "upcoming") {
      this.data.set(
        "timecode",
        this.timecodeSynchronizer.timecodeMs.toString()
      );
      VideoEventProcessor.syncTime(this.timecodeSynchronizer.timecodeMs);

      const seconds = this.timecodeSynchronizer.timecodeSeconds;
      this.timeDisplayTarget.innerHTML = displayTime(seconds);
    }
  }

  showChat(): void {
    this.element.className += " show-chat";
  }

  hideChat(): void {
    this.element.className = "content-area";
  }

  set state(state: string) {
    this.data.set("state", state);

    const toggleTo = this.state === "paused" ? "play" : "pause";
    const imagePath = this.state === "paused" ? playSvg : pauseSvg;

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
}
