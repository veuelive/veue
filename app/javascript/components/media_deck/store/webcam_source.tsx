import { h, VNode } from "preact";
import { autorun, makeAutoObservable } from "mobx";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import EventBus from "event_bus";
import { NewCaptureSourceEvent, RemoveCaptureSourceEvent } from "helpers/broadcast/capture_source_manager";
import { availableMediaDevices } from "helpers/media_access";

export class WebcamSourceStore {
  webcamDialogueVisible = false;
  webcamCaptureSource = null;
  webcamDevices = [];
  videoTag = null;
  deviceId = "";

  constructor() {
    makeAutoObservable(this);
  }

  renderVideo(): VNode {
    return (
      <video
        data-connected={!!this.webcamCaptureSource}
        ref={(videoTag) => {
          this.videoTag = videoTag;
        }}
      />
    )
  }

  toggleWebcamDialogue(): void {
    this.webcamDialogueVisible = !this.webcamDialogueVisible;
  }

  *enumerateWebcamDevices() {
    this.webcamDevices = yield availableMediaDevices("videoinput");
  }

  *startWebcamStream(deviceId: string) {
    this.deviceId = deviceId;
    this.toggleWebcamDialogue();

    this.webcamCaptureSource = yield WebcamCaptureSource.connect(
      this.deviceId,
      this.videoTag
    );

    EventBus.dispatch(NewCaptureSourceEvent, this.webcamCaptureSource);
  }

  stopWebcamStream(): void {
    EventBus.dispatch(RemoveCaptureSourceEvent, this.webcamCaptureSource);
    this.webcamCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.webcamCaptureSource = null;
  }
}

export default new WebcamSourceStore();
