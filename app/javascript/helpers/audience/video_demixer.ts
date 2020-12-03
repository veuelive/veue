import Sizes, { DefaultVideoLayout } from "types/sizes";
import TimecodeSynchronizer from "./timecode_synchronizer";
import VideoLayout, { LayoutSection } from "types/video_layout";

export default class VideoDemixer {
  private canvasContextGroups: Array<Array<CanvasRenderingContext2D>>;
  private videoElement: HTMLVideoElement;
  private timecodeSynchronizer: TimecodeSynchronizer;
  private videoLayout: VideoLayout;
  private sectionsByPriority: Array<LayoutSection>;

  constructor(
    videoElement: HTMLVideoElement,
    canvasesByPriority: HTMLCanvasElement[][],
    timecodeSynchronizer: TimecodeSynchronizer
  ) {
    // This is set with a default, but later will need to be not just dynamically updated
    // but likely the number of canvases will be controlled by this plus a layout mapping
    this.videoLayout = DefaultVideoLayout;
    this.videoElement = videoElement;
    this.timecodeSynchronizer = timecodeSynchronizer;

    this.canvasContextGroups = canvasesByPriority.map((canvasGroup) =>
      canvasGroup.map((canvas) => canvas.getContext("2d"))
    );

    this.sectionsByPriority = this.videoLayout.sections.sort(
      (a, b) => a.priority - b.priority
    );

    this.drawFrame();
  }

  private drawFrame() {
    const pixelDensity =
      this.videoElement.videoHeight / Sizes.fullCanvas.height;

    if (this.videoElement.videoHeight > 0) {
      for (let i = 0; i < this.canvasContextGroups.length; i++) {
        const canvasContextGroup = this.canvasContextGroups[i];
        const sectionLayout = this.sectionsByPriority[i];
        for (const canvasCtx of canvasContextGroup) {
          this.drawSection(canvasCtx, pixelDensity, sectionLayout);
        }
      }

      this.drawSection(
        this.timecodeSynchronizer.canvasCtx,
        pixelDensity,
        this.videoLayout.timecode
      );
    }

    requestAnimationFrame(() => this.drawFrame());
  }

  private drawSection(
    canvasCtx: CanvasRenderingContext2D,
    pixelDensity: number,
    sectionLayout: LayoutSection
  ) {
    canvasCtx.canvas.width = sectionLayout.width;
    canvasCtx.canvas.height = sectionLayout.height;
    canvasCtx.drawImage(
      this.videoElement,
      sectionLayout.x * pixelDensity,
      sectionLayout.y * pixelDensity,
      sectionLayout.width * pixelDensity,
      sectionLayout.height * pixelDensity,
      0,
      0,
      sectionLayout.width,
      sectionLayout.height
    );
  }
}
