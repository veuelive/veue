import { Component, h, VNode } from "preact";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import hiddenIcon from "images/visible-false.svg";
import { dispatch } from "dispatch_helpers";

type State = { isVisible: boolean; screenCaptureSource: ScreenCaptureSource };
export default class ScreenShare extends Component<unknown, State> {
  private videoTag: HTMLVideoElement;

  constructor() {
    super();
    this.state = {
      isVisible: true,
      screenCaptureSource: null,
    };
  }

  renderVisibilityControls(): VNode {
    if (!this.state.screenCaptureSource) {
      return <span />;
    }
    return (
      <button
        onClick={() => {
          this.toggleVisibility();
        }}
      >
        {this.state.isVisible ? "Hide Screen" : "Make Visible"}
      </button>
    );
  }

  renderStartStopControls(): VNode {
    if (!this.state.screenCaptureSource) {
      return (
        <button onClick={() => this.addScreenCaptureSource()}>
          Share Your Screen
        </button>
      );
    }
    return <button onClick={() => this.stopSharing()}>Stop Sharing</button>;
  }

  renderControls(): VNode {
    return (
      <div class="MediaDeck__controls">
        {this.renderVisibilityControls()}
        {this.renderStartStopControls()}
      </div>
    );
  }

  render(): VNode {
    return (
      <div class="MediaDeck">
        <div
          class="MediaDeck__screen-share"
          onClick={() => {
            this.toggleVisibility();
          }}
        >
          {this.state.isVisible ? null : (
            <div class="MediaDeck__screen-share__hidden-cover">
              <img src={hiddenIcon} alt="hidden icon" />
            </div>
          )}
          <div class="MediaDeck__screen-share__video">
            <video
              data-connected={!!this.state.screenCaptureSource}
              ref={(videoTag) => {
                this.videoTag = videoTag;
              }}
            />
          </div>
        </div>
        {this.renderControls()}
      </div>
    );
  }

  private async addScreenCaptureSource() {
    const screenCaptureSource = await ScreenCaptureSource.connect(
      this.videoTag
    );
    this.setState({
      isVisible: false,
      screenCaptureSource,
    });
  }

  private stopSharing() {
    dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
    this.state.screenCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.setState({ screenCaptureSource: null, isVisible: true });
  }

  private toggleVisibility() {
    if (this.state.screenCaptureSource) {
      if (this.state.isVisible) {
        dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
        this.setState({ isVisible: false });
      } else {
        dispatch(NewCaptureSourceEvent, this.state.screenCaptureSource);
        this.setState({ isVisible: true });
      }
    }
  }
}
