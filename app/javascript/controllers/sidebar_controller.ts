import { Controller } from "stimulus";

export default class extends Controller {
  private rightMenu!: HTMLElement;

  connect(): void {
    this.rightMenu = document.getElementById("right-menu");
  }

  openRightMenu(): void {
    this.rightMenu.style.display = "flex";
  }

  closeRightMenu(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target && target.id && target.id === "close-menu") {
      this.rightMenu.style.display = "none";
    }
  }
}
