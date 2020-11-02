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
    const response = await secureFormFetch(
      this.formTarget.dataset.url,
      this.formTarget.dataset.method,
      this.formTarget
    );
    const html = await response.text();
    if (response.status == 202) {
      const topNav = document.querySelector(".top-navbar");
      if (topNav) {
        topNav.outerHTML = html;
      }
      this.emitAuthChange();
      this.modalTarget.style.display = "none";
    } else if (response.status == 200) {
      this.modalTarget.outerHTML = html;
      this.attachPhoneNumberField();
      this.scrollToFocus();
    }
  }
}

export function currentUserId(): string | undefined {
  const element = document.querySelector("*[data-user-id]");
  return element?.getAttribute("data-user-id");
}
