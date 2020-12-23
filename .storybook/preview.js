import {
  addParameters,
  setCustomElements,
} from "@web/storybook-prebuilt/web-components.js";

addParameters({
  docs: {
    iframeHeight: "200px",
  },
});

async function run() {
  const customElements = await (
    await fetch(new URL("../custom-elements.json", import.meta.url))
  ).json();

  setCustomElements(customElements);
}

run();
