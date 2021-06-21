import { Component, h, VNode } from "preact";
import ScreenShare from "components/media_deck/screen_share";
import AddScreenShare from "components/media_deck/add_screen_share";
import CameraShare from "components/media_deck/camera_share";
import AddWebcamSource from "components/media_deck/add_webcam_source";
import { observer } from "mobx-preact";
import ScreenSourceStore from "components/media_deck/screen_source";
import WebcamSourceStore from "components/media_deck/webcam_source";

const MediaDeck = observer(class MediaDeck extends Component<unknown, unknown> {
  render(): VNode {
    return (
      <div class="MediaDeck">
        <div class="MediaDeck__sources">
          <ScreenShare
            screenSourceStore={ScreenSourceStore}
          />
          <CameraShare webcamSourceStore={WebcamSourceStore} />
        </div>
        <div class="MediaDeck__controls">
          <AddScreenShare
            screenSourceStore={ScreenSourceStore}
          />
          <AddWebcamSource
            webcamSourceStore={WebcamSourceStore}
          />
        </div>
      </div>
    );
  }
});

export default MediaDeck;
