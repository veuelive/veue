import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    // ondragenter is attached by audience_view_controller
    // this.element.ondragenter = this.onDragEnter.bind(this);

    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    // this.element.onDrop = this.onDrop.bind(this);

    super.connect();
  }

  onDragLeave(event): void {
    console.log("onDragLeave ", this);
    console.log("onDragLeave ", event.currentTarget);
  }

  onDragOver(event): void {
    event.preventDefault();
  }
}
