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
import { postForm } from "util/fetch";
import { BroadcastVideoLayout } from "types/video_layout";
import { VideoSeekEvent } from "helpers/video_helpers";

type StreamType = "upcoming" | "live" | "vod";
export default class extends BaseController {
  element: HTMLElement;

  static targets = [
    "video",
    "chat",
    "likeNotification",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "togglePlay",
    "toggleAudio",
    "timeDisplay",
    "timeDuration",
    "muteBanner",
  ];

  readonly togglePlayTargets!: HTMLElement[];
  readonly toggleAudioTargets!: HTMLElement[];
  readonly videoTarget!: HTMLVideoElement;
  readonly chatTarget!: HTMLElement;
  readonly likeNotificationTarget!: HTMLElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly fixedSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly pipSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;
  readonly timeDurationTarget!: HTMLElement;
  readonly muteBannerTarget!: HTMLElement;

  private broadcastLayout: BroadcastVideoLayout;
  private timecodeSynchronizer: TimecodeSynchronizer;
  private streamType: StreamType;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;
  private viewedPoller: number;

  connect(): void {
    this.streamType = this.data.get("stream-type") as StreamType;

    this.data.set("timecode", "-1");

    if (isProduction()) {
      startMuxData();
    }

    this.timecodeSynchronizer = new TimecodeSynchronizer(() => {
      this.timecodeChanged();
    });

    if (this.streamType === "vod") {
      this.eventManager = new VodEventManager(0);
    } else {
      this.eventManager = new LiveEventManager(true);
    }

    this.videoTarget.addEventListener(VideoSeekEvent, this.seekTo.bind(this));

    this.videoDemixer = new VideoDemixer(
      this.videoTarget,
      [
        [this.primaryCanvasTarget],
        [this.pipSecondaryCanvasTarget, this.fixedSecondaryCanvasTarget],
      ],
      this.timecodeSynchronizer
    );

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      this.state = "ready";
      const params = new URLSearchParams(window.location.search);

      let startTime: number;

      const requestedStartTime = parseInt(params.get("t"));

      if (requestedStartTime && requestedStartTime < this.duration) {
        startTime = requestedStartTime;
      } else {
        startTime = parseInt(this.element.dataset.startOffset);
      }

      this.videoTarget.currentTime = startTime;

      this.togglePlay();
    });

    this.videoTarget.addEventListener(
      "ended",
      this.handleVideoEnded.bind(this)
    );

    if (!this.videoTarget.canPlayType("application/vnd.apple.mpegurl")) {
      const hlsSource = this.videoTarget.getAttribute("src");
      if (hlsSource) {
        // HLS.js-specific setup code
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(this.videoTarget);
      }
    }

    this.viewedPoller = window.setInterval(() => {
      this.sendViewedMessage();
    }, 60 * 1000);

    this.subscribeToAuthChange();
  }

  authChanged(): void {
    this.sendViewedMessage();
  }

  // Every minute we should send a message updating the server on how far we've watched
  sendViewedMessage(): void {
    const minute = Math.ceil(this.videoTarget.currentTime / 60);
    postForm("./viewed", { minute });
  }

  disconnect(): void {
    this.eventManager?.disconnect();
    window.clearInterval(this.viewedPoller);

    this.videoTarget.removeEventListener(
      VideoSeekEvent,
      this.seekTo.bind(this)
    );

    this.videoTarget.removeEventListener(
      "ended",
      this.handleVideoEnded.bind(this)
    );
  }

  togglePlay(): void {
    if (this.state === "ended") {
      this.videoTarget.currentTime = 0;
      this.resetToTimecode(0);
    }

    if (this.state !== "playing") {
      this.sendViewedMessage();
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

  seekTo(event: CustomEvent): void {
    this.resetToTimecode(event.detail.timecodeMs);
  }

  resetToTimecode(timecodeMs: number): void {
    if (this.eventManager instanceof VodEventManager) {
      this.resetChat();
      VideoEventProcessor.clear();
      VideoEventProcessor.syncTime(timecodeMs);
      this.eventManager.seekTo(timecodeMs);
    }
  }

  resetChat(): void {
    this.chatTarget.innerHTML = "";
    this.likeNotificationTarget.innerHTML = "";
  }

  handleVideoEnded(): void {
    this.state = "ended";
    const streamType = this.data.get("stream-type") as StreamType;
    if (streamType === "live") {
      alert("This stream has ended");
      document.location.reload();
    } else {
      this.videoTarget.pause();
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

  get endOffset(): number {
    return parseInt(this.element.dataset.endOffset);
  }

  get duration(): number {
    return this.videoTarget.duration - this.endOffset;
  }
}
