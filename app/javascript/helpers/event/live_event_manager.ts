import EventManagerInterface from "types/event_manager_interface";
import consumer from "../../channels/consumer";
import { VideoEventProcessor } from "helpers/event/event_processor";
import subscribeViewersChannel from "channels/active_viewers_channel";
import { secureFetch } from "util/fetch";

export default class LiveEventManager implements EventManagerInterface {
  private subscription;

  constructor() {
    console.log("hello world from LiveEventManager");
    subscribeViewersChannel();

    const videoId = getCurrentVideoId();
    setTimeout(() => {
      this.subscription = consumer.subscriptions.create(
        {
          channel: "LiveVideoChannel",
          videoId,
        },
        this
      );
    }, 100);

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

  received(data: never): void {
    VideoEventProcessor.addEvent(data);
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
