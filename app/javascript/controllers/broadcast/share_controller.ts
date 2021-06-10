import DropdownController from "./dropdown_controller";
import { getVideoVisibility } from "helpers/video_helpers";
import {
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";
import { trackEvent } from "helpers/event_tracking";

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
    copyLink.addEventListener("click", async () => {
      await this.copyLink();
      this.dispatchMenuClose();
    });
    this.appendElement(copyLink);
  }

  openLink(event: Event): void {
    event.stopPropagation();
    trackEvent("Broadcast", "Click Share", "Open Share Link");
    openLinkInBrowser(this.getVideoLink());
  }

  async copyLink(): Promise<void> {
    // event.stopPropagation();
    try {
      await window.navigator.clipboard.writeText(this.getVideoLink());
      alert("Link Copied to Clipboard!");
      trackEvent("Broadcast", "Click Share", "Copy Share Link");
    } catch (err) {
      console.warn(err);
    }
  }

  private getVideoLink(): string {
    const privateVisibilities = ["private", "protected"];
    if (privateVisibilities.includes(getVideoVisibility())) {
      return privateVideoLink();
    }

    return publicVideoLink();
  }
}
