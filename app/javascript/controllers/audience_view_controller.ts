import { Controller } from "stimulus";
import Hls from "hls.js";
import playSvg from "../images/play.svg";
import pauseSvg from "../images/pause.svg";
import { displayTime } from "util/time";

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

  connect(): void {
    this.primaryCtx = this.primaryCanvasTarget.getContext("2d");
    this.secondaryCtxs = [
      this.fixedSecondaryCanvasTarget.getContext("2d"),
      this.pipSecondaryCanvasTarget.getContext("2d"),
    ];

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      this.state = "ready";
      await this.togglePlay();
    });

    const hls = new Hls({
      liveMaxLatencyDurationCount: 15,
    });
    hls.loadSource(this.data.get("url"));
    hls.attachMedia(this.videoTarget);

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

  progressUpdate(): void {
    const percent =
      (this.videoTarget.currentTime / this.videoTarget.duration) * 100;
    console.log(`${percent}%`);
    this.timeDisplayTarget.innerHTML = displayTime(
      this.videoTarget.currentTime
    );
  }

  private drawFrame() {
    const browserCtx = this.primaryCtx;
    const fullVideoWidth = this.videoTarget.videoWidth;
    const fullVideoHeight = this.videoTarget.videoHeight;

    const sy = (800 / 1080) * fullVideoHeight;

    const ratioToOriginal = fullVideoHeight / 1080;

    browserCtx.drawImage(
      this.videoTarget,
      0,
      0,
      fullVideoWidth,
      fullVideoHeight,
      0,
      0,
      1280,
      1080
    );
    for (const secondaryCtx of this.secondaryCtxs) {
      secondaryCtx.drawImage(
        this.videoTarget,
        0,
        sy,
        320 * ratioToOriginal,
        280 * ratioToOriginal,
        0,
        0,
        320,
        280
      );
    }

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
