import { Controller } from "stimulus";
import { putForm, destroy } from "util/fetch";
import { CropImageHelper } from "helpers/crop_image_helper";
import EventBus from "event_bus";

export const UploadImageEvent = "UploadImage";
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

  async submitImage(): Promise<void> {
    const image = await this.cropper.resultantImage();
    const data =
      this.cropType === "channel"
        ? { channel_icon: image }
        : { profile_image: image };

    const response = await putForm(this.uploadImagePath, data);
    const html = await response.text();

    this.dispatchUploadImageEvent(html);

    this.closeCropper();
  }

  closeCropper(): void {
    this.imageFieldTarget.value = "";
    this.croppieWrapperTarget.style.display = "none";
  }

  async removeImage(): Promise<void> {
    const response = await destroy(this.destroyImagePath);
    const html = await response.text();

    this.dispatchUploadImageEvent(html);
  }

  dispatchUploadImageEvent(html): void {
    let payload = {};
    let eventType = UploadImageEvent;

    if (this.cropType === "channel") {
      payload = {
        html,
        id: this.data.get("id"),
      };
      eventType = UploadIconEvent;
    } else {
      payload = { html };
    }
    EventBus.dispatch(eventType, payload);
  }

  get uploadImagePath(): string {
    return this.data.get("uploadImagePath");
  }

  get destroyImagePath(): string {
    return this.data.get("destroyImagePath");
  }

  get cropType(): string {
    return this.data.get("cropType");
  }
}
