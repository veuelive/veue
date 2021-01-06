import { LayoutSection, VideoSourceType } from "types/video_layout";
import { Size } from "types/rectangle";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";

/**
 * A CaptureSource is our generic representation of
 * a MediaStream/Device/Etc that we are actively using in the
 * Broadcasting world.
 *
 * **IMPORTANT** Even though there are `getAudioTracks` and `getVideoTracks` (both PLURAL),
 * the W3C doesn't really allow you to ever return more than one audio or video track from an
 * input device using the standard browser APIs:
 * https://dev.w3.org/2011/webrtc/editor/getusermedia-20120813.html#:~:text=It%20is%20recommended%20for%20multiple,zero%20or%20one%20video%20tracks.
 *
 */
export class CaptureSource {
  deviceId: string;
  mediaStream: MediaStream;

  get id(): string {
    return this.deviceId;
  }

  protected constructor(deviceId?: string) {
    this.deviceId = deviceId;
  }

  stop(): void {
    this.mediaStream.getTracks().forEach((track) => {
      track.stop();
      this.mediaStream.removeTrack(track);
    });
  }
}

export interface VideoCaptureInterface extends Size {
  id: string;
  videoSourceType: VideoSourceType;
}

export class VideoCaptureSource extends CaptureSource
  implements VideoCaptureInterface {
  layout: LayoutSection;
  element: HTMLVideoElement;

  get width(): number {
    return this.element.videoWidth;
  }

  get height(): number {
    return this.element.videoHeight;
  }

  get videoSourceType(): VideoSourceType {
    if (this instanceof WebcamCaptureSource) {
      return "camera";
    } else {
      return "screen";
    }
  }

  processMediaStream(mediaStream: MediaStream): Promise<HTMLVideoElement> {
    const track = mediaStream.getVideoTracks()[0];
    this.deviceId = track.getSettings().deviceId;
    this.element = this.createVideoElement();
    this.element.muted = true;
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
