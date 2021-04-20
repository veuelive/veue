import { Component, h, VNode } from "preact";
import ScreenShare from "components/media_deck/screen_share";

export default class MediaDeck extends Component {
  render(): VNode {
    return (
      <div class="MediaDeck">
        <ScreenShare />
      </div>
    );
  }
}
