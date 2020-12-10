import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["authInput", "submitButton", "devCode"];

  readonly currentTarget!: HTMLInputElement;
  readonly authInputTargets!: HTMLInputElement[];
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
      this.authInputTargets.forEach((authInput, index) => {
        authInput.value = devCodeValue[index];
      });

      this.toggleSubmitButton();
    }
  }

  handleInput(event: InputEvent): void {
    event.preventDefault();

    if (this.notValidInput(event.data)) {
      const authInput = event.target as HTMLInputElement;
      authInput.value = "";
      return;
    }

    this.moveToNextInput(event);

    this.toggleSubmitButton();
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const currentTarget = event.currentTarget as HTMLInputElement;
    const currentIndex = this.findIndexOfCurrentTarget(
      currentTarget,
      this.authInputTargets
    );

    if (this.notValidInput(text)) {
      return;
    }

    if (currentIndex !== 0) {
      return;
    }

    this.authInputTargets.forEach((authInputElement, index) => {
      if (text[index] == undefined) {
        return;
      }
      authInputElement.value = text[index];

      if (index + 1 >= this.authInputTargets.length) {
        return;
      }

      const nextInputElement = this.authInputTargets[index + 1];
      nextInputElement.focus();
    });

    this.toggleSubmitButton();
  }

  handleKeyboardNav(event: KeyboardEvent): void {
    const currentTarget = event.currentTarget as HTMLInputElement;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.moveToPreviousInput(event);
        break;
      case "Backspace":
        event.preventDefault();

        if (currentTarget.value.length >= 1) {
          currentTarget.value = "";
        } else {
          this.moveToPreviousInput(event);
        }

        this.toggleSubmitButton();
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveToNextInput(event);
        break;
      default:
        return;
    }
  }

  moveToNextInput(event: Event): void {
    const currentTarget = event.currentTarget as HTMLInputElement;
    const index = this.findIndexOfCurrentTarget(
      currentTarget,
      this.authInputTargets
    );

    if (index === -1 || index >= this.authInputTargets.length - 1) {
      return;
    }

    this.authInputTargets[index + 1].focus();
  }

  moveToPreviousInput(event: Event): void {
    const currentTarget = event.currentTarget as HTMLInputElement;
    const index = this.findIndexOfCurrentTarget(
      currentTarget,
      this.authInputTargets
    );

    if (index <= 0) {
      return;
    }

    const target = this.authInputTargets[index - 1];
    target.focus();
    target.setSelectionRange(0, 1);
  }

  toggleSubmitButton(): void {
    const validInputs = (authElement: HTMLInputElement) =>
      this.validInput(authElement.value);
    const allValid = this.authInputTargets.every(validInputs);
    if (allValid) {
      this.submitButtonTarget.disabled = false;
    } else {
      this.submitButtonTarget.disabled = true;
    }
  }

  findIndexOfCurrentTarget(
    currentTarget: HTMLInputElement,
    authInputTargets: HTMLInputElement[]
  ): number {
    return authInputTargets.findIndex((authElement) => {
      return authElement === currentTarget;
    });
  }

  notValidInput(str: string): boolean {
    return !this.validInput(str);
  }

  validInput(str: string): boolean {
    if (/\d{1,4}/.test(str)) {
      return true;
    }

    return false;
  }
}
