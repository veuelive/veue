import { html, css, LitElement, property } from "lit-element";

@customElement("veue-select")
export default class VeueSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--veue-select-text-color, #000);
    }
  `;

  @property({ type: String }) title = "Hey there";

  @property({ type: Number }) counter = 5;

  __increment(): void {
    this.counter += 1;
  }

  render(): void {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
