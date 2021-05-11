import { Controller } from "stimulus";
import { debounce } from "util/debounce";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";
import { inElectronApp } from "helpers/electron/base";
import { Visibility, setVideoVisibility } from "../../helpers/video_helpers";

export default class extends Controller {
  static targets = ["loading", "titleInput", "visibility"];

  readonly loadingTarget!: HTMLElement;
  readonly titleInputTarget!: HTMLInputElement;
  readonly visibilityTarget!: HTMLSelectElement;

  connect(): void {
    if (inElectronApp) {
      this.element.remove();
    }
  }

  @debounce(100)
  async saveTitle(): Promise<void> {
    this.loadingTarget.style.display = "block";
    const title = this.titleInputTarget.value;

    const response = await putForm("./", {
      "video[title]": title,
    });

    // Hide loading animation with delay
    setTimeout(() => (this.loadingTarget.style.display = "none"), 300);

    const status = response.status;
    if (status >= 400 && status <= 499) {
      showNotification("Title updation failed.");
    }
  }

  async updateVisibility(): Promise<void> {
    const visibility = this.visibilityTarget.value as Visibility;
    const response = await putForm("./", {
      "video[visibility]": visibility,
    });

    setVideoVisibility(visibility);
    showNotification("Broadcast visibility updated successfully.");
  }
}
