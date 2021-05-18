import { Controller } from "stimulus";

export default class extends Controller {
  connect(): void {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.element.tagName == "SELECT") {
      const select = this.element as HTMLSelectElement;
      select.value = timezone;
    }
  }
}
