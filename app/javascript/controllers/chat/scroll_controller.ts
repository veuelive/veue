import { Controller } from "stimulus";
import SimpleBar from "simplebar";

export default class extends Controller {
  static targets = ["messagesContainer", "messages", "scrollButton"];

  readonly messagesTarget!: HTMLElement;
  readonly messagesContainerTarget!: HTMLElement;
  readonly scrollButtonTarget!: HTMLElement;

  connect(): void {
    const simpleBar = new SimpleBar(this.messagesContainerTarget);
    const simplebarWrapper = simpleBar.getScrollElement();

    this.scrollButtonTarget.style.display =
      simplebarWrapper.clientHeight >= this.messagesContainerTarget.clientHeight
        ? "flex"
        : "none";

    simplebarWrapper.addEventListener("scroll", (event) => {
      const element = event.target as HTMLElement;
      const displayScrollOffset =
        element.scrollHeight - simplebarWrapper.clientHeight;
      this.scrollButtonTarget.style.display =
        displayScrollOffset - element.scrollTop > 100 ? "flex" : "none";
    });
  }

  scrollToBottom(event: Event): void {
    // This will stop us from losing focus if we are typing a message
    // and closing the keyboard on mobile
    event.stopPropagation();

    const lastChild = this.messagesTarget.lastElementChild;

    if (!lastChild) {
      return;
    }

    // This is the equivalent of doing {end} style and is supported by Safari
    lastChild.scrollIntoView(false);
  }
}
