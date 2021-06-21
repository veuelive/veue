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
export abstract class CaptureSource {
  deviceId: string;
  mediaStream: MediaStream;
  videoTag: HTMLVideoElement;

  get id(): string {
    return this.deviceId;
  }

  abstract get mediaDeviceType(): MediaDeviceKind;

  protected constructor(deviceId?: string, videoTag?: HTMLVideoElement) {
    this.deviceId = deviceId;
    this.videoTag = videoTag;
  }

  stop(): void {
    this.mediaStream.getTracks().forEach((track) => {
      track.stop();
      this.mediaStream.removeTrack(track);
    });
  }
}
