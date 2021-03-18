import consumer from "./consumer";
import { getChannelId } from "helpers/channel_helpers";
import { getVideoStreamType } from "helpers/video_helpers";
import { secureFetch } from "util/fetch";
import { VideoEvent, VideoEventProcessor } from "helpers/event/event_processor";
import { ViewerCountUpdateEvent } from "helpers/event/live_event_manager";

interface VideoData extends VideoEvent {
  viewers: number;
  state?: string;
}

const chattableStreamTypes = ["live", "upcoming"];

const channelElementId = "channels-channel-cable";

function createChannel() {
  // We only connect to websockets for live / upcoming videos.
  if (!chattableStreamTypes.includes(getVideoStreamType())) {
    return;
  }

  if (document.querySelector(`#${channelElementId}`)) {
    return;
  }

  const chan = document.createElement("div");
  chan.style.display = "none";
  chan.id = channelElementId;
  document.body.appendChild(chan);

  const channelId = getChannelId();

  consumer.subscriptions.create(
    { channel: "ChannelsChannel", room: channelId },
    {
      initialized(): void {
        secureFetch(`/${channelId}/events`)
          .then((response) => response.json())
          .then((results) => {
            VideoEventProcessor.addEvents(results);
            // Do all events from a fraction from where we started, just in
            // case we are starting paused
            VideoEventProcessor.syncTime(100);
          });
      },
      connected(): void {
        // Called when the subscription is ready for use on the server
        console.log("Connected to channel");
      },

      disconnected(): void {
        // Called when the subscription has been terminated by the server
        console.log("Disconnected from channel");
      },

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
      },

      async reload(): Promise<void> {
        document.location.reload();
      },

      get allowRemoteReload(): boolean {
        // Dont reload from the broadcaster
        const broadcast = document.querySelector("#broadcast");

        if (broadcast) {
          return false;
        }

        return true;
      },
    }
  );
}

// Load right away
createChannel();

// Sometimes you have to wait for all content to be loaded like in the broadcaster.
document.addEventListener("DOMContentLoaded", createChannel);
