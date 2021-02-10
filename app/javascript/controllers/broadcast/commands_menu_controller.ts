import { Controller } from "stimulus";

export const ShowMenuEvent = "ShowMenu";

export default class extends Controller {
  element!: HTMLElement;

  static targets = ["title", "menuItems", "settingsForm"];

  private titleTarget!: HTMLElement;
  private menuItemsTarget!: HTMLElement;
  private settingsFormTarget: HTMLElement;

  connect(): void {
    document.addEventListener(ShowMenuEvent, this.showMenuHandler.bind(this));
  }

  disconnect(): void {
    document.removeEventListener(ShowMenuEvent, this.showMenuHandler);
  }

  private showMenuHandler = (event: CustomEvent): void => {
    const data = event.detail;

    if (data.type === this.type) {
      this.element.style.display = "none";
      this.menuItemsTarget.innerHTML = "";
      this.type = "";
    } else {
      this.type = data.type;
      let markup = "";
      this.settingsFormTarget.style.display = "none";

      if (["videoinput", "audioinput"].includes(this.type)) {
        data.devices?.forEach((device) => {
          markup += this.deviceMenuItem(device);
        });
      } else if (this.type === "share") {
        markup = this.shareMenuItem();
      } else if (this.type === "settings") {
        this.settingsFormTarget.style.display = "block";
      }

      if (!!markup) this.menuItemsTarget.innerHTML = markup;
      this.titleTarget.innerHTML = "Settings";
      this.element.style.display = "flex";
    }
  };

  private deviceMenuItem(device): string {
    return `
      <div class="select-menu--content__body__item" data-media-id=${device.deviceId}>
        ${device.label}
      </div>
    `;
  }

  private shareMenuItem(): string {
    return `
      <div class="select-menu--content__body__item" data-action="click->broadcast--share#openLink">
        Open Link
      </div>
      <div class="select-menu--content__body__item" data-action="click->broadcast--share#copyLink">
        Copy Link
      </div>
    `;
  }

  get type(): string {
    return this.data.get("type");
  }

  set type(type: string) {
    this.data.set("type", type);
  }
}
