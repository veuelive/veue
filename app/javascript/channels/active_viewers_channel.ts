import consumer from "./consumer";
import formatNumber from "util/formatNumber";

function viewersChannel() {
  const videoDisplayElement = document.getElementById(
    "video-show"
  ) as HTMLElement;

  if (videoDisplayElement) {
    const videoId = videoDisplayElement.dataset.audienceViewVideoId;

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
          activeViews.textContent = formatNumber(data.viewers);
        },
      }
    );
  }
}

window.onload = viewersChannel;
