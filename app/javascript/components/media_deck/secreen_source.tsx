import { h, VNode } from "preact";
import { makeAutoObservable } from "mobx";
import EventBus from "event_bus";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent
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
    this.isScreenVisible = false;
  }

  disconnectScreenShareSource(): void {
    EventBus.dispatch(RemoveCaptureSourceEvent, this.screenCaptureSource);
    this.screenCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.screenCaptureSource = null;
    this.isScreenVisible = true;
  }

  toggleVisibility(): void {
    this.isScreenVisible = !this.isScreenVisible;

    if (this.screenCaptureSource) {
      EventBus.dispatch(
        this.isScreenVisible ? NewCaptureSourceEvent : RemoveCaptureSourceEvent,
        this.screenCaptureSource
      );
    }
  }
}

export default new ScreenSourceStore();