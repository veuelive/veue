import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    this.element.ondragenter = this.onDragEnter.bind(this);
    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    // ondrop is handled in audience-view
    super.connect();
  }

  onDragLeave(event): void {}
  onDragEnter(event): void {}

  onDragOver(event): void {
    console.log("onDragOver....");
    event.preventDefault();
  }
}
