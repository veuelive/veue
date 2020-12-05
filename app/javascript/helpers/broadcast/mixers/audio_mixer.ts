import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import Mixer from "helpers/broadcast/mixers/mixer";

export default class AudioMixer implements Mixer {
  audioContext: AudioContext = new AudioContext();
  sources: Map<CaptureSource, AudioNode> = {};
  private destinationNode: MediaStreamAudioDestinationNode = this.audioContext.createMediaStreamDestination();

  public addCaptureSource(captureSource: CaptureSource): void {
    this.sources[captureSource];
    captureSource.audioSources.forEach((audioSource) => {
      const sourceNode = this.audioContext.createMediaStreamSource(
        audioSource.mediaStream
      );
      this.destinationNode.connect(sourceNode);
    });
  }

  public removeCaptureSource(captureSource: CaptureSource): void {
    this.sources.forEach((source) => {
      if (source.deviceId === captureSource.deviceId) {
        source.audioSources.forEach((audioSource) => {
          this.audioContext.
        });
      }
    });
  }

  get audioTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }
}
