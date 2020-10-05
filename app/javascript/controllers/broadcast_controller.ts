import { Controller } from "stimulus";
import { ipcRenderer } from "controllers/broadcast/electron/ipc_renderer";
import { Rectangle } from "util/rectangle";
import VideoMixer from "controllers/broadcast/video_mixer";
import StreamCapturer from "controllers/broadcast/stream_capturer";
import { calculateBroadcastArea } from "controllers/broadcast/broadcast_helpers";
import TimecodeManager from "controllers/broadcast/timecode_manager";

type BroadcastState = "loading" | "ready" | "live" | "failed" | "finished";

export default class extends Controller {
  static targets = ["webcamVideoElement", "timeDisplay"];
  private webcamVideoElementTarget!: HTMLVideoElement;
  private timeDisplayTarget!: HTMLElement;

  private mixer: VideoMixer;
  private streamCapturer: StreamCapturer;
  private timecodeManager: TimecodeManager;

  connect(): void {
    this.state = "loading";

    this.mixer = new VideoMixer(this.webcamVideoElementTarget);
    this.streamCapturer = new StreamCapturer(this.mixer.canvas);

    this.timecodeManager = new TimecodeManager(this.mixer.canvas);

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
        const broadcastArea = calculateBroadcastArea(
          dimensions,
          workArea,
          windowSize
        );

        this.mixer.startWebcamCapture().then((audioTrack) => {
          this.streamCapturer.audioTrack = audioTrack;
          this.mixer
            .startBrowserCapture(windowTitle, broadcastArea)
            .then(() => {
              this.state = "ready";
            });
        });
      }
    );

    ipcRenderer.on("ffmpeg-error", () => {
      this.state = "failed";
      this.streamCapturer.stop();
    });
  }

  startStreaming(): void {
    this.streamCapturer
      .start(this.data.get("stream-key"))
      .then(() => {
        this.state = "live";
        this.data.set("started-at", Date.now().toString());
        this.timecodeManager.start();
      })
      .catch((e) => console.error(e));
  }

  stopStreaming(): void {
    this.state = "finished";
    this.streamCapturer.stop();
  }

  set state(state: BroadcastState) {
    this.element.className = "";
    this.data.set("state", state);

    console.log("state transitions to " + state);

    // Hide all elements that shouldn't be visible in this state!
    document
      .querySelectorAll("*[data-showOnState]")
      .forEach((element: HTMLElement) => {
        element.hidden = element.dataset.showonstate !== state;
      });
  }
}
