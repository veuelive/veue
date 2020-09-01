import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["videoContainer", "debugCanvas"];
  readonly videoContainerTarget!: HTMLVideoElement;
  private debugCanvasTarget!: HTMLCanvasElement;
  private streamKey: string;
  private debugCanvasContext: CanvasRenderingContext2D;
  private audioTrack: MediaStreamTrack;
  private mediaRecorder: MediaRecorder;
  private ipcRenderer: any;

  connect(): void {
    // This should only ever run in the Electron App!
    const { ipcRenderer } = eval("require('electron')");
    this.ipcRenderer = ipcRenderer;

    this.streamKey = this.data.get("stream-key");

    this.debugCanvasContext = this.debugCanvasTarget.getContext("2d");

    navigator.getUserMedia(
      { audio: true, video: true },
      (mediaStream) => {
        this.videoContainerTarget.srcObject = mediaStream;
        this.audioTrack = mediaStream.getAudioTracks()[0];
        // mediaStream.removeTrack(this.audioTrack)
        this.videoContainerTarget.play();
        this.timerCallback();
        this.startStreaming();
      },
      (error) => {
        console.error("Something went wrong", error);
      }
    );

    ipcRenderer.on("browser-frame", (event, frame) => {
      const browserImg = new Image();
      browserImg.src = frame;
      console.log(browserImg.height, browserImg.width);
      this.debugCanvasContext.drawImage(
        browserImg,
        0,
        0,
        browserImg.width,
        browserImg.height,
        0,
        0,
        1200,
        748
      );
    });
  }

  private onStopped() {
    console.log("STOPPED");
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

    this.ipcRenderer.send("start", { streamKey: this.streamKey });

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

  timerCallback(): void {
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 16); // roughly 60 frames per second
  }

  private computeFrame() {
    this.debugCanvasContext.drawImage(this.videoContainerTarget, 0, 784);
  }
}
