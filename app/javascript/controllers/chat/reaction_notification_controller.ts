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
    this.element.innerHTML = renderReactionMarkup(name);
    document.dispatchEvent(
      new CustomEvent(UserReactionMessageEvent, { detail: { name: name } })
    );
    setTimeout(() => {
      this.element.innerHTML = "";
    }, 7000);
  }
}

export function renderReactionMarkup(
  name: string,
  reactionSVG = heartSvg
): string {
  return `
    <div class="user-reaction">
      <div class="content">
        <img src=${reactionSVG} alt="reaction-icon"/>
        <div class="user-reaction__text">${name}</div>
      </div>
    </div>
  `;
}
