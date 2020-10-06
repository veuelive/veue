import { Controller } from "stimulus";
import { post, destroy } from "util/fetch";

export default class extends Controller {
  async follow(): Promise<void> {
    const response = await post("./follow");
    this.insertHTML(response);
  }

  async unfollow(): Promise<void> {
    const response = await destroy("./follow");
    this.insertHTML(response);
  }

  private async insertHTML(response): Promise<void> {
    const html = await response.text();
    document.getElementById("streamer-profile-area").innerHTML = html;
  }
}
