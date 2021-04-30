import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = ["form", "channelName", "channelTabs", "channelMenu"];

  readonly formTarget!: HTMLFormElement;
  readonly channelNameTarget!: HTMLInputElement;
  readonly channelTabsTargets!: HTMLElement[];
  readonly channelMenuTarget!: HTMLElement;
  readonly channelTabTarget!: HTMLElement;

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;

    submitButton.disabled = true;
    const response = await putForm(".", this.formTarget);

    const html = await response.text();
    this.formTarget.parentElement.innerHTML = html;

    document.querySelector(
      ".active"
    ).children[1].children[0].innerHTML = this.channelNameTarget.value;

    showNotification("Your channel was successfully updated");
  }

  selectChannel(event: Event): void {
    console.log("reached here");
    this.channelTabsTargets.forEach((element) => {
      if (element == event.currentTarget) {
        if (!element.classList.contains("active")) {
          this.openChannel(element);
        }
      } else if (element.classList.contains("active")) {
        element.classList.remove("active");
      }
    });
  }

  async openChannel(element): Promise<void> {
    const response = await putForm(element.dataset["url"], {});
    const html = await response.text();
    this.formTarget.parentElement.innerHTML = html;
    window.history.replaceState(
      window.location.href,
      document.title,
      element.dataset["url"]
    );
    element.classList.add("active");
  }
}
