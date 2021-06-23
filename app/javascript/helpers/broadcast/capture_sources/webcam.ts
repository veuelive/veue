import { VideoSourceType } from "types/video_layout";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";

export class WebcamCaptureSource extends VideoCaptureSource {
  get videoSourceType(): VideoSourceType {
    return "camera";
  }

  static async connect(
    deviceId?: string,
    videoTag?: HTMLVideoElement
  ): Promise<WebcamCaptureSource> {
    const source = new WebcamCaptureSource(deviceId, videoTag);
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
    }
    return Promise.reject("No video media device found");
  }

  async getCapabilities(): Promise<MediaTrackCapabilities> {
    const mediaDeviceInfo = await this.findMediaDeviceInfo();

    // Typescript is convinced that this API doesn't exist, but it DOES in electron
    // so here we are casting this to a MediaStreamTrack, even though it isn't one.
    return (mediaDeviceInfo as unknown as MediaStreamTrack).getCapabilities();
  }

  async start(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.deviceId || "default",
        height: 1440,
        width: 1080,
      },
      audio: false,
    });
    await this.processMediaStream(this.mediaStream, this.videoTag);
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
