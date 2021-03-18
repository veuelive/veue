import { Controller } from "stimulus";
import {
  ClearVideoEvent,
  VideoEventProcessor,
} from "helpers/event/event_processor";
import heartSvg from "images/heart.svg";

export const UserReactionMessageEvent = "UserReactionMessage";
export const VideoReactionEvent = "VideoReactionEvent";

export default class extends Controller {
  static targets = ["notification"];

  readonly notificationTarget!: HTMLElement;

  private notificationTimeoutId!: number;
  private userReactionCallbackHandler: (event: CustomEvent) => void;

  connect(): void {
    this.userReactionCallbackHandler = (event) => {
      this.displayUserReactionNotification(event.detail.data.name);
    };
    VideoEventProcessor.subscribeTo(
      VideoReactionEvent,
      this.userReactionCallbackHandler
    );

    VideoEventProcessor.subscribeTo(
      ClearVideoEvent,
      this.clearReactionTimeout.bind(this)
    );
  }

  disconnect(): void {
    VideoEventProcessor.unsubscribeFrom(
      VideoReactionEvent,
      this.userReactionCallbackHandler
    );

    VideoEventProcessor.unsubscribeFrom(
      ClearVideoEvent,
      this.clearReactionTimeout.bind(this)
    );
  }

  clearReactionTimeout(): void {
    window.clearTimeout(this.notificationTimeoutId);
  }

  private displayUserReactionNotification(name: string): void {
    this.element.innerHTML = renderReactionMarkup(name);
    document.dispatchEvent(
      new CustomEvent(UserReactionMessageEvent, { detail: { name: name } })
    );
    this.notificationTimeoutId = window.setTimeout(() => {
      this.element.innerHTML = "";
    }, 7000);
  }
}

export function renderReactionMarkup(
  name: string,
  reactionSvg = heartSvg
): string {
  return `
    <div class="user-reaction">
      <div class="content">
        <img src=${reactionSvg} alt="reaction-icon"/>
        <div class="user-reaction__text">${name}</div>
      </div>
    </div>
  `;
}
