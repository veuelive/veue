import { Controller } from "stimulus";

export default class PipController extends Controller {
  static targets = ["canvas"];
  connect(): void {
    super.connect();
  }
}
