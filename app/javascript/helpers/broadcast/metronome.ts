import { displayTime } from "util/time";
import { VideoEventProcessor } from "helpers/event/event_processor";

export default class Metronome {
  public timecodeMs: number;
  private timecodeDisplayElement: HTMLElement;
  private startedAt: number;
  private tickInterval: number;

  constructor() {
    this.timecodeDisplayElement = document.getElementById("timecodeDisplay");
  }

  start(): void {
    this.startedAt = Date.now();

    // For some reason, typescript will think that this `setInterval` is a NodeJS function
    // instead of the DOM's setInterval... so here, we make it very clear!
    this.tickInterval = window.setInterval(() => {
      this.timecodeMs = Date.now() - this.startedAt;
      console.log(this.timecodeMs);
      this.timecodeDisplayElement.innerHTML = displayTime(
        this.timecodeMs / 1000
      );
      globalThis.timecodeMs = this.timecodeMs;
      VideoEventProcessor.syncTime(this.timecodeMs);
    }, 10);
  }

  stop(): void {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }
}
