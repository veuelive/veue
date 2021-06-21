import { Component, h, VNode } from "preact";
import { ScreenSourceStore } from "components/media_deck/secreen_source";

type Props = {
  screenSourceAttached: boolean;
  stopSharing(): void;
  screenSourceStore: ScreenSourceStore;
};
import { observer } from "mobx-preact";

const AddScreenShare = observer(class AddScreenShare extends Component<Props, unknown> {
  render(): VNode {
    return (
      <div>
        {this.renderVisibilityControls()}
        {
          !this.props.screenSourceStore.screenCaptureSource ?
            <button onClick={() => this.props.screenSourceStore.connectScreenShareSource()}>
              Share Your Screen
            </button> : <button onClick={() => this.props.screenSourceStore.disconnectScreenShareSource()}>Stop Sharing</button>
        }
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

export default AddScreenShare;