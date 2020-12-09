import { CaptureSource } from "helpers/broadcast/capture_sources/base";
import Mixer from "helpers/broadcast/mixers/mixer";

/**
 * The AudioMixer is responsible for mixing together multiple audio streams
 * into one single stream.
 */
export default class AudioMixer implements Mixer {
  _audioContext: AudioContext;
  audioSources: Map<CaptureSource, AudioNode> = new Map();
  _destinationNode: MediaStreamAudioDestinationNode;
  private analyser: AnalyserNode;
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.querySelector("#audioCanvas") as HTMLCanvasElement;
    this.canvasContext = this.canvas.getContext("2d");
    this.renderCanvas();
  }

  public addCaptureSource(audioSource: CaptureSource): void {
    const sourceNode = this.audioContext.createMediaStreamSource(
      audioSource.mediaStream
    );
    console.log("Added audio source", audioSource);
    sourceNode.connect(this.destinationNode);
    sourceNode.connect(this.analyser);
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

  renderCanvas(): void {
    if (this.analyser) {
      const array = new Uint8Array(this.analyser.frequencyBinCount);

      this.analyser.getByteFrequencyData(array);
      const arrAvg = array.reduce((a, b) => a + b, 0) / array.length;
      // volumeBars.mono.style.height = arrAvg * 2 + "px";
      // volumeBars.mono.innerHTML = Math.floor(arrAvg);
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillStyle = "green";
      this.canvasContext.fillRect(0, 0, arrAvg, this.canvas.height);
    }
    requestAnimationFrame(() => this.renderCanvas());
  }

  // Lazy-initialize this context until we are ready for it!
  get audioContext(): AudioContext {
    if (this._audioContext) {
      return this._audioContext;
    }
    this._audioContext = new AudioContext();
    this.setupAnalyser();
    return this._audioContext;
  }

  // Lazy-initialize the destination node until we are ready for it!
  get destinationNode(): MediaStreamAudioDestinationNode {
    return (
      this._destinationNode ||
      (this._destinationNode = this.audioContext.createMediaStreamDestination())
    );
  }

  private setupAnalyser() {
    this.analyser = this._audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 64;
  }
}
