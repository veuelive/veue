import { html, fixture, expect } from "@open-wc/testing";

import VeueSelect from "../src/VeueSelect.js";
import "../veue-select.js";

describe("VeueSelect", () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: VeueSelect = await fixture(html` <veue-select></veue-select> `);

    expect(el.title).to.equal("Hey there");
    expect(el.counter).to.equal(5);
  });

  it("increases the counter on button click", async () => {
    const el: VeueSelect = await fixture(html` <veue-select></veue-select> `);
    el.shadowRoot!.querySelector("button")!.click();

    expect(el.counter).to.equal(6);
  });

  it("can override the title via attribute", async () => {
    const el: VeueSelect = await fixture(html`
      <veue-select title="attribute title"></veue-select>
    `);

    expect(el.title).to.equal("attribute title");
  });

  it("passes the a11y audit", async () => {
    const el: VeueSelect = await fixture(html` <veue-select></veue-select> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
