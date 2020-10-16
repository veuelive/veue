import { displayTime } from "util/time";
import Timecode from "util/timecode";
import { post } from "util/fetch";

export default class {
  public timecodeMs: number;
  private timecodeDisplayElement;
  private canvasContext;
  private canvas;
  private startedAt: number;
  private tickInterval?;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.timecodeDisplayElement = document.getElementById("timecodeDisplay");
  }

  start(): void {
    this.startedAt = Date.now();
    this.tickInterval = setInterval(() => {
      this.timecodeMs = Date.now() - this.startedAt;
      this.drawTimecode();
    }, 10);
  }

  stop(): void {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }

  private drawTimecode() {
    this.timecodeDisplayElement.innerText = displayTime(this.timecodeMs / 1000);
    const colorSequence = Timecode.numberToColors(this.timecodeMs);

    colorSequence.forEach((color, index) => {
      this.canvasContext.fillStyle = color;
      const x = this.canvas.width - Timecode.digitWidth * (index + 1);
      this.canvasContext.fillRect(
        x,
        this.canvas.height - Timecode.digitHeight,
        Timecode.digitWidth,
        Timecode.digitHeight
      );
    });
  }
}
