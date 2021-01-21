import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["settingsTab", "menuItem", "settingsMenu"];

  readonly settingsTabTargets!: HTMLElement[];
  readonly menuItemTargets!: HTMLElement[];
  readonly settingsMenuTarget!: HTMLElement;

  connect(): void {
    const currentTab = this.currentTab();
    this.showActiveTab(currentTab);

    // Evnet listener for browser url's hash change
    window.addEventListener("hashchange", () => {
      this.showActiveTab(this.currentTab());
    });
  }

  disconnect(): void {
    window.removeEventListener("hashchange", () => {
      this.showActiveTab(this.currentTab());
    });
  }

  showActiveTab(activeTab): void {
    this.settingsMenuTarget.style.removeProperty("display");
    this.menuItemTargets.forEach((element) => {
      element.dataset.link === activeTab
        ? element.classList.add("active")
        : element.classList.remove("active");
    });
    this.settingsTabTargets.forEach((element) => {
      element.style.display =
        element.dataset.tab === activeTab ? "block" : "none";
    });
  }

  openMenu(): void {
    if (document.body.clientWidth < 650) {
      this.settingsMenuTarget.style.display = "block";
      this.settingsTabTargets.forEach((element) => {
        element.style.display = "none";
      });
    }
  }

  closeMenu(): void {
    const activeTab = this.currentTab();
    this.showActiveTab(activeTab);
  }

  currentTab(): string {
    const currentTab = window.location.hash.slice(1);
    return ["profile", "privacy", "help"].includes(currentTab)
      ? currentTab
      : "profile";
  }
}
