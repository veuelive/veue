import { Controller } from "stimulus";
import { ShowMenuEvent } from "./commands_menu_controller";
import { MediaDropdown } from "helpers/broadcast/commands/media_dropdown";

export default class extends Controller {
  private mediaDropdown;

  connect(): void {
    this.mediaDropdown = new MediaDropdown();
  }

  showHideMenu(): void {
    this.mediaDropdown.toggleMenu(this.type);
  }

  get type(): string {
    return this.data.get("type") + "input";
  }
}
