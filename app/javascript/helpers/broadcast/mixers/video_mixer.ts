import { BroadcastVideoLayout } from "types/video_layout";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/base";
import Timecode from "util/timecode";
import Mixer from "helpers/broadcast/mixers/mixer";
import { buildBroadcastLayout } from "util/layout_packer";
import { sendBroadcastLayoutUpdate } from "helpers/broadcast_helpers";

const VIDEO_SIZE = { width: 1920, height: 1080 };
export const BroadcastLayoutChangedEvent = "BroadcastLayoutChanged";

export default class VideoMixer implements Mixer {
  canvas: HTMLCanvasElement;

  private canvasContext: CanvasRenderingContext2D;
  public broadcastLayout: BroadcastVideoLayout;
  private captureSources: VideoCaptureSource[] = [];

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "debug_canvas");
    this.canvas.setAttribute("width", VIDEO_SIZE.width.toString());
    this.canvas.setAttribute("height", VIDEO_SIZE.height.toString());
    document.querySelector(".debug-area--content").appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d");

    this.updateBroadcastLayout();

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

    this.drawTimecode();
    requestAnimationFrame(() => this.computeFrame());
  }

  private drawTimecode() {
    const timecodeLayout = this.broadcastLayout.timecode;
    const colorSequence = Timecode.numberToColors(
      globalThis.timecodeMs || 0,
      timecodeLayout.digits
    );

    const digitWidth = timecodeLayout.width / colorSequence.length;

    colorSequence.reverse().forEach((color, index) => {
      this.canvasContext.fillStyle = color;
      this.canvasContext.fillRect(
        timecodeLayout.x + digitWidth * index,
        timecodeLayout.y,
        digitWidth,
        timecodeLayout.height
      );
    });
  }

  addCaptureSource(captureSource: VideoCaptureSource): void {
    this.captureSources.push(captureSource);
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

  async getVideoShots(): Promise<Array<Blob>> {
    return await Promise.all(
      this.captureSources.map((source) => source.captureImage())
    );
  }
}
