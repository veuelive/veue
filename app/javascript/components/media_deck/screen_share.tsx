import { Component, h, VNode } from "preact";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import hiddenIcon from "images/visible-false.svg";
import EventBus from "event_bus";
import AttachCamera from "components/media_deck/attach_camera";

type State = { isVisible: boolean; screenCaptureSource: ScreenCaptureSource; webcamCaptureSource: WebcamCaptureSource };
export default class ScreenShare extends Component<unknown, State> {
  private videoTag: HTMLVideoElement;

  constructor() {
    super();
    this.state = {
      isVisible: true,
      screenCaptureSource: null,
      webcamCaptureSource: null,
    };
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
        {!this.state.webcamCaptureSource ? this.renderStartStopControls() : null}
        {!this.state.screenCaptureSource ? this.renderAttachCameraControls() : null}
      </div>
    );
  }

  private renderAttachCameraControls(): VNode {
    return (
      <AttachCamera
        startCameraStream={this.addWebcamCaptureSource.bind(this)}
        stopCameraStream={this.stopWebcamStream.bind(this)}
      />
    );
  }

  private async addWebcamCaptureSource(deviceId: string): Promise<void> {
    const webcamCaptureSource = await WebcamCaptureSource.connect(
      deviceId,
      this.videoTag
    );

    this.setState({
      webcamCaptureSource
    });

    EventBus.dispatch(
      NewCaptureSourceEvent,
      webcamCaptureSource
    );
  }

  private stopWebcamStream(): void {
    EventBus.dispatch(RemoveCaptureSourceEvent, this.state.webcamCaptureSource);
    this.state.webcamCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.setState({ webcamCaptureSource: null });
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
    EventBus.dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
    this.state.screenCaptureSource.stop();
    this.videoTag.srcObject = null;
    this.setState({ screenCaptureSource: null, isVisible: true });
  }

  private toggleVisibility() {
    if (this.state.screenCaptureSource) {
      if (this.state.isVisible) {
        EventBus.dispatch(
          RemoveCaptureSourceEvent,
          this.state.screenCaptureSource
        );
        this.setState({ isVisible: false });
      } else {
        EventBus.dispatch(
          NewCaptureSourceEvent,
          this.state.screenCaptureSource
        );
        this.setState({ isVisible: true });
      }
    }
  }
}
