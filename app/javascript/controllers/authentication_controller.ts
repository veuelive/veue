import { Controller } from "stimulus";
import Rails from "@rails/ujs";

export default class extends Controller {
  static targets = [
    "listArea",
    "modal",
    "modalContent",
    "modalLabel",
    "formArea",
    "form",
  ];

  readonly listAreaTarget!: HTMLElement;
  readonly modalTarget!: HTMLElement;
  readonly modalContentTarget!: HTMLElement;
  readonly modalLabelTarget!: HTMLElement;
  readonly formAreaTarget!: HTMLElement;
  readonly formTarget: HTMLFormElement;
  // boolean members for checking if targets present?
  readonly hasModalTarget: boolean;
  readonly hasFormTarget: boolean;
  readonly hasModalLabelTarget: boolean;

  private target: string;

  async getHtmlContent(event) {
    this.target = event.target.dataset.authTarget;
    const url =
      this.target === "login" ? "/users/sign_in.js" : "/users/sign_up.js";
    const res = await Rails.ajax({
      type: "get",
      url,
      success: (response) => this.createModal(response, this.target),
    });
  }

  createModal(response, target) {
    this.modalLabelTarget.innerHTML =
      target === "login" ? "Sign in to Veue" : "Create Account Veue";
    document.body.style.overflowY = "hidden";

    this.modalTarget.style.display = "block";
    this.modalContentTarget.classList.add(`${target}-modal`);
    this.formAreaTarget.innerHTML = response;
    if (this.hasFormTarget) {
      this.formTarget.addEventListener("ajax:success", (event) =>
        this.formResponse(event)
      );
    }
  }

  hideModal(event) {
    if (event.target === this.modalTarget) {
      event.preventDefault();
      this.modalTarget.style.display = "none";
      document.body.style.overflowY = "auto";
      this.modalContentTarget.classList.remove(`${this.target}-modal`);
    }
  }

  formResponse(event) {
    const response = event.detail;
    document.body.style.overflowY = "auto";
    this.listAreaTarget.innerHTML = response[0];
  }

  signoutUserHandler(event) {
    const response = event.detail;
    this.listAreaTarget.innerHTML = response[0];
  }
}
