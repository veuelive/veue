import MediaAccess from "helpers/media_access";
import { Steps, toggleNextStep } from "helpers/broadcast_helpers";
import { Controller } from "stimulus";

export default class extends Controller {
  element!: HTMLElement;

  static targets = ["microphoneAccess", "videoAccess"];

  private microphoneAccessTarget!: HTMLElement;
  private videoAccessTarget!: HTMLElement;

  connect(): void {
    this.runChecks();
  }

  requestAccess(): void {
    MediaAccess.requestAccess().then((mediaStream) => {
      // We can let go of the media stream
      mediaStream.getTracks().forEach((track) => track.stop());
      this.runChecks();
    });
  }

  private async runChecks() {
    let nextStep = "done" as Steps;

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
      if (access.hasMicrophone && access.hasVideo) {
        nextStep = "redirect";
      }
    });

    toggleNextStep(nextStep);
  }
}
