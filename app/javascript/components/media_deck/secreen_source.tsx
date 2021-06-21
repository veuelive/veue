import { h, VNode } from "preact";
import { makeAutoObservable } from "mobx";
import EventBus from "event_bus";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import {
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";

export class ScreenSourceStore {
  isScreenVisible = true;
  screenCaptureSource = null;
  videoTag = null;

  constructor() {
    makeAutoObservable(this);
  }

  renderVideo(): VNode {
    return (
      <div class="MediaDeck__screen-share__video">
        <video
          data-connected={this.screenCaptureSource !== null}
          ref={(videoTag) => {
            this.videoTag = videoTag;
          }}
        />
      </div>
    );
  }

  *connectScreenShareSource() {
    this.screenCaptureSource = yield ScreenCaptureSource.connect(
      this.videoTag
    );
    this.isScreenVisible = true;
  }

  disconnectScreenShareSource(): void {
    EventBus.dispatch(RemoveCaptureSourceEvent, this.screenCaptureSource);
    this.screenCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.screenCaptureSource = null;
  }

  toggleVisibility(): void {
    this.isScreenVisible = !this.isScreenVisible;
  }
}

export default new ScreenSourceStore();