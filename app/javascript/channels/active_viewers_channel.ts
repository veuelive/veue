import consumer from "./consumer";

function viewersChannel() {
  const chatSection = document.getElementsByClassName(
    "chat-section"
  )[0] as HTMLElement;
  const videoId = chatSection.dataset.chatVideoId;

  consumer.subscriptions.create(
    {
      channel: "ActiveViewersChannel",
      videoId: videoId,
    },
    {
      received(data) {
        const activeViews = document.getElementById(
          "active-viewers"
        ) as HTMLElement;
        activeViews.textContent = data.viewers;
      },
    }
  );
}

window.onload = viewersChannel;
