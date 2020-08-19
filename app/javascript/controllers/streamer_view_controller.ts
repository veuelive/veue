import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["webcamVideoTag", "webcamCanvas"];
  readonly webcamVideoTagTarget!: HTMLVideoElement;
  readonly webcamCanvasTarget!: HTMLCanvasElement;

  private webcamCanvasContext: CanvasRenderingContext2D;

  connect(): void {
    this.webcamCanvasContext = this.webcamCanvasTarget.getContext("2d");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.webcamVideoTagTarget.srcObject = stream;
        this.webcamVideoTagTarget.onloadedmetadata = () => {
          this.webcamVideoTagTarget.play().then(() => this.timerCallback());
        };
      });

    window.postMessage(
      {
        type: "veue",
        action: "inject",
        krang: this.data.get("krang-js-path"),
        tox_path: this.data.get("tox-js-path"),
      },
      "*"
    );
  }

  timerCallback(): void {
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 16); // roughly 60 frames per second
  }

  computeFrame(): void {
    this.webcamCanvasContext.drawImage(
      this.webcamVideoTagTarget,
      0,
      0,
      this.webcamVideoTagTarget.width,
      this.webcamVideoTagTarget.height
    );
  }
}
