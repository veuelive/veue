import { Controller } from "stimulus";
import { ipcRenderer } from "controllers/broadcast/electron/ipc_renderer";
import { logPageVisit } from "controllers/broadcast/broadcast_helpers";

export default class extends Controller {
  static targets = [
    "addressBar",
    "backButton",
    "forwardButton",
    "reloadButton",
    "stopButton",
  ];
  private addressBarTarget!: HTMLInputElement;
  private backButtonTarget!: HTMLButtonElement;
  private forwardButtonTarget!: HTMLButtonElement;
  private reloadButtonTarget!: HTMLButtonElement;
  private stopButtonTarget!: HTMLButtonElement;

  private browserViewListener: (name, event, second) => void;

  connect(): void {
    this.browserViewListener = (_, eventName, url) => {
      this.addressBarTarget.value = url;
      logPageVisit(url, eventName);
    };
    ipcRenderer.on("browserView", this.browserViewListener);

    this.navigateToAddress();
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.code === "Enter") {
      this.navigateToAddress();
    }
  }

  private navigateToAddress() {
    console.log("Sent navigate signal");
    ipcRenderer.send("navigate", this.addressBarTarget.value);
  }
}
