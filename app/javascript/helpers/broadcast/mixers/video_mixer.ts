import VideoLayout from "types/video_layout";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/video";
import Mixer from "helpers/broadcast/mixers/mixer";
import { buildBroadcastLayout } from "util/layout_packer";
import { sendBroadcastLayoutUpdate } from "helpers/broadcast_helpers";
import EventBus from "event_bus";

const VIDEO_SIZE = { width: 1920, height: 1080 };
export const BroadcastLayoutChangedEvent = "BroadcastLayoutChanged";
export const BroadcastLayoutNeedsRecalculation =
  "BroadcastLayoutNeedsRecalculation";

interface VideoShot {
  deviceId: string;
  deviceType: string;
  priority: number;
  image: Blob;
}

export default class VideoMixer implements Mixer {
  canvas: HTMLCanvasElement;

  private canvasContext: CanvasRenderingContext2D;
  public broadcastLayout: VideoLayout;
  private captureSources: VideoCaptureSource[] = [];

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "debug_canvas");
    this.canvas.setAttribute("width", VIDEO_SIZE.width.toString());
    this.canvas.setAttribute("height", VIDEO_SIZE.height.toString());
    document.querySelector(".debug-area--content").appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.imageSmoothingQuality = "high";

    this.updateBroadcastLayout();

    EventBus.subscribe(BroadcastLayoutNeedsRecalculation, () => {
      this.updateBroadcastLayout();
    });

    this.computeFrame();
  }

  private updateBroadcastLayout() {
    this.broadcastLayout = buildBroadcastLayout(
      VIDEO_SIZE,
      this.captureSources
    );

    sendBroadcastLayoutUpdate(this.broadcastLayout);
  }

  private computeFrame() {
    const videoSources = this.captureSources
      .filter((videoSource) => videoSource.element.isConnected)
      .sort((a, b) => a.layout.priority - b.layout.priority);

    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.broadcastLayout.sections
      .sort((a, b) => a.priority - b.priority)
      .forEach((broadcastPosition, index) => {
        const videoSource = videoSources[index];
        if (videoSource) {
          const sourceLocation = videoSource.layout;
          this.canvasContext.drawImage(
            videoSource.element,
            sourceLocation.x,
            sourceLocation.y,
            sourceLocation.width,
            sourceLocation.height,
            broadcastPosition.x,
            broadcastPosition.y,
            broadcastPosition.width,
            broadcastPosition.height
          );
        }
      });

    setTimeout(this.computeFrame.bind(this), 5);
  }

  addCaptureSource(captureSource: VideoCaptureSource): void {
    this.captureSources.push(captureSource);
    console.log(this.captureSources);
    this.captureSources = this.captureSources.sort(
      (a, b) => a.layout.priority - b.layout.priority
    );
    this.updateBroadcastLayout();
  }

  removeCaptureSource(_captureSource: VideoCaptureSource): void {
    this.captureSources = this.captureSources.filter(
      (source) => source.deviceId !== _captureSource.deviceId
    );
    this.updateBroadcastLayout();
  }

  async getVideoShots(): Promise<Array<VideoShot>> {
    return await Promise.all(
      this.captureSources.map(async (source) => {
        const image = await source.captureImage();
        return {
          priority: source.layout.priority,
          deviceId: source.deviceId,
          deviceType: source.videoSourceType,
          image,
        };
      })
    );
  }
}
