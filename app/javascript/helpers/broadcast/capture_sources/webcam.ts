import { VideoCaptureSource } from "helpers/broadcast/capture_sources/base";

export class WebcamCaptureSource extends VideoCaptureSource {
  static async connect(deviceId?: string): Promise<WebcamCaptureSource> {
    const source = new WebcamCaptureSource(deviceId);
    await source.start();
    return source;
  }

  async start(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.deviceId || "default",
      },
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
