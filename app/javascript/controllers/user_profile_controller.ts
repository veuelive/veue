import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["profileTab", "menuItem", "profileMenu"];

  readonly profileTabTargets!: HTMLElement[];
  readonly menuItemTargets!: HTMLElement[];
  readonly profileMenuTarget!: HTMLElement;

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

  showActiveTab(activeTab: string): void {
    this.profileMenuTarget.style.removeProperty("display");
    this.menuItemTargets.forEach((element) => {
      element.dataset.link === activeTab
        ? element.classList.add("active")
        : element.classList.remove("active");
    });
    this.profileTabTargets.forEach((element) => {
      element.style.display =
        element.dataset.tab === activeTab ? "block" : "none";
    });
  }

  openMenu(): void {
    if (document.body.clientWidth < 650) {
      this.profileMenuTarget.style.display = "block";
      this.profileTabTargets.forEach((element) => {
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
