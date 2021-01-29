import { Controller } from "stimulus";
import { putJson } from "util/fetch";
import Croppie from "croppie";

export default class extends Controller {
  static targets = [
    "croppieWrapper",
    "croppieField",
    "imageField",
    "imageMessage",
  ];

  readonly croppieWrapperTarget!: HTMLElement;
  readonly croppieFieldTarget!: HTMLElement;
  readonly imageFieldTarget!: HTMLInputElement;
  readonly imageMessageTarget!: HTMLElement;

  private croppie: Croppie;

  connect(): void {
    this.croppie = new Croppie(this.croppieFieldTarget, {
      viewport: { width: 200, height: 200 },
      boundary: { width: 300, height: 300 },
      showZoomer: true,
    });
  }

  processImage(event: Event): void {
    const image = this.imageFieldTarget.files[0];
    const isValid = image.size / 1048576 <= 5;

    this.imageMessageTarget.style.display = isValid ? "none" : "block";

    if (isValid) {
      this.croppieWrapperTarget.style.display = "flex";
      this.croppie.bind({
        url: window.URL.createObjectURL(image),
      });
    }
  }

  async submitImage(): Promise<void> {
    const profile_image = await this.croppie.result("base64");
    const response = await putJson(this.imageFieldTarget.dataset.path, {
      profile_image,
    });

    this.closeCropper();
    const html = await response.text();
    this.element.outerHTML = html;
  }

  closeCropper(): void {
    this.croppieWrapperTarget.style.display = "none";
  }
}
