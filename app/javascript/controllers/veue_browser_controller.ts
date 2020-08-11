import {Controller} from "stimulus";
import Hls from 'hls.js';

export default class extends Controller {
    static targets = [
        "iframe",
    ]
    readonly iframeTarget!: HTMLIFrameElement;
    listenerCallback: EventListenerOrEventListenerObject

    connect() {
        this.listenerCallback = (msg) => {
            console.log("From controller, we got message ", msg)
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