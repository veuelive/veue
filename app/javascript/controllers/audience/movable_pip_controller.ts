import { Controller } from "stimulus";
import { polyfill } from "mobile-drag-drop";

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

// options are optional ;)
polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

export default class MovablePipController extends Controller {
  static targets = ["pipComponent"];

  private pipComponentTarget!: HTMLCanvasElement;

  connect(): void {
    this.pipComponentTarget.classList.add("bottom-right");
    this.pipComponentTarget.draggable = true;
    this.pipComponentTarget.dataset.corner = "bottom-right";
  }

  dragOverHandler(event: DragEvent): void {
    event.preventDefault();
  }

  dragEnterHandler(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const corner = target.dataset.corner;
    this.movePipTo(corner);
  }

  dragStartHandler(event: DataTransfer): void {
    event.dropEffect = "none";
  }

  movePipTo(corner: string): void {
    this.pipComponentTarget.dataset.corner = corner;
  }
}
