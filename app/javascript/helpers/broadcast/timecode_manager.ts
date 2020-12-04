import { displayTime } from "util/time";
import Timecode from "util/timecode";
import { VideoEventProcessor } from "helpers/event/event_processor";

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
      VideoEventProcessor.syncTime(this.timecodeMs);
    }, 10);
  }

  stop(): void {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }

  private drawTimecode() {}
}
