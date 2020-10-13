import { Controller } from "stimulus";

export default class PinsController extends Controller {
  connect(): void {
    this.makeProductsVisible();
  }

  disconnect() {}

  makeProductsVisible() {}
}
