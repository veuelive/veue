import { Component, h, VNode } from "preact";
import EventBus from "event_bus";
import { RemoveCaptureSourceEvent } from "helpers/broadcast/capture_source_manager";
import { WebcamCaptureSource } from "helpers/broadcast/capture_sources/webcam";

type Props = { webcamShared: boolean };
type State = { deviceId: string; streamStarted: boolean; webcamCaptureSource: WebcamCaptureSource; }

export default class CameraShare extends Component<Props, State> {
  private videoTag: HTMLVideoElement;
  private webcamDevices: MediaDeviceInfo[];

  constructor(props: Props) {
    super(props);

    this.setState({
      deviceId: null,
      streamStarted: false,
      webcamCaptureSource: null,
    });
  }

  render(): VNode {
    return (
      <div class="MediaDeck__camera-stream">
        <div class="MediaDeck__screen-share__video">
          <video
            data-connected={!!this.props.webcamShared}
            ref={(videoTag) => {
              this.videoTag = videoTag;
            }}
          />
        </div>
        {
          this.props.webcamShared && !this.state.streamStarted ?
            <div class="MediaDeck__webcam-share">
              {this.renderWebcamDevices()}
            </div> : null
        }
      </div>
    );
  }

  async componentDidMount(): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.webcamDevices = devices.filter((d: MediaDeviceInfo) => d.kind === "videoinput");
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    if (prevProps.webcamShared === this.props.webcamShared)
      return;

    if (!this.props.webcamShared) {
      EventBus.dispatch(RemoveCaptureSourceEvent, this.state.webcamCaptureSource);
      this.state.webcamCaptureSource.stop();
      this.videoTag.srcObject = null;
      this.setState({ webcamCaptureSource: null });
    }
  }

  private renderWebcamDevices(): VNode[] {
    const devicesMarkup = [];
    this.webcamDevices.forEach((device: MediaDeviceInfo) => {
      devicesMarkup.push(this.deviceMarkup(device));
    });
    return devicesMarkup;
  }

  private deviceMarkup(device: MediaDeviceInfo): VNode {
    return (
      <div
        class="MediaDeck__webcam-share--item"
        data-media-id={device.deviceId}
        onClick={() => this.startWebcamStream(device.deviceId)}
      >
        {device.label}
      </div>
    );
  }

  private async startWebcamStream(deviceId: string): Promise<void> {
    const webcamCaptureSource = await WebcamCaptureSource.connect(
      this.state.deviceId,
      this.videoTag
    );

    this.setState({
      deviceId: deviceId,
      streamStarted: true,
      webcamCaptureSource,
    });

  }
}