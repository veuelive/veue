import { Controller } from "stimulus";
import { DebugKeyEvent } from "types/keyboard_mapping";
import { BroadcasterEnvironment } from "types/electron_env";
import { BroadcasterEnvironmentChangedEvent } from "controllers/broadcast_controller";
import { ipcRenderer } from "helpers/electron/ipc_renderer";

export default class extends Controller {
  static targets = ["debugArea", "releaseChannel"];
  private debugAreaTarget!: HTMLElement;
  private releaseChannelTarget!: HTMLInputElement;
  private _environment: BroadcasterEnvironment;
  hidden = true;

  connect(): void {
    document.addEventListener(DebugKeyEvent, () => this.showHideAction());
    document.addEventListener(
      BroadcasterEnvironmentChangedEvent,
      (event: CustomEvent) => {
        this.environment = event.detail;
      }
    );
  }

  showHideAction(): void {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  switchToReleaseChannel(): void {
    const releaseChannel = this.releaseChannelTarget.value;
    console.log(
      "Sending request to change release channel to ",
      releaseChannel
    );
    ipcRenderer.send("changeReleaseChannel", releaseChannel);
  }

  show(): void {
    this.debugAreaTarget.setAttribute("style", "width: 200px; height: 400px;");
    this.hidden = false;
  }

  hide(): void {
    this.debugAreaTarget.setAttribute("style", "width: 0px; height: 0px;");
    this.hidden = true;
  }

  set environment(e: BroadcasterEnvironment) {
    this._environment = e;
    this.releaseChannelTarget.value = e.releaseChannel;
  }
}
