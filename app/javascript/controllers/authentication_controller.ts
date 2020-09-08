import { Controller } from "stimulus";
import Rails from "@rails/ujs";

import AuthObserver from "../shared/helpers/authObserver";

export default class extends Controller {
  static targets = [
    "listArea",
    "modal",
    "modalContent",
    "modalLabel",
    "formArea",
  ];

  readonly listAreaTarget!: HTMLElement;
  readonly modalTarget!: HTMLElement;
  readonly modalContentTarget!: HTMLElement;
  readonly modalLabelTarget!: HTMLElement;
  readonly formAreaTarget!: HTMLElement;
  // boolean members for checking if targets present?
  readonly hasModalTarget: boolean;
  readonly hasModalLabelTarget: boolean;

  private target: string;
  private authObj: AuthObserver;
  private userSignedIn: boolean;

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
    this.userSignedIn = true;
    this.authObj = new AuthObserver(this.listAreaTarget, this.userSignedIn);
    this.authObj.dispatchAuth();
  }

  signoutUserHandler(event) {
    const response = event.detail;
    this.listAreaTarget.innerHTML = response[0];
    this.userSignedIn = false;
    this.authObj = new AuthObserver(this.listAreaTarget, this.userSignedIn);
    this.authObj.dispatchAuth();
  }
}
