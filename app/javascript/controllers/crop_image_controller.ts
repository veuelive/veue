import { Controller } from "stimulus";
import { putForm, destroy } from "util/fetch";
import Croppie from "croppie";
import "croppie/croppie.css";

export const UploadImageEvent = "UploadImage";

export default class extends Controller {
  static targets = [
    "croppieWrapper",
    "croppieField",
    "imageField",
    "imageMessage",
  ];

  element!: HTMLElement;
  readonly croppieWrapperTarget!: HTMLElement;
  readonly croppieFieldTarget!: HTMLElement;
  readonly imageFieldTarget!: HTMLInputElement;
  readonly imageMessageTarget!: HTMLElement;

  private croppie: Croppie;

  connect(): void {
    console.log(this.element.dataset);
    this.croppie = new Croppie(this.croppieFieldTarget, {
      viewport: { width: 200, height: 200, type: "circle" },
      boundary: { width: 300, height: 300 },
      showZoomer: true,
    });
  }

  processImage(): void {
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
    const profile_image = await this.croppie.result({
      type: "blob",
      size: "original",
      format: "png",
      quality: 1,
    });

    this.imageFieldTarget.value = "";

    const response = await putForm(
      `/users/${this.element.dataset.id}/upload_image`,
      {
        profile_image,
      }
    );
    const html = await response.text();

    const uploadImageEvent = new CustomEvent(UploadImageEvent, {
      detail: { html },
    });
    document.dispatchEvent(uploadImageEvent);

    this.closeCropper();
  }

  closeCropper(): void {
    this.croppieWrapperTarget.style.display = "none";
  }

  async removeImage(): Promise<void> {
    const response = await destroy(
      `/users/${this.element.dataset.id}/destroy_image`
    );
    const html = await response.text();

    const uploadImageEvent = new CustomEvent(UploadImageEvent, {
      detail: { html },
    });
    document.dispatchEvent(uploadImageEvent);
  }
}
