import { Component, h, VNode } from "preact";

type Props = {
  startCameraStream(deviceId: string): void;
  stopCameraStream(): void;
}

type State = {
  isVisible: boolean;
  streamStarted: boolean;
}

export default class AttachCamera extends Component<Props, State> {
  private webcamDevices: MediaDeviceInfo[];

  constructor(props: Props) {
    super(props);
    this.setState({
      isVisible: false,
      streamStarted: false,
    });
  }

  render(): VNode {
    return (
      <div>
        {this.renderCameraControls()}
        {
          this.state.isVisible ?
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

  private renderCameraControls() {
    if (!this.state.streamStarted) {
      return (
        <button onClick={() => (this.setState({ isVisible: true }))}>
          Attach Another Camera
        </button>
      );
    }
    return <button onClick={() => this.stopWebcamStream()}>Stop Camera Stream</button>;
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

  private startWebcamStream(deviceId: string): void {
    this.setState({ isVisible: false, streamStarted: true });
    this.props.startCameraStream(deviceId);
  }

  private stopWebcamStream(): void {
    this.setState({ streamStarted: false });
    this.props.stopCameraStream();
  }
}
