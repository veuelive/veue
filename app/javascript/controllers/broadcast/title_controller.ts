import { Controller } from "stimulus";
import { secureFormFetch } from "util/fetch";

export default class extends Controller {
  doSubmit(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const form = target.closest("form");
    const formData = new FormData(form);
    secureFormFetch(form.action, form.method, formData);
  }
}
