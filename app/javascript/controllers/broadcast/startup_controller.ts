import MediaAccess from "helpers/media_access";
import BaseController from "controllers/base_controller";

type Steps = "login" | "redirect" | "media" | "done";

export default class extends BaseController {
  static targets = [
    "microphoneAccess",
    "videoAccess",
    "loggedInStep",
    "userInstructionsModal",
    "browserWarning",
    "step",
  ];

  private microphoneAccessTarget!: HTMLElement;
  private videoAccessTarget!: HTMLElement;
  private loggedInStepTarget!: HTMLElement;
  private userInstructionsModalTarget!: HTMLElement;
  private stepTargets!: HTMLElement[];
  private browserWarningTarget!: HTMLElement;

  private nextStep = "done" as Steps;

  connect(): void {
    this.checkBrowser();
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
    this.reloadView();
  }

  hideModal(event: Event): void {
    // This might be a click from any of the children of the modal
    // and we want to only hit the full page direct modal area
    const target = event.target as HTMLElement;
    if (target?.className === "modal-skirt") {
      this.userInstructionsModalTarget.style.display = "none";
    }
  }

  openBroadcastWindow(event: Event): void {
    const btnElement = event.target as HTMLElement;
    const broadcastUrl = btnElement.dataset.url;
    window.open(broadcastUrl, "Veue Broadcast", `height=600, width=1000`);
  }

  private checkBrowser(): void {
    if (
      navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(iOS)/i
      )
    ) {
      window.location.pathname = "/broadcasts/no_mobile";
    }
    const isChrome = /Chrome/.test(navigator.userAgent);
    this.browserWarningTarget.style.display = isChrome ? "none" : "block";
  }

  private async runChecks() {
    if (document.querySelector("*[data-user-id]")) {
      this.loggedInStepTarget.dataset["status"] = "done";
    } else {
      this.loggedInStepTarget.dataset["status"] = "pending";
      this.nextStep = "login";
    }
    await this.checkMediaAccess();
    this.doNextStep(this.nextStep);
  }

  private async checkMediaAccess(): Promise<void> {
    await MediaAccess.checkAccess().then((access) => {
      if (access.hasMicrophone) {
        this.microphoneAccessTarget.dataset["status"] = "done";
      } else {
        this.microphoneAccessTarget.dataset["status"] = "pending";
        this.nextStep = "media";
      }
      if (access.hasVideo) {
        this.videoAccessTarget.dataset["status"] = "done";
      } else {
        this.videoAccessTarget.dataset["status"] = "pending";
        this.nextStep = "media";
      }
      if (
        access.hasMicrophone &&
        access.hasVideo &&
        this.nextStep !== "login"
      ) {
        this.nextStep = "redirect";
      }
    });
  }

  private doNextStep(nextStep: Steps) {
    this.toggleNextStep(this.nextStep);

    // We start in a hidden state, and only by this point do we know if we should display at all...
    this.element.style.display = "block";
  }

  private reloadView(): void {
    window.location.pathname = "/broadcasts";
  }

  private toggleNextStep(nextStep: Steps): void {
    this.stepTargets.forEach((e: HTMLElement) => (e.style.display = "none"));
    this.stepTargets.forEach((e: HTMLElement) => {
      if (e.dataset.startupStep === nextStep) e.style.display = "block";
    });
  }
}
