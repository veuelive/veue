import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import MicrophoneCaptureSource from "helpers/broadcast/capture_sources/microphone";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import VideoMixer from "helpers/broadcast/mixers/video_mixer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import Mixer from "helpers/broadcast/mixers/mixer";
import { Rectangle } from "types/rectangle";

export default class CaptureSourceManager {
  private _webcamSource: CaptureSource;
  private _microphoneSource: CaptureSource;
  private _screenCaptureSource: CaptureSource;
  private mixers: Mixer[];

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.mixers = [videoMixer, audioMixer];

    this.webcamSource = new WebcamCaptureSource();
    this.webcamSource.start();
    this.microphoneSource = new MicrophoneCaptureSource();
  }

  set webcamSource(source: WebcamCaptureSource) {
    this._webcamSource = this.swapSources(source, this._webcamSource);
  }

  set microphoneSource(source: MicrophoneCaptureSource) {
    this._microphoneSource = this.swapSources(source, this._microphoneSource);
  }

  set screenCaptureSource(source: ScreenCaptureSource) {
    this._screenCaptureSource = this.swapSources(
      source,
      this._screenCaptureSource
    );
  }

  async startBrowserCapture(
    windowTitle: string,
    broadcastArea: Rectangle,
    rectangle: Rectangle
  ) {
    const screenCaptureSource = new ScreenCaptureSource();
    // screenCaptureSource.start(broadcastArea);
    // this.captureSources.push(screenCaptureSource);
  }

  private swapSources(newSource: CaptureSource, oldSource?: CaptureSource) {
    this.mixers.forEach((mixer) => {
      if (oldSource) {
        mixer.removeCaptureSource(oldSource);
      }

      mixer.addCaptureSource(newSource);
    });
    return newSource;
  }
}
