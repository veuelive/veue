import { UserMediaCaptureSource } from "helpers/broadcast/capture_sources/base";

export class WebcamCaptureSource extends UserMediaCaptureSource {
  constructor(deviceId: string) {
    super();
    if (deviceId) {
      this.constraints = {
        video: {
          deviceId: deviceId,
        },
        audio: false,
      };
    } else {
      this.constraints = {
        video: true,
        audio: false,
      };
    }
  }
}
