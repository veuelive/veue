import { Controller } from "stimulus";
import { putForm, destroy } from "util/fetch";
import { CropImageHelper } from "helpers/crop_image_helper";
import EventBus from "event_bus";

export const UploadIconEvent = "UploadIcon";

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

  async submitIcon(): Promise<void> {
    const channel_icon = await this.cropper.resultantImage();

    const response = await putForm(
      `/channels/${this.data.get("id")}/upload_image`,
      {
        channel_icon,
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

  async removeIcon(): Promise<void> {
    const response = await destroy(
      `/channels/${this.data.get("id")}/destroy_image`
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(html);
  }

  dispatchUploadImageEvent(html): void {
    EventBus.dispatch(UploadIconEvent, {
      html,
      id: this.data.get("id"),
    });
  }
}
