import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import VideoLayout from "types/video_layout";
import { inElectronApp } from "helpers/electron/base";
import { AudioCaptureSource } from "helpers/broadcast/capture_sources/audio";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";
import ElectronCaptureSource from "helpers/broadcast/capture_sources/electron";

export const HideScreenCaptureEvent = "HideScreenCaptureEvent";
export const ShowScreenCaptureEvent = "ShowScreenCaptureEvent";
export const AddDeviceAsCaptureSource = "AddDeviceAsCaptureSource";
export const NewCaptureSourceEvent = "NewCaptureSourceEvent";
export const RemoveCaptureSourceEvent = "RemoveCaptureSourceEvent";

export default class CaptureSourceManager {
  private readonly videoMixer: VideoMixer;
  private readonly audioMixer: AudioMixer;
  private readonly mediaChangeListener: (event: CustomEvent) => Promise<void>;
  // This can be removed after the Broadcaster is decommissioned
  private electronCaptureSource: CaptureSource;

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.videoMixer = videoMixer;
    this.audioMixer = audioMixer;

    // Ugh, I hate this... but it's the main way to share these objects between
    // controllers and non-controllers
    globalThis.captureSources = {};

    document.addEventListener(
      NewCaptureSourceEvent,
      async (event: CustomEvent) => {
        await this.addCaptureSource(event.detail as CaptureSource);
      }
    );

    document.addEventListener(
      RemoveCaptureSourceEvent,
      async (event: CustomEvent) => {
        await this.removeCaptureSource(event.detail as CaptureSource);
      }
    );

    document.addEventListener(HideScreenCaptureEvent, async () => {
      await this.removeCaptureSource(this.electronCaptureSource);
    });

    document.addEventListener(ShowScreenCaptureEvent, async () => {
      await this.addCaptureSource(this.electronCaptureSource);
    });
  }

  addCaptureSource(captureSource: CaptureSource): void {
    globalThis.captureSources[captureSource.id] = captureSource;

    if (captureSource.mediaDeviceType === "videoinput") {
      this.videoMixer.addCaptureSource(captureSource as VideoCaptureSource);
    } else if (captureSource.mediaDeviceType === "audioinput") {
      this.audioMixer.addCaptureSource(captureSource as AudioCaptureSource);
    }
  }

  removeCaptureSource(captureSource: CaptureSource): void {
    if (captureSource) {
      delete globalThis.captureSources[captureSource.id];

      if (captureSource.mediaDeviceType === "videoinput") {
        this.videoMixer.removeCaptureSource(
          captureSource as VideoCaptureSource
        );
      } else if (captureSource.mediaDeviceType === "audioinput") {
        this.audioMixer.removeCaptureSource(
          captureSource as AudioCaptureSource
        );
      }
    }
  }

  async startBrowserCapture(captureLayout: VideoLayout): Promise<void> {
    if (!inElectronApp) {
      return;
    }
    this.electronCaptureSource = await ElectronCaptureSource.connect(
      captureLayout
    );
    this.addCaptureSource(this.electronCaptureSource);
  }
}
