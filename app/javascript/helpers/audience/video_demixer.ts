import { BroadcastVideoLayout, LayoutSection } from "types/video_layout";
import { Rectangle } from "types/rectangle";
import { VideoEventProcessor } from "helpers/event/event_processor";
import { DefaultVideoLayout } from "types/sizes";

export default class VideoDemixer {
  private canvasContextGroups: Array<Array<CanvasRenderingContext2D>>;
  private videoElement: HTMLVideoElement;
  private _videoLayout: BroadcastVideoLayout;
  private sectionsByPriority: Array<LayoutSection>;

  constructor(
    videoElement: HTMLVideoElement,
    canvasesByPriority: HTMLCanvasElement[][]
  ) {
    this.canvasContextGroups = canvasesByPriority.map((canvasGroup) =>
      canvasGroup.map((canvas) => canvas.getContext("2d"))
    );

    this.videoLayout = DefaultVideoLayout;
    VideoEventProcessor.subscribeTo("VideoLayoutEvent", (event) => {
      this.videoLayout = event.detail.data;
    });
    this.videoElement = videoElement;

    this.drawFrame();
  }

  set videoLayout(videoLayout: BroadcastVideoLayout) {
    this._videoLayout = videoLayout;
    this.sectionsByPriority = this.videoLayout.sections.sort(
      (a, b) => a.priority - b.priority
    );

    // We need to go through all the canvas areas and hide them if
    // there isn't any video content to go on them– we do this by adding
    // a hidden class.
    for (let i = 0; i < this.canvasContextGroups.length; i++) {
      const canvasContextGroup = this.canvasContextGroups[i];
      const sectionLayout = !!this.sectionsByPriority[i];
      for (const canvasCtx of canvasContextGroup) {
        if (sectionLayout) {
          canvasCtx.canvas.classList.remove("hidden");
        } else {
          canvasCtx.canvas.classList.add("hidden");
        }
      }
    }
  }

  get videoLayout(): BroadcastVideoLayout {
    return this._videoLayout;
  }

  private drawFrame() {
    const pixelDensity =
      this.videoElement.videoHeight / this.videoLayout.height;

    if (this.videoElement.videoHeight > 0) {
      for (let i = 0; i < this.canvasContextGroups.length; i++) {
        const canvasContextGroup = this.canvasContextGroups[i];
        const sectionLayout = this.sectionsByPriority[i];
        if (sectionLayout) {
          for (const canvasCtx of canvasContextGroup) {
            this.drawSection(canvasCtx, pixelDensity, sectionLayout);
          }
        }
      }
    }

    requestAnimationFrame(() => this.drawFrame());
  }

  private drawSection(
    canvasCtx: CanvasRenderingContext2D,
    pixelDensity: number,
    sectionLayout: Rectangle
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
