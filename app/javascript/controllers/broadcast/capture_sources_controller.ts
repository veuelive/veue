import BaseController from "../base_controller";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import { AudioCaptureSource } from "helpers/broadcast/capture_sources/audio";
import MicrophoneCaptureSource from "helpers/broadcast/capture_sources/microphone";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export const ChangeMediaDeviceEvent = "ChangeMediaDeviceEvent";

export default class extends BaseController {
  static targets = ["mediaDeck"];

  private mediaDeckTarget!: HTMLDivElement;

  private cameraCaptureSource: WebcamCaptureSource;
  private audioCaptureSource: AudioCaptureSource;

  connect(): void {
    this.connectDefaultDevices().then(() => {
      console.log("Capture Sources Ready");
      console.log(this.audioCaptureSource);
    });

    document.addEventListener(
      ChangeMediaDeviceEvent,
      this.swapMediaDevice.bind(this)
    );
  }

  async connectDefaultDevices(): Promise<void> {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      ["audioinput", "videoinput"].map(async (type) => {
        const defaultDevice = devices.find(
          (mediaDeviceInfo) => mediaDeviceInfo.kind === type
        );
        if (defaultDevice) {
          await this.addCaptureSource(defaultDevice);
        }
      });
    });
  }

  async addCaptureSource(mediaDeviceInfo: MediaDeviceInfo): Promise<void> {
    let captureSource;
    if (mediaDeviceInfo.kind === "audioinput") {
      if (this.audioCaptureSource) {
        this.removeCaptureSource(this.audioCaptureSource);
      }
      captureSource = this.audioCaptureSource = await MicrophoneCaptureSource.connect(
        mediaDeviceInfo.deviceId
      );
    } else if (mediaDeviceInfo.kind === "videoinput") {
      this.removeCaptureSource(this.cameraCaptureSource);
      captureSource = this.cameraCaptureSource = await WebcamCaptureSource.connect(
        mediaDeviceInfo.deviceId
      );
    }
    document.dispatchEvent(
      new CustomEvent(NewCaptureSourceEvent, { detail: captureSource })
    );
  }

  swapMediaDevice(event: CustomEvent) {
    const mediaDeviceInfo = event.detail as MediaDeviceInfo;
    this.addCaptureSource(mediaDeviceInfo);
  }

  private removeCaptureSource(captureSource: CaptureSource) {
    document.dispatchEvent(
      new CustomEvent(RemoveCaptureSourceEvent, { detail: captureSource })
    );
  }
}
