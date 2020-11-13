import { Controller } from "stimulus";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import { sendNavigationUpdate } from "helpers/broadcast_helpers";

export type NavigationUpdate = {
  eventName: string;
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
};

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
  private _url: string;

  connect(): void {
    this.browserViewListener = (_, navigationUpdate: NavigationUpdate) => {
      this.updateState(navigationUpdate);
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
    this.url = this.addressBarTarget.value;

    ipcRenderer.send("navigate", this.url);
  }

  updateState(navigationUpdate: NavigationUpdate): void {
    this.addressBarTarget.value = this.url = navigationUpdate.url;
    this.backButtonTarget.disabled = !navigationUpdate.canGoBack;
    this.forwardButtonTarget.disabled = !navigationUpdate.canGoForward;
    if (navigationUpdate.isLoading) {
      this.reloadButtonTarget.setAttribute("style", "display: none;");
      this.stopButtonTarget.setAttribute("style", "display: initial;");
    } else {
      this.reloadButtonTarget.setAttribute("style", "display: initial;");
      this.stopButtonTarget.setAttribute("style", "display: none;");
    }
    sendNavigationUpdate(navigationUpdate);
  }

  // Action!
  doReload(): void {
    this.sendToBrowser("reload");
  }

  goForward(): void {
    this.sendToBrowser("forward");
  }

  goBack(): void {
    this.sendToBrowser("back");
  }

  stopLoading(): void {
    this.sendToBrowser("stop");
  }

  private sendToBrowser(event: string) {
    ipcRenderer.send("browser", event);
  }

  set url(url: string) {
    this._url = url;
    this.data.set("url", url);
  }

  get url(): string {
    return this._url;
  }
}

export function getCurrentUrl(): string {
  return document
    .querySelector("*[data-broadcast--browser-url]")
    .getAttribute("data-broadcast--browser-url");
}
