import { Controller } from "stimulus";
import { getCurrentVideoId } from "helpers/event/live_event_manager";
import { putForm } from "util/fetch";

export default class extends Controller {
  async doSubmit(event: KeyboardEvent): Promise<void> {
    if (event.key != "Enter" || event.shiftKey) {
      return;
    }

    if (!("currentTarget" in event)) {
      return;
    }

    event.preventDefault();
    const input = event.currentTarget as HTMLInputElement;
    const title = input.value;
    const videoId = getCurrentVideoId();
    input.disabled = true;
    await putForm(`/videos/${videoId}`, { title });
    input.disabled = false;
  }
}
