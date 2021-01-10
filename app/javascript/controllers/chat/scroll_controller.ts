import { Controller } from "stimulus";
import SimpleBar from "simplebar";

export default class extends Controller {
  static targets = ["messages", "scrollButton"];

  readonly messagesTarget!: HTMLElement;
  readonly scrollButtonTarget!: HTMLElement;

  connect(): void {
    const messagesContainer = document.getElementsByClassName(
      "messages-overflow-container"
    )[0] as HTMLElement;

    const simpleBar = new SimpleBar(messagesContainer);
    const simplebarWrapper = simpleBar.getScrollElement();
    const simplebarContent = simpleBar.getContentElement();

    this.scrollButtonTarget.style.display =
      simplebarWrapper.clientHeight >= messagesContainer.clientHeight
        ? "flex"
        : "none";

    simplebarWrapper.addEventListener("scroll", (event) => {
      const displayScrollOffset =
        event.target.scrollHeight - simplebarWrapper.clientHeight;
      this.scrollButtonTarget.style.display =
        displayScrollOffset - event.target.scrollTop > 100 ? "flex" : "none";
    });
  }

  scrollToBottom(): void {
    this.messagesTarget.lastElementChild.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}
