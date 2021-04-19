import { Size } from "types/rectangle";
import { LayoutSection, VideoSourceType } from "types/video_layout";
import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export abstract class VideoCaptureSource extends CaptureSource implements Size {
  layout: LayoutSection;
  element: HTMLVideoElement;

  get mediaDeviceType(): MediaDeviceKind {
    return "videoinput";
  }

  get width(): number {
    return this.layout.width;
  }

  get height(): number {
    return this.layout.height;
  }

  abstract get videoSourceType(): VideoSourceType;

  processMediaStream(
    mediaStream: MediaStream,
    videoElement?: HTMLVideoElement
  ): Promise<HTMLVideoElement> {
    const track = mediaStream.getVideoTracks()[0];
    this.deviceId = track.getSettings().deviceId;
    this.element = videoElement || this.createVideoElement();
    this.element.muted = true;
    // this.element.addEventListener("resize", () => {
    //   this.updateLayoutSize();
    // });
    this.element.srcObject = mediaStream;
    return new Promise((resolve) => {
      this.element.addEventListener("loadedmetadata", async () => {
        this.element.play().then(() => resolve(this.element));
      });
    });
  }

  protected createVideoElement(): HTMLVideoElement {
    const element = document.createElement("video");
    element.setAttribute("style", "display: none");
    document.body.append(element);
    return element;
  }

  public captureImage(): Promise<Blob> {
    const tempCanvas = document.createElement("canvas");
    const layout = this.layout;
    tempCanvas.height = layout.height;
    tempCanvas.width = layout.width;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(
      this.element,
      layout.x,
      layout.y,
      layout.width,
      layout.height,
      0,
      0,
      layout.width,
      layout.height
    );

    return new Promise((resolve, reject) => {
      tempCanvas.toBlob((data) => {
        if (data == null) {
          reject("Couldn't take screenshot");
        } else {
          resolve(data);
          tempCanvas.remove();
        }
      });
    });
  }
}
