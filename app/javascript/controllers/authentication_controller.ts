import BaseController from "./base_controller";

export default class extends BaseController {
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
  private userSignedIn: boolean;
  private videoId: number;

  connect(): void {
    this.videoId = parseInt(this.data.get("videoId"));
  }

  async getHtmlContent(event: Event): Promise<void> {
    const eventTarget = event.target as HTMLElement;
    this.target = eventTarget.dataset.authTarget;
    const url =
      this.target === "login" ? "/users/sign_in.js" : "/users/sign_up.js";
    const response = await fetch(url);
    this.createModal(response, this.target);
  }

  createModal(response: Response, target: string): void {
    this.modalLabelTarget.innerHTML =
      target === "login" ? "Sign in to Veue" : "Create Account Veue";
    document.body.style.overflowY = "hidden";

    this.modalTarget.style.display = "block";
    this.modalContentTarget.classList.add(`${target}-modal`);
    response.text().then((text) => (this.formAreaTarget.innerHTML = text));
  }

  hideModal(event: Event): void {
    if (event.target === this.modalTarget) {
      event.preventDefault();
      this.modalTarget.style.display = "none";
      document.body.style.overflowY = "auto";
      this.errorAreaTarget.innerHTML = "";
      this.modalContentTarget.classList.remove(`${this.target}-modal`);
    }
  }

  formResponse(event: CustomEvent): void {
    const response = event.detail;
    console.log("response", response[0].includes("error-messages"));
    document.body.style.overflowY = "auto";
    if (response[0].includes("error-messages")) {
      this.errorAreaTarget.innerHTML = response[0];
    } else {
      this.appendResponse(response[0], true);
    }
  }

  signoutUserHandler(event: CustomEvent): void {
    const response = event.detail;
    this.appendResponse(response[0], false);
  }

  appendResponse(response: Response, userSignedIn: boolean): void {
    response.text().then((text) => {
      this.listAreaTarget.innerHTML = text;
      this.userSignedIn = userSignedIn;
      this.emitAuthChange();
    });
  }
}
