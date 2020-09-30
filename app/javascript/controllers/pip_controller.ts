import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    this.element.setAttribute(
      "style",
      "position: absolute; bottom: 2vw; right: 2vw;"
    );
  }
}
