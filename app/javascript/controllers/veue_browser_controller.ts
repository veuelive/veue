import { Controller } from "stimulus";
import Hls from "hls.js";

export default class extends Controller {
  static targets = ["iframe", "addressBar"];
  readonly iframeTarget!: HTMLIFrameElement;
  readonly addressBarTarget!: HTMLInputElement;
  secret: number;
  listenerCallback: EventListenerOrEventListenerObject;

  connect() {
    this.iframeTarget.setAttribute("src", this.addressBarTarget.value);

    // This sneaky bit of code uses a secret to send over some javascript
    // that will get evaluated! :O
    this.listenerCallback = (msg: MessageEvent) => {
      console.log("Got message", msg.data);
      let { type, event, veue, url, secret } = msg.data;
      if (type === "veue") {
        this.addressBarTarget.setAttribute("value", url);
        switch (event) {
          // This comes after sending the activate
          case "connect":
            this.secret = secret;
            this.sendInjectedJavascript();
        }
      }
    };
    window.addEventListener("message", this.listenerCallback);
  }

  disconnect() {
    window.removeEventListener("message", this.listenerCallback);
  }

  iframeLoaded() {
    this.sendMessageToIframe("activate");
  }

  refresh() {
    this.sendMessageToIframe("refresh");
  }

  addressChange(e: Event) {
    let target = e.target as HTMLInputElement;
    this.sendMessageToIframe("go", target.value);
  }

  private sendInjectedJavascript() {
    fetch(this.data.get("inject-js-path")).then((response) => {
      response.text().then((javascript) => {
        this.sendMessageToIframe("inject", javascript);
      });
    });
  }

  private sendMessageToIframe(event, payload?) {
    let message = {
      type: "veue",
      event: event,
      secret: this.secret,
      origin: window.location.origin,
      payload: payload,
    };
    console.log("Sending message: ", message);
    this.iframeTarget.contentWindow.postMessage(message, "*");
  }
}
