import { Controller } from "stimulus";
import Hls from "hls.js";
import playSvg from "../images/play.svg";
import pauseSvg from "../images/pause.svg";
import { displayTime } from "util/time";
import TimecodeSynchronizer from "controllers/audience/timecode_synchronizer";
import Sizes from "util/sizes";

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
  private primaryCtx: CanvasRenderingContext2D;
  private secondaryCtxs: Array<CanvasRenderingContext2D>;
  private timecodeSynchronizer: TimecodeSynchronizer;

  connect(): void {
    this.primaryCtx = this.primaryCanvasTarget.getContext("2d");
    this.secondaryCtxs = [
      this.fixedSecondaryCanvasTarget.getContext("2d"),
      this.pipSecondaryCanvasTarget.getContext("2d"),
    ];

    this.timecodeSynchronizer = new TimecodeSynchronizer(() => {
      this.timecodeChanged();
    });

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

    this.drawFrame();
  }

  togglePlay(): void {
    if (this.state !== "playing") {
      this.videoTarget
        .play()
        .then(() => (this.state = "playing"))
        .catch(() => (this.state = "paused"));
    } else {
      this.videoTarget.pause();
      this.state = "paused";
    }
  }

  timecodeChanged(): void {
    const percent = Math.round(
      (this.videoTarget.currentTime / this.videoTarget.duration) * 100
    );
    console.log(`${percent}%`);
    this.timeDisplayTarget.innerHTML = displayTime(
      this.timecodeSynchronizer.timecodeSeconds
    );
  }

  private drawFrame() {
    const browserCtx = this.primaryCtx;
    const fullVideoWidth = this.videoTarget.videoWidth;
    const fullVideoHeight = this.videoTarget.videoHeight;

    const sy =
      (Sizes.primaryView.height / Sizes.fullCanvas.height) * fullVideoHeight;

    const ratioToOriginal = fullVideoHeight / Sizes.fullCanvas.height;

    browserCtx.drawImage(
      this.videoTarget,
      0,
      0,
      fullVideoWidth,
      fullVideoHeight,
      0,
      0,
      Sizes.fullCanvas.width,
      Sizes.fullCanvas.height
    );
    for (const secondaryCtx of this.secondaryCtxs) {
      secondaryCtx.drawImage(
        this.videoTarget,
        0,
        sy,
        Sizes.secondaryView.width * ratioToOriginal,
        Sizes.secondaryView.height * ratioToOriginal,
        0,
        0,
        Sizes.secondaryView.width,
        Sizes.secondaryView.height
      );
    }

    this.timecodeSynchronizer.drawCanvas(this.videoTarget, ratioToOriginal);

    requestAnimationFrame(() => this.drawFrame());
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
    this.toggleTarget.innerHTML = `<img src=${imagePath} />`;
  }

  get state(): string {
    return this.data.get("state");
  }
}
