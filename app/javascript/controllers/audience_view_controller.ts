import { Controller } from "stimulus";
import Hls from "hls.js";
import playSvg from "../images/play.svg";
import pauseSvg from "../images/pause.svg";
import {displayTime} from "util/time";

export default class extends Controller {
  static targets = [
    "video",
    "primaryCanvas",
    "secondaryCanvas",
    "toggle",
    "timeDisplay",
  ];
  readonly toggleTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly secondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;
  private primaryCtx: CanvasRenderingContext2D;
  private secondaryCtx: CanvasRenderingContext2D;
  private isPaused: boolean;

  connect(): void {
    this.isPaused = true;

    this.primaryCtx = this.primaryCanvasTarget.getContext(
      "2d"
    );
    this.secondaryCtx = this.secondaryCanvasTarget.getContext(
      "2d"
    );

    this.videoTarget.addEventListener("loadedmetadata", async () => {
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
    if (this.isPaused) {
      this.videoTarget.play()
          .then(() => this.videoTarget.setAttribute("data-status", "playing"))
          .catch(() => this.videoTarget.setAttribute("data-status", "paused"));
    } else {
      this.videoTarget.pause();
    }

    this.isPaused = !this.isPaused;
    const imagePath = this.isPaused ? playSvg : pauseSvg;
    this.toggleTarget.innerHTML = `<img src=${imagePath} />`;
  }

  progressUpdate(): void {
    const percent =
      (this.videoTarget.currentTime / this.videoTarget.duration) * 100;
    console.log(`${percent}%`);
    this.timeDisplayTarget.innerHTML = displayTime(this.videoTarget.currentTime)
  }

  private drawFrame() {
    const browserCtx = this.primaryCtx;
    const personCtx = this.secondaryCtx;
    const fullVideoWidth = this.videoTarget.videoWidth;
    const fullVideoHeight = this.videoTarget.videoHeight;

    const sy = (800 / 1280) * fullVideoHeight;

    const ratioToOriginal = fullVideoHeight / 1280;

    browserCtx.drawImage(
      this.videoTarget,
      0,
      0,
      fullVideoWidth,
      fullVideoHeight,
      0,
      0,
      1280,
      1280
    );
    personCtx.drawImage(
      this.videoTarget,
      0,
      sy,
      640 * ratioToOriginal,
      480 * ratioToOriginal,
      0,
      0,
      640,
      480
    );

    requestAnimationFrame(() => this.drawFrame());
  }
}
