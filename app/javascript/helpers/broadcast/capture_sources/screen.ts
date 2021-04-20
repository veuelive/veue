import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";
import { VideoSourceType } from "types/video_layout";

export class ScreenCaptureSource extends VideoCaptureSource {
  get videoSourceType(): VideoSourceType {
    return "screen";
  }

  static async connect(
    videoTag: HTMLVideoElement
  ): Promise<ScreenCaptureSource> {
    try {
      const screenCaptureSource = new ScreenCaptureSource();
      await screenCaptureSource.start(videoTag);
      return screenCaptureSource;
    } catch (e) {
      console.error("Failed to start screen capture ", e);
      return Promise.reject(e);
    }
  }

  private async start(video: HTMLVideoElement): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getDisplayMedia();

    const videoTag = await this.processMediaStream(this.mediaStream, video);

    this.layout = {
      width: videoTag.videoWidth,
      height: videoTag.videoHeight,
      x: 0,
      y: 0,
      type: "screen",
      priority: 1,
    };
  }
}
