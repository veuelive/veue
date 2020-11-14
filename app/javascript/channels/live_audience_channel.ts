import consumer from "./consumer";
import formatNumber from "util/formatNumber";
import { getCurrentVideoId } from "helpers/event/live_event_manager";
import { secureFetch } from "util/fetch";
import {
  showLoginElements,
  hideLoginElements,
} from "helpers/authentication_helpers";

export default function subscribeLiveAudienceChannel() {
  const videoId = getCurrentVideoId();

  consumer.subscriptions.create(
    {
      channel: "LiveAudienceChannel",
      videoId,
    },
    {
      async received(data): Promise<void> {
        if (data.state === "live") {
          const response = await secureFetch("./live");
          const htmlResponse = await response.text();
          const currentView = document.getElementById("main-container");
          currentView.innerHTML = htmlResponse;
          showLoginElements();
          hideLoginElements();
        }
      },
    }
  );
}
