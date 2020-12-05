import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import Mixer from "helpers/broadcast/mixers/mixer";

export default class AudioMixer implements Mixer {
  audioContext: AudioContext = new AudioContext();
  audioSources: Map<CaptureSource, AudioNode> = new Map();
  public destinationNode: MediaStreamAudioDestinationNode = this.audioContext.createMediaStreamDestination();

  public addCaptureSource(audioSource: CaptureSource): void {
    // this.audioSources.set(captureSource,

    const sourceNode = this.audioContext.createMediaStreamSource(
      audioSource.mediaStream
    );
    this.destinationNode.connect(sourceNode);
    this.audioSources.set(audioSource, sourceNode);
  }

  public removeCaptureSource(captureSource: CaptureSource): void {
    const node = this.audioSources.get(captureSource);
    node?.disconnect();
    this.audioSources.delete(captureSource);
  }

  get audioTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }
}
