// Websocket consumer
import consumer from "channels/consumer";
import { Channel } from "actioncable";

import { VideoEvent, VideoEventProcessor } from "helpers/event/event_processor";
import { ViewerCountUpdateEvent } from "helpers/event/live_event_manager";
import { getChannelId } from "helpers/channel_helpers";

interface VideoData extends VideoEvent {
  viewers: number;
  state?: string;
}

export class EventReceiver {
  allowRemoteReload: boolean;
  receiver: Channel;

  constructor(allowRemoteReload: boolean) {
    this.allowRemoteReload = allowRemoteReload;
    this.receiver = this.createWebsocketConnection();
  }

  connected(): void {
    console.log("Connected to channel");

    if (this.allowRemoteReload) {
      console.log("ALLOWING REMOTE RELOAD");
    }
  }

  disconnected(): void {
    console.log("Disconnected from channel");
  }

  unsubscribe(): void {
    this.receiver.unsubscribe();
  }

  async received(data: VideoData): Promise<void> {
    if (this.allowRemoteReload && data.state === "live") {
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

  createWebsocketConnection(): Channel {
    return consumer.subscriptions.create(
      { channel: "ChannelsChannel", room: getChannelId() },
      {
        connected: this.connected.bind(this),
        disconnected: this.disconnected.bind(this),
        reload: this.reload.bind(this),
        received: this.received.bind(this),
        seekTo: this.seekTo.bind(this),
      }
    );
  }

  // createSseConnection(): void {
  //   this.receiver = new EventSource(
  //     "https://leghorn.onrender.com/" + channelId
  //   );

  //   this.receiver.onmessage = (event) => this.received(event);
  // }
}
