import BaseController from "./base_controller";
import * as IntlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
import { secureFormFetch } from "util/fetch";
import { showHideByLogin } from "helpers/authentication_helpers";

export default class extends BaseController {
  static targets = [
    "modal",
    "submitButton",
    "form",
    "secretCodeInput",
    "nameInput",
  ];

  readonly modalTarget!: HTMLElement;
  readonly submitButtonTarget!: HTMLButtonElement;
  readonly formTarget!: HTMLFormElement;
  readonly secretCodeInputTarget!: HTMLInputElement;
  readonly nameInputTarget!: HTMLInputElement;
  private iti: IntlTelInput.Plugin;

  connect(): void {
    this.modalTarget.hidden = true;
    this.attachPhoneNumberField();
    showHideByLogin();
  }

  /**
   * This takes the normal <input> field and makes it extra spicy and nice!
   */
  attachPhoneNumberField(): void {
    const phoneInputElement = this.modalTarget.querySelector(
      "input[type='tel']"
    );
    if (phoneInputElement) {
      this.iti = IntlTelInput(phoneInputElement, {
        utilsScript: "/static/intl-tel-utils.js",
      });
      this.validatePhone();
    }
  }

  showModal(): void {
    this.modalTarget.style.display = "block";
    this.scrollToFocus();
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

  validateName(): void {
    if (this.nameInputTarget.value.length === 0) {
      this.submitButtonTarget.disabled = true;
    } else {
      this.submitButtonTarget.disabled = false;
    }
  }

  scrollToFocus(): void {
    setTimeout(() => this.modalTarget.querySelector("input").focus(), 500);
  }

  hideModal(event: Event): void {
    // This might be a click from any of the children of the modal
    // and we want to only hit the full page direct modal area
    const target = event.target as HTMLElement;
    if (target?.className === "modal-skirt") {
      this.modalTarget.style.display = "none";
    }
  }

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;
    const response = await secureFormFetch(
      this.formTarget.dataset.url,
      this.formTarget.dataset.method,
      this.formTarget
    );
    submitButton.disabled = true;
    const html = await response.text();
    if (response.status == 202) {
      // We are logged in!
      const topNav = document.querySelector(".top-navbar");
      if (topNav) {
        topNav.outerHTML = html;
      }
      this.emitAuthChange();
      showHideByLogin();
      submitButton.disabled = false;
      this.modalTarget.style.display = "none";
    } else if (response.status == 200) {
      // Need to show the modal again
      this.modalTarget.outerHTML = html;
      this.attachPhoneNumberField();
      this.scrollToFocus();
    }
  }
}
