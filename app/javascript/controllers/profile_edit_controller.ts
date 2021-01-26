import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import isValidEmail from "util/email_validator";

export default class extends Controller {
  static targets = ["form", "errorMessage", "submitButton"];

  readonly formTarget!: HTMLElement;
  readonly errorMessageTarget!: HTMLElement;
  readonly submitButtonTargets!: HTMLButtonElement[];

  checkEmailValidity(event: Event): void {
    const emailField = event.target as HTMLInputElement;

    const isValid = emailField.value ? isValidEmail(emailField.value) : true;
    this.errorMessageTarget.style.display = isValid ? "none" : "block";

    this.submitButtonTargets.forEach((button) => {
      button.disabled = !isValid;
    });
  }

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;

    submitButton.disabled = true;
    await putForm(".", this.formTarget);
    submitButton.disabled = false;
  }
}
