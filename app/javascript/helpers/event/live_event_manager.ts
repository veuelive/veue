import EventManagerInterface from "types/event_manager_interface";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { secureFetch } from "util/fetch";

export const ViewerCountUpdateEvent = "ViewerCountUpdate";

export default class LiveEventManager implements EventManagerInterface {
  private subscription;
  private eventSource: EventSource;
  private allowRemoteReload: boolean;

  constructor(allowRemoteReload: boolean) {
    this.allowRemoteReload = allowRemoteReload;
    const videoId = getCurrentVideoId();

    this.eventSource = new EventSource(
      "https://leghorn.onrender.com/videos/" + getCurrentVideoId()
    );

    this.eventSource.onmessage = (event) => this.received(event);

    secureFetch(`/videos/${videoId}/events/recent`)
      .then((response) => response.json())
      .then((results) => {
        VideoEventProcessor.addEvents(results);
        // Do all events from a fraction from where we started, just in
        // case we are starting paused
        VideoEventProcessor.syncTime(100);
      });
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  async received(event: MessageEvent): Promise<void> {
    const data = JSON.parse(event.data);
    if (this.allowRemoteReload && data?.state === "live") {
      await this.reload();
    }
    VideoEventProcessor.addEvent(data);
    if (data.viewers) {
      document.dispatchEvent(
        new CustomEvent(ViewerCountUpdateEvent, { detail: data.viewers })
      );
    }
  }

  async reload(): Promise<void> {
    document.location.reload();
  }

  seekTo(): Promise<void> {
    return Promise.resolve();
  }
}

export function getCurrentVideoId(): string {
  return document
    .querySelector("*[data-video-id]")
    .getAttribute("data-video-id");
}
