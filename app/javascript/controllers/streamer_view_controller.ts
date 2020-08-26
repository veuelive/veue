import { Controller } from "stimulus";
import FlashPhoner from "../flashphoner-webrtc-only";

const SESSION_STATUS = FlashPhoner.constants.SESSION_STATUS;
const STREAM_STATUS = FlashPhoner.constants.STREAM_STATUS;

export default class extends Controller {
  static targets = ["videoContainer"];
  readonly videoContainerTarget!: HTMLDivElement;
  private streamKey: string;

  connect(): void {
    const url = "ws://splinter.veue.cloud:8080";
    FlashPhoner.init({url})

    this.streamKey = this.data.get("stream-key")

    FlashPhoner.createSession({urlServer: url}).on(SESSION_STATUS.ESTABLISHED, (session) => {
      //session connected, start streaming
      console.log("We're streaming")
      this.startStreaming(session)
    }).on(SESSION_STATUS.DISCONNECTED, () => {
      this.onStopped();
    }).on(SESSION_STATUS.FAILED, () => {
      this.onStopped();
    });

    window.postMessage(
        {
          type: "veue",
          action: "inject",
          krang: this.data.get("krang-js-path"),
          tox_path: this.data.get("tox-js-path"),
        },
        "*"
    );
  }

  private onStopped() {
    console.log("STOPPED")
  }

  startStreaming(session): void {
    session.createStream({
      name: this.streamKey + "-cam",
      display: this.videoContainerTarget,
      cacheLocalResources: true,
      receiveVideo: false,
      receiveAudio: false
    }).on(STREAM_STATUS.PUBLISHING, (publishStream) => {
      console.log(publishStream)

    }).on(STREAM_STATUS.UNPUBLISHED, function(){
      // setStatus(STREAM_STATUS.UNPUBLISHED);
      // //enable start button
      // onStopped();
    }).on(STREAM_STATUS.FAILED, function(stream){
      // setStatus(STREAM_STATUS.FAILED, stream);
      // //enable start button
      // onStopped();
    }).publish();
  }
}
