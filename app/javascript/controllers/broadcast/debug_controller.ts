import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["debugArea"];
  private debugAreaTarget!: HTMLElement;

  showHideAction(): void {
    this.show();
    console.log("press");
  }

  show(): void {
    this.debugAreaTarget.setAttribute("style", "width: 200px; height: 200px;");
  }

  hide(): void {
    this.debugAreaTarget.setAttribute("style", "width: 0px; height: 0px;");
  }
}
