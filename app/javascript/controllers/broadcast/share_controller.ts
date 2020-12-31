import { Controller } from "stimulus";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";
import { getVideoVisibility } from "helpers/video_helpers";

export default class extends Controller {
  static targets = ["menu"];
  private menuTarget!: HTMLElement;
  private hidden: boolean;

  connect(): void {
    this.hide();
  }

  showHideMenu(): void {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  openLink(event: Event): void {
    this.hide();
    event.stopPropagation();

    openLinkInBrowser(this.getVideoLink());
  }

  copyLink(event: Event): void {
    this.hide();
    event.stopPropagation();
    copyToClipboard(this.getVideoLink());
    alert("Link Copied to Clipboard!");
  }

  private getVideoLink(): string {
    if (getVideoVisibility() === "private") {
      return privateVideoLink();
    }

    return publicVideoLink();
  }

  private hide() {
    this.hidden = true;
    this.menuTarget.setAttribute("style", "display: none;");
  }

  private show() {
    this.hidden = false;
    this.menuTarget.setAttribute("style", "display: block;");
  }
}
