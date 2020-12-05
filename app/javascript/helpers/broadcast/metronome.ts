import { displayTime } from "util/time";
import { VideoEventProcessor } from "helpers/event/event_processor";

export default class Metronome {
  public timecodeMs: number;
  private timecodeDisplayElement: HTMLElement;
  private startedAt: number;
  private tickInterval?;

  constructor() {
    this.timecodeDisplayElement = document.getElementById("timecodeDisplay");
  }

  start(): void {
    this.startedAt = Date.now();
    this.tickInterval = setInterval(() => {
      this.timecodeMs = Date.now() - this.startedAt;
      this.timecodeDisplayElement.innerHTML = displayTime(this.timecodeMs);
      globalThis.timecodeMs = this.timecodeMs;
      VideoEventProcessor.syncTime(this.timecodeMs);
    }, 10);
  }

  stop(): void {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }
}
