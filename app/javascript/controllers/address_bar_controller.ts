import { Controller } from "stimulus";
import { ipcRenderer } from "util/ipc_renderer";

export default class extends Controller {
  static targets = ["addressBar"];
  private addressBarTarget!: HTMLInputElement;
  private browserViewListener: (name, event, second) => void;

  connect(): void {
    this.browserViewListener = (_, eventName, url) => {
      this.addressBarTarget.value = url;
    };
    ipcRenderer.on("browserView", this.browserViewListener);
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.code === "Enter") {
      ipcRenderer.send("navigate", this.addressBarTarget.value);
    }
  }

  navigateTo(): void {
    console.log("NAVIGATE TO! ");
  }
}
