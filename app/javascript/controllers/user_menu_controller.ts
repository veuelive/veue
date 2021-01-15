import { Controller } from "stimulus";
import debounce from "util/debounce";

export default class extends Controller {
  static targets = ["area", "menu"];
  areaTarget!: HTMLDivElement;
  menuTarget!: HTMLDivElement;
  isOpen = false;

  connect(): void {
    this.isOpen = false;
    this.layout();
  }

  @debounce(100)
  openOrCloseEvent(event: Event): void {
    console.log(event.type, this.isOpen);
    switch (event.type) {
      case "click":
        if (this.isOpen == true) {
          // Since we don't want to interrupt clicks that
          // are navigating us somewhere, we should make sure
          // we don't close if it's a link being clicked
          if (!(event.target instanceof HTMLAnchorElement)) {
            this.closeMenu();
          }
        } else {
          this.openMenu();
        }
        return;
      case "mouseenter":
        this.openMenu();
        return;
      case "mouseleave":
        this.closeMenu();
    }
  }

  closeMenu(): void {
    console.log("Close Menu");
    this.isOpen = false;
    this.menuTarget.style.display = "none";
  }

  openMenu(): void {
    console.log("open");
    this.isOpen = true;
    this.menuTarget.style.display = "block";
  }

  layout(): void {
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
