import { CaptureSourceBase } from "helpers/broadcast/capture_sources/base";

export default class AudioMixer {
  sources: CaptureSourceBase[] = [];
  audioMix: MediaStream = new MediaStream();

  public addCaptureSource(captureSource: CaptureSourceBase): void {
    this.sources.push(captureSource);
    captureSource.audioSources.forEach((audioSource) => {
      this.audioMix.addTrack(audioSource);
    });
  }

  public removeCaptureSource(deviceId: string): void {
    this.sources.forEach((source) => {
      if (source.deviceId === deviceId) {
        source.audioSources.forEach((audioSource) => {
          this.audioMix.removeTrack(audioSource);
        });
      }
    });
  }

  public replaceDevice(
    captureSource: CaptureSourceBase,
    removeDeviceId: string
  ): void {
    this.removeCaptureSource(removeDeviceId);
    this.addCaptureSource(captureSource);
  }
}
