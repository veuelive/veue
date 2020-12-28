import { Controller } from "stimulus";
import SimpleBar from "simplebar";

export default class ChatScroller extends Controller {
  static targets = ["simpleBar"];
  private simpleBarTarget!: HTMLCanvasElement;
  private simpleBarObject!: any;

  connect(): void {
    this.simpleBarObject = new SimpleBar(this.simpleBarTarget);

    // this gets picked up
    this.simpleBarObject
      .getScrollElement()
      .addEventListener("scroll", this.scroll);
  }

  scroll(event): void {
    // this is a bad idea
  }
}
