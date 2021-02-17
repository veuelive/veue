import DropdownController from "./dropdown_controller";
import { getVideoVisibility } from "helpers/video_helpers";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";

export default class extends DropdownController {
  showHideMenu(): void {
    this.resetMenu();

    this.shareItemsMarkup();
    this.setTitle("Share Broadcaster");
    this.toggleMenu("share");
  }

  private shareItemsMarkup(): void {
    const openLink = document.createElement("div");
    openLink.classList.add("select-menu--content__body__item", "open");
    openLink.innerText = "Open Link";
    openLink.addEventListener("click", (event: Event) => {
      this.openLink(event);
      this.dispatchMenuClose();
    });
    this.appendElement(openLink);

    const copyLink = document.createElement("div");
    copyLink.classList.add("select-menu--content__body__item", "copy");
    copyLink.innerText = "Copy Link";
    copyLink.addEventListener("click", (event: Event) => {
      this.copyLink(event);
      this.dispatchMenuClose();
    });
    this.appendElement(copyLink);
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
}
