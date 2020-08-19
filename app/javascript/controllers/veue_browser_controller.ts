import { Controller } from "stimulus";
import Hls from "hls.js";

export default class extends Controller {
  static targets = ["addressBar"];
  readonly addressBarTarget!: HTMLInputElement;
  secret: number;
  krangMessageCallback: EventListenerOrEventListenerObject;

  connect(): void {
    this.krangMessageCallback = (msg: MessageEvent) => {
      console.log("Got message", msg.data);
      const { type, event, secret } = msg.data;
      if (type === "veue") {
        switch (event) {
          // This comes after sending the activate
          case "awaiting_command":
            this.secret = secret;
            this.sendKrangToDimensionX();
        }
      }
    };
    // This sneaky bit of code uses a secret to send over some javascript
    // that will get evaluated! :O
    window.addEventListener("message", this.krangMessageCallback);
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
    console.log("Sending message: ", message);
    window.postMessage(message, window.location.origin);
  }
}
