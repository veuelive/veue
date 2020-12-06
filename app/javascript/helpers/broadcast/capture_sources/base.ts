import VideoLayout, { LayoutSection } from "types/video_layout";
import Sizes from "types/sizes";

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

  protected constructor(deviceId?: string) {
    this.deviceId = deviceId;
  }

  stop(): void {
    this.mediaStream.stop();
  }
}

export class VideoCaptureSource extends CaptureSource {
  layout: LayoutSection;
  element: HTMLVideoElement;

  async processMediaStream(
    mediaStream: MediaStream
  ): Promise<HTMLVideoElement> {
    const track = mediaStream.getVideoTracks()[0];
    this.deviceId = track.getSettings().deviceId;
    this.element = document.createElement("video");
    this.element.setAttribute("style", "display: none");
    document.body.append(this.element);
    this.element.srcObject = mediaStream;
    this.element.muted = true;
    return new Promise((resolve) => {
      this.element.addEventListener("loadedmetadata", async () => {
        this.element.play().then(() => resolve(this.element));
      });
    });
  }

  stop(): void {
    this.element.remove();
    this.mediaStream.stop();
  }
}
