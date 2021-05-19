import { Controller } from "stimulus";
import { inElectronApp } from "helpers/electron/base";

export default class extends Controller {
  element!: HTMLElement;

  static targets = ["welcomePage", "mainArea"];

  private welcomePageTarget!: HTMLElement;
  private mainAreaTarget!: HTMLElement;

  connect(): void {
    const isBrowserBroacast = this.element.dataset.broadcastType === "browser";

    if (!inElectronApp && !isBrowserBroacast) {
      this.welcomePageTarget.style.display = "flex";
      this.mainAreaTarget.remove();
    }
  }
}
