import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import MicrophoneCaptureSource from "helpers/broadcast/capture_sources/microphone";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import Mixer from "helpers/broadcast/mixers/mixer";
import { Rectangle } from "types/rectangle";
import VideoLayout from "types/video_layout";
import { inElectronApp } from "helpers/electron/base";
import { MediaDeviceChangeEvent } from "controllers/broadcast/media_manager_controller";

export default class CaptureSourceManager {
  private _webcamSource: WebcamCaptureSource;
  private _microphoneSource: MicrophoneCaptureSource;
  private _screenCaptureSource: ScreenCaptureSource;
  private readonly videoMixer: VideoMixer;
  private readonly audioMixer: AudioMixer;
  private readonly mediaChangeListener: (event: CustomEvent) => Promise<void>;

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.videoMixer = videoMixer;
    this.audioMixer = audioMixer;

    this.mediaChangeListener = async (event: CustomEvent) => {
      await this.switchToDevice(event.detail as MediaDeviceInfo);
    };
    document.addEventListener(MediaDeviceChangeEvent, this.mediaChangeListener);
  }

  set webcamSource(source: WebcamCaptureSource) {
    CaptureSourceManager.swapSources(
      this.videoMixer,
      source,
      this._webcamSource
    );
    this._webcamSource = source;
  }

  set microphoneSource(source: MicrophoneCaptureSource) {
    CaptureSourceManager.swapSources(
      this.audioMixer,
      source,
      this._microphoneSource
    );
    this._microphoneSource = source;
  }

  set screenCaptureSource(source: ScreenCaptureSource) {
    CaptureSourceManager.swapSources(
      this.videoMixer,
      source,
      this._screenCaptureSource
    );
    this._screenCaptureSource = source;
  }

  async switchToDevice(device: MediaDeviceInfo): Promise<void> {
    if (device.kind === "audioinput") {
      this.microphoneSource = await MicrophoneCaptureSource.connect(
        device.deviceId
      );
    } else if (device.kind === "videoinput") {
      this.webcamSource = await WebcamCaptureSource.connect(device.deviceId);
    }
  }

  async start(): Promise<void> {
    this.webcamSource = await WebcamCaptureSource.connect();
    this.microphoneSource = await MicrophoneCaptureSource.connect();
  }

  async startBrowserCapture(
    windowTitle: string,
    broadcastArea: Rectangle,
    rectangle: Rectangle
  ): Promise<void> {
    if (!inElectronApp) {
      return;
    }
    const layout: VideoLayout = {
      width: rectangle.width,
      height: rectangle.height,
      sections: [
        {
          width: broadcastArea.width,
          height: broadcastArea.height,
          x: broadcastArea.x,
          y: broadcastArea.y,
          type: "screen",
          priority: 1,
        },
      ],
    };
    this.screenCaptureSource = await ScreenCaptureSource.connect(
      windowTitle,
      layout
    );
  }

  private static swapSources(
    mixer: Mixer,
    newSource: CaptureSource,
    oldSource?: CaptureSource
  ) {
    if (oldSource) {
      mixer.removeCaptureSource(oldSource);
      oldSource.stop();
    }

    mixer.addCaptureSource(newSource);
    return newSource;
  }
}
