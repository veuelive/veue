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
    this.playEventsAt(startAtMs, { sync: true });
  }

  playEventsAt(startAtMs: number, { sync = false } = {}): void {
    secureFetch("./events")
      .then((response) => response.json())
      .then((eventIndex) => {
        console.log("eventIndex: ", eventIndex);
        this.eventIndex = eventIndex;
        return this.seekTo(startAtMs, { sync });
      });
  }

  seekTo(timecodeMs: number, { sync = false } = {}): Promise<void> {
    const nextEntry = this.eventIndex.find(
      (entry) => entry.start <= timecodeMs
    );
    return this.loadEventSet(nextEntry, timecodeMs, { sync });
  }

  disconnect(): void {
    return;
  }

  loadEventSet(
    entry: EventIndexEntry,
    timecodeMs: number,
    { sync = false } = {}
  ): Promise<void> {
    return secureFetch(entry.url)
      .then((response) => response.json())
      .then((events) => VideoEventProcessor.addEvents(events))
      .then(() => {
        if (sync) {
          VideoEventProcessor.syncTime(timecodeMs);
        }
      }); // Make sure we at least load all the init events
  }
}
