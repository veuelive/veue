import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export default class MicrophoneCaptureSource extends CaptureSource {
  constructor(deviceId?: string) {
    super();
    this.deviceId = deviceId;
  }

  async start(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: this.deviceId,
      },
    });
  }
}
