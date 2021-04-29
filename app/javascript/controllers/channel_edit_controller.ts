import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = [
    "form",
    "channelName",
    "channelTabs",
    "channelMenu",
    "channelTab",
  ];

  readonly formTarget!: HTMLFormElement;
  readonly channelNameTarget!: HTMLInputElement;
  readonly channelTabsTargets!: HTMLElement[];
  readonly channelMenuTarget!: HTMLElement;
  readonly channelTabTarget!: HTMLElement;

  connect(): void {
    this.channelTabTarget.style.display = "block";
  }

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;

    submitButton.disabled = true;
    const response = await putForm(".", this.formTarget);

    const html = await response.text();
    this.formTarget.parentElement.innerHTML = html;

    document.querySelector(
      ".active"
    ).children[0].children[0].innerHTML = this.channelNameTarget.value;

    showNotification("Your channel was successfully updated");
  }

  async selectChannel(event: Event): Promise<void> {
    this.channelTabsTargets.forEach(async (element) => {
      if (element == event.currentTarget) {
        if (!element.classList.contains("active")) {
          const response = await putForm(element.dataset["url"], {});
          const html = await response.text();
          this.formTarget.parentElement.innerHTML = html;
          element.classList.add("active");
          window.history.replaceState(
            window.location.href,
            document.title,
            element.dataset["url"]
          );
        }
      } else if (element.classList.contains("active")) {
        element.classList.remove("active");
      }
    });
    this.closeMenu();
  }

  openMenu(): void {
    if (document.body.clientWidth < 650) {
      this.channelMenuTarget.style.display = "block";
      this.channelTabTarget.style.display = "none";
    }
  }

  closeMenu(): void {
    if (document.body.clientWidth < 650) {
      this.channelMenuTarget.style.display = "none";
      this.channelTabTarget.style.display = "block";
    }
  }
}
