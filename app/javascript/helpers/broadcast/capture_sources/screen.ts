import { CaptureSourceBase } from "helpers/broadcast/capture_sources/base";
import { desktopCapturer } from "helpers/electron/desktop_capture";
import VideoLayout, { LayoutSection } from "types/video_layout";

export class ScreenCaptureSource extends CaptureSourceBase {
  constructor(deviceId: string) {
    super();
    this.deviceId = deviceId;
  }

  public async start(videoLayout: VideoLayout): Promise<void> {
    const captureArea = videoLayout.sections[0];

    await this.addMediaStream(
      await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: this.deviceId,
          },
        } as Record<string, unknown>,
      }),
      (videoElement: HTMLVideoElement) => {
        const pixelDensity = videoElement.videoWidth / videoLayout.width;
        return {
          width: captureArea.width * pixelDensity,
          height: captureArea.height * pixelDensity,
          x: captureArea.x * pixelDensity,
          y: captureArea.y * pixelDensity,
          type: "screen",
          priority: 1,
        };
      }
    );
  }

  static async getWindowSource(windowTitle: string): Promise<string> {
    let source;

    while (!source) {
      const sources = await desktopCapturer.getSources({ types: ["window"] });
      source = sources.find((source) => source.name === windowTitle);
    }
    return source;
  }
}
