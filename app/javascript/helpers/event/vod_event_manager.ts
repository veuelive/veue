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
    return this.loadEventSet(nextEntry, timecodeMs);
  }

  disconnect(): void {
    return;
  }

  loadEventSet(entry: EventIndexEntry, timecodeMs: number): Promise<void> {
    return secureFetch(entry.url)
      .then((response) => response.json())
      .then((events) => VideoEventProcessor.addEvents(events))
      .then(() => VideoEventProcessor.syncTime(timecodeMs)); // Make sure we at least load all the init events
  }
}
