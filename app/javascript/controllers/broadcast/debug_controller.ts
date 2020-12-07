import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["debugArea"];
  private debugAreaTarget!: HTMLElement;
  hidden = true;

  showHideAction(): void {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  show(): void {
    this.debugAreaTarget.setAttribute("style", "width: 200px; height: 200px;");
    this.hidden = false;
  }

  hide(): void {
    this.debugAreaTarget.setAttribute("style", "width: 0px; height: 0px;");
    this.hidden = true;
  }
}
