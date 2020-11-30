import { Controller } from "stimulus";
import { VideoEventProcessor } from "helpers/event/event_processor";
import whiteHeartSvg from "images/heart.svg";
import grayHeartSvg from "images/heart-gray.svg";

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
    const notification = document
      .getElementsByClassName("like-notification")[0]
      .getElementsByClassName("user-reaction")[0] as HTMLElement;
    setTimeout(() => notification.classList.add("move-up"));

    setTimeout(() => {
      notification.classList.remove("move-up");
      notification.classList.add("move-down");
      window.getComputedStyle(notification);
      document.dispatchEvent(
        new CustomEvent(UserReactionMessageEvent, { detail: { name: name } })
      );
    }, 5000);
  }
}

export function renderLikeMarkup(
  name: string,
  isMessageArea: boolean = false
): string {
  const heartSvg = isMessageArea ? grayHeartSvg : whiteHeartSvg;
  return `
    <div class="user-reaction">
      <div class="content">
        <img src=${heartSvg} alt="reaction-icon"/>
        <div class="user-reaction__text">${name}</div>
      </div>
    </div>
  `;
}
