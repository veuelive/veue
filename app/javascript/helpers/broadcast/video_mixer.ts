import { Rectangle } from "types/rectangle";
import { desktopCapturer } from "helpers/electron/desktop_capture";
import Sizes from "types/sizes";
import { MediaDeviceChangeEvent } from "controllers/broadcast/media_manager_controller";
import { BroadcastVideoLayout } from "types/video_layout";
import { CaptureSourceBase } from "helpers/broadcast/capture_sources/base";
import { displayTime } from "util/time";
import Timecode from "util/timecode";

export default class VideoMixer {
  canvas: CaptureStreamCanvas;

  private canvasContext: CanvasRenderingContext2D;
  private captureSources: CaptureSourceBase[] = [];
  private broadcastLayout: BroadcastVideoLayout;

  constructor(broadcastLayout: BroadcastVideoLayout) {
    this.broadcastLayout = broadcastLayout;
    this.canvas = document.createElement("canvas") as CaptureStreamCanvas;
    this.canvas.setAttribute("id", "debug_canvas");
    this.canvas.setAttribute("width", broadcastLayout.width.toString());
    this.canvas.setAttribute("height", broadcastLayout.height.toString());
    document.querySelector(".debug-area").appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d");
  }

  addCaptureSource(captureSource: CaptureSourceBase): void {
    this.captureSources.push(captureSource);
  }

  private computeFrame() {
    const videoSources = this.captureSources.flatMap(
      (source) => source.videoSources
    );

    this.broadcastLayout.sections
      .sort((a, b) => a.priority - b.priority)
      .forEach((broadcastPosition, index) => {
        const videoSource = videoSources[index];
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
      });
    requestAnimationFrame(() => this.computeFrame());
  }

  private drawTimecode() {
    const timecodeLayout = this.broadcastLayout.timecode;
    const colorSequence = Timecode.numberToColors(globalThis.timecodeMs);
    const digitWidth = timecodeLayout.width / colorSequence.length;

    colorSequence.forEach((color, index) => {
      this.canvasContext.fillStyle = color;
      const x =
        timecodeLayout.width -
        Timecode.digitWidth * (index + 1) +
        timecodeLayout.x;
      this.canvasContext.fillRect(
        x,
        timecodeLayout.y,
        Timecode.digitWidth,
        timecodeLayout.height
      );
    });
  }
}

export interface CaptureStreamCanvas extends HTMLCanvasElement {
  captureStream(fps: number): MediaStream;
}
