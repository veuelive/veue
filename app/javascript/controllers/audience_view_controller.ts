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

  connect() {
    this.isPaused = true;

    let url = `https://stream.mux.com/${this.data.get("playback-id")}.m3u8`;
    console.log(url);

    this.browserVideoCanvasContext = this.browserVideoCanvasTarget.getContext(
      "2d"
    );
    this.personVideoCanvasContext = this.personVideoCanvasTarget.getContext(
      "2d"
    );

    let hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(this.video);

    this.formSubmissionHandler();
  }

  timerCallback() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(() => {
      self.timerCallback();
    }, 16); // roughly 60 frames per second
  }

  togglePlay(event) {
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
    let browserCtx = this.browserVideoCanvasContext;
    let personCtx = this.personVideoCanvasContext;
    let fullVideoWidth = this.video.videoWidth;
    let fullVideoHeight = this.video.videoHeight;

    let sy = (1440 / 2048) * fullVideoHeight;

    let ratioToOriginal = fullVideoHeight / 2048;

    browserCtx.drawImage(
      this.video,
      0,
      0,
      fullVideoWidth,
      fullVideoHeight,
      0,
      0,
      2048,
      2048
    );
    personCtx.drawImage(
      this.video,
      0,
      sy,
      800 * ratioToOriginal,
      600 * ratioToOriginal,
      0,
      0,
      800,
      600
    );
    let frame = browserCtx.getImageData(0, 0, fullVideoWidth, fullVideoHeight);

    return;
  }

  formSubmissionHandler() {
    const formElement = document.querySelector("#new_chat_message");

    formElement.addEventListener("ajax:success", (event) => {
      const inputArea = document.getElementById(
        "chat_message_body"
      ) as HTMLInputElement;
      inputArea.value = "";
    });
  }

  get video() {
    return this.videoTarget;
  }
}
