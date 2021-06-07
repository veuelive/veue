import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import VideoLayout from "types/video_layout";
import { AudioCaptureSource } from "helpers/broadcast/capture_sources/audio";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";
import EventBus from "event_bus";

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

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.videoMixer = videoMixer;
    this.audioMixer = audioMixer;

    // Ugh, I hate this... but it's the main way to share these objects between
    // controllers and non-controllers
    globalThis.captureSources = {};

    EventBus.subscribe(
      NewCaptureSourceEvent,
      async (captureSource: CaptureSource) => {
        await this.addCaptureSource(captureSource);
      }
    );

    EventBus.subscribe(
      RemoveCaptureSourceEvent,
      async (captureSource: CaptureSource) => {
        await this.removeCaptureSource(captureSource);
      }
    );
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
}
