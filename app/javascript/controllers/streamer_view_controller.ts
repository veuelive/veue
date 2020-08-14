import {Controller} from "stimulus";
import Hls from 'hls.js';

export default class extends Controller {
    static targets = [
        "webcamVideoTag",
        "webcamCanvas",

    ];
    readonly webcamVideoTagTarget!: HTMLVideoElement;
    readonly webcamCanvasTarget!: HTMLCanvasElement;

    private webcamCanvasContext: CanvasRenderingContext2D;

    connect() {
        this.webcamCanvasContext = this.webcamCanvasTarget.getContext('2d')

        navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
            this.webcamVideoTagTarget.srcObject = stream
            this.webcamVideoTagTarget.onloadedmetadata = (e) => {
                this.webcamVideoTagTarget.play();
                this.timerCallback();
            };
        })
    }

    timerCallback() {
        this.computeFrame();
        let self = this;
        setTimeout(() => {
            self.timerCallback();
        }, 16); // roughly 60 frames per second
    }

    computeFrame() {
        this.webcamCanvasContext.drawImage(
            this.webcamVideoTagTarget,
            0,
            0,
            this.webcamVideoTagTarget.width,
            this.webcamVideoTagTarget.height
        )
    }

}
