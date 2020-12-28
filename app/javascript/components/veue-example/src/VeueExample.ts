import { html, css, LitElement, customElement } from "lit-element";

@customElement("veue-example")
export default class VeueExample extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--my-element-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
    };
  }

  constructor() {
    super();
    this.title = "Hey there";
    this.counter = 0;
  }

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <p><slot></slot></p>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
