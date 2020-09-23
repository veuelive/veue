import { Controller } from "stimulus";
import { ipcRenderer } from "util/ipc_renderer";
import {Rectangle} from "util/rectangle";
import VideoMixer from "controllers/broadcast/video_mixer";
import StreamCapturer from "controllers/broadcast/stream_capturer";

type BroadcastState = "loading" | "ready" | "live" | "failed";

export default class extends Controller {
  static targets = ["webcamVideoElement"];
  private webcamVideoElementTarget!: HTMLVideoElement;

  private audioTrack: MediaStreamTrack;
  private mediaRecorder: MediaRecorder;
  private mixer: VideoMixer;
  private streamCapturer: StreamCapturer;

  connect(): void {
    this.state = "loading";

    this.mixer = new VideoMixer(this.webcamVideoElementTarget)
    this.streamCapturer = new StreamCapturer(this.mixer.canvas)

    this.mixer.startWebcamCapture().then((audioTrack) => {
      this.streamCapturer.audioTrack = audioTrack;
    })

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

          const browserDimensions = {
            height: (dimensions.height - dimensions.x) * yRatio,
            width: (dimensions.width - dimensions.x) * yRatio,
            x: dimensions.x * xRatio,
            y: (dimensions.y + workArea.y) * yRatio,
          };

          console.log("Window title is " + windowTitle);
          this.mixer.startBrowserCapture(windowTitle, browserDimensions).then(() => {
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

  startStreaming(): void {
    this.state = "loading";
    this.streamCapturer.start(this.data.get("stream-key"))
        .then(() => this.state = "live")
        .catch((e) => console.error(e));
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

}