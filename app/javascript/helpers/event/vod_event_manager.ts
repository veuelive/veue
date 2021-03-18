import { secureFetch } from "../../util/fetch";
import { VideoEventProcessor } from "helpers/event/event_processor";
import EventManagerInterface from "types/event_manager_interface";

interface EventIndexEntry {
  url: string;
  start: bigint;
}

export default class VodEventManager implements EventManagerInterface {
  eventIndex: EventIndexEntry[];

  constructor(startAtMs: number) {
    this.playEventsAt(startAtMs, { syncTime: true });
  }

  playEventsAt(startAtMs: number, { syncTime = false } = {}): void {
    secureFetch("./events")
      .then((response) => response.json())
      .then((eventIndex) => {
        this.eventIndex = eventIndex;
        return this.seekTo(startAtMs, { syncTime });
      });
  }

  seekTo(timecodeMs: number, { syncTime = false } = {}): Promise<void> {
    const nextEntry = this.eventIndex.find(
      (entry) => entry.start <= timecodeMs
    );
    return this.loadEventSet(nextEntry, timecodeMs, { syncTime });
  }

  disconnect(): void {
    return;
  }

  loadEventSet(
    entry: EventIndexEntry,
    timecodeMs: number,
    { syncTime = false } = {}
  ): Promise<void> {
    return secureFetch(entry.url)
      .then((response) => response.json())
      .then((events) => VideoEventProcessor.addEvents(events))
      .then(() => {
        if (syncTime) {
          VideoEventProcessor.syncTime(timecodeMs);
        }
      }); // Make sure we at least load all the init events
  }
}
