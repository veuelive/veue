import { isDev } from "util/environment";

export default class EventBus {
  static prefix = "event-bus--";

  static dispatch(name: string, payload: unknown): void {
    // if (isDev()) {
    console.log("EventBus: ", name, payload);
    // }
    document.dispatchEvent(
      new CustomEvent(EventBus.prefix + name, { detail: payload })
    );
  }

  static subscribe<P>(name: string, callback: (payload: P) => void): void {
    document.addEventListener(EventBus.prefix + name, (event: CustomEvent) => {
      callback(event.detail);
    });
  }

  static unsubscribe(name: string, callback: (payload: unknown) => void): void {
    document.removeEventListener(EventBus.prefix + name, callback);
  }
}
