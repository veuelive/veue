import { Controller } from "stimulus";

import { ShowMenuEvent } from "./commands_menu_controller";

export const MediaDeviceChangeEvent = "MediaDeviceChangeEvent";

export default class extends Controller {
  private menuDiv?: HTMLElement;

  async showHideMenu(): Promise<void> {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((d) => d.kind === this.type);
    // it will dispatch event for opening or closing of menu
    document.dispatchEvent(
      new CustomEvent(ShowMenuEvent, {
        detail: {
          devices,
          type: this.type,
          changeMediaHandler: this.changeMediaSource,
        },
      })
    );
  }

  changeMediaSource(device: MediaDeviceInfo): void {
    document.dispatchEvent(
      new CustomEvent(MediaDeviceChangeEvent, { detail: device })
    );
  }

  get type(): MediaDeviceKind {
    return (this.data.get("type") + "input") as MediaDeviceKind;
  }
}
