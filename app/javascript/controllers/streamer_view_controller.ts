import { Controller } from "stimulus";
import Bounds = chrome.system.display.Bounds;

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
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
  private workArea: Rectangle;

  connect(): void {
    // This should only ever run in the Electron App!
    const { ipcRenderer } = eval("require('electron')");
    this.ipcRenderer = ipcRenderer;

    this.webcamVideoElement = document.createElement("video");
    this.browserVideoElement = document.createElement("video");

    this.debugCanvasContext = this.debugCanvasTarget.getContext("2d");

    this.startWebcamCapture();

    ipcRenderer.on(
      "visible",
      async (_, dimensions: Rectangle, workArea: Rectangle) => {
        this.browserDimensions = dimensions;
        this.workArea = workArea;
        this.startBrowserCapture().then(() => this.startStreaming());
      }
    );
  }

  private startWebcamCapture() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
        },
      })
      .then((mediaStream) => {
        console.log("webcam", mediaStream);
        this.webcamVideoElement.srcObject = mediaStream;
        this.audioTrack = mediaStream.getAudioTracks()[0];
        this.webcamVideoElement.play().then(() => {
          this.timerCallback();
        });
      })
      .catch((error) => {
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
      this.ipcRenderer.send("stream", { payload: new Uint8Array(arrayBuffer) });
      console.log("Just sent data of size ", e.data.size, e.data.toString());
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.ipcRenderer.send("stop");
    });

    this.mediaRecorder.start(1000);
  }

  private async startBrowserCapture() {
    const capturer = eval("require('electron').desktopCapturer");
    let source;

    while (!source) {
      const sources = await capturer.getSources({ types: ["window"] });
      source = sources.find((source) => source.name === "Veue");
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source.id,
        },
      } as Record<string, unknown>,
    });

    this.browserVideoElement.srcObject = mediaStream;
    this.browserVideoElement.addEventListener("loadedmetadata", () => {
      this.browserVideoElement.play();

      // const ratio = this.workArea.width / this.browserVideoElement.videoWidth
      // const y = (this.browserDimensions.y - this.workArea.y) * ratio
      // const x = this.browserDimensions.x  * ratio
      // const width = this.browserDimensions.width * ratio
      // const height = this.browserDimensions.height * ratio

      //     // Override the values
      // this.browserDimensions = {
      //     x, y, width, height
      // }

      // console.log(ratio)

      console.log("browser", mediaStream);

      this.debugCanvasTarget.parentElement.appendChild(
        this.browserVideoElement
      );
    });
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
      this.debugCanvasContext.drawImage(
        this.browserVideoElement,
        this.browserDimensions.x + 10,
        this.browserDimensions.y + this.workArea.y + 30,
        this.browserDimensions.width + 250,
        this.browserDimensions.height + 160,
        0,
        0,
        1280,
        800
      );
    }
  }
}
