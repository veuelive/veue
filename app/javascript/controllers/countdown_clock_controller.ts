import BaseController from "controllers/base_controller";

export default class CountdownClockController extends BaseController {
  private startClock!: BigInteger;

  connect(): void {
    this.startClock = Date.now();
    setTimeout(this.updateClock.bind(this), 1000); // update about every second
  }

  updateClock(): void {
    const delta = Date.now() - this.startClock; // milliseconds elapsed since start
    const secs_passed = Math.floor(delta / 1000);
    const countdown = 10 - secs_passed;
    this.element.innerText = "00:" + ("00" + Number(countdown)).slice(-2);
    if (countdown <= 0) {
      window.location = "/";
    } else {
      setTimeout(this.updateClock.bind(this), 1000); //  every second
    }
  }
}
