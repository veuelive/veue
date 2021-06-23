import { Component, h, VNode } from "preact";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";
import { WebcamSourceStore } from "components/media_deck/store/webcam_source";
import { observer } from "mobx-preact";

type Props = { webcamShared: boolean; webcamSourceStore: WebcamSourceStore; };

const CameraShare = observer(class CameraShare extends Component<Props, unknown> {
  render(): VNode {
    return (
      <div class="MediaDeck__camera-stream">
        <div class="MediaDeck__screen-share__video">
          {this.props.webcamSourceStore.renderVideo()}
        </div>
        {this.renderWebcamDevices()}
      </div>
    );
  }

  private renderWebcamDevices(): VNode {
    const devicesMarkup = [];
    this.props.webcamSourceStore.enumerateWebcamDevices();
    this.props.webcamSourceStore.webcamDevices.forEach((device: MediaDeviceInfo) => {
      devicesMarkup.push(this.deviceMarkup(device));
    });

    if (this.props.webcamSourceStore.webcamDialogueVisible && !this.props.webcamSourceStore.webcamCaptureSource) {
      return (
        <div class="MediaDeck__webcam-share">
          <div class="MediaDeck__webcam-share--title">
            Available Webcam Devices
          </div>
          {devicesMarkup}
        </div>
      );
    }
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
