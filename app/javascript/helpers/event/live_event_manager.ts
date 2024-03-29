import EventManagerInterface, {
  VideoEvent,
} from "types/event_manager_interface";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { secureFetch } from "util/fetch";
import { getChannelId } from "helpers/channel_helpers";
import { SseEventSource } from "helpers/event/sources/sse_event_source";
import { LiveEventSource } from "helpers/event/live_event_source";

export const ViewerCountUpdateEvent = "ViewerCountUpdate";

export default class LiveEventManager implements EventManagerInterface {
  private subscription;
  private allowRemoteReload: boolean;
  private liveEventSource: LiveEventSource;
  private startOffsetMs: number;

  constructor(allowRemoteReload: boolean) {
    const element = document.querySelector(
      "div[data-started-at-ms]"
    ) as HTMLElement;
    if (element) {
      const startOffsetMs = Date.now() - parseInt(element.dataset.startedAtMs);
      VideoEventProcessor.setStartOffset(startOffsetMs);
    }

    this.allowRemoteReload = allowRemoteReload;

    const channelId = getChannelId();

    this.liveEventSource = new SseEventSource();

    this.liveEventSource
      .connect(channelId, (event) => this.received(event))
      .then(() => {
        console.debug("Connected to SSE Endpoint");
        // This is useful for tests!
        document.body.dataset.liveEventSource = "connected";
      })
      .catch((error) => console.error(error));

    secureFetch(`/${channelId}/events`)
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

  async received(data: VideoEvent): Promise<void> {
    if (this.allowRemoteReload && data.state === "live") {
      await this.reload();
    }
    VideoEventProcessor.dispatch(data);
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
