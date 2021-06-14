import { Component, h, VNode } from "preact";
import ScreenShare from "components/media_deck/screen_share";
import AddScreenShare from "components/media_deck/add_screen_share";
import CameraShare from "components/media_deck/camera_share";
import AddWebcamSource from "components/media_deck/add_webcam_source";

type State = {
  isScreenVisible: boolean;
  webcamShared: boolean;
  screenShared: boolean;
};

export default class MediaDeck extends Component<unknown, State> {
  constructor() {
    super();
    this.setState({
      isScreenVisible: true,
      webcamShared: false,
      screenShared: false,
    })
  }

  render(): VNode {
    return (
      <div class="MediaDeck">
        <div class="MediaDeck__sources">
          <ScreenShare
            screenShared={this.state.screenShared}
            isVisible={this.state.isScreenVisible}
            toggleVisibility={() => this.setState({isScreenVisible: !this.state.isScreenVisible})}
          />
          <CameraShare webcamShared={this.state.webcamShared} />
         </div>
        <div class="MediaDeck__controls">
          <AddScreenShare
            isScreenVisible={this.state.isScreenVisible}
            screenSourceAttached={this.state.screenShared}
            addScreenCaptureSource={() =>  this.setState({ screenShared: true })}
            stopSharing={() => this.setState(({ screenShared: false }))}
            toggleVisibility={() => this.setState({ isScreenVisible: !this.state.isScreenVisible})}
          />
          <AddWebcamSource
            webcamSourceAttached={this.state.webcamShared}
            addWebcamCaptureSource={() => this.setState({ webcamShared: true })}
            stopSharing={() => this.setState({webcamShared: false})}
          />
        </div>
      </div>
    );
  }
}
