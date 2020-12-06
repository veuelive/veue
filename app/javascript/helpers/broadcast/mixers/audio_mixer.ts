import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import Mixer from "helpers/broadcast/mixers/mixer";

/**
 * The AudioMixer is responsible for mixing together multiple audio streams
 * into one single stream. However, at time of initial development and
 * refactor– the AudioContext gods aren't in the favor of Hampton, so this
 * is initially will only forward the FIRST audio source connected.
 */
export default class AudioMixer implements Mixer {
  _audioContext: AudioContext;
  audioSources: Map<CaptureSource, AudioNode> = new Map();
  _destinationNode: MediaStreamAudioDestinationNode;

  public addCaptureSource(audioSource: CaptureSource): void {
    const sourceNode = this.audioContext.createMediaStreamSource(
      audioSource.mediaStream
    );
    console.log("Added audio source", audioSource);
    sourceNode.connect(this.destinationNode);
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

  // Lazy-initialize this context until we are ready for it!
  get audioContext(): AudioContext {
    return this._audioContext || (this._audioContext = new AudioContext());
  }

  // Lazy-initialize the destination node until we are ready for it!
  get destinationNode(): MediaStreamAudioDestinationNode {
    return (
      this._destinationNode ||
      (this._destinationNode = this.audioContext.createMediaStreamDestination())
    );
  }
}
