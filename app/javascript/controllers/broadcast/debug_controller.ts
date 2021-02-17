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
  private debugKeyListener: () => void;
  private environmentListener: (event: CustomEvent) => void;

  connect(): void {
    this.debugKeyListener = () => this.showHideAction();
    document.addEventListener(DebugKeyEvent, this.debugKeyListener);
    this.environmentListener = (event: CustomEvent) => {
      this.environment = event.detail;
    };
    document.addEventListener(
      BroadcasterEnvironmentChangedEvent,
      this.environmentListener
    );
  }

  disconnect(): void {
    document.removeEventListener(DebugKeyEvent, this.environmentListener);
    document.removeEventListener(
      BroadcasterEnvironmentChangedEvent,
      this.environmentListener
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
    this.debugAreaTarget.setAttribute("style", "width: 280px; height: 400px;");
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
