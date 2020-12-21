import { html, fixture, expect } from "@open-wc/testing";

import VeueExample from "../src/VeueExample";
import "../index";

describe("VeueExample", () => {
  it('has a default title "Hey there" and counter 1', async () => {
    const el: VeueExample = await fixture(
      html` <veue-example></veue-example> `
    );

    expect(el.title).to.equal("Hey there");
    expect(el.counter).to.equal(0);
  });

  it("increases the counter on button click", async () => {
    const el: VeueExample = await fixture(
      html` <veue-example></veue-example> `
    );
    el.shadowRoot!.querySelector("button")!.click();

    expect(el.counter).to.equal(1);
  });

  it("can override the title via attribute", async () => {
    const el: VeueExample = await fixture(html`
      <veue-example title="attribute title"></veue-example>
    `);

    expect(el.title).to.equal("attribute title");
  });

  it("passes the a11y audit", async () => {
    const el: VeueExample = await fixture(
      html` <veue-example></veue-example> `
    );

    expect(el).shadowDom.to.be.accessible();
  });
});
