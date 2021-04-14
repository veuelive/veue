import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";
import { desktopCapturer } from "helpers/electron/desktop_capture";
import VideoLayout, { VideoSourceType } from "types/video_layout";

export class ScreenCaptureSource extends VideoCaptureSource {
  get videoSourceType(): VideoSourceType {
    return "screen";
  }

  static async connect(videoLayout: VideoLayout): Promise<ScreenCaptureSource> {
    const windowTitle = "Veue Broadcaster";
    const deviceId = await ScreenCaptureSource.getWindowSource(windowTitle);
    console.log(
      `DesktopCapture selected deviceId ${deviceId} because it matched window title ${windowTitle}`
    );
    try {
      const source = new ScreenCaptureSource(deviceId);
      console.log("Starting source... ", source);
      await source.start();
      console.log("Started source", source);
      source.addLayout(videoLayout);
      console.log("Source using video layout", videoLayout);
      return source;
    } catch (e) {
      console.error("Failed to start screen capture ", e);
      return Promise.reject(e);
    }
  }

  private addLayout(videoLayout: VideoLayout) {
    const captureArea = videoLayout.sections[0];
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

  private async start(): Promise<void> {
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
