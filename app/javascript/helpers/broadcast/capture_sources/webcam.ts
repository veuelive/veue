import { VideoCaptureSource } from "helpers/broadcast/capture_sources/base";

export class WebcamCaptureSource extends VideoCaptureSource {
  constructor(deviceId?: string) {
    super();
    this.deviceId = deviceId;
  }

  async start(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    await this.processMediaStream(this.mediaStream);
    this.layout = {
      width: this.element.videoWidth,
      height: this.element.videoHeight,
      x: 0,
      y: 0,
      type: "camera",
      priority: 2,
    };
  }
}
