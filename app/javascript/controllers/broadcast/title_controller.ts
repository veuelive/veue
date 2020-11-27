import { Controller } from "stimulus";
import { put } from "util/fetch";

export default class extends Controller {
  static targets = ["input"];

  readonly inputTarget!: HTMLInputElement;

  async doSubmit(event: MouseEvent | KeyboardEvent): Promise<void> {
    event.preventDefault();

    if (event.key && event.key != "Enter") {
      return;
    }

    const value = this.inputTarget.value;
  }
}
