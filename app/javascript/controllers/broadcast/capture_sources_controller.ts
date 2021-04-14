import BaseController from "../base_controller";
import { captureSourceTemplate } from "controllers/broadcast/capture_source_controller";

export default class extends BaseController {
  static targets = ["mediaDeck"];

  private mediaDeckTarget!: HTMLDivElement;

  connect(): void {
    this.connectDefaultDevices();
  }

  connectDefaultDevices(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      ["audioinput", "videoinput"].forEach((type) => {
        const defaultDevice = devices.find(
          (mediaDeviceInfo) => mediaDeviceInfo.kind === type
        );
        if (defaultDevice) {
          this.addCaptureSource(defaultDevice);
        }
      });
    });
  }

  addCaptureSource(mediaDeviceInfo: MediaDeviceInfo): void {
    this.element.innerHTML += captureSourceTemplate({
      captureSourceId: mediaDeviceInfo.deviceId,
      mediaType: mediaDeviceInfo.kind,
    });
  }
}
