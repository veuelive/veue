import Timecode from "util/timecode";
import { TimecodeSection } from "types/video_layout";

export default class {
  private readonly canvas: HTMLCanvasElement;
  private readonly timecodeUpdatedCallback: () => void;
  public readonly canvasCtx: CanvasRenderingContext2D;
  private _timecodeMs: number;
  private timecodeLayout: TimecodeSection;

  constructor(
    timecodeLayout: TimecodeSection,
    timecodeUpdatedCallback: () => void
  ) {
    this.timecodeLayout = timecodeLayout;
    this.timecodeUpdatedCallback = timecodeUpdatedCallback;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", timecodeLayout.width.toString());
    this.canvas.setAttribute("height", timecodeLayout.height.toString());
    this.canvas.setAttribute("style", "display: none;");
    this.canvasCtx = this.canvas.getContext("2d");
    document
      .getElementsByClassName("fixed-secondary-canvas")[0]
      .insertAdjacentElement("afterend", this.canvas);

    setInterval(() => this.sync(), 100);
  }

  sync(): void {
    const imageData = this.canvasCtx.getImageData(
      0,
      this.canvas.height / 2,
      this.canvas.width,
      1
    );
    const digitWidth = this.timecodeLayout.width / this.timecodeLayout.digits;
    const colorSequence = [];
    const pixelOffset = digitWidth / 2;
    for (let index = 0; index < this.timecodeLayout.digits; index++) {
      const dataStart = (pixelOffset + digitWidth * index) * 4;
      colorSequence.push(imageData.data.slice(dataStart, dataStart + 3));
    }
    this.timecode = Timecode.decodeColorSequence(colorSequence.reverse());
  }

  set timecode(timecodeMs: number) {
    if (timecodeMs != this._timecodeMs) {
      this._timecodeMs = timecodeMs;
      this.timecodeUpdatedCallback();
    }
  }

  get timecodeMs(): number {
    return this._timecodeMs;
  }

  get timecodeSeconds(): number {
    return this._timecodeMs / 1000.0;
  }
}

export function getTimecodeMs(): number {
  return parseInt(
    document
      .querySelector("*[data-audience-view-timecode]")
      .getAttribute("data-audience-view-timecode"),
    10
  );
}
