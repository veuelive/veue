import { Component, h, VNode } from "preact";

type Props = {
  isScreenVisible: boolean;
  screenSourceAttached: boolean;
  addScreenCaptureSource(): void;
  stopSharing(): void;
  toggleVisibility(): void;
};

export default class AddScreenShare extends Component<Props, unknown> {
  render(): VNode {
    return (
      <div>
        {this.renderVisibilityControls()}
        {
          !this.props.screenSourceAttached ?
            <button onClick={() => this.props.addScreenCaptureSource()}>
              Share Your Screen
            </button> : <button onClick={() => this.props.stopSharing()}>Stop Sharing</button>
        }
      </div>
    );
  }

  renderVisibilityControls(): VNode {
    if (!this.props.screenSourceAttached) {
      return <span />;
    }

    return (
      <button
        onClick={() => {
          this.props.toggleVisibility();
        }}
      >
        {this.props.isScreenVisible ? "Hide Screen" : "Make Visible"}
      </button>
    );
  }
}