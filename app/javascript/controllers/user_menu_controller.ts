import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["area", "menu"];
  areaTarget!: HTMLDivElement;
  menuTarget!: HTMLDivElement;
  isOpen = false;

  connect(): void {
    this.isOpen = false;
    this.layout();
  }

  toggleOpen(event: Event): void {
    if (this.isOpen) {
      // Since we don't want to interrupt clicks that
      // are navigating us somewhere, we should make sure
      // we don't close if it's a link being clicked
      if (!(event.target instanceof HTMLAnchorElement)) {
        this.closeMenu();
      }
    } else {
      this.openMenu();
    }
  }

  closeMenu() {
    this.isOpen = false;
    this.menuTarget.style.display = "none";
  }

  openMenu() {
    this.isOpen = true;
    this.menuTarget.style.display = "block";
  }

  layout() {
    if (document.body.clientWidth > 650) {
      this.menuTarget.dataset.mode = "dropdown";
      this.menuTarget.setAttribute("style", "");
    } else {
      this.menuTarget.dataset.mode = "mobile";
      const height = document.body.clientHeight - 54;
      this.menuTarget.setAttribute("style", `height: ${height}px`);
    }
  }
}
