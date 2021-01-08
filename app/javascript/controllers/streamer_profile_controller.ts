import { post, destroy, secureFetch } from "util/fetch";
import BaseController from "./base_controller";
import { getChannelId } from "helpers/channel_helpers";

export default class extends BaseController {
  connect(): void {
    this.subscribeToAuthChange();
  }

  async follow(): Promise<void> {
    const response = await post(this.followPath());
    return this.insertHTML(response);
  }

  async unfollow(): Promise<void> {
    const response = await destroy(this.followPath());
    return this.insertHTML(response);
  }

  authChanged(): void {
    secureFetch(this.followPath()).then((response) =>
      this.insertHTML(response)
    );
  }

  private async insertHTML(response): Promise<void> {
    const html = await response.text();
    this.element.parentElement.innerHTML = html;
  }

  private followPath(): string {
    return `/${getChannelId()}/follow`;
  }
}
