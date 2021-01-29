import { Controller } from "stimulus";
import { putJson } from "util/fetch";

export default class extends Controller {
  element!: HTMLElement;

  private profileImageUpdateHandler: (event) => void;

  connect(): void {
    this.profileImageUpdateHandler = (event) => {
      this.element.outerHTML = event.detail.html;
    };

    document.addEventListener("UploadImage", this.profileImageUpdateHandler);
  }
}
