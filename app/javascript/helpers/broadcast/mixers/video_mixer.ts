import { BroadcastVideoLayout } from "types/video_layout";
import { VideoCaptureSource } from "helpers/broadcast/capture_sources/base";
import Timecode from "util/timecode";
import Mixer from "helpers/broadcast/mixers/mixer";

export default class VideoMixer implements Mixer {
  canvas: CaptureStreamCanvas;

  private canvasContext: CanvasRenderingContext2D;
  private broadcastLayout: BroadcastVideoLayout;
  private captureSources: VideoCaptureSource[] = [];

  constructor(broadcastLayout: BroadcastVideoLayout) {
    this.broadcastLayout = broadcastLayout;
    this.canvas = document.createElement("canvas") as CaptureStreamCanvas;
    this.canvas.setAttribute("id", "debug_canvas");
    this.canvas.setAttribute("width", broadcastLayout.width.toString());
    this.canvas.setAttribute("height", broadcastLayout.height.toString());
    document.querySelector(".debug-area").appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d");

    this.computeFrame();
  }

  private computeFrame() {
    const videoSources = this.captureSources.filter(
      (videoSource) => videoSource.element.isConnected
    );

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
  }

  removeCaptureSource(_captureSource: VideoCaptureSource): void {
    this.captureSources = this.captureSources.filter(
      (source) => source.deviceId !== _captureSource.deviceId
    );
  }

  async getVideoShots(): Promise<Array<Blob>> {
    return await Promise.all(
      this.captureSources.map((source) => source.captureImage())
    );
  }
}

export interface CaptureStreamCanvas extends HTMLCanvasElement {
  captureStream(fps: number): MediaStream;
}
