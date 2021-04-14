import { VideoEvent } from "types/event_manager_interface";

const ClearVideoEvent = new CustomEvent("clear");

export const VideoEventProcessor = new (class VideoEventProcessor {
  public dispatcher: HTMLDivElement;
  private events: VideoEvent[] = [];
  private lastTimecode: number;

  constructor() {
    this.dispatcher = document.createElement("div");
  }

  syncTime(timecodeMs: number) {
    while (this.events[0] && this.events[0].timecodeMs <= timecodeMs) {
      this.dispatch(this.events.shift());
    }
    this.lastTimecode = timecodeMs;
  }

  clear() {
    this.dispatcher.dispatchEvent(ClearVideoEvent);
    this.events = [];
    this.lastTimecode = 0;
  }

  addEvent(videoEvent: VideoEvent) {
    console.log("Adding event ", videoEvent);
    this.events.push(videoEvent);
    this.syncTime(this.lastTimecode);
  }

  addEvents(videoEvents: VideoEvent[]) {
    this.events = this.events.concat(videoEvents);
  }

  subscribeTo(videoEventType: string, callback: (ve) => void): void {
    this.dispatcher.addEventListener(videoEventType, callback);
  }

  dispatch(videoEvent: VideoEvent): void {
    console.log(
      "dispatching",
      videoEvent.type,
      videoEvent.timecodeMs,
      videoEvent.data
    );
    this.dispatcher.dispatchEvent(
      new CustomEvent(videoEvent.type, { detail: videoEvent })
    );
  }

  unsubscribeFrom(channel: string, callback: (ve) => void): void {
    this.dispatcher.removeEventListener(channel, callback);
  }
})();
