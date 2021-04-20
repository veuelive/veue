import { Controller } from "stimulus";

/**
 * @example
 *   .link-share{data: {controller: "chat--link-share", action: "chat--link-share#copy keydown->chat--link-share#copy"}}
 *     .link-share__success{data: {target: "chat--link-share.success}}"
 *       Success!
 *     .link-share__failure{data: {target: "chat--link-share.failure}}"
 *       Failure!
 *     %input.link-share__sourceText{value: "text", data: {target: "chat--link-share.source"}}
 */
export default class LinkShareController extends Controller {
  private readonly sourceTarget!: HTMLInputElement;
  private readonly successTarget!: HTMLDivElement;
  private readonly failureTarget!: HTMLDivElement;

  static targets = ["source", "success", "failure"];

  element: HTMLElement;
  hideTimeoutId: number;
  displayNoneTimeoutId: number;
  state: "enabled" | "disabled";

  connect(): void {
    // dont show in the broadcaster
    if (document.querySelector("#broadcast")) {
      this.state = "disabled";
      this.element.style.display = "none";
    } else {
      this.state = "enabled";
    }
  }

  copy(event: MouseEvent & KeyboardEvent): void {
    if (this.state === "disabled") {
      return;
    }

    if ("key" in event && event["key"] !== "Enter") {
      return;
    }

    window.clearTimeout(this.hideTimeoutId);
    window.clearTimeout(this.displayNoneTimeoutId);

    const text = this.sourceTarget.value;

    window.navigator.clipboard
      .writeText(text)
      .then(() => {
        this.flashElement(this.successTarget);
      })
      .catch(() => {
        this.flashElement(this.failureTarget);
      });
  }

  flashElement(element: HTMLElement): void {
    element.style.opacity = "1";
    element.style.display = "flex";

    this.hideTimeoutId = window.setTimeout(() => {
      this.hideElement(element);
    }, 1_500);
  }

  hideElement(element: HTMLElement): void {
    element.style.opacity = "0";

    this.displayNoneTimeoutId = window.setTimeout(() => {
      element.style.display = "none";
    }, 500);
  }
}
