import { Component, h, VNode } from "preact";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import { WebcamSourceStore } from "components/media_deck/webcam_source";
import { observer } from "mobx-preact";

type Props = { webcamShared: boolean; webcamSourceStore: WebcamSourceStore; };

const CameraShare = observer(class CameraShare extends Component<Props, unknown> {
  render(): VNode {
    return (
      <div class="MediaDeck__camera-stream">
        <div class="MediaDeck__screen-share__video">
          {this.props.webcamSourceStore.renderVideo()}
        </div>
        {
          this.props.webcamSourceStore.webcamDialogueVisible && !this.props.webcamSourceStore.webcamCaptureSource ?
            <div class="MediaDeck__webcam-share">
              {this.renderWebcamDevices()}
            </div> : null
        }
      </div>
    );
  }

  private renderWebcamDevices(): VNode[] {
    const devicesMarkup = [];
    this.props.webcamSourceStore.webcamDevices.forEach((device: MediaDeviceInfo) => {
      devicesMarkup.push(this.deviceMarkup(device));
    });
    return devicesMarkup;
  }

  private deviceMarkup(device: MediaDeviceInfo): VNode {
    return (
      <div
        class="MediaDeck__webcam-share--item"
        data-media-id={device.deviceId}
        onClick={() => this.props.webcamSourceStore.startWebcamStream(device.deviceId)}
      >
        {device.label}
      </div>
    );
  }
});

export default CameraShare;
