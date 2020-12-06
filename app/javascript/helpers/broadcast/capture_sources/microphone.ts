import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export default class MicrophoneCaptureSource extends CaptureSource {
  // Use this to initialize the object
  static async connect(deviceId?: string): Promise<MicrophoneCaptureSource> {
    const source = new MicrophoneCaptureSource(deviceId);
    await source.start();
    return source;
  }

  async start(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: this.deviceId || "default",
      },
    });
    this.deviceId = this.mediaStream.getAudioTracks()[0].getSettings().deviceId;
  }
}
