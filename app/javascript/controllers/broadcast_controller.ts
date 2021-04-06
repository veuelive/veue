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
import {
  attachKeyboardListener,
  removeKeyboardListeners,
} from "helpers/broadcast/keyboard_listeners";
import { getVideoId } from "helpers/video_helpers";
import { getChannelId } from "helpers/channel_helpers";

export const BroadcasterEnvironmentChangedEvent = "broadcastEnvironmentChanged";

type BroadcastState =
  | "loading"
  | "ready"
  | "starting"
  | "live"
  | "failed"
  | "cancelled"
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
  private keyboardListener: (event) => void;
  private snapshotIntervalId: number;

  element!: HTMLElement;

  connect(): void {
    this.keyboardListener = attachKeyboardListener();

    const currentVideoState = this.data.get("video-state");

    if (
      ["starting", "live", "finished", "cancelled"].includes(currentVideoState)
    ) {
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
      console.log(this.environment);
      document.dispatchEvent(
        new CustomEvent(BroadcasterEnvironmentChangedEvent, { detail: data })
      );

      // We should replace this later using the environment above to calculate
      // what size we think the window should be when it opens
      const windowSize = {
        width: 1247,
        height: 720,
      };
      const windowBounds = await ipcRenderer.invoke("wakeup", {
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
        windowBounds,
        browserArea,
        this.environment
      );

      console.log("broadcastArea", broadcastArea);

      await this.captureSourceManager.startBrowserCapture(broadcastArea);

      this.state = "ready";
    });

    ipcRenderer.on("ffmpeg-error", () => {
      this.state = "failed";
      alert("Something went wrong with ffmpeg– contact hello@veue.tv");
      this.streamCapturer.stop();
    });

    this.eventManager = new LiveEventManager(false);
  }

  disconnect(): void {
    this.eventManager?.disconnect();
    removeKeyboardListeners(this.keyboardListener);
  }

  startStreaming(): void {
    // TODO:: this mechanism of event is partially implemented, will
    // be part of next PR.

    // const titlePresent = this.element.dataset.videoTitle;
    // if (!titlePresent) {
    //   document.dispatchEvent(
    //     new CustomEvent(ShowSettingsMenuEvent, {
    //       detail: {
    //         titlePresent,
    //       },
    //     })
    //   );
    // }

    this.streamCapturer
      .start(this.data.get("stream-key"))
      .then(async () => {
        this.state = "starting";
        this.data.set("started-at", Date.now().toString());

        await Promise.all([this.sendSnapshots(), this.sendStartingLayout()]);

        this.state = "live";
        this.metronome.start();

        this.snapshotIntervalId = window.setInterval(
          this.sendSnapshots.bind(this),
          30_000
        );
      })
      .catch((e) => console.error(e));
  }

  stopStreaming(): void {
    this.state = "finished";
    window.clearInterval(this.snapshotIntervalId);
    this.streamCapturer.stop();
  }

  async sendSnapshots(): Promise<void> {
    if (this.state === "finished") {
      return;
    }
    // globalThis.timecodeMs is set by the metronome, if its not set, we know the video is
    // just starting
    const timecode = globalThis.timecodeMs || 0;
    const snapshots = await this.videoMixer.getVideoShots();

    await Promise.all(
      snapshots.map(async (snapshot) => {
        const { image, deviceType, deviceId, priority } = snapshot;
        const data = {
          timecode,
          image,
          priority,
          device_type: deviceType,
          device_id: deviceId,
        };
        await postForm(
          `/${getChannelId()}/videos/${getVideoId()}/snapshots`,
          data
        );
      })
    );
  }

  async sendStartingLayout(): Promise<void> {
    const data = {
      url: getCurrentUrl(),
      video_layout: JSON.stringify(this.videoMixer.broadcastLayout),
    };

    await postForm("./start", data);
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
