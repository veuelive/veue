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
    switch (event.type) {
      case "click":
        if (this.areaTarget.dataset["isOpen"] == "true") {
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
      case "pointerenter":
        this.openMenu();
        return;
      case "pointerleave":
        this.closeMenu();
    }
  }

  closeMenu(): void {
    this.areaTarget.dataset["isOpen"] = "false";
  }

  openMenu(): void {
    this.areaTarget.dataset["isOpen"] = "true";
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
