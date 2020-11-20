import { Controller } from "stimulus";
import { ViewerCountUpdateEvent } from "helpers/event/live_event_manager";

export default class extends Controller {
  static targets = ["counter"];
  private counterTarget!: HTMLElement;
  private listener: (event: CustomEvent) => void;

  connect(): void {
    this.listener = (event: CustomEvent) => {
      this.updateViewerCount(event.detail);
    };
    document.addEventListener(ViewerCountUpdateEvent, this.listener);
  }

  disconnect(): void {
    document.removeEventListener(ViewerCountUpdateEvent, this.listener);
  }

  private updateViewerCount(viewers: number) {
    this.counterTarget.innerText = viewers.toString();
  }
}
