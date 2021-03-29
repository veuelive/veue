import { LiveEventSource } from "helpers/event/live_event_source";
import { VideoEvent } from "types/event_manager_interface";

export class SseEventSource implements LiveEventSource {
  private onMessage: (message: VideoEvent) => void;
  private channelId: string;
  private eventSource: EventSource;

  connect(
    channelId: string,
    onMessage: (message: VideoEvent) => void
  ): Promise<void> {
    this.onMessage = onMessage;
    this.channelId = channelId;

    const sse_url = "https://live.veue.tv/" + channelId;
    this.eventSource = new EventSource(sse_url);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessage(data);
    };

    return new Promise((resolve, reject) => {
      const connectionResolver = () => {
        switch (this.eventSource.readyState) {
          case EventSource.CONNECTING:
            setTimeout(connectionResolver, 100);
            break;
          case EventSource.CLOSED:
            return reject("Couldn't connect to Event Source " + sse_url);
          case EventSource.OPEN:
            return resolve();
        }
      };
      connectionResolver();
    });
  }

  disconnect(): void {
    this.eventSource.close();
  }
}
