import { Controller } from "stimulus";
import { DebugKeyEvent } from "types/keyboard_mapping";

export default class extends Controller {
  static targets = ["debugArea"];
  private debugAreaTarget!: HTMLElement;
  hidden = true;
  private debugKeyListener: () => void;
  private environmentListener: (event: CustomEvent) => void;

  connect(): void {
    this.debugKeyListener = () => this.showHideAction();
    document.addEventListener(DebugKeyEvent, this.debugKeyListener);
  }

  disconnect(): void {
    document.removeEventListener(DebugKeyEvent, this.environmentListener);
  }

  showHideAction(): void {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  show(): void {
    this.debugAreaTarget.setAttribute("style", "width: 280px; height: 400px;");
    this.hidden = false;
  }

  hide(): void {
    this.debugAreaTarget.setAttribute("style", "width: 0px; height: 0px;");
    this.hidden = true;
  }
}
