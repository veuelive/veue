import consumer from "./consumer";
import formatNumber from "util/formatNumber";
import { getCurrentVideoId } from "helpers/event/live_event_manager";

export default function subscribeViewersChannel(): void {
  const videoId = getCurrentVideoId();

  consumer.subscriptions.create(
    {
      channel: "ActiveViewersChannel",
      videoId,
    },
    {
      received(data) {
        const activeViews = document.getElementById(
          "active-viewers"
        ) as HTMLElement;
        if (activeViews) activeViews.textContent = formatNumber(data.viewers);
      },
    }
  );
}
