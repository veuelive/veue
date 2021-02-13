import { Controller } from "stimulus";
import { getVideoVisibility } from "helpers/video_helpers";
import { ShowMenuEvent } from "./commands_menu_controller";
import { ShareDropdown } from "helpers/broadcast/commands/share_dropdown";
import {
  copyToClipboard,
  openLinkInBrowser,
  publicVideoLink,
  privateVideoLink,
} from "helpers/broadcast_helpers";

export default class extends Controller {
  private dropdown;

  connect(): void {
    this.dropdown = new ShareDropdown();
  }

  showHideMenu(): void {
    this.dropdown.toggleMenu();
  }
}
