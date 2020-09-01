import { Controller } from "stimulus";
import Hls from "hls.js";

export default class extends Controller {
  static targets = ["addressBar", "canvas"];
  readonly addressBarTarget!: HTMLInputElement;
  readonly canvasTarget!: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  secret: number;
  krangMessageCallback: EventListenerOrEventListenerObject;

  connect(): void {}
}
