import { Controller } from "stimulus";
import { Visibility, setVideoVisibility } from "../../helpers/video_helpers";
import { ShowMenuEvent } from "./commands_menu_controller";

export default class SettingsController extends Controller {
  static targets = ["form", "visibility"];

  private readonly formTarget!: HTMLFormElement;
  private readonly visibilityTarget!: HTMLSelectElement;

  connect(): void {
    document
      .querySelectorAll(".flash-success .flash-error")
      .forEach((el) => el.remove());
  }

  handleAjaxSuccess(): void {
    this.handleAjax("success");

    const visibility = this.visibilityTarget.value as Visibility;
    setVideoVisibility(visibility);
  }

  handleAjaxError(): void {
    this.handleAjax("error");
  }

  private handleAjax(status: "success" | "error"): void {
    const flashEl = this[`${status}Flash`];
    this.formTarget.appendChild(flashEl);

    window.setTimeout(() => (flashEl.style.opacity = "0"), 200);
    window.setTimeout(() => flashEl.remove(), 2000);
  }

  private get successFlash(): HTMLDivElement {
    const flash = document.createElement("div");
    flash.className = "flash-success";
    flash.innerText = "Settings updated!";
    return flash;
  }

  private get errorFlash(): HTMLDivElement {
    const flash = document.createElement("div");
    flash.className = "flash-error";
    flash.innerText = "Unable to update settings!";
    return flash;
  }
}
