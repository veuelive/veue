import { Controller } from "stimulus";
import { secureFetch } from "util/fetch";
import { changeMediaSource } from "helpers/broadcast/change_media_initializer";

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

  private async showMenuHandler(event: CustomEvent): Promise<void> {
    const data = event.detail;

    if (data.type === this.type) {
      this.resetMenu();
    } else {
      if (["videoinput", "audioinput"].includes(data.type)) {
        this.menuItemsTarget.innerHTML = "";

        data.devices?.forEach((device) => {
          this.menuItemsTarget.appendChild(
            this.deviceMenuItem(device, data.changeMediaHandler)
          );
        });
      } else if (data.type === "share") {
        const markup = this.shareMenuItem();
        this.menuItemsTarget.innerHTML = markup;
      } else if (data.type === "settings") {
        const response = await secureFetch("./edit");
        const markup = await response.text();
        this.menuItemsTarget.innerHTML = markup;
      }

      this.titleTarget.innerHTML = data.title;
      if (this.type) this.element.classList.remove(this.type);
      this.element.classList.add(data.type);
      this.element.style.display = "flex";
      this.type = data.type;
    }
  }

  private resetMenu(): void {
    this.element.style.display = "none";
    this.menuItemsTarget.innerHTML = "";
    this.element.classList.remove(this.type);
    this.type = "";
  }

  private deviceMenuItem(
    device: MediaDeviceInfo,
    mediaCalback: Function
  ): HTMLElement {
    const menuItem = document.createElement("div");
    menuItem.classList.add("select-menu--content__body__item");
    menuItem.innerText = device.label;
    menuItem.setAttribute("data-media-id", device.deviceId);
    menuItem.addEventListener("click", () => {
      changeMediaSource(device);
    });
    return menuItem;
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
