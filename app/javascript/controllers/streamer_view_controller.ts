import {Controller} from "stimulus";
import Bounds = chrome.system.display.Bounds;

interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number,
}

export default class extends Controller {
    static targets = ["debugCanvas"];
    private debugCanvasTarget!: HTMLCanvasElement;

    private webcamVideoElement: HTMLVideoElement;
    private browserVideoElement: HTMLVideoElement;

    private debugCanvasContext: CanvasRenderingContext2D;
    private audioTrack: MediaStreamTrack;
    private mediaRecorder: MediaRecorder;
    private ipcRenderer: any;
    private browserDimensions: Rectangle;

    connect(): void {
        // This should only ever run in the Electron App!
        const {ipcRenderer} = eval("require('electron')");
        this.ipcRenderer = ipcRenderer;

        this.webcamVideoElement = document.createElement("video")
        this.browserVideoElement = document.createElement("video")

        document.body.setAttribute("style",  "display: none")

        this.debugCanvasContext = this.debugCanvasTarget.getContext("2d");

        this.startWebcamCapture();

        // ipcRenderer.on("visible", async (_, windowName, dimensions: Rectangle, workArea: Rectangle) => {
            this.startBrowserCapture()
        // })
    }

    private startWebcamCapture() {
        navigator.mediaDevices.getUserMedia(
            {
                audio: true, video: {
                    width: 640,
                    height: 480
                }
            }
        ).then((mediaStream) => {
            console.log("webcam", mediaStream)
            this.webcamVideoElement.srcObject = mediaStream;
            this.audioTrack = mediaStream.getAudioTracks()[0];
            this.webcamVideoElement.play().then(() => {
                this.timerCallback();
            });
        }).catch((error) => {
            console.error("Something went wrong", error);
        });
    }

    startStreaming(): void {
        // Have to do this gross bit of code because typescript is convinced captureStream() doesn't exist
        const canvas = this.debugCanvasTarget as any;
        const mediaStream = canvas.captureStream(60) as MediaStream;
        mediaStream.addTrack(this.audioTrack);
        this.mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: "video/webm",
            videoBitsPerSecond: 3000000,
        });

        this.ipcRenderer.send("start", { streamKey: this.data.get("stream-key") });

        this.mediaRecorder.addEventListener("dataavailable", async (e) => {
            const arrayBuffer = await e.data.arrayBuffer();
            this.ipcRenderer.send("stream", {payload: new Uint8Array(arrayBuffer)});
            console.log("Just sent data of size ", e.data.size, e.data.toString());
        });

        this.mediaRecorder.addEventListener("stop", () => {
            this.ipcRenderer.send("stop");
        });

        this.mediaRecorder.start(1000);
    }

    private async startBrowserCapture() {
        const capturer = eval("require('electron').desktopCapturer")
        let source

        while(!source) {
            const sources = await capturer.getSources({types: ["window"]})
            source = sources.find((source) => source.name === "Veue")
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                }
            } as Record<string, unknown>
        });

        this.browserVideoElement.srcObject = mediaStream
        document.body.appendChild((this.browserVideoElement))
        await this.browserVideoElement.play()

        this.detectBrowserArea();

        console.log("browser", mediaStream)
    }

    private detectBrowserArea() {
        const canvas = document.createElement("canvas")
        canvas.width = this.browserVideoElement.videoWidth
        canvas.height = this.browserVideoElement.videoHeight
        const ctx = canvas.getContext("2d")
        ctx.drawImage(this.browserVideoElement, 0, 0, this.browserVideoElement.videoHeight, this.browserVideoElement.videoWidth)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const l = imageData.data.length / 4;

        const inRange = (color, min, max) => {
            return color > min && color < max
        }

        let topX = -1
        let topY = -1
        let bottomX = 0
        let bottomY = 0

        for (let i = 0; i < l; i++) {
            const r = imageData.data[i * 4 + 0];
            const g = imageData.data[i * 4 + 1];
            const b = imageData.data[i * 4 + 2];


            if(inRange(r, 0, 55) && inRange(g, 100, 255) && inRange(b, 0, 55)) {
                const x = Math.floor(i / imageData.width)
                const y = i % imageData.width
                if(x > bottomX) {
                    bottomX = x
                }
                if(y > bottomY) {
                    bottomY = y
                }
                if(topX == -1) {
                    topX = x
                }
                if(topY == -1) {
                    topY = y
                }
            }
        }

        const width = bottomX - topX
        const height = bottomY - topY

        console.log("DONE!", width, height)

    }

    timerCallback(): void {
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 16); // roughly 60 frames per second
    }

    private computeFrame() {
        this.debugCanvasContext.drawImage(this.webcamVideoElement, 0, 800);

        if (this.browserDimensions) {
            this.debugCanvasContext.drawImage(this.browserVideoElement,
                this.browserDimensions.x,
                this.browserDimensions.y,
                1280,
                800,
                0,
                0,
                1280,
                800)
        }
    }
}
