import BaseController from "./base_controller";
import * as IntlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
import { secureFormFetch } from "util/fetch";

export default class extends BaseController {
  static targets = ["modal", "submitButton", "form"];

  readonly modalTarget!: HTMLElement;
  readonly submitButtonTarget!: HTMLButtonElement;
  readonly formTarget!: HTMLFormElement;
  private iti: IntlTelInput.Plugin;

  connect(): void {
    this.modalTarget.hidden = true;
    this.attachPhoneNumberField();
  }

  /**
   * This takes the normal <input> field and makes it extra spicy and nice!
   */
  attachPhoneNumberField(): void {
    const phoneInputElement = this.modalTarget.querySelector(
      "input[type='tel']"
    );
    console.log(phoneInputElement);
    if (phoneInputElement) {
      this.iti = IntlTelInput(phoneInputElement, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.min.js",
      });
      this.validatePhone();
    }
  }

  showModal(): void {
    this.modalTarget.style.display = "block";
    this.modalTarget.querySelector("input").focus();
  }

  validatePhone(): void {
    if (this.iti.isValidNumber()) {
      this.submitButtonTarget.disabled = false;
      this.element
        .querySelector("input[name='phone_number']")
        .setAttribute("value", this.iti.getNumber());
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
    console.log("Got click!");
    event.preventDefault();
    const response = await secureFormFetch(
      this.formTarget.dataset.url,
      this.formTarget.dataset.method,
      this.formTarget
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
