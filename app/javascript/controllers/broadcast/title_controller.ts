import { Controller } from "stimulus";
import { secureFormFetch } from "util/fetch";

export default class extends Controller {
  async doSubmit(event): Promise<void> {
    event.preventDefault();
    const form = event.target.closest("form");
    secureFormFetch(form.dataset.url, form.dataset.method, form);
  }
}
