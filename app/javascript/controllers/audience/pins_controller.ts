import { Controller } from "stimulus";
import { getTimecodeMs } from "controllers/audience/timecode_synchronizer";
import { VideoEventProcessor } from "controllers/event/event_processor";

export default class PinsController extends Controller {
  connect(): void {
    this.arrangePins(getTimecodeMs());
    VideoEventProcessor.subscribeTo("PinEvent", (event) =>
      this.arrangePins(event.detail.timecodeMs)
    );
    VideoEventProcessor.subscribeTo("BrowserNavigation", (event) =>
      this.arrangePins(event.detail.timecodeMs)
    );
  }

  private arrangePins(timecode: number) {
    this.element.querySelectorAll(".pin").forEach((pinElement) => {
      const showAtTimecode = parseInt(
        pinElement.getAttribute("data-timecode"),
        10
      );
      console.log(showAtTimecode, timecode);
      if (timecode >= showAtTimecode) {
        pinElement.removeAttribute("invisible");
      }
    });
  }
}
