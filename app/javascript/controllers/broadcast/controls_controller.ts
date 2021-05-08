import { Controller } from "stimulus";
import debounce from "util/debounce";
import { putForm } from "util/fetch";

export default class extends Controller {
  static targets = [
    "loading",
    "titleInput",
    "scheduledAtInput",
    "scheduleMenu",
  ];

  readonly loadingTarget!: HTMLElement;
  readonly scheduleMenuTarget!: HTMLElement;
  readonly titleInputTarget!: HTMLInputElement;
  readonly scheduledAtInputTarget!: HTMLInputElement;

  private menuVisible = false;

  toggleScheduleMenu(): void {
    this.menuVisible = !this.menuVisible;
    this.scheduleMenuTarget.style.display = this.menuVisible ? "block" : "none";
  }

  @debounce(100)
  async saveTitle(): Promise<void> {
    this.loadingTarget.style.display = "block";
    const value = this.titleInputTarget.value;
    const dataObj = {};

    dataObj["video[title]"] = value;
    const response = await putForm("./", dataObj);

    // Hide loading animation with delay
    setTimeout(() => (this.loadingTarget.style.display = "none"), 300);
  }

  async submitSchedule(): Promise<void> {
    this.toggleScheduleMenu();
    const value = this.scheduledAtInputTarget.value;
    console.log(value);
    const dataObj = {};

    dataObj["video[scheduled_at]"] = value;
    const response = await putForm("./", dataObj);
  }
}
