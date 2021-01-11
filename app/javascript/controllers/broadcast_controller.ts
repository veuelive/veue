import { Controller } from "stimulus";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import StreamRecorder from "helpers/broadcast/stream_recorder";
import { calculateCaptureLayout } from "helpers/broadcast_helpers";
import { postForm } from "util/fetch";
import { getCurrentUrl } from "controllers/broadcast/browser_controller";
import EventManagerInterface from "types/event_manager_interface";
import LiveEventManager from "helpers/event/live_event_manager";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import CaptureSourceManager from "helpers/broadcast/capture_source_manager";
import Metronome from "helpers/broadcast/metronome";
import {
  BroadcasterEnvironment,
  CreateBrowserViewPayload,
  WakeupPayload,
} from "types/electron_env";
import { domRectToRect } from "helpers/converters";

type BroadcastState =
  | "loading"
  | "ready"
  | "starting"
  | "live"
  | "failed"
  | "finished";

export default class extends Controller {
  static targets = ["webcamVideoElement", "timeDisplay", "browserUnderlay"];
  private webcamVideoElementTarget!: HTMLVideoElement;
  private browserUnderlayTarget!: HTMLDivElement;

  private videoMixer: VideoMixer;
  private streamCapturer: StreamRecorder;
  private metronome: Metronome;
  private eventManager: EventManagerInterface;
  private audioMixer: AudioMixer;
  private captureSourceManager: CaptureSourceManager;
  private environment: BroadcasterEnvironment;

  connect(): void {
    const currentVideoState = this.data.get("video-state");

    if (["starting", "live", "finished"].includes(currentVideoState)) {
      document.location.href = "/broadcasts";
    }

    this.state = "loading";

    this.videoMixer = new VideoMixer();
    this.audioMixer = new AudioMixer();

    this.captureSourceManager = new CaptureSourceManager(
      this.videoMixer,
      this.audioMixer
    );
    this.captureSourceManager.start();

    this.streamCapturer = new StreamRecorder(this.videoMixer, this.audioMixer);
    this.metronome = new Metronome();

    ipcRenderer.invoke("getEnvironment").then(async (data) => {
      this.environment = data as BroadcasterEnvironment;

      const windowSize = {
        width: 1250,
        height: 685,
      };
      await ipcRenderer.invoke("wakeup", {
        mainWindow: windowSize,
        rtmpUrl: `rtmps://global-live.mux.com/app/${this.data.get(
          "stream-key"
        )}`,
        sessionToken: this.data.get("session-token"),
      } as WakeupPayload);
      const browserArea = domRectToRect(
        this.browserUnderlayTarget.getBoundingClientRect()
      );

      await ipcRenderer.invoke("createBrowserView", {
        window: "main",
        bounds: browserArea,
        url: "https://www.apple.com",
      } as CreateBrowserViewPayload);
      const broadcastArea = calculateCaptureLayout(
        windowSize,
        browserArea,
        this.environment.primaryDisplay.workArea
      );

      console.log("broadcastArea", broadcastArea);

      await this.captureSourceManager.startBrowserCapture(
        "Veue Broadcaster",
        broadcastArea
      );

      this.state = "ready";
    });

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

        const screenshots = await this.videoMixer.getVideoShots();

        // We have to stringify to strip "undefined" values
        const data = {
          url: getCurrentUrl(),
          primary_shot: screenshots[0],
          video_layout: JSON.stringify(this.videoMixer.broadcastLayout),
        };

        if (screenshots[1]) {
          data["secondary_shot"] = screenshots[1];
        }

        await postForm("./start", data);

        this.state = "live";
        this.metronome.start();
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
