import DropdownController from "./dropdown_controller";
import { ShowMenuEvent } from "./commands_menu_controller";
import { changeMediaSource } from "helpers/broadcast/change_media_initializer";

export default class extends DropdownController {
  async showHideMenu(): Promise<void> {
    this.reset();

    await this.deviceMarkup();

    const menuTitle = this.title();
    this.setTitle(menuTitle);

    this.dispatchMenuToggle(this.type);
  }

  private async deviceMarkup(): Promise<void> {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === this.type);

    devices.forEach((device) => {
      this.appendElement(this.deviceMenuItem(device));
    });
  }

  private deviceMenuItem(device: MediaDeviceInfo): HTMLElement {
    const menuItem = document.createElement("div");
    menuItem.classList.add("select-menu--content__body__item");
    menuItem.innerText = device.label;
    menuItem.setAttribute("data-media-id", device.deviceId);
    menuItem.addEventListener("click", () => {
      changeMediaSource(device);
      this.dispatchMenuClose();
    });

    return menuItem;
  }

  private title(): string {
    return this.type === "audioinput" ? "Audio Input" : "Video Input";
  }

  get type(): string {
    return this.data.get("type") + "input";
  }
}
