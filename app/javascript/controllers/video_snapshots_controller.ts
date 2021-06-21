import { Controller } from "stimulus";
import { putForm } from "util/fetch";

export default class extends Controller {
  declare element: HTMLFormElement;

  async submitForm(event: MouseEvent | KeyboardEvent): Promise<void> {
    if ("key" in event && event.key != "enter") {
      return;
    }

    event.preventDefault();

    const dataObj = {};
    const formData = new FormData(this.element);
    formData.forEach((v, k) => (dataObj[k] = v));

    // This differentiates primary from secondary
    const commitValue = (event.target as HTMLButtonElement).value;
    dataObj["commit"] = commitValue;

    try {
      const response = await putForm(this.element.action, dataObj);

      if (response.ok) {
        const html = await response.text();
        document.querySelector("#main-container").innerHTML = html;
        return;
      }
      console.warn(response);
    } catch (err) {
      console.warn(err);
    }
  }
}
