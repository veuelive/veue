import BaseController from "controllers/base_controller";

/**
 * This is a general purpose controller that you can use to set the max-width
 * of various neighbor elements based on the size of one of our video canvases.
 *
 * It's really just a simple wrapper around the ResizeObserver API.
 */
export default class extends BaseController {
  static targets = ["canvas", "resizable"];

  private canvasTarget!: HTMLCanvasElement;
  private resizableTargets!: HTMLElement[];
  private observer = new ResizeObserver(this.canvasResized.bind(this));

  connect(): void {
    this.observer.observe(this.canvasTarget);
  }

  disconnect(): void {
    this.observer.unobserve(this.canvasTarget);
  }

  canvasResized(): void {
    const width = `${this.canvasTarget.clientWidth}px`;
    this.resizableTargets.forEach((target) => {
      target.style.maxWidth = width;
    });
  }
}
