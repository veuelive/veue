import Rails from "@rails/ujs";

export default class AuthObserver {
  constructor(el, userLoggedIn, videoId) {
    this.authEvent = new CustomEvent("auth", {
      detail: { userLoggedIn, videoId },
    });
    document.addEventListener("auth", (event) => this.authListner(event));
  }

  authListner(event) {
    this.reloadChatArea(event.detail.videoId);
  }

  reloadChatArea(videoId) {
    Rails.ajax({
      type: "get",
      url: `/chat_message.js?video_id=${videoId}`,
      success: (response) => {
        const chatDiv = document.getElementById("left-chat-area");
        chatDiv.innerHTML = response;
      },
    });
  }

  dispatchAuth() {
    document.dispatchEvent(this.authEvent);
  }
}
