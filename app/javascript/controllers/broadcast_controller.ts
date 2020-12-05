import { Controller } from "stimulus";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import { Rectangle } from "types/rectangle";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import StreamRecorder from "helpers/broadcast/stream_recorder";
import {
  calculateBroadcastArea,
  calculateFullVideoSize,
  copyToClipboard,
} from "helpers/broadcast_helpers";
import { postForm } from "util/fetch";
import { getCurrentUrl } from "controllers/broadcast/browser_controller";
import EventManagerInterface from "types/event_manager_interface";
import LiveEventManager from "helpers/event/live_event_manager";
import { DefaultVideoLayout } from "types/sizes";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import CaptureSourceManager from "helpers/broadcast/capture_source_manager";
import Metronome from "helpers/broadcast/metronome";

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

  private videoMixer: VideoMixer;
  private streamCapturer: StreamRecorder;
  private metronome: Metronome;
  private eventManager: EventManagerInterface;
  private audioMixer: AudioMixer;
  private captureSourceManager: CaptureSourceManager;

  connect(): void {
    const currentVideoState = this.data.get("video-state");

    if (["starting", "live", "finished"].includes(currentVideoState)) {
      document.location.href = "/broadcasts";
    }

    this.state = "loading";

    this.videoMixer = new VideoMixer(DefaultVideoLayout);
    this.audioMixer = new AudioMixer();

    this.captureSourceManager = new CaptureSourceManager(
      this.videoMixer,
      this.audioMixer
    );

    this.streamCapturer = new StreamRecorder(this.videoMixer, this.audioMixer);
    this.metronome = new Metronome();

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

        await this.captureSourceManager.startBrowserCapture(
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

        // const screenshot = await this.videoMixer.getScreenshot();
        // const streamer = await this.videoMixer.getWebcamShot();

        await postForm("./start", {
          url: getCurrentUrl(),
          // primary_shot: screenshot,
          // secondary_shot: streamer,
        });
        this.state = "live";
        this.metronome.start();
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

  // pinPage(): void {
  //   const url = document
  //     .querySelector("input[data-target='broadcast--browser.addressBar']")
  //     .getAttribute("value");
  //   this.videoMixer.getScreenshot().then((image) => {
  //     return postForm("./pins", {
  //       name: "Card",
  //       url,
  //       thumbnail: image,
  //       timecode_ms: this.metronome.timecodeMs,
  //     });
  //   });
  // }

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
