import { Controller } from "stimulus";
import FlashPhoner from "../flashphoner-webrtc-only";

const SESSION_STATUS = FlashPhoner.constants.SESSION_STATUS;
const STREAM_STATUS = FlashPhoner.constants.STREAM_STATUS;
const url = "ws://splinter.veue.cloud:8080";

export default class extends Controller {
  static targets = ["videoContainer", "debugCanvas"];
  readonly videoContainerTarget!: HTMLVideoElement;
  private debugCanvasTarget!: HTMLCanvasElement
  private streamKey: string;
  private debugCanvasContext: CanvasRenderingContext2D;
  private audioTrack: MediaStreamTrack;

  connect(): void {
    FlashPhoner.init({ url });

    this.streamKey = this.data.get("stream-key");

    this.debugCanvasContext = this.debugCanvasTarget.getContext("2d")

    navigator.getUserMedia({audio: true, video: true}, (mediaStream) => {
      this.videoContainerTarget.srcObject = mediaStream
      this.audioTrack = mediaStream.getAudioTracks()[0]
      // mediaStream.removeTrack(this.audioTrack)
      this.videoContainerTarget.play()
      this.timerCallback()
      this.startStreaming()
    }, (error) => {
      console.error("Something went wrong", error)
    })


  }

  private onStopped() {
    console.log("STOPPED");
  }

  startStreaming(): void {
    FlashPhoner.createSession({ urlServer: url })
        .on(SESSION_STATUS.ESTABLISHED, (session) => {
          //session connected, start streaming
          const mediaStream = this.debugCanvasTarget.captureStream(60) as MediaStream
          mediaStream.addTrack(this.audioTrack)
          session
              .createStream({
                name: this.streamKey,
                display: document.createElement("video"),
                constraints: {
                  customStream: mediaStream
                },
                rtmpUrl: "rtmps://global-live.mux.com:443/app"
              })
              .on(STREAM_STATUS.PUBLISHING, (publishStream) => {
                console.log(publishStream);
              })
              .on(STREAM_STATUS.UNPUBLISHED, function () {
                // setStatus(STREAM_STATUS.UNPUBLISHED);
                // //enable start button
                // onStopped();
              })
              .on(STREAM_STATUS.FAILED, function (stream) {
                // setStatus(STREAM_STATUS.FAILED, stream);
                // //enable start button
                // onStopped();
              })
              .publish();
        })
        .on(SESSION_STATUS.DISCONNECTED, () => {
          this.onStopped();
        })
        .on(SESSION_STATUS.FAILED, () => {
          this.onStopped();
        });

  }

  timerCallback(): void {
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 16); // roughly 60 frames per second
  }

  private computeFrame() {
    this.debugCanvasContext.drawImage(this.videoContainerTarget, 200, 200)
  }
}
