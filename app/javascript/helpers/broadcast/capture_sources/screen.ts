import {
  CaptureSource,
  VideoCaptureSource,
} from "helpers/broadcast/capture_sources/base";
import { desktopCapturer } from "helpers/electron/desktop_capture";
import VideoLayout from "types/video_layout";

export class ScreenCaptureSource extends VideoCaptureSource {
  constructor() {
    super();
  }

  public async start(
    videoLayout: VideoLayout,
    windowTitle: string
  ): Promise<void> {
    this.deviceId = await ScreenCaptureSource.getWindowSource(windowTitle);
    const captureArea = videoLayout.sections[0];

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: this.deviceId,
        },
      },
    } as Record<string, unknown>);

    await this.processMediaStream(this.mediaStream);
    const pixelDensity = this.element.videoWidth / videoLayout.width;
    this.layout = {
      width: captureArea.width * pixelDensity,
      height: captureArea.height * pixelDensity,
      x: captureArea.x * pixelDensity,
      y: captureArea.y * pixelDensity,
      type: "screen",
      priority: 1,
    };
  }

  static async getWindowSource(windowTitle: string): Promise<string> {
    let source;

    while (!source) {
      const sources = await desktopCapturer.getSources({ types: ["window"] });
      source = sources.find((source) => source.name === windowTitle);
    }
    return source.id;
  }
}
