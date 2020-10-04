import { displayTime } from "util/time";
import Timecode from "util/timecode";

export default class {
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
      this.timecodeDisplayElement.innerText = displayTime(
        (Date.now() - this.startedAt) / 1000
      );
      this.drawTimecode(Date.now() - this.startedAt);
    }, 10);
  }

  stop(): void {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }

  private drawTimecode(msSinceStart: number) {
    const colorSequence = Timecode.numberToColors(msSinceStart);

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
