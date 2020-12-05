import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    this.element.ondragenter = this.onDragEnter.bind(this);
    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);

    this.element.ondrop = this.onDrop.bind(this);
    super.connect();
  }

  onDragLeave(event): void {
    console.log("onDragLeave");
  }
  onDragEnter(event): void {
    console.log("onDragEnter");
  }

  onDragOver(event): void {
    event.preventDefault();
  }

  onDrop(event): void {
    const corner = this.element.attributes["data-corner"].value;
    event.srcElement.classList.remove(
      "bottom-right",
      "top-left",
      "top-right",
      "bottom-left"
    );
    event.srcElement.classList.add(corner);
  }
}
