import { Controller } from "stimulus";

export default class extends Controller {
  private authChangeListener = () => this.authChanged();

  subscribeToAuthChange(): void {
    document.addEventListener("veue-auth", this.authChangeListener);
  }

  unsubscribeFromAll(): void {
    if (this.authChangeListener) {
      document.removeEventListener("veue-auth", this.authChangeListener);
    }
  }

  emitAuthChange(): void {
    document.dispatchEvent(new Event("veue-auth"));
  }

  // userId is null when we are NOT logged in anymore
  authChanged(): void {
    console.warn(
      `You are subscribed to auth change, and need to implement authChange().`
    );
  }
}
