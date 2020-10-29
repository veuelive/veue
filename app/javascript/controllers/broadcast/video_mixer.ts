import { Rectangle } from "util/rectangle";
import { desktopCapturer } from "controllers/broadcast/electron/desktop_capture";
import Sizes from "util/sizes";
import { MediaDeviceChangeEvent } from "controllers/broadcast/media_manager_controller";

export default class VideoMixer {
  canvas: CaptureStreamCanvas;
  audioTrack: MediaStreamTrack;

  private readonly webcamVideoElement: HTMLVideoElement;
  private readonly browserVideoElement: HTMLVideoElement;

  private browserDimensions: Rectangle;
  private canvasContext: CanvasRenderingContext2D;

  constructor(webcamVideoElement: HTMLVideoElement) {
    this.webcamVideoElement = webcamVideoElement;

    this.browserVideoElement = document.createElement("video");
    this.browserVideoElement.setAttribute("style", "display: none");

    this.canvas = document.createElement("canvas") as CaptureStreamCanvas;
    this.canvas.setAttribute("id", "debug_canvas");
    this.canvas.setAttribute("width", Sizes.fullCanvas.width.toString());
    this.canvas.setAttribute("height", Sizes.fullCanvas.height.toString());
    if (this.canvas) {
      this.canvasContext = this.canvas.getContext("2d");
    }

    document.addEventListener(
      MediaDeviceChangeEvent,
      (ev: CustomEvent<MediaDeviceInfo>) => {
        if (ev.detail.kind === "videoinput") {
          this.startWebcamCapture(ev.detail).then();
        }
      }
    );

    this.computeFrame();
  }

  public async startWebcamCapture(
    mediaDevice?: MediaDeviceInfo
  ): Promise<void> {
    const constraints = {
      width: Sizes.secondaryView.width,
      height: Sizes.secondaryView.height,
      deviceId: null,
    };
    if (mediaDevice) {
      constraints.deviceId = mediaDevice.deviceId;
    }
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: constraints,
    });
    this.deviceId = mediaStream.getVideoTracks()[0].getSettings().deviceId;
    this.webcamVideoElement.srcObject = mediaStream;
    this.webcamVideoElement.load();
    this.webcamVideoElement.muted = true;
    return this.webcamVideoElement.play();
  }

  public getScreenshot(): Promise<void | Blob> {
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    let videoElement = this.browserVideoElement;
    if (videoElement.videoHeight === 0) {
      videoElement = this.webcamVideoElement;
    }
    tempCanvas.width = Sizes.primaryView.width;
    tempCanvas.height = Sizes.primaryView.height;
    ctx.drawImage(
      videoElement,
      this.browserDimensions.x,
      this.browserDimensions.y,
      this.browserDimensions.width,
      this.browserDimensions.height,
      0,
      0,
      Sizes.primaryView.width,
      Sizes.primaryView.height
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

  async startBrowserCapture(
    windowTitle: string,
    browserDimensions: Rectangle
  ): Promise<void> {
    this.browserDimensions = browserDimensions;

    const source = await this.getWindowSource(windowTitle);

    if (source.id === "MOCK") {
      return Promise.resolve();
    }

    this.browserVideoElement.srcObject = await navigator.mediaDevices.getUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        } as Record<string, unknown>,
      }
    );
    this.browserVideoElement.addEventListener("loadedmetadata", () => {
      this.browserVideoElement.play();
    });
  }

  private async getWindowSource(windowTitle: string) {
    let source;

    while (!source) {
      const sources = await desktopCapturer.getSources({ types: ["window"] });
      source = sources.find((source) => source.name === windowTitle);
    }
    return source;
  }

  private computeFrame() {
    this.canvasContext.drawImage(
      this.webcamVideoElement,
      0,
      Sizes.primaryView.height,
      Sizes.secondaryView.width,
      Sizes.secondaryView.height
    );

    if (this.browserDimensions) {
      this.canvasContext.drawImage(
        this.browserVideoElement,
        this.browserDimensions.x,
        this.browserDimensions.y,
        this.browserDimensions.width,
        this.browserDimensions.height,
        0,
        0,
        Sizes.primaryView.width,
        Sizes.primaryView.height
      );
    }
    requestAnimationFrame(() => this.computeFrame());
  }

  set deviceId(deviceId: string) {
    document.body.setAttribute("data-video-device-id", deviceId);
  }
}

export interface CaptureStreamCanvas extends HTMLCanvasElement {
  captureStream(fps: number): MediaStream;
}
