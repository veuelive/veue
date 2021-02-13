import { Controller } from "stimulus";
import { secureFetch } from "util/fetch";

export const ShowMenuEvent = "ShowMenu";
export const CloseMenuEvent = "CloseMenu";

export default class extends Controller {
  element!: HTMLElement;

  static targets = ["menuItems", "settingsForm"];

  private menuItemsTarget!: HTMLElement;
  private settingsFormTarget: HTMLElement;

  connect(): void {
    document.addEventListener(ShowMenuEvent, this.showMenuHandler.bind(this));
    document.addEventListener(CloseMenuEvent, this.resetMenu.bind(this));
  }

  disconnect(): void {
    document.removeEventListener(ShowMenuEvent, this.showMenuHandler);
  }

  private async showMenuHandler(event: CustomEvent): Promise<void> {
    const data = event.detail;

    if (data.type === this.type) {
      this.resetMenu();
    } else {
      if (this.type) this.element.classList.remove(this.type);

      this.element.classList.add(data.type);
      this.element.style.display = "flex";
      this.type = data.type;
    }
  }

  private resetMenu(): void {
    this.menuItemsTarget.innerHTML = "";
    this.element.style.display = "none";
    this.element.classList.remove(this.type);
    this.type = "";
  }

  get type(): string {
    return this.data.get("type");
  }

  set type(type: string) {
    this.data.set("type", type);
  }
}
