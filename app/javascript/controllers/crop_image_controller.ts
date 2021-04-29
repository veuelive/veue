import { Controller } from "stimulus";
import { putForm, destroy } from "util/fetch";
import Croppie from "croppie";
import "croppie/croppie.css";

export const UploadImageEvent = "UploadImage";
export const UploadChannelIconEvent = "ChannelIcon";

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
      circle: false,
    });

    const response = await putForm(
      `/users/${this.element.dataset.id}/upload_image`,
      {
        profile_image,
      }
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(UploadImageEvent, html);

    this.closeCropper();
  }

  async submitChannelIcon(): Promise<void> {
    const channel_icon = await this.croppie.result({
      type: "blob",
      size: "original",
      format: "png",
      quality: 1,
      circle: false,
    });

    const response = await putForm(
      `/channels/${this.element.dataset.id}/upload_image`,
      {
        channel_icon,
      }
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(UploadChannelIconEvent, html);

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

    this.dispatchUploadImageEvent(UploadImageEvent, html);
  }

  async removeChannelIcon(): Promise<void> {
    const response = await destroy(
      `/channels/${this.element.dataset.id}/destroy_image`
    );
    const html = await response.text();

    this.dispatchUploadImageEvent(UploadChannelIconEvent, html);
  }

  dispatchUploadImageEvent(UploadEvent, html): void {
    const uploadEvent = new CustomEvent(UploadEvent, {
      detail: { html },
    });
    document.dispatchEvent(uploadEvent);
  }
}
