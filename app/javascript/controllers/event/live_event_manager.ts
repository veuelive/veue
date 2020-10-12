import EventManagerInterface from "controllers/event/event_manager_interface";
import consumer from "../../channels/consumer";
import { VideoEventProcessor } from "controllers/event/event_processor";
import { secureFetch } from "util/fetch";

export default class LiveEventManager implements EventManagerInterface {
  constructor() {
    consumer.subscriptions.create(
      {
        channel: "LiveVideoChannel",
        videoId: document
          .querySelector("*[data-audience-view-video-id]")
          .getAttribute("data-audience-view-video-id"),
      },
      this
    );

    secureFetch("./events/recent")
      .then((response) => response.json())
      .then((results) => {
        VideoEventProcessor.addEvents(results);
        // Do all events from a fraction from where we started, just in
        // case we are starting paused
        VideoEventProcessor.syncTime(100);
      });
  }

  received(data: never): void {
    VideoEventProcessor.addEvent(data);
  }

  seekTo(): Promise<void> {
    return Promise.resolve();
  }
}
