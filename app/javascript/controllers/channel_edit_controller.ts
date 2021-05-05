import { Controller } from "stimulus";
import { putForm, secureFetch } from "util/fetch";
import { showNotification } from "util/notifications";

export default class extends Controller {
  static targets = [
    "form",
    "channelName",
    "channelTabs",
    "editableContent",
    "channelNames",
  ];

  readonly formTarget!: HTMLFormElement;
  readonly channelNameTarget!: HTMLInputElement;
  readonly channelTabsTargets!: HTMLElement[];
  readonly editableContentTarget!: HTMLElement;
  readonly channelNamesTargets!: HTMLElement[];

  async doSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const submitButton = event.target as HTMLButtonElement;
    submitButton.disabled = true;

    const response = await putForm(
      `/channels/${this.currentChannelId}`,
      this.formTarget
    );

    const html = await response.text();
    this.editableContentTarget.innerHTML = html;

    this.updateTabItemName();
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

    const requestUrl = `/channels/${this.currentChannelId}/edit`;
    const response = await secureFetch(requestUrl);
    const html = await response.text();

    this.editableContentTarget.innerHTML = html;
    element.classList.add("active");
  }

  private updateTabItemName(): void {
    this.channelTabsTargets.forEach((tab: HTMLElement) => {
      if (tab.classList.contains("active")) {
        const highlightedElement = tab.querySelector(
          ".channel-menu__item__name"
        );
        if (highlightedElement)
          highlightedElement.innerHTML = this.channelNameTarget.value;
      }
    });
  }

  set currentChannelId(channelId: string) {
    this.data.set("channelId", channelId);
  }

  get currentChannelId(): string {
    return this.data.get("channelId");
  }
}
