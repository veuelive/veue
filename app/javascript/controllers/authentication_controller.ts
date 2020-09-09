import { Controller } from "stimulus";
import Rails from "@rails/ujs";

import AuthObserver from "../shared/helpers/authObserver";

export default class extends Controller {
  static targets = [
    "listArea",
    "modal",
    "modalContent",
    "modalLabel",
    "errorArea",
    "formArea",
  ];

  readonly listAreaTarget!: HTMLElement;
  readonly modalTarget!: HTMLElement;
  readonly modalContentTarget!: HTMLElement;
  readonly modalLabelTarget!: HTMLElement;
  readonly formAreaTarget!: HTMLElement;
  readonly errorAreaTarget!: HTMLElement;
  // boolean members for checking if targets present?
  readonly hasModalTarget: boolean;
  readonly hasModalLabelTarget: boolean;
  readonly hasErrorAreaTarget: boolean;

  private target: string;
  private authObj: AuthObserver;
  private userSignedIn: boolean;
  private videoId: number;

  connect() {
    this.videoId = parseInt(this.data.get("videoId"));
  }

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
      this.errorAreaTarget.innerHTML = "";
      this.modalContentTarget.classList.remove(`${this.target}-modal`);
    }
  }

  formResponse(event) {
    const response = event.detail;
    console.log("response", response[0].includes("error-messages"));
    document.body.style.overflowY = "auto";
    if (response[0].includes("error-messages")) {
      this.errorAreaTarget.innerHTML = response[0];
    } else {
      this.appendResponse(response[0], true);
    }
  }

  signoutUserHandler(event) {
    const response = event.detail;
    this.appendResponse(response[0], false);
  }

  appendResponse(response, userSignedIn) {
    this.listAreaTarget.innerHTML = response;
    this.userSignedIn = userSignedIn;
    if (this.videoId) {
      this.authObj = new AuthObserver(
        this.listAreaTarget,
        this.userSignedIn,
        this.videoId
      );
      this.authObj.dispatchAuth();
    }
  }
}
