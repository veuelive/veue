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
    "loginButton",
    "signupButton",
    "signoutButton",
  ];

  readonly loginButtonTarget!: HTMLAnchorElement;
  readonly signupButtonTarget!: HTMLAnchorElement;
  readonly signoutButtonTarget!: HTMLAnchorElement;
  readonly listAreaTarget!: HTMLElement;
  readonly modalTarget!: HTMLElement;
  readonly modalContentTarget!: HTMLElement;
  readonly modalLabelTarget!: HTMLElement;
  readonly formAreaTarget!: HTMLElement;
  readonly formTarget: HTMLFormElement;
  // boolean members for checking if targets present?
  readonly hasModalTarget: boolean;
  readonly hasFormTarget: boolean;
  readonly hasLoginButtonTarget: boolean;
  readonly hasSignupButtonTarget: boolean;
  readonly hasSignoutButtonTarget: boolean;
  readonly hasModalLabelTarget: boolean;

  private target: string;

  connect() {
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    if (this.hasModalTarget) {
      this.modalTarget.addEventListener("click", (event) =>
        this.hideModal(event)
      );
    }
    if (this.hasLoginButtonTarget) {
      this.loginButtonTarget.addEventListener("click", (event) =>
        this.getHtmlContent(event, "login")
      );
    }
    if (this.hasSignupButtonTarget) {
      this.signupButtonTarget.addEventListener("click", (event) =>
        this.getHtmlContent(event, "signup")
      );
    }
    if (this.hasSignoutButtonTarget) {
      this.signoutButtonTarget.addEventListener("ajax:success", (event) =>
        this.signoutUserHandler(event)
      );
    }
  }

  async getHtmlContent(event, target) {
    this.target = target;
    const url = target === "login" ? "/users/sign_in.js" : "/users/sign_up.js";
    const res = await Rails.ajax({
      type: "get",
      url,
      success: (response) => this.createModal(response, target),
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
    if (this.hasSignoutButtonTarget) {
      this.signoutButtonTarget.addEventListener("ajax:success", (event) =>
        this.signoutUserHandler(event)
      );
    }
  }

  signoutUserHandler(event) {
    const response = event.detail;
    this.listAreaTarget.innerHTML = response[0];
    this.registerEventHandlers();
  }
}
