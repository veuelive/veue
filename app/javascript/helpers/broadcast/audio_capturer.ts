import StreamCapturer from "helpers/broadcast/stream_capturer";
import { MediaDeviceChangeEvent } from "controllers/broadcast/media_manager_controller";

export default class AudioCapturer {
  private _audioTrack: MediaStreamTrack;
  private streamCapturer: StreamCapturer;
  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private canvasCtx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(streamCapturer: StreamCapturer) {
    this.streamCapturer = streamCapturer;

    this.canvas = document.createElement("canvas");
    this.canvas.height = 20;
    const webcam = document.getElementById(
      "webcam_preview"
    ) as HTMLVideoElement;
    webcam.insertAdjacentElement("afterend", this.canvas);
    this.canvas.width = webcam.clientWidth;
    this.canvasCtx = this.canvas.getContext("2d");

    this.renderCanvas();

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          volume: 0,
        },
      })
      .then((mediaStream) => {
        this.useMediaStream(mediaStream);
      });

    document.addEventListener(
      MediaDeviceChangeEvent,
      (ev: CustomEvent<MediaDeviceInfo>) => {
        if (ev.detail.kind === "audioinput") {
          navigator.mediaDevices
            .getUserMedia({
              audio: {
                deviceId: ev.detail.deviceId,
                volume: 0,
              },
            })
            .then((mediaStream) => {
              this.useMediaStream(mediaStream);
            });
        }
      }
    );
  }

  renderCanvas(): void {
    if (this.analyser) {
      const array = new Uint8Array(this.analyser.frequencyBinCount);

      this.analyser.getByteFrequencyData(array);
      const arrAvg = array.reduce((a, b) => a + b, 0) / array.length;
      // volumeBars.mono.style.height = arrAvg * 2 + "px";
      // volumeBars.mono.innerHTML = Math.floor(arrAvg);
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasCtx.fillStyle = "green";
      this.canvasCtx.fillRect(0, 0, arrAvg, this.canvas.height);
    }
    requestAnimationFrame(() => this.renderCanvas());
  }

  set audioTrack(audioTrack: MediaStreamTrack) {
    this._audioTrack = audioTrack;
    this.streamCapturer.audioTrack = audioTrack;
    this.deviceId = audioTrack.getSettings().deviceId;
  }

  set deviceId(deviceId: string) {
    document.body.setAttribute("data-audio-device-id", deviceId);
  }

  private useMediaStream(mediaStream: MediaStream) {
    this.audioCtx = new AudioContext();

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 1024;
    const mediaSource = this.audioCtx.createMediaStreamSource(mediaStream);
    mediaSource.connect(this.analyser);
    this.audioTrack = mediaStream.getAudioTracks()[0];
  }
}
