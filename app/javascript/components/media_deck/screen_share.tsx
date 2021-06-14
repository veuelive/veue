import { Component, h, VNode } from "preact";
import { ScreenCaptureSource } from "helpers/broadcast/capture_sources/screen";
import {
  NewCaptureSourceEvent,
  RemoveCaptureSourceEvent,
} from "helpers/broadcast/capture_source_manager";
import hiddenIcon from "images/visible-false.svg";
import EventBus from "event_bus";

type State = { screenCaptureSource: ScreenCaptureSource; };
type Props = { screenShared: boolean; isVisible: boolean; toggleVisibility(): void; };

export default class ScreenShare extends Component<Props, State> {
  private videoTag: HTMLVideoElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      screenCaptureSource: null,
    };
  }

  render(): VNode {
    return (
      <div
        class="MediaDeck__screen-share"
        onClick={() => {
          this.toggleVisibility();
        }}
      >
        {this.props.isVisible ? null : (
          <div class="MediaDeck__screen-share__hidden-cover">
            <img src={hiddenIcon} alt="hidden icon" />
          </div>
        )}
        <div class="MediaDeck__screen-share__video">
          <video
            data-connected={this.props.screenShared}
            ref={(videoTag) => {
              this.videoTag = videoTag;
            }}
          />
        </div>
      </div>
    );
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    if (prevProps.screenShared === this.props.screenShared)
      return;

    if (this.props.screenShared) {
      const screenCaptureSource = await ScreenCaptureSource.connect(
        this.videoTag
      );

      this.setState({
        screenCaptureSource,
      });
      this.props.toggleVisibility()
    } else {
      EventBus.dispatch(RemoveCaptureSourceEvent, this.state.screenCaptureSource);
      this.state.screenCaptureSource.stop();
      this.videoTag.srcObject = null;
      this.setState({ screenCaptureSource: null });
    }
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
        {this.props.isVisible ? "Hide Screen" : "Make Visible"}
      </button>
    );
  }

  private toggleVisibility() {
    if (this.state.screenCaptureSource) {
      if (this.props.isVisible) {
        EventBus.dispatch(
          RemoveCaptureSourceEvent,
          this.state.screenCaptureSource
        );
        this.props.toggleVisibility();
      } else {
        EventBus.dispatch(
          NewCaptureSourceEvent,
          this.state.screenCaptureSource
        );
      }
      this.props.toggleVisibility();
    }
  }
}
