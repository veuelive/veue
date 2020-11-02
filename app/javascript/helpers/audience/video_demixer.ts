import Sizes from "types/sizes";
import TimecodeSynchronizer from "./timecode_synchronizer";

export default class VideoDemixer {
  private primaryCtx: CanvasRenderingContext2D;
  private secondaryCtxs: Array<CanvasRenderingContext2D>;
  private videoElement: HTMLVideoElement;
  private timecodeSynchronizer: TimecodeSynchronizer;

  constructor(
    videoElement: HTMLVideoElement,
    primaryCanvas: HTMLCanvasElement,
    secondaryCanvases: HTMLCanvasElement[],
    timecodeSynchronizer: TimecodeSynchronizer
  ) {
    this.videoElement = videoElement;
    this.timecodeSynchronizer = timecodeSynchronizer;
    this.primaryCtx = primaryCanvas.getContext("2d");

    this.secondaryCtxs = secondaryCanvases.map((canvas) =>
      canvas.getContext("2d")
    );

    this.drawFrame();
  }

  private drawFrame() {
    const browserCtx = this.primaryCtx;
    const fullVideoWidth = this.videoElement.videoWidth;
    const fullVideoHeight = this.videoElement.videoHeight;
    const sy =
      (Sizes.primaryView.height / Sizes.fullCanvas.height) * fullVideoHeight;
    const ratioToOriginal = fullVideoHeight / Sizes.fullCanvas.height;

    if (this.videoElement.videoHeight > 0) {
      browserCtx.drawImage(
        this.videoElement,
        0,
        0,
        fullVideoWidth,
        fullVideoHeight,
        0,
        0,
        Sizes.fullCanvas.width,
        Sizes.fullCanvas.height
      );
      for (const secondaryCtx of this.secondaryCtxs) {
        secondaryCtx.drawImage(
          this.videoElement,
          0,
          sy,
          Sizes.secondaryView.width * ratioToOriginal,
          Sizes.secondaryView.height * ratioToOriginal,
          0,
          0,
          Sizes.secondaryView.width,
          Sizes.secondaryView.height
        );
      }
      this.timecodeSynchronizer.drawCanvas(this.videoElement, ratioToOriginal);
    }

    requestAnimationFrame(() => this.drawFrame());
  }
}
