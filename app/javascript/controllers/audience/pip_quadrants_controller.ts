import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    // ondragenter is attached by audience_view_controller
    this.element.ondragleave = this.onDragLeave.bind(this);
    this.element.ondragover = this.onDragOver.bind(this);
    this.element.onDrop = this.onDrop.bind(this);

    super.connect();
  }

  onDragLeave(event): void {}
  onDrop(event): void {}
  onDragOver(event): void {
    event.preventDefault();
  }
}
