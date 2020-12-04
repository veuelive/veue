import { UserMediaCaptureSource } from "helpers/broadcast/capture_sources/base";

export default class MicrophoneCaptureSource extends UserMediaCaptureSource {
  constructor(deviceId: string) {
    super();
    if (deviceId) {
      this.constraints = {
        audio: {
          deviceId: deviceId,
        },
        video: false,
      };
    } else {
      this.constraints = {
        audio: true,
        video: false,
      };
    }
  }
}
