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
  static targets = [
    "pipComponent",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ];

  private pipComponentTarget!: HTMLCanvasElement;
  private topLeftTarget!: HTMLElement;
  private topRightTarget!: HTMLElement;
  private bottomLeftTarget!: HTMLElement;
  private bottomRightTarget!: HTMLElement;

  connect(): void {
    this.pipComponentTarget.classList.add("bottom-right");

    this.pipComponentTarget.draggable = true;
    this.pipComponentTarget.ondragstart = this.onDragStart.bind(this);

    this.topLeftTarget.ondragenter = () => this.movePipTo("top-left");
    this.topRightTarget.ondragenter = () => this.movePipTo("top-right");
    this.bottomLeftTarget.ondragenter = () => this.movePipTo("bottom-left");
    this.bottomRightTarget.ondragenter = () => this.movePipTo("bottom-right");

    // prevent default is need to avoid interface glitches in touch envs
    this.topLeftTarget.ondragover = (event: DragEvent) =>
      event.preventDefault();
    this.topRightTarget.ondragover = (event: DragEvent) =>
      event.preventDefault();
    this.bottomLeftTarget.ondragover = (event: DragEvent) =>
      event.preventDefault();
    this.bottomRightTarget.ondragover = (event: DragEvent) =>
      event.preventDefault();

    // move pip to bottom-right upon load
    this.pipComponentTarget.dataset.corner = "bottom-right";
  }

  onDragStart(event: DataTransfer): void {
    event.dropEffect = "none";
  }

  movePipTo(corner: string): void {
    this.pipComponentTarget.dataset.corner = corner;
  }
}
