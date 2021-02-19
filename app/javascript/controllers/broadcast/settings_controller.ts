import DropdownController from "./dropdown_controller";
import { secureFetch } from "util/fetch";
import { Visibility, setVideoVisibility } from "../../helpers/video_helpers";

export const ShowSettingsMenuEvent = "ShowSettingsMenu";

export default class SettingsController extends DropdownController {
  static targets = ["form", "visibility"];

  private readonly formTarget!: HTMLFormElement;
  private readonly visibilityTarget!: HTMLSelectElement;

  connect(): void {
    super.connect();

    document.addEventListener(
      ShowSettingsMenuEvent,
      this.showHideMenu.bind(this)
    );

    document
      .querySelectorAll(".flash-success .flash-error")
      .forEach((el) => el.remove());
  }

  disconnect(): void {
    document.removeEventListener(
      ShowSettingsMenuEvent,
      this.showHideMenu.bind(this)
    );
  }

  showHideMenu(): void {
    this.resetMenu();

    this.appendSettingsForm();

    this.setTitle("Settings");
    this.toggleMenu("settings");
  }

  async appendSettingsForm(): Promise<void> {
    const response = await secureFetch("./edit");
    const markup = await response.text();
    this.insertElement(markup);
  }

  handleAjaxSuccess(): void {
    this.handleAjax("success");

    const visibility = this.visibilityTarget.value as Visibility;
    setVideoVisibility(visibility);
  }

  handleAjaxError(data): void {
    this.handleAjax("error", data.detail[0]);
  }

  private handleAjax(status: "success" | "error", messages = []): void {
    const flashEl = this[`${status}Flash`];
    // a small tweak to show actual error that occurred. It will be changed
    // with new form for settings.
    if (messages.length) {
      messages.forEach((message) => {
        flashEl.append(` ${message}`);
      });
    }

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
