import { Controller } from "stimulus";
import { ShowMenuEvent } from "./commands_menu_controller";
import { BroadcasterCommand } from "types/broadcaster_command";
import { getVideoVisibility } from "helpers/video_helpers";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";

export default class extends Controller {
  connect(): void {}

  async showAudioInput(): Promise<void> {
    const type = "audioinput";
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === type);

    this.toggleMenu({
      devices,
      title: "Audio Input",
      type,
    });
  }

  async showVideoInput(): Promise<void> {
    const type = "videoinput";
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === type);

    // it will dispatch event for opening or closing of menu
    this.toggleMenu({
      devices,
      title: "Video Input",
      type,
    });
  }

  showShareOptions(): void {
    this.toggleMenu({
      title: "Share Broadcast",
      type: "share",
    });
  }

  showSettingsForm(): void {
    this.toggleMenu({
      title: "Settings",
      type: "settings",
    });
  }

  openLink(event: Event): void {
    event.stopPropagation();
    openLinkInBrowser(this.getVideoLink());

    this.toggleMenu({
      title: "Share Broadcast",
      type: "share",
    });
  }

  copyLink(event: Event): void {
    event.stopPropagation();
    copyToClipboard(this.getVideoLink());

    this.toggleMenu({
      title: "Share Broadcast",
      type: "share",
    });
    alert("Link Copied to Clipboard!");
  }

  private getVideoLink(): string {
    const privateVisibilities = ["private", "protected"];
    if (privateVisibilities.includes(getVideoVisibility())) {
      return privateVideoLink();
    }

    return publicVideoLink();
  }

  private toggleMenu(commandData: BroadcasterCommand) {
    console.log(commandData);
    // it will dispatch event for opening or closing of menu
    document.dispatchEvent(
      new CustomEvent(ShowMenuEvent, {
        detail: {
          ...commandData,
        },
      })
    );
  }
}
