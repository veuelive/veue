import consumer from "./consumer";

consumer.subscriptions.create("ChatRoomChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to chat room channel!!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    const elementId = `video-chat-${data.video_id}`;
    const newMessageHtml = messageHtml(data.text, data.user_name);
    const messageStream = document.getElementById(elementId);
    if (messageHtml) {
      messageStream.insertAdjacentHTML("beforeend", newMessageHtml);
    }
  },
});

function messageHtml(message, name) {
  return `
    <div class="web--message">
      <p class="web--message__name">
        ${name}
      </p>
      <label class="web--message__label">
        ${message}
      </label>
    </div>
  `;
}
