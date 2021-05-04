import { Controller } from "stimulus";
import { putForm } from "util/fetch";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = [
    "form",
    "channelName",
    "channelTabs",
    "channelMenu",
    "editableContent",
  ];

  readonly formTarget!: HTMLFormElement;
  readonly channelNameTarget!: HTMLInputElement;
  readonly channelTabsTargets!: HTMLElement[];
  readonly editableContentTarget!: HTMLElement;
  readonly channelMenuTarget!: HTMLElement;
  readonly channelTabTarget!: HTMLElement;

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

    const hilightedElement = document
      .querySelector(".channel-menu__item.active")
      .getElementsByClassName("channel-menu__item__name")[0];
    hilightedElement.innerHTML = this.channelNameTarget.value;

    showNotification("Your channel was successfully updated");
  }

  selectChannel(event: Event): void {
    this.channelTabsTargets.forEach((element) => {
      if (
        element == event.currentTarget &&
        !element.classList.contains("active")
      ) {
        this.openChannel(element);
      } else {
        element.classList.remove("active");
      }
    });
  }

  async openChannel(element: HTMLElement): Promise<void> {
    const channelId = element.dataset["channelId"];
    this.currentChannelId = channelId;

    const requestUrl = `/${channelId}/edit`;
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
