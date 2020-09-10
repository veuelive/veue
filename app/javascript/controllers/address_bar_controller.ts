import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["addressBar"];
  private addressBarTarget!: HTMLInputElement;
  private ipcRenderer: any;
  private browserViewListener: (name, event, second) => void;

  connect(): void {
    const { ipcRenderer } = eval("require('electron')");
    this.ipcRenderer = ipcRenderer;

    this.browserViewListener = (_, eventName, url) => {
      this.addressBarTarget.value = url;
    };

    ipcRenderer.on("browserView", this.browserViewListener);
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.code === "Enter") {
      this.ipcRenderer.send("navigate", this.addressBarTarget.value);
    }
  }

  navigateTo(): void {
    console.log("NAVIGATE TO! ");
  }
}
