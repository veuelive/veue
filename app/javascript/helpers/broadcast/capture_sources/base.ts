import VideoLayout, { LayoutSection } from "types/video_layout";
import Sizes from "types/sizes";

interface VideoSource {
  layout: LayoutSection;
  element: HTMLVideoElement;
}

type AudioSource = MediaStreamTrack;

export class CaptureSourceBase {
  deviceId: string;
  videoSources: Array<VideoSource> = [];
  audioSources: Array<AudioSource> = [];
  // You must subclass this if you want to use it!
  protected constructor() {
    this.deviceId = undefined;
  }

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
        this.videoSources.push({
          layout: videoLayoutLogic(videoElement),
          element: videoElement,
        });
      } else if (track.kind === "audio") {
        this.audioSources.push(track);
      }
    });
  }
}

export class UserMediaCaptureSource extends CaptureSourceBase {
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
