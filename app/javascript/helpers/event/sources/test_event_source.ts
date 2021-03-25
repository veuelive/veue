import { LiveEventSource } from "helpers/event/live_event_source";
import { VideoEvent } from "types/event_manager_interface";

export class TestEventSource implements LiveEventSource {
  connect(channelId: string, onMessage: (message: VideoEvent) => void): void {
    console.log("USING TestEventSource");
    globalThis.sendLiveEvent = (videoEvent: VideoEvent) => {
      console.log("Received message ", videoEvent);
      setTimeout(() => {
        onMessage(videoEvent);
      }, 100); // Very small delay to help it be more realistic
    };
  }

  disconnect(): void {
    globalThis.sendLiveEvent = null;
  }
}
