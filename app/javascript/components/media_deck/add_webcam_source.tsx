import { Component, h, VNode } from "preact";

type Props = {
  webcamSourceAttached: boolean;
  addWebcamCaptureSource(): void;
  stopSharing(): void;
}
export default class AddWebcamSource extends Component<Props, any> {
  render(): VNode {
    return (
      <div>
        {
          !this.props.webcamSourceAttached ?
            <button onClick={() => this.props.addWebcamCaptureSource()}>
              Attach Another Camera
            </button> :
            <button onClick={() => this.props.stopSharing()}>Stop Camera Stream</button>
        }
      </div>
    );
  }
}
