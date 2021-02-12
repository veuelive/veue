import { Controller } from "stimulus";

import { ShowMenuEvent } from "./commands_menu_controller";

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
          title: this.title(),
          type: this.type,
        },
      })
    );
  }

  title(): string {
    return this.type === "audioinput" ? "Audio Input" : "Video Input";
  }

  get type(): MediaDeviceKind {
    return (this.data.get("type") + "input") as MediaDeviceKind;
  }
}
