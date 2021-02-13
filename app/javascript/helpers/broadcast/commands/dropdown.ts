import { BroadcasterCommand } from "types/broadcaster_command";
import {
  ShowMenuEvent,
  CloseMenuEvent,
} from "controllers/broadcast/commands_menu_controller";

export class Dropdown {
  private heading: HTMLElement;
  private menuBody: HTMLElement;

  constructor() {
    this.menuBody = document.querySelector(".select-menu--content__body");
    this.heading = document.querySelector(".select-menu--content__title");
  }

  protected dispatchMenuToggle(type: string): void {
    document.dispatchEvent(
      new CustomEvent(ShowMenuEvent, {
        detail: {
          type,
        },
      })
    );
  }

  protected reset(): void {
    this.heading.innerHTML = "";
    this.menuBody.innerHTML = "";
  }

  protected dispatchMenuClose(): void {
    document.dispatchEvent(new CustomEvent(CloseMenuEvent));
  }

  protected appendElement(element: HTMLElement): void {
    this.menuBody.appendChild(element);
  }

  protected setTitle(title: string): void {
    this.heading.innerText = title;
  }
}
