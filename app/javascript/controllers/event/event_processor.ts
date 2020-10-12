interface VideoEvent {
  type: string;
  payload: Record<string, unknown>;
  timestampMs: bigint;
}

const ClearVideoEvents = new CustomEvent("clear");

export const VideoEventProcessor = new (class VideoEventProcessor {
  public immediateDispatcher: HTMLDivElement;
  public syncDispatcher: HTMLDivElement;
  private events: VideoEvent[] = [];
  private lastTimecode: bigint;

  constructor() {
    this.syncDispatcher = document.createElement("div");
    this.immediateDispatcher = document.createElement("div");
  }

  clear() {
    this.immediateDispatcher.dispatchEvent(ClearVideoEvents);
    this.events = [];
  }

  addEvent(videoEvent: VideoEvent) {
    this.events.push(videoEvent);
    this.dispatchImmediateEvent(videoEvent);
  }

  addEvents(videoEvents: VideoEvent[]) {
    this.events = this.events.concat(videoEvents);
    videoEvents.forEach((e) => this.dispatchImmediateEvent(e));
  }

  subscribeToImmediate(videoEventType: string, callback: (ve) => void): void {
    this.immediateDispatcher.addEventListener(videoEventType, callback);
  }

  subscribeToSyncDispatch(videoEventType: string, callback: ve);

  syncTo(lastTimecode: number) {}

  private;

  dispatchImmediateEvent(videoEvent: VideoEvent): void {
    this.immediateDispatcher.dispatchEvent(
      new CustomEvent(videoEvent.type, { detail: videoEvent })
    );
  }
})();
