import {Controller} from "stimulus";
import Hls from 'hls.js';

export default class extends Controller {
    static targets = [
        "browserIFrame",
        "personVideo",
    ];
    readonly browserIFrameTarget!: HTMLIFrameElement;
    readonly personVideoTarget!: HTMLVideoElement;

    connect() {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            this.personVideoTarget.srcObject = stream
            this.personVideoTarget.onloadedmetadata = (e) => {
                this.personVideoTarget.play();
            };
        })
    }

}
