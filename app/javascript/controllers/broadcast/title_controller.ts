import { Controller } from "stimulus";
import { secureFormFetch } from "util/fetch";

export default class extends Controller {
  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const form = target.closest("form");
    await secureFormFetch(form.action, form.method, form);
    this.enableButton(form);
  }

  /**
   * Re-enable a button after disabling it via UJS
   */
  enableButton(form: HTMLFormElement): void {
    const disabledBtn = form.querySelector(
      "input[data-disable-with][disabled]"
    ) as HTMLInputElement;
    if (disabledBtn.disabled == true) {
      disabledBtn.disabled = false;
    }
  }
}
