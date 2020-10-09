import Timecode from "util/timecode";

export default class {
  private readonly canvas: HTMLCanvasElement;
  private readonly timecodeUpdatedCallback: () => void;
  private canvasCtx: CanvasRenderingContext2D;
  private _timecodeMs: number;

  constructor(timecodeUpdatedCallback: () => void) {
    this.timecodeUpdatedCallback = timecodeUpdatedCallback;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute(
      "width",
      (Timecode.codeCount * Timecode.digitWidth).toString()
    );
    this.canvas.setAttribute("height", Timecode.digitHeight.toString());
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
    const colorSequence = [];
    const pixelOffset = Timecode.digitWidth / 2;
    for (let index = 0; index < Timecode.codeCount; index++) {
      const dataStart = (pixelOffset + Timecode.digitWidth * index) * 4;
      colorSequence.push(imageData.data.slice(dataStart, dataStart + 3));
    }
    this.timecode = Timecode.decodeColorSequence(colorSequence.reverse());
  }

  // This is just for debugging
  drawCanvas(videoTarget: HTMLVideoElement, ratioToOriginal: number): void {
    this.canvasCtx.drawImage(
      videoTarget,
      videoTarget.videoWidth -
        Timecode.codeCount * Timecode.digitWidth * ratioToOriginal,
      videoTarget.videoHeight - Timecode.digitHeight * ratioToOriginal,
      Timecode.digitWidth * Timecode.codeCount * ratioToOriginal,
      Timecode.digitHeight * ratioToOriginal,
      0,
      0,
      Timecode.digitWidth * Timecode.codeCount,
      Timecode.digitHeight
    );
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
