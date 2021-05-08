import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["scheduleMenu"];

  private scheduleMenuTarget!: HTMLElement;
  private menuVisible = false;

  connect(): void {}

  toggleScheduleMenu(): void {
    this.menuVisible = !this.menuVisible;
    this.scheduleMenuTarget.style.display = this.menuVisible ? "block" : "none";
  }
}
