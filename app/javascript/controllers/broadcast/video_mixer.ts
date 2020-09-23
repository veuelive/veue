import {Rectangle} from "util/rectangle";


export default class VideoMixer {
    canvas: CaptureStreamCanvas;
    audioTrack: MediaStreamTrack;

    private readonly webcamVideoElement: HTMLVideoElement;
    private readonly browserVideoElement: HTMLVideoElement;

    private browserDimensions: Rectangle;
    private canvasContext: CanvasRenderingContext2D;

    constructor(webcamVideoElement: HTMLVideoElement) {
        this.webcamVideoElement = webcamVideoElement;

        this.browserVideoElement = document.createElement("video");
        this.browserVideoElement.setAttribute("style", "display: none");

        this.canvas = document.createElement("canvas") as CaptureStreamCanvas;
        this.canvas.setAttribute("id", "debug_canvas")
        this.canvas.setAttribute("width", "1280");
        this.canvas.setAttribute("height", "1280");
        if(this.canvas) {
            this.canvasContext = this.canvas.getContext("2d");
        }

        document.getElementsByClassName("debug-area")[0].appendChild(this.canvas)

        this.timerCallback()
    }

    public startWebcamCapture(): Promise<MediaStreamTrack> {
        return navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: {
                    width: 640,
                    height: 480,
                },
            })
            .then(async (mediaStream) => {
                this.webcamVideoElement.srcObject = mediaStream;
                await this.webcamVideoElement.play()
                return mediaStream.getAudioTracks()[0];
            })
    }

    async startBrowserCapture(windowTitle: string, browserDimensions: Rectangle): Promise<void> {
        this.browserDimensions = browserDimensions;

        const source = await this.getWindowSource(windowTitle);

        this.browserVideoElement.srcObject = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                },
            } as Record<string, unknown>,
        });
        this.browserVideoElement.addEventListener("loadedmetadata", () => {
            console.log("loaded!")
            this.browserVideoElement.play();
        });
    }

    private async getWindowSource(windowTitle: string) {
        const capturer = eval("require('electron').desktopCapturer");
        let source;

        while (!source) {
            const sources = await capturer.getSources({types: ["window"]});
            source = sources.find((source) => source.name === windowTitle);
        }
        return source;
    }

    timerCallback(): void {
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 26);
    }

    private computeFrame() {
        this.canvasContext.rect(0, 0, 1280, 1280);
        this.canvasContext.fillStyle = "green";
        this.canvasContext.fill();
        this.canvasContext.drawImage(this.webcamVideoElement, 0, 800);

        if (this.browserDimensions) {
            this.canvasContext.drawImage(
                this.browserVideoElement,
                this.browserDimensions.x,
                this.browserDimensions.y,
                this.browserDimensions.width,
                this.browserDimensions.height,
                0,
                0,
                1280,
                800
            );
        }
    }
}

export interface CaptureStreamCanvas extends HTMLCanvasElement {
    captureStream(fps: number): MediaStream;
}
