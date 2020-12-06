import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import MicrophoneCaptureSource from "helpers/broadcast/capture_sources/microphone";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import Mixer from "helpers/broadcast/mixers/mixer";
import { Rectangle } from "types/rectangle";
import VideoLayout from "types/video_layout";

export default class CaptureSourceManager {
  private _webcamSource: WebcamCaptureSource;
  private _microphoneSource: MicrophoneCaptureSource;
  private _screenCaptureSource: ScreenCaptureSource;
  private videoMixer: VideoMixer;
  private audioMixer: AudioMixer;

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.videoMixer = videoMixer;
    this.audioMixer = audioMixer;
  }

  set webcamSource(source: WebcamCaptureSource) {
    this.swapSources(this.videoMixer, source, this._webcamSource);
    this._webcamSource = source;
  }

  set microphoneSource(source: MicrophoneCaptureSource) {
    this.swapSources(this.audioMixer, source, this._microphoneSource);
    this._microphoneSource = source;
  }

  set screenCaptureSource(source: ScreenCaptureSource) {
    this.swapSources(this.videoMixer, source, this._screenCaptureSource);
    this._screenCaptureSource = source;
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

  private swapSources(
    mixer: Mixer,
    newSource: CaptureSource,
    oldSource?: CaptureSource
  ) {
    if (oldSource) {
      mixer.removeCaptureSource(oldSource);
    }

    mixer.addCaptureSource(newSource);
    return newSource;
  }
}
