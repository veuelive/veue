import { Component, h, VNode } from "preact";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import hiddenIcon from "images/visible-false.svg";
import EventBus from "event_bus";
import { observer } from "mobx-preact";
import { ScreenSourceStore } from "components/media_deck/secreen_source";

type Props = { screenSourceStore: ScreenSourceStore };

const ScreenShare = observer(class ScreenShare extends Component<Props, unknown> {
  private videoTag: HTMLVideoElement;

  render(): VNode {
    return (
      <div
        class="MediaDeck__screen-share"
        onClick={() => {
          this.toggleVisibility();
        }}
      >
        {this.props.screenSourceStore.isScreenVisible ? null : (
          <div class="MediaDeck__screen-share__hidden-cover">
            <img src={hiddenIcon} alt="hidden icon" />
          </div>
        )}
        <div class="MediaDeck__screen-share__video">
          {this.props.screenSourceStore.renderVideo()}
        </div>
      </div>
    );
  }

  renderVisibilityControls(): VNode {
    if (!this.props.screenSourceStore.screenCaptureSource) {
      return <span />;
    }

    return (
      <button
        onClick={() => {
          this.props.screenSourceStore.toggleVisibility();
        }}
      >
        {this.props.screenSourceStore.isScreenVisible ? "Hide Screen" : "Make Visible"}
      </button>
    );
  }

  private toggleVisibility() {
    if (this.props.screenSourceStore.screenCaptureSource) {
      if (this.props.screenSourceStore.isScreenVisible) {
        EventBus.dispatch(
          RemoveCaptureSourceEvent,
          this.props.screenSourceStore.screenCaptureSource
        );
        this.props.screenSourceStore.toggleVisibility();
      } else {
        EventBus.dispatch(
          NewCaptureSourceEvent,
          this.props.screenSourceStore.screenCaptureSource
        );
      }
      this.props.screenSourceStore.toggleVisibility();
    }
  }
});

export default ScreenShare;
