import { Controller } from "stimulus";
import { ipcRenderer } from "controllers/broadcast/electron/ipc_renderer";
import { Rectangle } from "util/rectangle";
import VideoMixer from "controllers/broadcast/video_mixer";
import StreamCapturer from "controllers/broadcast/stream_capturer";
import { calculateBroadcastArea } from "controllers/broadcast/broadcast_helpers";
import TimecodeManager from "controllers/broadcast/timecode_manager";
import { postForm } from "util/fetch";
import { getCurrentUrl } from "controllers/broadcast/browser_controller";
import EventManagerInterface from "controllers/event/event_manager_interface";
import AudioCapturer from "controllers/broadcast/audio_capturer";
import LiveEventManager from "controllers/event/live_event_manager";

type BroadcastState =
  | "loading"
  | "ready"
  | "starting"
  | "live"
  | "failed"
  | "finished";

export default class extends Controller {
  static targets = ["webcamVideoElement", "timeDisplay"];
  private webcamVideoElementTarget!: HTMLVideoElement;
  private timeDisplayTarget!: HTMLElement;

  private mixer: VideoMixer;
  private streamCapturer: StreamCapturer;
  private timecodeManager: TimecodeManager;
  private audioCapturer: AudioCapturer;
  private eventManager: EventManagerInterface;

  connect(): void {
    if (this.data.get("video-state") == "finished") {
      document.location.href = "/broadcasts";
    }

    this.state = "loading";

    this.mixer = new VideoMixer(this.webcamVideoElementTarget);
    this.streamCapturer = new StreamCapturer(this.mixer.canvas);
    this.audioCapturer = new AudioCapturer(this.streamCapturer);
    this.timecodeManager = new TimecodeManager(this.mixer.canvas);

    ipcRenderer.send("wakeup");
    ipcRenderer.send("load_browser_view");

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

        await this.mixer.startWebcamCapture();
        this.mixer.startBrowserCapture(windowTitle, broadcastArea).then(() => {
          this.state = "ready";
        });
      }
    );

    ipcRenderer.on("ffmpeg-error", () => {
      this.state = "failed";
      this.streamCapturer.stop();
    });

    this.eventManager = new LiveEventManager();
  }

  disconnect(): void {
    this.eventManager?.disconnect();
  }

  startStreaming(): void {
    this.streamCapturer
      .start(this.data.get("stream-key"))
      .then(async () => {
        this.state = "starting";
        this.data.set("started-at", Date.now().toString());

        const screenshot = await this.mixer.getScreenshot();
        const streamer = await this.mixer.getWebcamShot();

        await postForm("./start", {
          url: getCurrentUrl(),
          primary_shot: screenshot,
          secondary_shot: streamer,
        });
        this.state = "live";
        this.timecodeManager.start();
      })
      .catch((e) => console.error(e));
  }

  stopStreaming(): void {
    this.state = "finished";
    this.streamCapturer.stop();
  }

  pinPage(): void {
    const url = document
      .querySelector("input[data-target='broadcast--browser.addressBar']")
      .getAttribute("value");
    this.mixer.getScreenshot().then((image) => {
      return postForm("./pins", {
        name: "Card",
        url,
        thumbnail: image,
        timecode_ms: this.timecodeManager.timecodeMs,
      });
    });
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
