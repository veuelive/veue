import {Controller} from "stimulus";
import Hls from 'hls.js';

export default class extends Controller {
    static targets = [
        "iframe",
    ]
    readonly iframeTarget!: HTMLIFrameElement;
    listenerCallback: EventListenerOrEventListenerObject

    connect() {
        this.listenerCallback = (msg: MessageEvent) => {
            if(msg.data.type === "veue" && msg.data.event === "connect") {
                fetch("/inject.js").then((response) => {
                    response.text().then((javascript) => {
                      this.iframeTarget.contentWindow.postMessage({
                          secret: msg.data.secret,
                          payload: javascript
                      }, msg.data.value)
                    })
                })
            }
        };
        window.addEventListener("message", this.listenerCallback)
    }

    disconnect() {
        window.removeEventListener("message", this.listenerCallback)
    }

    iframeLoaded() {
        console.log("Loaded!")
    }
}