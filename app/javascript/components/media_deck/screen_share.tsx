import { Component, createRef, h, VNode } from "preact";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
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
    return <button onClick={() => this.disconnect()}>Remove Share</button>;
  }

  renderControls(): Array<VNode> {
    return [this.renderVisibilityControls(), this.renderStartStopControls()];
  }

  render(): VNode {
    return (
      <div>
        <div class="MediaDeck__video-preview">
          <video
            ref={(videoTag) => {
              this.videoTag = videoTag;
            }}
          />
        </div>
        {this.renderControls()}
      </div>
    );
  }

  private async addScreenCaptureSource() {
    const screenCaptureSource = await ScreenCaptureSource.connect(
      this.videoTag
    );
    dispatch(NewCaptureSourceEvent, screenCaptureSource);
    this.setState({
      screenCaptureSource,
    });
  }

  private disconnect() {
    dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
    this.setState({ screenCaptureSource: null });
  }

  private toggleVisibility() {
    if (this.state.isVisible) {
      dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
      this.setState({ isVisible: false });
    } else {
      dispatch(NewCaptureSourceEvent, this.state.screenCaptureSource);
      this.setState({ isVisible: true });
    }
  }
}
