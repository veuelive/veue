import { Controller } from "stimulus";
import Hls from "hls.js";

export default class extends Controller {
  static targets = ["addressBar", "canvas"];
  readonly addressBarTarget!: HTMLInputElement;
  readonly canvasTarget!: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  secret: number;
  krangMessageCallback: EventListenerOrEventListenerObject;

  connect(): void {
    this.krangMessageCallback = (msg: MessageEvent) => {
      const { type, event, secret } = msg.data;
      switch (type) {
        case "veue":
          switch (event) {
            // This comes after sending the activate
            case "awaiting_command":
              this.secret = secret;
              this.sendKrangToDimensionX();
          }
          break;
        case "krang":
          this.paintFrame(msg.data);
      }
    };
    // This sneaky bit of code uses a secret to send over some javascript
    // that will get evaluated! :O
    window.addEventListener("message", this.krangMessageCallback);
    this.canvasCtx = this.canvasTarget.getContext("2d");
    console.log("Ready to listen!");
  }

  disconnect(): void {
    window.removeEventListener("message", this.krangMessageCallback);
  }

  refresh(): void {
    this.sendMessageToKrang("refresh");
  }

  addressChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.sendMessageToKrang("go", target.value);
  }

  private sendKrangToDimensionX() {
    this.sendMessageToKrang("awaken", {
      krangPath: this.data.get("krang"),
      technodromePath: this.data.get("technodrome"),
    });
  }

  private sendMessageToKrang(event, payload?) {
    const message = {
      type: "veue",
      event: event,
      secret: this.secret,
      payload: payload,
    };
    window.postMessage(message, window.location.origin);
  }

  private paintFrame(data: { frame: string; width: number; height: number }) {
    const imageObj = new Image();
    console.log(data);
    imageObj.onload = () => {
      this.canvasTarget.width = data.width;
      this.canvasTarget.height = data.height;
      this.canvasCtx.drawImage(imageObj, 0, 0);
    };
    imageObj.src = data.frame;
  }
}
