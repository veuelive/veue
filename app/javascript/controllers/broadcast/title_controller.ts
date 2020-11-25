import { Controller } from "stimulus";
import { getCurrentVideoId } from "helpers/event/live_event_manager";
import { putForm } from "util/fetch";

export default class extends Controller {
  static targets = ["input", "submit"];

  private inputTarget!: HTMLInputElement;
  private submitTarget!: HTMLButtonElement;
  private timeoutId!: number;

  initialize(): void {
    this.inputTarget.dataset.dbValue = this.inputTarget.value;
  }

  async doSubmit(event: MouseEvent | KeyboardEvent): Promise<void> {
    // "key" in event tells us we're dealing with a keyboard event
    if ("key" in event && event.key != "Enter") {
      return;
    }

    event.preventDefault();
    const input = this.inputTarget;
    const title = input.value;
    const videoId = getCurrentVideoId();

    this.disableTargets();
    await putForm(`/videos/${videoId}`, { title });
    this.inputTarget.dataset.dbValue = title;
    this.enableTargets();
  }

  /**
   * If a user clicks off the text box, revert to previous title,
   * Use a timeout so people can tab and not have the values revert
   */
  handleBlur(): void {
    this.timeoutId = window.setTimeout(() => {
      if (this.inputTarget.dataset.dbValue) {
        this.inputTarget.value = this.inputTarget.dataset.dbValue;
      } else {
        this.inputTarget.value = "";
      }
    }, 2000);
  }

  /** We dont want to clear input while a user is focused on submit */
  handleFocus(): void {
    window.clearTimeout(this.timeoutId);
  }

  private disableTargets() {
    this.inputTarget.disabled = true;
    this.submitTarget.disabled = true;
  }

  private enableTargets() {
    this.inputTarget.disabled = false;
    this.submitTarget.disabled = false;
  }
}
