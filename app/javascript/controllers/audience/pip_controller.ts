import { polyfill } from "mobile-drag-drop";

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

// options are optional ;)
polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

import { Controller } from "stimulus";

export default class PipController extends Controller {
  static targets = ["canvas"];

  connect(): void {
    this.element.classList.add("bottom-right");
    this.element.draggable = true;
    this.element.ondragstart = this.onDragStart.bind(this);

    super.connect();
  }

  onDragStart(event): void {
    event.effectAllowed = "move";
    event.dropEffect = "none";

    console.log("onDragStart");
  }
}
