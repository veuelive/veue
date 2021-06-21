import { Component, h, VNode } from "preact";
import hiddenIcon from "images/visible-false.svg";
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
          this.props.screenSourceStore.toggleVisibility();
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
});

export default ScreenShare;
