import VideoLayout, { LayoutSection } from "types/video_layout";
import Sizes from "types/sizes";

interface VideoSource {
  layout: LayoutSection;
  element: HTMLVideoElement;
}

type AudioSource = {
  track: MediaStreamTrack;
  mediaStream: MediaStream;
};

export class CaptureSource {
  deviceId: string;
}

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
export class VideoCaptureSource extends CaptureSource {
  videoSource?: VideoSource;

  async addMediaStream(
    mediaStream: MediaStream,
    videoLayoutLogic: (HTMLVideoElement) => LayoutSection
  ): Promise<void> {
    mediaStream.getTracks().map(async (track) => {
      this.deviceId = track.getSettings().deviceId;
      if (track.kind === "video") {
        const videoElement = document.createElement("video");
        videoElement.setAttribute("style", "display: none");
        document.body.append(videoElement);
        videoElement.srcObject = mediaStream;
        videoElement.muted = true;
        videoElement.addEventListener("loadedmetadata", async () => {
          await videoElement.play();
        });
        this.videoSource = {
          layout: videoLayoutLogic(videoElement),
          element: videoElement,
        };
      } else if (track.kind === "audio") {
        this.audioSources.push({ mediaStream, track });
      }
    });
  }
}

export class UserMediaCaptureSource extends CaptureSource {
  protected constraints: MediaStreamConstraints;

  public async start(): Promise<void> {
    await this.addMediaStream(
      await navigator.mediaDevices.getUserMedia(this.constraints),
      (videoElement) => {
        return {
          width: videoElement.videoWidth,
          height: videoElement.videoHeight,
          x: 0,
          y: 0,
          type: "camera",
          priority: 2,
        };
      }
    );
  }
}
