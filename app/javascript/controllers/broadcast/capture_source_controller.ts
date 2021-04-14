import Handlebars from "handlebars";
import BaseController from "../base_controller";
import {
  AddDeviceAsCaptureSource,
  NewCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import MicrophoneCaptureSource from "helpers/broadcast/capture_sources/microphone";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export const captureSourceTemplate = Handlebars.compile(`
  <div class="capture-source" 
       data-controller="broadcast--capture-source" 
       data-broadcast--capture-source-id="{{captureSourceId}}"
       data-broadcast--capture-source-type="{{mediaType}}">
    MEDIA SOURCe
  </div>
`);

export default class MediaSourceController extends BaseController {
  static targets = ["id", "type"];

  private state: "connecting" | "on" | "off";
  private captureSource: CaptureSource;

  connect(): void {
    this.state = "connecting";
    this.connectToMediaDevice().then(() => "on");
  }

  async connectToMediaDevice(): Promise<void> {
    const type = this.data.get("type");
    if (type === "audioinput") {
      this.captureSource = await MicrophoneCaptureSource.connect(
        this.data.get("id")
      );
    } else if (type === "videoinput") {
      this.captureSource = await WebcamCaptureSource.connect(
        this.data.get("id")
      );
    }
    document.dispatchEvent(
      new CustomEvent(NewCaptureSourceEvent, { detail: this.captureSource })
    );
  }
}
