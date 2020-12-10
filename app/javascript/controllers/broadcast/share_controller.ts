import { Controller } from "stimulus";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
} from "helpers/broadcast_helpers";

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
    openLinkInBrowser(publicVideoLink());
  }

  copyLink(event: Event): void {
    this.hide();
    event.stopPropagation();
    copyToClipboard(publicVideoLink());
    alert("Public Link Copied to Clipboard!");
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
