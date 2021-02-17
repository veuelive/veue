import { Controller } from "stimulus";
import {
  ShowMenuEvent,
  CloseMenuEvent,
  ResetMenuEvent,
} from "controllers/broadcast/commands_menu_controller";

export default class extends Controller {
  private menuTitle: HTMLElement;
  private menuBody: HTMLElement;

  connect(): void {
    this.menuTitle = document.querySelector(".select-menu--content__title");
    this.menuBody = document.querySelector(".select-menu--content__body");
  }

  protected toggleMenu(type: string): void {
    document.dispatchEvent(
      new CustomEvent(ShowMenuEvent, {
        detail: {
          type,
        },
      })
    );
  }

  protected resetMenu(): void {
    document.dispatchEvent(new CustomEvent(ResetMenuEvent));
  }

  protected dispatchMenuClose(): void {
    document.dispatchEvent(new CustomEvent(CloseMenuEvent));
  }

  protected appendElement(element: HTMLElement): void {
    this.menuBody.appendChild(element);
  }

  protected insertElement(markup: string): void {
    this.menuBody.innerHTML = markup;
  }

  protected setTitle(title: string): void {
    this.menuTitle.innerText = title;
  }
}
