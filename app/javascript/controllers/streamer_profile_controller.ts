import { post, destroy, secureFetch } from "util/fetch";
import BaseController from "./base_controller";
import { getChannelId } from "helpers/channel_helpers";

export default class extends BaseController {
  connect(): void {
    this.subscribeToAuthChange();
  }

  async follow(): Promise<void> {
    const response = await post(this.followPath());
    return this.replaceHtml(response);
  }

  async unfollow(): Promise<void> {
    const response = await destroy(this.followPath());
    return this.replaceHtml(response);
  }

  authChanged(): void {
    secureFetch(this.followPath()).then((response) =>
      this.replaceHtml(response)
    );
  }

  private async replaceHtml(response: Response): Promise<void> {
    this.element.outerHTML = await response.text();
  }

  private followPath(): string {
    return `/${getChannelId()}/follow`;
  }
}
