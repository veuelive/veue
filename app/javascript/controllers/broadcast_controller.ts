import { Controller } from "stimulus";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import StreamRecorder, {
  StreamDisconnectErrorEvent,
} from "helpers/broadcast/stream_recorder";
import { calculateCaptureLayout } from "helpers/broadcast_helpers";
import { postForm } from "util/fetch";
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
import { inElectronApp } from "helpers/electron/base";

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
  private streamRecorder: StreamRecorder;
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

    this.streamRecorder = new StreamRecorder(
      this.videoMixer,
      this.audioMixer,
      this.element.dataset.phenixAuthToken
    );
    this.metronome = new Metronome();

    if (inElectronApp) {
      this.setupElectronBroadcasting().then(() => (this.state = "ready"));
    } else {
      // we aren't in electron, so we are G2G
      this.state = "ready";
    }

    document.addEventListener(StreamDisconnectErrorEvent, () => {
      window.confirm(
        `There was a connection failure, please check your connection– then click OK to restart your stream, your audience will join you automatically.`
      );
      document.location.pathname = "/broadcasts";
    });

    this.eventManager = new LiveEventManager(false);
  }

  disconnect(): void {
    this.eventManager?.disconnect();
    removeKeyboardListeners(this.keyboardListener);
  }

  async setupElectronBroadcasting(): Promise<void> {
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
        rtmpUrl: "", // no longer used
        sessionToken: this.data.get("session-token"),
      } as WakeupPayload);
      const browserArea = domRectToRect(
        this.browserUnderlayTarget.getBoundingClientRect()
      );

      await ipcRenderer.invoke("createBrowserView", {
        window: "main",
        bounds: browserArea,
        url: "https://www.veue.tv",
      } as CreateBrowserViewPayload);
      const broadcastArea = calculateCaptureLayout(
        windowBounds,
        browserArea,
        this.environment
      );

      console.log("broadcastArea", broadcastArea);

      await this.captureSourceManager.startBrowserCapture(broadcastArea);
    });
  }

  startStreaming(): void {
    this.streamRecorder
      .start(
        this.element.dataset.phenixChannelAlias,
        this.element.dataset.phenixPublishToken
      )
      .then(async () => {
        this.state = "starting";
        this.sendStartingLayout().then(() =>
          console.log("Starting Layout Sent")
        );
        this.data.set("started-at", Date.now().toString());
        this.metronome.start();

        this.snapshotIntervalId = window.setInterval(
          this.sendSnapshots.bind(this),
          30_000
        );

        await this.sendSnapshots();
        this.state = "live";
      })
      .catch((e) => console.error(e));
  }

  stopStreaming(): void {
    this.state = "finished";
    window.clearInterval(this.snapshotIntervalId);
    this.streamRecorder.stop();
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
