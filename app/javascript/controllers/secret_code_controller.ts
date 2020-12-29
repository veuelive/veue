import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["authInput", "submitButton", "devCode"];

  readonly authInputTarget!: HTMLInputElement;
  readonly submitButtonTarget!: HTMLButtonElement;
  readonly devCodeTarget!: HTMLElement;
  readonly hasDevCodeTarget!: boolean;

  connect(): void {
    if (!this.hasDevCodeTarget) {
      return;
    }

    const devCodeTarget = this.devCodeTarget;
    let devCodeValue: string;

    if (devCodeTarget.dataset.value) {
      devCodeValue = devCodeTarget.dataset.value;
    } else {
      return;
    }

    if (devCodeValue) {
      this.authInputTarget.value = devCodeValue;
      this.handleInput();
    }
  }

  handleInput(): void {
    // Forces numeric inputs only
    this.authInputTarget.value = this.authInputTarget.value.replace(
      /[^\d]+/g,
      ""
    );
    this.toggleSubmitButton();
  }

  private toggleSubmitButton(): void {
    if (this.validInput(this.authInputTarget.value)) {
      this.submitButtonTarget.disabled = false;
      return;
    }

    this.submitButtonTarget.disabled = true;
  }

  private validInput(str: string): boolean {
    if (/\d{4}/.test(str)) {
      return true;
    }

    return false;
  }
}
