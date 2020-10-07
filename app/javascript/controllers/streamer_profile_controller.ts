import { post, destroy } from "util/fetch";
import BaseController from "./base_controller";

export default class extends BaseController {
  connect(): void {
    this.subscribeToAuthChange();
  }

  async follow(): Promise<void> {
    const response = await post("./follow");
    this.insertHTML(response);
  }

  async unfollow(): Promise<void> {
    const response = await destroy("./follow");
    this.insertHTML(response);
  }

  authChanged(): void {
    post("./follow").then((response) => this.insertHTML(response));
  }

  private async insertHTML(response): Promise<void> {
    const html = await response.text();
    document.getElementById("streamer-profile-area").innerHTML = html;
  }
}
