import { Controller } from "stimulus";
import { postJson } from "util/fetch";

export const MediaDeviceChangeEvent = "MediaDeviceChangeEvent";

/**
 * We don't want any pending or live videos to accidentally get cancelled... so
 * we fall back to having the broadcaster send a ping every 60 seconds
 */
export default class extends Controller {
  timeoutPid: number;

  connect(): void {
    this.pingServer();
    this.timeoutPid = window.setInterval(() => this.pingServer(), 60_000);
  }

  disconnect(): void {
    window.clearInterval(this.timeoutPid);
  }

  pingServer(): void {
    postJson("./keepalive", {}).then(async (data) => {
      const payload = await data.json();
      if (payload?.state === "cancelled") {
        window.location.assign("/broadcasts");
      }
    });
  }
}
