import { LiveEventSource } from "helpers/event/live_event_source";
import { VideoEvent } from "types/event_manager_interface";

export class SseEventSource implements LiveEventSource {
  private onMessage: (message: VideoEvent) => void;
  private channelId: string;
  private eventSource: EventSource;

  connect(channelId: string, onMessage: (message: VideoEvent) => void): void {
    this.onMessage = onMessage;
    this.channelId = channelId;

    this.eventSource = new EventSource("https://live.veue.tv/" + channelId);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessage(data);
    };
  }

  disconnect(): void {
    this.eventSource.close();
  }
}
