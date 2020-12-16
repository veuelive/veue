import { Controller } from "stimulus";

export default class PipQuadrantsController extends Controller {
  connect(): void {
    // ondragenter is attached by
    // movable_pip_controller.ts
    this.element.ondragover = this.onDragOver.bind(this);
    super.connect();
  }

  onDragOver(event: any): void {
    // this is to prevent interface glitches in touch/swipe devices
    event.preventDefault();
  }
}
