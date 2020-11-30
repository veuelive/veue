import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    this.element.ondragenter = this.onDragEnter.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    this.element.ondrop = this.onDrop.bind(this);
    super.connect();
  }

  onDragEnter(event): void {
    console.log("onDragEnter");
  }

  onDragOver(event): void {
    console.log("onDragOver");
  }

  onDrop(event): void {
    console.log("onDrop");
  }
}
