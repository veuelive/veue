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
    const loginHtml = this.logedInUserView(response[0].user);

    document.body.style.overflowY = "auto";
    this.listAreaTarget.innerHTML = loginHtml;
    if (this.hasSignoutButtonTarget) {
      this.signoutButtonTarget.addEventListener("ajax:success", (event) =>
        this.signoutUserHandler(event)
      );
    }
  }

  signoutUserHandler(event) {
    const logoutHtml = this.loggedOutUserView();
    this.listAreaTarget.innerHTML = logoutHtml;
    this.registerEventHandlers();
  }

  logedInUserView(user) {
    return `
      <ul>
        <li>
          <img class="status-user__profile" alt="profile" src="/assets/avatar-placeholder.png">
        </li>
        <li>
          <p class="status-user__text">
            ${user.username}
          </p>
        </li>
        <li>
          <img class="status-user__arrow" alt="Arrow" src="/assets/down-arrow.png">
        </li>
      </ul>
      <div class="status-dropdown">
        <ul>
          <li>
            <a class="list-item" data-target="authentication.signoutButton" data-type="json" data-remote="true" rel="nofollow" data-method="delete" href="/users/sign_out">
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    `;
  }

  loggedOutUserView() {
    return `
      <ul>
        <li>
          <a href="javascript:void(0);" class="list-item" data-target="authentication.loginButton" }>
            Login
          </a>
        </li>
        <li>
          <a href="javascript:void(0);" class="list-item" data-target="authentication.signupButton">
            Signup
          </a>
        </li>
      </ul>
      <div class="modal" id="auth-modal" data-target="authentication.modal">
        <div class="modal-content" data-target="authentication.modalContent">
          <div class="modal-label" data-target="authentication.modalLabel"></div>
          <div class="form-area" data-target="authentication.formArea"></div>
        </div>
      </div>
    `;
  }
}
