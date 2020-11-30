import { Controller } from "stimulus";

export default class PipController extends Controller {
  static targets = ["canvas"];

  connect(): void {
    this.element.classList.add("bottom-right");
    this.element.draggable = true;
    this.element.ondragstart = this.onDragStart.bind(this);

    // this.element.ondragstart = this.bind(this.onDragStart)

    super.connect();
  }

  onDragStart(event): void {
    console.log("onDragEnter");
  }

  setCorner(corner: string): void {
    this.element.classList.remove(
      "bottom-right",
      "top-left",
      "top-right",
      "bottom-left"
    );
    this.element.classList.add(corner);
  }
}
