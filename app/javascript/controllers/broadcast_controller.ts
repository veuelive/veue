import { Controller } from "stimulus";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import { Rectangle } from "types/rectangle";
import VideoMixer from "helpers/broadcast/video_mixer";
import StreamCapturer from "helpers/broadcast/stream_capturer";
import {
  calculateBroadcastArea,
  calculateFullVideoSize,
  copyToClipboard,
} from "helpers/broadcast_helpers";
import TimecodeManager from "helpers/broadcast/timecode_manager";
import { postForm } from "util/fetch";
import { getCurrentUrl } from "controllers/broadcast/browser_controller";
import EventManagerInterface from "types/event_manager_interface";
import AudioCapturer from "helpers/broadcast/audio_capturer";
import LiveEventManager from "helpers/event/live_event_manager";

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

  private mixer: VideoMixer;
  private streamCapturer: StreamCapturer;
  private timecodeManager: TimecodeManager;
  private audioCapturer: AudioCapturer;
  private eventManager: EventManagerInterface;

  connect(): void {
    const currentVideoState = this.data.get("video-state");

    if (["live", "finished"].includes(currentVideoState)) {
      document.location.href = "/broadcasts";
    }

    this.state = "loading";

    this.mixer = new VideoMixer(this.webcamVideoElementTarget);
    this.streamCapturer = new StreamCapturer(this.mixer.canvas);
    this.audioCapturer = new AudioCapturer(this.streamCapturer);
    this.timecodeManager = new TimecodeManager(this.mixer.canvas);

    ipcRenderer.send("wakeup");
    ipcRenderer.send("load_browser_view", this.data.get("session-token"));

    ipcRenderer.on(
      "visible",
      async (
        _,
        dimensions: Rectangle,
        workArea: Rectangle,
        windowSize: Rectangle,
        windowTitle: string,
        scaleFactor: number
      ) => {
        console.log("dimensions", dimensions);
        console.log("workArea", workArea);
        console.log("windowSize", windowSize);
        console.log("scaleFactor", scaleFactor);

        const broadcastArea = calculateBroadcastArea(
          dimensions,
          workArea,
          scaleFactor
        );

        console.log("broadcastArea", broadcastArea);

        await this.mixer.startBrowserCapture(
          windowTitle,
          broadcastArea,
          calculateFullVideoSize(windowSize, scaleFactor)
        );

        this.state = "ready";
      }
    );

    ipcRenderer.on("ffmpeg-error", () => {
      this.state = "failed";
      alert("Something went wrong with ffmpeg– contact hello@veuelive.com");
      this.streamCapturer.stop();
    });

    this.eventManager = new LiveEventManager(false);
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

  copyCurrentURLToClipboard(): void {
    const video_path = window.location.href.replace("broadcasts/", "videos/");
    copyToClipboard(video_path);
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
