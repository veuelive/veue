import EventManagerInterface from "types/event_manager_interface";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { secureFetch } from "util/fetch";
import { getChannelId } from "helpers/channel_helpers";
import { EventReceiver } from "helpers/event/event_receiver";

export const ViewerCountUpdateEvent = "ViewerCountUpdate";

export default class LiveEventManager implements EventManagerInterface {
  private eventReceiver: EventReceiver;

  constructor(allowRemoteReload: boolean) {
    const channelId = getChannelId();

    this.eventReceiver = new EventReceiver(allowRemoteReload);

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
    this.eventReceiver.unsubscribe();
  }

  async received(event: MessageEvent): Promise<void> {
    const data = JSON.parse(event.data);
    console.log("Data: ", data);
    await this.eventReceiver.received(data);
  }

  seekTo(): Promise<void> {
    return Promise.resolve();
  }
}
