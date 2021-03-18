import { VideoCaptureSource } from "helpers/broadcast/capture_sources/base";

export class WebcamCaptureSource extends VideoCaptureSource {
  static async connect(deviceId?: string): Promise<WebcamCaptureSource> {
    const source = new WebcamCaptureSource(deviceId);
    await source.start();
    return source;
  }

  protected createVideoElement(): HTMLVideoElement {
    return document.querySelector("#webcam_preview");
  }

  async findMediaDeviceInfo(): Promise<MediaDeviceInfo> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const deviceId = this.deviceId || "default";

    console.log(devices);

    const videoDevices = devices.filter((value) => value.kind === "videoinput");

    const device = videoDevices.find(
      (mediaDevice) => mediaDevice.deviceId === deviceId
    );

    if (device) {
      return device;
    } else if (videoDevices.length > 0) {
      return videoDevices[0];
    } else {
      return Promise.reject("No video media device found");
    }
  }

  async getCapabilities(): Promise<MediaTrackCapabilities> {
    const mediaDeviceInfo = await this.findMediaDeviceInfo();

    // Typescript is convinced that this API doesn't exist, but it DOES in electron
    // so here we are casting this to a MediaStreamTrack, even though it isn't one.
    return ((mediaDeviceInfo as unknown) as MediaStreamTrack).getCapabilities();
  }

  async start(): Promise<void> {
    const capabilities = await this.getCapabilities();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.deviceId || "default",
        height: capabilities.height.max || capabilities.height,
        width: capabilities.width.max || capabilities.width,
      },
      audio: false,
    });
    console.log(this.mediaStream);
    await this.processMediaStream(this.mediaStream);
    console.log("Video element", this.element);
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
