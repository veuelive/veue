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
    this.topLeftTarget.ondragenter = () => this.movePipTo("top-left");
    this.topRightTarget.ondragenter = () => this.movePipTo("top-right");
    this.bottomLeftTarget.ondragenter = () => this.movePipTo("bottom-left");
    this.bottomRightTarget.ondragenter = () => this.movePipTo("bottom-right");
    this.pipComponentTarget.dataset.corner = "bottom-right";
  }

  movePipTo(corner: string): void {
    this.pipComponentTarget.dataset.corner = corner;
  }
}
