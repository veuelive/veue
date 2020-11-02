import { Controller } from "stimulus";
import MediaAccess from "helpers/media_access";
import BaseController from "controllers/base_controller";

type Steps = "done" | "login" | "media";

export default class extends BaseController {
  static targets = ["microphoneAccess", "videoAccess", "loggedInStep"];
  private microphoneAccessTarget!: HTMLElement;
  private videoAccessTarget!: HTMLElement;
  private loggedInStepTarget!: HTMLElement;

  connect(): void {
    this.runChecks();
    this.subscribeToAuthChange();
  }

  requestAccess(): void {
    MediaAccess.requestAccess().then((mediaStream) => {
      // We can let go of the media stream
      mediaStream.getTracks().forEach((track) => track.stop());
      this.runChecks();
    });
  }

  authChanged(): void {
    this.endSetup();
  }

  private async runChecks() {
    let nextStep = "done" as Steps;
    if (document.querySelector("*[data-user-id]")) {
      this.loggedInStepTarget.dataset["status"] = "done";
    } else {
      this.loggedInStepTarget.dataset["status"] = "pending";
      nextStep = "login";
    }
    await MediaAccess.checkAccess().then((access) => {
      if (access.hasMicrophone) {
        this.microphoneAccessTarget.dataset["status"] = "done";
      } else {
        this.microphoneAccessTarget.dataset["status"] = "pending";
        nextStep = "media";
      }
      if (access.hasVideo) {
        this.videoAccessTarget.dataset["status"] = "done";
      } else {
        this.videoAccessTarget.dataset["status"] = "pending";
        nextStep = "media";
      }
    });
    this.doNextStep(nextStep);
  }

  private doNextStep(nextStep: Steps) {
    console.log(nextStep);
    if (nextStep === "done") {
      this.endSetup();
      return;
    }
    document
      .querySelectorAll("*[data-text-state]")
      .forEach((e) => (e["style"] = "display: none;"));
    document
      .querySelectorAll(`*[data-text-state='${nextStep}']`)
      .forEach((e) => (e["style"] = "display: block;"));

    // We start in a hidden state, and only by this point do we know if we should display at all...
    this.element["style"] = "display: flex;";
  }

  private endSetup() {
    window.location.pathname = "/broadcasts";
  }
}
