import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = ["form", "channelName", "channelTabs", "editableContent"];

  readonly formTarget!: HTMLFormElement;
  readonly channelNameTarget!: HTMLInputElement;
  readonly channelTabsTargets!: HTMLElement[];
  readonly editableContentTarget!: HTMLElement;

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;
    submitButton.disabled = true;

    const response = await putForm(
      `/${this.currentChannelId}`,
      this.formTarget
    );

    const html = await response.text();
    this.editableContentTarget.innerHTML = html;

    const hilightedElement = document.querySelector(
      ".channel-menu__item.active .channel-menu__item__name"
    );
    hilightedElement.innerHTML = this.channelNameTarget.value;

    showNotification("Your channel was successfully updated");
  }

  selectChannel(event: Event): void {
    this.channelTabsTargets.forEach((element) => {
      if (element == event.currentTarget) {
        this.openChannel(element);
      } else {
        element.classList.remove("active");
      }
    });
  }

  async openChannel(element: HTMLElement): Promise<void> {
    this.currentChannelId = element.dataset["channelId"];

    const requestUrl = `/${this.currentChannelId}/edit`;
    const response = await putForm(requestUrl, {});
    const html = await response.text();

    this.editableContentTarget.innerHTML = html;
    element.classList.add("active");
  }

  set currentChannelId(channelId: string) {
    this.data.set("channelId", channelId);
  }

  get currentChannelId(): string {
    return this.data.get("channelId");
  }
}
