import { Controller } from "stimulus";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import StreamRecorder, {
  StreamDisconnectErrorEvent,
} from "helpers/broadcast/stream_recorder";
import { postForm } from "util/fetch";
import EventManagerInterface from "types/event_manager_interface";
import LiveEventManager from "helpers/event/live_event_manager";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import CaptureSourceManager from "helpers/broadcast/capture_source_manager";
import Metronome from "helpers/broadcast/metronome";
import { domRectToRect } from "helpers/converters";
import {
  attachKeyboardListener,
  removeKeyboardListeners,
} from "helpers/broadcast/keyboard_listeners";
import { getVideoId } from "helpers/video_helpers";
import { getChannelId } from "helpers/channel_helpers";
import { trackEvent } from "helpers/event_tracking";

type BroadcastState =
  | "loading"
  | "ready"
  | "starting"
  | "live"
  | "failed"
  | "cancelled"
  | "finished";

export default class extends Controller {
  static targets = [
    "webcamVideoElement",
    "timeDisplay",
    "browserUnderlay",
    "foregroundWarning",
  ];
  private webcamVideoElementTarget!: HTMLVideoElement;
  private browserUnderlayTarget!: HTMLDivElement;
  private foregroundWarningTarget!: HTMLElement;

  private videoMixer: VideoMixer;
  private streamRecorder: StreamRecorder;
  private metronome: Metronome;
  private eventManager: EventManagerInterface;
  private audioMixer: AudioMixer;
  private captureSourceManager: CaptureSourceManager;
  private keyboardListener: (event) => void;
  private snapshotIntervalId: number;

  element!: HTMLElement;

  connect(): void {
    this.keyboardListener = attachKeyboardListener();
    this.warningRemoveTimeout();

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

    this.state = "ready";

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

  startStreaming(): void {
    this.streamRecorder
      .start(
        this.element.dataset.phenixChannelAlias,
        this.element.dataset.phenixPublishToken
      )
      .then(async () => {
        this.state = "starting";
        await this.sendStartingInfo();
        console.log("Starting Layout and Snapshots Sent");

        this.snapshotIntervalId = window.setInterval(
          this.sendSnapshots.bind(this),
          30_000
        );

        // HC: It doesn't make me happy to document this,
        // but having this here typically gives enough time for the
        // video to end up in sync.
        this.data.set("started-at", Date.now().toString());
        this.metronome.start();

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

  async sendStartingInfo(): Promise<void> {
    const data = {
      video_layout: JSON.stringify(this.videoMixer.broadcastLayout),
    };

    await this.sendSnapshots();
    await postForm("./start", data);
  }

  dismissWarning(): void {
    this.foregroundWarningTarget.remove();
  }

  warningRemoveTimeout(): void {
    setTimeout(() => this.dismissWarning(), 3000);
  }

  set state(state: BroadcastState) {
    this.element.className = "";
    this.data.set("state", state);

    console.log("state transitions to " + state);

    trackEvent("Broadcast", "State Changed", state);

    // Hide all elements that shouldn't be visible in this state!
    document
      .querySelectorAll("*[data-showOnState]")
      .forEach((element: HTMLElement) => {
        element.hidden = element.dataset.showonstate !== state;
      });
  }
}
