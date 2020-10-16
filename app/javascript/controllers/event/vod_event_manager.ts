import { secureFetch } from "../../util/fetch";
import { VideoEventProcessor } from "controllers/event/event_processor";
import EventManagerInterface from "controllers/event/event_manager_interface";

interface EventIndexEntry {
  url: string;
  start: bigint;
}

export default class VodEventManager implements EventManagerInterface {
  eventIndex: EventIndexEntry[];

  constructor(startAtMs: number) {
    secureFetch("./events")
      .then((response) => response.json())
      .then((eventIndex) => {
        this.eventIndex = eventIndex;
        return this.seekTo(startAtMs);
      });
  }

  seekTo(timecodeMs: number): Promise<void> {
    const nextEntry = this.eventIndex.find(
      (entry) => entry.start <= timecodeMs
    );
    return this.loadEventSet(nextEntry);
  }

  disconnect(): void {
    return;
  }

  loadEventSet(entry: EventIndexEntry): Promise<void> {
    return secureFetch(entry.url)
      .then((response) => response.json())
      .then((events) => VideoEventProcessor.addEvents(events));
  }
}
