import BaseController from "./base_controller";
import * as IntlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
import { postForm, secureFormFetch } from "util/fetch";

export default class extends BaseController {
  static targets = ["modal", "submitButton"];

  readonly modalTarget!: HTMLElement;
  readonly submitButtonTarget!: HTMLButtonElement;
  private iti: IntlTelInput.Plugin;

  connect(): void {
    this.attachPhoneNumberField();
  }

  /**
   * This takes the normal <input> field and makes it extra spicy and nice!
   */
  attachPhoneNumberField() {
    const phoneInputElement = this.modalTarget.querySelector(
      "input[type='tel']"
    );
    console.log(phoneInputElement);
    if (phoneInputElement) {
      this.iti = IntlTelInput(phoneInputElement, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.min.js",
        hiddenInput: "phone_number",
      });
      this.validatePhone();
    }
  }

  showModal(): void {
    this.modalTarget.style.display = "block";
  }

  validatePhone(): void {
    if (this.iti.isValidNumber()) {
      this.submitButtonTarget.disabled = false;
    } else {
      this.submitButtonTarget.disabled = true;
    }
  }

  hideModal(event: Event): void {
    // This might be a click from any of the children of the modal
    // and we want to only hit the full page direct modal area
    const target = event.target as HTMLElement;
    if (target && target.className && target.className === "modal-skirt") {
      this.modalTarget.style.display = "none";
    }
  }

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const response = await secureFormFetch(
      form.dataset.url,
      form.dataset.method,
      form
    );
    const html = await response.text();
    if (response.status == 202) {
      document.querySelector(".top-navbar").outerHTML = html;
    } else if (response.status == 200) {
      this.modalTarget.outerHTML = html;
      this.attachPhoneNumberField();
    }
  }
}
