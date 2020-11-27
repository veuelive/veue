import { Controller } from "stimulus";
import { VideoEventProcessor } from "helpers/event/event_processor";
import heartSvg from "images/heart.svg";

export const UserReactionMessageEvent = "UserReactionMessage";
export const VideoReactionEvent = "VideoReactionEvent";

export default class extends Controller {
  static targets = ["notification"];

  readonly notificationTarget!: HTMLElement;
  private userReactionCallbackHandler: (event) => void;

  connect(): void {
    this.userReactionCallbackHandler = (event) => {
      this.displayUserReactiontNotification(event.detail.data.name);
    };
    VideoEventProcessor.subscribeTo(
      VideoReactionEvent,
      this.userReactionCallbackHandler
    );
  }

  disconnect(): void {
    VideoEventProcessor.unsubscribeFrom(
      VideoReactionEvent,
      this.userReactionCallbackHandler
    );
  }

  private displayUserReactiontNotification(name: string): void {
    this.element.innerHTML = renderLikeMarkup(name);
    setTimeout(() => {
      this.element.innerHTML = "";
      document.dispatchEvent(
        new CustomEvent(UserReactionMessageEvent, { detail: { name: name } })
      );
    }, 3000);
  }
}

export function renderLikeMarkup(name: string): string {
  return `
    <div class="user-reaction">
      <img src=${heartSvg} alt="reaction-icon"/>
      <div>${name}</div>
    </div>
  `;
}
