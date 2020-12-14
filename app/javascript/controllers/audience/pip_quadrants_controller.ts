import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    // ondragenter and onDrop is attached by audience_view_controller
    console.log("PipQuadrantsController connect.....");
    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    // this.element.ondragenter = this.onDragEnter.bind(this);
    super.connect();
  }

  onDragLeave(event): void {}

  // onDragEnter(event): void {
  //   console.log("ondragenter.......");
  // }

  onDragOver(event): void {
    event.preventDefault();
  }
}
