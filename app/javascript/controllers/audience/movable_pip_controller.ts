import { Controller } from "stimulus";

export default class MovablePipController extends Controller {
  static targets = [
    "pipComponent",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ];
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
