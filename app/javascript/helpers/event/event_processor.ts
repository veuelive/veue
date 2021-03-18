interface VideoEvent {
  type: string;
  data: Record<string, unknown>;
  timecodeMs: number;
}

export const ClearVideoEvent = "clear";
const ClearVideoCustomEvent = new CustomEvent(ClearVideoEvent);

export const VideoEventProcessor = new (class VideoEventProcessor {
  public dispatcher: HTMLDivElement;
  private events: VideoEvent[] = [];
  private lastTimecode: number;

  constructor() {
    this.dispatcher = document.createElement("div");
  }

  syncTime(timecodeMs: number) {
    while (this.events[0] && this.events[0].timecodeMs <= timecodeMs) {
      const currentEvent = this.events.shift();
      this.dispatch(currentEvent);
    }

    this.lastTimecode = timecodeMs;
  }

  clear() {
    this.dispatcher.dispatchEvent(ClearVideoCustomEvent);
    this.events = [];
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
