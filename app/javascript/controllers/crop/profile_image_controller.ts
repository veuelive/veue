import { Controller } from "stimulus";
import { putForm, destroy } from "util/fetch";
import { CropImageHelper } from "helpers/crop_image_helper";

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

  private cropper;

  connect(): void {
    this.cropper = new CropImageHelper(this.croppieFieldTarget);
  }

  processImage(): void {
    this.cropper.fetchImageFile(this.imageFieldTarget);
    const isValid = this.cropper.isValidImage();

    this.imageMessageTarget.style.display = isValid ? "none" : "block";

    if (isValid) {
      this.croppieWrapperTarget.style.display = "flex";
      this.cropper.bindURL();
    }
  }

  async submitImage(): Promise<void> {
    const profile_image = await this.cropper.resultantImage();

    const response = await putForm(
      `/users/${this.element.dataset.id}/upload_image`,
      {
        profile_image,
      }
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(html);

    this.closeCropper();
  }

  closeCropper(): void {
    this.imageFieldTarget.value = "";
    this.croppieWrapperTarget.style.display = "none";
  }

  async removeImage(): Promise<void> {
    const response = await destroy(
      `/users/${this.element.dataset.id}/destroy_image`
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(html);
  }

  dispatchUploadImageEvent(html): void {
    const uploadEvent = new CustomEvent(UploadImageEvent, {
      detail: { html },
    });
    document.dispatchEvent(uploadEvent);
  }
}
