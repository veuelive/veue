import { Controller } from "stimulus";
import { debounce } from "util/debounce";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";
import { Visibility, setVideoVisibility } from "../../helpers/video_helpers";

export default class extends Controller {
  static targets = ["loading", "titleInput", "visibility"];

  declare readonly loadingTarget: HTMLElement;
  declare readonly titleInputTarget: HTMLInputElement;
  declare readonly visibilityTarget: HTMLSelectElement;

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
      showNotification("Title update failed.");
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
