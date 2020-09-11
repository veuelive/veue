import { Controller } from "stimulus";
import { IPCRenderer } from "util/ipc_renderer";

type BroadcastState = "loading" | "ready" | "live" | "failed";

export default class extends Controller {
  static targets = ["debugCanvas", "webcamVideoElement"];
  private debugCanvasTarget!: CaptureStreamCanvas;
  private webcamVideoElementTarget!: HTMLVideoElement;

  private browserVideoElement: HTMLVideoElement;

  private debugCanvasContext: CanvasRenderingContext2D;
  private audioTrack: MediaStreamTrack;
  private mediaRecorder: MediaRecorder;
  private ipcRenderer: IPCRenderer;
  private browserDimensions: Rectangle;

  connect(): void {
    this.state = "loading";

    // This should only ever run in the Electron App!
    const { ipcRenderer } = eval("require('electron')");
    this.ipcRenderer = ipcRenderer;

    this.browserVideoElement = document.createElement("video");

    this.debugCanvasContext = this.debugCanvasTarget.getContext("2d");

    this.startWebcamCapture();

    ipcRenderer.send("wakeup");

    ipcRenderer.on(
      "visible",
      async (
        _,
        dimensions: Rectangle,
        workArea: Rectangle,
        windowSize: Rectangle,
        windowTitle: string
      ) => {
        const yRatio = workArea.height / windowSize.height;
        const xRatio = workArea.width / windowSize.width;

        this.browserDimensions = {
          height: (dimensions.height - dimensions.x) * yRatio,
          width: (dimensions.width - dimensions.x) * yRatio,
          x: dimensions.x * xRatio,
          y: (dimensions.y + workArea.y) * yRatio,
        };

        console.log("Window title is " + windowTitle);
        this.startBrowserCapture(windowTitle).then(() => {
          console.log("ready!");
          this.state = "ready";
        });
      }
    );

    ipcRenderer.on("stop", () => {
      this.state = "failed";
      this.mediaRecorder.stop();
    });
  }

  set state(state: BroadcastState) {
    const broadcastElement = document.getElementById("broadcast");
    broadcastElement.className = "";
    broadcastElement.className = "state-" + state;

    // Hide all elements that shouldn't be visible in this state!
    document
      .querySelectorAll("*[data-showOnState]")
      .forEach((element: HTMLElement) => {
        element.hidden = element.dataset.showonstate !== state;
      });
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
        this.webcamVideoElementTarget.srcObject = mediaStream;
        this.audioTrack = mediaStream.getAudioTracks()[0];
        this.webcamVideoElementTarget.play().then(() => {
          this.timerCallback();
        });
      })
      .catch((error) => {
        console.error("Something went wrong", error);
      });
  }

  startStreaming(): void {
    this.state = "loading";
    const mediaStream = this.debugCanvasTarget.captureStream(60);
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
    this.state = "live";
  }

  private async startBrowserCapture(windowTitle: string) {
    const capturer = eval("require('electron').desktopCapturer");
    let source;

    while (!source) {
      const sources = await capturer.getSources({ types: ["window"] });
      source = sources.find((source) => source.name === windowTitle);
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

      console.log(this.browserDimensions);

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
    this.debugCanvasContext.rect(0, 0, 1280, 1280);
    this.debugCanvasContext.fillStyle = "green";
    this.debugCanvasContext.fill();
    this.debugCanvasContext.drawImage(this.webcamVideoElementTarget, 0, 800);

    if (this.browserDimensions) {
      this.debugCanvasContext.drawImage(
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

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CaptureStreamCanvas extends HTMLCanvasElement {
  captureStream(fps: number): MediaStream;
}
