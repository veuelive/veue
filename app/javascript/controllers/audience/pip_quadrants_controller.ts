import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    // ondragenter and onDrop is attached by audience_view_controller
    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    super.connect();
  }

  onDragLeave(): void {}

  onDragOver(event): void {
    debugger;
    event.preventDefault();
  }
}
