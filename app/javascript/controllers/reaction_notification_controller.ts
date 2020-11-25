import { post } from "util/fetch";
import { Controller } from "stimulus";
import { VideoEventProcessor } from "helpers/event/event_processor";
import heartSvg from "images/heart.svg";

export default class extends Controller {
  static targets = ["notification"];

  readonly notificationTarget!: HTMLElement;
  private userReactionCallbackHandler: (event) => void;

  connect(): void {
    this.userReactionCallbackHandler = (event) => {
      this.displayUserReactiontNotification(event.detail.data);
    };
    VideoEventProcessor.subscribeTo(
      "VideoReactionEvent",
      this.userReactionCallbackHandler
    );
  }

  disconnect(): void {
    VideoEventProcessor.unsubscribeFrom(
      "VideoReactionEvent",
      this.userReactionCallbackHandler
    );
  }

  private displayUserReactiontNotification(user: any): void {
    this.element.innerHTML = renderLikeMarkup(user);
    setTimeout(() => {
      this.element.innerHTML = "";
      document.dispatchEvent(
        new CustomEvent("UserReactionMessage", { detail: user })
      );
    }, 3000);
  }
}

export function renderLikeMarkup(user): string {
  return `
    <div id="notification" class="user-reaction">
      <img src=${heartSvg} alt="reaction-icon"/>
      <span>${user.name}</span>
    </div>
  `;
}
