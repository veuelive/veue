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
    this.element.classList.add("bottom-right");

    this.element.draggable = true;
    this.element.ondragstart = this.onDragStart.bind(this);

    this.topLeftTarget.ondragenter = () => this.movePipTo("top-left");
    this.topRightTarget.ondragenter = () => this.movePipTo("top-right");
    this.bottomLeftTarget.ondragenter = () => this.movePipTo("bottom-left");
    this.bottomRightTarget.ondragenter = () => this.movePipTo("bottom-right");

    // prevent default is need to avoid interface glitches in touch envs
    this.topLeftTarget.ondragover = event.preventDefault();
    this.topRightTarget.ondragover = event.preventDefault();
    this.bottomLeftTarget.ondragover = event.preventDefault();
    this.bottomRightTarget.ondragover = event.preventDefault();

    // move pip to bottom-right upon load
    this.pipComponentTarget.dataset.corner = "bottom-right";
  }

  onDragStart(event: Event): void {
    event.dropEffect = "none";
  }

  movePipTo(corner: string): void {
    this.pipComponentTarget.dataset.corner = corner;
  }
}
