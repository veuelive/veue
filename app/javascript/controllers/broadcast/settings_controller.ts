import DropdownController from "./dropdown_controller";
import { secureFetch, putForm } from "util/fetch";
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

  async submitForm(event: Event): Promise<void> {
    event.preventDefault();

    const url = this.formTarget.action;
    const response = await putForm(url, this.formTarget);

    const status = response.status;
    if (status >= 200 && status <= 299) {
      this.ajaxSuccess();
    } else {
      this.ajaxError();
    }
  }

  ajaxSuccess(): void {
    this.handleAjax("success");

    const visibility = this.visibilityTarget.value as Visibility;
    setVideoVisibility(visibility);
  }

  ajaxError(): void {
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
