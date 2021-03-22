import { Controller } from "stimulus";

export default class extends Controller {
  dragging: boolean | "starting";
  private startX: number;
  private scrollLeft: number;

  get htmlElement(): HTMLElement {
    return this.element as HTMLElement;
  }

  initialize(): void {
    this.stopDragging = this.stopDragging.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.moveScroll = this.moveScroll.bind(this);
  }

  connect(): void {
    this.dragging = false;
    this.element.addEventListener("mousedown", this.startDragging);
    this.element.addEventListener("mousemove", this.moveScroll);
    this.element.addEventListener("mouseleave", this.stopDragging);
    this.element.addEventListener("click", this.stopDragging);
  }

  disconnect(): void {
    this.dragging = false;
    this.element.removeEventListener("mousedown", this.startDragging);
    this.element.removeEventListener("mousemove", this.moveScroll);
    this.element.removeEventListener("mouseleave", this.stopDragging);
    this.element.removeEventListener("click", this.stopDragging);
  }

  startDragging(event: MouseEvent): void {
    if (this.dragging === true) {
      return;
    }
    this.dragging = "starting";
    this.startX = event.pageX - this.htmlElement.offsetLeft;
    this.scrollLeft = this.htmlElement.scrollLeft;
  }

  stopDragging(event: MouseEvent): void {
    // If we were actively dragging, then cancel propagation
    // we may be in "starting", don't cancel that as it might
    // be an intent to click on a link!
    if (this.dragging === true) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.dragging = false;
  }

  moveScroll(event: MouseEvent): void {
    console.log(this.dragging);
    if (this.dragging) {
      // We need to track if we are actively dragging or not
      // so we can tell the difference between link clicks and
      // mouse up after dragging
      this.dragging = true;
      const x = event.pageX - this.htmlElement.offsetLeft;
      const scroll = x - this.startX;
      this.htmlElement.scrollLeft = this.scrollLeft - scroll;
    }
  }
}
