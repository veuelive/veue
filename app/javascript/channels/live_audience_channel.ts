import consumer from "./consumer";
import { getCurrentVideoId } from "helpers/event/live_event_manager";
import { secureFetch } from "util/fetch";
import { showHideByLogin } from "helpers/authentication_helpers";

export default function subscribeLiveAudienceChannel(): void {
  const videoId = getCurrentVideoId();

  consumer.subscriptions.create(
    {
      channel: "LiveAudienceChannel",
      videoId,
    },
    {
      async received(data): Promise<void> {
        if (data.state === "live") {
          const response = await secureFetch("./");
          const htmlResponse = await response.text();
          const currentView = document.getElementById("main-container");
          currentView.innerHTML = htmlResponse;
          showHideByLogin();
        }
      },
    }
  );
}
