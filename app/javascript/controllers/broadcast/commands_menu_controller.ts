import { Controller } from "stimulus";
import { secureFetch } from "util/fetch";

export const ShowMenuEvent = "ShowMenu";
export const CloseMenuEvent = "CloseMenu";
export const ResetMenuEvent = "ResetMenu";

export default class extends Controller {
  element!: HTMLElement;

  static targets = ["menuItems"];

  private menuItemsTarget!: HTMLElement;

  connect(): void {
    document.addEventListener(ShowMenuEvent, this.showMenuHandler.bind(this));
    document.addEventListener(CloseMenuEvent, this.closeMenu.bind(this));
    document.addEventListener(ResetMenuEvent, this.resetMenu.bind(this));
  }

  disconnect(): void {
    document.removeEventListener(ShowMenuEvent, this.showMenuHandler);
    document.removeEventListener(CloseMenuEvent, this.closeMenu.bind(this));
    document.removeEventListener(ResetMenuEvent, this.closeMenu.bind(this));
  }

  private async showMenuHandler(event: CustomEvent): Promise<void> {
    const data = event.detail;
    console.log(data.type);
    console.log(this.type);

    if (data.type === this.type) {
      this.closeMenu();
    } else {
      if (this.type) this.element.classList.remove(this.type);

      this.element.classList.add(data.type);
      this.element.style.display = "flex";
      this.type = data.type;
    }
  }

  private closeMenu(): void {
    this.resetMenu();
    console.log("hello close", this.type);

    this.type = "";
    this.element.style.display = "none";
  }

  private resetMenu(): void {
    this.menuItemsTarget.innerHTML = "";
    this.element.classList.remove(this.type);
  }

  get type(): string {
    return this.data.get("type");
  }

  set type(type: string) {
    this.data.set("type", type);
  }
}
