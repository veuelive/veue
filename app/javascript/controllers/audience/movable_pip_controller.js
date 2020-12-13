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
    debugger;
    console.log("MovablePipController... connect");
    this.topLeftTarget.ondragenter = () => this.movePipTo("top-left");
    this.topRightTarget.ondragenter = () => this.movePipTo("top-right");
    this.bottomLeftTarget.ondragenter = () => this.movePipTo("bottom-left");
    this.bottomRightTarget.ondragenter = () => this.movePipTo("bottom-right");

    super.connect();
  }

  movePipTo(corner: string): void {
    this.pipComponentTarget.setAttribute("data-corner-position", corner);
  }
}
