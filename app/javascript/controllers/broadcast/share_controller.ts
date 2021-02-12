import { Controller } from "stimulus";
import { getVideoVisibility } from "helpers/video_helpers";
import { ShowMenuEvent } from "./commands_menu_controller";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";

export default class extends Controller {
  connect(): void {}

  showHideMenu(): void {
    document.dispatchEvent(
      new CustomEvent(ShowMenuEvent, {
        detail: {
          title: "Share Broadcast",
          type: this.type,
        },
      })
    );
  }

  openLink(event: Event): void {
    event.stopPropagation();

    openLinkInBrowser(this.getVideoLink());
  }

  copyLink(event: Event): void {
    event.stopPropagation();
    copyToClipboard(this.getVideoLink());
    alert("Link Copied to Clipboard!");
  }

  private getVideoLink(): string {
    const privateVisibilities = ["private", "protected"];
    if (privateVisibilities.includes(getVideoVisibility())) {
      return privateVideoLink();
    }

    return publicVideoLink();
  }

  get type(): string {
    return this.data.get("type");
  }
}
