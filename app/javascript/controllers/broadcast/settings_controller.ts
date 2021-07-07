import DropdownController from "./dropdown_controller";
import { secureFetch, putForm } from "util/fetch";
import { Visibility, setVideoVisibility } from "../../helpers/video_helpers";
import { flash } from "../../helpers/flash_helpers";

export const ShowSettingsMenuEvent = "ShowSettingsMenu";

export default class SettingsController extends DropdownController {
  static targets = ["form", "visibility", "settingsTab"];

  private declare readonly formTarget: HTMLFormElement;
  private declare readonly visibilityTarget: HTMLSelectElement;
  private declare readonly settingsTabTarget: HTMLElement;

  connect(): void {
    super.connect();

    this.settingsTabTarget.remove();

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
      return;
    }

    this.ajaxError();
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
    const flashEl = flash[status]();
    this.formTarget.appendChild(flashEl);

    const disabledSubmitBtn = this.formTarget.querySelector(
      "input[disabled='']"
    ) as HTMLInputElement;

    if (disabledSubmitBtn) {
      disabledSubmitBtn.disabled = false;
    }

    window.setTimeout(() => (flashEl.style.opacity = "0"), 200);
    window.setTimeout(() => {
      flashEl.remove();
    }, 2000);
  }
}
