import { VideoEvent } from "types/event_manager_interface";

export interface LiveEventSource {
  connect(
    channelId: string,
    onMessage: (message: VideoEvent) => void
  ): Promise<void>;
  disconnect(): void;
}
