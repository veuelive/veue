import { Controller } from "stimulus";
import { post } from "util/fetch";

export default class extends Controller {
  sendReaction(event: Event): void {
    post("./reaction").then(() =>
      console.log("User Like/Reaction Event Generated")
    );
  }
}
