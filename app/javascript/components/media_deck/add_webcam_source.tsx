import { Component, h, VNode } from "preact";
import { WebcamSourceStore } from "components/media_deck/webcam_source";
import { observer } from "mobx-preact";

type Props = {
  webcamSourceAttached: boolean;
  addWebcamCaptureSource(): void;
  stopSharing(): void;
  webcamSourceStore: WebcamSourceStore
}

const AddWebcamSource = observer(class AddWebcamSource extends Component<Props, unknown> {
  render(): VNode {
    return (
      <div>
        {
          !this.props.webcamSourceStore.webcamCaptureSource ?
            <button onClick={() => this.props.webcamSourceStore.toggleWebcamDialogue()}>
              Attach Another Camera
            </button> :
            <button onClick={() => this.props.webcamSourceStore.stopWebcamStream()}>Stop Camera Stream</button>
        }
      </div>
    );
  }
});

export default AddWebcamSource;
