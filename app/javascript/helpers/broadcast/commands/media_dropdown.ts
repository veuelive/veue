import { MenuDropdown } from "./menu_dropdown";
import { changeMediaSource } from "helpers/broadcast/change_media_initializer";

export class MediaDropdown extends MenuDropdown {
  async toggleMenu(type: string): Promise<void> {
    this.reset();

    await this.deviceMarkup(type);

    const title = this.title(type);
    this.setTitle(title);

    this.dispatchMenuToggle(type);
  }

  private async deviceMarkup(type: string): Promise<void> {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === type);

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

  private title(type: string) {
    return type === "audioinput" ? "Audio Input" : "Video Input";
  }
}
