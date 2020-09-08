export default class AuthObserver {
  constructor(el, userLoggedIn) {
    this.authEvent = new CustomEvent("auth", {
      detail: { userLoggedIn },
    });
    document.addEventListener("auth", this.authListner);
  }

  authListner(event) {
    // console.log('event:', event.detail);
  }

  dispatchAuth() {
    document.dispatchEvent(this.authEvent);
  }
}
