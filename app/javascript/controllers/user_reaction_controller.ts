import { Controller } from "stimulus";
import { post } from "util/fetch";

export default class extends Controller {
  connect(): void {
    this.state = "enabled";
  }

  sendReaction(): void {
    if (this.state === "enabled") {
      post("./reaction").then(() =>
        console.log("User Like/Reaction Event Generated")
      );
      this.state = "disabled";
    }
  }

  set state(state: string) {
    this.data.set("state", state);
    if (this.state === "disabled")
      setTimeout(() => (this.state = "enabled"), 5000);
  }

  get state(): string {
    return this.data.get("state");
  }
}
