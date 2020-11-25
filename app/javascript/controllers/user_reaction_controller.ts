import { Controller } from "stimulus";
import { post } from "util/fetch";

export default class extends Controller {
  reactionEvent(): void {
    post("./reaction").then(() =>
      console.log("User Like/Reaction Event Generated")
    );
  }
}
