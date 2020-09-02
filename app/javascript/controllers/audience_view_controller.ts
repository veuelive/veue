import { Controller } from "stimulus";
import Hls from "hls.js";

export default class extends Controller {
  static targets = [
    "video",
    "browserVideoCanvas",
    "personVideoCanvas",
    "toggle",
    // "progressBar",
    // "progress",
    // "progressTarget"
  ];
  readonly toggleTarget!: HTMLElement;
  // readonly progressBarTarget!: HTMLElement;
  readonly videoTarget!: HTMLVideoElement;
  readonly browserVideoCanvasTarget!: HTMLCanvasElement;
  readonly personVideoCanvasTarget!: HTMLCanvasElement;
  // readonly progressTarget!: HTMLElement;
  private browserVideoCanvasContext: CanvasRenderingContext2D;
  private personVideoCanvasContext: CanvasRenderingContext2D;
  private isPaused: boolean;

  connect(): void {
    this.isPaused = true;

    const url = `https://stream.mux.com/${this.data.get("playback-id")}.m3u8`;
    console.log(url);

    this.browserVideoCanvasContext = this.browserVideoCanvasTarget.getContext(
      "2d"
    );
    this.personVideoCanvasContext = this.personVideoCanvasTarget.getContext(
      "2d"
    );

    this.videoTarget.addEventListener("loadedmetadata", async () => {
      await this.videoTarget.play();
    });

    const hls = new Hls({
      liveMaxLatencyDurationCount: 10,
    });
    hls.loadSource(url);
    hls.attachMedia(this.video);
  }

  private timerCallback() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 16); // roughly 60 frames per second
  }

  togglePlay(): void {
    if (this.isPaused) {
      this.video.play().then(() => this.timerCallback());
    } else {
      this.video.pause();
    }

    this.isPaused = !this.isPaused;

    this.toggleTarget.textContent = this.isPaused ? "►" : "❚ ❚";
  }

  videoLoaded() {
    this.computeFrame();
  }

  progressUpdate(event) {
    const percent = (this.video.currentTime / this.video.duration) * 100;
    console.log(`${percent}%`);
  }

  computeFrame() {
    const browserCtx = this.browserVideoCanvasContext;
    const personCtx = this.personVideoCanvasContext;
    const fullVideoWidth = this.video.videoWidth;
    const fullVideoHeight = this.video.videoHeight;

    const sy = (800 / 1280) * fullVideoHeight;

    const ratioToOriginal = fullVideoHeight / 1280;

    browserCtx.drawImage(
      this.video,
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
      this.video,
      0,
      sy,
      640 * ratioToOriginal,
      480 * ratioToOriginal,
      0,
      0,
      640,
      480
    );
    const frame = browserCtx.getImageData(
      0,
      0,
      fullVideoWidth,
      fullVideoHeight
    );

    return;
  }

  get video() {
    return this.videoTarget;
  }
}
