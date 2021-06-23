import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import isValidEmail from "util/email_validator";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = ["form", "emailField", "emailMessage"];

  readonly formTarget!: HTMLFormElement;
  readonly emailFieldTarget!: HTMLInputElement;
  readonly emailMessageTarget!: HTMLElement;

  checkEmailValidity(): boolean {
    const email = this.emailFieldTarget.value;
    const isValid = isValidEmail(email);

    this.emailMessageTarget.style.display = isValid ? "none" : "block";
    return isValid;
  }

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const isValid = this.checkEmailValidity();
    if (isValid) {
      const submitButton = event.target as HTMLButtonElement;

      submitButton.disabled = true;
      const response = await putForm(".", this.formTarget);

      const html = await response.text();
      this.formTarget.innerHTML = html;

      showNotification("Your profile was successfully updated");
    }
  }
}
