import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["rightMenu"];

  readonly rightMenuTarget: HTMLElement;

  openRightMenu(): void {
    this.rightMenuTarget.style.display = "flex";
  }

  closeRightMenu(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target && target.id && target.id === "close-menu") {
      this.rightMenuTarget.style.display = "none";
    }
  }
}
