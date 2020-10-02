import { Controller } from "stimulus";
import { post, destroy } from "util/fetch";

export default class extends Controller {
  private videoId: string;

  connect(): void {
    this.videoId = this.data.get("video-id");
  }

  async followStreamer(): Promise<void> {
    const followStreamer = this.data.get("follow-streamer");
    const url = `/videos/${this.videoId}/follows`;
    const response =
      followStreamer === "true"
        ? await destroy(`${url}/${this.data.get("followId")}`)
        : await post(url);
    const html = await response.text();
    document.getElementById("streamer-profile-area").innerHTML = html;
  }
}
