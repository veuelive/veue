import { MenuDropdown } from "./menu_dropdown";
import { getVideoVisibility } from "helpers/video_helpers";
import { ShowMenuEvent } from "controllers/broadcast/commands_menu_controller";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";

export class ShareDropdown extends MenuDropdown {
  toggleMenu(): void {
    this.reset();

    this.shareItemsMarkup();
    this.setTitle("Share Broadcaster");
    this.dispatchMenuToggle("share");
  }

  private shareItemsMarkup(): void {
    const openLink = document.createElement("div");
    openLink.classList.add("select-menu--content__body__item");
    openLink.innerText = "Open Link";
    openLink.addEventListener("click", (event: Event) => {
      this.openLink(event);
      this.dispatchMenuClose();
    });
    this.appendElement(openLink);

    const copyLink = document.createElement("div");
    copyLink.classList.add("select-menu--content__body__item");
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
