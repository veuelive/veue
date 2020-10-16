import { Controller } from "stimulus";

export const MediaDeviceChangeEvent = "MediaDeviceChangeEvent";

export default class extends Controller {
  private menuDiv?: HTMLElement;

  async showHideMenu(): Promise<void> {
    if (this.menuDiv) {
      this.menuDiv.remove();
      this.menuDiv = null;
    } else {
      this.menuDiv = await this.buildMenu();
      this.element.appendChild(this.menuDiv);
    }
  }

  changeMediaSource(device: MediaDeviceInfo): void {
    document.dispatchEvent(
      new CustomEvent(MediaDeviceChangeEvent, { detail: device })
    );
  }

  async buildMenu(): Promise<HTMLElement> {
    const menuDiv = document.createElement("div");
    menuDiv.className = "select-menu";
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === this.type);
    devices.forEach((device) => {
      const menuItem = document.createElement("div");
      menuItem.innerText = device.label;
      menuItem.setAttribute("data-media-id", device.deviceId);
      menuDiv.appendChild(menuItem);
      menuItem.addEventListener("click", () => {
        this.changeMediaSource(device);
      });
    });
    return menuDiv;
  }

  get type(): MediaDeviceKind {
    return (this.data.get("type") + "input") as MediaDeviceKind;
  }
}
